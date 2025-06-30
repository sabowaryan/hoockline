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
    id: 'prod_SagJP1NwHCDpkC',
    // TODO: Replace this with a valid Price ID from your Stripe Dashboard
    // 1. Go to https://dashboard.stripe.com/products
    // 2. Create a new product or select an existing one
    // 3. Add a price of $3.99 USD (one-time payment)
    // 4. Copy the Price ID (starts with 'price_') and replace the value below
    priceId: 'REPLACE_WITH_VALID_STRIPE_PRICE_ID',
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