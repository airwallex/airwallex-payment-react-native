import type {
  Shipping,
  PaymentSession,
  RecurringSession,
  OneOffSession,
  RecurringWithIntentSession,
} from 'airwallex-payment-react-native';
import {
  googlePaySupportedNetworks,
  Format,
  NextTriggeredBy,
  MerchantTriggerReason,
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

      const session: OneOffSession = {
        type: 'OneOff',
        customerId: '',
        shipping: this.createShipping(),
        paymentIntentId: paymentIntentId,
        currency: currency,
        countryCode: 'UK',
        amount: amount,
        isBillingRequired: true,
        isEmailRequired: false,
        returnUrl: '',
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
      console.error('Error creating OneOffSession:', error);
      throw new Error('Failed to create OneOffSession');
    }
  }

  static async createRecurringSession(
    paymentService: PaymentService
  ): Promise<PaymentSession> {
    try {
      const customerInfo =
        await paymentService.createCustomer(getCustomerParams());
      const customerId = customerInfo.customer_id;
      const clientSecretInfo =
        await paymentService.createClientSecretWithQuery(customerId);
      const clientSecret = clientSecretInfo.client_secret;

      console.log(
        'customerId:',
        customerId,
        '\n',
        'clientSecret:',
        clientSecret
      );

      const session: RecurringSession = {
        type: 'Recurring',
        customerId: customerId,
        clientSecret: clientSecret,
        shipping: this.createShipping(),
        isBillingRequired: true,
        isEmailRequired: false,
        amount: 1.0,
        currency: 'HKD',
        countryCode: 'HK',
        returnUrl: '',
        nextTriggeredBy: NextTriggeredBy.Merchant,
        merchantTriggerReason: MerchantTriggerReason.Scheduled,
      };
      return session;
    } catch (error) {
      console.error('Error creating RecurringSession:', error);
      throw new Error('Failed to create RecurringSession');
    }
  }

  static async createRecurringWithIntentSession(
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

      const session: RecurringWithIntentSession = {
        type: 'RecurringWithIntent',
        customerId: customerId,
        clientSecret: clientSecret,
        currency: currency,
        countryCode: 'HK',
        amount: amount,
        paymentIntentId: paymentIntentId,
        shipping: this.createShipping(),
        isBillingRequired: true,
        isEmailRequired: false,
        returnUrl: '',
        nextTriggeredBy: NextTriggeredBy.Merchant,
        merchantTriggerReason: MerchantTriggerReason.Scheduled,
      };
      return session;
    } catch (error) {
      console.error('Error creating RecurringWithIntentSession:', error);
      throw new Error('Failed to create RecurringWithIntentSession');
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
