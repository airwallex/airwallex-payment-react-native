import type { Shipping } from './Shipping';
import type { ApplePayOptions } from './ApplePayOptions';
import type { GooglePayOptions } from './GooglePayOptions';
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
  googlePayOptions?: GooglePayOptions;
  applePayOptions?: ApplePayOptions;
  paymentMethods?: string[];
  clientSecret: string;
}

/**
 * A single (non-recurring) payment against a payment intent.
 */
export interface OneOffSession extends BaseSession {
  type: 'OneOff';
  paymentIntentId: string;
  autoCapture?: boolean;
  hidePaymentConsents?: boolean;
}

/**
 * A session that sets up a payment consent for future recurring charges
 * without charging the customer right now.
 */
export interface RecurringSession extends BaseSession {
  type: 'Recurring';
  customerId: string;
  nextTriggeredBy: NextTriggeredBy;
  merchantTriggerReason: MerchantTriggerReason;
}

/**
 * A session that charges a payment intent now and sets up a payment consent
 * for future recurring charges in a single step.
 */
export interface RecurringWithIntentSession extends BaseSession {
  type: 'RecurringWithIntent';
  customerId: string;
  paymentIntentId: string;
  autoCapture?: boolean;
  nextTriggeredBy: NextTriggeredBy;
  merchantTriggerReason: MerchantTriggerReason;
}

/**
 * The configuration object passed to every payment flow function. It bundles the
 * authentication (`clientSecret`), amount and currency, customer details, and
 * optional wallet configuration into a single value.
 *
 * Pick a variant based on what the merchant wants to do:
 * - {@link OneOffSession} — charge the customer once.
 * - {@link RecurringSession} — save a payment method for future recurring charges, without charging now.
 * - {@link RecurringWithIntentSession} — charge now AND save the payment method for future recurring charges.
 */
export type PaymentSession =
  | OneOffSession
  | RecurringSession
  | RecurringWithIntentSession;
