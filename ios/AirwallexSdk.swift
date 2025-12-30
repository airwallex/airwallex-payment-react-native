import Airwallex
import Foundation

@objc(AirwallexSdk)
class AirwallexSdk: RCTEventEmitter {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    private var paymentConsentID: String?
    private var paymentSessionHandler: PaymentSessionHandler?
    
    @objc(initialize:enableLogging:saveLogToLocal:)
    func initialize(environment: String, enableLogging: Bool, saveLogToLocal: Bool) {
        if let mode = AirwallexSDKMode.from(environment) {
            Airwallex.setMode(mode)
            AWXAPIClientConfiguration.shared()
        }
    }
  
    @objc(presentEntirePaymentFlow:resolver:rejecter:)
    func presentEntirePaymentFlow(session: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        
        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String
        
        let session = buildAirwallexSession(from: session)
        
        DispatchQueue.main.async {
            AWXUIContext.launchPayment(
                from: self.getViewController(),
                session: session,
                paymentResultDelegate: self,
                launchStyle: .present
            )
        }
    }

    @objc(presentCardPaymentFlow:resolver:rejecter:)
    func presentCardPaymentFlow(session: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        
        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String
        
        let session = buildAirwallexSession(from: session)
        
        DispatchQueue.main.async {
            AWXUIContext.launchCardPayment(
                from: self.getViewController(),
                session: session,
                paymentResultDelegate: self,
                launchStyle: .present
            )
        }
    }

    @objc(startApplePay:resolver:rejecter:)
    func startApplePay(session: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject

        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String

        let session = buildAirwallexSession(from: session)

        DispatchQueue.main.async {
            let handler = PaymentSessionHandler(
                session: session,
                viewController: self.getViewController(),
                paymentResultDelegate: self
            )
            handler.showIndicator = false
            handler.startApplePay()
            self.paymentSessionHandler = handler
        }
    }

    @objc(payWithCardDetails:card:saveCard:resolver:rejecter:)
    func payWithCardDetails(session: NSDictionary, card: NSDictionary, saveCard: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject

        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String

        let session = buildAirwallexSession(from: session)
        let card = AWXCard.decode(fromJSON: card as? [AnyHashable : Any]) as! AWXCard

        DispatchQueue.main.async {
            let handler = PaymentSessionHandler(
                session: session,
                viewController: self.getViewController(),
                paymentResultDelegate: self
            )
            handler.showIndicator = false
            handler.startCardPayment(with: card, billing: session.billing, saveCard: saveCard)
            self.paymentSessionHandler = handler
        }
    }

    @objc(payWithConsent:consent:resolver:rejecter:)
    func payWithConsent(session: NSDictionary, consent: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject

        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String

        let session = buildAirwallexSession(from: session)
        let consent = AWXPaymentConsent.decode(fromJSON: consent as? [AnyHashable : Any]) as! AWXPaymentConsent

        DispatchQueue.main.async {
            let handler = PaymentSessionHandler(
                session: session,
                viewController: self.getViewController(),
                paymentResultDelegate: self
            )
            handler.showIndicator = false
            handler.startConsentPayment(with: consent)
            self.paymentSessionHandler = handler
        }
    }

    private func getViewController() -> UIViewController {
        let windowScene = UIApplication.shared.connectedScenes.first(where: { $0.activationState == .foregroundActive }) as? UIWindowScene
        let keyWindow: UIWindow?
        if #available(iOS 15.0, *) {
            keyWindow = windowScene?.keyWindow
        } else {
            keyWindow = windowScene?.windows.first(where: { $0.isKeyWindow })
        }

        var presentingViewController = keyWindow?.rootViewController
        while let presented = presentingViewController?.presentedViewController {
            presentingViewController = presented
        }

        return presentingViewController ?? UIViewController()
    }
}

extension AirwallexSdk: AWXPaymentResultDelegate {
    func paymentViewController(_ controller: UIViewController?, didCompleteWith status: AirwallexPaymentStatus, error: Error?) {
        switch status {
        case .success:
            var successDict = ["status": "success"]
            if let consentID = self.paymentConsentID {
                successDict["paymentConsentId"] = consentID
            }
            self.resolve?(successDict)
        case .inProgress:
            self.resolve?(["status": "inProgress"])
        case .failure:
            self.reject?((String((error as? NSError)?.code ?? -1)), error?.localizedDescription, error)
        case .cancel:
            self.resolve?(["status": "cancelled"])
        }
        resolve = nil
        reject = nil
        paymentConsentID = nil
        paymentSessionHandler = nil
    }

    func paymentViewController(_ controller: UIViewController?, didCompleteWithPaymentConsentId paymentConsentId: String) {
        self.paymentConsentID = paymentConsentId
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
