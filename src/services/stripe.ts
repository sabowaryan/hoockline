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

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/stripe-checkout`, {
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
      throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    
    if (!data.url) {
      throw new Error('No checkout URL received from server');
    }

    return data;
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    throw new Error(error.message || 'Failed to create checkout session');
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