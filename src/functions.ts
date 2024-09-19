import NativeAirwallexSdk from './NativeAirwallexSdk';
import type { PaymentSession } from './types';

export const presentPaymentFlow = async (
  clientSecret: string,
  session: PaymentSession,
  environment: 'staging' | 'demo' | 'production' = 'demo'
): Promise<void> => {
  try {
    await NativeAirwallexSdk.presentPaymentFlow(
      clientSecret,
      session,
      environment
    );
  } catch (error: any) {
    console.log(error);
    return;
  }
};
