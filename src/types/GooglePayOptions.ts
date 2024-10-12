export enum Format {
  MIN = 'min',
  FULL = 'full',
}

export interface BillingAddressParameters {
  format?: Format;
  phoneNumberRequired?: boolean;
}

export interface ShippingAddressParameters {
  allowedCountryCodes?: string[];
  phoneNumberRequired?: boolean;
}

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
