package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexRecurringWithIntentSession
import com.airwallex.android.core.model.PaymentConsent
import com.airwallex.android.core.model.PaymentIntent
import com.airwallex.android.core.model.PurchaseOrder
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexRecurringWithIntentSessionConverter {

  fun fromReadableMap(
    sessionMap: ReadableMap,
  ): AirwallexRecurringWithIntentSession {
    val paymentIntentId = sessionMap.getStringSafe("paymentIntentId")
      ?: error("paymentIntentId is required")

    val clientSecret = sessionMap.getStringSafe("clientSecret")
      ?: error("clientSecret is required")

    val nextTriggerBy = sessionMap.getStringSafe("nextTriggeredBy")?.let {
      toNextTriggeredBy(it) ?: error("Invalid NextTriggeredBy value")
    } ?: error("nextTriggerBy is required")

    val currency = sessionMap.getStringSafe("currency")
      ?: error("currency is required")

    val countryCode = sessionMap.getStringSafe("countryCode")
      ?: error("countryCode is required")

    val amount = sessionMap.getDoubleSafe("amount", -1.0).let {
      if (it == -1.0) error("amount is required")
      BigDecimal.valueOf(it)
    }

    val customerId = sessionMap.getStringSafe("customerId")
      ?: error("customerId is required")

    val returnUrl = sessionMap.getStringSafe("returnUrl")
    val requiresCVC = sessionMap.getBooleanSafe("requiresCVC", false)
    val merchantTriggerReason = sessionMap.getStringSafe("merchantTriggerReason")?.let {
      toMerchantTriggerReason(it) ?: error("Invalid MerchantTriggerReason value")
    } ?: PaymentConsent.MerchantTriggerReason.UNSCHEDULED

    val paymentMethods = sessionMap.getArraySafe("paymentMethods")
      ?.toArrayList()?.map { it.toString() }

    val shipping = sessionMap.getMapSafe("shipping")?.toShipping()
    val isBillingRequired = sessionMap.getBooleanSafe("isBillingRequired", true)
    val isEmailRequired = sessionMap.getBooleanSafe("isEmailRequired", false)
    val autoCapture = sessionMap.getBooleanSafe("autoCapture", true)

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

  private fun toNextTriggeredBy(value: String): PaymentConsent.NextTriggeredBy? {
    return when (value.lowercase()) {
      "merchant" -> PaymentConsent.NextTriggeredBy.MERCHANT
      "customer" -> PaymentConsent.NextTriggeredBy.CUSTOMER
      else -> null
    }
  }

  private fun toMerchantTriggerReason(value: String): PaymentConsent.MerchantTriggerReason? {
    return when (value.lowercase()) {
      "scheduled" -> PaymentConsent.MerchantTriggerReason.SCHEDULED
      "unscheduled" -> PaymentConsent.MerchantTriggerReason.UNSCHEDULED
      else -> null
    }
  }
}

