package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.model.Address
import com.airwallex.android.core.model.Shipping
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.getStringSafe(key: String): String? =
  if (hasKey(key)) getString(key) else null

fun ReadableMap.getBooleanSafe(key: String, defaultValue: Boolean = false): Boolean =
  if (hasKey(key)) getBoolean(key) else defaultValue

fun ReadableMap.getBooleanOrNullSafe(key: String): Boolean? =
  if (hasKey(key)) getBoolean(key) else null

fun ReadableMap.getDoubleSafe(key: String, defaultValue: Double = 0.0): Double =
  if (hasKey(key)) getDouble(key) else defaultValue

fun ReadableMap.getArraySafe(key: String): ReadableArray? =
  if (hasKey(key)) getArray(key) else null

fun ReadableMap.getMapSafe(key: String): ReadableMap? =
  if (hasKey(key)) getMap(key) else null

fun ReadableMap.toShipping(): Shipping? {
  val firstName = getStringSafe("firstName")
  val lastName = getStringSafe("lastName")
  val phone = getStringSafe("phoneNumber")
  val email = getStringSafe("email")
  val shippingMethod = getStringSafe("shippingMethod")
  val address = getMapSafe("address")?.toAddress()

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

fun ReadableMap.toAddress(): Address? {
  val countryCode = getStringSafe("countryCode")
  val state = getStringSafe("state")
  val city = getStringSafe("city")
  val street = getStringSafe("street")
  val postcode = getStringSafe("postcode")

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

