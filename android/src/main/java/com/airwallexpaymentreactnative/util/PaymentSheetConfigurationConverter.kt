package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.PaymentMethodsLayoutType
import com.airwallex.android.view.composables.PaymentElementConfiguration
import com.facebook.react.bridge.ReadableMap

object PaymentSheetConfigurationConverter {
  fun fromReadableMap(map: ReadableMap?): PaymentElementConfiguration.PaymentSheet {
    val layout = when (map?.getStringOrNull("layout")?.lowercase()) {
      "accordion" -> PaymentMethodsLayoutType.ACCORDION
      else -> PaymentMethodsLayoutType.TAB
    }
    val checkoutButtonTitle = map?.getMapOrNull("checkoutButton")?.getStringOrNull("title")
    val checkoutButton = checkoutButtonTitle?.let { PaymentElementConfiguration.CheckoutButton(it) }
      ?: PaymentElementConfiguration.CheckoutButton()
    return PaymentElementConfiguration.PaymentSheet(layout = layout, checkoutButton = checkoutButton)
  }
}
