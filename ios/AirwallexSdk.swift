import Airwallex
import Foundation

@objc(AirwallexSdk)
class AirwallexSdk: RCTEventEmitter {
    private var resolve: RCTPromiseResolveBlock?
    private var reject: RCTPromiseRejectBlock?
    private var paymentConsentID: String?
    private var applePayProvider: AWXApplePayProvider?
    private var cardProvider: AWXCardProvider?
    private var cardSession: AWXSession?
    private var hostVC: UIViewController?
    
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
        
        let applePayProvider = AWXApplePayProvider(delegate: self, session: session)
        DispatchQueue.main.async {
            applePayProvider.startPayment()
        }
        self.applePayProvider = applePayProvider
    }

    @objc(payWithCardDetails:card:saveCard:resolver:rejecter:)
    func payWithCardDetails(session: NSDictionary, card: NSDictionary, saveCard: Bool, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        
        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String
        
        let session = buildAirwallexSession(from: session)
        let card = AWXCard.decode(fromJSON: card as? [AnyHashable : Any]) as! AWXCard
        
        let cardProvider = AWXCardProvider(delegate: self, session: session)
        DispatchQueue.main.async {
            self.hostVC = self.getViewController()
            cardProvider.confirmPaymentIntent(with: card, billing: nil, saveCard: saveCard)
        }
        self.cardSession = session
        self.cardProvider = cardProvider
    }
    
    @objc(payWithConsent:consent:resolver:rejecter:)
    func payWithConsent(session: NSDictionary, consent: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
        self.resolve = resolve
        self.reject = reject
        
        AWXAPIClientConfiguration.shared().clientSecret = session["clientSecret"] as? String
        
        let session = buildAirwallexSession(from: session)
        let consent = AWXPaymentConsent.decode(fromJSON: consent as? [AnyHashable : Any]) as! AWXPaymentConsent
        
        let cardProvider = AWXCardProvider(delegate: self, session: session)
        DispatchQueue.main.async {
            self.hostVC = self.getViewController()
            cardProvider.confirmPaymentIntent(with: consent)
        }
        self.cardProvider = cardProvider
    }

    private func getViewController() -> UIViewController {
        var presentingViewController = UIApplication.shared.delegate?.window??.rootViewController
        
        while let presented = presentingViewController?.presentedViewController {
            presentingViewController = presented
        }

        return presentingViewController ?? UIViewController()
    }
}

extension AirwallexSdk: AWXPaymentResultDelegate {
    func paymentViewController(_ controller: UIViewController?, didCompleteWith status: AirwallexPaymentStatus, error: Error?) {
        controller?.dismiss(animated: true) {
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
            self.resolve = nil
            self.reject = nil
        }
    }
  
    func paymentViewController(_ controller: UIViewController?, didCompleteWithPaymentConsentId paymentConsentId: String) {
        self.paymentConsentID = paymentConsentId
    }
}

extension AirwallexSdk: AWXProviderDelegate {
    func providerDidStartRequest(_ provider: AWXDefaultProvider) {
    }
    
    func providerDidEndRequest(_ provider: AWXDefaultProvider) {
    }
    
    func provider(_ provider: AWXDefaultProvider, didInitializePaymentIntentId paymentIntentId: String) {
        cardSession?.updateInitialPaymentIntentId(paymentIntentId)
    }

    func provider(_ provider: AWXDefaultProvider, didCompleteWith status: AirwallexPaymentStatus, error: (any Error)?) {
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
        applePayProvider = nil
        cardProvider = nil
        cardSession = nil
        hostVC = nil
    }
    
    func provider(_ provider: AWXDefaultProvider, didCompleteWithPaymentConsentId paymentConsentId: String) {
        self.paymentConsentID = paymentConsentId
    }
    
    func hostViewController() -> UIViewController {
        hostVC ?? getViewController()
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
