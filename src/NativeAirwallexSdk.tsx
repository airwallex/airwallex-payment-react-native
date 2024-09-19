import { NativeModules } from 'react-native';
import type { PaymentSession } from './types';

type NativeAirwallexSdkType = {
  presentPaymentFlow(
    clientSecret: string,
    session: PaymentSession,
    environment: 'staging' | 'demo' | 'production'
  ): Promise<void>;
};

const { AirwallexSdk } = NativeModules;

export default AirwallexSdk as NativeAirwallexSdkType;
