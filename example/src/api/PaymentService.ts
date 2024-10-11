import axios from 'axios';

interface PaymentIntentParams {
  [key: string]: any;
}

class PaymentService {
  private baseUrl: string;
  private apiKey: string;
  private clientId: string;

  constructor(baseUrl: string, apiKey: string, clientId: string) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.clientId = clientId;
  }

  async createPaymentIntent(params: PaymentIntentParams): Promise<any> {
    console.log('Creating payment intent with params:', params);
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
    try {
      const response = await axios.post(
        `${this.baseUrl}/api/v1/pa/customers/create`,
        params,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
        }
      );
      console.log('HTTP Response Status Code:', response.status);
      console.log('HTTP Response Data:', response.data);

      if (response.status === 200) {
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
        `${this.baseUrl}/api/v1/pa/customers/${customerId}/generate_client_secret`,
        {
          params: {
            apiKey: this.apiKey,
            clientId: this.clientId,
          },
          headers: {
            Authorization: `Bearer ${this.apiKey}`,
          },
        }
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
}

export default PaymentService;
