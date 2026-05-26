//
//  AWXUIContextConfiguration+Extensions.swift
//  airwallex-payment-react-native
//

import Airwallex

extension AWXUIContext.Configuration {
    convenience init(params: NSDictionary?) {
        self.init()
        if let layoutString = params?["layout"] as? String, layoutString.lowercased() == "accordion" {
            layout = .accordion
        } else {
            layout = .tab
        }
    }
}
