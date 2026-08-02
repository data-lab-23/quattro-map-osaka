import type { Metadata } from "next";
import { Analytics } from "@/components/Analytics";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { siteDescription, siteKeywords, siteName, siteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: siteName,
  keywords: siteKeywords,
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  verification: {
    google: "zTMq_D0axaLmHIyprF-6pXTuXlenLS_yZ11rU5hGes0",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Analytics />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
