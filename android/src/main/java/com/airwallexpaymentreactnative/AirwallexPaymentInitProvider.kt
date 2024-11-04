package com.airwallexpaymentreactnative

import android.app.Application
import android.content.ContentProvider
import android.content.ContentValues
import android.database.Cursor
import android.net.Uri
import com.airwallex.android.AirwallexStarter
import com.airwallex.android.card.CardComponent
import com.airwallex.android.core.Airwallex
import com.airwallex.android.googlepay.GooglePayComponent
import com.airwallex.android.redirect.RedirectComponent
import com.airwallex.android.wechat.WeChatComponent

class AirwallexPaymentInitProvider : ContentProvider() {
  override fun onCreate(): Boolean {
    context?.let {
      val application = it as Application
      initAirwallex(application)
    }
    return true
  }

  private fun initAirwallex(application: Application) {
    val providers = listOf(
      CardComponent.PROVIDER,
      WeChatComponent.PROVIDER,
      RedirectComponent.PROVIDER,
      GooglePayComponent.PROVIDER
    )
    Airwallex.initializeComponents(application, providers)
    AirwallexStarter.initializeActivityLaunch(application)
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
