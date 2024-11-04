package com.airwallexpaymentreactnative.util

import com.facebook.react.bridge.ReadableArray
import com.facebook.react.bridge.ReadableMap

fun ReadableMap.getStringSafe(key: String): String? =
  if (hasKey(key)) getString(key) else null

fun ReadableMap.getBooleanSafe(key: String, defaultValue: Boolean = false): Boolean =
  if (hasKey(key)) getBoolean(key) else defaultValue

fun ReadableMap.getBooleanOrNullSafe(key: String): Boolean? =
  if (hasKey(key)) getBoolean(key) else null

fun ReadableMap.getDoubleSafe(key: String, defaultValue: Double = 0.0): Double =
  if (hasKey(key)) getDouble(key) else defaultValue

fun ReadableMap.getArraySafe(key: String): ReadableArray? =
  if (hasKey(key)) getArray(key) else null

fun ReadableMap.getMapSafe(key: String): ReadableMap? =
  if (hasKey(key)) getMap(key) else null

