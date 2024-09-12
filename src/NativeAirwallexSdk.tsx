import { NativeModules } from 'react-native';

type NativeAirwallexSdkType = {
  presentPaymentFlow(params: {}): Promise<void>;
};

const { AirwallexSdk } = NativeModules;

export default AirwallexSdk as NativeAirwallexSdkType;
