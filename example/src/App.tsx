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
  presentCardPaymentFlow,
  presentPaymentFlow,
  startGooglePay,
} from 'airwallex-payment-react-native';
import PaymentService from './api/PaymentService';
import SessionCreator from './util/SessionCreator';
import CardCreator from './util/CardCreator';
import type { PaymentResult } from '../../src/types/PaymentResult';
import { useEffect, useState } from 'react';

export default function App() {
  const [loading, setLoading] = useState(false);
  const environment = 'demo';
  const apiUrl = 'https://demo-pacheckoutdemo.airwallex.com';
  const paymentService = new PaymentService(apiUrl, '', '');

  useEffect(() => {
    const initSdk = async () => {
      try {
        await initialize(environment, true, false);
        console.log('SDK initialized successfully');
      } catch (error) {
        console.error('Error initializing SDK:', error);
        Alert.alert('Error', 'Failed to initialize SDK.');
      }
    };

    initSdk();
  }, []);

  async function fetchSession(requireCustomerId: boolean = false) {
    setLoading(true);
    try {
      const session = await SessionCreator.createOneOffSession(
        paymentService,
        requireCustomerId
      );
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

  const handleResult = (result: PaymentResult) => {
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
      fun(session.clientSecret ?? '', session)
        .then(handleResult)
        .catch((error) => Alert.alert('Payment failed', error.message));
    } else {
      Alert.alert('Error', 'Session could not be created.');
    }
  };

  const handlePayWithCardDetails = async () => {
    let session = await fetchSession(true);
    if (session) {
      payWithCardDetails(
        session.clientSecret ?? '',
        session,
        CardCreator.createCard(environment),
        false
      )
        .then(handleResult)
        .catch((error) => Alert.alert('Payment failed', error.message));
    } else {
      Alert.alert('Error', 'Session could not be created.');
    }
  };

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator
          size="large"
          color="#007BFF"
          style={styles.loading}
        />
      )}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          handlePaymentFlowPress(presentPaymentFlow);
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
      {Platform.OS === 'android' && (
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            handlePaymentFlowPress(startGooglePay);
          }}
        >
          <Text style={styles.buttonText}>startGooglePay</Text>
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
});
