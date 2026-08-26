import type { OneOffSession } from '../types/PaymentSession';

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
