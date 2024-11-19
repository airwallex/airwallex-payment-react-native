export interface ApplePayOptions {
  merchantIdentifier: string;
  supportedNetworks?: ApplePaySupportedNetwork[];
  additionalPaymentSummaryItems?: CartSummaryItem[];
  merchantCapabilities?: ApplePayMerchantCapability[];
  requiredBillingContactFields?: ContactField[];
  supportedCountries?: string[];
  totalPriceLabel?: string;
}

export enum ApplePaySupportedNetwork {
  Visa = 'visa',
  MasterCard = 'masterCard',
  UnionPay = 'unionPay',
  Amex = 'amex',
  Discover = 'discover',
  JCB = 'jcb',
  Mastreo = 'maestro',
}

export enum ApplePayMerchantCapability {
  Supports3DS = 'supports3DS',
  SupportsCredit = 'supportsCredit',
  SupportsDebit = 'supportsDebit',
  SupportsEMV = 'supportsEMV',
}

export enum ContactField {
  EmailAddress = 'emailAddress',
  Name = 'name',
  PhoneNumber = 'phoneNumber',
  PhoneticName = 'phoneticName',
  PostalAddress = 'postalAddress',
}

export interface CartSummaryItem {
  label: string;
  amount: number;
  type?: CartSummaryItemType;
}

export enum CartSummaryItemType {
  Final = 'final',
  Pending = 'pending',
}
