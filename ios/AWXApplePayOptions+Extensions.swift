//
//  AWXApplePayOptions+Extensions.swift
//  airwallex-payment-react-native
//
//  Created by Hector.Huang on 2024/11/19.
//

import Airwallex

extension AWXApplePayOptions {
    convenience init(params: NSDictionary) {
        self.init(merchantIdentifier: params["merchantIdentifier"] as! String)
        if let networks = params["supportedNetworks"] as? [String] {
            supportedNetworks = networks.map { PKPaymentNetwork.from($0) }
        }
        if let items = params["additionalPaymentSummaryItems"] as? [NSDictionary] {
            additionalPaymentSummaryItems = items.map { PKPaymentSummaryItem(params: $0) }
        }
        if let capabilities = params["merchantCapabilities"] as? [String] {
            var capabilitiesBitmask: PKMerchantCapability = []
            capabilities.compactMap { PKMerchantCapability.from($0) }.forEach { capability in
                capabilitiesBitmask.insert(capability)
            }
            merchantCapabilities = capabilitiesBitmask
        }
        if let contacts = params["requiredBillingContactFields"] as? [String] {
            requiredBillingContactFields = Set(contacts.compactMap { PKContactField.from($0) })
        }
        if let countries = params["supportedCountries"] as? [String] {
            supportedCountries = Set(countries)
        }
        totalPriceLabel = params["totalPriceLabel"] as? String
    }
}

private extension PKPaymentNetwork {
    static func from(_ stringValue: String) -> Self {
        switch stringValue {
        case "unionPay":
            .chinaUnionPay
        case "masterCard":
            .masterCard
        case "visa":
            .visa
        case "amex":
            .amex
        case "discover":
            .discover
        case "jcb":
            .JCB
        case "maestro":
            .maestro
        default:
            PKPaymentNetwork(rawValue: stringValue)
        }
    }
}

private extension PKMerchantCapability {
    static func from(_ stringValue: String) -> Self? {
        switch stringValue {
        case "supports3DS":
            .threeDSecure
        case "supportsCredit":
            .credit
        case "supportsDebit":
            .debit
        case "supportsEMV":
            .emv
        default:
            nil
        }
    }
}

private extension PKPaymentSummaryItem {
    convenience init(params: NSDictionary) {
        self.init()
        label = params["label"] as! String
        amount = NSDecimalNumber(decimal: (params["amount"] as! NSNumber).decimalValue)
        if let typeString = params["type"] as? String, let itemType = PKPaymentSummaryItemType.from(typeString) {
            type = itemType
        }
    }
}

private extension PKPaymentSummaryItemType {
    static func from(_ stringValue: String) -> Self? {
        switch stringValue {
        case "finalType":
            .final
        case "pendingType":
            .pending
        default:
            nil
        }
    }
}

private extension PKContactField {
    static func from(_ stringValue: String) -> Self? {
        switch stringValue {
        case "emailAddress":
            .emailAddress
        case "name":
            .name
        case "phoneNumber":
            .phoneNumber
        case "phoneticName":
            .phoneticName
        case "postalAddress":
            .postalAddress
        default:
            nil
        }
    }
}
