import { Button, StyleSheet, View, Alert } from 'react-native';
import { presentPaymentFlow } from 'airwallex-payment-react-native';
import type { PaymentSession } from 'airwallex-payment-react-native';

export default function App() {
  const session: PaymentSession = {
    type: 'OneOff',
    customerId: 'cus_hkstv7nzsh06x60jtoy',
    paymentIntentId: 'int_hkstv7nzsh06xbvy8dg',
    currency: 'AUD',
    countryCode: 'AU',
    amount: 1,
    isBillingRequired: false,
    paymentMethods: ['card'],
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() =>
          presentPaymentFlow('', session, 'staging')
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
            .catch((error) => Alert.alert('Payment failed', error.message))
        }
        title="Check out"
      />
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
