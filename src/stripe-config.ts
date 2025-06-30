export interface Product {
  id: string;
  priceId: string;
  name: string;
  description: string;
  mode: 'payment' | 'subscription';
  price: number;
  currency: string;
  features: string[];
  popular?: boolean;
  badge?: string;
}

export const products: Product[] = [
  {
    id: 'prod_SagJP1NwHCDpkC',
    priceId: 'price_1RfUwkAmXOVRZkyi5T6CUqax',
    name: 'Hookline',
    description: 'Pack de 10 phrases d\'accroche personnalisées générées par IA',
    mode: 'payment',
    price: 3.99,
    currency: 'USD',
    popular: true,
    badge: 'Populaire',
    features: [
      '10 phrases d\'accroche uniques',
      'Générées par IA Gemini',
      '6 tons différents disponibles',
      '6 langues supportées',
      'Copie en un clic',
      'Téléchargement possible',
      'Accès immédiat',
      'Satisfaction garantie'
    ]
  }
];

// Helper functions
export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id);
}

export function getProductByPriceId(priceId: string): Product | undefined {
  return products.find(product => product.priceId === priceId);
}

// Enhanced price formatting with currency support
export function formatPrice(price: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}

// Helper function to get product features
export function getProductFeatures(productId: string): string[] {
  const product = getProductById(productId);
  return product?.features || [];
}

// Helper function to validate product configuration
export function validateProduct(product: Product): boolean {
  return !!(
    product.id &&
    product.priceId &&
    product.name &&
    product.description &&
    product.mode &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    product.currency &&
    Array.isArray(product.features)
  );
}

// Helper function to get popular products
export function getPopularProducts(): Product[] {
  return products.filter(product => product.popular);
}

// Helper function to calculate discount percentage
export function calculateDiscount(originalPrice: number, discountedPrice: number): number {
  return Math.round(((originalPrice - discountedPrice) / originalPrice) * 100);
}

// Helper function to format currency without symbol
export function formatPriceNumber(price: number): string {
  return price.toFixed(2);
}