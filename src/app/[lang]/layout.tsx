import { notFound } from "next/navigation";
import { LANGS, isLang } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { buildMetadata } from "@/lib/seo";
import { schibsted } from "@/app/fonts";
import { PreviewBand } from "@/components/layout/PreviewBand";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { MessengerBar } from "@/components/layout/MessengerBar";
import "@/styles/globals.css";
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  return buildMetadata(lang, "", getDictionary(lang));
}
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const dict = getDictionary(lang);
  return (
    <html lang={lang}>
      <body className={schibsted.variable}>
        <PreviewBand dict={dict} />
        <SiteHeader dict={dict} />
        {children}
        <SiteFooter dict={dict} />
        <MessengerBar dict={dict} />
      </body>
    </html>
  );
}
