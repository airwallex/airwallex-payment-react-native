import type { Shipping, PaymentSession } from 'airwallex-payment-react-native';
import PaymentService from '../api/PaymentService';
import { getPaymentParams } from '../api/PaymentParams';

class SessionCreator {
  static async createOneOffSession(
    paymentService: PaymentService
  ): Promise<PaymentSession> {
    try {
      const paymentIntent =
        await paymentService.createPaymentIntent(getPaymentParams());

      const paymentIntentId = paymentIntent.id;
      const clientSecret = paymentIntent.client_secret;
      const amount = paymentIntent.amount;
      const currency = paymentIntent.currency;

      console.log(
        'paymentIntentId:',
        paymentIntentId,
        '\n',
        'clientSecret:',
        clientSecret,
        '\n',
        'amount:',
        amount,
        '\n',
        'currency:',
        currency
      );

      const session: PaymentSession = {
        type: 'OneOff',
        customerId: '',
        paymentIntentId: paymentIntentId,
        currency: currency,
        countryCode: 'UK',
        amount: amount,
        isBillingRequired: true,
        isEmailRequired: false,
        returnUrl:
          'airwallexcheckout://com.example.airwallex_payment_flutter_example',
        // googlePayOptions: {
        //   billingAddressRequired: true,
        //   billingAddressParameters: new BillingAddressParameters(Format.FULL),
        // },
        // paymentMethods: ['card'],
        autoCapture: true,
        hidePaymentConsents: false,
        clientSecret: clientSecret,
      };
      return session;
    } catch (error) {
      console.error('Error creating payment session:', error);
      throw new Error('Failed to create payment session');
    }
  }

  static createShipping(): Shipping {
    return {
      firstName: 'John',
      lastName: 'Doe',
      phoneNumber: '123-456-7890',
      shippingMethod: 'Standard',
      email: 'john.doe@example.com',
      dateOfBirth: '2000-01-01',
      address: {
        city: 'Example City',
        countryCode: 'UK',
        street: '123 Example Street',
        postcode: '12345',
        state: 'Example State',
      },
    };
  }
}

export default SessionCreator;
