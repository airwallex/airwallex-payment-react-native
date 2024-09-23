import { Button, StyleSheet, View, Alert } from 'react-native';
import { presentPaymentFlow } from 'airwallex-payment-react-native';
import type { PaymentSession } from 'airwallex-payment-react-native';

export default function App() {
  const session: PaymentSession = {
    type: 'OneOff',
    paymentIntentId: 'int_hkstv7nzsh06wdxyu59',
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
          presentPaymentFlow(
            'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjcwNTk5NDgsImV4cCI6MTcyNzA2MzU0OCwidHlwZSI6ImNsaWVudC1zZWNyZXQiLCJwYWRjIjoiSEsiLCJhY2NvdW50X2lkIjoiYjlmYzY1ZDktNzJlNS00Yzc2LThkNDMtYjc5ZmEyYmE2ZGZhIiwiaW50ZW50X2lkIjoiaW50X2hrc3R2N256c2gwNndkeHl1NTkiLCJidXNpbmVzc19uYW1lIjoiU2F3YXluLCBPJ0Nvbm5lciBhbmQgUXVpZ2xleSJ9.3gSgPca1XswwrUcy-_xHW9X9puJe99hXT06i74Smuaw',
            session,
            'staging'
          )
            .then((result) => {
              switch (result.status) {
                case 'success':
                  Alert.alert(
                    'Payment success',
                    'Your payment has been charged'
                  );
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
