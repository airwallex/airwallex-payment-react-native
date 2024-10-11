function generateUniqueId() {
  return `req_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getPaymentParams() {
  return {
    apiKey: '',
    clientId: '',
    request_id: generateUniqueId(),
    amount: '1.00',
    currency: 'HKD',
    merchant_order_id: `ord_${new Date().getTime()}`,
    order: {
      type: 'physical_goods',
      items: [
        {
          name: 'T-shirt',
          unit_price: '1.00',
          quantity: 1,
        },
      ],
    },
    referrer_data: { type: 'android_sdk_sample' },
    descriptor: 'Airwallex - T-shirt',
    metadata: { id: 1 },
    email: 'yimadangxian@airwallex.com',
    return_url:
      'airwallexcheckout://com.example.airwallex_payment_flutter_example',
    capture_method: 'automatic',
  };
}
