"use client";

import { useState } from "react";
import Link from "next/link";
import { LangSwitcher } from "./lang-switcher";
import { localeLabels, type Locale } from "@/lib/i18n";
import { siteConfig } from "@/lib/site-config";

interface SiteHeaderProps {
  locale: Locale;
}

const NAV_LINKS = [
  { href: "curriculum", label: "Curriculum" },
  { href: "learn", label: "How it works" },
  { href: "papers", label: "O/L papers" },
  { href: "faq", label: "FAQ" },
];

export function SiteHeader({ locale }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const home = `/${locale}`;

  return (
    <>
      <div className="mm-topbar">
        <div className="mm-container">
          <div className="mm-topnote">
            <i className="mm-dot" aria-hidden="true" />
            <span>Free practice • No account required</span>
          </div>
          <div className="mm-topnote">Built for Sri Lankan students • Grade 10 &amp; 11</div>
        </div>
      </div>

      <header className="mm-header">
        <nav className="mm-container mm-nav" aria-label="Main navigation">
          <Link className="mm-brand" href={home} aria-label={`${siteConfig.name} home`}>
            <div className="mm-brand-mark" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path
                  d="M5 17V7m0 5 5-5m-5 5 5 5M13 7h6m-3 0v10m0 0h3"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div>
              <span>{siteConfig.shortName}</span>
              <small>SANDBOX</small>
            </div>
          </Link>

          <div className={`mm-navlinks${menuOpen ? " mm-open" : ""}`}>
            {NAV_LINKS.map((link) => (
              <Link key={link.href} href={`${home}#${link.href}`} onClick={() => setMenuOpen(false)}>
                {link.label}
              </Link>
            ))}
          </div>

          <div className="mm-navactions">
            <LangSwitcher currentLocale={locale} />
            <Link className="mm-cta" href={`${home}#curriculum`}>
              Start learning
            </Link>
            <button
              className="mm-menu"
              type="button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
            >
              ☰
            </button>
          </div>
        </nav>
      </header>
    </>
  );
}

export function localeLabel(locale: Locale) {
  return localeLabels[locale];
}
