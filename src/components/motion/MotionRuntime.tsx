"use client";
import { useEffect } from "react";
import { docProgress, reachedSteps, viewProgress } from "@/lib/motion/progress";
export function MotionRuntime() {
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return;
    const root = document.documentElement;
    const io = new IntersectionObserver(
      (es) =>
        es.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).dataset.inview = "";
            io.unobserve(e.target);
          }
        }),
      { rootMargin: "0px 0px -15% 0px" },
    );
    document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
    root.dataset.enhanced = "";
    const views = [
      ...document.querySelectorAll<HTMLElement>('[data-scroll="view"]'),
    ];
    const head = document.querySelector<HTMLElement>(".site-head");
    const steps = document.querySelector<HTMLElement>("#trust-steps");
    const si = views.findIndex((el) => el.matches("#trust-steps ol.steps"));
    let compact = false,
      raf = 0;
    const frame = () => {
      raf = 0;
      const vh = innerHeight,
        y = scrollY,
        max = root.scrollHeight - vh;
      const ps = views.map((el) => {
        const r = el.getBoundingClientRect();
        return viewProgress(r.top, r.height, vh);
      });
      head?.style.setProperty("--doc-p", String(docProgress(y, max)));
      views.forEach((el, i) =>
        (el.closest<HTMLElement>("[data-scroll-host]") ?? el).style.setProperty(
          "--p",
          ps[i].toFixed(4),
        ),
      );
      if (steps && si >= 0)
        steps.dataset.reached = String(reachedSteps(ps[si]));
      const next = compact ? y >= 40 : y >= 80;
      if (next !== compact && head) {
        compact = next;
        head.toggleAttribute("data-compact", next);
      }
    };
    const on = () => {
      if (!raf) raf = requestAnimationFrame(frame);
    };
    frame();
    addEventListener("scroll", on, { passive: true });
    addEventListener("resize", on);
    return () => {
      io.disconnect();
      removeEventListener("scroll", on);
      removeEventListener("resize", on);
      cancelAnimationFrame(raf);
      delete root.dataset.enhanced;
    };
  }, []);
  return null;
}
