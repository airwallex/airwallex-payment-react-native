package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.model.PaymentMethod
import com.facebook.react.bridge.ReadableMap

object PaymentCardConverter {
  fun fromReadableMap(cardMap: ReadableMap): PaymentMethod.Card {
    return PaymentMethod.Card.Builder()
      .setCvc(cardMap.getStringOrNull("cvc"))
      .setExpiryMonth(cardMap.getStringOrNull("expiryMonth"))
      .setExpiryYear(cardMap.getStringOrNull("expiryYear"))
      .setName(cardMap.getStringOrNull("name"))
      .setNumber(cardMap.getStringOrNull("number"))
      .setBin(cardMap.getStringOrNull("bin"))
      .setLast4(cardMap.getStringOrNull("last4"))
      .setBrand(cardMap.getStringOrNull("brand"))
      .setCountry(cardMap.getStringOrNull("country"))
      .setFunding(cardMap.getStringOrNull("funding"))
      .setFingerprint(cardMap.getStringOrNull("fingerprint"))
      .setCvcCheck(cardMap.getStringOrNull("cvcCheck"))
      .setAvsCheck(cardMap.getStringOrNull("avsCheck"))
      .setIssuerCountryCode(cardMap.getStringOrNull("issuerCountryCode"))
      .setCardType(cardMap.getStringOrNull("cardType"))
      .setNumberType(cardMap.toNumberType())
      .build()
  }
}
