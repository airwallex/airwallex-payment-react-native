package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.AirwallexPaymentSession
import com.airwallex.android.core.BillingAddressParameters
import com.airwallex.android.core.GooglePayOptions
import com.airwallex.android.core.ShippingAddressParameters
import com.airwallex.android.core.googlePaySupportedNetworks
import com.airwallex.android.core.model.PaymentIntent
import com.airwallex.android.core.model.PurchaseOrder
import com.facebook.react.bridge.ReadableMap
import java.math.BigDecimal

object AirwallexPaymentSessionConverter {

  fun fromReadableMap(sessionMap: ReadableMap): AirwallexPaymentSession {
    val googlePayOptions = sessionMap.getMapOrNull("googlePayOptions")?.toGooglePayOptions()
    val customerId = sessionMap.getStringOrNull("customerId")
    val clientSecret = sessionMap.getStringOrNull("clientSecret") ?: error("clientSecret is required")
    val returnUrl = sessionMap.getStringOrNull("returnUrl")
    val paymentMethods =
      sessionMap.getArrayOrNull("paymentMethods")?.toArrayList()?.map { it.toString() }
    val autoCapture = sessionMap.getBooleanOrDefault("autoCapture", true)
    val hidePaymentConsents = sessionMap.getBooleanOrDefault("hidePaymentConsents", false)
    val isBillingRequired = sessionMap.getBooleanOrDefault("isBillingRequired", true)
    val isEmailRequired = sessionMap.getBooleanOrDefault("isEmailRequired", false)

    val shipping = sessionMap.getMapOrNull("shipping")?.toShipping()

    val amount = sessionMap.getDoubleOrDefault("amount", -1.0).let {
      if (it == -1.0) error("amount is required")
      BigDecimal.valueOf(it)
    }

    val currency = sessionMap.getStringOrNull("currency") ?: error("Currency is required")
    val countryCode = sessionMap.getStringOrNull("countryCode") ?: error("Country code is required")
    val paymentIntentId =
      sessionMap.getStringOrNull("paymentIntentId") ?: error("PaymentIntentId is required")

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
    val billingAddressParametersMap = getMapOrNull("billingAddressParameters")
    val shippingAddressParametersMap = getMapOrNull("shippingAddressParameters")

    val billingAddressParameters = billingAddressParametersMap?.toBillingAddressParameters()
    val shippingAddressParameters = shippingAddressParametersMap?.toShippingAddressParameters()

    return GooglePayOptions(
      allowedCardAuthMethods = getArrayOrNull("allowedCardAuthMethods")?.toArrayList()
        ?.map { it.toString() },
      merchantName = getStringOrNull("merchantName"),
      allowPrepaidCards = getBooleanOrNull("allowPrepaidCards"),
      allowCreditCards = getBooleanOrNull("allowCreditCards"),
      assuranceDetailsRequired = getBooleanOrNull("assuranceDetailsRequired"),
      billingAddressRequired = getBooleanOrNull("billingAddressRequired"),
      billingAddressParameters = billingAddressParameters,
      transactionId = getStringOrNull("transactionId"),
      totalPriceLabel = getStringOrNull("totalPriceLabel"),
      checkoutOption = getStringOrNull("checkoutOption"),
      emailRequired = getBooleanOrNull("emailRequired"),
      shippingAddressRequired = getBooleanOrNull("shippingAddressRequired"),
      shippingAddressParameters = shippingAddressParameters,
      allowedCardNetworks = getArrayOrNull("allowedCardNetworks")?.toArrayList()
        ?.map { it.toString() }
        ?: googlePaySupportedNetworks(),
      skipReadinessCheck = getBooleanOrDefault("skipReadinessCheck")
    )
  }

  private fun ReadableMap.toBillingAddressParameters(): BillingAddressParameters {
    val formatStr = getStringOrNull("format")
    val format = when (formatStr?.lowercase()) {
      "min" -> BillingAddressParameters.Format.MIN
      "full" -> BillingAddressParameters.Format.FULL
      else -> throw IllegalArgumentException("Unknown format: $formatStr")
    }
    return BillingAddressParameters(
      format = format,
      phoneNumberRequired = getBooleanOrDefault("phoneNumberRequired")
    )
  }

  private fun ReadableMap.toShippingAddressParameters(): ShippingAddressParameters {
    return ShippingAddressParameters(
      allowedCountryCodes = getArrayOrNull("allowedCountryCodes")?.toArrayList()
        ?.map { it.toString() },
      phoneNumberRequired = getBooleanOrDefault("phoneNumberRequired")
    )
  }
}
