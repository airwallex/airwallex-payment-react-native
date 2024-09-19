//
//  Errors.swift
//  airwallex-payment-react-native
//
//  Created by Hector.Huang on 2024/9/14.
//

import Foundation

class Errors {
    class func createError (_ message: String) -> NSDictionary {
        let value: NSDictionary = [
            "message": message
        ]
        
        return ["error": value]
    }
        
    class func createError (_ error: Error) -> NSDictionary {
        let value: NSDictionary = [
            "message": error.localizedDescription
        ]
        
        return ["error": value]
    }
}
