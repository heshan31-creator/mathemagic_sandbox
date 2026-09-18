import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { locales, localeLabels, type Locale } from "@/lib/i18n";

interface SiteFooterProps {
  locale: Locale;
}

export function SiteFooter({ locale }: SiteFooterProps) {
  const home = `/${locale}`;

  return (
    <footer className="mm-footer">
      <div className="mm-container">
        <div className="mm-footer-grid">
          <div className="mm-footer-brand">
            <div className="mm-brand">
              <div className="mm-brand-mark" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 17V7m0 5 5-5m-5 5 5 5M13 7h6m-3 0v10m0 0h3"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <div>
                <span>{siteConfig.shortName}</span>
                <small>SANDBOX</small>
              </div>
            </div>
            <p>{siteConfig.description}</p>
          </div>

          <div className="mm-footer-col">
            <div className="mm-footer-title">Learn</div>
            <Link href={`${home}/grade-10`}>Grade 10</Link>
            <Link href={`${home}/grade-11`}>Grade 11</Link>
            <Link href={`${home}/past-papers`}>O/L papers</Link>
            <Link href={`${home}#tools`}>Interactive tools</Link>
          </div>

          <div className="mm-footer-col">
            <div className="mm-footer-title">Languages</div>
            {locales.map((l) => (
              <Link key={l} href={`/${l}`}>
                {localeLabels[l]}
              </Link>
            ))}
          </div>

          <div className="mm-footer-col">
            <div className="mm-footer-title">Platform</div>
            <Link href={`${home}#learn`}>How it works</Link>
            <Link href={`${home}#faq`}>FAQ</Link>
            <Link href={`${home}/about`}>About</Link>
            <Link href={`${home}/contact`}>Contact</Link>
          </div>
        </div>

        <div className="mm-copyright">
          <span>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</span>
          <span>
            <Link href={`${home}/privacy-policy`}>Privacy Policy</Link> ·{" "}
            <Link href={`${home}/terms`}>Terms</Link>
          </span>
        </div>
      </div>
    </footer>
  );
}
