import NativeAirwallexSdk from './NativeAirwallexSdk';
import type { PaymentSession } from './types';
import type { Card } from './types/Card';
import type { PaymentResult } from './types/PaymentResult';

export const initialize = async (
  environment: 'staging' | 'demo' | 'production' = 'demo',
  enableLogging: boolean,
  saveLogToLocal: boolean
): Promise<void> => {
  return NativeAirwallexSdk.initialize(
    environment,
    enableLogging,
    saveLogToLocal
  );
};

export const presentPaymentFlow = async (
  clientSecret: string,
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentPaymentFlow(clientSecret, session);
};

export const presentCardPaymentFlow = async (
  clientSecret: string,
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentCardPaymentFlow(clientSecret, session);
};

export const startGooglePay = async (
  clientSecret: string,
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.startGooglePay(clientSecret, session);
};

export const payWithCardDetails = async (
  clientSecret: string,
  session: PaymentSession,
  card: Card,
  saveCard: boolean
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.payWithCardDetails(
    clientSecret,
    session,
    card,
    saveCard
  );
};
