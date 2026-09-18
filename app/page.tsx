"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { defaultLocale } from "@/lib/i18n";

/**
 * Static replacement for the old next.config.js redirects() entry
 * ("/" -> "/si"), which is a hard build error under output: "export"
 * (Next's own docs: rewrites/redirects/headers "do not apply when
 * exporting your Next.js application manually" — no config-level
 * workaround exists). middleware.ts is not an option either — Next
 * explicitly disables middleware under output: "export" too, since
 * there's no server to run it.
 *
 * This page itself IS pre-rendered to a real static out/index.html at
 * build time (it's a client component with no server data dependency),
 * so it works on any static host. Once that HTML loads in a browser,
 * the effect below fires immediately and replaces the URL client-side.
 *
 * IMPORTANT: this component does NOT render <html>/<body> — those
 * belong exclusively to app/layout.tsx (the root layout), and nesting
 * a second <html> here would be invalid. The <meta>/<noscript> below
 * are rendered directly (no <head> wrapper needed): React 19 hoists
 * <title>/<meta>/<link> to the document <head> automatically wherever
 * they appear in the component tree, including in a client component.
 *
 * The <meta http-equiv="refresh"> covers two cases the JS redirect
 * can't: users with JavaScript disabled, and any crawler that doesn't
 * execute client JS. A 0-second meta refresh is treated equivalently to
 * a redirect by major search engines, so this doesn't cost the
 * canonical/hreflang setup from Phase 1 anything.
 */
export default function RootRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(`/${defaultLocale}`);
  }, [router]);

  return (
    <>
      <meta httpEquiv="refresh" content={`0; url=/${defaultLocale}`} />
      <noscript>
        <p>
          Redirecting to <a href={`/${defaultLocale}`}>/{defaultLocale}</a>...
        </p>
      </noscript>
    </>
  );
}
