package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.model.Address
import com.airwallex.android.core.model.Billing
import com.airwallex.android.core.model.PaymentConsent
import com.airwallex.android.core.model.PaymentMethod
import com.airwallex.android.core.model.Shipping
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.getStringOrNull(key: String): String? =
  if (hasKey(key)) getString(key) else null

fun ReadableMap.getBooleanOrDefault(key: String, defaultValue: Boolean = false): Boolean =
  if (hasKey(key)) getBoolean(key) else defaultValue

fun ReadableMap.getBooleanOrNull(key: String): Boolean? =
  if (hasKey(key)) getBoolean(key) else null

fun ReadableMap.getDoubleOrDefault(key: String, defaultValue: Double = 0.0): Double =
  if (hasKey(key)) getDouble(key) else defaultValue

fun ReadableMap.getArrayOrNull(key: String): ReadableArray? =
  if (hasKey(key)) getArray(key) else null

fun ReadableMap.getMapOrNull(key: String): ReadableMap? =
  if (hasKey(key)) getMap(key) else null

fun ReadableMap.toShipping(): Shipping? {
  val firstName = getStringOrNull("firstName")
  val lastName = getStringOrNull("lastName")
  val phone = getStringOrNull("phoneNumber")
  val email = getStringOrNull("email")
  val shippingMethod = getStringOrNull("shippingMethod")
  val address = getMapOrNull("address")?.toAddress()

  return if (firstName == null && lastName == null && phone == null && email == null && shippingMethod == null && address == null) {
    null
  } else {
    Shipping.Builder().apply {
      setFirstName(firstName)
      setLastName(lastName)
      setPhone(phone)
      setEmail(email)
      setShippingMethod(shippingMethod)
      setAddress(address)
    }.build()
  }
}

fun ReadableMap.toBilling(): Billing? {
  val firstName = getStringOrNull("firstName")
  val lastName = getStringOrNull("lastName")
  val phone = getStringOrNull("phoneNumber")
  val email = getStringOrNull("email")
  val dateOfBirth = getStringOrNull("dateOfBirth")
  val address = getMapOrNull("address")?.toAddress()

  return if (firstName == null && lastName == null && phone == null && email == null && dateOfBirth == null && address == null) {
    null
  } else {
    Billing.Builder().apply {
      setFirstName(firstName)
      setLastName(lastName)
      setPhone(phone)
      setEmail(email)
      setDateOfBirth(dateOfBirth)
      setAddress(address)
    }.build()
  }
}

fun ReadableMap.toAddress(): Address? {
  val countryCode = getStringOrNull("countryCode")
  val state = getStringOrNull("state")
  val city = getStringOrNull("city")
  val street = getStringOrNull("street")
  val postcode = getStringOrNull("postcode")

  return if (countryCode == null && state == null && city == null && street == null && postcode == null) {
    null
  } else {
    Address.Builder().apply {
      setCountryCode(countryCode)
      setState(state)
      setCity(city)
      setStreet(street)
      setPostcode(postcode)
    }.build()
  }
}

fun ReadableMap.toNextTriggeredBy(): PaymentConsent.NextTriggeredBy? {
  val nextTriggeredBy = getStringOrNull("nextTriggeredBy") ?: ""
  return when (nextTriggeredBy.lowercase()) {
    "merchant" -> PaymentConsent.NextTriggeredBy.MERCHANT
    "customer" -> PaymentConsent.NextTriggeredBy.CUSTOMER
    else -> null
  }
}

fun ReadableMap.toMerchantTriggerReason(): PaymentConsent.MerchantTriggerReason? {
  val merchantTriggerReason = getStringOrNull("merchantTriggerReason") ?: ""
  return when (merchantTriggerReason.lowercase()) {
    "scheduled" -> PaymentConsent.MerchantTriggerReason.SCHEDULED
    "unscheduled" -> PaymentConsent.MerchantTriggerReason.UNSCHEDULED
    else -> null
  }
}

fun ReadableMap.toPaymentConsentStatus(): PaymentConsent.PaymentConsentStatus? {
  val statusString = getStringOrNull("status") ?: ""
  return when (statusString.lowercase()) {
    "pending_verification" -> PaymentConsent.PaymentConsentStatus.PENDING_VERIFICATION
    "verified" -> PaymentConsent.PaymentConsentStatus.VERIFIED
    "disabled" -> PaymentConsent.PaymentConsentStatus.DISABLED
    else -> null
  }
}

fun ReadableMap.toNumberType(): PaymentMethod.Card.NumberType? {
  val numberTypeString = getStringOrNull("numberType") ?: ""
  return when (numberTypeString.lowercase()) {
    "pan" -> PaymentMethod.Card.NumberType.PAN
    "external_network_token" -> PaymentMethod.Card.NumberType.EXTERNAL_NETWORK_TOKEN
    "airwallex_network_token" -> PaymentMethod.Card.NumberType.AIRWALLEX_NETWORK_TOKEN
    else -> null
  }
}
