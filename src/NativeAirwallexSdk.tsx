import { NativeModules } from 'react-native';
import type { PaymentSession } from './types';
import type { PaymentResult } from './types/PaymentResult';

type NativeAirwallexSdkType = {
  presentPaymentFlow(
    clientSecret: string,
    session: PaymentSession,
    environment: 'staging' | 'demo' | 'production'
  ): Promise<PaymentResult>;
};

const { AirwallexSdk } = NativeModules;

export default AirwallexSdk as NativeAirwallexSdkType;
