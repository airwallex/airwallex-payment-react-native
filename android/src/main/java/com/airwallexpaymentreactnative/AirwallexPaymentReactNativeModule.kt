package com.airwallexpaymentreactnative

import android.app.Application
import android.os.Looper
import androidx.activity.ComponentActivity
import com.airwallex.android.AirwallexStarter
import com.airwallex.android.card.CardComponent
import com.airwallex.android.core.Airwallex
import com.airwallex.android.core.AirwallexConfiguration
import com.airwallex.android.core.AirwallexPaymentSession
import com.airwallex.android.core.AirwallexPaymentStatus
import com.airwallex.android.core.AirwallexSession
import com.airwallex.android.core.Environment
import com.airwallex.android.core.log.AirwallexLogger
import com.airwallex.android.googlepay.GooglePayComponent
import com.airwallex.android.redirect.RedirectComponent
import com.airwallex.android.wechat.WeChatComponent
import com.airwallexpaymentreactnative.util.AirwallexPaymentSessionConverter
import com.airwallexpaymentreactnative.util.AirwallexRecurringSessionConverter
import com.airwallexpaymentreactnative.util.AirwallexRecurringWithIntentSessionConverter
import com.airwallexpaymentreactnative.util.PaymentCardConverter
import com.airwallexpaymentreactnative.util.PaymentConsentConverter
import com.airwallexpaymentreactnative.util.getStringOrNull
import com.facebook.react.bridge.Arguments
import com.facebook.react.bridge.Promise
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.ReadableMap
import com.facebook.react.bridge.WritableMap


class AirwallexPaymentReactNativeModule(private val reactContext: ReactApplicationContext) :
  ReactContextBaseJavaModule(reactContext) {

  private lateinit var airwallex: Airwallex

  override fun getName(): String {
    return "AirwallexSdk"
  }

  fun getApplication(): Application? {
    return reactContext.currentActivity?.application
  }

  @ReactMethod
  fun initialize(
    environment: String,
    enableLogging: Boolean,
    saveLogToLocal: Boolean,
    promise: Promise
  ) {
    try {
      AirwallexLogger.info("AirwallexPaymentSdkModule: initialize, environment = $environment, enableLogging = $enableLogging, saveLogToLocal = $saveLogToLocal")
      getApplication()?.let { application ->
        runOnMain {
          AirwallexStarter.initialize(
            application,
            AirwallexConfiguration.Builder()
              .enableLogging(enableLogging)
              .saveLogToLocal(saveLogToLocal)
              .setEnvironment(getEnvironment(environment))
              .setSupportComponentProviders(
                listOf(
                  CardComponent.PROVIDER,
                  WeChatComponent.PROVIDER,
                  RedirectComponent.PROVIDER,
                  GooglePayComponent.PROVIDER
                )
              )
              .build()
          )
          promise.resolve(null)
        }
      } ?: run {
        promise.reject("initialize_failure", "Application is null")
      }
    } catch (e: Exception) {
      promise.reject("initialize_failure", e.message, e)
    }
  }

  @ReactMethod
  fun presentEntirePaymentFlow(session: ReadableMap, promise: Promise) {
    val currentActivity = requireComponentActivity(promise) ?: return
    try {
      val paymentSession = parseSessionFromMap(session)
      AirwallexStarter.presentEntirePaymentFlow(
        currentActivity,
        paymentSession,
        paymentResultListener = object : Airwallex.PaymentResultListener {
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

  @ReactMethod
  fun presentCardPaymentFlow(session: ReadableMap, promise: Promise) {
    val currentActivity = requireComponentActivity(promise) ?: return
    try {
      val paymentSession = parseSessionFromMap(session)
      AirwallexStarter.presentCardPaymentFlow(
        currentActivity,
        paymentSession,
        paymentResultListener = object : Airwallex.PaymentResultListener {
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

  @ReactMethod
  fun startGooglePay(session: ReadableMap, promise: Promise) {
    val currentActivity = requireComponentActivity(promise) ?: return
    try {
      runWithAirwallex(currentActivity) {
        val paymentSession = parseSessionFromMap(session)
        airwallex.startGooglePay(
          paymentSession as AirwallexPaymentSession,
          listener = object : Airwallex.PaymentResultListener {
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
      }
    } catch (e: Exception) {
      promise.reject("payment_failure", e.message, e)
    }
  }

  @ReactMethod
  fun payWithCardDetails(
    session: ReadableMap,
    card: ReadableMap,
    saveCard: Boolean,
    promise: Promise
  ) {
    val currentActivity = requireComponentActivity(promise) ?: return
    try {
      runWithAirwallex(currentActivity) {
        val paymentSession = parseSessionFromMap(session)
        val paymentCard = PaymentCardConverter.fromReadableMap(card)
        airwallex.confirmPaymentIntent(
          session = paymentSession,
          card = paymentCard,
          billing = null,
          saveCard = saveCard,
          listener = object : Airwallex.PaymentResultListener {
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
      }
    } catch (e: Exception) {
      promise.reject("payment_failure", e.message, e)
    }
  }

  @ReactMethod
  fun payWithConsent(
    session: ReadableMap,
    paymentConsentMap: ReadableMap,
    promise: Promise
  ) {
    val currentActivity = requireComponentActivity(promise) ?: return
    try {
      runWithAirwallex(currentActivity) {
        val paymentSession = parseSessionFromMap(session)
        val paymentConsent = PaymentConsentConverter.fromReadableMap(paymentConsentMap)
        airwallex.confirmPaymentIntent(
          session = paymentSession as AirwallexPaymentSession,
          paymentConsent = paymentConsent,
          listener = object : Airwallex.PaymentResultListener {
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
      }
    } catch (e: Exception) {
      promise.reject("payment_failure", e.message, e)
    }
  }

  private fun requireComponentActivity(promise: Promise): ComponentActivity? {
    val currentActivity = reactContext.currentActivity
    if (currentActivity == null || currentActivity !is ComponentActivity) {
      promise.reject("activity_error", "Current activity is not a ComponentActivity")
      return null
    }
    return currentActivity
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

  private fun getEnvironment(environment: String?): Environment {
    val defaultEnvironment = if (BuildConfig.DEBUG) Environment.DEMO else Environment.PRODUCTION
    return when (environment) {
      Environment.STAGING.value -> Environment.STAGING
      Environment.DEMO.value -> Environment.DEMO
      Environment.PRODUCTION.value -> Environment.PRODUCTION
      else -> defaultEnvironment
    }
  }

  private fun runOnMain(action: () -> Unit) {
    val mainHandler = android.os.Handler(Looper.getMainLooper())
    mainHandler.post(action)
  }

  private fun runWithAirwallex(activity: ComponentActivity, block: () -> Unit) {
    if (!::airwallex.isInitialized) {
      airwallex = Airwallex(activity)
    }
    block()
  }

  private fun parseSessionFromMap(sessionMap: ReadableMap): AirwallexSession {
    val type = sessionMap.getStringOrNull("type") ?: error("type is required")
    return when (type) {
      "OneOff" -> {
        AirwallexPaymentSessionConverter.fromReadableMap(sessionMap)
      }

      "Recurring" -> {
        AirwallexRecurringSessionConverter.fromReadableMap(sessionMap)
      }

      "RecurringWithIntent" -> {
        AirwallexRecurringWithIntentSessionConverter.fromReadableMap(sessionMap)
      }

      else -> {
        error("Unsupported session type: $type")
      }
    }
  }
}
