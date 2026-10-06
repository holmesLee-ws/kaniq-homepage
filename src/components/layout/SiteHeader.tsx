import { site } from "@/config/site";
import type { Dictionary } from "@/content/types";
import { LanguageSwitcher } from "./LanguageSwitcher";
export function SiteHeader({ dict }: { dict: Dictionary }) {
  return (
    <>
      <a className="skip" href="#main">
        {dict.header.skip}
      </a>
      <header className="site-head">
        <div className="wrap site-head-in">
          <a className="logo" href={`/${dict.lang}`}>
            <i aria-hidden="true" />
            {site.brand}
          </a>
          <nav className="site-nav" aria-label={dict.header.nav.care}>
            {(["care", "plan", "refer", "trust"] as const).map((k) => (
              <a
                key={k}
                href={`/${dict.lang}#${k === "refer" ? "ambassador" : k}`}
              >
                {dict.header.nav[k]}
              </a>
            ))}
          </nav>
          <LanguageSwitcher lang={dict.lang} copy={dict.header} />
        </div>
        <div className="read-progress" aria-hidden="true">
          <i />
        </div>
      </header>
    </>
  );
}
