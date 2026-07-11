"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { trackCtaClick, trackOutboundClick } from "@/lib/analytics";

type CtaLinkProps = ComponentProps<typeof Link> & {
  label: string;
  location: string;
  external?: boolean;
};

export function CtaLink({ label, location, external = false, href, onClick, ...props }: CtaLinkProps) {
  return (
    <Link
      href={href}
      onClick={(event) => {
        trackCtaClick(label, location);
        if (external && typeof href === "string") {
          trackOutboundClick(label, href);
        }
        onClick?.(event);
      }}
      {...props}
    />
  );
}
