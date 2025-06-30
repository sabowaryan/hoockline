import 'jsr:@supabase/functions-js/edge-runtime.d.ts';
import { createClient } from 'npm:@supabase/supabase-js@2.49.1';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

if (!supabaseUrl) {
  throw new Error('SUPABASE_URL environment variable is required');
}

if (!supabaseServiceKey) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY environment variable is required');
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

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
  const encoder = new TextEncoder();
  const data = encoder.encode(ip + 'clicklone-salt');
  return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex.substring(0, 16);
  });
}

// Helper function to generate session ID
function generateSessionId(): string {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2);
  const encoder = new TextEncoder();
  const data = encoder.encode(timestamp + random);
  return crypto.subtle.digest('SHA-256', data).then(hashBuffer => {
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('').substring(0, 32);
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

    const requestBody = await req.json().catch(() => ({}));
    const { 
      page_path, 
      referrer, 
      session_id,
      traffic_source,
      utm_campaign,
      utm_medium,
      utm_content 
    } = requestBody;

    if (!page_path || typeof page_path !== 'string') {
      return corsResponse({ error: 'page_path is required and must be a string' }, 400);
    }

    // Get client info
    const userAgent = req.headers.get('user-agent') || '';
    const clientIP = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     req.headers.get('cf-connecting-ip') ||
                     'unknown';

    // Hash IP for privacy (synchronous fallback)
    let ipHash: string;
    try {
      ipHash = await hashIP(clientIP);
    } catch (error) {
      // Fallback to simple hash if crypto.subtle fails
      ipHash = btoa(clientIP + 'clicklone-salt').substring(0, 16);
    }

    // Use provided session_id or generate new one
    let finalSessionId = session_id;
    if (!finalSessionId) {
      try {
        finalSessionId = await generateSessionId();
      } catch (error) {
        // Fallback session ID generation
        finalSessionId = Date.now().toString(36) + Math.random().toString(36).substring(2);
      }
    }

    // Insert page view with enhanced data
    const { error } = await supabase
      .from('page_views')
      .insert({
        page_path: page_path.substring(0, 500), // Limit length
        user_agent: userAgent.substring(0, 500), // Limit length
        referrer: referrer ? referrer.substring(0, 500) : null,
        ip_hash: ipHash,
        session_id: finalSessionId,
        traffic_source: traffic_source ? traffic_source.substring(0, 100) : null,
        utm_campaign: utm_campaign ? utm_campaign.substring(0, 100) : null,
        utm_medium: utm_medium ? utm_medium.substring(0, 100) : null,
        utm_content: utm_content ? utm_content.substring(0, 100) : null
      });

    if (error) {
      console.error('Error inserting page view:', error);
      return corsResponse({ 
        error: 'Failed to track page view',
        details: error.message 
      }, 500);
    }

    return corsResponse({ 
      success: true, 
      session_id: finalSessionId 
    });

  } catch (error: any) {
    console.error('Track page view error:', error);
    return corsResponse({ 
      error: 'Internal server error',
      message: error.message 
    }, 500);
  }
});