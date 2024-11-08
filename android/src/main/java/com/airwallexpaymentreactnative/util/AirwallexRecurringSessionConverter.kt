package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexRecurringSession
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexRecurringSessionConverter {

  fun fromReadableMap(
    sessionMap: ReadableMap
  ): AirwallexRecurringSession {
    val nextTriggerBy = sessionMap.toNextTriggeredBy() ?: error("nextTriggeredBy is error")

    val clientSecret =
      sessionMap.getStringOrNull("clientSecret") ?: error("clientSecret is required")

    val requiresCVC = sessionMap.getBooleanOrDefault("requiresCVC", false)

    val merchantTriggerReason = sessionMap.toMerchantTriggerReason()

    val currency = sessionMap.getStringOrNull("currency") ?: error("currency is required")

    val countryCode = sessionMap.getStringOrNull("countryCode") ?: error("countryCode is required")

    val amount = sessionMap.getDoubleOrDefault("amount", -1.0).let {
      if (it == -1.0) error("amount is required")
      BigDecimal.valueOf(it)
    }

    val customerId = sessionMap.getStringOrNull("customerId") ?: error("customerId is required")

    val returnUrl = sessionMap.getStringOrNull("returnUrl")

    val shipping = sessionMap.getMapOrNull("shipping")?.toShipping()

    val isBillingRequired = sessionMap.getBooleanOrDefault("isBillingRequired", true)

    val paymentMethods =
      sessionMap.getArrayOrNull("paymentMethods")?.toArrayList()?.map { it.toString() }

    val isEmailRequired = sessionMap.getBooleanOrDefault("isEmailRequired", false)

    val sessionBuilder = AirwallexRecurringSession.Builder(
      customerId = customerId,
      currency = currency,
      amount = amount,
      nextTriggerBy = nextTriggerBy,
      countryCode = countryCode,
      clientSecret = clientSecret
    )
      .setShipping(shipping)
      .setRequireBillingInformation(isBillingRequired)
      .setRequireCvc(requiresCVC)
      .setReturnUrl(returnUrl)
      .setRequireEmail(isEmailRequired)
      .setPaymentMethods(paymentMethods)

    merchantTriggerReason?.let {
      sessionBuilder.setMerchantTriggerReason(merchantTriggerReason)
    }
    return sessionBuilder.build()
  }
}
