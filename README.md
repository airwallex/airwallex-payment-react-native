# airwallex-payment-react-native

[![Version](https://img.shields.io/npm/v/airwallex-payment-react-native.svg)](https://www.npmjs.org/package/airwallex-payment-react-native)

This airwallex-payment-react-native library is a lightweight React Native SDK that allows merchants to conveniently integrate the Airwallex checkout flow on their iOS/Android app.

## How it works

Merchants can integrate airwallex-payment-react-native in the checkout page on their app. For every checkout, merchants should create a [PaymentIntent](https://www.airwallex.com/docs/api#/Payment_Acceptance/Payment_Intents/Intro) entity through the [Airwallex API](https://www.airwallex.com/docs/api) to process payments with Airwallex.

Once the PaymentIntent is successfully created via API integration, the API will return a response with a unique ID and client secret for the intent. Merchants can then use these two keys along with other custom parameters to enable the payment UI to collect payment attempt details.

## Installation

```sh
npm install airwallex-payment-react-native
```

## Usage

```js
import { initialize, presentEntirePaymentFlow } from 'airwallex-payment-react-native';
import type { PaymentSession } from 'airwallex-payment-react-native';

// initialize SDK with configurations
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
    clientSecret: 'replace-with-your-client-secret'
  };

/* You can also use presentCardPaymentFlow, startGooglePay, startApplePay, payWithCardDetails 
or payWithConsent to launch each individual component. */
presentEntirePaymentFlow('Your client secret', session, 'staging')
    .then((result) => {
        switch (result.status) {
            // handle different payment result status in your UI
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
