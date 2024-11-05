import type { Shipping, PaymentSession } from 'airwallex-payment-react-native';
import {
  googlePaySupportedNetworks,
  Format,
} from 'airwallex-payment-react-native';
import PaymentService from '../api/PaymentService';
import { getCustomerParams, getPaymentParams } from '../api/PaymentParams';

class SessionCreator {
  static async createOneOffSession(
    paymentService: PaymentService,
    requireCustomerId: boolean = false
  ): Promise<PaymentSession> {
    try {
      let customerId = null;
      if (requireCustomerId) {
        const customerInfo =
          await paymentService.createCustomer(getCustomerParams());
        customerId = customerInfo.customer_id;
      }
      const paymentIntent = await paymentService.createPaymentIntent(
        getPaymentParams(customerId)
      );

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
        shipping: this.createShipping(),
        paymentIntentId: paymentIntentId,
        currency: currency,
        countryCode: 'UK',
        amount: amount,
        isBillingRequired: true,
        isEmailRequired: false,
        returnUrl:
          'airwallexcheckout://com.example.airwallex_payment_flutter_example',
        googlePayOptions: {
          allowedCardNetworks: googlePaySupportedNetworks(),
          billingAddressRequired: true,
          billingAddressParameters: {
            format: Format.FULL,
            phoneNumberRequired: false,
          },
        },
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
