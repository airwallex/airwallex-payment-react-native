# airwallex-payment-react-native

React Native library for Airwallex

## Installation

```sh
npm install airwallex-payment-react-native
```

## Usage

```js
import { presentEntirePaymentFlow } from 'airwallex-payment-react-native';
import type { PaymentSession } from 'airwallex-payment-react-native';

// ...

initialize();

const session: PaymentSession = {
    type: 'OneOff',
    customerId: 'cus_xxx',
    paymentIntentId: 'int_xxx',
    currency: 'AUD',
    countryCode: 'AU',
    amount: 1,
    isBillingRequired: false,
    paymentMethods: ['card'],
  };

// You can also use presentCardPaymentFlow, startGooglePay, startApplePay, payWithCardDetails or payWithConsent to launch each individual component.
presentEntirePaymentFlow('Your client secret', session, 'staging')
    .then((result) => {
        switch (result.status) {
            // handle different payment result status in your UI.
            case 'success':
            case 'inProgress':
            case 'cancelled':
        }
    })
    .catch(
        (error) => // handle error cases
    )

```

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
