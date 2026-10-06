import type { Lang } from "@/lib/i18n/langs";
import type { QuoteInterest } from "@/content/types";
export function QuoteStartLink({
  lang,
  interest,
  children,
  variant = "primary",
}: {
  lang: Lang;
  interest?: QuoteInterest;
  children: React.ReactNode;
  variant?: "primary" | "quiet" | "text";
}) {
  return (
    <a
      className={`cta cta--quote cta--${variant}`}
      href={`/${lang}/quote${interest ? "?interest=" + interest : ""}`}
    >
      {children}
    </a>
  );
}
