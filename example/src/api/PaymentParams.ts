function generateUniqueId() {
  return `req_${new Date().getTime()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getPaymentParams(customerId: string | null) {
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
    customer_id: customerId,
  };
}

export function getCustomerParams() {
  return {
    apiKey: '',
    clientId: '',
    request_id: generateUniqueId(),
    merchant_customer_id: generateUniqueId(),
    first_name: 'John',
    last_name: 'Doe',
    email: 'john.doe@airwallex.com',
    phone_number: '13800000000',
    additional_info: {
      registered_via_social_media: false,
      registration_date: '2019-09-18',
      first_successful_order_date: '2019-09-18',
    },
    metadata: {
      id: 1,
    },
  };
}
