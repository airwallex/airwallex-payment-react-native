package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.model.PaymentMethod
import com.facebook.react.bridge.ReadableMap

object PaymentCardConverter {
  fun fromReadableMap(cardMap: ReadableMap): PaymentMethod.Card {
    return PaymentMethod.Card.Builder()
      .setCvc(cardMap.getStringOrNull("cvc"))
      .setExpiryMonth(
        cardMap.getStringOrNull("expiry_month") ?: cardMap.getStringOrNull("expiryMonth")
      )
      .setExpiryYear(
        cardMap.getStringOrNull("expiry_year") ?: cardMap.getStringOrNull("expiryYear")
      )
      .setName(cardMap.getStringOrNull("name"))
      .setNumber(cardMap.getStringOrNull("number"))
      .setBin(cardMap.getStringOrNull("bin"))
      .setLast4(cardMap.getStringOrNull("last4"))
      .setBrand(cardMap.getStringOrNull("brand"))
      .setCountry(cardMap.getStringOrNull("country"))
      .setFunding(cardMap.getStringOrNull("funding"))
      .setFingerprint(cardMap.getStringOrNull("fingerprint"))
      .setCvcCheck(cardMap.getStringOrNull("cvc_check") ?: cardMap.getStringOrNull("cvcCheck"))
      .setAvsCheck(cardMap.getStringOrNull("avs_check") ?: cardMap.getStringOrNull("avsCheck"))
      .setIssuerCountryCode(
        cardMap.getStringOrNull("issuer_country_code")
          ?: cardMap.getStringOrNull("issuerCountryCode")
      )
      .setCardType(cardMap.getStringOrNull("card_type") ?: cardMap.getStringOrNull("cardType"))
      .setNumberType(cardMap.toNumberType())
      .build()
  }
}
