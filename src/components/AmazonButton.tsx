"use client";

import { trackAmazonClick, trackOutboundClick } from "@/lib/analytics";

type AmazonButtonProps = {
  bookTitle: string;
  asin: string;
  href: string;
  label?: string;
  className?: string;
};

export function AmazonButton({
  bookTitle,
  asin,
  href,
  label = "Amazonで見る",
  className = "primary-button",
}: AmazonButtonProps) {
  return (
    <a
      className={className}
      href={href}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => {
        trackAmazonClick(bookTitle, asin);
        trackOutboundClick(`Amazon: ${bookTitle}`, href);
      }}
    >
      {label}
    </a>
  );
}
