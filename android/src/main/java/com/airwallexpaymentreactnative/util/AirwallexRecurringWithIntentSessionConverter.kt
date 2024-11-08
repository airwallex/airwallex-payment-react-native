package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexRecurringWithIntentSession
import com.airwallex.android.core.model.PaymentIntent
import com.airwallex.android.core.model.PurchaseOrder
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexRecurringWithIntentSessionConverter {

  fun fromReadableMap(
    sessionMap: ReadableMap,
  ): AirwallexRecurringWithIntentSession {
    val paymentIntentId = sessionMap.getStringOrNull("paymentIntentId")
      ?: error("paymentIntentId is required")

    val clientSecret = sessionMap.getStringOrNull("clientSecret")
      ?: error("clientSecret is required")

    val nextTriggerBy = sessionMap.toNextTriggeredBy()?: error("nextTriggeredBy is error")

    val currency = sessionMap.getStringOrNull("currency")
      ?: error("currency is required")

    val countryCode = sessionMap.getStringOrNull("countryCode")
      ?: error("countryCode is required")

    val amount = sessionMap.getDoubleOrDefault("amount", -1.0).let {
      if (it == -1.0) error("amount is required")
      BigDecimal.valueOf(it)
    }

    val customerId = sessionMap.getStringOrNull("customerId")
      ?: error("customerId is required")

    val returnUrl = sessionMap.getStringOrNull("returnUrl")
    val requiresCVC = sessionMap.getBooleanOrDefault("requiresCVC", false)
    val merchantTriggerReason = sessionMap.toMerchantTriggerReason()?: error("merchantTriggerReason is error")
    val paymentMethods = sessionMap.getArrayOrNull("paymentMethods")
      ?.toArrayList()?.map { it.toString() }

    val shipping = sessionMap.getMapOrNull("shipping")?.toShipping()
    val isBillingRequired = sessionMap.getBooleanOrDefault("isBillingRequired", true)
    val isEmailRequired = sessionMap.getBooleanOrDefault("isEmailRequired", false)
    val autoCapture = sessionMap.getBooleanOrDefault("autoCapture", true)

    val order = shipping?.let {
      PurchaseOrder(shipping = it)
    }

    val paymentIntent = PaymentIntent(
      id = paymentIntentId,
      amount = amount,
      currency = currency,
      customerId = customerId,
      order = order,
      clientSecret = clientSecret
    )

    return AirwallexRecurringWithIntentSession.Builder(
      paymentIntent = paymentIntent,
      nextTriggerBy = nextTriggerBy,
      customerId = customerId,
      countryCode = countryCode
    )
      .setRequireCvc(requiresCVC)
      .setMerchantTriggerReason(merchantTriggerReason)
      .setPaymentMethods(paymentMethods)
      .setRequireBillingInformation(isBillingRequired)
      .setRequireEmail(isEmailRequired)
      .setReturnUrl(returnUrl)
      .setAutoCapture(autoCapture)
      .build()
  }
}

