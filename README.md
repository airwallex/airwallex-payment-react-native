# airwallex-payment-react-native

[![Version](https://img.shields.io/npm/v/airwallex-payment-react-native.svg)](https://www.npmjs.org/package/airwallex-payment-react-native)

This airwallex-payment-react-native library is a lightweight React Native SDK that allows merchants to conveniently integrate the Airwallex checkout flow on their iOS/Android app.
Payment methods supported:
- Cards: `Visa`, `Mastercard`, `Amex`, `Dinners Club`, `JCB`, `Discover`, `Union Pay`. If you want to integrate Airwallex API without our Native UI for card payments, then your app is required to be PCI-DSS compliant. 
- E-Wallets: `Alipay`, `AlipayHK`, `DANA`, `GCash`, `Kakao Pay`, `Touch ‘n Go`, `WeChat Pay`, etc.
- Apple Pay
- Google Pay

Localizations supported:
English, Chinese Simplified, Chinese Traditional, French, German, Japanese, Korean, Portuguese Portugal, Portuguese Brazil, Russian, Spanish, Thai.

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
presentEntirePaymentFlow(session)
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

## Screenshots
<p align="left">
<img src="https://github.com/user-attachments/assets/babf2af3-d59b-49fc-8b86-26e85df28a0c" width="200" hspace="10">
<img src="https://github.com/user-attachments/assets/d228ed51-2405-4322-be08-b1946801e076" width="200" hspace="10">
<img src="https://github.com/user-attachments/assets/c86b7f3f-d2bc-4326-b82e-145f52d35c72" width="200" hspace="10">
<img src="https://github.com/user-attachments/assets/938e6101-edb2-4fcf-89fa-07936e4af5a9" width="200" hspace="10">
<img src="https://github.com/user-attachments/assets/5556a6af-882d-4474-915e-2c9d5953aaa8" width="200" hspace="10">
<img src="https://github.com/user-attachments/assets/eb6f0b38-d88b-4c27-b843-9948bc25c5a0" width="200" hspace="10">
<img src="https://github.com/user-attachments/assets/1de983a9-b062-4108-82f5-917e0fc0fb57" width="200" hspace="10">
</p>

## Contributing

See the [contributing guide](CONTRIBUTING.md) to learn how to contribute to the repository and the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
