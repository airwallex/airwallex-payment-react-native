interface PaymentSuccessResult {
  status: 'success';
  paymentConsentId?: string;
}

interface PaymentInProgressResult {
  status: 'inProgress';
}

interface PaymentCancelledResult {
  status: 'cancelled';
}

export type PaymentResult =
  | PaymentSuccessResult
  | PaymentInProgressResult
  | PaymentCancelledResult;
