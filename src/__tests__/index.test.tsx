import type { OneOffSession } from '../types/PaymentSession';
import type { PaymentSheetConfiguration } from '../types/PaymentSheetConfiguration';

describe('PaymentSession', () => {
  it('includes lang when provided', () => {
    const session: OneOffSession = {
      type: 'OneOff',
      clientSecret: 'testSecret',
      currency: 'HKD',
      countryCode: 'HK',
      lang: 'zh-Hans',
      amount: 50,
      paymentIntentId: 'intent123',
    };

    expect(session.lang).toBe('zh-Hans');
  });
});

describe('PaymentSheetConfiguration', () => {
  it('accepts a custom checkout button title', () => {
    const configuration: PaymentSheetConfiguration = {
      layout: 'tab',
      checkoutButton: { title: 'Pay HKD 50.00' },
    };

    expect(configuration.checkoutButton?.title).toBe('Pay HKD 50.00');
  });
});
