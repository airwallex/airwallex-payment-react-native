import type { Card } from '../../../src/types/Card';

class CardCreator {
  static createCard(environment: string): Card {
    const card: Card = {
      name: 'John Citizen',
      expiryMonth: '12',
      expiryYear: '2029',
      cvc: '737',
    };

    if (environment === 'demo') {
      return {
        number: '4012000300001003',
        ...card,
      };
    } else {
      return {
        number: '4012000300000005',
        ...card,
      };
    }
  }
}

export default CardCreator;
