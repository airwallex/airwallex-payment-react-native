import Airwallex
import Foundation

@objc(AirwallexSdk)
class AirwallexSdk: RCTEventEmitter, AWXPaymentResultDelegate {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    
    @objc(presentPaymentFlow:resolver:rejecter:)
    func presentPaymentFlow(params: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        
        Airwallex.setMode(.stagingMode)
        let clientSecret = params["clientSecret"] as! String
        AWXAPIClientConfiguration.shared().clientSecret = clientSecret
        
        let session = AWXOneOffSession()
        
        let options = AWXApplePayOptions(merchantIdentifier: "")
        options.additionalPaymentSummaryItems = [.init(label: "goods", amount: 2), .init(label: "tax", amount: 1)]
        options.totalPriceLabel = "COMPANY, INC."
        
        let paymentIntent = AWXPaymentIntent()
        paymentIntent.amount = 1
        paymentIntent.currency = "USD"
        paymentIntent.id = "int_hkst2h9kngzv1yyp2tb"
        
        session.applePayOptions = options
        session.countryCode = "US"
        session.returnURL = ""
        session.paymentIntent = paymentIntent
        session.autoCapture = true
        
        let context = AWXUIContext.shared()
        context.delegate = self
        context.session = session
        
        DispatchQueue.main.async {
            context.presentEntirePaymentFlow(from: UIApplication.shared.delegate?.window??.rootViewController ?? UIViewController())
        }
    }
    
    func paymentViewController(_ controller: UIViewController, didCompleteWith status: AirwallexPaymentStatus, error: Error?) {
        controller.dismiss(animated: true) {
            
        }
    }
}
