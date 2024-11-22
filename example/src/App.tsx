import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
} from 'react-native';
import {
  initialize,
  payWithCardDetails,
  payWithConsent,
  presentCardPaymentFlow,
  presentEntirePaymentFlow,
  startApplePay,
  startGooglePay,
  type PaymentSession,
} from 'airwallex-payment-react-native';
import PaymentService from './api/PaymentService';
import SessionCreator from './util/SessionCreator';
import CardCreator from './util/CardCreator';
import type { PaymentResult } from '../../src/types/PaymentResult';
import { useEffect, useState } from 'react';
import RNPickerSelect from 'react-native-picker-select';
import PaymentConsentCreator from './util/PaymentConsentCreator';

type Environment = 'staging' | 'demo';

export default function App() {
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState('oneOff');
  const [environment, setEnvironment] = useState<Environment>('demo');
  const [paymentService, setPaymentService] = useState(
    new PaymentService(environment, '', '')
  );

  useEffect(() => {
    setPaymentService(new PaymentService(environment, '', ''));
    const initializeSdk = async (env: Environment) => {
      try {
        await initialize(env, true, false);
        console.log('SDK initialized successfully');
      } catch (error) {
        console.error('Error initializing SDK:', error);
        Alert.alert('Error', 'Failed to initialize SDK.');
      }
    };
    initializeSdk(environment);
  }, [environment]);

  async function fetchSession(requireCustomerId = false) {
    setLoading(true);
    try {
      let session;
      switch (paymentMode) {
        case 'oneOff':
          session = await SessionCreator.createOneOffSession(
            paymentService,
            requireCustomerId
          );
          break;
        case 'recurring':
          session = await SessionCreator.createRecurringSession(paymentService);
          break;
        case 'recurringAndPayment':
          session =
            await SessionCreator.createRecurringWithIntentSession(
              paymentService
            );
          break;
        default:
          throw new Error('Unknown payment mode');
      }

      console.log('Payment Session:', session);
      return session;
    } catch (error) {
      console.error('Error creating payment session:', error);
      Alert.alert('Error', 'Failed to create payment session.');
      return null;
    } finally {
      setLoading(false);
    }
  }

  const handlePaymentResult = (result: PaymentResult) => {
    switch (result.status) {
      case 'success':
        let message = 'Your payment has been charged';
        if (result.paymentConsentId) {
          message += ` with payment consent ID ${result.paymentConsentId}`;
        }
        Alert.alert('Payment success', message);
        break;
      case 'inProgress':
        console.log('Payment in progress');
        break;
      case 'cancelled':
        Alert.alert('Payment cancelled', 'Your payment has been cancelled');
        break;
      default:
        Alert.alert('Payment failed', 'An unknown error occurred');
        break;
    }
  };

  const handlePaymentFlowPress = async (
    fun: (...args: any[]) => Promise<PaymentResult>
  ) => {
    let session = await fetchSession();
    if (session) {
      fun(session)
        .then(handlePaymentResult)
        .catch((error) => Alert.alert('Payment failed', error.message));
    } else {
      Alert.alert('Error', 'Session could not be created.');
    }
  };

  const handlePayWithCardDetails = async () => {
    const saveCard = true;
    await nativePayWithCardDetails(saveCard, async (_, result) => {
      handlePaymentResult(result);
    });
  };

  const handlePayWithSavedCard = async () => {
    const saveCard = true;
    await nativePayWithCardDetails(saveCard, async (session, _) => {
      const paymentConsent = await PaymentConsentCreator.getPaymentConsents(
        paymentService,
        session.customerId ?? ''
      );
      setLoading(true);
      const newSession = await fetchSession();
      if (newSession && paymentConsent) {
        await payWithConsent(newSession, paymentConsent)
          .then(handlePaymentResult)
          .catch((error) => Alert.alert('Payment failed', error.message));
      } else {
        Alert.alert('Error', 'paymentConsent or session could not be created.');
      }
    });
  };

  const nativePayWithCardDetails = async (
    saveCard: boolean,
    handleResult: (
      session: PaymentSession,
      result: PaymentResult
    ) => Promise<void>
  ) => {
    try {
      const session = await fetchSession(saveCard);
      if (session) {
        const result: PaymentResult = await payWithCardDetails(
          session,
          CardCreator.createCard(environment),
          saveCard
        );
        await handleResult(session, result);
      } else {
        Alert.alert('Error', 'Session could not be created.');
      }
    } catch (error) {
      Alert.alert('Payment failed', (error as Error).message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <RNPickerSelect
          onValueChange={setEnvironment}
          items={[
            { label: 'Demo', value: 'demo' },
            { label: 'Staging', value: 'staging' },
          ]}
          value={environment}
          placeholder={{}}
          style={{
            inputIOS: styles.environmentPicker,
            inputAndroid: styles.environmentPicker,
          }}
        />
      </View>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loading}
        />
      )}
      <RNPickerSelect
        onValueChange={(value) => setPaymentMode(value)}
        items={[
          { label: 'One Off', value: 'oneOff' },
          { label: 'Recurring', value: 'recurring' },
          { label: 'Recurring and Payment', value: 'recurringAndPayment' },
        ]}
        value={paymentMode}
        placeholder={{
          label: 'Payment Mode',
          value: null,
          color: '#007BFF',
        }}
        style={{
          inputIOS: styles.picker,
          inputAndroid: styles.picker,
        }}
      />

      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handlePaymentFlowPress(presentEntirePaymentFlow);
        }}
      >
        <Text style={styles.buttonText}>PresentEntirePaymentFlow</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handlePaymentFlowPress(presentCardPaymentFlow);
        }}
      >
        <Text style={styles.buttonText}>PresentCardPaymentFlow</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={handlePayWithCardDetails}
      >
        <Text style={styles.buttonText}>payWithCardDetails</Text>
      </TouchableOpacity>
      {paymentMode === 'oneOff' && (
        <TouchableOpacity
          style={styles.button}
          onPress={handlePayWithSavedCard}
        >
          <Text style={styles.buttonText}>payWithSavedCard</Text>
        </TouchableOpacity>
      )}
      {Platform.OS === 'android' && paymentMode === 'oneOff' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handlePaymentFlowPress(startGooglePay);
          }}
        >
          <Text style={styles.buttonText}>startGooglePay</Text>
        </TouchableOpacity>
      )}
      {Platform.OS === 'ios' && paymentMode === 'oneOff' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handlePaymentFlowPress(startApplePay);
          }}
        >
          <Text style={styles.buttonText}>startApplePay</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
  },
  topBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    margin: 10,
    zIndex: 10,
  },
  environmentPicker: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    color: 'black',
    width: 150,
  },
  button: {
    marginVertical: 10,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  loading: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -25 }, { translateY: -25 }],
  },
  picker: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    color: 'black',
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
  },
});
