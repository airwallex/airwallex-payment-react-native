package com.airwallexpaymentreactnative

import androidx.activity.ComponentActivity
import com.airwallex.android.AirwallexStarter
import com.airwallex.android.core.Airwallex
import com.airwallex.android.core.AirwallexPaymentStatus
import com.airwallexpaymentreactnative.util.AirwallexPaymentSessionConverter
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap


class AirwallexPaymentReactNativeModule(reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  override fun getName(): String {
    return "AirwallexSdk"
  }

  @ReactMethod
  fun presentPaymentFlow(clientSecret: String, session: ReadableMap, environment: String, promise: Promise) {
    val currentActivity = getCurrentActivity()
    if (currentActivity == null || currentActivity !is ComponentActivity) {
      promise.reject("E_INVALID_ACTIVITY", "Current activity is not a ComponentActivity")
      return
    }
    try {
      val paymentSession = AirwallexPaymentSessionConverter.fromReadableMap(session)
      AirwallexStarter.presentEntirePaymentFlow(
        currentActivity,
        paymentSession,
        object : Airwallex.PaymentResultListener {
          override fun onCompleted(status: AirwallexPaymentStatus) {
            promise.resolve("Payment flow presented")
          }
        }
      )
    } catch (e: Exception) {
      promise.reject("E_FLOW_ERROR", e.message, e)
    }
  }
}
