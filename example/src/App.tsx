import { Button, StyleSheet, View } from 'react-native';
import { presentPaymentFlow } from 'airwallex-payment-react-native';
import type { OneOffSession } from 'airwallex-payment-react-native';

export default function App() {
  const session: OneOffSession = {
    type: 'OneOff',
    paymentIntentId: 'int_hkstqptrxh02nfps1he',
    currency: 'AUD',
    countryCode: 'AU',
    amount: 1,
    paymentMethods: ['card'],
  };

  return (
    <View style={styles.container}>
      <Button
        onPress={() =>
          presentPaymentFlow(
            'eyJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE3MjY3MjcwMDgsImV4cCI6MTcyNjczMDYwOCwidHlwZSI6ImNsaWVudC1zZWNyZXQiLCJwYWRjIjoiSEsiLCJhY2NvdW50X2lkIjoiYjlmYzY1ZDktNzJlNS00Yzc2LThkNDMtYjc5ZmEyYmE2ZGZhIiwiaW50ZW50X2lkIjoiaW50X2hrc3RxcHRyeGgwMm5mcHMxaGUiLCJidXNpbmVzc19uYW1lIjoiU2F3YXluLCBPJ0Nvbm5lciBhbmQgUXVpZ2xleSJ9.N5Mmj2dCRIvuFX8w_-XXLaRsq8hrQC1SXnMKwBxxrZc',
            session,
            'staging'
          )
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
