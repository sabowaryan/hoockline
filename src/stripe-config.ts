export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
}

export const products: Product[] = [
  {
    id: 'prod_SahUAARvVVXQLg',
    priceId: 'price_1RfW5rPPWwWvhRQtcWbx0KuY',
    name: 'Hookline',
    description: 'Pack de 10 phrases d\'accroche personnalisées générées par IA',
    mode: 'payment',
    price: 3.99,
    currency: 'USD'
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): Product | undefined {
  return products.find(product => product.priceId === priceId);
}