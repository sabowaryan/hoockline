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
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-client-info',
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

    // Verify authorization (accept both anon key and service role)
    const authHeader = req.headers.get('Authorization');
    const apiKey = req.headers.get('apikey');
    
    if (!authHeader && !apiKey) {
      return corsResponse({ 
        error: 'Missing authorization header',
        code: 401 
      }, 401);
    }

    const { session_id, page_path, time_spent_seconds, is_bounce } = await req.json();

    if (!session_id || typeof session_id !== 'string') {
      return corsResponse({ error: 'session_id is required and must be a string' }, 400);
    }

    if (!page_path || typeof page_path !== 'string') {
      return corsResponse({ error: 'page_path is required and must be a string' }, 400);
    }

    if (typeof time_spent_seconds !== 'number' || time_spent_seconds < 0) {
      return corsResponse({ error: 'time_spent_seconds must be a positive number' }, 400);
    }

    // Insert time tracking data
    const { error } = await supabase
      .from('page_time_tracking')
      .insert({
        session_id: session_id.substring(0, 100),
        page_path: page_path.substring(0, 500),
        time_spent_seconds: Math.min(time_spent_seconds, 86400), // Max 24 hours
        is_bounce: is_bounce || false
      });

    if (error) {
      console.error('Error inserting time tracking:', error);
      return corsResponse({ error: 'Failed to track time spent' }, 500);
    }

    return corsResponse({ 
      success: true,
      time_spent_seconds,
      session_id 
    });

  } catch (error: any) {
    console.error('Track time spent error:', error);
    return corsResponse({ error: error.message }, 500);
  }
});