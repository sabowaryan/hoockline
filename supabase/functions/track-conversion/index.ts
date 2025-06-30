import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '', 
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

// Helper function to create responses with CORS headers
function corsResponse(body: string | object | null, status = 200) {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  if (status === 204) {
    return new Response(null, { status, headers });
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...headers,
      'Content-Type': 'application/json',
    },
  });
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    const { session_id, event_type, page_path, metadata } = await req.json();

    if (!session_id || typeof session_id !== 'string') {
      return corsResponse({ error: 'session_id is required and must be a string' }, 400);
    }

    if (!event_type || typeof event_type !== 'string') {
      return corsResponse({ error: 'event_type is required and must be a string' }, 400);
    }

    // Validate event_type
    const validEventTypes = ['page_view', 'generator_start', 'payment_start', 'payment_complete'];
    if (!validEventTypes.includes(event_type)) {
      return corsResponse({ error: 'Invalid event_type' }, 400);
    }

    // Insert conversion event
    const { error } = await supabase
      .from('conversion_events')
      .insert({
        session_id: session_id.substring(0, 100), // Limit length
        event_type,
        page_path: page_path ? page_path.substring(0, 500) : null,
        metadata: metadata || null
      });

    if (error) {
      console.error('Error inserting conversion event:', error);
      return corsResponse({ error: 'Failed to track conversion event' }, 500);
    }

    return corsResponse({ 
      success: true,
      event_type,
      session_id 
    });

  } catch (error: any) {
    console.error('Track conversion error:', error);
    return corsResponse({ error: error.message }, 500);
  }
});