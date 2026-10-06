# Plan — 20261006-kaniq-immersive (G2 모션 설계)

> 공개 리포다. 이 문서에는 기획서 비공개 수치를 적지 않는다. 아래 숫자는 전부 ms·px·비율 같은 UI 수치이거나, 리포에 이미 있는 값이다.

## 1. 목표

같은 홈(5개 언어)이 스크롤과 조작에 반응하는 몰입형 페이지가 된다. 모든 모션은 상태·진행·관계 중 하나를 전달한다. 섹션마다 동사가 다르다.

| 섹션 | 동사 | 전달하는 것 |
|---|---|---|
| 히어로 | **세우기 → 그리기** | 여정의 순서 |
| 플래너 | **바꿔 끼우기** | 바뀐 항목만 나가고 들어온다 |
| 진료찾기 | **시차·꽂기** | 사진은 깊이, 칩은 우선순위 순서 |
| Doctor OK | **켜기** | 회복 일차에 따라 할 수 있는 것 |
| 영수증 | **인쇄 → 확정 → 날인** | 비용 확정 과정 |
| 기록 카드 | **뒤집기** | 같은 병원의 다른 면(등록 정보) |
| 문제 4단계 | **잇기** | 읽은 만큼 단계가 이어진다 |
| 템플릿 | **펼치기** | 여정 요약 |
| 앰버서더 | **전환·채우기** | 고른 환원처와 진행 단계 |
| 견적 | **넘기기·채우기·날인** | 폼 진행과 완료 |
| 전역 | **줄이기·진행** | 스크롤 위치 |

**권고안: CSS(transition·keyframes) + 런타임 컴포넌트 1개(`MotionRuntime`, IntersectionObserver와 rAF 스크롤 → CSS 변수·data 속성) + 작은 순수 함수.** 모션 라이브러리는 쓰지 않는다. `animation-timeline`(scroll-driven)도 쓰지 않는다. 이유는 §3.1 표에 있다.

`#care` 버그는 원인 두 가지를 고친다. 전역 `img`에 `height:auto`를 더하고, `#care`만 위 정렬 + 사진 폭 상한으로 바꾼다. 사진은 srcset 없는 단일 1280w 후보로 내보낸다. 이유는 §3.3에 있다. G1 실측 natural 744×929는 밀도 보정값이었다.

## 2. 현재 구조 (직접 읽은 것만, 기준 `7379aa5`)

**레이아웃·전역**
- `src/app/[lang]/layout.tsx:32–42` — `<html lang>` → `<body>` → `PreviewBand` · `SiteHeader` · children · `SiteFooter` · `MessengerBar`. 클라이언트 런타임은 없다.
- `src/components/layout/SiteHeader.tsx:10` — `<header className="site-head wrap">`. 헤더 자신이 `.wrap`라서 전폭 배경을 깔 수 없다. nav 4개(`care`·`plan`·`refer→ambassador`·`trust`)가 `/${lang}#…` 링크다(16–23).
- `src/styles/globals.css:6–8` — `html { scroll-behavior: smooth }`. `:17–20` — `img { display:block; max-width:100% }`, **`height:auto`가 없다**. `:42–47` — `.site-head`는 flex에 padding-block 1.25rem이고 sticky가 아니다. `:87–94`·`:1457–1459`에 `.site-head` 반응형 규칙이 있다.
- `globals.css:698–703`과 `:1465–1473` — reduce에서 `*, *::before, *::after { animation:none!important; transition:none!important; scroll-behavior:auto!important }`. 두 블록이 중복이다. 이 kill-switch는 scroll-driven animation도 끈다.
- `globals.css:651–660` — `.msgbar`는 fixed bottom, z 20. `:783–787` `.lang`은 z 30. `:772–782` `.skip`은 z 50.

**히어로·플래너**
- `src/components/home/Hero.tsx:5–22` — `section#plan.hero.wrap` 안에 `JourneyPlanner`(children = eyebrow·h1 span 줄·lede).
- `src/components/home/JourneyPlanner.tsx:24–29` — `useState<PlanInput>`의 기본값은 `{tx:"implants", days:7, pax:2}`이다. `:100` `article.plan.updating#plan-card`. **`:113` `<ol className="days" key={tx-days-pax}>`** — 입력이 바뀔 때마다 목록 전체가 다시 마운트된다. 그래서 지금은 "나가는 노드"가 없다. `:115–118` day `key={day.label}`, `:126` item `key={i}`(인덱스). `:149` `<strong id="price">`.
- `globals.css:243–257` — `.days::before`(left 46px, top 8px, bottom 8px, 2px, `--mist`). `:349–361` — `.plan.updating .days { animation: swap .35s }`. 마운트할 때만 재생된다. `:371–377` — 520px 이하에서는 `.days::before`가 `display:none`이다.
- `src/lib/planner/build-plan.ts:9–24` — `PlanView.days[] = {label,title,treat,items[]}`. `:72–113` — 행 순서는 D-1(arrive) · D0(treatment) · D1–2(early) · D3/D3–5(culture) · [D6–8(free), 10일만] · D4/D6/D9(home). 가격은 `rules.price`(`:117`)이고 진료에만 의존한다. 가격 문자열 예는 `planner-data.ts:24` `"₩2.4M–3.2M"`.
- `tests/planner.test.ts` — A2 단언(진료=제목·활동·가격 5종, 일수=라벨 배열·가격 동일, 인원=부제·`days[0].items[1]`만 변경, `days.slice(1)` deep-equal).

**진료찾기 `#care`**
- `src/components/home/LocalBlock.tsx:9–34` — `section#care.section.wrap.split` > `.local-panel`(h2·h3·`ul.care-chips`·h3·p·`MessengerCta`) + `figure > Image(c-family-palace, sizes="(max-width:860px) 100vw, 40vw") + figcaption`.
- `globals.css:505–517` — `.split`는 grid 6fr/5fr, **`align-items:center`**(509). `.split img`는 radius 28, `aspect-ratio:4/5`, `object-fit:cover`, `width:100%`. `:547–554` — 860 이하에서는 1열이고 img 4/3. `:876–894` — `.local-panel`, `.care-chips`.
- `public/img/c-family-palace.jpg`는 1280×1600, 453,594 B(`sips`, `ls` 실측). `b-consult.jpg`는 1600×1066, `a-samgyetang.jpg`는 1600×1600.
- `.split`는 `RecordCards.tsx:11`의 `div.split.registry`도 쓴다. `globals.css:1108–1110` `.registry img { aspect-ratio:4/5 }`.
- 칩 개수는 ko 3, en 4, ja 3, id 3, mn 3이다(`content/*.ts` `priorityCare`).

**Doctor OK·회복 주간**
- `src/components/home/DoctorOkRules.tsx:11–47` — `table.rule-grid`, 열 D0..D6(17–21), 행 `c.rows`(5행), `td.y/n`의 판정은 `i >= r.okFromDay`(31–39). 서버 컴포넌트다.
- `src/components/home/RecoveryWeek.tsx:7–31` — `table.matrix`, 4행, `th.stage > small{note}`. 서버 컴포넌트다.
- `src/content/ko.ts:149–186` — 규칙 5행의 okFromDay는 3,1,3,2,4이다. `:188–231` — 회복 4행의 note는 「진료 당일」·「회복 초기」·「회복과 문화」·「의료진 경과 확인 후」.
- `src/content/types.ts:65–95` — `doctorOk`·`recovery` 타입. `rows: T4<…>`.
- 둘 다 `src/app/[lang]/page.tsx:28–29`에서 따로 렌더된다.

**신뢰**
- `src/components/home/TrustReceipt.tsx:8–71` — `.receipt-wrap` > `svg.rosette` + `article.receipt`(h2·`.r-sub`·`ul.rows` 4행·`.total > strong ₩0`) + `svg.seal`. `globals.css:1017–1026` — **`.seal { animation: stamp .5s ease .5s both }`**. 로드할 때 화면 밖에서 재생되고 끝난다. `:1036–1045` — stamp는 `rotate(-14deg) scale(1.15)/opacity 0` → `rotate(-14deg)/opacity .88`. 기본 스타일에는 회전이 없어서 reduce에서는 회전하지 않은 불투명 인장이 보인다.
- `src/components/home/RecordCards.tsx:21–55` — `article.record` × 2. 내용은 header(h3·sample)·p(kind)·dl(4 labels)·`.doctor`.
- `src/components/home/ProblemSteps.tsx:8–20` — `section#trust-steps > ol.steps > li × 4`. `globals.css:1111–1130` — `.steps`는 4열 grid이고 `border-top 2px ink`. 860 이하는 2열(`:1391–1393`), 640 이하는 1열(`:1434–1436`).

**템플릿·앰버서더·견적**
- `src/components/home/TemplateList.tsx:8–21` — `ul.tpl > li × 6`(`.t-name`·`.t-len`·`.t-hi`·`QuoteStartLink variant=text`). 미니 일정 데이터는 없다. 템플릿 길이는 5개 언어 모두 순서대로 7·5·5·7·10·7일이고 interest는 dental·eye·screening·womens-health·fertility·screening이다(사전 grep 실측).
- `src/components/home/Ambassador.tsx` — 서버 컴포넌트다. 라디오는 `defaultChecked`(18)이고, 미리보기(30–71)는 선택과 무관한 정적 표다. `.dot.done/.now`(`globals.css:1209–1223`).
- `src/components/quote/QuoteForm.tsx:38` — `step` 1|2|3. `:76–81` `go(n)`는 setStep + 헤딩 포커스. `:119` 422 응답이면 `setStep(target)`. `:128–138` 완료 화면 `section.quote-card[data-done]`. `:142–148` `ol.stepper`. `:153–281` 단계별 조건부 렌더, 단계마다 필드가 겹치지 않는다(`STEP_FIELDS`).
- 사전 타입은 `src/content/types.ts`. `tests/dictionary.test.ts`가 5개 언어의 shape 동일과 빈 문자열 0을 검사한다. 새 키를 넣으면 5개 언어에 모두 있어야 한다.
- `tests/guards.test.ts:11–27` — `src/**/*.{ts,tsx,css}`에서 `/cta/` 폴더 밖 `className`에 `cta` 단어를 쓸 수 없고, `href="#"`도 쓸 수 없다. `src/content/**`에는 `%` 문자를 쓸 수 없다. 금지어(best·guarantee·최고·보장 등)는 모든 src 파일에 적용된다(CSS 주석 포함).

**기타**
- `package.json` — 의존성은 next 16.3.8, react 19.3.0뿐이다. 테스트는 vitest(node 환경, `tests/**/*.test.ts`). Playwright는 리포에 없다. 직전 run QA는 `/tmp/leh-qa-tools`(playwright@1.63.0)와 시스템 Chrome headless를 썼다(`05-qa-r4.md:70`).
- `.gitignore:9` `.lessons/`. `.lessons/`에는 3건과 `_index.md`가 있다.
- 호스트 배포 파일이 아니다. Vercel 빌드 산출물이므로 호스트본 해시 대조는 해당 없음.

## 3. 변경 설계

### 3.0 원칙(모든 항목 공통)

1. **점진적 향상.** 서버 HTML의 기본 스타일은 항상 최종 상태(보임)다. 숨김 초기 상태는 아래 두 경로에만 둔다.
   - (A) **로드 키프레임**(히어로만): `@media (prefers-reduced-motion: no-preference)` 안에서 `animation-fill-mode: both`의 `from` 프레임. JS가 없어도 1.2초 안에 끝나고, 애니메이션을 지원하지 않으면 `from`이 적용되지 않아 그대로 보인다.
   - (B) **진입 1회 공개**(칩·영수증·앰버서더 점): `@media (prefers-reduced-motion: no-preference) { html[data-enhanced] [data-reveal]:not([data-inview]) … }`. `data-enhanced`는 `MotionRuntime`가 IntersectionObserver가 있을 때만 하이드레이션 뒤에 붙인다. JS가 없거나 실패하거나 IO가 없으면 숨기지 않는다. 지시문의 「`.js` 클래스」 대신 이 속성을 쓴다. 인라인 스크립트가 없으니 `<html>` 하이드레이션 불일치도 없다.
2. **reduce는 정적 최종 상태.** 기존 kill-switch(`globals.css:1465–1473`)를 유지한다. 중복 블록 `:698–703`은 지운다. 모든 키프레임·트랜지션 규칙은 `@media (prefers-reduced-motion: no-preference)` 안에 쓴다(이중 안전). JS의 출입 노드 보존(§3.4)은 `matchMedia('(prefers-reduced-motion: reduce)')`가 참이면 하지 않는다.
3. **스크롤 연동 값은 애니메이션이 아니라 상태다.** rAF 스크롤 → CSS 변수(`--p`, `--doc-p`)와 `data-*`. 이 속성들에는 `transition`을 걸지 않는다. 그래서 `getAnimations()`에 잡히지 않고, reduce에서도 같은 값을 정적으로 보여 준다(B7 진행선 PASS 조건).
4. **transform·opacity·clip-path만 애니메이션한다.** 레이아웃 속성 애니메이션은 쓰지 않는다. 헤더 축소만 예외다(§3.10, 흐름 높이를 보존한다).
5. **공통 이징 토큰**(새 색·서체 아님). `tokens.css` 끝에 추가한다.
   ```css
   :root{
     --ease-out: cubic-bezier(.2,.7,.2,1);    /* 들어옴·세우기 */
     --ease-in: cubic-bezier(.4,0,1,1);       /* 나감 */
     --ease-io: cubic-bezier(.65,0,.35,1);    /* 그리기·뒤집기 */
     --ease-stamp: cubic-bezier(.3,1.4,.5,1); /* 날인(오버슈트) */
     --head-h: 88px;                          /* scroll-margin-top */
   }
   ```

### 3.1 모션 기술 선택 표

| 선택지 | 쓰는 곳 | 판단 | 근거 |
|---|---|---|---|
| CSS transition | 헤더 축소, 칩 선택, 카드 뒤집기, 템플릿 펼침, 그리드 열 강조, 견적 진행 막대 | **채택** | JS 0B. reduce kill-switch가 바로 적용된다 |
| CSS keyframes + `animation-delay: calc(var(--i)*Nms)` | 히어로 시퀀스, 칩 꽂기, 영수증 인쇄, 출입 노드, 가격 롤, 점 채우기, 견적 날인 | **채택** | 순서·지연을 인라인 `--i` 하나로 표현한다. QA가 `getAnimations()`·`animation-delay`로 잴 수 있다 |
| `MotionRuntime`(클라이언트 1개): IO(진입 1회) + passive scroll·rAF(진행값) | `data-reveal`→`data-inview`, `#care` 시차 `--p`, 4단계 진행 `--p`, 문서 진행 `--doc-p`, 헤더 `data-compact` | **채택** | 서버 컴포넌트는 `data-*` 속성만 단다. 클라이언트 전환을 줄여 번들을 줄인다. 예상 gzip은 1.5KB 안팎이다(추정, §6 B8에서 실측) |
| `animation-timeline: view()/scroll()` + `@supports` | — | **불채택** | (1) reduce kill-switch가 scroll-driven animation도 `none`으로 만든다. 진행선이 0%로 비면 B7 FAIL이라 JS 변수 경로가 어차피 필요하다. 경로가 둘이면 검증도 둘이다. (2) Firefox는 기본 비활성이고 Safari는 버전에 따라 다르다. 폴백(JS → CSS 변수)이 주 경로가 된다. (3) 같은 값을 한 경로로 만들면 Playwright Chromium 측정이 모든 브라우저를 대표한다 |
| View Transitions API | — | **불채택** | 의사 요소 애니메이션은 B3 (a)의 「서로 다른 요소」 판정과 맞지 않는다(target이 `documentElement::view-transition-*`). same-document 지원은 브라우저마다 다르다. React 상태 갱신과 `flushSync`를 묶어야 한다 |
| FLIP(남는 항목 이동 보간) | — | **불채택(§8)** | B3은 출입 노드와 가격만 요구한다. 남는 노드는 제자리다. 인원 변경은 「같은 일차 노드의 갱신」으로 PASS다(§3.4) |
| 모션 라이브러리 `motion` | — | **불채택** | `npm view motion@latest` → version 14.0.0, unpackedSize 750,887 B(2026-10-06 실측). 번들 기여는 측정하지 않음. 필요한 기능(출입 노드 보존·순차 지연·진입 감지)은 위 CSS + 60줄 안팎 훅으로 충분하다. B8 예산(+40KB gzip)을 쓸 이유가 없다 |

### 3.2 섹션별 모션 명세 표

시간은 ms. 「끝」은 지연 + 지속. 이징은 §3.0-5 토큰. reduce 열은 kill-switch가 적용된 정적 최종 상태다.

| # | 섹션·요소 | 트리거 | 동사 | 지속 | 이징 | 순서·지연 | 끝 | reduce 최종 상태 | B |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 히어로 eyebrow | 로드 | 페이드 | 300 | out | 0 | 300 | 보임 | B2 |
| 2 | h1 줄(span) | 로드 | 세우기(translateY .5em→0, opacity 0→1) | 420 | out | `--i`×70 (0,70,140) | ≤560 | 보임 | B2 |
| 3 | lede·플래너 폼·견적 버튼 | 로드 | 세우기(12px) | 360 | out | 200 | 560 | 보임 | B2 |
| 4 | `article.plan` 카드 | 로드 | 띄우기(translateY 18px→0, opacity) | 420 | out | 240 | 660 | 보임 | B2 |
| 5 | `.days::before` 일정선 | 로드 | 그리기(scaleY 0→1, origin top) | 600 | io | 480 | 1080 | 완료 길이 | B2 |
| 6 | `.day` 행 | 로드 | 꽂기(translateX -10px→0, opacity) | 300 | out | 480 + `--i`×80 (7일 5행: 마지막 800) | 1100 (10일 6행이면 1180) | 보임 | B2 |
| 7 | `.plan-foot` | 로드 | 페이드 | 300 | out | 600 | 900 | 보임 | B2 |
| 8 | 플래너 나가는 항목·라벨·행 | 조작(라디오) | 빠지기(opacity→0, translateX -12px) | 180 | in | 0 | 180, 노드 제거 200 | 즉시 교체 | B3 |
| 9 | 플래너 들어오는 항목·라벨·행 | 조작 | 끼우기(translateX 12px→0, opacity) | 260 | out | 60 | 320 | 즉시 교체 | B3 |
| 10 | `#price > span` | 진료 조작(문자열 변경 시만) | 굴리기(translateY .6em→0, opacity) | 280 | out | 0 | 280 | 즉시 교체 | B3 |
| 11 | `#care` 사진 | 스크롤 진행 | 시차(translateY (0.5−p)×8%, scale 1.1 고정) | 스크롤 연동 | — | — | — | transform 없음 | B1(d) |
| 12 | `.care-chips li` | 진입 1회 | 꽂기(scale .9→1, translateY 6px→0, opacity) | 320 | stamp | `--i`×90 (0,90,180,270) | ≤590 | 보임 | B1(d) |
| 13 | 스크러버 열·행 강조 | 조작(range) | 켜기(box-shadow) | 180 | out | 0 | 180 | 즉시 | B4 |
| 14 | 「오늘 가능한 것」 새 항목 | 조작 | 꽂기(scale .96→1, opacity) | 200 | out | `--i`×30 | ≤320 | 즉시 | B4 |
| 15 | 회복 표 활성 행 | 조작 | 켜기(background) | 200 | out | 0 | 200 | 즉시 | B4 |
| 16 | 영수증 `.rows li` | 진입 1회 | 인쇄(clip-path inset(0 0 100% 0)→0, translateY -6px→0) | 220 | io | `--i`×140 (0..420) | 640 | 보임 | B5(a) |
| 17 | `.total::before` 선 | 진입 1회 | 긋기(scaleX 0→1) | 240 | io | 800 | 1040 | 보임 | B5(a) |
| 18 | `.total strong` ₩0 | 진입 1회 | 확정(scale 1.25→1, opacity) | 220 | stamp | 880 | 1100 | 보임 | B5(a) |
| 19 | `.seal` | 진입 1회 | 날인(기존 `stamp`) | 450 | stamp | 1300 | 1750 | 회전 −14°, opacity .88 | B5(a) |
| 20 | 기록 카드 면 | 조작(버튼) | 뒤집기(rotateY 0↔180) | 420 | io | 0 | 420 | 즉시 면 교체 | B5(b) |
| 21 | 4단계 진행선 | 스크롤 진행 | 잇기(scaleX p) | 스크롤 연동 | — | — | — | 같은 p 정적 | B5(c) |
| 22 | 4단계 번호 | 스크롤 진행 | 켜기(color text-3→pine, 도달 번호만 pine. 현재 기본 pine 유지, `#trust-steps[data-reached]`) | 200 | out | — | — | 같은 상태 | B5(c) |
| 23 | 템플릿 미니 일정 | hover·focus-within | 펼치기(clip-path inset(0 0 100% 0)→inset(0)) / 접기 | 240 / 160 | out / in | 자식 `--i`×30 | ≤350 | 즉시 보임/숨김 | B5(d) |
| 24 | 앰버서더 환원처 줄 | 조작(라디오) | 전환(key 교체, translateY 8px→0, opacity) | 240 | out | 0 | 240 | 즉시 | B5(e) |
| 25 | 앰버서더 점 | 진입 1회 + 조작마다 | 채우기(scale .4→1, opacity) | 220 | stamp | (열−1)×90 + (행−1)×40 (3행×4열: 최대 270+80=350) | ≤570 | 채워진 상태 | B5(e) |
| 26 | 견적 나가는 단계 | 조작(다음·이전·422 이동) | 넘기기(translateX 0→∓24px, opacity→0) | 200 | in | 0 | 200, 노드 제거 220 | 즉시 교체 | B6 |
| 27 | 견적 들어오는 단계 | 조작 | 넘기기(translateX ±24px→0, opacity) | 280 | out | 40 | 320 | 즉시 교체 | B6 |
| 28 | 견적 진행 막대 | 조작 | 채우기(scaleX step/3, transition) | 320 | out | 0 | 320 | 즉시 | B6 |
| 29 | 견적 완료 인장 | 완료 화면 마운트 | 그리기(stroke-dashoffset) → 날인 | 560 + 300 | io / stamp | 0 / 560 | 860 | 완성 인장 | B6 |
| 30 | 헤더 | 스크롤(`scrollY` ≥ 80 켜기, < 40 끄기) | 줄이기(padding·로고 scale) | 200 | out | 0 | 200 | 즉시 | B11(b) |
| 31 | 문서 진행 막대 | 스크롤 | 진행(scaleX `--doc-p`) | 스크롤 연동 | — | — | — | 같은 값 정적 | B11(a) |

spec 수치 대조: B2 전체 ≤ 1180 < 1200. B3 시작은 커밋 프레임(< 100)이고 끝은 ≤ 320 < 450. 노드 제거는 200(타이머)이다. B1 칩 ≤ 590 < 1200. B6 시작 < 100, 날인 860 < 1000, 막대 ±5%는 transition 320 뒤에 정확한 값이다.

**B2 히어로 로드 타임라인**(no-preference, 기본 입력 7일 = 5행)

```
ms     0    100   200   300   400   500   600   700   800   900  1000  1100  1200
eyebrow ███████████████
h1 L1   █████████████████████
h1 L2       █████████████████████
h1 L3           ███████████████████████   (줄이 3개인 언어만)
lede/폼           ██████████████████
plan 카드            ████████████████████
일정선 ::before                     ▁▁▂▂▃▃▄▄▅▅▆▆▇▇██████   (480→1080, scaleY 0→1)
D-1                                 ███████████████
D0                                      ███████████████
D1–2                                        ███████████████
D3–5                                            ███████████████
D6                                                  ███████████████  (끝 1100)
plan-foot                                 ███████████████
                                                                   ↑ 1200 판정 시점: 전부 끝
```

**intro 소유 요소 — `article.plan#plan-card` 하나**(r2 M1). 근거: `Hero.tsx:5`의 `section.hero`는 서버 컴포넌트이고, `JourneyPlanner.tsx:31`은 fragment(`<div>{children}<form/>…</div>` + `:100` `article.plan`)를 반환한다. JourneyPlanner가 렌더하고 지울 수 있는 요소 중 출입 게이트(§3.4)와 같은 요소는 `article.plan`뿐이다. `section.hero`에는 `data-intro`를 달지 않는다(`Hero.tsx`는 클라이언트로 올리지 않는다).
- 렌더: `<article className="plan" id="plan-card" data-intro={touched ? undefined : ""}>`. `touched`는 `useState(false)`이고 라디오 `onChange`(진료·일수·인원 세 축 공통 setter)에서 `true`가 된다. 서버 렌더와 첫 클라이언트 렌더가 둘 다 `touched=false`라 하이드레이션 불일치가 없다. **서버 HTML에 `data-intro=""`가 있으므로 JS 없이도 시퀀스가 돈다.**
- 키프레임 선택자: 히어로 전체(표 #1~#7)를 `.hero:has(> .plan[data-intro])` 하위로 쓴다. 카드 안 요소(#4~#7)는 같은 뜻의 `.plan[data-intro]`로 써도 된다. 예:
  ```css
  @media (prefers-reduced-motion:no-preference){
    .hero:has(> .plan[data-intro]) .eyebrow{ animation:fade 300ms var(--ease-out) both }
    .hero:has(> .plan[data-intro]) h1 > span{ animation:rise 420ms var(--ease-out) calc(var(--i)*70ms) both }
    .hero:has(> .plan[data-intro]) :is(.lede,#planner,#planner ~ a){ animation:rise-sm 360ms var(--ease-out) 200ms both }
    .plan[data-intro]{ animation:lift 420ms var(--ease-out) 240ms both }
    .plan[data-intro] .days::before{ animation:line-draw 600ms var(--ease-io) 480ms both }
    .plan[data-intro] .day{ animation:slot-in 300ms var(--ease-out) calc(480ms + var(--i)*80ms) both }
    .plan[data-intro] .plan-foot{ animation:fade 300ms var(--ease-out) 600ms both }
  }
  ```
  (`.hero > .plan`: `section.hero`의 직계 자식은 fragment가 펼친 `div`와 `article.plan`이다. `:has`가 없는 브라우저는 #1~#3을 건너뛰고 바로 보인다 — 점진적 향상 원칙과 같다.)
- 지우기: 첫 조작 렌더에서 **같은 요소** `article.plan`의 `data-intro`가 사라진다. 그 순간 (1) 위 키프레임 규칙이 모두 해제되어 새 노드에 로드 지연(일차 480ms~)이 붙지 않고, (2) §3.4 출입 게이트 `.plan:not([data-intro])`가 열린다. 두 효과가 같은 커밋 프레임에서 일어나므로 B3 100ms·450ms 판정이 intro와 섞이지 않는다.
- 첫 조작 전에 로드 시퀀스가 아직 진행 중이면(1.2초 안 조작) 키프레임이 끊기고 최종 상태로 바로 간다. `animation-fill-mode: both`의 최종값이 기본 스타일과 같아서 튀지 않는다.

### 3.3 B1 진료찾기 레이아웃 수정

**원인별 처방**

| 원인(spec 8행·G1 r1) | 처방 |
|---|---|
| `img`에 `height:auto`가 없어 HTML `height="1600"`이 이긴다(`globals.css:17–20`) | 전역 `img { display:block; max-width:100%; height:auto }`. 높이를 명시한 클래스(`.plan-photo` 120px, `globals.css:235–242`)는 특이도가 높아 그대로다 |
| `align-items:center` + 사진 1600px 때문에 섹션 1855px, 패널 top 704(`:509`) | `#care`는 `.split`를 떼고 새 클래스 `care-split`(`align-items:start`)를 쓴다. `.split`는 `.registry`가 계속 쓰므로 그대로 둔다 |
| `sizes=40vw` + `w=750` 후보가 세로 1.72배 확대되어 흐림 | 사진 폭 상한 512px. **srcset 없이 단일 후보 `w=1920` URL**(최적화기가 원본 1280×1600을 넘겨 키우지 않는다)을 쓴다. 아래 「natural 판정」 참조 |

**natural 판정 — 설계가 srcset을 버리는 이유**
`HTMLImageElement.naturalWidth/Height`는 srcset을 쓰면 **밀도 보정값**(비트맵 ÷ (descriptor ÷ sizes 폭))이다. G1 실측 744×929가 그 증거다. `w=750` 비트맵은 750×938이고, sizes 40vw = 744px이므로 밀도는 1.008이다. 750 ÷ 1.008 = 744. 따라서 srcset을 쓰면 naturalWidth가 대략 sizes 폭과 같아진다. 이렇게 되면 dpr 2의 「`naturalWidth ≥ 렌더 폭 × 2`」를 원리적으로 만족할 수 없다. srcset 없이 `src` 하나(밀도 1)를 주면 natural은 비트맵(1280×1600)이다.

구현(`LocalBlock.tsx`):
```tsx
import { getImageProps } from "next/image";
const { props } = getImageProps({ src: photo, alt: d.local.photoAlt, width: 640, height: 800, quality: 75 });
// props.srcSet = "…w=640 1x, …w=1920 2x", props.src = …w=1920 (2x 후보)
const { srcSet: _drop, ...img } = props;
// eslint-disable-next-line @next/next/no-img-element -- 단일 밀도 src: B1 natural 판정(§3.3)
<img {...img} width={1280} height={1600} loading="lazy" decoding="async" />
```
Developer 확인 의무: dev에서 `currentSrc`에 `w=1920`이 있고 `naturalWidth === 1280 && naturalHeight === 1600`인지 본다. 다르면(예: 최적화기가 키움) `width:1280` 직접 지정이나 `unoptimized`(원본 JPEG 453KB) 순으로 바꾸고 03-dev.md에 적는다. 렌더 상한(아래)은 그대로다.

**배치**(sticky 대신 위 정렬 + 폭 상한. 패널이 한 화면 안에 들어오므로 sticky가 필요 없다)
```css
.care-split{
  display:grid; grid-template-columns:minmax(0,6fr) minmax(0,5fr);
  gap:clamp(2rem,5vw,5rem); align-items:start;
  padding-block:clamp(2rem,4vw,3rem);          /* .section 7rem → 3rem */
}
.care-split figure{ width:100%; max-width:512px; justify-self:end; }
.care-photo{ overflow:clip; border-radius:28px; aspect-ratio:4/5; background:var(--mist); }
.care-photo img{ width:100%; height:100%; object-fit:cover; }
@media (max-width:860px){
  .care-split{ grid-template-columns:1fr; }
  .care-split figure{ justify-self:start; }
  .care-photo{ aspect-ratio:4/3; }
}
@media (prefers-reduced-motion:no-preference){
  .care-photo img{ transform:translateY(calc((0.5 - var(--p,0.5)) * 8%)) scale(1.1); will-change:transform; }
}
```
마크업: `section#care.section.wrap.care-split` > `div.local-panel[data-reveal]`(칩 `li style={{"--i": i}}`) + `figure > div.care-photo[data-scroll="view"] > img` + `figcaption`. 패널이 DOM에서 먼저이므로 390·768에서 패널이 사진 위에 온다.

**수치 예측**(QA는 `getBoundingClientRect()`를 쓴다. scale 1.1이 rect에 포함되므로 그 값으로 계산했다)

| 폭×높이 | 사진 layout | rect(×1.1) | 2× rect ≤ 1280×1600? | 높이/폭 | 섹션 높이 예측 / 상한(×1.4) | 패널 |
|---|---|---|---|---|---|---|
| 1860×920 | 512×640 | 563×704 | 1126×1408 ✓ | 1.25 ✓ | 48+640+48 = 736 / 1288 ✓ | top ≈ 88+48 = 136, bottom ≈ 136+~500 = 636 ≤ 920 ✓ |
| 1440×900 | 512×640 | 563×704 | ✓ | 1.25 ✓ | 736 / 1260 ✓ | bottom ≈ 636 ≤ 900 ✓ |
| 768×1024 | 512×384 | 563×422 | 1126×845 ✓ | 0.75 ✓ | 61+~430+38+384+~30 ≈ 945 / 1433 ✓ | h2·칩 top ≥ 88 ✓ |
| 390×844 | 350×262 | 385×289 | 770×577 ✓ | 0.75 ✓ | 64+~620+32+262+~40 ≈ 1020 / 1181 ✓ | h2·칩 ✓ |

reduce에서는 transform이 없어 layout = rect이고 모두 ✓다. 패널 높이(~500 desktop, ~620 390 en)는 추정이다. 390에서 섹션이 1181을 넘으면 Developer는 520 이하에서 `.care-photo{aspect-ratio:16/10}`을 쓰고 기록한다(그래도 렌더 높이 ≤ 폭×1.3).

**시차 수치**: `--p = clamp((vh − rect.top) / (vh + rect.height), 0, 1)`(`.care-photo` 기준). 섹션을 통과하는 동안 p는 0→1, translateY는 +4%→−4%다(1440 기준 640px의 8% ≈ 51px 변화, 390 기준 ≈ 21px). B1(d)의 ≥ 8px를 만족한다. scale 1.1은 이동량(위아래 각 4%)을 덮는 여유(각 5%)다. reduce에서는 transform 규칙이 없으므로 변화량이 0이다.

**칩 순차**: 표 #12. `[data-inview]` 뒤 `animation: chip-in 320ms var(--ease-stamp) calc(var(--i)*90ms) both`. computed `animation-delay`는 0s·0.09s·0.18s·(0.27s)로 목록 순서대로 늘고, 끝은 ≤ 590ms다.

### 3.4 B3 플래너 전환

**키 전략**
- `build-plan.ts` `PlanView.days[]`에 `slot: "arrive"|"treat"|"early"|"culture"|"free"|"home"`를 더한다. 같은 행을 같은 노드로 유지한다. A2 테스트는 `slot`이 모든 입력에서 같은 위치에 같은 값이라 deep-equal이 유지된다.
- `ol.days`의 `key`(`JourneyPlanner.tsx:113`)를 **지운다**. `.plan.updating` 클래스와 `swap` 키프레임(`globals.css:349–361`)도 지운다.
- 행 `key = day.slot`. 행 안의 라벨 칩 `<span key={day.label}>`은 라벨이 바뀌면 출입한다(일수 변경 시 home D6↔D4↔D9, culture D3–5↔D3). 항목 `key = item.track + "|" + item.text`(인덱스 키를 대체)이므로 텍스트가 바뀌면 출입한다(진료 변경, 인원 변경의 D-1 숙소).

| 축 | 나가는 노드 | 들어오는 노드 | `#price` |
|---|---|---|---|
| 진료 | D0 Treat 항목, early/mid/(late) 항목 | 새 진료 항목 | `span key={price}` 교체 → 굴리기 |
| 일수 7→10 | home 라벨 `D6` | free 행 전체, home 라벨 `D9` | 변화 없음(애니메이션 없음) |
| 일수 7→5 | culture 라벨 `D3–5`, mid 3번째 항목, home 라벨 `D6` | culture 라벨 `D3`, home 라벨 `D4` | 없음 |
| 일수 10→7 | free 행, home 라벨 `D9` | home 라벨 `D6` | 없음 |
| 인원 | D-1 숙소 항목(rooms[who]) | 새 숙소 항목 | 없음 |

일수 변경은 home 라벨이 항상 바뀌므로 (a)의 출입 쌍이 항상 있다. 인원 변경도 출입 쌍이 있다(spec상 없어도 PASS).

**출입 노드 보존 — 순수 함수 + 훅**(`src/lib/motion/presence.ts`)
```ts
export type Presence<T> = { key: string; item: T; state: "enter" | "stay" | "exit" };
/** prev(현재 렌더 목록)와 next(새 데이터)를 합친다. exit 노드는 prev 위치에 끼운다. */
export function mergePresence<T>(prev: readonly Presence<T>[], next: readonly T[], keyOf: (t: T) => string): Presence<T>[];
/** 첫 렌더는 전부 stay. 변경 시 merge, exitMs 뒤 exit 제거. reduce면 exit을 남기지 않고 enter도 stay로. */
export function usePresence<T>(next: readonly T[], keyOf: (t: T) => string, exitMs = 200): Presence<T>[];
```
- 병합 규칙: next 순서를 기준으로 한다. prev에만 있는 key는 prev에서 바로 앞에 있던 남는 key 뒤에 `exit`으로 끼운다. **prev에서 그 앞에 남는 key가 없으면(첫 항목이 나가거나, 길이 1 목록의 키가 바뀌는 경우) 결과 목록의 맨 앞에 `exit`을 둔다.** 같은 앵커를 쓰는 exit이 여럿이면 prev 순서를 유지한다. exit은 절대 빠뜨리지 않는다(진료 변경의 D0 첫 항목 Treat, 일수 변경의 home 라벨 span — 자식 1개 — 가 이 경우다). next에만 있는 key는 `enter`, 둘 다 있으면 `stay`. 이미 `exit`인 노드가 다시 next에 오면 `enter`. 연속 조작이면 이전 exit이 남아 있어도 병합한다(키 중복 없음).
- `usePresence`: 렌더 중 `useState` + 이전 next 비교(React 공식 「prop 변경 시 state 조정」 패턴), 제거는 `useEffect`의 `setTimeout(exitMs)`. 언마운트 시 타이머를 정리한다.
- 렌더: 행·라벨·항목 세 수준에 적용한다. 노드에 `data-presence={state}`. **exit 노드는 `aria-hidden="true"` + `inert`**이므로 접근성 트리와 탭 순서에서 즉시 빠진다. enter·stay는 일반 노드다.
- CSS(no-preference 안):
  ```css
  .plan:not([data-intro]) [data-presence="exit"]{ animation:node-out 180ms var(--ease-in) both; pointer-events:none; }
  .plan:not([data-intro]) [data-presence="enter"]{ animation:node-in 260ms var(--ease-out) 60ms both; }
  #price > span{ display:inline-block; }
  .plan:not([data-intro]) #price > span[data-roll]{ animation:price-roll 280ms var(--ease-out) both; }
  ```
  - 게이트 요소는 §3.2와 같은 `article.plan#plan-card` 하나다. 첫 조작 렌더에서 JourneyPlanner가 이 요소의 `data-intro`를 지우면 위 세 규칙이 그 프레임부터 적용된다. 첫 렌더 노드는 전부 `stay`라서 게이트가 열려도 기존 노드는 재생되지 않는다.
  - `price-roll`은 **가격이 바뀌어 새로 마운트된 span**에만 붙는다. 게이트가 열리는 순간 기존 span이 규칙에 새로 맞아 재생되는 것을 막으려고 `data-roll`을 쓴다. 렌더 중 상태 조정 패턴: `const [pr, setPr] = useState({ v: plan.price, rolled: false }); if (pr.v !== plan.price) setPr({ v: plan.price, rolled: true });` → `<span key={pr.v} data-roll={pr.rolled ? "" : undefined}>{pr.v}</span>`. 일수·인원 변경은 key와 속성이 그대로라 재생되지 않는다(첫 조작이 일수여도 같다).
- exit 노드는 흐름에 남은 채로 180ms 사라지고 200ms에 제거된다. 그때 높이가 한 번 바뀐다. 사용자 입력 500ms 안이라 CLS에서 제외된다. 남는 노드 이동 보간(FLIP)은 하지 않는다(§8).
- `aria-live` 영역(`:102`, 제목·부제)은 그대로다. 라디오·키보드 조작은 그대로다.

### 3.5 B4 회복 일차 스크러버

**순수 함수**(`src/lib/recovery/recovery-day.ts`)
```ts
import type { Dictionary } from "@/content/types";
export type RecoveryDayView = {
  column: number;          // 0..6 = 강조 열(D{column})
  activeRuleIds: number[]; // doctorOk.rows 인덱스 중 day >= okFromDay (오름차순)
  rowIndex: 0 | 1 | 2 | 3; // recovery.rows 인덱스: 0→0, 1–2→1, 3–5→2, 6→3
  ariaText: string;        // `D${d} — ${recovery.rows[rowIndex].note}` (U+2014, 앞뒤 공백 1칸)
};
export function recoveryDay(
  day: number,
  rules: Dictionary["doctorOk"]["rows"],
  rows: Dictionary["recovery"]["rows"],
): RecoveryDayView; // day는 Math.round 후 0..6으로 clamp
```
행에 id 필드가 없어서 `activeRuleIds`는 사전 행 인덱스다. 사전 순서는 5개 언어 공통이고 dictionary 테스트가 shape를 고정한다.

**컴포넌트**
- 새 `src/components/home/RecoveryExplorer.tsx`("use client"): `day` 상태(초기 3)를 들고 기존 두 섹션을 렌더한다.
  ```tsx
  <DoctorOkRules copy={doctorOk} view={v} onDay={setDay} />
  <RecoveryWeek copy={recovery} activeRow={v.rowIndex} />
  ```
  `page.tsx:28–29`의 두 줄을 `<RecoveryExplorer doctorOk={d.doctorOk} recovery={d.recovery} />` 한 줄로 바꾼다. `DoctorOkRules`·`RecoveryWeek`는 props만 늘어난 표현 컴포넌트로 남는다(클라이언트 경계 안에서 import되므로 "use client"는 필요 없다). 서버 HTML에는 day=3 상태가 그대로 렌더된다.
- 스크러버(`.okrules` 오른쪽 열, `.rule-scroll` 위):
  ```tsx
  <div className="scrub">
    <label htmlFor="scrub-day">{c.scrub.label}</label>
    <span className="scrub-now" aria-hidden="true">D{v.column}</span>
    <input id="scrub-day" type="range" min={0} max={6} step={1} value={v.column}
      aria-valuetext={v.ariaText} onChange={(e) => onDay(+e.currentTarget.value)}
      style={{ "--fill": v.column / 6 } as React.CSSProperties} />
    <div className="scrub-ticks" aria-hidden="true">{D0..D6 span 7개}</div>
  </div>
  ```
  네이티브 range이므로 ←→/↑↓(±1), Home(0), End(6), PageUp/Down, 드래그, 트랙 클릭이 브라우저 기본으로 된다. `onChange`는 React에서 input 이벤트마다 발생한다.
- 그리드 연결: `thead th`와 `td`의 열 인덱스가 `v.column`이면 `data-col-on`, 행 `tr`이 `activeRuleIds`에 있으면 `data-on`. 셀의 y/n 텍스트·색은 지금과 같다(표의 정보는 그대로, 강조만 더한다).
  - `[data-col-on]{ box-shadow: inset 0 0 0 2px #fff }`, `tr[data-on] th{ box-shadow: inset 4px 0 0 var(--ok) }`. 글자색·투명도는 바꾸지 않는다(Lighthouse 대비 100 유지).
- 「오늘 가능한 것」(`.today`, 그리드 아래): `<h3>{c.scrub.todayTitle} · D{d}</h3>` + `<ul>` 항목 = `activeRuleIds.map(i => rows[i].activity)`(key=activity, `--i`). 비면 `<p>{c.scrub.todayNone}</p>`. aria-live는 쓰지 않는다(값 변경은 range의 `aria-valuetext`가 읽힌다. 중복 낭독 방지).
- 회복 표: `tr`에 `data-active` + `aria-current="true"`(rowIndex 행만). `tr[data-active]{ background: color-mix(in srgb, var(--ok) 28%, transparent) } tr[data-active] .stage{ box-shadow: inset 4px 0 0 var(--ok) }`. 860 이하 블록 레이아웃에서도 tr 배경이 보인다.
- range 스타일: `appearance:none`. 트랙은 `linear-gradient(to right, var(--ok) calc(var(--fill)*100%), rgba(255,255,255,.18) 0)`, 엄지 22px(배경 `--ok`, 테두리 `--ink`), `:focus-visible{ outline:3px solid var(--ok); outline-offset:4px }`(pine 배경 위라 기존 pine 아웃라인은 보이지 않는다. `.give input:focus-visible`과 같은 규칙).

**신규 문구 키**(`types.ts` `doctorOk.scrub`, 5개 언어. `%` 없음, 금지어 없음)

| 키 | ko | en | ja | id | mn |
|---|---|---|---|---|---|
| `scrub.label` | 회복 일차 | Recovery day | 回復日数 | Hari pemulihan | Эдгэрэлтийн өдөр |
| `scrub.todayTitle` | 오늘 가능한 것 | Possible today | 今日できること | Bisa hari ini | Өнөөдөр боломжтой |
| `scrub.todayNone` | 오늘은 쉬며 의료진 확인을 기다립니다 | Rest today while your care team checks in | 今日は休養し、医療スタッフの確認を待ちます | Hari ini istirahat sambil menunggu pemeriksaan tim medis | Өнөөдөр амарч, эмчийн хяналтыг хүлээнэ |

(현재 규칙 데이터의 okFromDay 최솟값은 1이라 `todayNone`은 D0에만 보인다.)

### 3.6 B5 섹션 인터랙션과 접근성 패턴

**(a) 영수증 — 인쇄·확정·날인(1회)**
- `TrustReceipt.tsx`: `.receipt-wrap`에 `data-reveal`, `.rows li`에 `style={{"--i": i}}`.
- CSS: `.seal`의 로드 애니메이션(`globals.css:1025`)을 지운다. 기본 스타일을 최종 상태 `transform: rotate(-14deg); opacity:.88`로 둔다. 이제 reduce와 JS 없음 상태도 운영 최종 화면과 같다. 공개 규칙(no-preference + `[data-enhanced]`):
  ```css
  [data-enhanced] .receipt-wrap[data-reveal]:not([data-inview]) :is(.rows li,.total strong,.seal){ opacity:0 }
  .receipt-wrap[data-inview] .rows li{ animation:print 220ms var(--ease-io) calc(var(--i)*140ms) both }
  .receipt-wrap[data-inview] .total::before{ animation:rule-draw 240ms var(--ease-io) 800ms both }
  .receipt-wrap[data-inview] .total strong{ animation:confirm 220ms var(--ease-stamp) 880ms both }
  .receipt-wrap[data-inview] .seal{ animation:stamp 450ms var(--ease-stamp) 1300ms both }
  ```
  `.total`에 `position:relative`와 `::before`(위 1px 실선 `var(--ink)`, `transform-origin:left`)를 더한다.
- 1회 보장: `MotionRuntime`이 `data-inview`를 붙인 뒤 `unobserve`한다. 속성을 지우지 않으므로 다시 들어와도 재생되지 않는다.

**(b) 기록 카드 — 뒤집기(토글 버튼)**
- 새 `src/components/home/RecordFlip.tsx`("use client"), `RecordCards.tsx`가 카드마다 감싼다:
  ```tsx
  <article className="record" data-flipped={on}>
    <header>{h3 + sample}</header>                 {/* 양면 공통, 항상 보임 */}
    <div className="record-faces">
      <div className="face face-front" inert={mounted && on} aria-hidden={mounted && on || undefined}>{kind p + .doctor}</div>
      <div className="face face-back"  inert={mounted && !on} aria-hidden={mounted && !on || undefined}>{dl 4개}</div>
    </div>
    <button type="button" className="flip-btn" aria-pressed={on} aria-controls={facesId} onClick={() => setOn(!on)}>
      {c.verify}
    </button>
  </article>
  ```
  - 버튼은 면 밖에 있어 회전하지 않고 inert에도 들어가지 않는다. 포커스가 유지된다. 이름은 고정(「등록 정보 확인」), 상태는 `aria-pressed`로 알린다(APG 토글 버튼 패턴). Enter·Space는 네이티브 button이 처리한다.
  - 보이는 면만 접근 가능: 숨은 면은 `inert` + `aria-hidden`. **하이드레이션 전(`mounted=false`)과 JS 없음 상태에서는 두 면이 모두 흐름에 쌓여 보인다**(점진적 향상).
  - 뒤집기 레이아웃은 `[data-enhanced]` 아래에서만 켠다. `.record-faces{display:grid; perspective:1200px}` `.face{grid-area:1/1; backface-visibility:hidden}` `.face-back{transform:rotateY(180deg)}` `[data-flipped=true] .face-front{transform:rotateY(-180deg)}` `[data-flipped=true] .face-back{transform:rotateY(0)}`. no-preference 안에서 `.face{transition:transform 420ms var(--ease-io)}`. 높이는 두 면 중 큰 값이라 뒤집어도 레이아웃이 바뀌지 않는다. reduce에서는 transition 없이 즉시 바뀐다.
  - 버튼 클래스 `flip-btn`(guards: `cta` 단어 금지). 스타일은 `.cta--quiet`와 같은 값을 복제한다(pine 테두리 pill, `:focus-visible` 전역).
- 신규 문구 `trust.records.verify`: ko 「등록 정보 확인」 · en "Check registration" · ja 「登録情報を確認」 · id "Cek data registrasi" · mn "Бүртгэлийн мэдээлэл харах".

**(c) 문제 4단계 — 잇기**
- `ProblemSteps.tsx`: `ol.steps`에 `data-scroll="view"`. 첫 자식 앞에 `<div className="steps-line" aria-hidden="true"><i/></div>`를 둔다(ol 밖, `#trust-steps` 안, ol 바로 위). `ol.steps`의 `border-top`은 지우고 선이 대신한다.
  - `.steps-line{height:2px; background:var(--stop)} .steps-line i{display:block; height:100%; background:var(--pine); transform:scaleX(var(--p,0)); transform-origin:left}`. transition은 없다.
  - `--p`는 `ol.steps`의 rect로 계산해 `#trust-steps`에 쓴다(선과 목록이 함께 상속). `data-reached = reachedSteps(p) = min(4, floor(p×4 + 0.5))`도 같은 프레임에 `#trust-steps`에 쓴다(§3.8 `frame()`).
  - 번호 색: **현재 `.steps li > span`은 `var(--pine)`이다(`globals.css:1119–1122`). 이 값을 그대로 두고, 미도달 번호만 `var(--text-3)`로 바꾼다.** `#trust-steps[data-reached="N"] li:nth-child(n+N+1) > span{color:var(--text-3)}`(N = 0..3 네 줄, N=4는 규칙 없음 = 전부 pine). `data-reached`가 없을 때(JS 없음·하이드레이션 전)는 규칙이 맞지 않아 전부 pine(현재 화면과 같음). text-3 대비는 Lighthouse A11y 100(R-B8)으로 확인한다. 색 transition 200ms(no-preference).
- 비율 정의 `p = clamp((vh − top)/(vh + height), 0, 1)`:
  - scrollY 0 → 목록이 화면 아래 → top ≥ vh → 0% ✓(≤ 2%)
  - 목록 중심 = 화면 중심 → top = (vh − h)/2 → p = 0.5 → 50% ✓(40–70%)
  - 목록 bottom < 0 → p = 1 → 100% ✓(≥ 98%)
  - 되돌리면 같은 식으로 감소 ✓

**(d) 템플릿 — 펼치기(hover·focus-within)**
- 데이터: 새 `src/content/shared/template-plans.ts`
  ```ts
  export const TEMPLATE_PLANS = [
    { tx: "implants", days: 7, pax: 2 }, { tx: "lasik", days: 5, pax: 2 },
    { tx: "screening", days: 5, pax: 2 }, { tx: "womens-health", days: 7, pax: 2 },
    { tx: "fertility", days: 10, pax: 2 }, { tx: "screening", days: 7, pax: 3 },
  ] as const satisfies readonly PlanInput[];
  ```
  `templates.items`와 인덱스로 짝짓는다. 미니 일정 = `buildPlan(TEMPLATE_PLANS[i], d.planner).days.map(({label,title}) => …)`(서버 렌더). 신규 문구가 없다.
- 마크업(`TemplateList.tsx`, 서버): `li`에 `<ol className="tpl-mini" id={"tpl-mini-"+i}>{days.map((x,j) => <li style={{"--i":j}}><b>{x.label}</b> {x.title}</li>)}</ol>`. 링크(`QuoteStartLink`)에 `aria-describedby={"tpl-mini-"+i}`를 준다. `QuoteStartLink`에 선택 prop `describedBy`를 더한다. 숨은 상태여도 설명으로 계산되어 키보드 포커스 때 미니 일정이 읽힌다.
- 레이아웃 시프트 없음: `.tpl li{position:relative}`, `.tpl-mini{position:absolute; left:0; top:calc(100% - .35rem); z-index:5; width:min(100%,560px); …흰 카드·radius 14·그림자; visibility:hidden; clip-path:inset(0 0 100% 0 round 14px); pointer-events:none}`. 흐름 높이에 들어가지 않는다.
- 열림: `.tpl > li:is(:hover,:focus-within) .tpl-mini{visibility:visible; clip-path:inset(0 round 14px)}`. no-preference 안에서 열기 `transition: clip-path 240ms var(--ease-out), visibility 0s`, 닫기 `transition: clip-path 160ms var(--ease-in), visibility 0s linear 160ms`, 자식 `animation:tm-in 200ms var(--ease-out) calc(var(--i)*30ms) both`. CSS만 쓰므로 JS 없이도 동작한다. `scrollWidth` 보호: `width:min(100%,560px)`.

**(e) 앰버서더 — 전환·채우기**
- `Ambassador.tsx`를 "use client"로 바꾼다. `const [give, setGive] = useState(0)`, 라디오 `checked={give===i} onChange={() => setGive(i)}`(`defaultChecked` 대체). 이름·라벨·키보드(화살표로 라디오 이동)는 그대로다.
- 미리보기 패널 맨 위에 `<p className="give-to" aria-live="polite"><span>{c.preview.giveTo}</span> <strong key={give}>{options[give].label}</strong> · {options[give].note}</p>`. `strong` key 교체가 「전환」 애니메이션을 낸다.
- 점: `<span className="dot …" key={`${give}-${i}`} style={{"--d": (i-1)*90 + rowIdx*40}}>`. 환원처를 바꾸면 점이 다시 마운트되어 단계 순서(열 1→4)대로 다시 채워진다. 첫 표시 때는 `.ref-preview[data-reveal]`의 진입 1회로 재생된다. `.ref-preview[data-inview] .dot:is(.done,.now){animation:dot-fill 220ms var(--ease-stamp) calc(var(--d)*1ms) both}`. 빈 점(미도달)은 애니메이션하지 않는다.
- 신규 문구 `ambassador.preview.giveTo`: ko 「환원처」 · en "Thanks goes to" · ja 「還元先」 · id "Disalurkan ke" · mn "Талархлыг хүлээн авагч".

### 3.7 B6 견적 폼

- `QuoteForm.tsx`:
  - `changeStep(n)` 하나로 `go`(`:76`)와 422 경로(`:119`)를 모은다. `leaving = {step: 이전, dir: n > 이전 ? 1 : -1}` 상태를 두고, 220ms 뒤(reduce면 즉시) null로 만든다.
  - 단계 본문을 `renderStep(s)` 함수로 뽑는다(기존 `:153–281` 그대로). 폼 안에 `<div className="q-stage">`를 두고, 그 안에 들어오는 단계 `<div className="q-step" data-step-state="enter" key={step} style={{"--dir": dir}}>`를 먼저, 나가는 단계 `<div … data-step-state="leave" aria-hidden inert>`를 **뒤에** 렌더한다. DOM 순서상 `querySelector('[name=…]')`(`:57–59`)가 들어오는 단계를 먼저 찾는다. 단계마다 필드·id가 겹치지 않아(STEP_FIELDS) 중복 id가 없다.
  - `.q-stage{display:grid} .q-step{grid-area:1/1}`이므로 겹쳐 그린다. 키프레임: leave `translateX(0)→calc(var(--dir)*-24px)`, opacity→0, 200ms in. enter `translateX(calc(var(--dir)*24px))→0`, opacity, 280ms out, 지연 40ms.
  - 첫 마운트 단계는 `data-step-state="stay"`(애니메이션 없음).
  - 진행 막대: `ol.stepper` 위에 `<div className="q-progress" aria-hidden="true"><i style={{"--step": step}} /></div>`. `i{transform:scaleX(calc(var(--step)/3)); transform-origin:left; transition:transform 320ms var(--ease-out)}`(transition은 no-preference). 단계는 `ol.stepper`의 `aria-current="step"`이 이미 알린다.
  - 완료 화면(`:128–138`): h2 앞에 `<svg className="done-seal" aria-hidden="true">`(원 r=44 + 체크 path, `stroke="currentColor"`, 색 `var(--pine)`). `circle`·`path`에 **`pathLength="1"`** 속성을 준다(길이 측정 불필요). CSS `circle, path{stroke-dasharray:1; stroke-dashoffset:0}`, no-preference 안에서 `animation:seal-draw 560ms var(--ease-io) both`, `@keyframes seal-draw{from{stroke-dashoffset:1}to{stroke-dashoffset:0}}`, `svg{animation:stamp-in 300ms var(--ease-stamp) 560ms both}`. 끝은 860ms이고 문구가 없다.
- A6(필수값·422·사전 공개 안내·저장 없음) 로직은 손대지 않는다. `validateStep`·`validateQuote`·fetch 경로는 그대로다.

### 3.8 MotionRuntime(전역 런타임)

`src/components/motion/MotionRuntime.tsx`("use client", `layout.tsx` body 끝, `MessengerBar` 뒤에 한 번 마운트, `null` 반환)
```ts
useEffect(() => {
  if (!("IntersectionObserver" in window)) return;
  const root = document.documentElement;
  // 1) 진입 1회
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { (e.target as HTMLElement).dataset.inview = ""; io.unobserve(e.target); }
  }), { rootMargin: "0px 0px -15% 0px" });
  document.querySelectorAll("[data-reveal]").forEach((el) => io.observe(el));
  root.dataset.enhanced = "";            // 관측을 건 뒤에 붙인다
  // 2) 스크롤 연동(읽기 → 쓰기 일괄, rAF 1회)
  const views = [...document.querySelectorAll<HTMLElement>("[data-scroll=view]")];
  const head = document.querySelector<HTMLElement>(".site-head");
  const steps = document.querySelector<HTMLElement>("#trust-steps");
  const si = views.findIndex((el) => el.matches("#trust-steps ol.steps"));
  let compact = false, raf = 0;
  const frame = () => { raf = 0;
    const vh = innerHeight, y = scrollY, max = root.scrollHeight - vh;
    const ps = views.map((el) => { const r = el.getBoundingClientRect(); return viewProgress(r.top, r.height, vh); });
    head?.style.setProperty("--doc-p", String(docProgress(y, max)));
    views.forEach((el, i) => (el.closest("[data-scroll-host]") ?? el).style.setProperty("--p", ps[i].toFixed(4)));
    if (steps && si >= 0) steps.dataset.reached = String(reachedSteps(ps[si]));   // #trust-steps 번호 색(§3.6(c))
    const next = compact ? y >= 40 : y >= 80; if (next !== compact && head) { compact = next; head.toggleAttribute("data-compact", next); }
  };
  const on = () => { if (!raf) raf = requestAnimationFrame(frame); };
  frame(); addEventListener("scroll", on, { passive: true }); addEventListener("resize", on);
  return () => { io.disconnect(); removeEventListener("scroll", on); removeEventListener("resize", on); cancelAnimationFrame(raf); };
}, []);
```
- 순수 함수(`src/lib/motion/progress.ts`): `viewProgress(top, height, vh) = clamp01((vh − top)/(vh + height))`, `docProgress(y, max) = max <= 0 ? 1 : clamp01(y/max)`, `reachedSteps(p) = Math.min(4, Math.floor(p*4 + 0.5))`.
- reduce에서도 똑같이 돈다(값은 상태다). CSS가 시차 transform과 transition만 끈다.
- 클라이언트 내비게이션은 없다(모든 링크가 `<a href>`, 언어 전환도 전체 로드). 그래서 마운트 1회 수집으로 충분하다. RecoveryExplorer·Ambassador·RecordFlip이 다시 렌더해도 `data-reveal`·`data-scroll` 노드는 서버 컴포넌트 쪽이라 교체되지 않는다. **예외**: `.ref-preview[data-reveal]`는 클라이언트 컴포넌트 안에 있다. React가 해당 노드를 다시 만들지 않도록 key를 고정한다. data-inview 속성은 React가 관리하지 않는 속성이라, 재렌더에서 지워지지 않는다(React는 자신이 준 props만 비교한다).

### 3.9 점진적 향상 규칙(정리)

| 상태 | 서버 HTML | JS 없음 | JS 있음·하이드레이션 전 | JS 있음·no-preference | reduce |
|---|---|---|---|---|---|
| 히어로 | 전부 텍스트 | 키프레임 1.2초 뒤 보임 | 같음 | 같음 | 0ms부터 보임 |
| 칩·영수증·점 | 보임 | 보임(공개 규칙에 `[data-enhanced]` 없음) | 보임 | 화면 밖이면 숨김 → 진입 시 재생 | 보임 |
| 기록 카드 | 두 면 쌓여 보임 | 두 면 보임, 버튼 무동작 | 두 면 보임 | 한 면 + 뒤집기 | 한 면 + 즉시 교체 |
| 템플릿 미니 일정 | DOM에 있음, CSS로 숨김 | hover·focus로 펼침(CSS) | 같음 | 펼침 모션 | 즉시 펼침 |
| 스크러버·앰버서더 | day=3, give=0 상태 렌더 | 정적 표 | 정적 | 조작 | 조작(즉시) |

`curl /en`으로 모든 사전 문자열이 HTML에 있는지 확인한다(B2 검증 레시피).

### 3.10 B11 전역 — sticky 헤더 축소·진행 표시·scroll-margin

- 마크업(`SiteHeader.tsx`): `<header className="site-head"><div className="wrap site-head-in">{logo · nav · LanguageSwitcher}</div><div className="read-progress" aria-hidden="true"><i/></div></header>`. 기존 `.site-head` 규칙 중 **flex 배치 선언만** `.site-head-in`으로 옮긴다: `:41–46`(display·align-items·gap·padding-block), `:91–93`의 `.site-head{justify-content:space-between}`(860 이하), `:1457–1459`의 `.site-head{gap:1rem}`. **같은 860 블록의 `.site-nav{display:none}`(`:88–90`)은 그대로 둔다** — 390·768에서 내비 숨김이 유지된다.
- CSS:
  ```css
  .site-head{ position:sticky; top:0; z-index:40;
    background:color-mix(in srgb, var(--paper) 92%, transparent); backdrop-filter:blur(10px);
    border-bottom:1px solid var(--line); margin-bottom:0; }
  .site-head-in{ display:flex; align-items:center; gap:2rem; padding-block:1.25rem; }
  .site-head[data-compact]{ margin-bottom:1.3rem; }          /* 줄어든 만큼 흐름 보존 → 본문 이동 0 */
  .site-head[data-compact] .site-head-in{ padding-block:.6rem; }   /* 높이 −20.8px */
  .site-head[data-compact] .logo{ transform:scale(.88); transform-origin:left center; }
  .read-progress{ position:absolute; left:0; right:0; bottom:-1px; height:3px; }
  .read-progress i{ display:block; height:100%; background:var(--pine); transform:scaleX(var(--doc-p,0)); transform-origin:left; }
  @media (prefers-reduced-motion:no-preference){
    .site-head, .site-head-in{ transition:margin-bottom 200ms var(--ease-out), padding 200ms var(--ease-out); }
    .site-head .logo{ transition:transform 200ms var(--ease-out); }
  }
  main [id], #main{ scroll-margin-top:var(--head-h); }       /* 88px */
  ```
  - padding 감소(2×0.65rem)와 margin-bottom 증가(1.3rem)가 같은 시간·이징으로 움직인다. 따라서 매 프레임 `헤더 높이 + margin`이 일정하다. 스크롤 중 헤더가 줄어도 본문이 밀리지 않는다(CLS 0).
  - 헤더 높이 예측: 펼침 ≈ 20+38+20 = 78px(언어 pill 높이 기준, 추정). 축소 ≈ 57px. 차이 20.8px ≥ 8 ✓. `--head-h` 88 ≥ 78+1이므로 어느 상태에서든 `#care.top ≥ 헤더 높이 − 1` ✓. Developer는 1440·390에서 실측해 펼침 높이가 87을 넘으면 `--head-h`를 실측+8로 올리고 기록한다.
  - 축소 후에도 로고·nav·언어 전환은 같은 DOM이고 숨기지 않으므로 포커스가 간다. z-index: skip 50 > 헤더 40 > 언어 메뉴(헤더 안 30) > msgbar 20.
- `html{scroll-behavior:smooth}`는 유지한다(reduce에서는 auto).

### 3.11 기타

- `.gitignore`의 `.lessons/` 줄(9행)을 지운다. `.loop/`·`.vercel/`은 유지한다. 그러면 `.lessons/` 4개 파일이 untracked로 드러난다. Developer는 리포 밖 패턴 파일로 `rg -f` 0건을 확인한 뒤 PR에 포함한다.
- 금지(지시 10): `.github/**`, `design/drafts/**`, 새 색·서체, 비공개 수치. `color-mix`는 기존 토큰(`--paper`, `--ok`)의 투명도만 바꾼다. 새 색값 리터럴은 `#fff`(기존 사용)뿐이다.

## 4. 변경 파일 목록

★ = protected/human_gate. **해당 없음**(`.github/**`·`.claude/rules/**`·`design/drafts/**` 무변경).

| 경로 | 신규/수정 | 이유 |
|---|---|---|
| `src/styles/globals.css` | 수정 | `img{height:auto}`, 중복 reduce 블록 제거, `.plan.updating`/`swap`·`.seal` 로드 애니 제거, 헤더·care·스크러버·카드·4단계·템플릿·앰버서더·견적·키프레임 전부(no-preference 안) |
| `src/styles/tokens.css` | 수정 | 이징 4종, `--head-h` |
| `src/app/[lang]/layout.tsx` | 수정 | `<MotionRuntime />` 마운트 |
| `src/app/[lang]/page.tsx` | 수정 | DoctorOkRules+RecoveryWeek → `RecoveryExplorer` |
| `src/components/motion/MotionRuntime.tsx` | 신규 | IO 진입 1회, rAF 스크롤 변수, 헤더 compact |
| `src/lib/motion/progress.ts` | 신규 | `viewProgress`·`docProgress`·`reachedSteps` 순수 함수 |
| `src/lib/motion/presence.ts` | 신규 | `mergePresence` 순수 함수 + `usePresence` 훅 |
| `src/lib/recovery/recovery-day.ts` | 신규 | `recoveryDay()` 순수 함수 |
| `src/lib/planner/build-plan.ts` | 수정 | `days[].slot` 추가 |
| `src/components/layout/SiteHeader.tsx` | 수정 | 전폭 sticky 구조, `.read-progress` |
| `src/components/home/Hero.tsx` | 수정 | h1 span `--i`만. `section.hero`에 `data-intro`를 달지 않는다(서버 컴포넌트 유지) |
| `src/components/home/JourneyPlanner.tsx` | 수정 | `article.plan#plan-card`에 `data-intro`(touched=false일 때만, 첫 조작 렌더에서 같은 요소에서 지움 — §3.2·§3.4), `updating` 클래스·ol key 제거, presence 3수준, price span key + `data-roll`, 행 `--i` |
| `src/components/home/LocalBlock.tsx` | 수정 | `care-split`, `getImageProps` 단일 src, `.care-photo[data-scroll]`, 패널 `data-reveal`, 칩 `--i` |
| `src/components/home/RecoveryExplorer.tsx` | 신규 | day 상태, 두 섹션 연결 |
| `src/components/home/DoctorOkRules.tsx` | 수정 | 스크러버·열/행 강조·「오늘 가능한 것」 props |
| `src/components/home/RecoveryWeek.tsx` | 수정 | `activeRow` → `data-active`/`aria-current` |
| `src/components/home/TrustReceipt.tsx` | 수정 | `data-reveal`, 행 `--i` |
| `src/components/home/RecordCards.tsx` | 수정 | 면 분리, `RecordFlip` 사용 |
| `src/components/home/RecordFlip.tsx` | 신규 | 토글 버튼·inert 면 |
| `src/components/home/ProblemSteps.tsx` | 수정 | `.steps-line`, `data-scroll`, `data-scroll-host` |
| `src/components/home/TemplateList.tsx` | 수정 | 미니 일정 `ol.tpl-mini`, `aria-describedby` |
| `src/components/cta/QuoteStartLink.tsx` | 수정 | 선택 prop `describedBy` |
| `src/components/home/Ambassador.tsx` | 수정 | "use client", 선택 상태, `.give-to`, 점 key·`--d`, `data-reveal` |
| `src/components/quote/QuoteForm.tsx` | 수정 | `changeStep`, 단계 출입, 진행 막대, 완료 인장 |
| `src/content/shared/template-plans.ts` | 신규 | 템플릿 6개 → PlanInput |
| `src/content/types.ts` | 수정 | `doctorOk.scrub{label,todayTitle,todayNone}`, `trust.records.verify`, `ambassador.preview.giveTo` |
| `src/content/{ko,en,ja,id,mn}.ts` | 수정 | 위 신규 키 5개 언어(§3.5·§3.6 표 문자열) |
| `tests/recovery-day.test.ts` | 신규 | d=0..6 × 5개 언어 전수, clamp·round |
| `tests/presence.test.ts` | 신규 | `mergePresence` enter/stay/exit·순서·재진입 + **(1) 첫 항목만 교체**(`[A,B]→[C,B]` ⇒ `[A:exit, C:enter, B:stay]`, exit이 맨 앞) **(2) 길이 1 목록 키 교체**(`[D6]→[D9]` ⇒ `[D6:exit, D9:enter]`). 두 경우 모두 exit 1개가 결과에 있는지 단언 |
| `tests/motion-progress.test.ts` | 신규 | 진행값 경계(0·중앙 0.5·통과 1·max≤0) |
| `tests/template-plans.test.ts` | 신규 | 길이 6, 5개 언어 `length` 숫자 = days, `QUOTE_INTEREST[tx]` = interest |
| `tests/planner.test.ts` | 수정 | A2 단언은 유지하고 `slot` 순서 단언 1개 추가 |
| `tests/dictionary.test.ts` | 수정 | 신규 키 존재 단언(shape 비교가 이미 5개 언어 동일을 강제) |
| `.gitignore` | 수정 | `.lessons/` 줄 제거 |
| `.lessons/**` | 신규 추적 | 무시 해제로 커밋 대상(내용 수정 없음) |

정본 registry·경계 테스트 해당 없음(새 CLI·DB 조회 없음). 새 의존성 없음(`package.json`·lock 무변경).

## 5. 마이그레이션 여부

없음. DB·Prisma·RLS 없음. 사람 게이트 경로 변경 없음.

## 6. 검증 계획

공통 조건: 로컬 production(`npm run build && npm start`, 포트 3000). 계정 없음(공개). 테마는 라이트(사이트에 다크 없음, `color-scheme: light`). 브라우저는 `/tmp/leh-qa-tools` playwright@1.63.0 + 시스템 Chrome headless(직전 run과 같음). `deviceScaleFactor` 2(B1만 필수, 나머지는 1 허용). 모션 모드는 `page.emulateMedia({ reducedMotion: "no-preference" | "reduce" })`. 스크롤은 `scroll-behavior:smooth`가 있으므로 측정용 이동에 `scrollTo({top, behavior:"instant"})`를 쓴다. 증거는 `evidence/qa-B*-*.png|json`.

**결정적 프레임 기법**(B2·B5(a) 스크린샷): 트리거 직후 `document.getAnimations().forEach(a => { a.pause(); a.currentTime = T; })`. 같은 트리거로 시작한 애니메이션은 시작 시각이 같으므로 T가 곧 경과 시간이다. 타이머 오차가 없다.

### 6.1 항목 ↔ 테스트/실측 매핑

| B | 단위 테스트 | 브라우저·명령 |
|---|---|---|
| B1 | — | R-B1(4폭 × ko/en × 2모드) |
| B2 | — | R-B2 + `curl` + Lighthouse CLS(B8) |
| B3 | `planner.test.ts`(A2 유지 + slot), `presence.test.ts` | R-B3 |
| B4 | `recovery-day.test.ts` | R-B4 |
| B5 | `motion-progress.test.ts`, `template-plans.test.ts` | R-B5a~e |
| B6 | 기존 `quote-route`·`quote-schema` | R-B6(ja 완주) |
| B7 | — | R-B7 |
| B8 | — | R-B8 Lighthouse ×3, scrollWidth, 포커스, 번들 스크립트 |
| B9 | `npm test` 전체(기존 75건 + 신규) | curl·rg·git 명령(R-B9) |
| B10 | — | Releaser + 운영 R-B1(1440·390)·R-B4(D3) |
| B11 | `motion-progress.test.ts` | R-B11(1440·390) |

### 6.2 관측 레시피

**R-B1 진료찾기**: URL `/ko#care`, `/en#care`. 뷰포트 1860×920, 1440×900, 768×1024, 390×844. dpr 2. 새 컨텍스트로 연다. **고정 대기는 판정 조건이 아니다.** 측정 전 순서:
1. `load` 이벤트를 기다린다.
2. smooth 해시 스크롤을 끊고 위치를 고정한다: `const careTop = document.querySelector('#care').getBoundingClientRect().top + scrollY - parseFloat(getComputedStyle(document.querySelector('#care')).scrollMarginTop || 0); scrollTo({ top: careTop, behavior: "instant" });`
3. rAF 2회 뒤 `Math.abs(scrollY - careTop) <= 1`을 확인한다(아니면 2를 1회 반복).
4. no-preference: `page.waitForFunction(() => document.querySelector('#care .local-panel')?.hasAttribute('data-inview') && [...document.querySelectorAll('.care-chips li')].every(li => getComputedStyle(li).animationName !== 'none'))`(타임아웃 3000ms = 실패). reduce: `animationName`은 `none`이 정상이므로 `data-inview`만 기다린다(JS 활성 상태에서 IO 콜백이 돈 뒤).
5. 그 다음 아래 스크립트로 측정한다. (b)~(c)의 `getBoundingClientRect` 값과 (d)의 `animationDelay`는 모두 이 상태에서 읽는다.
```js
const img = document.querySelector('#care img'), r = img.getBoundingClientRect(), dpr = devicePixelRatio;
const sec = document.querySelector('#care').getBoundingClientRect();
const inV = (el) => { const b = el.getBoundingClientRect(); return b.top >= 0 && b.bottom <= innerHeight; };
({ ratio: r.height / r.width, natW: img.naturalWidth, natH: img.naturalHeight, needW: r.width*dpr, needH: r.height*dpr,
   secH: sec.height, cap: innerHeight*1.4,
   h2: inV(document.querySelector('#care h2')), chips: [...document.querySelectorAll('.care-chips li')].every(inV),
   special: inV(document.querySelector('.local-panel p')), messenger: inV(document.querySelector('.local-panel .cta--messenger')),
   panelAbovePhoto: document.querySelector('.local-panel').getBoundingClientRect().bottom <= r.top + 1 })
```
- 기대: ratio ≤ 1.3, natW ≥ needW, natH ≥ needH, secH ≤ cap. 1440·1860은 h2·chips·special·messenger가 모두 true. 390·768은 panelAbovePhoto·h2·chips가 true. 예측 수치는 §3.3 표.
- (d) no-preference: `#care` 위끝이 화면 아래에 걸린 위치와 아래끝이 화면 위에 걸린 위치 두 곳에서 `new DOMMatrix(getComputedStyle(img).transform).m42`를 잰다. 차이 ≥ 8(예측 1440 ≈ 40~51, 390 ≈ 17~21). 칩은 `getComputedStyle(li).animationDelay`가 순서대로 늘고, `Math.max(...getAnimations().map(a => a.effect.getComputedTiming().endTime)) ≤ 1200`. reduce: 두 위치 모두 transform `none` → 변화량 0.
- 스크린샷 `qa-B1-{lang}-{w}.png` 8장.

**R-B2 히어로**: `/en`, 1440×900, 새 컨텍스트(빈 저장소), no-preference.
1. `page.goto(url, {waitUntil:"commit"})` 뒤 첫 프레임에서 결정적 프레임 기법으로 T=0, 400, 1200을 캡처한다(`qa-B2-0|400|1200.png`). 기대: 0에는 본문이 없거나 옅고, 400에는 h1이 서고 카드가 떠오르는 중이며, 1200에는 전부 보이고 선이 끝까지 그려져 있다.
2. 선: `const cs = getComputedStyle(document.querySelector('.days'), '::before'); new DOMMatrix(cs.transform).d` → T=1200에서 1, `cs.top === "8px" && cs.bottom === "8px"`. 390에서는 `cs.display === "none"`이면 PASS.
3. `.hero` 안 모든 애니메이션의 `endTime ≤ 1200`.
4. reduce: `getAnimations().length === 0`이고 `::before` transform이 `none`(=scaleY 1).
5. JS 없음: `javaScriptEnabled:false` 컨텍스트에서 1300ms 뒤 h1·`.day` 모두 `opacity === "1"`. `curl -s localhost:3000/en | grep -c 'id="plan-card"[^>]*data-intro'`(또는 속성 순서 무관 grep 2회)로 서버 HTML의 `data-intro` 존재 1 확인, `curl -s localhost:3000/en | grep -c` 로 `hero.headline`·`planner` 일정 문자열 존재 확인.
6. CLS는 R-B8 Lighthouse 값 ≤ 0.02.

**R-B3 플래너** — 전이 표(1440×900, `/en`, no-preference, 로드 1500ms 뒤 시작)

| 시작 | 입력(라벨 클릭/키보드) | 100ms 안 기대 | `#price` | 450ms 기대 |
|---|---|---|---|---|
| implants·7·2 | `label[for=tx-lasik]` | `[data-presence=exit]` ≥1, `[data-presence=enter]` ≥1이 서로 다른 요소로 running | `#price > span` running | 해당 애니메이션 전부 finished 또는 없음, exit 노드 0 |
| lasik·7·2 | `label[for=days-10]` | exit(home 라벨 D6) + enter(free 행, D9) | 애니메이션 없음, 텍스트 동일 | 같음 |
| lasik·10·2 | `label[for=days-5]` | exit + enter | 없음 | 같음 |
| lasik·5·2 | `label[for=pax-3]` | exit/enter(D-1 숙소) 또는 같은 행 갱신 | 없음 | 같음 |
| lasik·5·3 | 포커스를 `#tx-screening`에 두고 → 화살표 | 진료 변경과 같음 | running | 같음 |

측정 스크립트 요지:
```js
const t0 = performance.now(); el.click();
await new Promise(r => setTimeout(r, 80));
const snap = () => document.getAnimations().filter(a => a.effect?.target?.closest?.('#plan-card'))
  .map(a => ({ s: a.effect.target.closest('[data-presence]')?.dataset.presence, price: !!a.effect.target.closest('#price'), st: a.playState }));
```
그 뒤 `await sleep(450 - (performance.now() - t0))` 후 같은 필터로 running이 0인지 본다. reduce에서는 클릭 직후 exit 노드 0이고 running 0이다. A2는 `npm test`(planner) PASS다. intro 게이트 확인(M1): 첫 클릭 전 `#plan-card`에 `data-intro`가 있고, 첫 클릭 후 80ms 측정 시점에 `data-intro`가 없으며 `.hero` 안 `.day` 애니메이션의 `animationDelay`가 `0s`(stay 노드는 애니메이션 없음)다. 첫 입력이 일수(`days-10`)인 새 컨텍스트 1회도 돌려 `#price > span` 애니메이션이 없는지 본다.

**R-B4 스크러버**: `/ko`(+ `/en` 1회), 1440×900, no-preference, 키보드만.
1. Tab으로 `#scrub-day`에 포커스 → 포커스 링이 보이는지 스크린샷.
2. Home → `aria-valuetext === "D0 — 진료 당일"`, `th[data-col-on]` 텍스트 `D0`, `tr[data-on]` 0개, `.today p`(todayNone) 보임, 회복 표 `tr[data-active]` 첫 행. `qa-B4-D0.png`.
3. →×3 → `"D3 — 회복과 문화"`, `tr[data-on]` = okFromDay ≤ 3인 행(ko 1,3,3,2 → 4개), 「오늘 가능한 것」 항목 4개 = 그 행 activity, 표 3번째 행. `qa-B4-D3.png`.
4. End → `"D6 — 의료진 경과 확인 후"`, 5행 모두 on, 표 4번째 행. `qa-B4-D6.png`.
5. 드래그(엄지를 D2 위치로 `mouse.move`) → value 2. 트랙 클릭(D5 위치) → 5.
6. reduce에서 같은 순서로 값·속성이 같고 running 0이다.
- 단위: `recovery-day.test.ts`가 5개 언어 × d 0..6의 `ariaText === \`D${d} — ${rows[idx].note}\``(idx = 0,1,1,2,2,2,3), `activeRuleIds`, `column`을 사전에서 계산한 기대값과 비교한다. 경계 −1→0, 7→6, 2.6→3.

**R-B5a 영수증**: `/en`, 1440×900, no-preference. `#trust` 위 400px까지 스크롤 → `.receipt-wrap`을 `scrollIntoView({block:"center", behavior:"instant"})` → `page.waitForFunction(() => document.querySelector('.receipt-wrap').hasAttribute('data-inview') && document.querySelector('.receipt-wrap .seal').getAnimations().length > 0)`로 `data-inview`와 애니메이션 생성을 확인한 **뒤에** 결정적 프레임 기법(`pause()` + `currentTime = T`)을 건다. T=700(줄만, ₩0·인장 없음), 1150(합계 선·₩0 확정, 인장 없음), 1800(인장). `qa-B5a-1|2|3.png`. 1회 확인: 맨 위로 갔다가 다시 `#trust`로 오고 300ms 뒤 `.receipt-wrap` 하위 running 0, `data-inview` 유지. reduce: 진입 즉시 세 요소가 모두 최종 상태.

**R-B5b 기록 카드** — 전이 표(`/en`, 1440×900, 두 모드)

| 시작 | 입력 | 기대 |
|---|---|---|
| 앞면, `aria-pressed=false` | 버튼 클릭 | `aria-pressed=true`, `.face-back` inert 없음·aria-hidden 없음, `.face-front` inert, 포커스는 버튼 |
| 뒷면 | Enter | 앞면으로, `aria-pressed=false` |
| 앞면 | Space | 뒷면으로 |
| 어떤 면 | Tab | 숨은 면 안 요소에 포커스가 가지 않음(숨은 면에는 포커스 대상이 없지만 inert 확인) |

접근성 트리(`page.accessibility.snapshot()` 또는 Chrome AX)에서 보이는 면의 텍스트만 나온다. 카드 높이는 전환 전후 같다(±1px). JS 없음 컨텍스트에서는 두 면이 모두 보인다. 앞/뒤 스크린샷 `qa-B5b-front|back.png`.

**R-B5c 4단계 진행선**: `/en`, 1440×900·390×844, 두 모드.
```js
const ratio = () => { const t = document.querySelector('.steps-line').getBoundingClientRect(), f = document.querySelector('.steps-line i').getBoundingClientRect(); return f.width / t.width; };
```
- scrollY 0 → ≤ 0.02
- 목록 중심을 화면 중심에: `scrollTo({top: ol.offsetTop + ol.offsetHeight/2 - innerHeight/2, behavior:"instant"})` → 0.40–0.70(예측 0.5)
- 목록 bottom이 화면 위로 지나간 위치 → ≥ 0.98
- 다시 중앙 → 감소
- 각 위치에서 rAF 2회를 기다린다. reduce에서도 같은 위치 같은 값(0%가 아님). `getAnimations()` running 0.

**R-B5d 템플릿**: `/en`, 1440×900·390×844.

| 시작 | 입력 | 기대(300ms 뒤) |
|---|---|---|
| 닫힘 | 1번째 `li` hover | 그 `li .tpl-mini` visibility visible, `clip-path` = `inset(0px round 14px)`, 다른 li 닫힘 |
| 열림(hover) | 마우스를 목록 밖으로 | 200ms 뒤 visibility hidden |
| 닫힘 | Tab으로 3번째 li 링크 포커스 | 3번째 미니 일정 열림, 링크의 accessible description에 미니 일정 텍스트 |
| 열림(focus) | Tab으로 다음 li | 이전 닫힘, 다음 열림 |
| 열림(focus) | Shift+Tab으로 목록 밖 | 닫힘 |

레이아웃 시프트 없음: 열기 전후 `ul.tpl`의 rect height와 다음 섹션 `#ambassador` top이 같다. 390에서 `scrollWidth ≤ innerWidth`.

**R-B5e 앰버서더**: `/en`, 1440×900, no-preference. 섹션 진입 → 300ms 안 `.dot.done,.dot.now` 애니메이션들의 `animationDelay`가 같은 행 안에서 열 순서대로 증가한다. 라벨 `give-2` 클릭 → 100ms 안 `.give-to strong` 텍스트 = `options[2].label`, 그 요소 running, 점 애니메이션 재시작(새 노드), 500ms 뒤 running 0. 키보드: 라디오 포커스 후 → 화살표로 같은 결과. 전후 스크린샷.

**R-B6 견적**: `/ja/quote`, 1440×900, no-preference, ja 완주.
1. 진행 막대: 400ms 뒤 `i.getBoundingClientRect().width / track.width` = 0.333±0.05.
2. 관심 칩 선택 → 「次へ」 → 80ms에 `[data-step-state=leave]`·`[data-step-state=enter]` 각각 running → 400ms 뒤 막대 0.667±0.05, leave 노드 0.
3. 2단계 필수 → 다음 → 3단계 막대 1.0±0.05. 「戻る」로 방향이 반대인 출입 확인 후 다시 진행.
4. 이름·연락처·동의 → 제출 → `[data-done]` 마운트 후 1000ms 안 `.done-seal` 하위 애니메이션 전부 finished. 사전 공개 안내 문구 존재.
5. A6 회귀: 빈 값 다음 → 오류·포커스(기존). `/api/quote` 422 경로는 `npm test`(quote-route).

**R-B7 모션 축소**: `reducedMotion:"reduce"`, `/en`, 1440×900. 로드 직후, 그리고 각 조작(플래너 3축, 스크러버 Home/End, 카드 버튼, 템플릿 hover, 앰버서더 라디오, 견적 다음, 헤더 축소 스크롤) 직후 `document.getAnimations().filter(a => a.playState === "running").length === 0`. 스크롤 연동: 같은 scrollY에서 두 모드의 `.steps-line i` 폭 비율과 `.read-progress i` 폭 비율이 같다(±0.01). `#care img` transform은 `none`. 칩·영수증 요소 opacity가 1이다.

**R-B8 품질**
- Lighthouse: `npm run build && npm start` 뒤 `npx lighthouse http://localhost:3000/en --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --output=json --output-path=evidence/qa-B8-lh-{1,2,3}.json`. 중앙값 Perf ≥ 90, A11y 100, BP ≥ 95, SEO 100, CLS ≤ 0.02.
- `scrollWidth ≤ innerWidth`: 390·768·1440·1860, `/en`, 템플릿 hover 상태 포함.
- 포커스 표시: Tab으로 `#scrub-day`, `.flip-btn` × 2, 앰버서더 라디오, 견적 버튼 스크린샷.
- 번들(`evidence/qa-B8-bundle.sh`로 QA가 작성):
  ```bash
  # 기준: bash ~/.claude/skills/loop-engineering-holmes/scripts/leh.sh scratch 20261006-kaniq-immersive qa-base 7379aa5
  # 후보: bash … scratch 20261006-kaniq-immersive qa-cand <후보 SHA>
  for d in "$BASE:3101" "$CAND:3102"; do dir=${d%%:*}; port=${d##*:}
    (cd "$dir" && npm ci && NODE_OPTIONS=--max-old-space-size=6144 npm run build) # 한 번에 하나씩
    (cd "$dir" && PORT=$port npm start &) ; sleep 4
    curl -s localhost:$port/en | grep -oE '/_next/static/chunks/[A-Za-z0-9_./~-]+\.js' | sort -u > /tmp/chunks-$port.txt
    while read p; do curl -s "localhost:$port$p" | gzip -c | wc -c; done < /tmp/chunks-$port.txt | awk '{s+=$1} END{print s}'
  done
  ```
  기대: 후보 합 − 기준 합 ≤ 40,960 B(gzip 기본 레벨 6, 같은 명령). 예측 증가는 6–10KB(MotionRuntime·presence·recoveryDay·RecoveryExplorer·RecordFlip·Ambassador client, 추정). 두 서버를 내리고 슬롯을 되돌린다.

**R-B9 회귀**
- `npm test`(기존 75건 + 신규 PASS), `npm run lint`(경고 0이 목표, `no-img-element`는 사유 주석), `npx tsc --noEmit`(6144 heap), `npm run build`(6144 heap, 한 번에 하나).
- `curl -sI localhost:3000/`(언어 협상), `/xx`·`/en/xx` 404, 메신저 href 없음, 24시간 문구 없음(기존 가드 테스트).
- `git diff origin/main -- design/drafts` 빈 출력. `rg -f /Users/holmesmac/my-projects/customers/kaniq/brief/.confidential-patterns.txt src tests .lessons .loop/20261006-kaniq-immersive` 0건(바이너리·Vercel API 무관 숫자 제외). `git check-ignore -v .lessons/_index.md` 출력 없음(rc 1).

**R-B11 전역**: `/en`, 1440×900·390×844, 두 모드.
- (a) scrollY 0 → `.read-progress i` 폭/트랙 ≤ 0.02. `scrollTo(문서 하단)` → ≥ 0.98.
- (b) `getComputedStyle(head).position === "sticky"`. h0 = 높이(scrollY 0), scrollY 240 + rAF 2회 + 250ms 뒤 h1, `h0 − h1 ≥ 8`(예측 20.8). 그 상태에서 Tab으로 로고·언어 전환 포커스 가능(`document.activeElement`). 같은 시점 `#care` top 변화가 없다(흐름 보존, 참고값).
- (c) scrollY 0에서 헤더 `a[href$="#care"]` 클릭(390은 nav가 숨겨져 있어 `location.hash` 이동 대체 + 푸터 `#trust-steps` 링크) → scroll이 멈출 때까지(`scrollend` 또는 1200ms) → `#care.getBoundingClientRect().top ≥ head.getBoundingClientRect().height − 1`. `#plan`·`#trust`·`#ambassador`·`#trust-steps`도 같다.

헤더 전이 표

| 시작 | 입력 | 기대 |
|---|---|---|
| 펼침(y=0) | y → 79 | 펼침 유지 |
| 펼침 | y → 80 이상 | `data-compact`, 높이 −20.8px, 본문 이동 0 |
| 축소 | y → 41~79 | 축소 유지(히스테리시스) |
| 축소 | y → 39 이하 | 펼침 |

## 7. 리스크·회귀 지점

| 리스크 | 영향 | 완화 |
|---|---|---|
| 전역 `img{height:auto}` | 모든 `img`. `.plan-photo`(클래스 높이 120, 특이도 우위로 불변) · **`.registry img`(b-consult 1600×1066)**: 지금은 height 속성 1066이 `aspect-ratio:4/5`를 이긴다. 수정 후 4/5(폭×1.25)로 바뀌어 레이아웃이 달라진다 · OG 이미지는 DOM 밖 | Developer·QA가 `/en` 1440·390에서 기록 카드 영역 전후 스크린샷을 남긴다. 레지스트리 사진 높이가 오른쪽 카드 열보다 크게 길어지면 `.registry img{aspect-ratio:4/3}`로 맞추고 기록한다 |
| natural 판정과 srcset | srcset을 쓰면 natural이 밀도 보정되어 B1(a)가 항상 FAIL | §3.3 단일 src. dev에서 `currentSrc`·natural 실측 의무 |
| 단일 1280w 이미지가 모바일에 과대 | 390에서도 1280×1600 webp(추정 100–200KB, lazy, 첫 화면 밖) | LCP·TBT 무관. Lighthouse Perf ≥ 90은 R-B8로 확인한다. 미달이면 `quality:60`부터 낮추고, 다음으로 `<picture><source media="(max-width:860px)" srcset="w=1080 단일">`(밀도 1 유지) |
| 히어로 h1 opacity 0 시작과 LCP | LCP가 첫 불투명 프레임까지 밀릴 수 있다(지연 0, 한 프레임 수준) | 지연 0으로 시작. Perf 미달이면 h1은 opacity 대신 `translateY` + `clip-path`만 쓴다 |
| sticky 헤더 구조 변경 | 언어 메뉴 위치, skip 링크, 860·640 반응형 규칙 이동 누락 | flex 선언 3곳(`:41–46`, `:91–93` justify-content, `:1457–1459` gap)만 `.site-head-in`으로 옮기고 `.site-nav{display:none}`(`:88–90`)은 남았는지 diff로 확인. 390에서 `.site-nav` display none 실측. 언어 메뉴 열기·Esc·바깥 클릭(기존 A3 동작) 실기 |
| 헤더 축소 중 흐름 보존 | padding·margin transition이 다르면 본문이 1프레임씩 흔들린다 | 같은 duration·easing(§3.10). R-B11(b)에서 `#care` top 변화 0 확인 |
| presence 노드 중복 | exit 노드 텍스트가 450ms 동안 DOM에 남는다. `textContent`로 읽는 검사는 일시적으로 중복을 본다 | exit은 `aria-hidden`+`inert`. 텍스트 판정 QA는 450ms 뒤 또는 `:not([data-presence=exit])`로 읽는다 |
| 견적 단계 겹침 | 나가는 단계의 필드가 폼 안에 220ms 남는다 | 단계별 필드·id 비중복, 들어오는 단계를 DOM 앞에, 나가는 쪽 `inert`. 제출 데이터는 `draft` 상태라 영향 없음 |
| `data-inview` 대상이 클라이언트 컴포넌트 안(`.ref-preview`) | 재렌더가 노드를 바꾸면 속성을 잃어 다시 숨는다 | key 고정, 조건부 렌더 안에 두지 않는다. R-B5e에서 라디오 변경 뒤 패널 opacity 1 확인 |
| 하이드레이션 전 기록 카드 두 면 → 하이드레이션 후 한 면 | 화면 밖 높이 변화(CLS는 뷰포트 밖이라 0) | Lighthouse CLS ≤ 0.02로 확인. 그 위치에 앵커가 없다(`#trust-steps`는 그 아래라 하이드레이션 뒤 위치가 바뀐다 → 앵커 이동은 하이드레이션 뒤 측정) |
| scroll 핸들러 비용 | 저사양 모바일 스크롤 jank | passive + rAF 1회 + 읽기→쓰기 일괄, 대상 3~4개 요소 |
| 새 사전 키 5개 언어 | 누락이면 dictionary 테스트 실패, 금지어·`%`는 가드 실패 | §3.5·§3.6 표 문자열 그대로 사용. `npm test` |
| `.lessons/` 추적 시작 | 비공개 수치가 섞였으면 공개 | 커밋 전 `rg -f` 0건(R-B9) |
| A2 단언 | `slot` 추가로 deep-equal 실패 가능 | slot은 입력과 무관하게 위치별 상수다. 인원 변경 `days.slice(1)` 동일 유지 |

## 8. 비목표·후속

- FLIP(남는 일정 노드 이동 보간), View Transitions API, `animation-timeline` scroll-driven 경로, 모션 라이브러리 — §3.1 이유. 후속 후보: 지원이 넓어지면 진행선만 `animation-timeline`으로 옮기는 실험.
- 기관 파트너(`Organizations`)·푸터 모션(spec 비목표).
- 히어로 시퀀스의 재방문 생략(sessionStorage) — spec이 「빈 저장소 첫 로드」만 판정한다. 매 로드 재생 유지.
- 터치 기기에서 템플릿 미니 일정을 탭으로 여는 별도 패턴(지금은 hover·focus만; 탭은 링크 이동).
- 다크 테마, WebKit·Firefox 전용 실측(선택: QA 여유가 있으면 WebKit으로 R-B1·R-B4 1회).
- main 히스토리 재작성(사용자 결정 대기, spec 비목표).
- 실행하지 않음: 이 설계 단계에서 lint·tsc·test·build·브라우저 측정은 실행하지 않았다(읽기 전용). 패널 높이·헤더 높이·이미지 바이트·번들 증가는 추정이며 §6에서 실측한다.

## 9. 자기점검

- [x] 변경 파일 전부 실제 열어봤다 — §4의 수정 파일은 모두 읽었다(신규 파일 제외). `QuoteStartLink`·`types.ts`·`guards`·`dictionary`·`planner` 테스트 포함
- [x] Acceptance 전 항목이 §6에 매핑됐다 — B1~B11(§6.1), B10은 Releaser 경로 + 운영 R-B1·R-B4 재사용
- [x] 브라우저 판정 항목마다 관측 레시피(계정·URL·뷰포트·테마·조작 순서·기대 화면 한 줄)가 있고, 상태 전이가 있으면 전이 표가 있다 — 플래너·카드·템플릿·헤더 전이 표, 스크러버는 순서 표
- [x] 마이그레이션/게이트 경로 판정을 했다 — 없음, ★ 없음
- [x] 새 CLI·스크립트나 정본 store 테이블 조회를 설계했으면 registry·경계 테스트 파일을 §4에 넣었다 — 해당 없음(번들 스크립트는 리포 밖 QA 증거)
- [x] Developer가 질문 없이 착수 가능하다 — 대안 분기(이미지 폴백, 390 섹션 높이, 헤더 높이)는 조건과 행동을 적었다

## r2 변경 내역 (G2 리뷰 `04-review-r4.md` 81점 CHANGES 대응)

다른 설계는 바꾸지 않았다. 지적별 수정 위치:

| 지적 | 수정 | 위치 |
|---|---|---|
| M1 `data-intro` 소유 | intro 속성을 JourneyPlanner가 렌더하는 `article.plan#plan-card` 하나로 정했다. 키프레임 선택자를 `.hero:has(> .plan[data-intro])`(히어로 텍스트)·`.plan[data-intro]`(카드 안)로 바꿨다. 서버 HTML에 `data-intro=""`가 있어 JS 없이도 시퀀스가 돈다. 첫 조작 렌더에서 같은 요소의 속성을 지워 키프레임 해제 + 출입 게이트 개방이 한 프레임에 일어난다. `section.hero`·`Hero.tsx`는 서버 컴포넌트 그대로. 게이트가 열릴 때 기존 가격 span이 재생되지 않도록 `data-roll`을 더했다(M1 일관성 보강) | §3.2 「intro 소유 요소」, §3.4 CSS·주석, §4 `Hero.tsx`·`JourneyPlanner.tsx` 행, §6 R-B2 5단계·R-B3 intro 게이트 확인 |
| M2 `mergePresence` 맨 앞 exit | 「prev에서 앞에 남는 key가 없으면 결과 맨 앞에 exit」 규칙과 exit 누락 금지를 넣었다. 테스트 (1) 첫 항목만 교체 (2) 길이 1 목록 키 교체 추가 | §3.4 병합 규칙, §4 `tests/presence.test.ts` 행 |
| M3 R-B1 측정 시점 | load → `scrollTo({top, behavior:"instant"})`로 `#care` 고정 → 위치 확인 → `data-inview` + 칩 `animationName` 확인 뒤 측정. 600ms 고정 대기 삭제 | §6.2 R-B1 |
| Minor 앰버서더 점 끝 시각 | 지연식 (열−1)×90 + (행−1)×40, 3행×4열 최대 350, 끝 ≤570 | §3.2 표 #25 |
| Minor 번호 색 | 「현재 pine(`globals.css:1119–1122`) 유지, 미도달만 text-3」. 선택자를 `#trust-steps[data-reached]`로 맞췄다 | §3.2 표 #22, §3.6(c) |
| Minor §3.10 이동 범위 | flex 선언(`:41–46`, `:91–93` justify-content, `:1457–1459` gap)만 옮기고 `.site-nav{display:none}`(`:88–90`)은 유지 | §3.10, §7 sticky 헤더 행 |
| Minor 완료 인장 | `pathLength="1"`, `stroke-dasharray:1`, dashoffset 1→0 | §3.7 |
| Minor `frame()` reached | `steps`/`si` 수집 + `steps.dataset.reached = String(reachedSteps(ps[si]))` 한 줄 | §3.8 코드 |
| Minor R-B5a | instant `scrollIntoView` → `data-inview`와 애니메이션 생성 확인 뒤 `currentTime` 설정 | §6.2 R-B5a |

실행하지 않음: 이번 라운드도 설계 수정만 했다. lint·tsc·test·build·브라우저 측정은 실행하지 않았다. 인용 줄(`JourneyPlanner.tsx:31·100`, `Hero.tsx:5`, `globals.css:41–46·87–94·1119–1122·1457–1459`, `en.ts` 앰버서더 3행)은 이번에 소스를 열어 다시 확인했다.

STATUS: done [r2]
