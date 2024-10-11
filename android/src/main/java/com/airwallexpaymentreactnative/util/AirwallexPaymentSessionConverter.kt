package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexPaymentSession
import com.airwallex.android.core.model.Address
import com.airwallex.android.core.model.PaymentIntent
import com.airwallex.android.core.model.PurchaseOrder
import com.airwallex.android.core.model.Shipping
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexPaymentSessionConverter {

  fun fromReadableMap(sessionMap: ReadableMap): AirwallexPaymentSession {
    val customerId = sessionMap.getString("customerId")
    val clientSecret = sessionMap.getString("clientSecret")
    val returnUrl = sessionMap.getString("returnUrl")
    val paymentMethods = sessionMap.getArray("paymentMethods")?.toArrayList()?.map { it.toString() }
    val autoCapture = sessionMap.getBoolean("autoCapture") ?: true
    val hidePaymentConsents = sessionMap.getBoolean("hidePaymentConsents") ?: false
    val isBillingRequired = sessionMap.getBoolean("isBillingRequired") ?: true
    val isEmailRequired = sessionMap.getBoolean("isEmailRequired") ?: false

    val shipping = sessionMap.getMap("shipping")?.toShipping()
    val amount = BigDecimal(sessionMap.getDouble("amount").toString())
    val currency = sessionMap.getString("currency") ?: throw IllegalArgumentException("currency is required")
    val countryCode = sessionMap.getString("countryCode") ?: throw IllegalArgumentException("countryCode is required")

    val paymentIntentId = sessionMap.getString("paymentIntentId") ?: throw IllegalArgumentException("paymentIntentId is required")

    val order = shipping?.let {
      PurchaseOrder(
        shipping = it
      )
    }

    val paymentIntent = PaymentIntent(
      id = paymentIntentId,
      amount = amount,
      currency = currency,
      customerId = if (customerId.isNullOrEmpty()) null else customerId,
      order = order,
      clientSecret = clientSecret
    )

    return AirwallexPaymentSession.Builder(
      paymentIntent = paymentIntent,
      countryCode = countryCode
    ).setRequireBillingInformation(isBillingRequired)
      .setRequireEmail(isEmailRequired)
      .setReturnUrl(returnUrl)
      .setAutoCapture(autoCapture)
      .setHidePaymentConsents(hidePaymentConsents)
      .setPaymentMethods(paymentMethods)
      .build()
  }

  private fun ReadableMap.toShipping(): Shipping? {
    val firstName = getString("firstName")
    val lastName = getString("lastName")
    val phone = getString("phoneNumber")
    val email = getString("email")
    val shippingMethod = getString("shippingMethod")
    val address = getMap("address")?.toAddress()

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
    val countryCode = getString("countryCode")
    val state = getString("state")
    val city = getString("city")
    val street = getString("street")
    val postcode = getString("postcode")

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
}
