/**
 * Apple Pay configuration. Required on a `PaymentSession` when invoking
 * {@link startApplePay}, or when offering Apple Pay through {@link presentEntirePaymentFlow} on iOS.
 *
 * `merchantIdentifier` must match the Apple Pay merchant ID configured in the app's entitlements.
 */
export interface ApplePayOptions {
  merchantIdentifier: string;
  supportedNetworks?: ApplePaySupportedNetwork[];
  additionalPaymentSummaryItems?: CartSummaryItem[];
  merchantCapabilities?: ApplePayMerchantCapability[];
  requiredBillingContactFields?: ContactField[];
  supportedCountries?: string[];
  totalPriceLabel?: string;
}

/**
 * Card networks the merchant is willing to accept through Apple Pay.
 */
export enum ApplePaySupportedNetwork {
  Visa = 'visa',
  MasterCard = 'masterCard',
  UnionPay = 'unionPay',
  Amex = 'amex',
  Discover = 'discover',
  JCB = 'jcb',
  Mastreo = 'maestro',
}

/**
 * Payment-processing capabilities the merchant supports. `Supports3DS` is required by Apple Pay.
 */
export enum ApplePayMerchantCapability {
  Supports3DS = 'supports3DS',
  SupportsCredit = 'supportsCredit',
  SupportsDebit = 'supportsDebit',
  SupportsEMV = 'supportsEMV',
}

/**
 * Contact fields the merchant requires from the customer during Apple Pay checkout.
 */
export enum ContactField {
  EmailAddress = 'emailAddress',
  Name = 'name',
  PhoneNumber = 'phoneNumber',
  PhoneticName = 'phoneticName',
  PostalAddress = 'postalAddress',
}

/**
 * An additional line item displayed in the Apple Pay summary
 * (e.g. tax, shipping, discount) on top of the session amount.
 */
export interface CartSummaryItem {
  label: string;
  amount: number;
  type?: CartSummaryItemType;
}

/**
 * Whether a {@link CartSummaryItem} amount is final or still pending
 * (e.g. shipping not yet calculated).
 */
export enum CartSummaryItemType {
  Final = 'final',
  Pending = 'pending',
}
