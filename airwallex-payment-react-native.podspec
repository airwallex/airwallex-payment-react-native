require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))
airwallex_version = '~> 6.1.6'

Pod::Spec.new do |s|
  s.name         = "airwallex-payment-react-native"
  s.version      = package["version"]
  s.summary      = package["description"]
  s.homepage     = package["homepage"]
  s.license      = package["license"]
  s.authors      = package["author"]

  s.platforms    = { :ios => min_ios_version_supported }
  s.source       = { :git => "https://github.com/airwallex/airwallex-payment-react-native.git", :tag => "#{s.version}" }

  s.source_files = "ios/**/*.{h,m,mm,swift}"

  s.dependency 'React-Core'
  s.dependency 'Airwallex', airwallex_version
end
