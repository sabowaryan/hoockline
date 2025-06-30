import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';
import { createHash } from 'node:crypto';

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

// Helper function to hash IP address for privacy
function hashIP(ip: string): string {
  return createHash('sha256').update(ip + 'clicklone-salt').digest('hex').substring(0, 16);
}

// Helper function to generate session ID
function generateSessionId(): string {
  return createHash('sha256').update(Date.now().toString() + Math.random().toString()).digest('hex').substring(0, 32);
}

Deno.serve(async (req) => {
  try {
    if (req.method === 'OPTIONS') {
      return corsResponse(null, 204);
    }

    if (req.method !== 'POST') {
      return corsResponse({ error: 'Method not allowed' }, 405);
    }

    const { page_path, referrer, session_id } = await req.json();

    if (!page_path || typeof page_path !== 'string') {
      return corsResponse({ error: 'page_path is required and must be a string' }, 400);
    }

    // Get client info
    const userAgent = req.headers.get('user-agent') || '';
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Hash IP for privacy
    const ipHash = hashIP(clientIP);

    // Use provided session_id or generate new one
    const finalSessionId = session_id || generateSessionId();

    // Insert page view
    const { error } = await supabase
      .from('page_views')
      .insert({
        page_path: page_path.substring(0, 500), // Limit length
        user_agent: userAgent.substring(0, 500), // Limit length
        referrer: referrer ? referrer.substring(0, 500) : null,
        ip_hash: ipHash,
        session_id: finalSessionId
      });

    if (error) {
      console.error('Error inserting page view:', error);
      return corsResponse({ error: 'Failed to track page view' }, 500);
    }

    return corsResponse({ 
      success: true, 
      session_id: finalSessionId 
    });

  } catch (error: any) {
    console.error('Track page view error:', error);
    return corsResponse({ error: error.message }, 500);
  }
});