/**
 * The payment completed successfully. If a payment consent was created during the
 * flow, its id is returned in `paymentConsentId`.
 */
interface PaymentSuccessResult {
  status: 'success';
  paymentConsentId?: string;
}

/**
 * The payment has been submitted but its final outcome is not yet known.
 * The merchant should poll the payment intent or wait for a webhook to confirm the result.
 */
interface PaymentInProgressResult {
  status: 'inProgress';
}

/**
 * The customer cancelled the payment flow before it completed.
 */
interface PaymentCancelledResult {
  status: 'cancelled';
}

/**
 * The outcome of a payment flow. Discriminated by `status`:
 * `'success'`, `'inProgress'`, or `'cancelled'`.
 *
 * Errors are not represented here — they are surfaced by the returned promise rejecting.
 */
export type PaymentResult =
  | PaymentSuccessResult
  | PaymentInProgressResult
  | PaymentCancelledResult;
