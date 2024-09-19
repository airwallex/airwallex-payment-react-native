//
//  AWXPlaceDetails+Extensions.swift
//  airwallex-payment-react-native
//
//  Created by Hector.Huang on 2024/9/18.
//

import Airwallex

extension AWXPlaceDetails {
    convenience init(params: NSDictionary) {
        self.init()
        if let firstName = params["firstName"] as? String {
            self.firstName = firstName
        }
        if let lastName = params["lastName"] as? String {
            self.lastName = lastName
        }
        phoneNumber = params["phoneNumber"] as? String
        email = params["email"] as? String
        dateOfBirth = params["dateOfBirth"] as? String
        if let addressDict = params["address"] as? NSDictionary {
            address = .init(params: addressDict)
        }
    }
}

private extension AWXAddress {
    convenience init(params: NSDictionary) {
        self.init()
        if let city = params["city"] as? String {
            self.city = city
        }
        if let street = params["street"] as? String {
            self.street = street
        }
        countryCode = params["countryCode"] as? String
        state = params["state"] as? String
        postcode = params["postcode"] as? String
    }
}
