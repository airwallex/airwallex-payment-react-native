import type { PaymentConsent } from 'airwallex-payment-react-native';
import type PaymentService from '../api/PaymentService';

class PaymentConsentCreator {
  static async getPaymentConsents(
    paymentService: PaymentService,
    customerId: string
  ): Promise<PaymentConsent | null> {
    try {
      console.log('getPaymentConsents, customerId:', customerId);
      const paymentConsentsRes =
        await paymentService.getPaymentConsents(customerId);
      if (
        paymentConsentsRes &&
        paymentConsentsRes.items &&
        paymentConsentsRes.items.length > 0
      ) {
        const firstItem = paymentConsentsRes.items[0];
        console.log(
          'getPaymentConsents, paymentMethod:',
          firstItem.payment_method
        );
        const paymentConsent: PaymentConsent = {
          id: firstItem.id,
          requestId: firstItem.request_id,
          customerId: firstItem.customer_id,
          paymentMethod: {
            id: firstItem.payment_method.id,
            type: firstItem.payment_method.type,
            card: {
              bin: firstItem.payment_method.card?.bin,
              brand: firstItem.payment_method.card?.brand,
              cardType: firstItem.payment_method.card?.card_type,
              expiryMonth: firstItem.payment_method.card?.expiry_month,
              expiryYear: firstItem.payment_method.card?.expiry_year,
              fingerprint: firstItem.payment_method.card?.fingerprint,
              issuerCountryCode:
                firstItem.payment_method.card?.issuer_country_code,
              last4: firstItem.payment_method.card?.last4,
              name: firstItem.payment_method.card?.name,
              numberType: firstItem.payment_method.card?.number_type,
            },
            billing: {
              firstName: firstItem.payment_method.billing?.first_name,
              lastName: firstItem.payment_method.billing?.last_name,
              phoneNumber: firstItem.payment_method.billing?.phone_number,
              shippingMethod: firstItem.payment_method.billing?.shipping_method,
              email: firstItem.payment_method.billing?.email,
              dateOfBirth: firstItem.payment_method.billing?.date_of_birth,
              address: {
                city: firstItem.payment_method.billing?.address?.city,
                countryCode:
                  firstItem.payment_method.billing?.address?.country_code,
                street: firstItem.payment_method.billing?.address?.street,
                postcode: firstItem.payment_method.billing?.address?.postcode,
                state: firstItem.payment_method.billing?.address?.state,
              },
            },
            customerId: firstItem.payment_method.customer_id,
          },
          status: firstItem.status,
          nextTriggeredBy: firstItem.next_triggered_by,
          merchantTriggerReason: undefined,
          createdAt: firstItem.created_at,
          updatedAt: firstItem.updated_at,
          clientSecret: undefined,
        };
        console.log('getPaymentConsents, paymentConsent:', paymentConsent);
        return paymentConsent;
      } else {
        console.log('No payment consents found.');
        return null;
      }
    } catch (error) {
      console.error('Error getting PaymentConsents:', error);
      throw new Error('Failed to get PaymentConsents');
    }
  }
}

export default PaymentConsentCreator;
