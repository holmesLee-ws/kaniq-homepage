# KANIQ homepage

A patient-facing preview of a localized Korean medical journey platform. Five language homes (`/en`, `/ja`, `/id`, `/mn`, `/ko`) combine a journey planner, sample trust records, community referral preview, and a three-step quote form.

Use Node 22. Install with `npm ci`, then `npm run dev`. Production: `npm run build` followed by `npm start`. Verify with `npm run lint`, `npx tsc --noEmit`, `npm test`, and `npm run build`.

`src/config/site.ts` holds the brand, URL, registration placeholders, messenger URLs, and `launchState`. This release uses `preview`: channels have no links, registration records are marked as samples, and quote requests are validated without saving, logging, or forwarding the request body. To prepare a live release, replace sample records with reviewed real data, fill the official messenger URLs, and change the launch state; the current quote API still performs validation only and needs a separately approved intake implementation.

Content is stored in typed dictionaries under `src/content/`. Translations are developer drafts — **원어민 검수 필요** (native speaker review required for Japanese, Indonesian, Mongolian and Korean). Medical activity rules and prices are illustrative and require clinical and editorial review before live use.

Images are AI-generated draft assets copied from `design/drafts/img/` and optimized with `next/image`; draft originals remain intact. The planning brief is kept outside this public repository and must not be copied here. Product commits exclude `.loop/`, `.lessons/`, and temporary browser scripts.
