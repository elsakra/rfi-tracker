'use client'

import Script from 'next/script'

// Replace with your actual Google Ads ID
const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_TRACKING_ID

export function GoogleAnalytics() {
  if (!GA_TRACKING_ID) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_TRACKING_ID}');
          `,
        }}
      />
    </>
  )
}

// Track conversions
export function trackConversion(conversionLabel: string, value?: number) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag && GA_TRACKING_ID) {
    (window as unknown as { gtag: Function }).gtag('event', 'conversion', {
      send_to: `${GA_TRACKING_ID}/${conversionLabel}`,
      value: value || 100,
      currency: 'USD',
    })
  }
}

// Track page views with UTM parameters
export function trackPageView(url: string) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag && GA_TRACKING_ID) {
    (window as unknown as { gtag: Function }).gtag('config', GA_TRACKING_ID, {
      page_path: url,
    })
  }
}

// Track custom events
export function trackEvent(action: string, category: string, label?: string, value?: number) {
  if (typeof window !== 'undefined' && (window as unknown as { gtag?: Function }).gtag) {
    (window as unknown as { gtag: Function }).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    })
  }
}


