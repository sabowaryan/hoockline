// Enhanced analytics service with conversion tracking
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

// Enhanced page view tracking with traffic source detection
export async function trackPageView(pagePath: string): Promise<void> {
  try {
    // Don't track admin pages or if in development
    if (pagePath.startsWith('/admin') || import.meta.env.DEV) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    // Detect traffic source
    const trafficSource = getTrafficSource(referrer, urlParams);
    
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        page_path: pagePath,
        referrer: referrer || null,
        session_id: getSessionId(),
        traffic_source: trafficSource,
        utm_campaign: urlParams.get('utm_campaign'),
        utm_medium: urlParams.get('utm_medium'),
        utm_content: urlParams.get('utm_content'),
      }),
    });

    if (!response.ok) {
      console.warn('Failed to track page view:', response.statusText);
    }
  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

// Track conversion events
export async function trackConversionEvent(
  eventType: 'page_view' | 'generator_start' | 'payment_start' | 'payment_complete',
  pagePath?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    if (import.meta.env.DEV) {
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: eventType,
        page_path: pagePath,
        metadata: metadata || null,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to track conversion event:', response.statusText);
    }
  } catch (error) {
    console.warn('Conversion tracking error:', error);
  }
}

// Track time spent on page
export async function trackTimeSpent(pagePath: string, timeSpentSeconds: number): Promise<void> {
  try {
    if (pagePath.startsWith('/admin') || import.meta.env.DEV || timeSpentSeconds < 5) {
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-time-spent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        page_path: pagePath,
        time_spent_seconds: timeSpentSeconds,
        is_bounce: timeSpentSeconds < 30,
      }),
    });

    if (!response.ok) {
      console.warn('Failed to track time spent:', response.statusText);
    }
  } catch (error) {
    console.warn('Time tracking error:', error);
  }
}

// Detect traffic source from referrer and UTM parameters
function getTrafficSource(referrer: string, utm: URLSearchParams): string {
  // UTM source takes priority
  const utmSource = utm.get('utm_source');
  if (utmSource) return utmSource;
  
  // No referrer = direct traffic
  if (!referrer) return 'direct';
  
  // Parse referrer domain
  try {
    const referrerDomain = new URL(referrer).hostname.toLowerCase();
    
    // Search engines
    if (referrerDomain.includes('google')) return 'google';
    if (referrerDomain.includes('bing')) return 'bing';
    if (referrerDomain.includes('yahoo')) return 'yahoo';
    if (referrerDomain.includes('duckduckgo')) return 'duckduckgo';
    
    // Social media
    if (referrerDomain.includes('facebook')) return 'facebook';
    if (referrerDomain.includes('twitter') || referrerDomain.includes('t.co')) return 'twitter';
    if (referrerDomain.includes('linkedin')) return 'linkedin';
    if (referrerDomain.includes('instagram')) return 'instagram';
    if (referrerDomain.includes('youtube')) return 'youtube';
    if (referrerDomain.includes('tiktok')) return 'tiktok';
    
    // Other known sources
    if (referrerDomain.includes('github')) return 'github';
    if (referrerDomain.includes('reddit')) return 'reddit';
    if (referrerDomain.includes('medium')) return 'medium';
    
    // Default to referral for other domains
    return 'referral';
  } catch (error) {
    return 'referral';
  }
}

// Time tracker class for accurate time measurement
export class TimeTracker {
  private startTime: number = Date.now();
  private isActive: boolean = true;
  private totalTime: number = 0;
  private pagePath: string;

  constructor(pagePath: string) {
    this.pagePath = pagePath;
    this.setupVisibilityTracking();
    this.setupBeforeUnload();
  }

  private setupVisibilityTracking() {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        // Page became hidden, pause timer
        if (this.isActive) {
          this.totalTime += Date.now() - this.startTime;
          this.isActive = false;
        }
      } else {
        // Page became visible, resume timer
        if (!this.isActive) {
          this.startTime = Date.now();
          this.isActive = true;
        }
      }
    });
  }

  private setupBeforeUnload() {
    window.addEventListener('beforeunload', () => {
      this.sendTimeSpent();
    });
  }

  private sendTimeSpent() {
    if (this.isActive) {
      this.totalTime += Date.now() - this.startTime;
    }
    
    const timeSpentSeconds = Math.round(this.totalTime / 1000);
    if (timeSpentSeconds > 0) {
      trackTimeSpent(this.pagePath, timeSpentSeconds);
    }
  }

  public destroy() {
    this.sendTimeSpent();
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

// Enhanced tracking for specific user actions
export const Analytics = {
  // Track when user starts using the generator
  trackGeneratorStart: (concept: string, tone: string, language: string) => {
    trackConversionEvent('generator_start', '/generator', {
      concept,
      tone,
      language,
      timestamp: new Date().toISOString()
    });
  },

  // Track when user initiates payment
  trackPaymentStart: (productId: string, amount: number) => {
    trackConversionEvent('payment_start', '/payment', {
      product_id: productId,
      amount,
      timestamp: new Date().toISOString()
    });
  },

  // Track successful payment completion
  trackPaymentComplete: (orderId: string, amount: number) => {
    trackConversionEvent('payment_complete', '/success', {
      order_id: orderId,
      amount,
      timestamp: new Date().toISOString()
    });
  },

  // Track page views with enhanced data
  trackPageView: trackPageViewDebounced,

  // Create time tracker for a page
  createTimeTracker: (pagePath: string) => new TimeTracker(pagePath),
};