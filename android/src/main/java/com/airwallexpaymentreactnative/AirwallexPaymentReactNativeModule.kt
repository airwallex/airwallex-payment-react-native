package com.airwallexpaymentreactnative

import androidx.activity.ComponentActivity
import com.airwallex.android.AirwallexStarter
import com.airwallex.android.core.Airwallex
import com.airwallex.android.core.AirwallexPaymentStatus
import com.airwallexpaymentreactnative.util.AirwallexPaymentSessionConverter
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap


class AirwallexPaymentReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "AirwallexSdk"
  }

  @ReactMethod
  fun presentPaymentFlow(clientSecret: String, session: ReadableMap, environment: String, promise: Promise) {
    val currentActivity = getCurrentActivity()
    if (currentActivity == null || currentActivity !is ComponentActivity) {
      promise.reject("payment_failure", "Current activity is not a ComponentActivity")
      return
    }
    try {
      val paymentSession = AirwallexPaymentSessionConverter.fromReadableMap(session)
      AirwallexStarter.presentEntirePaymentFlow(
        currentActivity,
        paymentSession,
        object : Airwallex.PaymentResultListener {
          override fun onCompleted(status: AirwallexPaymentStatus) {
            when (status) {
              is AirwallexPaymentStatus.Failure -> {
                promise.reject("payment_failure", status.exception.localizedMessage)
              }
              else -> {
                val resultData = mapAirwallexPaymentStatusToResult(status)
                promise.resolve(resultData)
              }
            }
          }
        }
      )
    } catch (e: Exception) {
      promise.reject("payment_failure", e.message, e)
    }
  }

  private fun mapAirwallexPaymentStatusToResult(status: AirwallexPaymentStatus): WritableMap {
    val map = Arguments.createMap()
    when (status) {
      is AirwallexPaymentStatus.Success -> {
        map.putString("status", "success")
        map.putString("paymentConsentId", status.consentId)
        map.putString("paymentIntentId", status.paymentIntentId)
      }

      is AirwallexPaymentStatus.InProgress -> {
        map.putString("status", "inProgress")
        map.putString("paymentIntentId", status.paymentIntentId)
      }

      else -> {
        map.putString("status", "cancelled")
      }
    }
    return map
  }
}
