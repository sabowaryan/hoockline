import { supabase } from '../lib/supabase';

export interface CheckoutSessionRequest {
  priceId: string;
  mode: 'payment' | 'subscription';
  successUrl: string;
  cancelUrl: string;
}

export interface CheckoutSessionResponse {
  sessionId: string;
  url: string;
}

export async function createCheckoutSession(request: CheckoutSessionRequest): Promise<CheckoutSessionResponse> {
  try {
    // Get session but don't require authentication for public payments
    const { data: { session } } = await supabase.auth.getSession();
    
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Only add Authorization header if user is authenticated
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_FUNCTIONS_URL}/stripe-checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        price_id: request.priceId,
        mode: request.mode,
        success_url: request.successUrl,
        cancel_url: request.cancelUrl,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      // Provide more specific error messages
      if (response.status === 401) {
        throw new Error('Erreur d\'authentification. Veuillez réessayer.');
      } else if (response.status === 400) {
        throw new Error(errorData.error || 'Paramètres de paiement invalides.');
      } else if (response.status >= 500) {
        throw new Error('Erreur serveur. Veuillez réessayer dans quelques instants.');
      } else {
        throw new Error(errorData.error || `Erreur HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('URL de paiement non reçue du serveur');
    }

    return data;
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    
    // Network errors
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Erreur de connexion. Vérifiez votre connexion internet.');
    }
    
    throw new Error(error.message || 'Échec de la création de la session de paiement');
  }
}

export async function getUserSubscription() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_subscriptions')
      .select('*')
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Error fetching user subscription:', error);
    throw error;
  }
}

export async function getUserOrders() {
  try {
    const { data, error } = await supabase
      .from('stripe_user_orders')
      .select('*')
      .order('order_date', { ascending: false });

    if (error) {
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching user orders:', error);
    throw error;
  }
}

// Helper function to check if Stripe is properly configured
export function isStripeConfigured(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL &&
    import.meta.env.VITE_SUPABASE_ANON_KEY
  );
}

// Helper function to validate price format
export function validatePrice(price: number): boolean {
  return typeof price === 'number' && price > 0 && Number.isFinite(price);
}

// Helper function to format currency
export function formatCurrency(amount: number, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}