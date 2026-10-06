# Plan — 20261006-kaniq-homepage

## 1. 목표

그린필드 리포 `holmesLee-ws/kaniq-homepage`에 Next.js 16 App Router 사이트를 만든다. 언어(TypeScript, `src/`)별 홈 5개(`/en /ja /id /mn /ko`), 3단계 견적 폼(`/{lang}/quote`), 저장하지 않는 `POST /api/quote`, `/` 언어 협상 리다이렉트, sitemap·robots·OG를 갖춘다. 시각 체계는 **시안 A의 토큰·레이아웃을 정본**으로 쓴다. B의 영수증·기록 카드·4단계와 C의 언어권 블록·앰버서더·기관 존은 A 토큰으로 다시 그린다.

설계 축은 세 개다.
- (a) `launchState: 'preview' | 'live'`를 `src/config/site.ts` 한 곳에 둔다. 띠·메신저·회신 약속·견적 완료 문구는 모두 순수 함수 `src/lib/launch.ts`를 거쳐 이 값을 읽는다.
- (b) 콘텐츠는 `Dictionary` 타입 하나로 고정한 언어별 사전 5개다. 의료 규칙·가격 같은 언어 무관 데이터는 `src/content/shared/`에 한 벌만 둔다.
- (c) 플래너는 순수 함수 `buildPlan()`이다. UI는 그 결과만 그린다.

CTA는 두 컴포넌트(`MessengerCta`, `QuoteStartLink`)로만 만들 수 있다. 이 규칙은 테스트가 강제한다.

**권고안**
- 웹폰트는 Schibsted Grotesk(latin) 하나만 쓴다. 일본어·한국어·몽골어 키릴은 언어별 시스템 폰트 스택으로 처리한다(§3.7).
- 2단계 언어의 404는 `dynamicParams=false`와 `global-not-found`로 낸다.

**대안**: Noto Sans JP/KR/키릴 웹폰트(preload 끔)와 미들웨어 수동 404는 §8로 미룬다.

## 2. 현재 구조 (읽은 것만)

리포 추적 파일은 `README.md`(6줄)와 `design/drafts/**`뿐이다(`git ls-files`). `package.json`·`src/`·설정 파일은 없다. `.loop/`은 untracked다. 브랜치는 `holmesLee-ws/kaniq-homepage-build`다.

| 가져올 것 | 위치 (파일:줄) | 계획에서의 쓰임 |
|---|---|---|
| A 토큰 `:root` | `design/drafts/a-journey.html:11-27` | `src/styles/tokens.css` 정본(값 그대로) |
| A 기반 규칙(body 패딩 84px, focus-visible, reduced-motion) | `a-journey.html:28-35, 33, 168` | `globals.css` |
| A 헤더·nav·언어 select | `a-journey.html:37-45, 174-185` | `SiteHeader`. select는 `LanguageSwitcher`로 교체 |
| A 히어로·chips·btn | `a-journey.html:47-66, 188-227` | `Hero`, `JourneyPlanner` |
| A 플랜 카드 CSS | `a-journey.html:68-93` | `JourneyPlanner` 카드 |
| A 플래너 데이터 `TX` | `a-journey.html:354-375` | `shared/planner-data.ts`(가격·배지 규칙) + 사전 `planner.treatments`(문장) |
| A `render()` 골격 규칙 | `a-journey.html:389-414` (일수 분기 403-409, 인원 분기 392·397) | `buildPlan()` 동일 규칙 |
| A Doctor OK 규칙 그리드 | CSS `99-113`, 마크업 `245-267` | `DoctorOkRules` |
| A 회복 주간 표 | CSS `116-128`, 마크업 `269-295` | `RecoveryWeek` (§3.6의 a11y 수정 적용) |
| A 템플릿 6종 | CSS `141-147`, 마크업 `313-324` | `TemplateList` |
| A 푸터·등록번호 | CSS `150-157`, 마크업 `327-341` | `SiteFooter` |
| A 메신저 바 | CSS `160-166`, 마크업 `343-351` | `MessengerBar` |
| B 영수증(톱니 마스크·인장·로제트) | CSS `b-proof.html:55-76`, 마크업 `205-225`, 로제트 생성 `372-375` | `TrustReceipt` |
| B 병원·의사 기록 카드 | CSS `91-110`, 마크업 `240-279` | `RecordCards` |
| B 문제 발생 4단계 | CSS `129-137`, 마크업 `303-313` | `ProblemSteps` |
| C 메신저 색 `MSG` | `c-local.html:278-281` | `shared/messengers.ts` |
| C 언어권 데이터 `L` (H1 283-287, 2단계 288-293) | `c-local.html:282-294` | 사전 `hero.headline`·`local.*`, `PHASE2` 이름 |
| C 헤드라인 언어별 CSS | `c-local.html:55-61` | `:lang()` 규칙(§3.7) |
| C 앰버서더 | CSS `108-138`, 마크업 `217-243` | `Ambassador` |
| C 기관 존 | CSS `141-146`, 마크업 `245-257` | `Organizations` |
| 이미지 | `design/drafts/img/` — a-samgyetang 1600×1600, c-family-palace 1280×1600, b-consult 1600×1066 (sips 실측) | `src/assets/img/`에 **복사**(원본 수정 없음) |

시안을 그대로 옮기면 깨지는 곳(확인함):
- A의 회복 표(`272-294`)는 `role="table"`인데 `role="row"`가 없다. axe `aria-required-children` 위반이라 Lighthouse a11y가 깎인다.
- A `.matrix .none{color:#7E8E88}`(121)은 paper 배경 대비가 약 3.4라 AA 미달이다.
- A·B·C는 모두 "24 hours"를 쓴다(A 306·345, B 213·307·334·364, C 193·211·272·314). preview에서는 모두 빠져야 한다.
- A 템플릿·푸터 링크(`href="#"`)와 C의 "Become an ambassador"·"Request a partnership call"·"Download proposal"(231·249) 버튼은 세 번째 CTA가 된다. 모두 제거한다.
- A·B·C의 신뢰 문구 일부는 미등록 상태에서 사실이 아니다. A 303 "registration number links straight to the Ministry", B 312 배상보험 보유, C 221 "already send people to us". 이 문장은 쓰지 않는다.

기획서(`…/brief/kaniq-homepage-plan-deck.txt`)는 읽기만 했다. 계획에 쓴 것은 공개 가능한 원칙뿐이다(9장 언어권 표, 10장 표현 원칙, 15장 고지 4요소). 수치는 옮기지 않았다.

## 3. 변경 설계

### 3.0 스택 실측 (2026-10-06, `npm view`)

| 패키지 | 고정 | 근거 | 구분 |
|---|---|---|---|
| next | `16.3.8` (exact) | `npm view next version` = 16.3.8, dist-tag latest. engines node ≥20.9 | 실측 |
| react / react-dom | `19.3.0` | latest. next peer `^19.0.0` | 실측 |
| typescript | `^5` (현재 5.9.3) | latest는 **7.0.2**지만 typescript-eslint 8.71.1 peer가 `>=4.8.4 <6.1.0`이다. create-next-app@16.3.8 템플릿도 `typescript:"^5"`다 → 7은 쓰지 않는다 | 실측 |
| eslint | `^9` | latest는 **10.12.0**이지만 eslint-config-next 16.3.8 의존 `eslint-plugin-import`·`jsx-a11y` peer가 `…^9`까지다. 템플릿도 `eslint:"^9"`다 | 실측 |
| eslint-config-next | `16.3.8` | next와 같은 버전 | 실측 |
| @types/react, @types/react-dom | `^19` | 19.3.0 | 실측 |
| @types/node | `^22` | vitest 5 peer `^22 \|\| >=24`, 로컬 node v22.23.1 | 실측 |
| vitest | `^5.0.3` | engines node `^22.12 \|\| ^24 \|\| >=26`. **vite가 dependency가 아니라 peer다** → vite를 직접 설치한다 | 실측 |
| vite | `^8` | 8.3.3. vitest peer `^6.4 \|\| ^7 \|\| ^8` | 실측 |
| Node (Vercel) | `package.json` `"engines": {"node": "22.x"}` | vitest와 next 요구의 교집합 | 결정 |

Next 16 API는 context7 MCP에 OAuth가 필요해 이 탭에서 쓸 수 없었다. 대신 `next@16.3.8` tarball에 번들된 `dist/docs/`(AGENTS.md가 "읽고 쓰라"고 지시하는 공식 문서)를 읽었다.

| 항목 | Next 16.3.8 사실 | 출처 | 구분 |
|---|---|---|---|
| 미들웨어 | `middleware.ts`는 **deprecated, `proxy.ts`로 이름 변경**. `export function proxy(request)` + `export const config = { matcher }`. 기본 런타임은 Node. `runtime` 설정은 에러 | `docs/01-app/03-api-reference/03-file-conventions/middleware.md:11`, `proxy.md:11,32-37,253-255` | 실측(문서) |
| `params` | `Promise`다 — `const { lang } = await params` | `02-guides/internationalization.md`, `generate-metadata.md:54-63` | 실측(문서) |
| `PageProps`/`LayoutProps`/`RouteContext` 전역 타입 | `next dev/build/typegen` 때 **생성된다** → 새 클론에서 `npx tsc --noEmit`가 먼저 돌면 없다 | `page.md:125-140` | 실측(문서) → **쓰지 않는다**(§7 R2) |
| `generateStaticParams` + `dynamicParams=false` | 목록 밖 세그먼트는 404. Cache Components를 켜면 쓸 수 없다 → 켜지 않는다 | `dynamicParams.md` | 실측(문서) |
| 루트 레이아웃이 `app/[lang]/layout.tsx`일 때 404 | `app/global-not-found.tsx` + `experimental.globalNotFound: true`. 글로벌 CSS·폰트를 직접 import한다. 404에는 `noindex`가 자동으로 들어간다 | `not-found.md:47-74,187` | 실측(문서) |
| hreflang | `metadata.alternates.languages` → `<link rel="alternate" hreflang>` | `generate-metadata.md:823-848` | 실측(문서) |
| `x-default` 키 | languages 객체에 `'x-default'` 키를 허용하는지 문서 예시가 없다 | — | **추정**(타입 `Languages`에 포함으로 기억) — Developer는 첫 빌드 후 `curl`로 `hreflang="x-default"`를 확인한다. 없으면 §7 R5 폴백 |
| sitemap | `app/sitemap.ts` default export → `MetadataRoute.Sitemap`. 항목별 `alternates.languages` | `sitemap.md:219-250` | 실측(문서) |
| robots / OG | `app/robots.ts`. `opengraph-image.(jpg\|png)` 파일 규칙(≤8MB) + `opengraph-image.alt.txt` | `opengraph-image.md:15-34` | 실측(문서) |
| next/font | Schibsted Grotesk 서브셋은 `latin, latin-ext`뿐이고 **cyrillic 없음**. 가변 wght 400–900. Noto Sans JP/KR은 cyrillic·latin·vietnamese(+CJK 분할 슬라이스) | `next/dist/compiled/@next/font/dist/google/font-data.json` | 실측 |
| lint | create-next-app 16.3.8 템플릿 스크립트는 `"lint": "eslint"`. flat config는 `eslint-config-next/core-web-vitals` + `/typescript`. `next build`는 lint하지 않는다 | 템플릿 `dist/templates/app/ts/eslint.config.mjs`, `index.js` scripts | 실측 |

### 3.1 데이터 모델 — 설정·언어·사전

`src/config/site.ts` (브랜드·등록번호·모드를 한 곳에서 바꾼다):
```ts
export type LaunchState = 'preview' | 'live'
export const site = {
  brand: 'KANIQ',
  url: 'https://kaniq-homepage.vercel.app',
  launchState: 'preview' as LaunchState,
  registration: { medicalTourism: 'SAMPLE-0000-000', travelAgency: 'SAMPLE-0000-000' },
  messengerUrls: { WhatsApp: '', LINE: '', Messenger: '', KakaoTalk: '' } as Record<MessengerId, string>,
} as const
```

`src/lib/i18n/langs.ts`:
```ts
export const LANGS = ['en', 'ja', 'id', 'mn', 'ko'] as const
export type Lang = (typeof LANGS)[number]
export const DEFAULT_LANG: Lang = 'en'
export const isLang = (v: string): v is Lang => (LANGS as readonly string[]).includes(v)
export const NATIVE_NAME: Record<Lang, string> = { en: 'English', ja: '日本語', id: 'Bahasa Indonesia', mn: 'Монгол', ko: '한국어' }
export const PHASE2 = [ { code: 'hi', name: 'हिन्दी' }, { code: 'ru', name: 'Русский' }, { code: 'vi', name: 'Tiếng Việt' },
  { code: 'zh', name: '中文' }, { code: 'es', name: 'Español' }, { code: 'th', name: 'ไทย' } ] as const  // c-local.html:288-293
export const OG_LOCALE: Record<Lang, string> = { en: 'en_US', ja: 'ja_JP', id: 'id_ID', mn: 'mn_MN', ko: 'ko_KR' }
```

`src/content/shared/` (언어 무관, 한 벌):
- `messengers.ts`: `type MessengerId = 'WhatsApp' | 'LINE' | 'Messenger' | 'KakaoTalk'`. 색은 C `MSG`(`c-local.html:279-280`)에서 가져온다: WhatsApp `#128C4A`/`#fff`, LINE `#04843D`/`#fff`, Messenger `#0759D6`/`#fff`, KakaoTalk `#FEE500`/`#191919`.
- `planner-data.ts`: `PlannerTx = 'implants' | 'lasik' | 'screening' | 'womens-health' | 'fertility'`, `TrackId = 'Move' | 'Stay' | 'Treat' | 'Taste' | 'Feel' | 'See'`. `PLANNER_DATA[tx] = { price, early: Slot[3], mid: Slot[3], late: Slot[2] }`, `Slot = { track: TrackId; badge: BadgeRule }`, `BadgeRule = {kind:'ok'} | {kind:'from'; day:number} | {kind:'after-doctor'} | {kind:'not-until'; day:number} | {kind:'none'}`.
  - 값은 `a-journey.html:354-375`를 그대로 옮긴다. 가격은 implants `₩2.4M–3.2M`, lasik `₩1.6M–2.4M`, screening `₩0.5M–1.5M`, womens-health `₩3.0M–5.0M`, fertility `₩0.8M–1.5M`.
  - 배지 규칙: `"OK from day N"`→`from`, `"After your doctor's OK"`→`after-doctor`, `"No pool until day 14"`→`not-until 14`. `null`이고 track이 Treat가 아니면 `ok`("Doctor OK", 지금 가능)이고, track이 Treat이면 `none`이다.
  - **A2의 "활동에는 배지가 붙는다"를 닫기 위해 Treat 외 모든 활동이 배지를 갖는다.**
  - TX 대응: implant→implants, check→screening, women→womens-health, fert→fertility.
- `records.ts`: 병원 2곳·의사 2명의 언어 무관 값(`b-proof.html:246-277`) — 등록번호 `SAMPLE-2025-0412`/`SAMPLE-2024-0187`, 전문의 수 14/9, 인증, 이름(`nameLatin`, `nameKo`).

`src/content/types.ts` — **키 구조 고정**. 모든 언어 파일은 `satisfies Dictionary`로 쓰고, 배열 길이는 튜플 타입으로 고정한다:
```ts
export type CareId = 'implants' | 'lasik' | 'screening' | 'fertility' | 'dental' | 'eye'
  | 'womens-wellness' | 'womens-health' | 'serious-referral' | 'student-checkup'
export type QuoteInterest = 'screening' | 'dental' | 'eye' | 'womens-health' | 'fertility'
type T2<T> = readonly [T, T]; type T3<T> = readonly [T, T, T]; type T4<T> = readonly [T, T, T, T]; type T6<T> = readonly [T, T, T, T, T, T]

export type Dictionary = {
  lang: Lang
  meta: { title: string; description: string; quoteTitle: string; quoteDescription: string; ogAlt: string }
  previewBand: string                         // preview일 때만 렌더
  header: { skip: string; nav: { care: string; plan: string; refer: string; trust: string };
            language: string; phase2Soon: string }      // "Opens in December"
  hero: { homeFor: string; headline: readonly string[]; lede: string; quoteForPlan: string }
  planner: PlannerCopy
  care: Record<CareId, string>                 // 정식 시술·진료명
  local: { title: string; priorityTitle: string; priorityCare: readonly CareId[]; specialTitle: string;
           special: string; photoAlt: string; photoCaption: string }
  messenger: { channel: MessengerId; chatOn: string /* "Chat on {name}" */; opensAtLaunch: string }
  doctorOk: { badge: string; title: string; intro: string; caption: string; activity: string;
              rows: readonly { activity: string; after: string; okFromDay: number }[];   // 5행, D0~D6
              legendOk: string; legendNot: string; cellOk: string; cellNot: string }
  recovery: { title: string; intro: string; cols: { stage: string; stay: string; see: string; eat: string; culture: string };
              rows: T4<{ stage: string; note: string; stay: string; see: string; eat: string; culture: string }> }
  trust: {
    title: string; intro: string; sample: string
    receipt: { title: string; sub: string; rows: T4<{ what: string; who: string; amount: string }>; total: string; seal: string }
    records: { title: string; intro: string; figureAlt: string; figureCaption: string;
               labels: { registration: string; accreditation: string; specialists: string; languages: string };
               hospitals: T2<{ kind: string; specialists: string; languages: string; doctorBio: string }> }
    steps: { title: string; intro: string; items: T4<{ title: string; body: string }> }
  }
  templates: { title: string; intro: string; cta: string;
               items: T6<{ name: string; length: string; highlight: string; interest: QuoteInterest }> }
  ambassador: { title: string; intro: string; giveLegend: string; options: T4<{ label: string; note: string }>;
                signupNote: string;
                preview: { title: string; sample: string; code: string; cols: readonly [string, string, string, string, string];
                           rows: readonly { name: string; care: string; stage: 1 | 2 | 3 | 4 }[]; foot: string } }
  organizations: { title: string; intro: string; note: string; items: T4<{ who: string; what: string }> }
  footer: { tagline: string; regMedical: string; regTravel: string; feeTitle: string; fee: T3<string>;
            privacyTitle: string; privacy: string; disputeTitle: string; dispute: string }
  msgbar: { previewNote: string }
  quote: QuoteCopy                             // §3.4
  live: { replyPromise: string; quoteDone: string }   // ★ "24시간" 표현은 여기에만 둔다. live일 때만 렌더
}
```
`PlannerCopy`:
```ts
{ legend: { treatment; days; travelers }; pax: { one; two; group };            // 칩 라벨
  title: string /* "{name}, {n} days" */; subtitle: { one; two; group };        // "For 2 travelers, arriving at Incheon"
  rooms: { one; two; group };                                                   // D-1 숙소 (a-journey 397)
  dayTitles: { arrive; treatment; early; culture; free; home };
  fixed: { pickup; escort; finalCheck; dropoff };                               // a-journey 399-410
  tracks: Record<TrackId, string>;
  badges: { ok; from /* "OK from day {n}" */; afterDoctor; notUntil /* "Not until day {n}" */ };
  priceLabel; priceNote; feeLabel; photoAlt;
  treatments: Record<PlannerTx, { name: string; treat: string; early: T3<string>; mid: T3<string>; late: T2<string> }> }
```
`src/content/index.ts`: `const DICTS: Record<Lang, Dictionary> = { en, ja, id, mn, ko }`, `getDictionary(lang)`는 동기 함수다. 사전은 서버 컴포넌트에서 읽는다. 클라이언트 컴포넌트에는 필요한 조각(`planner`, `quote`, `care`, `header`)만 props로 넘긴다.

A3 fixture `tests/fixtures/localization.ts` (spec 표 그대로):
```ts
export const L10N = {
  en: { h1: 'Care your insurance won’t cover, planned in Korea.', care: ['implants','lasik','screening','fertility'], messenger: 'WhatsApp' },
  ja: { h1: 'ソウルまで2時間。精密検診も歯科も、週末で。', care: ['screening','dental','womens-wellness'], messenger: 'LINE' },
  id: { h1: 'Perjalanan cek kesehatan yang aman, bersama seluruh keluarga.', care: ['screening','dental','womens-health'], messenger: 'WhatsApp' },
  mn: { h1: 'Солонгосын томоохон эмнэлэг — эхнээс нь дуустал монгол хэлээр.', care: ['screening','womens-health','serious-referral'], messenger: 'Messenger' },
  ko: { h1: '동포와 유학생의 검진부터 기관 제휴까지, 한국어로.', care: ['student-checkup','dental','eye'], messenger: 'KakaoTalk' },
} as const
```
- `hero.headline`은 줄 배열이다. ja는 `['ソウルまで2時間。','精密検診も歯科も、','週末で。']`이고 `<br />`로 잇는다(`c-local.html:284`의 `\n` 위치와 같다). 나머지는 1원소다.
- 테스트는 `headline.join('') === L10N[lang].h1`로 확인한다. en의 `’`는 U+2019 그대로다(시안 C 283행).

### 3.2 `launchState` 분기 — `src/lib/launch.ts` (순수)
```ts
export function messengerView(dict: Dictionary, state: LaunchState, urls: Record<MessengerId, string>):
  { channel: MessengerId; label: string; href: string | null; soonText: string | null; colors: { bg: string; fg: string } }
  // live && urls[channel] !== '' → href=url, soonText=null
  // 그 외(preview, 또는 live인데 URL 빈 값) → href=null, soonText=dict.messenger.opensAtLaunch
export const previewBandText = (dict, state) => state === 'preview' ? dict.previewBand : null
export const barNote = (dict, state) => state === 'live' ? dict.live.replyPromise : dict.msgbar.previewNote
export const quoteNotice = (dict, state) => state === 'preview' ? dict.quote.previewNotice : null
export const quoteDoneText = (dict, state) => state === 'live' ? dict.live.quoteDone : dict.quote.donePreview
export function visibleCopy(dict, state): Omit<Dictionary,'live'> | Dictionary   // preview면 live 가지 제거 — 테스트용 투영
```
컴포넌트는 `site.launchState`와 `site.messengerUrls`를 이 함수에 넘긴다. 이 함수 밖에서 `launchState`를 비교하지 않는다.

### 3.3 라우팅

| 경로 | 파일 | 동작 |
|---|---|---|
| `/` | `src/proxy.ts` (`matcher: ['/']`) | `negotiateLanguage(req.headers.get('accept-language'))` → `NextResponse.redirect(new URL('/'+lang, req.url))`(307). 응답 헤더 `Vary: Accept-Language`. `app/page.tsx`는 만들지 않는다 |
| `/{lang}` | `src/app/[lang]/layout.tsx` + `page.tsx` | layout이 루트 레이아웃(`<html lang={lang}>`)이다. `generateStaticParams = () => LANGS.map(lang => ({ lang }))`, `export const dynamicParams = false`(layout과 두 page에 모두). 타입은 `{ params: Promise<{ lang: string }> }`로 직접 적고, `if (!isLang(lang)) notFound()` |
| `/{lang}/quote` | `src/app/[lang]/quote/page.tsx` | 서버 셸 + `<Suspense><QuoteForm/></Suspense>`(폼이 `useSearchParams`로 `?interest=`를 읽는다. Suspense가 없으면 빌드 에러) |
| `/api/quote` | `src/app/api/quote/route.ts` | `export async function POST(req: Request)`만 둔다. `next/server`를 import하지 않는다(테스트 용이). GET 등은 Next가 405를 낸다 |
| 2단계 `/hi /ru /vi /zh /es /th`, 기타 미일치 | `dynamicParams=false` → `src/app/global-not-found.tsx` | 404. `<html lang="en">`. globals.css·폰트를 직접 import한다. "Page not found"와 5개 홈 텍스트 링크(버튼 스타일 아님) |
| `/sitemap.xml` | `src/app/sitemap.ts` | `sitemapEntries()`(src/lib/seo.ts) — 홈 5 + 견적 5 = 10 URL. 각 항목에 `alternates.languages` 5개 |
| `/robots.txt` | `src/app/robots.ts` | `{ rules: { userAgent: '*', allow: '/', disallow: '/api/' }, sitemap: site.url + '/sitemap.xml' }` |
| OG | `src/app/[lang]/opengraph-image.jpg` + `opengraph-image.alt.txt` | c-family-palace에서 1200×630으로 자른다(아래 명령). 언어 공통 이미지, alt는 영어 1벌 |

`negotiateLanguage(header: string | null): Lang` — `src/lib/i18n/negotiate.ts`:
1. null·빈 문자열 → `'en'`.
2. `,`로 나눠 `tag;q=x`를 파싱한다. q가 없으면 1이다. q가 숫자가 아니거나 범위 밖이면 그 항목을 버리고, q≤0도 버린다. 태그는 소문자로 바꾸고 `*`는 무시한다.
3. q 내림차순으로 정렬한다. 같은 q면 원래 순서를 유지한다(stable).
4. 각 태그의 1차 서브태그(`ko-KR`→`ko`)가 `LANGS`에 있으면 첫 번째를 반환한다. 없으면 `'en'`.

OG 이미지 생성(Developer, macOS sips — 원본을 수정하지 않고 /tmp를 거친다):
```bash
sips --resampleWidth 1200 design/drafts/img/c-family-palace.jpg --out /tmp/og-1200.jpg   # 1200×1500
sips --cropToHeightWidth 630 1200 /tmp/og-1200.jpg --out "src/app/[lang]/opengraph-image.jpg"
```

메타데이터 — `src/lib/seo.ts`의 `buildMetadata(lang, path: '' | '/quote', dict): Metadata`(순수):
- `metadataBase: new URL(site.url)`
- `title`: 홈은 `meta.title`, 견적은 `meta.quoteTitle`. `description`도 같은 방식.
- `alternates: { canonical: '/'+lang+path, languages: { en:'/en'+path, ja:…, id:…, mn:…, ko:…, 'x-default': '/en'+path } }`
- `openGraph: { siteName: site.brand, locale: OG_LOCALE[lang], type: 'website' }`

layout은 `generateMetadata`에서 `buildMetadata(lang,'')`를, quote page는 `buildMetadata(lang,'/quote')`를 반환한다.

### 3.4 견적 폼과 API

**`src/lib/quote/schema.ts`** — 의존성 없는 수기 검증이다(zod 미도입, 최소 라이브러리 제약).
```ts
export type Timing = 'within-3-months' | '3-6-months' | 'not-sure'
export type StayPref = 'near-hospital' | 'hanok' | 'family-residence'
export type ContactMethod = 'email' | 'whatsapp' | 'line' | 'messenger' | 'kakaotalk'
export type QuoteInput = { lang: Lang; interest: QuoteInterest; timing: Timing; pickup?: boolean; stay?: StayPref;
  name: string; contactMethod: ContactMethod; contact: string; residence?: string; consent: true }
export type FieldError = { field: keyof QuoteInput | '_body'; code: 'required' | 'invalid' | 'too_long' }
export const STEP_FIELDS = { 1: ['interest'], 2: ['timing', 'pickup', 'stay'], 3: ['name', 'contactMethod', 'contact', 'residence', 'consent'] } as const
export function validateQuote(input: unknown): { ok: true; value: QuoteInput } | { ok: false; errors: FieldError[] }
export function validateStep(step: 1 | 2 | 3, draft: Partial<Record<string, unknown>>): FieldError[]   // validateQuote 결과를 STEP_FIELDS로 거른 것
```
규칙:
- 필수: lang(isLang), interest(5종), timing(3종), name(trim 1–80자), contactMethod(5종), contact(trim 3–120자), consent는 `=== true`.
- 선택: pickup은 boolean, stay는 3종 중 하나이거나 없음, residence는 0–80자.
- 문자열 필드 길이 초과는 `too_long`이다.
- `contactMethod==='email'`이면 contact가 `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`이어야 한다. 아니면 `invalid`.
- 알 수 없는 키는 무시한다(값에 넣지 않음).

**`POST /api/quote`** (`route.ts`):
```ts
export async function POST(req: Request) {
  const text = await req.text()
  if (text.length > 10_000) return Response.json({ ok: false, errors: [{ field: '_body', code: 'too_long' }] }, { status: 422 })
  let body: unknown; try { body = JSON.parse(text) } catch { return Response.json({ ok: false, errors: [{ field: '_body', code: 'invalid' }] }, { status: 422 }) }
  const r = validateQuote(body)
  return r.ok ? Response.json({ ok: true }, { status: 200 }) : Response.json({ ok: false, errors: r.errors }, { status: 422 })
}
```
- `console.*`·`fetch`·파일 쓰기·외부 SDK는 없다. 200 본문은 정확히 `{"ok":true}`다(id 없음).
- 운영 경로에 남는 것은 Vercel 기본 요청 로그(메서드·경로·상태)뿐이다. 본문은 남지 않는다.

**`QuoteCopy`** (사전 `quote`):
```
{ title; intro; previewNotice /* "등록 전이라 신청을 저장하거나 회신하지 않습니다" 계열 */;
  steps: T3<string> /* Interest · Dates · Contact */; stepOf /* "Step {n} of 3" */;
  interestLegend; timingLegend; timing: Record<Timing,string>; pickupLabel; stayLabel; stayNone; stay: Record<StayPref,string>;
  nameLabel; methodLabel; method: Record<ContactMethod,string>; contactLabel; residenceLabel; optional;
  privacy /* 목적·항목·보관 기간·전달 대상을 담은 1문장 */; consentLabel;
  next; back; submit; sending;
  errors: { required; invalid; too_long; network };
  doneTitle; donePreview; backHome }
```
`interest`의 칩 라벨은 사전 `care`의 screening·dental·eye·womens-health·fertility를 쓴다.

**QuoteForm 상태 전이 표** (클라이언트, `src/components/quote/QuoteForm.tsx`):

| # | 현재 상태 | 입력 | 기대 결과 |
|---|---|---|---|
| Q1 | 진입, `?interest=dental` | 로드 | 1단계, dental 선택됨. 잘못된 값이면 선택 없음 |
| Q2 | 1단계, 미선택 | 「다음」 | 1단계 유지. 그룹 아래 `errors.required`(`role="alert"`). 첫 라디오에 포커스. fieldset `aria-invalid` |
| Q3 | 1단계, 선택됨 | 「다음」 | 2단계. 스테퍼 `aria-current="step"` 이동. 단계 제목(`tabIndex=-1`)에 포커스 |
| Q4 | 2단계, timing 미선택 | 「다음」 | 2단계 유지, timing 오류 |
| Q5 | 2단계, timing 선택(픽업·체류 비어 있음) | 「다음」 | 3단계(선택 필드는 비어도 통과) |
| Q6 | 2·3단계 | 「이전」 | 이전 단계. 입력값 유지 |
| Q7 | 3단계, 이름·연락처·동의 중 하나 이상 비어 있음 | 「보내기」 | 요청 없음. 각 필드 오류. 첫 오류 필드에 포커스 |
| Q8 | 3단계, method=email, contact=`abc` | 「보내기」 | 요청 없음. contact `errors.invalid` |
| Q9 | 3단계, 모두 유효 | 「보내기」 | 버튼 `disabled` + `sending` → POST |
| Q10 | Q9 → 200 | — | 완료 화면: `doneTitle` + `quoteDoneText()`(preview면 저장·회신 안 함 문구). 제목에 포커스. 폼 숨김 |
| Q11 | Q9 → 422 | — | `errors[].field`가 속한 가장 앞 단계로 이동해 해당 필드 오류 표시 |
| Q12 | Q9 → 네트워크 실패/5xx | — | 3단계 유지. `errors.network`(`role="alert"`). 버튼 다시 활성 |

preview에서는 `quoteNotice()` 문구가 폼 상단(모든 단계)과 완료 화면에 보인다. 개인정보 1문장과 필수 동의 체크는 3단계에 있다.

### 3.5 컴포넌트 트리와 서버/클라이언트 경계

```
src/app/[lang]/layout.tsx (S)  html lang · body.className=font variable · globals.css
 ├ PreviewBand (S)            previewBandText() 있을 때만 렌더. role="note"
 ├ SiteHeader (S)             SkipLink · 로고 · nav 4개 = <a href="/{lang}#care|#plan|#ambassador|#trust"> (앵커, 버튼 스타일 아님)
 │   └ LanguageSwitcher (C)   <details> + 5개 <a href="/{code}{path}" hrefLang lang> + 6개 <span aria-disabled="true" lang> {name} · {phase2Soon}
 ├ {children}
 ├ SiteFooter (S)             tagline · 수수료 3원칙 · 개인정보 요약 · 분쟁 절차(→#trust-steps 앵커) · 등록번호 2개 + Sample 배지
 └ MessengerBar (S)           barNote() · MessengerCta(bar) · QuoteStartLink(quiet)

src/app/[lang]/page.tsx (S)
 ├ Hero (S)                   section#plan · homeFor · H1(headline 줄 + <br/>) · lede
 │   └ JourneyPlanner (C)     라디오 칩 3그룹(form) + 플랜 카드(article) + QuoteStartLink(primary, interest=TX→QuoteInterest)
 ├ LocalBlock (S)             section#care · 우선 진료 칩(li, 비인터랙티브) · 특화 · MessengerCta(block) · 사진(c-family-palace)
 ├ DoctorOkRules (S)          table.rule-grid (빈 칸에 sr-only cellNot)
 ├ RecoveryWeek (S)           진짜 <table> (데스크톱 표, ≤860px 블록 스택 + td::before data-col)
 ├ section#trust (S)
 │   ├ TrustReceipt (S)       4행 + 합계 "₩0"(컴포넌트 상수, 사전 아님) + 인장 SVG(aria-hidden, seal 문구) + 로제트 SVG(서버에서 생성)
 │   ├ RecordCards (S)        2장 · 각 카드와 의사 줄에 Sample 배지 · 사진(b-consult)
 │   └ ProblemSteps (S)       ol#trust-steps 4단계
 ├ TemplateList (S)           section#templates · 6행 · 각 행 QuoteStartLink(text, interest)
 ├ Ambassador (S)             section#ambassador · fieldset 네이티브 라디오 4개(JS 불필요 — 클라이언트로 만들지 않음) · signupNote · 추천 현황 미리보기(점 4단계, 금액 없음, Sample)
 └ Organizations (S)          section#organizations · 4종 목록 · note(버튼 없음)

src/app/[lang]/quote/page.tsx (S) → QuoteForm (C)

공용 CTA(서버/클라이언트 모두에서 쓸 수 있는 순수 컴포넌트 — 'use client' 없음, 서버 전용 import 없음)
 ├ MessengerCta     href 있으면 <a class="cta cta--messenger" href rel="noopener" target="_blank">, 없으면 <span class="cta cta--messenger" data-state="soon">{label}<small>{soonText}</small></span>
 └ QuoteStartLink   <a class="cta cta--quote cta--{primary|quiet|text}" href="/{lang}/quote[?interest=…]">
```
클라이언트 컴포넌트는 `JourneyPlanner`, `QuoteForm`, `LanguageSwitcher` 셋뿐이다. 환원처 선택은 네이티브 라디오라 서버 컴포넌트로 충분하다(디스패치 허용 목록보다 작다).

**CTA 강제 규칙**:
- `cta` 클래스 토큰은 `MessengerCta.tsx`·`QuoteStartLink.tsx`에만 쓸 수 있다.
- 어떤 `.tsx`에도 `href="#"`·`href='#'`를 쓰지 않는다.
- 폼 내부 `<button>`(다음·이전·보내기)은 `form-btn` 클래스를 쓴다. 이것은 폼 컨트롤이지 링크가 아니다.
- `tests/guards.test.ts`가 위 세 가지를 소스 스캔으로 확인한다.
- 시안의 "Download as PDF"(히어로)·"Become an ambassador"·"Request a partnership call"·"Download proposal"·"Copy link"·"Verify with the Ministry" 링크는 만들지 않는다. 템플릿의 "PDF 받기"는 `templates.cta` 라벨을 단 `QuoteStartLink variant="text"`다.

**LanguageSwitcher 전이 표** (`<details class="lang">`, 클라이언트는 닫기 동작만 담당):

| 시작 | 입력 | 기대 |
|---|---|---|
| 닫힘 | summary 클릭 / Enter / Space | 열림. 목록 11개(1단계 링크 5 + 2단계 비활성 6) 표시 |
| 열림 | Esc | 닫힘. summary에 포커스 |
| 열림 | 바깥 클릭 | 닫힘 |
| 열림 | Tab으로 마지막 링크 밖으로 나감(focusout이 details 밖) | 닫힘 |
| 열림 | `日本語` 선택(`/en/quote`에 있을 때) | `/ja/quote`로 이동(현재 하위 경로 유지). 현재 언어 링크는 `aria-current="true"` |
| 열림 | 2단계 항목에 Tab | 포커스가 가지 않는다(span). 클릭해도 이동 없음. 문구 "12월 오픈"(그 언어) |

**JourneyPlanner**:
- `useState({ tx:'implants', days:7, pax:2 })`로 시작하며 SSR 초기 렌더와 같다.
- 라디오 `onChange` → `buildPlan()` → 재렌더한다. 카드에 `updating` 클래스를 토글한다(애니메이션 `swap` — reduced-motion이면 꺼짐).
- `aria-live="polite" aria-atomic="true"`는 카드 제목+부제 블록에만 둔다(전체 낭독 방지).
- 네이티브 라디오이므로 Tab은 그룹 간 이동, 화살표는 그룹 내 이동+선택, Space는 선택이다. 별도 키 처리는 넣지 않는다.

### 3.6 플래너 순수 함수 — `src/lib/planner/build-plan.ts`
```ts
export type PlanInput = { tx: PlannerTx; days: 5 | 7 | 10; pax: 1 | 2 | 3 }
export type PlanView = { title: string; subtitle: string; price: string;
  days: { label: string; title: string; treat: boolean;
          items: { track: TrackId; trackLabel: string; text: string; badge: null | { text: string; wait: boolean } }[] }[] }
export function buildPlan(input: PlanInput, copy: PlannerCopy, data = PLANNER_DATA): PlanView
```
규칙(`a-journey.html:389-414`와 동일):
- title = `copy.title`의 `{name}`=treatments[tx].name, `{n}`=days.
- subtitle = `copy.subtitle[one|two|group]`, price = `data[tx].price`.
- D-1(arrive): [Move pickup, Stay rooms[pax]]
- D0(treatment, treat=true): [Treat treatments.treat, Move escort]
- D1–2(early): early 3개
- days=5 → `D3`(culture) mid[0..1]. 7·10 → `D3–5`(culture) mid 3개
- days=10 → `D6–8`(free) late 2개
- 마지막: days 5→`D4`, 7→`D6`, 10→`D9`(home): [Treat finalCheck, Move dropoff]
- 배지: `ok`→{copy.badges.ok, wait:false}, `from`→{from에 {n}, wait:false}, `after-doctor`→{afterDoctor, wait:true}, `not-until`→{notUntil에 {n}, wait:true}, `none`→null. D-1·D0·마지막 날의 고정 항목은 null이다.
- 라벨 `D1–2`·`D3–5`·`D6–8`은 en dash(U+2013)를 쓴다. 언어와 관계없이 같다.

### 3.7 디자인 토큰과 B·C 재작도

`src/styles/tokens.css` — A `:root`(11-27)를 값 그대로 옮기고 아래 파생 토큰을 더한다(A에서 하드코딩된 값을 이름 붙여 승격):
```css
--text-2:#33464C; --text-3:#4C5E63; --text-on-pine:#EAF2EE; --text-on-pine-2:#C7DAD2;
--text-on-ink:#C7D3CE; --none:#5E6E68 /* A의 #7E8E88은 AA 미달 → 교체 */; --wait-line:#8A9A93;
--radius-lg:28px; --radius-md:14px; --radius-pill:999px;
--font-sans: var(--font-schibsted), system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
--msg-whatsapp:#128C4A; --msg-line:#04843D; --msg-messenger:#0759D6; --msg-kakao:#FEE500; --msg-kakao-fg:#191919;
```
`globals.css`는 A의 CSS(28-168)를 섹션별로 옮기고 아래처럼 바꾼다. B·C 섹션은 다음 규칙으로 다시 그린다.

| 섹션 | B·C 원형 | A 토큰으로 바꾸는 규칙 |
|---|---|---|
| 영수증 | B `.receipt` 톱니 mask·`rotate(.6deg)`·dashed 행 | 배경 `#fff`, 행 구분은 `1px dashed var(--line)`, 글꼴은 `--font-sans`. 제목은 A `.plan-top h2`(step-2, 700). 합계 `₩0`은 `var(--step-3)`·750·`letter-spacing:-.035em`. 그림자는 A `.plan`과 같다. 톱니 mask는 B 수치 그대로 |
| 인장 | B `.seal`(seal 빨강, multiply) + stamp 애니메이션 | 색 `var(--pine)`, 가운데 `0`은 `--font-sans` 800. 링 문구는 `trust.receipt.seal`(언어별, aria-hidden). `stamp` keyframes는 유지(reduced-motion이면 정지) |
| 로제트 | B 금색 guilloché | 색 `var(--celadon)`, opacity .35. 타원 36+24개를 서버 컴포넌트에서 문자열로 생성한다(b-proof 372-375 로직) |
| 기록 카드 | B `.record` dl 2열·모노그램 | 테두리 `var(--line)`, radius `--radius-md`, dt는 `--text-3`, dd는 700. 모노그램 원은 `--mist` 배경·`--pine` 글자. `Sample` 배지는 A `.okbadge.wait` 스타일(dashed `--wait-line`)을 카드 헤더와 의사 줄에 붙인다 |
| 문제 4단계 | B `.steps` 카운터 숫자 seal색 serif | 숫자는 `var(--pine)` 800 `var(--step-3)`, 구분선은 `var(--line)`, 상단선은 `2px solid var(--ink)`(A `.tpl`과 같은 언어). 반응형은 B 136-137 |
| 언어권 블록 | C `.facts`·`.care` 칩·`.special` | `--mist` 배경 패널(radius-lg, 패딩은 A `.okrules`와 같음). 칩은 `#fff` 배경·테두리 없음·600(버튼처럼 보이지 않게). 사진은 radius-lg, aspect 4/5(≤860px 4/3) |
| 메신저 CTA | C `.btn-msg` `--mbg/--mfg` | A `.btn` 형태(pill, 650). 배경·글자는 `--msg-*`. soon 상태: `cursor:default`, `<small>` 줄바꿈 `opacity:.9`, hover 효과 없음 |
| 앰버서더 | C `.amb` ultra 배경·marigold 선택 | 배경 `var(--pine)`, 글자 `--text-on-pine`, radius-lg. 선택지 카드 checked는 `var(--ok)` 배경 + `var(--ink)` 글자, focus-visible은 A 규칙. 미리보기 패널은 `#fff`이고 점 done=`--pine`, now=`--ok`, 대기=inset `--stop` |
| 기관 존 | C `.orgs`·`.org-list` | 상단선 `2px solid var(--ink)`, 행 구분 `var(--line)`, 보조 글자 `--text-3` |
| 상단 띠 | A `.draft-note`(35) | 같은 스타일(ink 배경·mist 글자). 문구는 `previewBand` |
| 회복 표 | A `.matrix` div 그리드 | `<table class="matrix">`로 바꾼다. 데스크톱은 `display:grid` 대신 table 레이아웃(열 150px + 4열). ≤860px은 `tr,td,th{display:block}`, `thead` 시각적 숨김, `td::before{content:attr(data-col)": "}`. `.none` 색은 `--none` |

**폰트 전략** (증강 맥락 4):
- `src/app/fonts.ts`: `Schibsted_Grotesk({ subsets: ['latin'], display: 'swap', variable: '--font-schibsted' })`. 이것이 유일한 웹폰트다(가변 1파일 + preload). layout과 global-not-found에서 `className={schibsted.variable}`로 쓴다.
- 언어별 폴백은 Latin 글리프가 Schibsted에서, 나머지는 시스템 폰트에서 나오게 한다:
```css
html:lang(ja){--font-sans:var(--font-schibsted),"Hiragino Sans","Hiragino Kaku Gothic ProN","Yu Gothic UI","Yu Gothic",Meiryo,"Noto Sans JP",sans-serif}
html:lang(ko){--font-sans:var(--font-schibsted),"Apple SD Gothic Neo","Malgun Gothic","Noto Sans KR",sans-serif}
html:lang(mn){--font-sans:var(--font-schibsted),system-ui,"Segoe UI",Roboto,"Helvetica Neue",Arial,"Noto Sans",sans-serif}
:lang(ja) h1,:lang(ko) h1,:lang(ja) h2,:lang(ko) h2{letter-spacing:0;line-height:1.2}   /* c-local 56 */
:lang(ko){word-break:keep-all} :lang(ja){line-break:strict}
.hero h1:lang(ja),.hero h1:lang(ko){max-width:none}   /* A 49의 12ch는 CJK에서 과도한 줄바꿈 */
```
- 근거: Lighthouse 측정 대상은 /en이다. CJK 웹폰트(수백 KB 분할 슬라이스)를 들이지 않으면 Perf 위험이 없다. 몽골어 키릴(Ө ө Ү ү 포함)은 macOS·Windows·Android 시스템 산세리프가 모두 커버한다(추정 — QA가 /mn 스크린샷으로 확인).
- 2단계 언어 이름(데바나가리·태국·한자)은 전환기 안의 짧은 이름뿐이라 시스템 폰트로 충분하다.
- 테마는 라이트 고정이다(`color-scheme: light`). 다크 모드는 지원하지 않는다.

이미지는 `src/assets/img/{a-samgyetang,c-family-palace,b-consult}.jpg`에 **복사**해 정적 import한다. `next/image`의 sizes는 플랜 사진 `96px`, 언어권 사진 `(max-width:860px) 100vw, 40vw`, 기록 사진 `(max-width:860px) 100vw, 45vw`로 준다. `priority`는 쓰지 않는다(LCP는 H1 텍스트). 나머지 3장은 쓰지 않는다.

### 3.8 번역 지침 (Developer 작성 — 원어민 검수는 비목표, README에 명시)

- **원문**은 시안 A·B·C의 영어 카피다(§2 표의 줄). 단 아래 문장은 쓰지 않거나 바꾼다.
  - A 303, A 315("download now"), B 312(보험 보유), C 221("already send … sign up in three minutes")은 미등록·미구현 상태에서 사실이 아니다.
  - 템플릿 intro는 "Six plans to start from. Pick one to start your quote."로 바꾼다.
  - 앰버서더 intro는 "누가 소개할 수 있고 환원처를 고를 수 있다, 가입은 출시 때 열린다"는 뜻으로 쓴다.
- **H1·우선 진료·특화·메신저**는 §3.1 fixture를 따른다. 특화 문구는 spec A3 표의 뜻을 그 언어로 쓴다. id는 "every partner hospital"(C 285)이 아니라 "near partner hospitals"로 쓴다(전칭 회피).
- **정식 진료명**(사전 `care`, 예시 — Developer 확정):

| id | en | ja | id | mn | ko |
|---|---|---|---|---|---|
| implants | Dental implants | 歯科インプラント | Implan gigi | Шүдний имплант | 치과 임플란트 |
| lasik | LASIK | レーシック(LASIK) | LASIK | LASIK мэс засал | 라식(LASIK) |
| screening | Health screening | 健康診断・人間ドック | Pemeriksaan kesehatan | Эрүүл мэндийн үзлэг | 건강검진 |
| dental | Dental care | 歯科 | Perawatan gigi | Шүдний эмчилгээ | 치과 |
| eye | Eye care | 眼科 | Perawatan mata | Нүдний эмчилгээ | 안과 |
| womens-health | Women's health | 婦人科・女性の健康 | Kesehatan wanita | Эмэгтэйчүүдийн эрүүл мэнд | 여성 건강 |
| womens-wellness | Women's wellness | 女性のウェルネス | Kebugaran wanita | Эмэгтэйчүүдийн сайн сайхан | 여성 웰니스 |
| fertility | Fertility consultation | 不妊相談 | Konsultasi kesuburan | Үргүйдлийн зөвлөгөө | 난임 상담 |
| serious-referral | Serious illness referral | 重症疾患の病院紹介 | Rujukan penyakit serius | Хүнд өвчний эмнэлэгт илгээх | 중증 질환 연계 |
| student-checkup | Student check-ups | 留学生健診 | Pemeriksaan pelajar | Оюутны үзлэг | 유학생 검진 |

- **의료광고 금지**(A9 grep과 같음, 모든 언어): 최상급·보장·비교·전후·미허가 시술이다. 쓰지 않을 표현 예시는 다음과 같다.
  - en: best, guarantee(d), No.1, cheapest, half the cost, before and after, stem cell
  - ko: 최고, 보장(**"보장하지 않습니다" 같은 부정 고지도 쓰지 않는다**), 전후, 줄기세포
  - ja: 最高, 保証
  - id: terbaik, jaminan
  - mn: хамгийн шилдэг, баталгаа
  - 부정 문장이 필요하면 "저장하지 않습니다 / does not save"처럼 금지어 없는 동사로 쓴다. 여성 웰니스는 시술명 없이 "여성 건강·회복"으로만 쓴다(기획서 10장 원칙).
- **수치 금지**:
  - `src/content/**`에 `%` 문자를 아예 쓰지 않는다.
  - 배분·요율 단어(수수료율, commission rate, referral rate)도 쓰지 않는다.
  - 가격은 `shared/planner-data.ts`의 `₩…M` 범위 5개만 쓴다.
  - 기획서의 리드·예산·CPL 숫자는 어디에도 쓰지 않는다.
- **"24시간" 계열**(24 hours / 24時間 / 24 jam / 24 цаг / 24시간)은 `live.replyPromise`·`live.quoteDone`에만 쓴다. 핫라인은 시간 표기 없이 "현지어 핫라인, 도착부터 귀국까지"로 쓴다.
- **사전 공개 띠** 초안(그 언어로, Developer가 다듬는다):
  - en "Preview site — KANIQ's registration is in progress. Requests are not saved or answered yet."
  - ja "事前公開サイトです — 登録手続き中のため、お申し込みは保存・返信されません。"
  - id "Situs pratinjau — pendaftaran KANIQ sedang diproses. Permintaan belum disimpan atau dibalas."
  - mn "Урьдчилсан нээлттэй сайт — бүртгэлийн үйл явц үргэлжилж байна. Хүсэлтийг хадгалахгүй, хариу өгөхгүй."
  - ko "등록 절차 중인 사전 공개 사이트입니다 — 신청은 저장·회신되지 않습니다."
  - `quote.previewNotice` ko는 spec 원문 "등록 전이라 신청을 저장하거나 회신하지 않습니다"이고, 다른 언어는 같은 뜻으로 쓴다.
- **개인정보 1문장**(`quote.privacy`)은 목적(견적 준비)·항목(관심 진료·일정·이름·연락처·거주지)·보관 기간(사전 공개 기간에는 저장하지 않음, 출시 후 최대 1년)·전달 대상(출시 후 고른 병원)을 한 문장에 담는다.
- **"샘플" 라벨**: en Sample · ja サンプル · id Contoh · mn Жишээ · ko 샘플.
- **2단계 표시 `header.phase2Soon`**: en Opens in December · ja 12月オープン · id Dibuka Desember · mn 12-р сард нээгдэнэ · ko 12월 오픈.
- 병원명은 ko에서 한국어(`nameKo`), 나머지 언어에서 `nameLatin`이다. 의사 이름도 같다. 모두 샘플이다.

### 3.9 package.json·설정

```jsonc
{
  "name": "kaniq-homepage", "private": true, "engines": { "node": "22.x" },
  "scripts": {
    "dev": "next dev", "build": "next build", "start": "next start",
    "lint": "eslint", "typecheck": "tsc --noEmit", "test": "vitest run"
  },
  "dependencies": { "next": "16.3.8", "react": "19.3.0", "react-dom": "19.3.0" },
  "devDependencies": { "typescript": "^5", "@types/node": "^22", "@types/react": "^19", "@types/react-dom": "^19",
    "eslint": "^9", "eslint-config-next": "16.3.8", "vitest": "^5.0.3", "vite": "^8" }
}
```
- `tsconfig.json`은 create-next-app 템플릿과 같고 `paths: { "@/*": ["./src/*"] }`를 쓴다. include에 `tests/**/*.ts`와 `vitest.config.ts`를 더하고, exclude에 `design`·`.loop`를 더한다.
- `src/types/next.d.ts`에 `/// <reference types="next" />`와 `/// <reference types="next/image-types/global" />`를 둔다. **새 클론에서 `next-env.d.ts` 없이 `tsc`가 통과하게 하려는 것**이다(§7 R2). `next-env.d.ts`는 `.gitignore`에 넣는다(템플릿 기본).
- `eslint.config.mjs`는 템플릿 그대로(core-web-vitals + typescript)이고 `globalIgnores`에 `design/**`, `.loop/**`, `evidence/**`를 더한다.
- `vitest.config.ts`: `defineConfig({ resolve: { alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) } }, test: { environment: 'node', include: ['tests/**/*.test.ts'] } })`. 테스트는 `.ts`만 쓴다(JSX 변환 불필요). TSX 컴포넌트는 import하지 않고 순수 모듈만 테스트한다.
- `next.config.ts`: `{ experimental: { globalNotFound: true } }`. 그 외는 기본값이다(images 기본 최적화).
- `.gitignore`는 템플릿 그대로(`node_modules`, `.next`, `next-env.d.ts`, `.vercel`, `*.tsbuildinfo` …)이고 `/evidence`를 더한다.
- 설치는 `npm install`로 하고 `package-lock.json`을 커밋한다. `create-next-app`은 쓰지 않는다(빈 리포가 아니고, 템플릿이 덮어쓰는 파일이 생긴다). 위 파일을 직접 쓴다.

## 4. 변경 파일 목록 (모두 신규, README만 수정)

| 경로 | 구분 | 이유 |
|---|---|---|
| `package.json`, `package-lock.json` | 신규 | §3.9 고정 버전·스크립트 |
| `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, `vitest.config.ts`, `.gitignore` | 신규 | §3.9 |
| `src/types/next.d.ts` | 신규 | 새 클론 `tsc` 통과 |
| `src/config/site.ts` | 신규 | 브랜드·URL·launchState·등록번호·메신저 URL 단일 지점 |
| `src/proxy.ts` | 신규 | `/` 언어 협상(Next 16 proxy) |
| `src/lib/i18n/langs.ts`, `src/lib/i18n/negotiate.ts` | 신규 | 언어 목록·협상 순수 함수 |
| `src/lib/launch.ts` | 신규 | preview/live 분기 순수 함수 |
| `src/lib/planner/build-plan.ts` | 신규 | 플래너 순수 함수 |
| `src/lib/quote/schema.ts` | 신규 | 견적 타입·검증 |
| `src/lib/seo.ts` | 신규 | buildMetadata·sitemapEntries |
| `src/content/types.ts`, `src/content/index.ts` | 신규 | 사전 스키마·조회 |
| `src/content/{en,ja,id,mn,ko}.ts` | 신규 | 언어 사전 5개(`satisfies Dictionary`) |
| `src/content/shared/{messengers,planner-data,records}.ts` | 신규 | 언어 무관 데이터 |
| `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx`, `src/app/[lang]/quote/page.tsx` | 신규 | 라우트 |
| `src/app/[lang]/opengraph-image.jpg`, `src/app/[lang]/opengraph-image.alt.txt` | 신규 | OG (sips 생성) |
| `src/app/api/quote/route.ts` | 신규 | POST 검증만 |
| `src/app/global-not-found.tsx`, `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/fonts.ts` | 신규 | 404·SEO·폰트 |
| `src/styles/tokens.css`, `src/styles/globals.css` | 신규 | A 토큰 정본 + 섹션 CSS |
| `src/components/cta/{MessengerCta,QuoteStartLink}.tsx` | 신규 | CTA 2종(유일한 `cta` 클래스 사용처) |
| `src/components/layout/{PreviewBand,SiteHeader,LanguageSwitcher,SiteFooter,MessengerBar}.tsx` | 신규 | 공통 틀(LanguageSwitcher만 클라이언트) |
| `src/components/home/{Hero,JourneyPlanner,LocalBlock,DoctorOkRules,RecoveryWeek,TrustReceipt,RecordCards,ProblemSteps,TemplateList,Ambassador,Organizations}.tsx` | 신규 | 홈 섹션(JourneyPlanner만 클라이언트) |
| `src/components/quote/QuoteForm.tsx` | 신규 | 3단계 폼(클라이언트) |
| `src/assets/img/{a-samgyetang,c-family-palace,b-consult}.jpg` | 신규(복사) | next/image 정적 import |
| `tests/fixtures/localization.ts` | 신규 | A3 fixture |
| `tests/{negotiate,proxy,planner,dictionary,launch,quote-schema,quote-route,seo,guards}.test.ts` | 신규 | §6 |
| `README.md` | 수정 | 실행·검증 명령, launchState 전환법, "번역은 개발자 초안 — 원어민 검수 필요", 이미지 출처(design/drafts 복사) |

★ 해당 없음: `.github/**`(human_gate)는 만들지 않는다. `.claude/rules/**`는 건드리지 않는다. `design/drafts/**`(protected)는 읽기·복사만 한다. 정본 store·가드된 CLI 레지스트리는 이 리포에 없다(그린필드). 기획서 텍스트는 리포에 들어가지 않는다.

## 5. 마이그레이션 여부

없음. DB·Prisma·RLS가 없고, 견적 API는 저장하지 않는다. 사람 게이트 경로(`.github/**`, `.claude/rules/**`)를 건드리지 않는다.

## 6. 검증 계획

### 6.1 실행

- 정적 검증: `npm run lint` · `npx tsc --noEmit` · `npm test` · `npm run build`(profile verify_cmds 순서). **새 클론(`.next`·`next-env.d.ts` 없음)에서 이 순서로 한 번** 돌려 R2를 확인한다.
- 실기 서버: `npm run build && npm start -- -p 3000` → `http://localhost:3000`. 계정 없음(공개 사이트). 테마는 라이트(단일).
- 브라우저: claude-in-chrome. 뷰포트는 DevTools 기기 에뮬레이션 또는 창 크기로 맞추고, 아래 수치를 기록에 남긴다.
- 증적: profile `qa.evidence_dir`(run 디렉터리 기준 `evidence/`). 리포 `src/`에는 넣지 않는다.

### 6.2 단위 테스트 (vitest, node 환경)

| 파일 | 대상 | 단언 | Acceptance |
|---|---|---|---|
| `tests/negotiate.test.ts` | `negotiateLanguage` | `en→en, ja→ja, id→id, mn→mn, ko→ko, ko-KR→ko, 'ko;q=0.1, en;q=0.9'→en, fr→en, null→en`(spec 9종) + `'' →en`, `'*'→en`, `'KO'→ko`, `'mn-MN'→mn`, `'zh-CN,ko;q=0.5'→ko`, `'ko;q=0, ja;q=0.1'→ja`, `'ja;q=abc, id'→id`, `'en;q=0.5, ja;q=0.5'→en`(동률은 순서) | A1 |
| `tests/proxy.test.ts` | `proxy(new NextRequest('http://localhost/', { headers }))` | status 307, `location` 끝이 `/ko`(ko-KR), `/en`(헤더 없음). `vary`에 `Accept-Language` 포함. `config.matcher`가 `['/']` | A1 |
| `tests/planner.test.ts` | `buildPlan` × 5개 언어 사전 | (a) 기본 days7·pax2에서 tx 5종 쌍마다 title≠, price≠, 활동 텍스트 집합≠, 일차 라벨 배열은 동일 (b) tx 고정 days 5/7/10 → title≠, 라벨 = `[D-1,D0,D1–2,D3,D4]`/`[D-1,D0,D1–2,D3–5,D6]`/`[D-1,D0,D1–2,D3–5,D6–8,D9]`, price 동일 (c) pax 1/2/3 → subtitle≠, D-1의 Stay 항목 텍스트≠, 라벨 배열·price 동일, D-1 외 모든 day deep-equal. Treat 외 활동(early/mid/late) 항목의 badge가 전부 non-null이고, `after-doctor`·`not-until`은 `wait:true`. treatments 문장 배열 길이가 PLANNER_DATA 슬롯 수와 같다 | A2 |
| `tests/dictionary.test.ts` | `DICTS` + fixture | 언어마다: `headline.join('') === L10N.h1`, `local.priorityCare`가 L10N.care와 순서까지 같음, `messenger.channel === L10N.messenger`, `lang` 필드 = 키. 모든 언어의 키 모양(재귀 key 경로 집합·배열 길이)이 en과 같음. 모든 문자열 leaf가 trim 후 비어 있지 않음. A5: `doctorOk.rows.length===5`, `recovery.rows 4`, `trust.steps.items 4`, `templates.items 6`, `ambassador.options 4`, `ambassador.preview.rows ≥3`, `organizations.items 4`, `trust.receipt.rows 4`, `trust.records.hospitals 2`. 각 템플릿 `interest`가 QuoteInterest | A3, A5 |
| `tests/launch.test.ts` | `src/lib/launch.ts` | preview: `messengerView().href===null`이고 soonText 있음, `previewBandText` 비어 있지 않음, `barNote`≠`live.replyPromise`, `quoteDoneText`=`quote.donePreview`, `quoteNotice` 있음. `JSON.stringify(visibleCopy(dict,'preview'))`가 `/24\s*(hours?|h\b|時間|jam|цаг|시간)/i`와 매치하지 않음(5개 언어). live+URL 있음: href=URL, band null, barNote=`live.replyPromise`, quoteNotice null. live+URL 빈 값: href null(soon 폴백) | A3(preview/live), A6 |
| `tests/quote-schema.test.ts` | `validateQuote`·`validateStep` | 유효 최소 입력 ok. 필수 누락마다 `{field, code:'required'}`. 잘못된 enum이면 invalid. name 81자면 too_long. email 형식 invalid. consent `false`/`'true'`면 required/invalid. 알 수 없는 키는 value에서 제거. `validateStep(1,{})`은 interest 오류만 | A6 |
| `tests/quote-route.test.ts` | `POST(new Request(...))` | 유효 → 200이고 본문 `{ok:true}`와 키가 정확히 같음(id 없음). 무효 → 422, `errors` 배열 비어 있지 않음. 깨진 JSON → 422 `_body`. 10KB 초과 → 422. `vi.spyOn(console, 'log'/'info'/'warn'/'error'/'debug')`와 `vi.spyOn(globalThis,'fetch')` 호출 0회 | A6 |
| `tests/seo.test.ts` | `buildMetadata`·`sitemapEntries`·`robots()` | ja 홈: canonical `/ja`, languages 5개 + `x-default: '/en'`. 견적: `/ja/quote`와 `x-default '/en/quote'`. sitemap 10 URL(홈 5 + quote 5), 각 항목 alternates 5개. robots에 sitemap URL | A8 |
| `tests/guards.test.ts` | 소스 스캔(fs) | (1) `src/**/*.tsx` 중 CTA 두 파일 밖에서 정규식 `\bcta\b` 클래스 사용 0. (2) `href=["']#["']` 0. (3) `src/content/**`에 `%` 0, A4 패턴 0. (4) `src/**`에 A9 표현 금지어 0(spec의 rg와 같은 단어 경계 정규식). (5) `src/**`·README에 A9 수치 토큰 0. (6) `site.launchState==='preview'`(이번 배포 상태 고정 확인) | A3(CTA), A4, A9 |

### 6.3 Acceptance ↔ 검증 매핑과 관측 레시피

공통 조건: 계정 없음 · `http://localhost:3000` · `npm run build && npm start` · 라이트 테마 · 확대 100%.

**A1 — curl + 단위(negotiate, proxy)**
```bash
for h in en ja id mn ko ko-KR 'ko;q=0.1, en;q=0.9' fr; do printf '%-22s ' "$h"; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' -H "Accept-Language: $h" http://localhost:3000/; done
printf '%-22s ' '(none)'; curl -s -o /dev/null -w '%{http_code} %{redirect_url}\n' http://localhost:3000/
for l in en ja id mn ko; do printf '%s ' $l; curl -s -o /tmp/h.html -w '%{http_code} ' http://localhost:3000/$l; grep -o '<html lang="[^"]*"' /tmp/h.html; done
for l in hi ru vi zh es th; do printf '%s ' $l; curl -s -o /dev/null -w '%{http_code}\n' http://localhost:3000/$l; done
```
기대: 리다이렉트 9줄은 `307` + `/en /ja /id /mn /ko /ko /en /en /en`. 홈 5줄은 `200 <html lang="xx"`. 2단계 6줄은 `404`.

**A2 — 단위(planner) + 브라우저**
- URL `/en`, 뷰포트 1440×900, 그다음 390×844.
- 조작 순서:
  1. 초기 화면(Dental implants · 7 · 2)을 스크린샷한다.
  2. 키보드만으로 조작한다. 페이지 상단에서 Tab을 반복해 Treatment 그룹(체크된 칩)에 도달한다 → → 키 2회(LASIK → Health screening)로 카드가 "Health screening, 7 days"·가격 `₩0.5M–1.5M`로 바뀌는지 본다(스크린샷 ②).
  3. Tab으로 Days 그룹 → ← 키로 5를 고른다 → 제목 "…, 5 days"와 라벨 `D3`·`D4`, 가격 동일(스크린샷 ③).
  4. Tab으로 Travelers 그룹 → → 키로 "3 or more"를 고른다 → 부제 "For a group of 3 or more…"와 D-1 숙소 "Family residence…", 일차·가격 동일.
  5. Space로 현재 포커스 칩을 다시 선택해도 상태가 유지되는지 본다.
- 전 과정에서 URL이 바뀌지 않는다(페이지 이동 없음).
- 기대 화면 한 줄: 칩 선택만으로 오른쪽(모바일은 아래) 카드가 다시 그려지고, Treat 외 활동마다 노란 또는 점선 배지가 붙는다.

| 시작 상태 | 입력 | 기대 |
|---|---|---|
| implants·7·2 | Treatment → Health screening | 제목·활동·가격 변경, 라벨 `[D-1,D0,D1–2,D3–5,D6]` 유지 |
| screening·7·2 | Days → 5 | 제목 "5 days", 라벨 `[D-1,D0,D1–2,D3,D4]`, D3 활동 2개, 가격 유지 |
| screening·5·2 | Days → 10 | 라벨에 `D6–8`·`D9`, 가격 유지 |
| screening·10·2 | Travelers → Just me | 부제 "For 1 traveler…", D-1 "Hotel 15 minutes…", 나머지 동일 |
| 임의 | reduced-motion on + 칩 변경 | 즉시 교체, 애니메이션 없음 |

**A3 — 단위(dictionary, launch, guards) + 브라우저**
- URL `/en`, `/ja`, `/id`, `/mn`, `/ko` 각각. 뷰포트 1440×900 히어로 1장 + 390×844 하단 바 포함 1장, 총 10장.
- 각 화면에서 확인할 것:
  - 상단 띠(그 언어)
  - H1이 fixture와 같음. ja는 3줄로 렌더되고, `document.querySelector('h1').innerText.replace(/\s/g,'')`가 fixture와 같다
  - 우선 진료 칩·특화 문구
  - 메신저 이름·색(en/id WhatsApp 녹색, ja LINE, mn Messenger 파랑, ko KakaoTalk 노랑)
  - `document.querySelectorAll('.cta--messenger[href]').length === 0`
  - `document.body.innerText`가 `/24\s*(hours?|時間|jam|цаг|시간)/i`와 매치하지 않음
- 언어 전환기: §3.5 전이 표 6행을 `/en/quote`에서 수행한다. `日本語` 선택 → `/ja/quote`. 2단계 6개는 Tab이 건너뛰고 "Opens in December"가 표시된다.
- CTA 검사:
  - `[...document.querySelectorAll('a.cta')].map(a=>a.className)`가 `cta--messenger`·`cta--quote`만 포함한다.
  - 템플릿 링크 6개의 href가 `/en/quote?interest=…`다.
  - 헤더 nav 4개 href가 `/en#care|#plan|#ambassador|#trust`다.
- 기대 화면 한 줄: 다섯 홈이 같은 레이아웃에 다른 헤드라인·진료·메신저를 보이고, 메신저는 "출시 때 열림" 상태다.

**A4 — 브라우저 + rg**
- URL `/en#trust`, 1440×900: 영수증 합계 `₩0`, 인장, 병원 카드 2장과 의사 줄마다 Sample 배지가 보인다.
- `/en`·`/en/quote`·`/mn` 푸터(스크롤 끝)에 등록번호 2개와 Sample이 보인다.
- `/ja#trust`의 합계도 `₩0`이다(통화 현지화 없음).
- `rg -n -w -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '수수료율' -e 'commission rate' -e 'referral rate' src/content` → 0건.

**A5 — 단위(dictionary) + 브라우저**
- `/en` 1440×900에서 전 섹션을 스크롤 스크린샷한다: Doctor OK 그리드 · 회복 주간 표 · 신뢰(영수증·카드·4단계) · 템플릿 6 · 앰버서더(환원처 4, 라디오를 Tab/화살표로 바꾸면 노란 선택이 이동, 미리보기에 금액·통화 기호 없음) · 기관 존 4종.
- `/ja`의 회복 주간 표 1장, `/mn`의 앰버서더 1장. 390×844에서 회복 표가 블록 스택과 열 이름 접두로 보인다.

**A6 — curl + 단위(quote-schema, quote-route) + 브라우저(ja 1회)**
```bash
curl -s -w ' %{http_code}\n' -H 'content-type: application/json' -d '{"lang":"ja","interest":"dental","timing":"not-sure","name":"Test","contactMethod":"email","contact":"t@example.com","consent":true}' http://localhost:3000/api/quote   # {"ok":true} 200
curl -s -w ' %{http_code}\n' -H 'content-type: application/json' -d '{"lang":"ja"}' http://localhost:3000/api/quote   # {"ok":false,"errors":[…]} 422
```
- 브라우저: `/ja/quote`, 390×844. §3.4 전이 표의 Q1(`/ja/quote?interest=dental`), Q2, Q3, Q4, Q5, Q6, Q7, Q9→Q10을 순서대로 수행한다.
- 확인할 것: 모든 단계 상단에 사전 공개 안내, 3단계에 개인정보 1문장(목적·항목·보관 기간·전달 대상)과 필수 동의 체크, 완료 화면에 저장·회신 안 함 문구. 서버 터미널(`npm start` 출력)에 요청 본문이 찍히지 않는지도 본다.
- Q12는 DevTools Network offline으로 확인한다.
- 기대 화면 한 줄: 일본어 3단계 폼이 단계마다 막고, 마지막에 "保存・返信しない" 완료 화면이 나온다.

**A7 — 브라우저 + Lighthouse**
- 폭 3종: `/en`, `/mn`, `/en/quote`를 각각 390×844, 768×1024, 1440×900에서 연다. 콘솔에서 `[document.documentElement.scrollWidth, innerWidth]`를 기록하고 앞이 뒤 이하여야 한다. 전환기를 연 상태에서도 확인한다.
- 포커스: `/en`에서 Tab으로 Skip 링크 → 로고 → nav → 전환기 → 칩에 3px pine 외곽선이 보이는지 스크린샷한다. 메신저 바 견적 링크, 앰버서더 라디오도 같다.
- reduced-motion: DevTools Rendering → `prefers-reduced-motion: reduce`로 설정하고 `/en#trust`를 연다.
  - `getComputedStyle(document.querySelector('.seal')).animationName === 'none'`
  - 칩 라벨 `transitionDuration === '0s'`
  - `getComputedStyle(document.documentElement).scrollBehavior === 'auto'`
- Lighthouse(로컬 production):
```bash
npm run build && npm start -- -p 3000 &
npx lighthouse@13.5.0 http://localhost:3000/en --form-factor=mobile --only-categories=performance,accessibility,best-practices,seo \
  --chrome-flags="--headless=new" --output=json --output=html --output-path=<evidence_dir>/lighthouse-en-mobile
node -e 'const r=require(process.argv[1]);for(const[k,v]of Object.entries(r.categories))console.log(k,Math.round(v.score*100))' <evidence_dir>/lighthouse-en-mobile.report.json
```
기대: performance ≥85, accessibility ≥95, best-practices ≥95, seo ≥95. 3회 중 중앙값을 기록한다.

**A8 — curl + 단위(seo)**
```bash
curl -s http://localhost:3000/ja | grep -o '<link rel="alternate" hrefLang="[^"]*" href="[^"]*"\|<link rel="alternate" hreflang="[^"]*" href="[^"]*"'   # 5개 + x-default → /en
curl -s http://localhost:3000/ja | grep -o '<title>[^<]*</title>\|<meta name="description" content="[^"]*"\|<meta property="og:image" content="[^"]*"'
curl -s http://localhost:3000/sitemap.xml | grep -c '<loc>'    # 10
curl -s http://localhost:3000/robots.txt
curl -sI "$(curl -s http://localhost:3000/ja | grep -o 'og:image" content="[^"]*' | cut -d'"' -f3)" | head -1   # 200
```
(og:image는 절대 URL `https://kaniq-homepage.vercel.app/...`로 나온다. 로컬에서는 호스트를 localhost:3000으로 바꿔 요청한다.)

**A9 — 명령 출력**
- spec A9의 rg 3개와 `git diff origin/main -- design/drafts`(빈 출력)를 실행한다.
- 오탐 제외는 근거와 함께 기록한다. 설계상 0건이 목표이고, §3.8과 guards.test가 같은 패턴을 사전에 막는다.

**A10 — Releaser(G4)**: lint·typecheck·test·build 통과 → main 머지 → production `curl -sI https://kaniq-homepage.vercel.app/en` 200 → 배포 메타 SHA = 머지 SHA. git 연결이 없으면 머지 SHA 체크아웃에서 `vercel deploy --prod`를 쓴다. 이 계획의 범위 밖이지만 build 산출물이 Vercel 기본값(framework=nextjs)으로 그대로 배포되도록 별도 설정 파일(`vercel.json`)을 만들지 않는다.

## 7. 리스크·회귀 지점

| # | 리스크 | 완화 |
|---|---|---|
| R1 | 최신판 TypeScript 7·ESLint 10을 깔면 typescript-eslint·eslint-plugin-import peer 충돌(ERESOLVE) 또는 lint 실패 | §3.0대로 `typescript ^5`, `eslint ^9`로 고정. `npm install`에 `--legacy-peer-deps` 금지 |
| R2 | 새 클론에서 `npx tsc --noEmit`가 `next build` 전에 돈다 → 생성 타입(`PageProps`, `next-env.d.ts`의 `.next/types` import) 부재로 실패 | 전역 생성 타입을 쓰지 않는다(params를 직접 타이핑). `src/types/next.d.ts`로 next·image 타입을 참조한다. `next-env.d.ts`는 gitignore. §6.1처럼 새 클론 순서로 1회 확인 |
| R3 | `global-not-found`는 experimental이다. 플래그가 빠지면 `/hi`가 레이아웃 없는 기본 404가 되거나 빌드 경고가 난다 | `next.config.ts` 플래그 + A1 curl 404 확인. 동작하지 않으면 폴백으로 proxy matcher에 2단계 6개 경로를 추가해 `new NextResponse(null,{status:404})`를 반환한다(§8) |
| R4 | `useSearchParams`에 Suspense가 없으면 빌드 실패 | quote page에서 `<Suspense>`로 감싼다(§3.3) |
| R5 | `alternates.languages`가 `'x-default'` 키를 무시할 수 있다(추정) | seo.test는 객체만 본다. 첫 빌드 후 A8 curl로 실제 태그를 확인한다. 없으면 layout `<head>`에 `<link rel="alternate" hrefLang="x-default" href={site.url+'/en'+path}/>`를 직접 렌더한다 |
| R6 | 시스템 폰트 폴백 때문에 ja·ko·mn 헤드라인 모양이 OS마다 다르다 | 웹폰트 비용 대신 수용한다(Perf 목표 우선). QA 스크린샷은 macOS Chrome 기준. 대안은 §8 |
| R7 | 390px 가로 넘침 — 전환기 드롭다운, 회복 표, 영수증 인장(`right:-18px`), 몽골어 긴 단어, 메신저 바 soon 문구 | 드롭다운은 `right:0` 고정에 `max-width:calc(100vw - 2rem)`. 인장 ≤520px은 B 76행 값. 칩·제목에 `overflow-wrap:anywhere`. A7에서 /mn 포함 3페이지 × 3폭을 측정 |
| R8 | 금지어 오탐 — "보장하지 않습니다"·"best"가 주석이나 변수명에 들어감 | 콘텐츠·주석에서 처음부터 피한다(§3.8). guards.test가 rg와 같은 패턴으로 먼저 실패시킨다 |
| R9 | 사전 전체를 클라이언트로 넘기면 RSC 페이로드가 비대해지고, live 문자열이 HTML에 섞인다 | 클라이언트에는 조각 props만 넘긴다. 띠·바·완료 문구는 서버에서 `launch.ts`로 골라 문자열만 전달 |
| R10 | proxy가 Vercel에서 `/`만 처리하지 않으면 정적 자산까지 리다이렉트 | `matcher: ['/']` 상수. A10 운영 스모크에서 `/` 307을 확인 |
| R11 | A2 브라우저 키보드 — 칩 input이 `opacity:0; pointer-events:none`(A 54)이라 포커스 표시가 안 보일 수 있다 | A 57행 `input:focus-visible+label` 규칙을 그대로 옮긴다. A7 포커스 스크린샷 |
| R12 | Lighthouse a11y — 회복 표 role 오류, `.none` 대비, 빈 rule-grid 셀 | §3.7(진짜 table, `--none`, sr-only cellNot)으로 시안 결함을 고친다 |
| R13 | Vercel↔GitHub git 연결 미확인(G1 이월) | G4 Releaser가 확인. 폴백 `vercel deploy --prod`(spec A10). 이 계획에서는 조치 없음 |

회귀 대상인 기존 동작은 없다(그린필드). `design/drafts/**`는 수정하지 않는다(A9 `git diff` 확인).

## 8. 비목표·후속

- Noto Sans JP/KR·키릴 웹폰트(next/font, `preload:false`, unicode-range 분할 로드) — R6에서 시각 일관성 요구가 생기면 후속으로 하고 Lighthouse를 재측정한다.
- 2단계 404를 proxy에서 직접 반환하는 방식은 R3 폴백이다. 기본안은 global-not-found다.
- zod 등 스키마 라이브러리, 컴포넌트 렌더 테스트(jsdom·Testing Library), Playwright E2E — 순수 함수 단위 + 브라우저 실기로 충분해 넣지 않는다.
- spec 비목표 그대로: CRM·메신저 API·리드 저장, CMS 실도입, 2단계 언어 콘텐츠, 실데이터, 진료 상세·병원 비교·포털·예약·결제·PDF 생성, 추적 태그, 커스텀 도메인, 원어민 검수, CI(`.github/**`).
- 시안 B의 Q&A·검증 후기·signals 띠, C의 공항 밴드는 spec 화면 목록 밖이라 넣지 않는다.

## 9. 자기점검

- [x] 변경 파일 전부 실제 열어봤다 — 신규 파일은 아직 존재하지 않는다(그린필드, `git ls-files` 확인). 근거가 되는 `README.md`, `design/drafts/{a-journey,b-proof,c-local,index}.html` 전문, 이미지 크기, 기획서 텍스트, spec·gates·G1 리뷰 2건, profile을 읽었다. Next 16 규약은 next@16.3.8 번들 문서·font-data·create-next-app 템플릿에서 확인했다(context7은 OAuth 필요로 사용 불가).
- [x] Acceptance 전 항목이 §6에 매핑됐다 — A1~A10 각각 단위 테스트 파일 또는 명령, 브라우저 레시피가 있다. A10은 Releaser 범위로 명시했다.
- [x] 브라우저 판정 항목마다 관측 레시피(계정·URL·뷰포트·테마·조작 순서·기대 화면 한 줄)가 있고, 상태 전이가 있으면 전이 표가 있다 — A2(플래너 전이 표), A3(전환기 전이 표 §3.5), A4, A5, A6(견적 Q1–Q12 §3.4), A7.
- [x] 마이그레이션/게이트 경로 판정을 했다 — 마이그레이션 없음. `.github/**`·`.claude/rules/**` 미접촉. `design/drafts/**`는 복사만 한다.
- [x] 새 CLI·스크립트나 정본 store 조회 없음 — 해당 registry·경계 파일 없음(그린필드).
- [x] Developer가 질문 없이 착수 가능하다 — 버전·스크립트·파일 경로·타입·순수 함수 시그니처·전이 표·번역 지침·추정 항목의 확인 방법(R5)과 폴백(R3)을 적었다.
STATUS: done
