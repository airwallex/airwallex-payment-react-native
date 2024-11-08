import { NativeModules } from 'react-native';
import type { PaymentConsent, PaymentSession } from './types';
import type { PaymentResult } from './types/PaymentResult';
import type { Card } from './types/Card';

type NativeAirwallexSdkType = {
  initialize(
    environment: 'staging' | 'demo' | 'production',
    enableLogging: boolean,
    saveLogToLocal: boolean
  ): Promise<void>;

  presentPaymentFlow(session: PaymentSession): Promise<PaymentResult>;

  presentCardPaymentFlow(session: PaymentSession): Promise<PaymentResult>;

  startGooglePay(session: PaymentSession): Promise<PaymentResult>;

  payWithCardDetails(
    session: PaymentSession,
    card: Card,
    saveCard: boolean
  ): Promise<PaymentResult>;

  payWithPaymentConsent(
    session: PaymentSession,
    paymentConsent: PaymentConsent
  ): Promise<PaymentResult>;
};

const { AirwallexSdk } = NativeModules;

export default AirwallexSdk as NativeAirwallexSdkType;
