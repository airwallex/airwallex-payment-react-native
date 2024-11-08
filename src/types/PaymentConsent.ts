import type { Card } from './Card';
import type { Shipping } from './Shipping';

export enum NextTriggeredBy {
  Merchant = 'merchant',
  Customer = 'customer',
}

export enum MerchantTriggerReason {
  Unscheduled = 'unscheduled',
  Scheduled = 'scheduled',
}

export interface PaymentConsent {
  id?: string;
  requestId?: string;
  customerId?: string;
  paymentMethod?: PaymentMethod;
  status?: string;
  nextTriggeredBy?: NextTriggeredBy;
  merchantTriggerReason?: MerchantTriggerReason;
  requiresCvc: boolean;
  createdAt?: string;
  updatedAt?: string;
  clientSecret?: string;
}

export interface PaymentMethod {
  id?: string;
  type?: string;
  card?: Card;
  billing?: Shipping;
  customerId?: string;
}
