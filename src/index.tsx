import {
  requireNativeComponent,
  UIManager,
  Platform,
  type ViewStyle,
} from 'react-native';

const LINKING_ERROR =
  `The package 'airwallex-payment-react-native' doesn't seem to be linked. Make sure: \n\n` +
  Platform.select({ ios: "- You have run 'pod install'\n", default: '' }) +
  '- You rebuilt the app after installing the package\n' +
  '- You are not using Expo Go\n';

type AirwallexPaymentReactNativeProps = {
  color: string;
  style: ViewStyle;
};

const ComponentName = 'AirwallexPaymentReactNativeView';

export const AirwallexPaymentReactNativeView =
  UIManager.getViewManagerConfig(ComponentName) != null
    ? requireNativeComponent<AirwallexPaymentReactNativeProps>(ComponentName)
    : () => {
        throw new Error(LINKING_ERROR);
      };
