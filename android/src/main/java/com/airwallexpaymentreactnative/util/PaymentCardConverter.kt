package com.airwallexpaymentreactnative.util

import com.airwallex.android.core.model.PaymentMethod
import com.facebook.react.bridge.ReadableMap

object PaymentCardConverter {
  fun fromReadableMap(cardMap: ReadableMap): PaymentMethod.Card {
    return PaymentMethod.Card.Builder()
      .setCvc(cardMap.getStringSafe("cvc"))
      .setExpiryMonth(cardMap.getStringSafe("expiryMonth"))
      .setExpiryYear(cardMap.getStringSafe("expiryYear"))
      .setName(cardMap.getStringSafe("name"))
      .setNumber(cardMap.getStringSafe("number"))
      .setBin(cardMap.getStringSafe("bin"))
      .setLast4(cardMap.getStringSafe("last4"))
      .setBrand(cardMap.getStringSafe("brand"))
      .setCountry(cardMap.getStringSafe("country"))
      .setFunding(cardMap.getStringSafe("funding"))
      .setFingerprint(cardMap.getStringSafe("fingerprint"))
      .setCvcCheck(cardMap.getStringSafe("cvcCheck"))
      .setAvsCheck(cardMap.getStringSafe("avsCheck"))
      .setIssuerCountryCode(cardMap.getStringSafe("issuerCountryCode"))
      .setCardType(cardMap.getStringSafe("cardType"))
      .build()
  }
}
