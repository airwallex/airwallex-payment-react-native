import axios from 'axios';

interface PaymentIntentParams {
  [key: string]: any;
  apiKey: string;
  clientId: string;
}

class PaymentService {
  private baseUrl: string;
  private apiKey: string;
  private clientId: string;

  constructor(
    environment: 'staging' | 'demo' | 'production' = 'demo',
    apiKey: string,
    clientId: string
  ) {
    this.baseUrl = this.getBaseUrlForEnvironment(environment);
    this.apiKey = apiKey;
    this.clientId = clientId;
  }

  async createPaymentIntent(params: PaymentIntentParams): Promise<any> {
    console.log('Creating payment intent with params:', params);
    params.apiKey = this.apiKey;
    params.clientId = this.clientId;
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/pa/payment_intents/create`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
      console.log('HTTP Response Status Code:', response.status);
      console.log('HTTP Response Data:', response.data);

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error(`Failed to create payment intent: ${response.data}`);
      }
    } catch (e) {
      console.error('Error occurred while creating payment intent:', e);
      throw e;
    }
  }

  async createCustomer(params: PaymentIntentParams): Promise<any> {
    console.log('Creating customer with params:', params);
    params.apiKey = this.apiKey;
    params.clientId = this.clientId;
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/pa/customers/create`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      console.log('HTTP Response Status Code:', response.status);
      console.log('HTTP Response Data:', response.data);

      if (response.status === 200 || response.status === 201) {
        return response.data;
      } else {
        throw new Error(`Failed to create customer: ${response.data}`);
      }
    } catch (e) {
      console.error('Error occurred while creating customer:', e);
      throw e;
    }
  }

  async createClientSecretWithQuery(customerId: string): Promise<any> {
    console.log('Generating client secret for customer:', customerId);
    try {
      const response = await axios.get(
        `${this.baseUrl}/api/v1/pa/customers/${customerId}/generate_client_secret`
      );

      console.log('HTTP Response Status Code:', response.status);
      console.log('HTTP Response Data:', response.data);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error(`Failed to create client secret: ${response.data}`);
      }
    } catch (e) {
      console.error('Error occurred while generating client secret:', e);
      throw e;
    }
  }

  getBaseUrlForEnvironment(
    environment: 'staging' | 'demo' | 'production'
  ): string {
    switch (environment) {
      case 'demo':
        return 'https://demo-pacheckoutdemo.airwallex.com';
      case 'staging':
        return 'https://staging-pacheckoutdemo.airwallex.com';
      default:
        return '';
    }
  }
}

export default PaymentService;
