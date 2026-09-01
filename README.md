# airwallex-payment-react-native

[![Version](https://img.shields.io/npm/v/airwallex-payment-react-native.svg)](https://www.npmjs.org/package/airwallex-payment-react-native)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

Lightweight React Native SDK for embedding the Airwallex checkout flow in iOS and Android apps. It ships a pre-built payment sheet plus lower-level APIs if you want to drive card, Apple Pay, or Google Pay yourself.

See the [Airwallex Mobile SDKs](https://www.airwallex.com/docs/developer-tools/sdks/mobile-sdks) docs for product context, PCI requirements, and the rest of the mobile stack.

## Requirements

- React Native 0.79.3+
- iOS 13.0+
- Android API 21+

## Supported payment methods

- **Cards:** Visa, Mastercard, Amex, Diners Club, JCB, Discover, UnionPay. Collecting card details in your own UI (via `payWithCardDetails`) requires your app to be PCI-DSS compliant.
- **Wallets:** Alipay, AlipayHK, DANA, GCash, Kakao Pay, Touch ’n Go, WeChat Pay, and other redirect methods enabled on your account.
- **Apple Pay** (iOS)
- **Google Pay** (Android)

**Locales:** English, Chinese Simplified, Chinese Traditional, French, German, Japanese, Korean, Portuguese (Portugal), Portuguese (Brazil), Russian, Spanish, Thai. Pass `lang` on the session (for example `'zh-Hans'` or `'pt-BR'`) to override the SDK default.

## How it works

1. On your server, create a [PaymentIntent](https://www.airwallex.com/docs/api#/Payment_Acceptance/Payment_Intents/Intro) with the [Airwallex API](https://www.airwallex.com/docs/api).
2. The API returns an intent id and `client_secret`.
3. In the app, call `initialize` once at startup, then present a payment flow with a `PaymentSession` built from those values.

Never put API keys in the client. Only the PaymentIntent id and client secret belong in the SDK session.

## Installation

```sh
npm install airwallex-payment-react-native
# or
yarn add airwallex-payment-react-native
```

Then install iOS pods:

```sh
cd ios && pod install
```

## Usage

Call `initialize` once before any payment method. Use `'demo'` or `'staging'` while integrating; default is `'production'`.

```ts
import {
  initialize,
  presentEntirePaymentFlow,
} from 'airwallex-payment-react-native';
import type { PaymentSession } from 'airwallex-payment-react-native';

initialize('production');

const session: PaymentSession = {
  type: 'OneOff',
  customerId: 'cus_xxx',
  paymentIntentId: 'int_xxx',
  currency: 'AUD',
  countryCode: 'AU',
  amount: 1,
  isBillingRequired: false,
  paymentMethods: ['card'],
  clientSecret: 'replace-with-your-client-secret',
};

presentEntirePaymentFlow(session)
  .then((result) => {
    switch (result.status) {
      case 'success':
        // Payment succeeded. `result.paymentConsentId` is set if a consent was created.
        break;
      case 'inProgress':
        // Submitted but not final — poll the PaymentIntent or wait for a webhook.
        break;
      case 'cancelled':
        // Shopper dismissed the sheet.
        break;
    }
  })
  .catch((error) => {
    // SDK or payment error
    console.error(error);
  });
```

`presentEntirePaymentFlow` shows the full payment sheet (cards, wallets, Apple Pay / Google Pay when configured). Other entry points:

| Function | Use when |
| --- | --- |
| `presentCardPaymentFlow(session)` | Card-only sheet, skip method selection |
| `startApplePay(session)` | Apple Pay only (iOS; set `applePayOptions`) |
| `startGooglePay(session)` | Google Pay only (Android; set `googlePayOptions`) |
| `payWithCardDetails(session, card, saveCard)` | Your own card UI (PCI-DSS required) |
| `payWithConsent(session, consent)` | Charge a previously saved payment consent |

Session `type` can be `'OneOff'`, `'Recurring'` (save a method without charging), or `'RecurringWithIntent'` (charge now and save). Optionally pass `{ layout: 'tab' | 'accordion' }` as the second argument to `presentEntirePaymentFlow`.

A runnable integration lives in [`example/`](./example).

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

See the [contributing guide](CONTRIBUTING.md) for the development workflow.

## License

MIT

---

Made with [create-react-native-library](https://github.com/callstack/react-native-builder-bob)
