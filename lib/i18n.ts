export const locales = ["si", "ta"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "si";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export const localeLabels: Record<Locale, string> = {
  si: "සිංහල",
  ta: "தமிழ்",
};

// Used by generateStaticParams across [locale] routes
export function localeStaticParams() {
  return locales.map((locale) => ({ locale }));
}
