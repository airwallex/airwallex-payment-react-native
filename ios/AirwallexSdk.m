#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>

@interface RCT_EXTERN_MODULE(AirwallexSdk, RCTEventEmitter)

RCT_EXTERN_METHOD(
                  presentPaymentFlow:(NSString *)clientSecret
                  session:(NSDictionary *)session
                  environment:(NSString *)environment
                  resolver: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

@end
