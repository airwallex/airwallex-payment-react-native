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
  ApplePaySupportedNetwork,
  CartSummaryItemType,
  ApplePayMerchantCapability,
  ContactField,
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
        customerId = customerInfo.id;
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
        currency,
        '\n',
        'customerId:',
        customerId
      );

      const session: OneOffSession = {
        type: 'OneOff',
        customerId: customerId,
        shipping: this.createShipping(),
        paymentIntentId: paymentIntentId,
        currency: currency,
        countryCode: 'HK',
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
        applePayOptions: {
          merchantIdentifier: 'merchant.com.airwallex.paymentacceptance',
          supportedNetworks: [
            ApplePaySupportedNetwork.Visa,
            ApplePaySupportedNetwork.MasterCard,
            ApplePaySupportedNetwork.UnionPay,
          ],
          additionalPaymentSummaryItems: [
            {
              label: 'goods',
              amount: 2,
              type: CartSummaryItemType.Pending,
            },
            {
              label: 'tax',
              amount: 1,
            },
          ],
          merchantCapabilities: [
            ApplePayMerchantCapability.Supports3DS,
            ApplePayMerchantCapability.SupportsCredit,
            ApplePayMerchantCapability.SupportsDebit,
          ],
          requiredBillingContactFields: [
            ContactField.Name,
            ContactField.PostalAddress,
            ContactField.EmailAddress,
          ],
          supportedCountries: ['HK', 'US', 'AU'],
          totalPriceLabel: 'COMPANY, INC.',
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
      const customerId = customerInfo.id;
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
    paymentService: PaymentService
  ): Promise<PaymentSession> {
    try {
      const customerInfo =
        await paymentService.createCustomer(getCustomerParams());
      const customerId = customerInfo.id;
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
        currency,
        '\n',
        'customerId:',
        customerId
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
