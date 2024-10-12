package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexPaymentSession
import com.airwallex.android.core.BillingAddressParameters
import com.airwallex.android.core.GooglePayOptions
import com.airwallex.android.core.ShippingAddressParameters
import com.airwallex.android.core.googlePaySupportedNetworks
import com.airwallex.android.core.model.Address
import com.airwallex.android.core.model.PaymentIntent
import com.airwallex.android.core.model.PurchaseOrder
import com.airwallex.android.core.model.Shipping
import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexPaymentSessionConverter {

  fun fromReadableMap(sessionMap: ReadableMap): AirwallexPaymentSession {
    val googlePayOptions = sessionMap.getMapSafe("googlePayOptions")?.toGooglePayOptions()
    val customerId = sessionMap.getStringSafe("customerId")
    val clientSecret = sessionMap.getStringSafe("clientSecret")
    val returnUrl = sessionMap.getStringSafe("returnUrl")
    val paymentMethods =
      sessionMap.getArraySafe("paymentMethods")?.toArrayList()?.map { it.toString() }
    val autoCapture = sessionMap.getBooleanSafe("autoCapture", true)
    val hidePaymentConsents = sessionMap.getBooleanSafe("hidePaymentConsents", false)
    val isBillingRequired = sessionMap.getBooleanSafe("isBillingRequired", true)
    val isEmailRequired = sessionMap.getBooleanSafe("isEmailRequired", false)

    val shipping = sessionMap.getMapSafe("shipping")?.toShipping()
    val amount = sessionMap.getDoubleSafe("amount", 0.0)
    val currency = sessionMap.getStringSafe("currency") ?: error("Currency is required")
    val countryCode = sessionMap.getStringSafe("countryCode") ?: error("Country code is required")
    val paymentIntentId =
      sessionMap.getStringSafe("paymentIntentId") ?: error("PaymentIntentId is required")

    val order = shipping?.let {
      PurchaseOrder(shipping = it)
    }

    val paymentIntent = PaymentIntent(
      id = paymentIntentId,
      amount = BigDecimal(amount.toString()),
      currency = currency,
      customerId = customerId?.takeIf { it.isNotEmpty() },
      order = order,
      clientSecret = clientSecret
    )

    return AirwallexPaymentSession.Builder(
      paymentIntent = paymentIntent,
      countryCode = countryCode,
      googlePayOptions = googlePayOptions
    ).setRequireBillingInformation(isBillingRequired)
      .setRequireEmail(isEmailRequired)
      .setReturnUrl(returnUrl)
      .setAutoCapture(autoCapture)
      .setHidePaymentConsents(hidePaymentConsents)
      .setPaymentMethods(paymentMethods)
      .build()
  }

  private fun ReadableMap.toGooglePayOptions(): GooglePayOptions {
    val billingAddressParametersMap = getMapSafe("billingAddressParameters")
    val shippingAddressParametersMap = getMapSafe("shippingAddressParameters")

    val billingAddressParameters = billingAddressParametersMap?.toBillingAddressParameters()
    val shippingAddressParameters = shippingAddressParametersMap?.toShippingAddressParameters()

    return GooglePayOptions(
      allowedCardAuthMethods = getArraySafe("allowedCardAuthMethods")?.toArrayList()
        ?.map { it.toString() },
      merchantName = getStringSafe("merchantName"),
      allowPrepaidCards = getBooleanOrNullSafe("allowPrepaidCards"),
      allowCreditCards = getBooleanOrNullSafe("allowCreditCards"),
      assuranceDetailsRequired = getBooleanOrNullSafe("assuranceDetailsRequired"),
      billingAddressRequired = getBooleanOrNullSafe("billingAddressRequired"),
      billingAddressParameters = billingAddressParameters,
      transactionId = getStringSafe("transactionId"),
      totalPriceLabel = getStringSafe("totalPriceLabel"),
      checkoutOption = getStringSafe("checkoutOption"),
      emailRequired = getBooleanOrNullSafe("emailRequired"),
      shippingAddressRequired = getBooleanOrNullSafe("shippingAddressRequired"),
      shippingAddressParameters = shippingAddressParameters,
      allowedCardNetworks = getArraySafe("allowedCardNetworks")?.toArrayList()
        ?.map { it.toString() }
        ?: googlePaySupportedNetworks(),
      skipReadinessCheck = getBooleanSafe("skipReadinessCheck")
    )
  }

  private fun ReadableMap.toBillingAddressParameters(): BillingAddressParameters {
    val formatStr = getStringSafe("format")
    val format = when (formatStr?.lowercase()) {
      "min" -> BillingAddressParameters.Format.MIN
      "full" -> BillingAddressParameters.Format.FULL
      else -> throw IllegalArgumentException("Unknown format: $formatStr")
    }
    return BillingAddressParameters(
      format = format,
      phoneNumberRequired = getBooleanSafe("phoneNumberRequired")
    )
  }

  private fun ReadableMap.toShippingAddressParameters(): ShippingAddressParameters {
    return ShippingAddressParameters(
      allowedCountryCodes = getArraySafe("allowedCountryCodes")?.toArrayList()
        ?.map { it.toString() },
      phoneNumberRequired = getBooleanSafe("phoneNumberRequired")
    )
  }

  private fun ReadableMap.toShipping(): Shipping? {
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

  private fun ReadableMap.toAddress(): Address? {
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

  private fun ReadableMap.getStringSafe(key: String): String? =
    if (hasKey(key)) getString(key) else null

  private fun ReadableMap.getBooleanSafe(key: String, defaultValue: Boolean = false): Boolean =
    if (hasKey(key)) getBoolean(key) else defaultValue

  private fun ReadableMap.getBooleanOrNullSafe(key: String): Boolean? =
    if (hasKey(key)) getBoolean(key) else null

  private fun ReadableMap.getDoubleSafe(key: String, defaultValue: Double = 0.0): Double =
    if (hasKey(key)) getDouble(key) else defaultValue

  private fun ReadableMap.getArraySafe(key: String): ReadableArray? =
    if (hasKey(key)) getArray(key) else null

  private fun ReadableMap.getMapSafe(key: String): ReadableMap? =
    if (hasKey(key)) getMap(key) else null
}
