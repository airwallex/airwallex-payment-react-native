package com.airwallexpaymentreactnative

import android.app.Application
import android.content.ContentProvider
import android.content.ContentValues
import android.content.Context
import android.database.Cursor
import android.net.Uri
import com.airwallex.android.AirwallexStarter
import com.airwallex.android.card.CardComponent
import com.airwallex.android.core.Airwallex
import com.airwallex.android.core.AirwallexConfiguration
import com.airwallex.android.core.Environment
import com.airwallex.android.googlepay.GooglePayComponent
import com.airwallex.android.redirect.RedirectComponent
import com.airwallex.android.wechat.WeChatComponent

class AirwallexPaymentInitProvider : ContentProvider() {
  override fun onCreate(): Boolean {
    context?.let {
      val application = it as Application
      val environment = getEnvironment()
      initAirwallexStarter(application, environment)
      initAirwallex(application, environment)
    }
    return true
  }

  private fun initAirwallexStarter(application: Application, environment: Environment) {
    AirwallexStarter.initialize(
      application,
      AirwallexConfiguration.Builder()
        .enableLogging(true) // Enable log in sdk, best set to false in release version
        .saveLogToLocal(false)// Save the Airwallex logs locally. If you have your own saving strategy, please set this to false.
        .setEnvironment(environment)
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
  }

  private fun initAirwallex(application: Application, environment: Environment) {
    Airwallex.initialize(
      application,
      AirwallexConfiguration.Builder()
        .enableLogging(true) // Enable log in sdk, best set to false in release version
        .saveLogToLocal(false)// Save the Airwallex logs locally. If you have your own saving strategy, please set this to false.
        .setEnvironment(environment)
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
  }

  private fun getEnvironment(): Environment {
    val environment: String = BuildConfig.ENV
    return when (environment) {
      Environment.STAGING.value -> Environment.STAGING
      Environment.DEMO.value -> Environment.DEMO
      Environment.PRODUCTION.value -> Environment.PRODUCTION
      else -> Environment.DEMO
    }
  }

  override fun query(
    uri: Uri,
    projection: Array<String>?,
    selection: String?,
    selectionArgs: Array<String>?,
    sortOrder: String?
  ): Cursor? {
    return null
  }

  override fun getType(uri: Uri): String? {
    return null
  }

  override fun insert(uri: Uri, values: ContentValues?): Uri? {
    return null
  }

  override fun delete(uri: Uri, selection: String?, selectionArgs: Array<String>?): Int {
    return 0
  }

  override fun update(
    uri: Uri,
    values: ContentValues?,
    selection: String?,
    selectionArgs: Array<String>?
  ): Int {
    return 0
  }
}
