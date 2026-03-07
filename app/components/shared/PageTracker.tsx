"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Silent component — records a page view to the `page_views` table
 * every time the pathname changes. Drop into the root/storefront layout.
 * Silently ignores errors if the table doesn't exist yet.
 */
export default function PageTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!pathname) return;
    // Don't track admin routes
    if (pathname.startsWith("/admin")) return;

    const sb = createClient();
    const track = async () => {
      try {
        await sb.from("page_views").insert({ path: pathname, viewed_at: new Date().toISOString() });
      } catch (e) {
        // silent
      }
    };
    track();
  }, [pathname]);

  return null;
}
