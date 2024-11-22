package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.model.PaymentConsent
import com.airwallex.android.core.model.PaymentMethod
import com.facebook.react.bridge.ReadableMap
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

object PaymentConsentConverter {

  fun fromReadableMap(
    sessionMap: ReadableMap
  ): PaymentConsent {
    return sessionMap.toPaymentConsent()
  }

  private fun ReadableMap.toPaymentConsent(): PaymentConsent {
    val id = getStringOrNull("id")
    val requestId = getStringOrNull("request_id") ?: getStringOrNull("requestId")
    val customerId = getStringOrNull("customer_id") ?: getStringOrNull("customerId")
    val nextTriggeredBy = toNextTriggeredBy()
    val merchantTriggerReason = toMerchantTriggerReason()
    val requiresCvc = getBooleanOrDefault("requires_cvc", false)
    val status = toPaymentConsentStatus()
    val createdAt =
      (getStringOrNull("created_at") ?: getStringOrNull("createdAt"))?.let { parseDateString(it) }
    val updatedAt =
      (getStringOrNull("updated_at") ?: getStringOrNull("updatedAt"))?.let { parseDateString(it) }
    val clientSecret = getStringOrNull("client_secret") ?: getStringOrNull("clientSecret")

    val paymentMethod =
      (getMapOrNull("payment_method") ?: getMapOrNull("paymentMethod"))?.toPaymentMethod()
    val initialPaymentIntentId = getStringOrNull("initial_payment_intent_id")
    val metadata = getMapOrNull("metadata")?.toHashMap() as? Map<String, Any?>

    return PaymentConsent(
      id = id,
      requestId = requestId,
      customerId = customerId,
      paymentMethod = paymentMethod,
      status = status,
      nextTriggeredBy = nextTriggeredBy,
      merchantTriggerReason = merchantTriggerReason,
      requiresCvc = requiresCvc,
      createdAt = createdAt,
      updatedAt = updatedAt,
      clientSecret = clientSecret,
      //Fields that are not needed for now will be implemented later.
      initialPaymentIntentId = null,
      metadata = null,
      nextAction = null,
    )
  }

  private fun ReadableMap.toPaymentMethod(): PaymentMethod {
    val id = getStringOrNull("id") ?: error("paymentMethod id is required")
    val customerId = getStringOrNull("customer_id") ?: getStringOrNull("customerId")
    val type = getStringOrNull("type") ?: error("paymentMethod type is required")
    val card = getMapOrNull("card")?.let { PaymentCardConverter.fromReadableMap(it) }
    val billing = getMapOrNull("billing")?.toBilling()

    val requestId = getStringOrNull("request_id") ?: getStringOrNull("requestId")
    return PaymentMethod.Builder()
      .setId(id)
      .setCustomerId(customerId)
      .setType(type)
      .setCard(card)
      .setBilling(billing)
      //Fields that are not needed for now will be implemented later.
      .setRequestId(null)
      .setStatus(null)
      .setMetadata(null)
      .setCreatedAt(null)
      .setUpdatedAt(null)
      .build()
  }

  private fun parseDateString(dateString: String): Date? {
    val dateFormat = SimpleDateFormat("yyyy-MM-dd'T'hh:mm:ssZ", Locale.getDefault())
    return dateFormat.parse(dateString)
  }
}
