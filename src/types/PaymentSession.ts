import type { Shipping } from './Shipping';
import type { ApplePayOptions } from './ApplePayOptions';
import type { NextTriggeredBy, MerchantTriggerReason } from './PaymentConsent';

interface BaseSession {
  customerId?: string;
  shipping?: Shipping;
  isBillingRequired?: boolean;
  isEmailRequired?: boolean;
  currency: string;
  countryCode: string;
  amount: number;
  returnUrl?: string;
  //googlePayOptions?: GooglePayOptions;
  applePayOptions?: ApplePayOptions;
  paymentMethods?: string[];
  clientSecret?: string;
}

export interface OneOffSession extends BaseSession {
  type: 'OneOff';
  paymentIntentId: string;
  autoCapture?: boolean;
  hidePaymentConsents?: boolean;
}

export interface RecurringSession extends BaseSession {
  type: 'Recurring';
  customerId: string;
  nextTriggeredBy: NextTriggeredBy;
  merchantTriggerReason: MerchantTriggerReason;
}

export interface RecurringWithIntentSession extends BaseSession {
  type: 'RecurringWithIntent';
  customerId: string;
  paymentIntentId: string;
  autoCapture?: boolean;
  nextTriggeredBy: NextTriggeredBy;
  merchantTriggerReason: MerchantTriggerReason;
}

export type PaymentSession =
  | OneOffSession
  | RecurringSession
  | RecurringWithIntentSession;
