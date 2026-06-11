/**
 * Card details. When used as input to {@link payWithCardDetails}, the merchant
 * supplies `number`, `expiryMonth`, `expiryYear`, `cvc`, and optionally `name`.
 *
 * The remaining fields (`bin`, `last4`, `brand`, `fingerprint`, `cvcCheck`,
 * `avsCheck`, etc.) are populated by Airwallex when a Card is returned as part of
 * a saved payment method on a {@link PaymentConsent}.
 */
export interface Card {
  cvc?: string;
  expiryMonth?: string;
  expiryYear?: string;
  name?: string;
  number?: string;
  bin?: string;
  last4?: string;
  brand?: string;
  country?: string;
  funding?: string;
  fingerprint?: string;
  cvcCheck?: string;
  avsCheck?: string;
  issuerCountryCode?: string;
  cardType?: string;
  numberType?: string;
}
