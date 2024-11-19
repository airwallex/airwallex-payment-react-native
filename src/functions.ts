import NativeAirwallexSdk from './NativeAirwallexSdk';
import type { PaymentConsent, PaymentSession } from './types';
import type { Card } from './types/Card';
import type { PaymentResult } from './types/PaymentResult';

export const initialize = async (
  environment: 'staging' | 'demo' | 'production' = 'production',
  enableLogging: boolean = true,
  saveLogToLocal: boolean = false
): Promise<void> => {
  return NativeAirwallexSdk.initialize(
    environment,
    enableLogging,
    saveLogToLocal
  );
};

export const presentEntirePaymentFlow = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentEntirePaymentFlow(session);
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

export const startApplePay = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.startApplePay(session);
};

export const payWithCardDetails = async (
  session: PaymentSession,
  card: Card,
  saveCard: boolean
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.payWithCardDetails(session, card, saveCard);
};

export const payWithConsent = async (
  session: PaymentSession,
  consent: PaymentConsent
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.payWithConsent(session, consent);
};
