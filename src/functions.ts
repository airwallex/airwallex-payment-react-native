import { transformKeysToSnakeCase } from './helpers';
import NativeAirwallexSdk from './NativeAirwallexSdk';
import type { PaymentConsent, PaymentSession } from './types';
import type { Card } from './types/Card';
import type { PaymentResult } from './types/PaymentResult';

export const initialize = (
  environment: 'staging' | 'demo' | 'production' = 'production',
  enableLogging: boolean = true,
  saveLogToLocal: boolean = false
) => {
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
  return NativeAirwallexSdk.payWithCardDetails(
    session,
    transformKeysToSnakeCase(card),
    saveCard
  );
};

export const payWithConsent = async (
  session: PaymentSession,
  consent: PaymentConsent
): Promise<PaymentResult> => {
  const transformedConsent = transformKeysToSnakeCase({
    ...consent,
    paymentMethod: transformKeysToSnakeCase({
      ...consent.paymentMethod,
      card: transformKeysToSnakeCase(consent.paymentMethod?.card),
      billing: transformKeysToSnakeCase(consent.paymentMethod?.billing),
    }),
  });

  return NativeAirwallexSdk.payWithConsent(session, transformedConsent);
};
