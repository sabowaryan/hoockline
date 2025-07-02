// Enhanced analytics service with proper authentication
let sessionId: string | null = null;

// Generate a session ID for this browser session
function getSessionId(): string {
  if (!sessionId) {
    // Use memory storage instead of localStorage
    sessionId = generateSessionId();
  }
  return sessionId;
}

function generateSessionId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Enhanced page view tracking with proper headers
export async function trackPageView(pagePath: string): Promise<void> {
  try {
    // Don't track admin pages or if in development
    if (pagePath.startsWith('/admin') || import.meta.env.DEV) {
      return;
    }

    // Check if analytics is properly configured
    if (!import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.warn('Analytics disabled: Supabase configuration missing');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    const referrer = document.referrer;
    
    // Detect traffic source
    const trafficSource = getTrafficSource(referrer, urlParams);
    
    const payload = {
      page_path: pagePath,
      referrer: referrer || null,
      session_id: getSessionId(),
      traffic_source: trafficSource,
      utm_campaign: urlParams.get('utm_campaign'),
      utm_medium: urlParams.get('utm_medium'),
      utm_content: urlParams.get('utm_content'),
    };

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-page-view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`Failed to track page view (${response.status}):`, errorText);
      return;
    }

    const result = await response.json().catch(() => null);
    if (result?.session_id) {
      sessionId = result.session_id;
    }

  } catch (error) {
    console.warn('Analytics tracking error:', error);
  }
}

// Track conversion events with proper authentication
export async function trackConversionEvent(
  eventType: 'page_view' | 'generator_start' | 'payment_start' | 'payment_complete' | 'phrase_copy' | 'error',
  pagePath?: string,
  metadata?: Record<string, any>
): Promise<void> {
  try {
    if (import.meta.env.DEV || !import.meta.env.VITE_SUPABASE_URL) {
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-conversion`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        event_type: eventType,
        page_path: pagePath,
        metadata: metadata || null,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`Failed to track conversion event (${response.status}):`, errorText);
    }
  } catch (error) {
    console.warn('Conversion tracking error:', error);
  }
}

// Track time spent on page with proper authentication
export async function trackTimeSpent(pagePath: string, timeSpentSeconds: number): Promise<void> {
  try {
    if (pagePath.startsWith('/admin') || import.meta.env.DEV || timeSpentSeconds < 5) {
      return;
    }

    if (!import.meta.env.VITE_SUPABASE_URL) {
      return;
    }

    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/track-time-spent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY,
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        page_path: pagePath,
        time_spent_seconds: timeSpentSeconds,
        is_bounce: timeSpentSeconds < 30,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`Failed to track time spent (${response.status}):`, errorText);
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
    const searchEngines = ['google', 'bing', 'yahoo', 'duckduckgo', 'baidu', 'yandex'];
    for (const engine of searchEngines) {
      if (referrerDomain.includes(engine)) return engine;
    }
    
    // Social media
    const socialPlatforms = [
      'facebook', 'twitter', 't.co', 'linkedin', 'instagram', 
      'youtube', 'tiktok', 'pinterest', 'snapchat', 'discord'
    ];
    for (const platform of socialPlatforms) {
      if (referrerDomain.includes(platform)) {
        return platform === 't.co' ? 'twitter' : platform;
      }
    }
    
    // Developer/Tech platforms
    const techPlatforms = ['github', 'stackoverflow', 'dev.to', 'hashnode'];
    for (const platform of techPlatforms) {
      if (referrerDomain.includes(platform)) return platform;
    }
    
    // Content platforms
    const contentPlatforms = ['reddit', 'medium', 'substack', 'hackernews'];
    for (const platform of contentPlatforms) {
      if (referrerDomain.includes(platform)) return platform;
    }
    
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
  private visibilityHandler: () => void;
  private beforeUnloadHandler: () => void;

  constructor(pagePath: string) {
    this.pagePath = pagePath;
    this.visibilityHandler = this.handleVisibilityChange.bind(this);
    this.beforeUnloadHandler = this.sendTimeSpent.bind(this);
    this.setupEventListeners();
  }

  private setupEventListeners() {
    document.addEventListener('visibilitychange', this.visibilityHandler);
    window.addEventListener('beforeunload', this.beforeUnloadHandler);
  }

  private handleVisibilityChange() {
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
    document.removeEventListener('visibilitychange', this.visibilityHandler);
    window.removeEventListener('beforeunload', this.beforeUnloadHandler);
  }
}

export function isAnalyticsEnabled(): boolean {
  return !!(
    import.meta.env.VITE_SUPABASE_URL && 
    import.meta.env.VITE_SUPABASE_ANON_KEY &&
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

// Track when a user copies a phrase
export async function trackPhraseCopy(phrase: string): Promise<void> {
  try {
    if (import.meta.env.DEV) return;
    await trackConversionEvent('phrase_copy', undefined, { phrase });
  } catch (error) {
    console.warn('Error tracking phrase copy:', error);
  }
}

// Track errors for debugging and monitoring
export async function trackError(errorType: string, message: string, details?: string): Promise<void> {
  try {
    if (import.meta.env.DEV) return;
    await trackConversionEvent('error', undefined, { errorType, message, details });
  } catch (error) {
    console.warn('Error tracking error event:', error);
  }
}

// Interface for the Analytics object
interface AnalyticsInterface {
  trackGeneratorStart: (concept: string, tone: string, language: string) => Promise<void>;
  trackPaymentStart: (productId: string, amount: number) => Promise<void>;
  trackPaymentComplete: (orderId: string, amount: number) => Promise<void>;
  trackPageView: (pagePath: string) => Promise<void>;
  createTimeTracker: (pagePath: string) => TimeTracker;
  trackPhraseCopy: (phrase: string) => Promise<void>;
  trackError: (errorType: string, message: string, details?: string) => Promise<void>;
}

// Export analytics interface
export const Analytics: AnalyticsInterface = {
  trackGeneratorStart: (concept: string, tone: string, language: string) => 
    trackConversionEvent('generator_start', undefined, { concept, tone, language }),
  trackPaymentStart: (productId: string, amount: number) => 
    trackConversionEvent('payment_start', undefined, { productId, amount }),
  trackPaymentComplete: (orderId: string, amount: number) => 
    trackConversionEvent('payment_complete', undefined, { orderId, amount }),
  trackPageView,
  createTimeTracker: (pagePath: string) => new TimeTracker(pagePath),
  trackPhraseCopy,
  trackError
};

