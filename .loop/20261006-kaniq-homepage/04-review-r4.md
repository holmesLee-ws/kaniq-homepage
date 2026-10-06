# Review — 20261006-kaniq-homepage round 4 — PR #1

VERDICT: APPROVE

## 점수: 92/100
| 축 | 점수(/25) | 근거 한 줄 |
| 정확성(Acceptance 충족) | 23 | A1 헤더 9종·홈 5·404 6, A6 200/422, A8 hreflang·sitemap·robots, A4·A9 rg 0건을 재실행했다. A7 기하·Lighthouse는 실행하지 않음. |
| 계획 준수·코드 품질 | 22 | G2 Minor 5건이 코드에 있다. guards는 리터럴 `className`만 잡고 `className={"cta"}` 변이는 통과했다. |
| 회귀·보안 | 24 | 견적 본문은 응답·서버 로그에 없고 외부 fetch가 없다. drafts diff·`.github`·비밀 패턴 0. preview에서 메신저 `<a href>` 0. |
| 검증 재현성 | 23 | 스크래치에서 `npm ci`→lint→tsc(빌드 전)→test 73→build가 03-dev와 같다. 포트만 3456. `npm audit`·브라우저는 실행하지 않음. |

통과선은 85점 이상이고 Blocking·Major 0이다. 이번 판정은 92점, Blocking 0, Major 0.

HEAD `4be4286d59ea116bedaf1034284b0106871bd4f2`. 재실행 위치는 스크래치 `/private/tmp/leh-20261006-kaniq-homepage-review-verify`(슬롯 `review-verify`, 같은 SHA). 공유 워크트리의 포트 3000(PID 10175)은 그대로 뒀다. 메모리 압력은 내내 2라 lint·tsc·test·build를 한 번에 하나씩 돌렸다. heap은 lint·vitest 3072, tsc·build 6144. OOM 없음. profile 갱신 요청 없음.

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

| 명령 | 결과 | 03-dev |
|---|---|---|
| `npm ci` | rc 0. next 16.3.8, react 19.3.0, react-dom 19.3.0, typescript 5.9.3, eslint 9.39.5, eslint-config-next 16.3.8, vitest 5.0.3, vite 8.3.3. Node v22.23.1 | 설치 성공과 같음. 03-dev는 `npm install` |
| `NODE_OPTIONS=--max-old-space-size=3072 npm run lint` | rc 0, 출력은 eslint 배너뿐 | 오류·경고 0과 같음 |
| `NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit` (build 전, `.next` 없음) | rc 0, stdout 비음 | baseline 0과 같음. R2(생성 타입 없이 tsc)도 통과 |
| `NODE_OPTIONS=--max-old-space-size=3072 npm test` | 9 files / 73 tests PASS | 같음 |
| `NODE_OPTIONS=--max-old-space-size=6144 npm run build` | rc 0, Next.js 16.3.8, Compiled successfully in 3.0s | 같음 |
| A4·A9 `rg` (ripgrep 15.2.0) | 네 명령 모두 rc 1, stdout 비음 | 같음 |
| `git diff origin/main -- design/drafts` | rc 0, stdout 비음 | 같음 |
| `npm start -p 3456` 후 curl | 아래 A1·A6·A8. 서버 로그에 `t@example.com`·이름 `Test` 없음 | 03-dev는 :3000. 상태 코드·본문은 같음 |
| 브라우저, Lighthouse, `npm audit` | 실행하지 않음 | 03-dev 값을 재확인하지 않음 |

`npm ci`가 eslint@9.39.5 deprecation을 한 줄 경고했다. lint rc는 0이다.

## Accept-Language 셀 (proxy + negotiate)

`src/proxy.ts`는 `matcher: ["/"]`만 협상하고 307과 `Vary: Accept-Language`를 붙인다. 아래는 포트 3456 curl이며, 리다이렉트를 따라가지 않았다.

| 헤더 | 기대 | 실제 | 판정 |
|---|---|---|---|
| en / ja / id / mn / ko | 해당 언어 | 307 /en /ja /id /mn /ko | OK |
| ko-KR | /ko | 307 /ko | OK |
| ko;q=0.1, en;q=0.9 | /en | 307 /en | OK |
| fr | /en | 307 /en | OK |
| 헤더 없음 | /en | 307 /en | OK |
| 빈 Accept-Language | /en | 307 /en | OK |
| KO / ID | ko / id | 307 /ko, 307 /id | OK |
| Mn-mn / mn-MN / en-US | mn / mn / en | 307 /mn, /mn, /en | OK |
| ja;q=abc, id | /id | 307 /id | OK |
| ko;q=0, ja;q=0.1 | /ja | 307 /ja | OK |
| ja;q=0 | /en | 307 /en | OK |
| ko;q=2,id | /id (q>1 버림) | 307 /id | OK |
| zh-CN,ko;q=0.5 | /ko | 307 /ko | OK |
| fr;q=0.9, ko;q=0.4 | /ko | 307 /ko | OK |
| en;q=0.5, ja;q=0.5 | /en (동률은 앞) | 307 /en | OK |
| ja;q=0.5, en;q=0.5 | /ja | 307 /ja | OK |
| en;q=1, fr;q=0.5 | /en | 307 /en | OK |
| * | /en | 307 /en | OK |
| ko-KR, ko;q=0.9, en-US;q=0.8 | /ko | 307 /ko | OK |
| en; q=0.1, ja;q=0.9 | /ja | 307 /ja | OK |
| `ja ;q=0.9` (세미콜론 앞 공백) | /ja | 307 /en | DIFF. Minor |

원인: `src/lib/i18n/negotiate.ts` 6행이 세그먼트만 `trim`하고 태그 토큰은 다시 trim하지 않는다. `ja ;q=0.9`의 태그는 `"ja "`라 `isLang`에 실패하고 en으로 떨어진다. 쉼표 뒤 공백(`ko-KR, ko;q=0.9`)은 세그먼트 trim으로 통과한다. spec A1의 9종 헤더는 모두 OK.

홈 5종: 200과 `<html lang="en|ja|id|mn|ko">`. 2단계 `/hi /ru /vi /zh /es /th`: 404, 본문 `<h1>Page not found</h1>`. 그 6요청마다 서버 로그에 `Error: Internal: NoFallbackError`가 한 번씩 찍혔다. HTTP 404는 맞다. 03-dev의 알려진 한계와 같다.

## preview / live / 견적 / CTA

- `src/config/site.ts` `launchState`는 `"preview"`. 메신저 URL 네 개는 빈 문자열.
- `/en` HTML: 사전 공개 문장 있음. `cta--messenger`는 `<span>` 2개(로컬 블록·하단 바), `<a … cta--messenger` 0. `24 hours`·`24시간`·`24時間`·`24 jam`·`24 цаг` 0. `₩0` 8회. 견적 href interest는 dental, eye, fertility, screening, womens-health.
- `/en/quote` title `KANIQ · Start your quote`. 안내 문장 있음. 24시간 표현 0.
- live는 서버를 바꾸지 않고 단위로 확인했다. `tests/launch.test.ts`가 5언어에 대해 preview href null, live+URL이면 href, live+빈 URL이면 href null, `barNote`가 `replyPromise`로 바뀌는 것을 단언하고, 그 파일이 포함된 73 tests가 PASS다. 호출부는 `MessengerBar`·`LocalBlock`·`quote/page.tsx`·`PreviewBand`가 `site.launchState`를 `launch.ts`에 넘긴다.
- `POST /api/quote` 유효 본문 → `{"ok":true}` HTTP 200. `{"lang":"ja"}` → 422, `errors`에 interest·timing·contactMethod·name·contact·consent, `id` 키 없음. `src/app/api/quote/route.ts`는 `validateQuote` 후 `{ok:true}` 또는 422만 반환한다. console·fetch·저장 호출이 없다. 서버 stdout에 요청 본문 없음.
- CTA 변이(스크래치, 이후 `git checkout -- .`, porcelain 0):
  - `SiteFooter.tsx`에 `className="cta cta--rogue"` → guards FAIL (rc 1). 잡음.
  - `className={"cta"}` → guards PASS (rc 0). 못 잡음.
  - `href="#"` → FAIL. `"best clinic"`를 `src/content/en.ts`에 추가 → FAIL.
- 현재 소스의 `cta` 클래스는 `MessengerCta.tsx`·`QuoteStartLink.tsx`의 리터럴·템플릿뿐이라 지금 페이지에는 세 번째 CTA가 없다.
- G2 다섯 건: (a) `globals.css` 87–89행, 860px 이하 `.site-nav { display: none }` (b) `QUOTE_INTEREST` implants→dental, lasik→eye, screening, womens-health, fertility. 템플릿 interest는 견적 enum (c) `JourneyPlanner.tsx` 153행 `feeLabel` + `₩0` (d) `Liability`·`100M` rg 0 (e) `/ja`와 `/ja/quote`에 `hrefLang="x-default"` → `/en`, `/en/quote`. sitemap `<loc>` 10. robots에 sitemap URL. og:image를 localhost로 바꿔 요청하면 200 `image/jpeg`.
- 이미지 경로는 계획 §4의 `src/assets/img`가 아니라 `public/img`. `dispatch-developer-r1.md` 31행이 `public/` 복사·최적화를 허용한다.
- `.github/` 없음. 비밀 키 패턴(`sk_live`, `AKIA`, `ghp_`, Slack 토큰, PRIVATE KEY) 0.

## Blocking

없음.

## Major

없음.

## Minor

- `src/lib/i18n/negotiate.ts:6`. `ja ;q=0.9`처럼 언어 태그와 `;` 사이에 공백이 있으면 태그를 못 읽고 `/en`으로 보낸다. 재현: `curl -D - -H 'Accept-Language: ja ;q=0.9' http://127.0.0.1:3456/` → `307 /en`. spec 9종과 쉼표 뒤 공백은 통과하므로 Acceptance는 깨지지 않는다. 태그 토큰 trim이면 해소된다.
- `tests/guards.test.ts:15-17`. `\bcta\b`를 `className="…"`와 `className={\`…\`}`만 본다. `className={"cta"}`를 `SiteFooter.tsx`에 넣어도 테스트가 통과했다(rc 0). 리터럴 위반은 실패했다. 현재 소스에는 그 형태가 없다.

## 후속 (판정 제외)

- A2·A5·A7의 화면 기하, 키보드 포커스, Lighthouse는 실행하지 않음. `evidence/qa-*`는 판정에 쓰지 않았다. reduced-motion은 `globals.css` 1465–1472행에서 `animation`·`transition`·`scroll-behavior`를 끈다. 렌더 결과는 추정.
- A10 머지·production SHA는 실행하지 않음. Releaser 범위.
- `/hi` 등 6경로의 `NoFallbackError` 스택은 03-dev와 같다. 응답은 404와 global-not-found 본문이다.
- `npm audit`은 실행하지 않음. 03-dev의 production 0건·dev high 5건을 재확인하지 않았다.
- ESLint 9 유지(플러그인 peer) 때문에 npm이 9.39.5 deprecation을 경고한다. 이번 범위에서 10으로 올리지 않는다.
- 세미콜론 앞 공백과 guards 표현식 형태는 위 Minor. 고치지 않아도 이번 게이트의 Acceptance 재실행은 통과했다.

## 잘된 점

- 새 클론과 같은 스크래치에서 `tsc --noEmit`이 `next build`보다 먼저 통과했다. 버전은 계획 §3.0과 같다.
- 견적 검증은 서버 `validateQuote`가 하고, 응답은 `{ok:true}`뿐이다. preview 문구·메신저 비링크·24시간 부재가 HTML에서 확인된다.
- `design/drafts` diff가 비고, 금지어·내부 수치 rg가 0이며, `.github/**`를 만들지 않았다.

STATUS: done [r4]
