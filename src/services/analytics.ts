// Analytics service for tracking page views
let sessionId: string | null = null;

// Generate a session ID for this browser session
function getSessionId(): string {
  if (!sessionId) {
    sessionId = localStorage.getItem('clicklone_session_id');
    if (!sessionId) {
      sessionId = generateSessionId();
      localStorage.setItem('clicklone_session_id', sessionId);
    }
  }
  return sessionId;
}

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export async function trackPageView(pagePath: string): Promise<void> {
  try {
    // Don't track admin pages or if in development
    if (pagePath.startsWith('/admin') || import.meta.env.DEV) {
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_path: pagePath,
        referrer: document.referrer || null,
        session_id: getSessionId()
      }),
    });

    if (!response.ok) {
      console.warn('Failed to track page view:', response.statusText);
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

export function isAnalyticsEnabled(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && 
    !import.meta.env.DEV
  );
}

// Track page view with debouncing to avoid duplicate calls
let trackingTimeout: number | null = null;

export function trackPageViewDebounced(pagePath: string): void {
  if (trackingTimeout) {
    clearTimeout(trackingTimeout);
  }
  
  trackingTimeout = window.setTimeout(() => {
    trackPageView(pagePath);
  }, 100);
}