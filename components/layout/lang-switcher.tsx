"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { locales, localeLabels, type Locale } from "@/lib/i18n";

interface LangSwitcherProps {
  currentLocale: Locale;
}

/**
 * Swaps only the leading /si or /ta segment, preserving the rest of the
 * path — so switching language on a specific unit page keeps you on that
 * same unit rather than bouncing to the home page.
 *
 * Styled as a single `.mm-lang` pill (matching the mockup's language
 * button) that jumps to the other supported locale on click.
 */
export function LangSwitcher({ currentLocale }: LangSwitcherProps) {
  const pathname = usePathname() ?? `/${currentLocale}`;
  const rest = pathname.split("/").slice(2).join("/");
  const otherLocale = locales.find((locale) => locale !== currentLocale) ?? currentLocale;

  return (
    <Link
      className="mm-lang"
      href={`/${otherLocale}${rest ? `/${rest}` : ""}`}
      aria-label="Change language"
    >
      {locales.map((locale, i) => (
        <span key={locale} aria-current={locale === currentLocale ? "page" : undefined}>
          {i > 0 ? " / " : ""}
          {localeLabels[locale]}
        </span>
      ))}
    </Link>
  );
}
