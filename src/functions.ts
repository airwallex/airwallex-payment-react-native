import NativeAirwallexSdk from './NativeAirwallexSdk';
import type { PaymentSession } from './types';
import type { PaymentResult } from './types/PaymentResult';

export const presentPaymentFlow = async (
  clientSecret: string,
  session: PaymentSession,
  environment: 'staging' | 'demo' | 'production' = 'demo'
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentPaymentFlow(
    clientSecret,
    session,
    environment
  );
};
