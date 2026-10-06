"use client";
import { useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { LANGS, NATIVE_NAME, PHASE2, type Lang } from "@/lib/i18n/langs";
import type { Dictionary } from "@/content/types";
export function LanguageSwitcher({
  lang,
  copy,
}: {
  lang: Lang;
  copy: Dictionary["header"];
}) {
  const ref = useRef<HTMLDetailsElement>(null);
  const path = usePathname();
  const suffix = path.replace(/^\/[^/]+/, "");
  useEffect(() => {
    const close = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node) && ref.current)
        ref.current.open = false;
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, []);
  return (
    <details
      className="lang"
      ref={ref}
      onKeyDown={(e) => {
        if (e.key === "Escape" && ref.current) {
          ref.current.open = false;
          ref.current.querySelector("summary")?.focus();
        }
      }}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget) && ref.current)
          ref.current.open = false;
      }}
    >
      <summary aria-label={`${copy.language}: ${NATIVE_NAME[lang]}`}>{NATIVE_NAME[lang]}</summary>
      <div className="lang-menu">
        {LANGS.map((l) => (
          <a
            key={l}
            href={`/${l}${suffix}`}
            hrefLang={l}
            lang={l}
            aria-current={lang === l ? "true" : undefined}
          >
            {NATIVE_NAME[l]}
          </a>
        ))}
        {PHASE2.map((l) => (
          <span key={l.code} aria-disabled="true">
            <span lang={l.code}>{l.name}</span> · {copy.phase2Soon}
          </span>
        ))}
      </div>
    </details>
  );
}
