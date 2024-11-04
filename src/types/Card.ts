export interface Card {
  cvc?: string;
  expiryMonth?: string;
  expiryYear?: string;
  name?: string;
  number?: string;
  bin?: string;
  last4?: string;
  brand?: string;
  country?: string;
  funding?: string;
  fingerprint?: string;
  cvcCheck?: string;
  avsCheck?: string;
  issuerCountryCode?: string;
  cardType?: string;
}
