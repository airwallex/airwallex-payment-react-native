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
    return PaymentElementConfiguration.PaymentSheet(layout = layout)
  }
}
