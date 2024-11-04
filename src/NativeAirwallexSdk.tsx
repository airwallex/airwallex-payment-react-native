import { NativeModules } from 'react-native';
import type { PaymentSession } from './types';
import type { PaymentResult } from './types/PaymentResult';
import type { Card } from './types/Card';

type NativeAirwallexSdkType = {
  initialize(
    environment: 'staging' | 'demo' | 'production',
    enableLogging: boolean,
    saveLogToLocal: boolean
  ): Promise<void>;

  presentPaymentFlow(
    clientSecret: string,
    session: PaymentSession
  ): Promise<PaymentResult>;

  presentCardPaymentFlow(
    clientSecret: string,
    session: PaymentSession
  ): Promise<PaymentResult>;

  payWithCardDetails(
    clientSecret: string,
    session: PaymentSession,
    card: Card,
    saveCard: boolean
  ): Promise<PaymentResult>;
};

const { AirwallexSdk } = NativeModules;

export default AirwallexSdk as NativeAirwallexSdkType;
