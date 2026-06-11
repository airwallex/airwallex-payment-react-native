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
}
