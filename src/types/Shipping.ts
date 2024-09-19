export interface Shipping {
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  shippingMethod?: string;
  email?: string;
  dateOfBirth?: string;
  address?: Address;
}

interface Address {
  city?: string;
  countryCode?: string;
  street?: string;
  postcode?: string;
  state?: string;
}
