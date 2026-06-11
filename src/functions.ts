import { version } from './version';
import { transformKeysToSnakeCase } from './helpers';
import NativeAirwallexSdk from './NativeAirwallexSdk';
import type {
  PaymentConsent,
  PaymentSession,
  PaymentSheetConfiguration,
} from './types';
import type { Card } from './types/Card';
import type { PaymentResult } from './types/PaymentResult';

/**
 * Initializes the Airwallex SDK. Call this once at app startup before invoking any other payment method.
 *
 * @param environment - The Airwallex environment to connect to. Defaults to `'production'`.
 * @param enableLogging - When `true`, the SDK emits logs to the console. Android only. Defaults to `true`.
 * @param saveLogToLocal - When `true`, logs are also persisted to a local file for debugging. Defaults to `false`.
 */
export const initialize = (
  environment: 'staging' | 'demo' | 'production' | 'preview' = 'production',
  enableLogging: boolean = true,
  saveLogToLocal: boolean = false
) => {
  if (enableLogging) {
    console.log(`[AirwallexSdk] Current connected environment: ${environment}`);
  }
  return NativeAirwallexSdk.initialize(
    environment,
    enableLogging,
    saveLogToLocal,
    version
  );
};

/**
 * Presents the full Airwallex payment sheet, letting the customer pick any supported payment method
 * (cards, wallets, redirect methods) and complete the payment.
 *
 * @param session - The payment session describing the intent, amount, currency, and customer.
 * @param configuration - Optional UI configuration for the payment sheet (e.g. layout).
 * @returns The result of the payment attempt.
 */
export const presentEntirePaymentFlow = async (
  session: PaymentSession,
  configuration?: PaymentSheetConfiguration
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentEntirePaymentFlow(session, configuration);
};

/**
 * Presents the card-only payment sheet. Use this when the merchant wants to restrict checkout
 * to card payments and skip the payment-method selection screen.
 *
 * @param session - The payment session describing the intent, amount, currency, and customer.
 * @returns The result of the payment attempt.
 */
export const presentCardPaymentFlow = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.presentCardPaymentFlow(session);
};

/**
 * Starts a Google Pay payment flow. Android only.
 *
 * @param session - The payment session. Must include `googlePayOptions` for the merchant configuration.
 * @returns The result of the payment attempt.
 */
export const startGooglePay = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.startGooglePay(session);
};

/**
 * Starts an Apple Pay payment flow. iOS only.
 *
 * @param session - The payment session. Must include `applePayOptions` for the merchant configuration.
 * @returns The result of the payment attempt.
 */
export const startApplePay = async (
  session: PaymentSession
): Promise<PaymentResult> => {
  return NativeAirwallexSdk.startApplePay(session);
};

/**
 * Pays with raw card details collected by the merchant's own UI. The merchant is responsible
 * for PCI compliance when using this method.
 *
 * @param session - The payment session describing the intent, amount, currency, and customer.
 * @param card - The card details to charge.
 * @param saveCard - When `true`, the card is saved as a payment consent for future use.
 * @returns The result of the payment attempt.
 */
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

/**
 * Pays using an existing payment consent (a previously saved card).
 *
 * @param session - The payment session describing the intent, amount, currency, and customer.
 * @param consent - The payment consent to charge.
 * @returns The result of the payment attempt.
 */
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
