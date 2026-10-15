/**
 * How payment methods are arranged on the payment sheet.
 *
 * - `'tab'` — payment methods shown as horizontally-scrollable tabs.
 * - `'accordion'` — payment methods stacked vertically, expanding on tap.
 */
export type PaymentLayout = 'tab' | 'accordion';

/**
 * Optional UI configuration for the payment sheet shown by {@link presentEntirePaymentFlow}.
 */
export interface PaymentSheetConfiguration {
  layout: PaymentLayout;
  /** Customizes the checkout button at the bottom of the payment sheet. */
  checkoutButton?: CheckoutButtonConfiguration;
}

/**
 * Checkout button options for the payment sheet.
 */
export interface CheckoutButtonConfiguration {
  /**
   * Custom button title, e.g. `'Pay HKD 50.00'`. When omitted, the SDK uses its default:
   * "Pay" for one-off payments and "Confirm" for recurring ones.
   */
  title?: string;
}
