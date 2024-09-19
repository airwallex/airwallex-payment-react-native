//
//  AirwallexSdk+Session.swift
//  airwallex-payment-react-native
//
//  Created by Hector.Huang on 2024/9/14.
//

import Airwallex

extension AirwallexSdk {
    internal func buildAirwallexSession(from params: NSDictionary) -> AWXSession {
        let type = params["type"] as! String
        return switch type {
        case "OneOff":
            buildOneOffSession(from: params)
        case "Recurring":
            buildRecurringSession(from: params)
        case "RecurringWithIntent":
            buildRecurringWithIntentSession(from: params)
        default:
            AWXSession()
        }
    }
    
    private func buildOneOffSession(from params: NSDictionary) -> AWXOneOffSession {
        let intent = AWXPaymentIntent(params: params)
        
        let session = AWXOneOffSession()
        session.configure(params: params)
        session.paymentIntent = intent
        if let autoCapture = params["autoCapture"] as? Bool {
            session.autoCapture = autoCapture
        }
        if let hidePaymentConsents = params["hidePaymentConsents"] as? Bool {
            session.hidePaymentConsents = hidePaymentConsents
        }
        
        return session
    }
    
    private func buildRecurringSession(from params: NSDictionary) -> AWXRecurringSession {
        let session = AWXRecurringSession()
        session.configure(params: params)
        session.setAmount(NSDecimalNumber(decimal: (params["amount"] as! NSNumber).decimalValue))
        session.setCurrency(params["currency"] as! String)
        session.setCustomerId(params["customerId"] as? String)
        if let nextTriggerBy = AirwallexNextTriggerByType.from(params["NextTriggeredBy"] as! String) {
            session.nextTriggerByType = nextTriggerBy
        }
        if let merchantTriggerReason = AirwallexMerchantTriggerReason.from(params["merchantTriggerReason"] as! String) {
            session.merchantTriggerReason = merchantTriggerReason
        }
        
        return session
    }

    private func buildRecurringWithIntentSession(from params: NSDictionary) -> AWXRecurringWithIntentSession {
        let intent = AWXPaymentIntent(params: params)
        
        let session = AWXRecurringWithIntentSession()
        session.configure(params: params)
        session.paymentIntent = intent
        if let autoCapture = params["autoCapture"] as? Bool {
            session.autoCapture = autoCapture
        }
        if let nextTriggerBy = AirwallexNextTriggerByType.from(params["NextTriggeredBy"] as! String) {
            session.nextTriggerByType = nextTriggerBy
        }
        if let merchantTriggerReason = AirwallexMerchantTriggerReason.from(params["merchantTriggerReason"] as! String) {
            session.merchantTriggerReason = merchantTriggerReason
        }
        
        return session
    }
}

private extension AWXSession {
    func configure(params: NSDictionary) {
        if let shippingDict = params["shipping"] as? NSDictionary {
            billing = .init(params: shippingDict)
        }
        if let isBillingRequired = params["isBillingRequired"] as? Bool {
            isBillingInformationRequired = isBillingRequired
        }
        countryCode = params["countryCode"] as! String
        if let returnUrl = params["returnUrl"] as? String {
            self.returnURL = returnUrl
        }
        paymentMethods = params["paymentMethods"] as? [String]
    }
}

private extension AWXPaymentIntent {
    convenience init(params: NSDictionary) {
        self.init()
        id = params["paymentIntentId"] as! String
        amount = NSDecimalNumber(decimal: (params["amount"] as! NSNumber).decimalValue)
        currency = params["currency"] as! String
        customerId = params["customerId"] as? String
    }
}

private extension AirwallexNextTriggerByType {
    static func from(_ stringValue: String) -> Self? {
        switch stringValue {
        case "merchant":
            .merchantType
        case "customer": 
            .customerType
        default:
            nil
        }
    }
}

private extension AirwallexMerchantTriggerReason {
    static func from(_ stringValue: String) -> Self? {
        switch stringValue {
        case "unscheduled":
            .unscheduled
        case "scheduled":
            .scheduled
        default:
            nil
        }
    }
}
