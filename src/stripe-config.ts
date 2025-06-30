export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  features: string[];
}

export const products: Product[] = [
  {
    id: 'prod_SagJP1NwHCDpkC',
    priceId: 'price_1RfW5rPPWwWvhRQtcWbx0KuY',
    name: 'Hookline',
    description: 'Pack de 10 phrases d\'accroche personnalisées générées par IA',
    mode: 'payment',
    price: 3.99,
    currency: 'USD',
    features: [
      '10 phrases d\'accroche uniques',
      'Générées par IA Gemini',
      '6 tons différents disponibles',
      '6 langues supportées',
      'Copie en un clic',
      'Téléchargement possible',
      'Accès immédiat'
    ]
  }
];

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): Product | undefined {
  return products.find(product => product.priceId === priceId);
}

// Helper function to format price
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(price);
}

// Helper function to get product features
export function getProductFeatures(productId: string): string[] {
  const product = getProductById(productId);
  return product?.features || [];
}