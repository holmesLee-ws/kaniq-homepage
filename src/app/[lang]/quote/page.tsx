import { Suspense } from "react";
import { notFound } from "next/navigation";
import { LANGS, isLang } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { site } from "@/config/site";
import { quoteNotice, quoteDoneText } from "@/lib/launch";
import { buildMetadata } from "@/lib/seo";
import { QuoteForm } from "@/components/quote/QuoteForm";
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return buildMetadata(lang, "/quote", getDictionary(lang));
}
export default async function Quote({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <main id="main" className="wrap section quote-page">
      <h1>{d.quote.title}</h1>
      <p>{d.quote.intro}</p>
      <Suspense>
        <QuoteForm
          lang={lang}
          copy={d.quote}
          care={d.care}
          notice={quoteNotice(d, site.launchState)}
          doneText={quoteDoneText(d, site.launchState)}
        />
      </Suspense>
    </main>
  );
}
