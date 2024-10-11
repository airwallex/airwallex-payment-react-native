import { Button, StyleSheet, View, Alert } from 'react-native';
import { presentPaymentFlow } from 'airwallex-payment-react-native';
import PaymentService from './api/PaymentService';
import SessionCreator from './util/SessionCreator';

export default function App() {
  const apiUrl = 'https://demo-pacheckoutdemo.airwallex.com';
  const paymentService = new PaymentService(apiUrl, '', '');

  async function fetchSession() {
    try {
      const session = await SessionCreator.createOneOffSession(paymentService);
      console.log('Payment Session:', session);
      return session;
    } catch (error) {
      console.error('Error creating payment session:', error);
      Alert.alert('Error', 'Failed to create payment session.');
      return null;
    }
  }

  const handlePress = async () => {
    let session = await fetchSession();
    if (session) {
      presentPaymentFlow(session.clientSecret ?? '', session, 'demo')
        .then((result) => {
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
              Alert.alert(
                'Payment cancelled',
                'Your payment has been cancelled'
              );
              break;
          }
        })
        .catch((error) => Alert.alert('Payment failed', error.message));
    } else {
      Alert.alert('Error', 'Session could not be created.');
    }
  };

  return (
    <View style={styles.container}>
      <Button onPress={handlePress} title="Check out" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
