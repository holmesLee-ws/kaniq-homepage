// QA r1 independent browser run — 20261006-kaniq-homepage, commit 4be4286, server :3100
const { chromium } = require("playwright");
const fs = require("fs");
const B = process.env.QA_BASE || "http://localhost:3100";
const E = process.argv[2];
const out = { base: B, startedAt: new Date().toISOString(), A2: {}, A3: {}, A4: {}, A5: {}, A6: {}, A7: {}, pageErrors: [], consoleErrors: [] };
const shot = (p, n, opts = {}) => p.screenshot({ path: `${E}/qa-${n}.png`, ...opts });

const SPEC_H1 = {
  en: "Care your insurance won’t cover, planned in Korea.",
  ja: "ソウルまで2時間。精密検診も歯科も、週末で。",
  id: "Perjalanan cek kesehatan yang aman, bersama seluruh keluarga.",
  mn: "Солонгосын томоохон эмнэлэг — эхнээс нь дуустал монгол хэлээр.",
  ko: "동포와 유학생의 검진부터 기관 제휴까지, 한국어로.",
};
const SPEC_CARE = {
  en: ["implants", "lasik", "screening", "fertility"],
  ja: ["screening", "dental", "womens-wellness"],
  id: ["screening", "dental", "womens-health"],
  mn: ["screening", "womens-health", "serious-referral"],
  ko: ["student-checkup", "dental", "eye"],
};
const SPEC_MSG = { en: "WhatsApp", ja: "LINE", id: "WhatsApp", mn: "Messenger", ko: "KakaoTalk" };
const RE24 = /24\s*(hours?|h\b|時間|jam|цаг|시간)/i;

async function planState(p) {
  return p.evaluate(() => {
    const days = [...document.querySelectorAll("#plan-card ol.days > li")].map((li) => ({
      label: li.querySelector(".day-label").innerText.trim(),
      title: li.querySelector("h3").innerText.trim(),
      treat: li.classList.contains("is-treat"),
      items: [...li.querySelectorAll(".item")].map((it) => ({
        track: it.querySelector(".track")?.dataset.t,
        text: it.querySelector(".track + span")?.innerText.trim(),
        badge: it.querySelector(".okbadge")?.innerText.trim() || null,
        wait: !!it.querySelector(".okbadge.wait"),
      })),
    }));
    return {
      url: location.href,
      title: document.querySelector("#plan-title").innerText.trim(),
      sub: document.querySelector("#plan-sub").innerText.trim(),
      price: document.querySelector("#price").innerText.trim(),
      labels: days.map((d) => d.label),
      days,
      checked: [...document.querySelectorAll("#planner input:checked")].map((i) => i.id),
      active: document.activeElement?.id || document.activeElement?.tagName,
    };
  });
}
async function tabTo(p, id, max = 60) {
  for (let i = 1; i <= max; i++) {
    await p.keyboard.press("Tab");
    const a = await p.evaluate(() => document.activeElement?.id);
    if (a === id) return i;
  }
  throw new Error("tabTo failed " + id);
}

async function a2(ctx, w, h) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: w, height: h });
  await p.goto(B + "/en", { waitUntil: "networkidle" });
  const r = { viewport: `${w}x${h}`, steps: [] };
  const s0 = await planState(p);
  r.steps.push({ step: "initial", ...s0 });
  await p.locator("#plan-card").scrollIntoViewIfNeeded();
  await shot(p, `A2-${w}-1-initial-implants-7-2`);
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.mouse.click(5, 5); // focus document without activating controls
  r.tabsToTx = await tabTo(p, "tx-implants");
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(300);
  const s1 = await planState(p);
  r.steps.push({ step: "tx→screening (Arrow×2)", ...s1 });
  await p.locator("#plan-card").scrollIntoViewIfNeeded();
  await shot(p, `A2-${w}-2-screening-7-2`);
  await p.keyboard.press("Tab");
  r.daysFocus = await p.evaluate(() => document.activeElement?.id);
  await p.keyboard.press("ArrowLeft");
  await p.waitForTimeout(300);
  const s2 = await planState(p);
  r.steps.push({ step: "days→5 (Tab, ArrowLeft)", ...s2 });
  await shot(p, `A2-${w}-3-screening-5-2`);
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(300);
  const s3 = await planState(p);
  r.steps.push({ step: "days→10 (ArrowRight×2)", ...s3 });
  await p.keyboard.press("Tab");
  r.paxFocus = await p.evaluate(() => document.activeElement?.id);
  await p.keyboard.press("ArrowLeft");
  await p.waitForTimeout(300);
  const s4 = await planState(p);
  r.steps.push({ step: "pax→1 (Tab, ArrowLeft)", ...s4 });
  await p.keyboard.press("ArrowRight");
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(300);
  const s5 = await planState(p);
  r.steps.push({ step: "pax→3 (ArrowRight×2)", ...s5 });
  await shot(p, `A2-${w}-4-screening-10-3`);
  await p.keyboard.press("Space");
  await p.waitForTimeout(200);
  const s6 = await planState(p);
  r.steps.push({ step: "Space on focused pax-3", ...s6 });
  // assertions
  const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const itemsText = (s) => JSON.stringify(s.days.map((d) => d.items.map((i) => i.text)));
  const nonD1 = (s) => JSON.stringify(s.days.filter((d) => d.label !== "D-1"));
  const d1 = (s) => JSON.stringify(s.days.find((d) => d.label === "D-1"));
  const badgesOk = (s) => s.days.every((d) => d.items.every((i) => i.track === "treat" || i.badge));
  r.assert = {
    a_title: s0.title !== s1.title, a_price: s0.price !== s1.price, a_items: itemsText(s0) !== itemsText(s1), a_labelsSame: eq(s0.labels, s1.labels),
    b5_title: s1.title !== s2.title, b5_labels: eq(s2.labels, ["D-1", "D0", "D1–2", "D3", "D4"]), b5_price: s1.price === s2.price,
    b10_labels: eq(s3.labels, ["D-1", "D0", "D1–2", "D3–5", "D6–8", "D9"]), b10_price: s3.price === s2.price, b10_title: s3.title !== s2.title,
    c1_sub: s4.sub !== s3.sub, c1_d1: d1(s4) !== d1(s3), c1_rest: nonD1(s4) === nonD1(s3), c1_labels: eq(s4.labels, s3.labels), c1_price: s4.price === s3.price, c1_title: s4.title === s3.title,
    c3_sub: s5.sub !== s4.sub && s5.sub !== s3.sub, c3_d1: d1(s5) !== d1(s4), c3_rest: nonD1(s5) === nonD1(s4), c3_price: s5.price === s4.price,
    space_keeps: eq(s6.checked, s5.checked) && s6.title === s5.title,
    url_unchanged: [s0, s1, s2, s3, s4, s5, s6].every((s) => s.url === s0.url),
    badges_all_nontreat: [s0, s1, s2, s3, s4, s5].every(badgesOk),
    keyboard_focus_path: r.daysFocus === "days-7" && r.paxFocus === "pax-2",
  };
  await p.close();
  return r;
}

async function a3(ctx, lang) {
  const r = { lang };
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(`${B}/${lang}`, { waitUntil: "networkidle" });
  Object.assign(r, await p.evaluate(() => {
    const h1 = document.querySelector("h1");
    const msg = [...document.querySelectorAll(".cta--messenger")];
    return {
      htmlLang: document.documentElement.lang,
      h1Inner: h1.innerText, h1Text: h1.textContent,
      band: document.querySelector(".draft-note")?.innerText || null,
      bandTop: document.querySelector(".draft-note")?.getBoundingClientRect().top ?? null,
      care: [...document.querySelectorAll("#care .care-chips li")].map((li) => li.dataset.care),
      careText: [...document.querySelectorAll("#care .care-chips li")].map((li) => li.innerText),
      special: document.querySelector("#care .local-panel p")?.innerText,
      messengers: msg.map((m) => ({ tag: m.tagName, href: m.getAttribute("href"), text: m.innerText.replace(/\s+/g, " "), bg: getComputedStyle(m).backgroundColor, color: getComputedStyle(m).color, state: m.dataset.state })),
      messengerHrefCount: document.querySelectorAll(".cta--messenger[href]").length,
      body24: (document.body.innerText.match(/24\s*(hours?|h\b|時間|jam|цаг|시간)/i) || [null])[0],
      ctaClasses: [...new Set([...document.querySelectorAll(".cta")].map((a) => [...a.classList].filter((c) => c.startsWith("cta--")).join(" ")))],
      ctaCount: document.querySelectorAll(".cta").length,
      buttonsOutsideForms: [...document.querySelectorAll("button")].filter((b) => !b.closest("form")).map((b) => b.innerText),
      templateHrefs: [...document.querySelectorAll("#templates a")].map((a) => ({ href: a.getAttribute("href"), text: a.innerText.replace(/\s+/g, " "), cls: a.className })),
      navHrefs: [...document.querySelectorAll(".site-nav a")].map((a) => a.getAttribute("href")),
      bodyLangSample: document.querySelector("main").innerText.slice(0, 200),
      quoteLinks: [...document.querySelectorAll("a.cta--quote")].map((a) => a.getAttribute("href")),
    };
  }));
  r.h1Collapsed = lang === "ja" ? r.h1Inner.replace(/\s/g, "") : r.h1Inner.replace(/\s+/g, " ").trim();
  r.h1Match = r.h1Collapsed === SPEC_H1[lang];
  r.careMatch = JSON.stringify(r.care) === JSON.stringify(SPEC_CARE[lang]);
  r.messengerMatch = r.messengers.every((m) => m.text.startsWith(SPEC_MSG[lang]));
  await shot(p, `A3-${lang}-1440-hero`);
  await p.locator("#care").scrollIntoViewIfNeeded();
  await shot(p, `A3-${lang}-1440-care-bar`);
  await p.setViewportSize({ width: 390, height: 844 });
  await p.evaluate(() => window.scrollTo(0, 0));
  await p.waitForTimeout(300);
  await shot(p, `A3-${lang}-390-hero-bar`);
  r.barVisible390 = await p.evaluate(() => { const b = document.querySelector(".msgbar"); const rc = b.getBoundingClientRect(); return { pos: getComputedStyle(b).position, bottom: Math.round(rc.bottom), innerHeight }; });
  await p.close();
  return r;
}

async function switcher(ctx) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(`${B}/en/quote`, { waitUntil: "networkidle" });
  const r = {};
  await p.click("details.lang > summary");
  await p.waitForTimeout(200);
  Object.assign(r, await p.evaluate(() => ({
    open: document.querySelector("details.lang").open,
    links: [...document.querySelectorAll(".lang-menu a")].map((a) => a.getAttribute("href")),
    disabled: [...document.querySelectorAll('.lang-menu [aria-disabled="true"]')].map((s) => ({ text: s.innerText, tag: s.tagName, tabIndex: s.tabIndex, hasHref: s.hasAttribute("href") })),
  })));
  await shot(p, "A3-switcher-open-en-quote");
  // Tab traversal inside menu: phase-2 items must be skipped
  await p.focus("details.lang > summary");
  const seq = [];
  for (let i = 0; i < 8; i++) { await p.keyboard.press("Tab"); seq.push(await p.evaluate(() => document.activeElement.getAttribute("href") || document.activeElement.tagName + ":" + (document.activeElement.innerText || "").slice(0, 20))); }
  r.tabSeq = seq;
  await p.goto(`${B}/en/quote`, { waitUntil: "networkidle" });
  await p.click("details.lang > summary");
  await p.press("details.lang > summary", "Escape");
  r.escClosed = !(await p.evaluate(() => document.querySelector("details.lang").open));
  await p.click("details.lang > summary");
  await p.click('.lang-menu a[hreflang="ja"]');
  await p.waitForLoadState("networkidle");
  r.afterJa = p.url();
  await p.close();
  return r;
}

async function a4a5(ctx) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 1440, height: 900 });
  const r4 = {}, r5 = {};
  await p.goto(`${B}/en#trust`, { waitUntil: "networkidle" });
  Object.assign(r4, await p.evaluate(() => ({
    receiptTotal: document.querySelector(".receipt .total")?.innerText.replace(/\s+/g, " "),
    receiptRows: [...document.querySelectorAll(".receipt .rows > *")].map((x) => x.innerText.replace(/\s+/g, " ")),
    seal: !!document.querySelector(".seal"),
    sampleInTrust: [...document.querySelectorAll("#trust .sample, .registry .sample")].map((s) => s.innerText),
    records: document.querySelectorAll(".registry .record").length,
    doctors: document.querySelectorAll(".registry .doctor").length,
  })));
  await p.locator(".receipt").scrollIntoViewIfNeeded();
  await shot(p, "A4-en-receipt");
  await p.locator(".registry").scrollIntoViewIfNeeded();
  await shot(p, "A4-en-records");
  await p.goto(`${B}/en`, { waitUntil: "networkidle" });
  // A5 sections on /en
  Object.assign(r5, await p.evaluate(() => {
    const q = (s) => document.querySelectorAll(s).length;
    return {
      doctorOkRows: q(".rule-grid tbody tr") || q(".rule-grid [role=row]") || q(".rule-grid > *"),
      recoveryRows: q(".recovery table tbody tr"), recoveryIsTable: !!document.querySelector(".recovery table"),
      recoveryHead: [...document.querySelectorAll(".recovery table thead th")].map((t) => t.innerText),
      steps: q("#trust-steps .steps > li"),
      templates: q("#templates .tpl > li") || q("#templates .tpl > *"),
      giveOptions: q('input[name="give"]'),
      previewRows: [...document.querySelectorAll(".ref-preview tr, .ref-preview li")].map((x) => x.innerText.replace(/\s+/g, " ")),
      previewMoney: /[₩$¥€]|\d[\d,.]*\s?(won|원|円|USD|IDR|MNT|₮)/i.test(document.querySelector(".ref-preview")?.innerText || ""),
      previewText: document.querySelector(".ref-preview")?.innerText,
      orgs: q("#organizations .org-list > li"),
      orgText: document.querySelector("#organizations")?.innerText.slice(0, 400),
    };
  }));
  await p.screenshot({ path: `${E}/qa-A5-en-full.png`, fullPage: true });
  for (const [sel, n] of [[".okrules", "doctor-ok"], [".recovery", "recovery"], ["#trust-steps", "problem-steps"], ["#templates", "templates"], ["#ambassador", "ambassador"], ["#organizations", "organizations"]]) {
    await p.locator(sel).first().scrollIntoViewIfNeeded();
    await shot(p, `A5-en-${n}`);
  }
  // ambassador keyboard
  await p.focus('input[name="give"]:checked').catch(async () => p.focus('input[name="give"]'));
  const before = await p.evaluate(() => document.querySelector('input[name="give"]:checked')?.id);
  await p.keyboard.press("ArrowRight");
  await p.waitForTimeout(200);
  const after = await p.evaluate(() => document.querySelector('input[name="give"]:checked')?.id);
  r5.ambassadorKeyboard = { before, after };
  await shot(p, "A5-en-ambassador-keyboard");
  // footers on /en, /en/quote, /mn
  r4.footers = {};
  for (const path of ["/en", "/en/quote", "/mn", "/ja", "/ko/quote"]) {
    await p.goto(B + path, { waitUntil: "networkidle" });
    r4.footers[path] = await p.evaluate(() => ({ reg: document.querySelector(".site-foot .reg")?.innerText.replace(/\s+/g, " "), samples: [...document.querySelectorAll(".site-foot .sample")].map((s) => s.innerText) }));
    if (["/en", "/en/quote", "/mn"].includes(path)) { await p.locator(".site-foot").scrollIntoViewIfNeeded(); await shot(p, `A4-footer${path.replace(/\//g, "-")}`); }
  }
  await p.goto(`${B}/ja#trust`, { waitUntil: "networkidle" });
  r4.jaTotal = await p.evaluate(() => document.querySelector(".receipt .total")?.innerText.replace(/\s+/g, " "));
  await p.locator(".receipt").scrollIntoViewIfNeeded();
  await shot(p, "A4-ja-receipt");
  await p.goto(`${B}/ja`, { waitUntil: "networkidle" });
  await p.locator(".recovery").scrollIntoViewIfNeeded();
  await shot(p, "A5-ja-recovery");
  r5.ja = await p.evaluate(() => ({ recoveryRows: document.querySelectorAll(".recovery table tbody tr").length, templates: document.querySelectorAll("#templates .tpl > li").length }));
  await p.goto(`${B}/mn`, { waitUntil: "networkidle" });
  await p.locator("#ambassador").scrollIntoViewIfNeeded();
  await shot(p, "A5-mn-ambassador");
  r5.mn = await p.evaluate(() => ({ give: document.querySelectorAll('input[name="give"]').length, orgs: document.querySelectorAll("#organizations .org-list > li").length, previewMoney: /[₩$¥€₮]/.test(document.querySelector(".ref-preview")?.innerText || "") }));
  await p.setViewportSize({ width: 390, height: 844 });
  await p.goto(`${B}/ja`, { waitUntil: "networkidle" });
  await p.locator(".recovery").scrollIntoViewIfNeeded();
  await shot(p, "A5-ja-recovery-390");
  await p.close();
  return { r4, r5 };
}

async function a6(ctx) {
  const p = await ctx.newPage();
  await p.setViewportSize({ width: 390, height: 844 });
  const r = { steps: [] };
  const state = async (n) => {
    const s = await p.evaluate(() => ({
      url: location.pathname + location.search,
      heading: document.querySelector(".quote-card h2")?.innerText,
      notice: document.querySelector(".quote-card .notice")?.innerText || null,
      errors: [...document.querySelectorAll(".quote-card .error")].map((e) => e.innerText),
      active: document.activeElement?.getAttribute("name") || document.activeElement?.tagName,
      checkedInterest: document.querySelector('input[name="interest"]:checked')?.id || null,
      privacy: document.querySelector("#privacy")?.innerText || null,
      consent: !!document.querySelector('input[name="consent"]'),
      done: document.querySelector('.quote-card[data-done="true"]')?.innerText || null,
    }));
    r.steps.push({ n, ...s });
    return s;
  };
  const next = () => p.click(".form-actions button[type=submit]");
  const posts = [];
  p.on("request", (q) => { if (q.url().includes("/api/quote")) posts.push({ method: q.method(), body: q.postData() }); });
  const resps = [];
  p.on("response", (q) => { if (q.url().includes("/api/quote")) resps.push(q.status()); });
  await p.goto(`${B}/ja/quote?interest=dental`, { waitUntil: "networkidle" });
  await state("Q1 interest=dental preselect"); await shot(p, "A6-ja-1-step1");
  await p.goto(`${B}/ja/quote`, { waitUntil: "networkidle" });
  await next(); await p.waitForTimeout(300);
  await state("Q2 step1 empty → next"); await shot(p, "A6-ja-2-step1-required");
  await p.click('label[for="interest-dental"]'); await next(); await p.waitForTimeout(300);
  await state("Q3 step1 ok → step2");
  await next(); await p.waitForTimeout(300);
  await state("Q4 step2 empty timing → next"); await shot(p, "A6-ja-3-step2-required");
  await p.locator('input[name="timing"]').first().check(); await p.check('input[name="pickup"]');
  await p.selectOption('select[name="stay"]', { index: 1 });
  await next(); await p.waitForTimeout(300);
  await state("Q5 step2 ok → step3"); await shot(p, "A6-ja-4-step3-privacy", { fullPage: true });
  await next(); await p.waitForTimeout(300);
  await state("Q6 step3 empty → submit");
  await p.fill('input[name="name"]', "QA Test"); await p.selectOption('select[name="contactMethod"]', "email"); await p.fill('input[name="contact"]', "bad-email");
  await p.check('input[name="consent"]'); await next(); await p.waitForTimeout(400);
  await state("Q7 invalid email → submit");
  await p.click(".form-actions button.quiet"); await p.waitForTimeout(200);
  const backState = await state("Q8 back → step2 values kept");
  r.backKept = await p.evaluate(() => ({ timing: !!document.querySelector('input[name="timing"]:checked'), pickup: document.querySelector('input[name="pickup"]')?.checked, stay: document.querySelector('select[name="stay"]')?.value }));
  await next(); await p.waitForTimeout(200);
  r.step3Kept = await p.evaluate(() => ({ name: document.querySelector('input[name="name"]')?.value, consent: document.querySelector('input[name="consent"]')?.checked }));
  await p.fill('input[name="contact"]', "qa@example.com");
  if (!(await p.isChecked('input[name="consent"]'))) await p.check('input[name="consent"]');
  // 422 path via route interception first
  await p.route("**/api/quote", (route) => route.fulfill({ status: 422, contentType: "application/json", body: JSON.stringify({ ok: false, errors: [{ field: "timing", code: "required" }] }) }));
  await next(); await p.waitForTimeout(500);
  await state("Q11 server 422 (intercepted) → error shown"); await shot(p, "A6-ja-5-server-422");
  await p.unroute("**/api/quote");
  // go to step3 again and submit real
  for (let i = 0; i < 3; i++) { const h = await p.evaluate(() => !!document.querySelector('input[name="name"]')); if (h) break; if (!(await p.evaluate(() => !!document.querySelector('input[name="timing"]:checked')))) await p.locator('input[name="timing"]').first().check(); await next(); await p.waitForTimeout(300); }
  await next(); await p.waitForTimeout(800);
  await state("Q10 real submit → done"); await shot(p, "A6-ja-6-done", { fullPage: true });
  r.posts = posts.map((x) => ({ method: x.method, keys: x.body ? Object.keys(JSON.parse(x.body)) : null }));
  r.resps = resps;
  await p.close();
  return r;
}

async function a7(browser) {
  const r = { widths: [], focus: {}, reduced: {} };
  const ctx = await browser.newContext();
  const p = await ctx.newPage();
  for (const path of ["/en", "/mn", "/en/quote", "/ja", "/ko"]) for (const [w, h] of [[390, 844], [768, 1024], [1440, 900]]) {
    await p.setViewportSize({ width: w, height: h });
    await p.goto(B + path, { waitUntil: "load" }); await p.waitForTimeout(250);
    const closed = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    await p.evaluate(() => { document.querySelector("details.lang").open = true; });
    await p.waitForTimeout(100);
    const open = await p.evaluate(() => [document.documentElement.scrollWidth, innerWidth]);
    r.widths.push({ path, w, closed, open, ok: closed[0] <= closed[1] && open[0] <= open[1] });
    if (["/en", "/mn", "/en/quote"].includes(path)) await shot(p, `A7-${path.replace(/\//g, "-").slice(1)}-${w}`);
  }
  // focus @1440x900
  await p.setViewportSize({ width: 1440, height: 900 });
  await p.goto(B + "/en", { waitUntil: "load" }); await p.waitForTimeout(250);
  await p.mouse.click(5, 5);
  const seq = [];
  for (let i = 0; i < 12; i++) {
    await p.keyboard.press("Tab");
    const f = await p.evaluate(() => {
      const a = document.activeElement;
      let target = a;
      if (a.tagName === "INPUT" && a.type === "radio") target = document.querySelector(`label[for="${a.id}"]`) || a;
      const cs = getComputedStyle(target);
      return { el: a.tagName + (a.id ? "#" + a.id : "") + (a.className ? "." + String(a.className).split(" ")[0] : ""), text: (a.innerText || a.getAttribute("aria-label") || "").slice(0, 24), outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`, boxShadow: cs.boxShadow };
    });
    seq.push(f);
    if (i === 0 || i === 1 || i === 3 || i === 7) await shot(p, `A7-focus-${i}`);
  }
  r.focus.seq = seq;
  // chip focus shot
  await p.focus("#tx-implants"); await p.keyboard.press("ArrowRight"); await p.keyboard.press("ArrowLeft");
  await shot(p, "A7-focus-chip");
  r.focus.chip = await p.evaluate(() => { const l = document.querySelector('label[for="tx-implants"]'); const cs = getComputedStyle(l); return `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}`; });
  // messenger bar quote link focus
  await p.focus(".msgbar a.cta--quote"); await p.keyboard.press("Shift+Tab"); await p.keyboard.press("Tab");
  r.focus.barQuote = await p.evaluate(() => { const a = document.activeElement; const cs = getComputedStyle(a); return { el: a.className, outline: `${cs.outlineStyle} ${cs.outlineWidth} ${cs.outlineColor}` }; });
  await shot(p, "A7-focus-bar");
  await ctx.close();
  // reduced motion
  const rc = await browser.newContext({ reducedMotion: "reduce", viewport: { width: 1440, height: 900 } });
  const q = await rc.newPage();
  await q.goto(B + "/en#trust", { waitUntil: "load" }); await q.waitForTimeout(400);
  r.reduced = await q.evaluate(() => {
    const all = [...document.querySelectorAll("*")];
    const anim = all.filter((e) => { const c = getComputedStyle(e); return c.animationName !== "none" && parseFloat(c.animationDuration) > 0.01; }).map((e) => e.tagName + "." + e.className);
    const trans = all.filter((e) => { const c = getComputedStyle(e); return c.transitionDuration.split(",").some((d) => parseFloat(d) > 0.01); }).map((e) => e.tagName + "." + e.className);
    return {
      matches: matchMedia("(prefers-reduced-motion: reduce)").matches,
      sealAnim: getComputedStyle(document.querySelector(".seal")).animationName,
      chipTransition: getComputedStyle(document.querySelector('label[for="tx-implants"]')).transitionDuration,
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      elementsWithAnimation: anim.slice(0, 10), animCount: anim.length,
      elementsWithTransition: trans.slice(0, 10), transCount: trans.length,
    };
  });
  await shot(q, "A7-reduced-trust");
  // control: no-preference
  const nc = await browser.newContext({ reducedMotion: "no-preference", viewport: { width: 1440, height: 900 } });
  const n = await nc.newPage();
  await n.goto(B + "/en#trust", { waitUntil: "load" }); await n.waitForTimeout(400);
  r.noPref = await n.evaluate(() => ({ sealAnim: getComputedStyle(document.querySelector(".seal")).animationName, chipTransition: getComputedStyle(document.querySelector('label[for="tx-implants"]')).transitionDuration, scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior }));
  await rc.close(); await nc.close();
  return r;
}

(async () => {
  const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true });
  const ctx = await browser.newContext();
  ctx.on("page", (pg) => { pg.on("pageerror", (e) => out.pageErrors.push(pg.url() + " " + e.message)); pg.on("console", (m) => { if (m.type() === "error") out.consoleErrors.push(pg.url() + " " + m.text()); }); });
  const run = async (k, f) => { try { return await f(); } catch (e) { return { error: e.stack }; } };
  if (process.env.QA_ONLY === "A7") { const prev = JSON.parse(fs.readFileSync(`${E}/qa-browser.json`)); prev.A7 = await run("A7", () => a7(browser)); prev.A7.rerunAt = new Date().toISOString(); fs.writeFileSync(`${E}/qa-browser.json`, JSON.stringify(prev, null, 2)); await browser.close(); console.log("done A7"); return; }
  out.A2.d1440 = await run("A2", () => a2(ctx, 1440, 900));
  out.A2.d390 = await run("A2", () => a2(ctx, 390, 844));
  out.A3.homes = {};
  for (const l of ["en", "ja", "id", "mn", "ko"]) out.A3.homes[l] = await run("A3", () => a3(ctx, l));
  out.A3.switcher = await run("A3", () => switcher(ctx));
  const x = await run("A45", () => a4a5(ctx));
  out.A4 = x.r4 || x; out.A5 = x.r5 || x;
  out.A6 = await run("A6", () => a6(ctx));
  out.A7 = await run("A7", () => a7(browser));
  out.finishedAt = new Date().toISOString();
  fs.writeFileSync(`${E}/qa-browser.json`, JSON.stringify(out, null, 2));
  await browser.close();
  console.log("done");
})();
