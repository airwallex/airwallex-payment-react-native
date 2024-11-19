#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AirwallexSdk, RCTEventEmitter)

RCT_EXTERN_METHOD(
                  initialize:(NSString *)environment
                  enableLogging:(BOOL)enableLogging
                  saveLogToLocal:(BOOL)saveLogToLocal
                  )

RCT_EXTERN_METHOD(
                  presentEntirePaymentFlow:(NSDictionary *)session
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  presentCardPaymentFlow:(NSDictionary *)session
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  startApplePay:(NSDictionary *)session
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  payWithCardDetails:(NSDictionary *)session
                  card:(NSDictionary *)card
                  saveCard:(BOOL)saveCard
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  payWithConsent:(NSDictionary *)session
                  consent:(NSDictionary *)consent
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject
                  )

@end
