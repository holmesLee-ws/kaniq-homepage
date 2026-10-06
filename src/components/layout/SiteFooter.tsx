import { site } from "@/config/site";
import type { Dictionary } from "@/content/types";
export function SiteFooter({ dict: d }: { dict: Dictionary }) {
  return (
    <footer className="site-foot">
      <div className="wrap">
        <div className="foot-grid">
          <div>
            <strong className="logo">{site.brand}</strong>
            <p>{d.footer.tagline}</p>
          </div>
          <div>
            <h2>{d.footer.feeTitle}</h2>
            <ul>
              {d.footer.fee.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ul>
          </div>
          <div>
            <h2>{d.footer.privacyTitle}</h2>
            <p>{d.footer.privacy}</p>
          </div>
          <div>
            <h2>{d.footer.disputeTitle}</h2>
            <a href={`/${d.lang}#trust-steps`}>{d.footer.dispute}</a>
          </div>
        </div>
        <div className="reg">
          <span>
            {d.footer.regMedical}: {site.registration.medicalTourism}{" "}
            <span className="sample">{d.trust.sample}</span>
          </span>
          <span>
            {d.footer.regTravel}: {site.registration.travelAgency}{" "}
            <span className="sample">{d.trust.sample}</span>
          </span>
        </div>
      </div>
    </footer>
  );
}
