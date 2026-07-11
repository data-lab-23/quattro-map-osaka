export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

type GtagCommand = "config" | "event" | "js" | "set";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (command: GtagCommand, targetId: string | Date, config?: AnalyticsParams) => void;
  }
}

export const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

const getPagePath = () => {
  if (typeof window === "undefined") return undefined;
  return `${window.location.pathname}${window.location.search}`;
};

const canTrack = () => typeof window !== "undefined" && Boolean(window.gtag) && Boolean(GA_ID);

export function pageview(url: string) {
  if (!canTrack() || !GA_ID) return;

  window.gtag?.("config", GA_ID, {
    page_path: url,
  });
}

export function event(action: string, params: AnalyticsParams = {}) {
  if (!canTrack()) return;

  window.gtag?.("event", action, {
    ...params,
  });
}

export function trackAmazonClick(bookTitle: string, asin: string) {
  event("amazon_click", {
    book_title: bookTitle,
    asin,
    category: "amazon_affiliate",
    page_path: getPagePath(),
  });
}

export function trackCtaClick(label: string, location: string) {
  event("cta_click", {
    label,
    location,
    page_path: getPagePath(),
  });
}

export function trackOutboundClick(label: string, url: string) {
  event("outbound_click", {
    label,
    url,
    page_path: getPagePath(),
  });
}

export function trackNewsletterSignup(location: string) {
  event("newsletter_signup", {
    location,
    page_path: getPagePath(),
  });
}

export function trackTemplateDownload(label: string) {
  event("template_download", {
    label,
    page_path: getPagePath(),
  });
}

export function trackContactSubmit(location: string) {
  event("contact_submit", {
    location,
    page_path: getPagePath(),
  });
}

export function trackScrollDepth(percent: number) {
  event("scroll_depth", {
    percent,
    page_path: getPagePath(),
  });
}

export function trackArticleReadComplete(slug: string) {
  event("article_read_complete", {
    slug,
    page_path: getPagePath(),
  });
}
