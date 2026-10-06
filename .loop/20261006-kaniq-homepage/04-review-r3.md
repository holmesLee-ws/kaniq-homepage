# Review — 20261006-kaniq-homepage round 3 — PR 없음 (G2 설계 02-plan.md)

VERDICT: APPROVE

## 점수: 91/100
| 축 | 점수(/25) | 근거 한 줄 |
| spec 충족 | 23 | A1~A10이 §6에 있고 사전 공개 띠·hreflang·2단계 404·견적 422가 설계에 있다. 히어로 수수료 ₩0과 플래너→견적 interest 매핑만 얇다. |
| 구현 가능성/단순성 | 23 | 파일 목록·사전 타입·순수 함수·전이 표·버전 고정이 있어 착수할 수 있다. 스택 실측은 아래 재실행과 맞다. |
| 현지화·접근성 설계 | 22 | 사전 fixture, 폰트 분리, 회복 표·대비·포커스 수정이 있다. 모바일에서 헤더 nav를 숨기는 시안 CSS를 의도라고 적지 않았다. |
| 검증 계획 | 23 | 브라우저 항목마다 URL·뷰포트·조작·기대가 있고 단위 테스트가 A 항목에 묶인다. A7 포커스 레시피만 뷰포트가 없다. |

통과선은 85점 이상이고 Blocking·Major 0이다. 이번 판정은 91점, Blocking 0, Major 0.

## 재실행 결과
PR이 없다. 린트·tsc·vitest·build·브라우저·curl 실기·gh·Vercel·sips는 실행하지 않음. 계획의 외부 사실만 읽기 전용으로 표본 확인했다.

확인함 (2026-10-06):
- `npm view next version` = 16.3.8, engines `node >=20.9.0`, peer `react ^19`. `react` latest = 19.3.0. `typescript` latest = 7.0.2. `eslint` latest = 10.12.0. `vite` latest = 8.3.3. `vitest` latest = 5.0.3, peer에 `vite`(`^6.4 || ^7 || ^8`)와 `@types/node`(`^22 || >=24`), engines `node ^22.12 || ^24 || >=26`. 로컬 `node -v` = v22.23.1.
- `typescript-eslint@8.71.1` peer는 `typescript >=4.8.4 <6.1.0`. `eslint-plugin-import@2.32.0`과 `eslint-plugin-jsx-a11y@6.10.0`의 peer는 eslint `^9`까지다. `eslint-config-next@16.3.8` 자신의 peer는 `eslint >=9`라 상한이 없고, 상한은 그 두 플러그인에 있다. 계획 §3.0의 설명과 같다.
- `lighthouse@13.5.0`이 레지스트리에 있다.
- `next@16.3.8` tarball 문서: `proxy.md`는 `middleware`를 deprecated로 보고 `proxy.ts`를 `app`과 같은 단(`src/proxy.ts`)에 두며, `runtime` 설정은 에러, 기본 런타임은 Node. `not-found.md`는 `experimental.globalNotFound`와 동적 세그먼트 루트 레이아웃 사례를 적는다. `dynamicParams.md`는 `false`일 때 미생성 세그먼트 404, Cache Components에서는 사용 불가다. `page.md`는 `PageProps`가 dev/build/typegen 때 생긴다고 한다. `internationalization.md`는 `await params`다. `opengraph-image.md`는 jpg와 `opengraph-image.alt.txt`, 8MB 한도다.
- 같은 tarball `alternative-urls-types.d.ts`에 `type UnmatchedLang = 'x-default'`가 있어 `Languages` 키로 허용된다. `generate-metadata.md` 예시에는 `x-default`가 없다. 렌더된 HTML은 실행하지 않음.
- `font-data.json`: Schibsted Grotesk subsets는 `latin`, `latin-ext`뿐이고 가변 축 wght 400–900이다. Noto Sans JP/KR subsets는 `cyrillic`, `latin`, `latin-ext`, `vietnamese`다.
- `create-next-app@16.3.8`의 `dist/index.js`는 `typescript:"^5"`, `eslint:"^9"`, 스크립트 `lint:"eslint"`를 쓴다.
- 시안 대조: `c-local.html` en H1의 아포스트로피는 U+2019로 spec 표와 같다. `a-journey.html` `render()`의 일차 라벨은 `D1–2`·`D3–5`·`D6–8`(U+2013)이고 5/7/10일 골격은 §3.6과 같다. 가격 다섯 문자열은 §3.1과 같다. `li()`는 세 번째 값이 null이면 배지를 그리지 않는다.

확인하지 않음: 빌드된 HTML의 `hreflang="x-default"`, `global-not-found`가 `/hi` 본문을 실제로 그리는지, sips 크롭 원점, Lighthouse 점수, 시스템 폰트의 몽골어 키릴 글리프.

## Blocking
없음.

## Major
없음.

## Minor
- A7 포커스 레시피(§6.3)에 뷰포트가 없다. 시안 A 45행은 860px 이하에서 `.site-nav{display:none}`이고, 계획은 이 CSS를 그대로 옮긴다(§3.7). 390·768에서 Tab 순서에 nav가 없어 레시피가 거짓 FAIL할 수 있다. §6.3 포커스 줄에 1440×900을 고정하고, §3.7에 모바일 nav 숨김이 시안 그대로라고 한 줄을 넣으면 해소된다.
- §3.5의 `interest=TX→QuoteInterest`와 템플릿 `interest`에 대응표가 없다. `QuoteInterest`에는 `implants`·`lasik`가 없다. §3.5에 여섯 템플릿과 히어로 버튼의 대응(예: implants→dental, lasik→eye, screening→screening, women's wellness→womens-health, fertility→fertility, family screening→screening)을 적으면 해소된다.
- spec 결과 상자 36행과 `a-journey.html` 240행의 히어로 "Your fee to KANIQ ₩0"이 §3.5 JourneyPlanner와 §3.6 PlanView에 없다. `feeLabel`만 있다. §3.5 카드 푸터에 `feeLabel`과 상수 `₩0`을 넣으면 해소된다.
- §2가 푸터 마크업 327–341행을 가져오라고 하는데, 338행은 `Liability insurance ₩100M+`다. §3.5 푸터 구성에는 없고, 미등록 상태의 보험 주장이다. §2 제외 문장에 A 338을 B 312 옆에 넣으면 해소된다.
- §3.0은 `x-default`를 추정으로 적는다. `next@16.3.8`의 `Languages` 타입은 그 키를 허용한다. §3.0 구분 열을 타입 실측으로 바꾸고, A8 curl로 태그 렌더를 확인하는 문장은 두면 해소된다. §1의 "미들웨어 수동 404"는 §8의 proxy 폴백과 이름이 다르다. §1 그 구를 proxy로 고치면 해소된다.

## 후속
- Vercel↔GitHub git 연결은 이 계획 범위 밖이다. R13대로 G4 Releaser가 확인하고, 불가면 `vercel deploy --prod`다. 이번 라운드에서 Vercel API는 실행하지 않음.
- 원어민 검수·CI(`.github/**`)·브랜치 보호는 비목표 그대로다.
- Noto 웹폰트와 proxy 직접 404는 §8 후속이다. 기본안을 바꿀 이유는 확인하지 못했다.

## 잘된 점
- G1 증강 다섯 가지가 코드 자리까지 있다. `launchState`는 `site.ts` 한 곳과 `launch.ts` 순수 함수(띠·메신저 href·바 문구·견적 안내·완료 문구)다. `Dictionary`와 `tests/fixtures/localization.ts`가 A3 표를 고정한다. `buildPlan()`이 UI와 분리된다. CTA는 `MessengerCta`·`QuoteStartLink`와 `guards.test.ts`다. 웹폰트는 Schibsted latin 하나이고 ja/ko/mn은 시스템 스택이다.
- A1~A10이 §6.2–§6.3에 한 번씩 있고, A2·A3·A6은 전이 표가 있다. A10은 Releaser로 경계를 그었다.
- 시안 결함(회복 표 role, `.none` 대비, 24시간 문구, `href="#"`, 미등록 사실 주장)을 고친 이유가 파일:줄로 적혀 있다. null 슬롯에 Doctor OK 배지를 더하는 것은 시안 `li()`와 다르고, A2를 닫기 위한 선택으로 §3.1에 적혀 있다.
- `.github/**`를 만들지 않고, `design/drafts/**`는 읽기·복사만 하며, 기획서 수치를 리포에 넣지 않는다. Q&A·공항 밴드·zod·Playwright·2단계 본문은 §8에서 빠진다.
- Next 16에서 깨지기 쉬운 지점(proxy 이름, params Promise, 생성 타입 없이 tsc, `useSearchParams`의 Suspense, Cache Components와 `dynamicParams`)을 §3.0과 §7에 나눠 두었다.

STATUS: done [r3]
