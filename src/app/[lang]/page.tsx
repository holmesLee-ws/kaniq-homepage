import { notFound } from "next/navigation";
import { LANGS, isLang } from "@/lib/i18n/langs";
import { getDictionary } from "@/content";
import { Hero } from "@/components/home/Hero";
import { LocalBlock } from "@/components/home/LocalBlock";
import { RecoveryExplorer } from "@/components/home/RecoveryExplorer";
import { TrustReceipt } from "@/components/home/TrustReceipt";
import { RecordCards } from "@/components/home/RecordCards";
import { ProblemSteps } from "@/components/home/ProblemSteps";
import { TemplateList } from "@/components/home/TemplateList";
import { Ambassador } from "@/components/home/Ambassador";
import { Organizations } from "@/components/home/Organizations";
export const dynamicParams = false;
export const generateStaticParams = () => LANGS.map((lang) => ({ lang }));
export default async function Page({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!isLang(lang)) notFound();
  const d = getDictionary(lang);
  return (
    <main id="main">
      <Hero dict={d} />
      <LocalBlock dict={d} />
      <RecoveryExplorer doctorOk={d.doctorOk} recovery={d.recovery} />
      <section id="trust" className="section wrap">
        <div className="trust-top">
          <div>
            <h2>{d.trust.title}</h2>
            <p className="intro">{d.trust.intro}</p>
          </div>
          <TrustReceipt copy={d.trust.receipt} />
        </div>
        <RecordCards dict={d} />
        <ProblemSteps copy={d.trust.steps} />
      </section>
      <TemplateList dict={d} />
      <Ambassador copy={d.ambassador} />
      <Organizations copy={d.organizations} />
    </main>
  );
}
