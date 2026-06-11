/**
 * How much of the billing address Google Pay should return.
 *
 * - `MIN` — postal code and country only (sufficient for most card validation).
 * - `FULL` — full address.
 */
export enum Format {
  MIN = 'min',
  FULL = 'full',
}

/**
 * Controls how the customer's billing address is collected via Google Pay.
 */
export interface BillingAddressParameters {
  format?: Format;
  phoneNumberRequired?: boolean;
}

/**
 * Controls how the customer's shipping address is collected via Google Pay.
 */
export interface ShippingAddressParameters {
  allowedCountryCodes?: string[];
  phoneNumberRequired?: boolean;
}

/**
 * Google Pay configuration. Required on a `PaymentSession` when invoking
 * {@link startGooglePay}, or when offering Google Pay through {@link presentEntirePaymentFlow} on Android.
 */
export interface GooglePayOptions {
  allowedCardAuthMethods?: string[];
  merchantName?: string;
  allowPrepaidCards?: boolean;
  allowCreditCards?: boolean;
  assuranceDetailsRequired?: boolean;
  billingAddressRequired?: boolean;
  billingAddressParameters?: BillingAddressParameters;
  transactionId?: string;
  totalPriceLabel?: string;
  checkoutOption?: string;
  emailRequired?: boolean;
  shippingAddressRequired?: boolean;
  shippingAddressParameters?: ShippingAddressParameters;
  allowedCardNetworks: string[];
  skipReadinessCheck?: boolean;
}

/**
 * The set of card networks Airwallex supports through Google Pay. Useful as a default value
 * for `GooglePayOptions.allowedCardNetworks` when the merchant has no preference.
 */
export function googlePaySupportedNetworks(): string[] {
  return [
    'AMEX',
    'DISCOVER',
    'JCB',
    'MASTERCARD',
    'VISA',
    // "MAESTRO"
  ];
}
