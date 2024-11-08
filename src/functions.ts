import NativeAirwallexSdk from './NativeAirwallexSdk';
import type { PaymentConsent, PaymentSession } from './types';
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
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentPaymentFlow(session);
};

export const presentCardPaymentFlow = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentCardPaymentFlow(session);
};

export const startGooglePay = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.startGooglePay(session);
};

export const payWithCardDetails = async (
  session: PaymentSession,
  card: Card,
  saveCard: boolean
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.payWithCardDetails(session, card, saveCard);
};

export const payWithPaymentConsent = async (
  session: PaymentSession,
  paymentConsent: PaymentConsent
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.payWithPaymentConsent(session, paymentConsent);
};
