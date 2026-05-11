import {
  StyleSheet,
  View,
  Alert,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  Platform,
  SafeAreaView,
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';
import ExitApp from 'react-native-exit-app';
import {
  ActionSheetProvider,
  useActionSheet,
} from '@expo/react-native-action-sheet';
import PaymentService from './api/PaymentService';
import SessionCreator from './util/SessionCreator';
import CardCreator from './util/CardCreator';
import type { PaymentResult } from '../../src/types/PaymentResult';
import { useEffect, useState } from 'react';

import PaymentConsentCreator from './util/PaymentConsentCreator';

type Environment = 'staging' | 'demo' | 'preview';
type PaymentMode = 'oneOff' | 'recurring' | 'recurringAndPayment';

const ENV_STORAGE_KEY = 'selected_environment';
const DEFAULT_ENV: Environment = 'demo';

const ENV_OPTIONS: { label: string; value: Environment }[] = [
  { label: 'Demo', value: 'demo' },
  { label: 'Staging', value: 'staging' },
  { label: 'Preview', value: 'preview' },
];

const PAYMENT_MODE_OPTIONS: { label: string; value: PaymentMode }[] = [
  { label: 'One Off', value: 'oneOff' },
  { label: 'Recurring', value: 'recurring' },
  { label: 'Recurring and Payment', value: 'recurringAndPayment' },
];

export default function App() {
  return (
    <ActionSheetProvider>
      <Main />
    </ActionSheetProvider>
  );
}

function Main() {
  const { showActionSheetWithOptions } = useActionSheet();
  const [loading, setLoading] = useState(false);
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('oneOff');
  const [environment, setEnvironment] = useState<Environment>(DEFAULT_ENV);
  const [paymentService, setPaymentService] = useState(
    new PaymentService(DEFAULT_ENV, '', '')
  );
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ENV_STORAGE_KEY).then((stored) => {
      const env = ENV_OPTIONS.some((o) => o.value === stored)
        ? (stored as Environment)
        : DEFAULT_ENV;
      setEnvironment(env);
      setPaymentService(new PaymentService(env, '', ''));
      initialize(env, true, false);
      console.log('SDK initialized with environment:', env);
      setSdkReady(true);
    });
  }, []);

  const handleEnvironmentChange = async (newEnv: Environment) => {
    if (newEnv === environment) return;
    await AsyncStorage.setItem(ENV_STORAGE_KEY, newEnv);
    Alert.alert(
      'Restart Required',
      'The app needs to restart for the new environment to take effect.',
      [
        {
          text: 'OK',
          onPress: () =>
            Platform.OS === 'ios' ? ExitApp.exitApp() : RNRestart.restart(),
        },
      ],
      { cancelable: false }
    );
  };

  const showEnvironmentSheet = () => {
    const labels = [...ENV_OPTIONS.map((o) => o.label), 'Cancel'];
    showActionSheetWithOptions(
      {
        title: 'Select Environment',
        options: labels,
        cancelButtonIndex: labels.length - 1,
      },
      (selectedIndex) => {
        if (selectedIndex == null || selectedIndex === labels.length - 1)
          return;
        handleEnvironmentChange(ENV_OPTIONS[selectedIndex]!.value);
      }
    );
  };

  const showPaymentModeSheet = () => {
    const labels = [...PAYMENT_MODE_OPTIONS.map((o) => o.label), 'Cancel'];
    showActionSheetWithOptions(
      {
        title: 'Payment Mode',
        options: labels,
        cancelButtonIndex: labels.length - 1,
      },
      (selectedIndex) => {
        if (selectedIndex == null || selectedIndex === labels.length - 1)
          return;
        setPaymentMode(PAYMENT_MODE_OPTIONS[selectedIndex]!.value);
      }
    );
  };

  const paymentModeLabel =
    PAYMENT_MODE_OPTIONS.find((o) => o.value === paymentMode)?.label ??
    'Payment Mode';

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

  if (!sdkReady) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.topBar}>
        <TouchableOpacity
          style={styles.environmentPicker}
          onPress={showEnvironmentSheet}
        >
          <Text style={styles.environmentPickerText}>{environment}</Text>
        </TouchableOpacity>
      </SafeAreaView>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loading}
        />
      )}
      <TouchableOpacity style={styles.picker} onPress={showPaymentModeSheet}>
        <Text style={styles.pickerText}>{paymentModeLabel}</Text>
      </TouchableOpacity>

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
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    backgroundColor: 'white',
    width: 100,
    alignItems: 'center',
  },
  environmentPickerText: {
    fontSize: 14,
    color: 'black',
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
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    width: '80%',
    alignSelf: 'center',
    marginBottom: 20,
    alignItems: 'center',
  },
  pickerText: {
    fontSize: 16,
    color: 'black',
  },
});
