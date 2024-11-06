package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexRecurringSession
import com.airwallex.android.core.model.PaymentConsent
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexRecurringSessionConverter {

  fun fromReadableMap(
    sessionMap: ReadableMap
  ): AirwallexRecurringSession {
    val nextTriggerBy = sessionMap.getStringSafe("nextTriggeredBy")?.let {
      toNextTriggeredBy(it) ?: error("Invalid NextTriggeredBy value")
    } ?: error("nextTriggeredBy is required")

    val clientSecret = sessionMap.getStringSafe("clientSecret") ?: error("clientSecret is required")

    val requiresCVC = sessionMap.getBooleanSafe("requiresCVC", false)

    val merchantTriggerReason = sessionMap.getStringSafe("merchantTriggerReason")?.let {
      toMerchantTriggerReason(it) ?: error("Invalid MerchantTriggerReason value")
    } ?: PaymentConsent.MerchantTriggerReason.UNSCHEDULED

    val currency = sessionMap.getStringSafe("currency") ?: error("currency is required")

    val countryCode = sessionMap.getStringSafe("countryCode") ?: error("countryCode is required")

    val amount = sessionMap.getDoubleSafe("amount", -1.0).let {
      if (it == -1.0) error("amount is required")
      BigDecimal.valueOf(it)
    }

    val customerId = sessionMap.getStringSafe("customerId") ?: error("customerId is required")

    val returnUrl = sessionMap.getStringSafe("returnUrl")

    val shipping = sessionMap.getMapSafe("shipping")?.toShipping()

    val isBillingRequired = sessionMap.getBooleanSafe("isBillingRequired", true)

    val paymentMethods =
      sessionMap.getArraySafe("paymentMethods")?.toArrayList()?.map { it.toString() }

    val isEmailRequired = sessionMap.getBooleanSafe("isEmailRequired", false)

    return AirwallexRecurringSession.Builder(
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
      .setMerchantTriggerReason(merchantTriggerReason)
      .setReturnUrl(returnUrl)
      .setRequireEmail(isEmailRequired)
      .setPaymentMethods(paymentMethods)
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
