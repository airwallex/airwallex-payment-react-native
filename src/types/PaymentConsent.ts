import type { Card } from './Card';
import type { Shipping } from './Shipping';

/**
 * Who initiates the next charge against a saved payment consent.
 */
export enum NextTriggeredBy {
  Merchant = 'merchant',
  Customer = 'customer',
}

/**
 * Why the merchant is triggering a charge against a saved payment consent.
 * Only meaningful when {@link NextTriggeredBy} is `Merchant`.
 *
 * - `Scheduled` — fixed-interval billing the customer has agreed to (e.g. monthly subscription).
 * - `Unscheduled` — merchant-initiated charge at an unpredictable time (e.g. account top-up, usage overage).
 */
export enum MerchantTriggerReason {
  Unscheduled = 'unscheduled',
  Scheduled = 'scheduled',
}

/**
 * A reusable payment authorization tied to a customer and a payment method.
 * Created during a `RecurringSession` / `RecurringWithIntentSession` flow,
 * and later passed to {@link payWithConsent} to charge without re-prompting the customer.
 */
export interface PaymentConsent {
  id?: string;
  requestId?: string;
  customerId?: string;
  paymentMethod?: PaymentMethod;
  status?: string;
  nextTriggeredBy?: NextTriggeredBy;
  merchantTriggerReason?: MerchantTriggerReason;
  createdAt?: string;
  updatedAt?: string;
  clientSecret?: string;
}

/**
 * The payment instrument attached to a {@link PaymentConsent} — typically a saved card,
 * along with its billing details.
 */
export interface PaymentMethod {
  id?: string;
  type?: string;
  card?: Card;
  billing?: Shipping;
  customerId?: string;
}
