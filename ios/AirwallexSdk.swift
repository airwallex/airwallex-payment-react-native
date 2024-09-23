import Airwallex
import Foundation

@objc(AirwallexSdk)
class AirwallexSdk: RCTEventEmitter, AWXPaymentResultDelegate {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    
    @objc(presentPaymentFlow:session:environment:resolver:rejecter:)
    func presentPaymentFlow(clientSecret: String, session: NSDictionary, environment: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        
        if let mode = AirwallexSDKMode.from(environment) {
            Airwallex.setMode(mode)
        }
        AWXAPIClientConfiguration.shared().clientSecret = clientSecret
        
        let session = buildAirwallexSession(from: session)
        
        let context = AWXUIContext.shared()
        context.delegate = self
        context.session = session
        
        DispatchQueue.main.async {
            context.presentEntirePaymentFlow(from: UIApplication.shared.delegate?.window??.rootViewController ?? UIViewController())
        }
    }
    
    func paymentViewController(_ controller: UIViewController, didCompleteWith status: AirwallexPaymentStatus, error: Error?) {
        controller.dismiss(animated: true) {
            switch status {
            case .success:
                self.resolve?(["status": "success"])
            case .inProgress:
                self.resolve?(["status": "inProgress"])
            case .failure:
                self.reject?((String((error as? NSError)?.code ?? -1)), error?.localizedDescription, error)
            case .cancel:
                self.resolve?(["status": "cancelled"])
            }
            self.resolve = nil
            self.reject = nil
        }
    }
}

private extension AirwallexSDKMode {
    static func from(_ stringValue: String) -> Self? {
        switch stringValue {
        case "staging":
            .stagingMode
        case "demo":
            .demoMode
        case "production":
            .productionMode
        default:
            nil
        }
    }
}
