import { payWithConsent } from '../functions';
import NativeAirwallexSdk from '../NativeAirwallexSdk';
import type { OneOffSession } from '../types/PaymentSession';
import type { PaymentConsent } from '../types/PaymentConsent';

jest.mock('../NativeAirwallexSdk', () => ({
  __esModule: true,
  default: { payWithConsent: jest.fn(() => Promise.resolve({})) },
}));

const session: OneOffSession = {
  type: 'OneOff',
  clientSecret: 'testSecret',
  currency: 'USD',
  countryCode: 'US',
  amount: 10,
  paymentIntentId: 'int_123',
};

const sentConsent = () =>
  (NativeAirwallexSdk.payWithConsent as jest.Mock).mock.calls[0][1];

describe('payWithConsent', () => {
  beforeEach(() => {
    (NativeAirwallexSdk.payWithConsent as jest.Mock).mockClear();
  });

  it('sends the billing address with snake_case keys', async () => {
    const consent: PaymentConsent = {
      id: 'cst_123',
      customerId: 'cus_123',
      paymentMethod: {
        id: 'mtd_123',
        type: 'card',
        card: { last4: '4242', issuerCountryCode: 'US' },
        billing: {
          firstName: 'Ada',
          phoneNumber: '5551234',
          address: {
            countryCode: 'US',
            city: 'Durham',
            street: '1 Main St',
            postcode: '27708',
            state: 'NC',
          },
        },
      },
    };

    await payWithConsent(session, consent);

    const sent = sentConsent();
    expect(sent.customer_id).toBe('cus_123');
    expect(sent.payment_method.card.issuer_country_code).toBe('US');
    expect(sent.payment_method.billing.first_name).toBe('Ada');
    expect(sent.payment_method.billing.phone_number).toBe('5551234');
    expect(sent.payment_method.billing.address).toEqual({
      country_code: 'US',
      city: 'Durham',
      street: '1 Main St',
      postcode: '27708',
      state: 'NC',
    });
  });

  it('does not add an address when the billing has none', async () => {
    await payWithConsent(session, {
      id: 'cst_123',
      paymentMethod: {
        id: 'mtd_123',
        type: 'card',
        billing: { firstName: 'Ada' },
      },
    });

    expect(sentConsent().payment_method.billing).toEqual({
      first_name: 'Ada',
    });
  });
});
