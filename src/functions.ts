import NativeAirwallexSdk from './NativeAirwallexSdk';

export const presentPaymentFlow = async (params: []): Promise<void> => {
  try {
    await NativeAirwallexSdk.presentPaymentFlow(params);
  } catch (error: any) {
    console.log(error);
    return;
  }
};
