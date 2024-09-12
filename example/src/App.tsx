import { Button, StyleSheet, View } from 'react-native';
import { presentPaymentFlow } from 'airwallex-payment-react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Button onPress={() => presentPaymentFlow([])} title="Check out" />
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
