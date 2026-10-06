# Dev — 20261006-kaniq-homepage (round 1)

## 브랜치 / PR
- branch: `feat/kaniq-homepage` (origin/main에서 생성)
- PR: https://github.com/holmesLee-ws/kaniq-homepage/pull/1 — OPEN, base `main`, head `feat/kaniq-homepage`
- commit / 원격 branch / PR head SHA: `4be4286d59ea116bedaf1034284b0106871bd4f2` (일치 확인: `evidence/dev-pr.json`, `git ls-remote`)
- 제품 커밋에 `.loop/`·`.lessons/`·`.github/` 없음. 머지·배포는 실행하지 않음 — Releaser 범위.

## 변경 파일 (경로 — 한 줄)
- `.gitignore` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `README.md` — 실행·사전 공개 모드·번역 검수·이미지 출처 안내
- `eslint.config.mjs` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `next.config.ts` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `package-lock.json` — npm install에서 생성한 의존성 잠금
- `package.json` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `public/img/a-samgyetang.jpg` — 시안 이미지 복사본, next/image 정적 import로 최적화
- `public/img/b-consult.jpg` — 시안 이미지 복사본, next/image 정적 import로 최적화
- `public/img/c-family-palace.jpg` — 시안 이미지 복사본, next/image 정적 import로 최적화
- `src/app/[lang]/layout.tsx` — App Router·SEO·폰트·검증 전용 API
- `src/app/[lang]/opengraph-image.alt.txt` — App Router·SEO·폰트·검증 전용 API
- `src/app/[lang]/opengraph-image.jpg` — App Router·SEO·폰트·검증 전용 API
- `src/app/[lang]/page.tsx` — App Router·SEO·폰트·검증 전용 API
- `src/app/[lang]/quote/page.tsx` — App Router·SEO·폰트·검증 전용 API
- `src/app/api/quote/route.ts` — App Router·SEO·폰트·검증 전용 API
- `src/app/fonts.ts` — App Router·SEO·폰트·검증 전용 API
- `src/app/global-not-found.tsx` — App Router·SEO·폰트·검증 전용 API
- `src/app/robots.ts` — App Router·SEO·폰트·검증 전용 API
- `src/app/sitemap.ts` — App Router·SEO·폰트·검증 전용 API
- `src/components/cta/MessengerCta.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/cta/QuoteStartLink.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/Ambassador.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/DoctorOkRules.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/Hero.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/JourneyPlanner.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/LocalBlock.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/Organizations.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/ProblemSteps.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/RecordCards.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/RecoveryWeek.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/TemplateList.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/home/TrustReceipt.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/layout/LanguageSwitcher.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/layout/MessengerBar.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/layout/PreviewBand.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/layout/SiteFooter.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/layout/SiteHeader.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/components/quote/QuoteForm.tsx` — 계획의 홈·공통 틀·CTA·견적 UI
- `src/config/site.ts` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `src/content/en.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/id.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/index.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/ja.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/ko.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/mn.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/shared/messengers.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/shared/planner-data.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/shared/records.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/content/types.ts` — 타입 사전 또는 언어 무관 플래너·메신저·기록 데이터
- `src/lib/i18n/langs.ts` — 언어 협상·launch·플래너·견적·SEO 순수 함수
- `src/lib/i18n/negotiate.ts` — 언어 협상·launch·플래너·견적·SEO 순수 함수
- `src/lib/launch.ts` — 언어 협상·launch·플래너·견적·SEO 순수 함수
- `src/lib/planner/build-plan.ts` — 언어 협상·launch·플래너·견적·SEO 순수 함수
- `src/lib/quote/schema.ts` — 언어 협상·launch·플래너·견적·SEO 순수 함수
- `src/lib/seo.ts` — 언어 협상·launch·플래너·견적·SEO 순수 함수
- `src/proxy.ts` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `src/styles/globals.css` — 시안 A 토큰과 현지화·반응형·접근성 스타일
- `src/styles/tokens.css` — 시안 A 토큰과 현지화·반응형·접근성 스타일
- `src/types/next.d.ts` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `tests/dictionary.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/fixtures/localization.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/guards.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/launch.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/negotiate.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/planner.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/proxy.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/quote-route.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/quote-schema.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tests/seo.test.ts` — Acceptance 단위 검증 또는 현지화 fixture
- `tsconfig.json` — Next·TypeScript·ESLint·Vitest·프로젝트 설정
- `vitest.config.ts` — Next·TypeScript·ESLint·Vitest·프로젝트 설정

## 검증 결과
모든 최종 검증은 2026-10-06, Node v22.23.1, 로컬 production `http://localhost:3000`, 라이트 테마·로그인 없음으로 실행했다.

| 명령 / 검사 | 결과 | 로그 / 증적 |
|---|---|---|
| npm install | 성공, lockfile 커밋 | evidence/dev-install.log |
| npm run lint | 오류·경고 0 | evidence/dev-lint.log |
| npx tsc --noEmit | baseline 0 → 0, 신규 0 | evidence/dev-typecheck.log (빈 출력) |
| npm test | 9 files / 73 tests PASS | evidence/dev-test.log |
| npm run build | Next 16.3.8 production 성공 | evidence/dev-build.log |
| 생성 파일 없는 소스 복사본에서 lint → tsc → test → build | 모두 PASS. `.qa-tmp/fresh`에 `.next`·next-env.d.ts 없이 시작했고 node_modules만 기존 설치 디렉터리를 심링크했다(실제 git clone은 실행하지 않음). 최신 public 이미지 경로 포함 | evidence/dev-fresh-{lint,typecheck,test,build}.log |
| git fetch origin → git rebase origin/main → npm test | 최신 base, 전체 73 tests PASS | evidence/dev-prepush-test.log |
| 기존 CI / required_checks | workflow 없음, profile required_checks=[]; 추가 CI 실행 없음 | profile, 추적 파일 확인 |
| agent-browser 로컬 smoke | 본문 6439자, overlay false, Schibsted Grotesk 적용 | evidence/dev-browser-smoke.log |
| Playwright 일회용 실기 | A2–A7 PASS, 18개 폭 측정, pageErrors=0 | evidence/dev-browser.log, dev-browser.json, dev-browser.cjs |
| Lighthouse 13.5.0 mobile /en (최종 production, 1회 값) | Performance 96, Accessibility 100, Best Practices 100, SEO 100 | evidence/lighthouse-en-mobile.report.json / .html, dev-lighthouse.log |
| HTTP curl assertions | A1·A6·A8 PASS | evidence/dev-http.log, dev-check-http.py |
| A4·A9 spec 원문 명령 | 전부 0건, draft diff 빈 출력 | evidence/dev-guards.log |
| npm audit --omit=dev | 취약점 0 | evidence/dev-audit-production.json |
| npm audit | 개발 도구 전이 의존성 high 5건(braces → micromatch → fast-glob → ESLint 체인). 지정 Next/ESLint 버전 유지, 강제 다운그레이드 미실행 | evidence/dev-audit.json |
| git diff --check | 오류 0 | 로컬 실행 |

실기 재현: 저장한 `evidence/dev-browser.cjs`는 워크스페이스 루트에서 실행하는 일회용 스크립트다. `npm install --prefix .qa-tmp --no-package-lock playwright@1.63.0` 후 `.qa-tmp/browser.cjs`로 복사해 `node .qa-tmp/browser.cjs`를 실행한다. Chrome 실행파일은 `/Applications/Google Chrome.app/Contents/MacOS/Google Chrome`, production 서버는 `npm start -- -p 3000`. `.qa-tmp/`는 커밋 제외다. 원래 실행한 마지막 완료 화면은 보조 `dev-capture.cjs`로 카드 전체가 보이게 다시 촬영했다.

## Acceptance 매핑
- A1: proxy `matcher:['/']`, q 값·지역 태그 협상, Vary. 9종 헤더 307, 홈 5개 + 견적 5개 200 및 html lang, `/hi /ru /vi /zh /es /th` 404. negotiate/proxy 단위 + dev-http.log.
- A2: buildPlan 순수 함수, 5진료·5/7/10일·1/2/3인 네이티브 라디오. 진료마다 제목·활동·가격 변경, 일수는 골격만, 인원은 부제·D-1 Stay만 변경을 단위 테스트로 확인. 1440×900과 390×844에서 implants7/2 → screening7/2 → screening5/2 → screening5/3를 Tab·화살표·Space로 실측. 초기 `₩2.4M–3.2M` → 검진 `₩0.5M–1.5M`, 일차 5개→5개이며 5일 골격 `[D-1,D0,D1–2,D3,D4]`. URL 유지. 10일 LASIK 6일차 행 및 women5/3도 확인. evidence/dev-A2-*.png, dev-browser.json.
- A3: fixture H1·우선 진료 id 순서·메신저를 5언어 단언. 언어별 상단 띠, 메신저 href 0개, preview 본문 회신시간 표현 0건. desktop/mobile 각 5장: evidence/dev-A3-{en,ja,id,mn,ko}-{hero-bar,mobile-bar}.png. 언어 전환기 5링크 + 6비활성 항목, Esc/바깥 클릭/focusout 닫힘, `/en/quote`→`/ja/quote` 유지 확인. CTA 2컴포넌트 소유 및 템플릿→quote interest 연결 guards 단언. preview/live 함수 양모드 단위 PASS.
- A4: en/ja 영수증 합계 DOM 텍스트 `₩0`; provider/doctor Sample 배지 4개. en/en quote/mn footer 등록번호 샘플 2개씩 실측. evidence/dev-A4-*.png. 수수료·배분 금지어 검사 0건.
- A5: Doctor OK 5행, 회복 표 4행(진짜 table), 문제 절차 4단계, 템플릿 6, 환원 선택 4, 기관 4종. 앰버서더 화살표로 선택 이동 및 금액/통화 없음 확인. evidence/dev-A5-en-full.png, dev-A5-{doctor-rules,recovery,problem,templates,ambassador,ambassador-keyboard,organizations}.png, dev-A5-ja-recovery.png, dev-A5-ja-recovery-mobile.png, dev-A5-mn-ambassador.png. 샘플 provider/doctor 등록값은 실데이터 주장으로 표시하지 않음.
- A6: ja 390×844에서 Q1–Q12 통과. 유효/무효 interest 사전선택, 필수값 차단·첫 오류 포커스, optional 필드, 이전 단계 값 유지, email invalid, 실제 POST 200 `{"ok":true}`, 422 필드 오류→2단계 복귀(브라우저 응답 가로채기), offline 네트워크 오류 복구. 완료 카드에서 폼 제거·저장/회신 없음 문구. evidence/dev-A6-Q2-required.png, dev-A6-Q8-contact-privacy.png, dev-A6-Q12-network.png, dev-A6-Q10-complete.png. curl 유효 200/무효 422. route 단위에서 console 5종·외부 fetch 호출 0회. 서버 코드는 본문 저장·로그·외부 전송 없음.
- A7: `/en`, `/mn`, `/en/quote` × 390/768/1440px × 전환기 closed/open = 18회, 모두 scrollWidth=innerWidth (아래 표). 1440×900 Tab으로 skip→logo→nav4→summary→chip 모두 3px solid 포커스. 바·앰버서더 포커스 캡처 포함. reduce에서 seal animationName=`none`, chip transitionDuration=`0s`, html scrollBehavior=`auto`. evidence/dev-A7-*.png, dev-browser.json. Lighthouse 96/100/100/100.
- A8: 홈·견적별 title/description, canonical, 5언어 alternate + x-default(en 경로), OG local 200, sitemap loc 10개 및 robots 확인. seo 단위 + dev-http.log.
- A9: 아래 spec 명령 그대로 실행하여 0건. draft 변경 없음. 기획서 텍스트·내부 수치 복사 없음.
- A10: 로컬 lint/typecheck/test/build 및 PR 생성 완료. main 머지·Vercel production·배포 SHA 동일성 검증은 **실행하지 않음 — Releaser 담당**.

| 경로 | 390 닫힘/열림 | 768 닫힘/열림 | 1440 닫힘/열림 |
|---|---|---|---|
| /en | 390/390, 390/390 | 768/768, 768/768 | 1440/1440, 1440/1440 |
| /mn | 390/390, 390/390 | 768/768, 768/768 | 1440/1440, 1440/1440 |
| /en/quote | 390/390, 390/390 | 768/768, 768/768 | 1440/1440, 1440/1440 |
수치는 scrollWidth/innerWidth다.

### A4·A9 명령 원문 및 실제 결과
```text
$ rg -n -w -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '수수료율' -e 'commission rate' -e 'referral rate' src/content
exit: 1
stdout: (empty)
stderr: (empty)

$ rg -n -i -w -e best -e guarantee -e guaranteed -e 'No\.1' -e 'half the cost' -e 'before and after' -e cheapest src
exit: 1
stdout: (empty)
stderr: (empty)

$ rg -n -e 최고 -e 보장 -e 줄기세포 -e 전후 -e 保証 -e 最高 -e 'stem cell' src
exit: 1
stdout: (empty)
stderr: (empty)

$ rg -n -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e 'CPL' -e '[내부수치]' src README.md
exit: 1
stdout: (empty)
stderr: (empty)

$ git diff origin/main -- design/drafts
exit: 0
stdout: (empty)
stderr: (empty)
```

## 사람 게이트 해당
- ★ human_gate_paths 변경 없음. `.github/**`·`.claude/rules/**` 미접촉. `design/drafts/**` diff 빈 출력. DB·마이그레이션 없음.

## G2 리뷰 5건 처리
1. 모바일 ≤860px nav 숨김 유지, A7 포커스 1440×900 실측.
2. implants→dental, lasik→eye, screening→screening, womens-health→womens-health, fertility→fertility. 템플릿 여성 웰니스→womens-health·가족 검진→screening. 히어로·템플릿이 공용 QuoteStartLink 사용.
3. 플래너 footer에 언어별 feeLabel + 상수 ₩0.
4. 보험 보유 문구 미삽입.
5. metadata x-default 타입 및 production curl 렌더 확인.

## 계획 대비 조정 / 발견한 실패와 처리
- 이미지 저장 경로: 계획 src/assets/img 대신 **디스패치 우선 지시대로 public/img/**. 정적 import와 next/image 최적화는 유지. 계획 §4 외 public 파일 3개가 이 이유로 추가됨.
- WhatsApp 색: 계획 #128C4A는 Lighthouse에서 흰 작은 글자 대비 4.3:1로 지적. #118447로 약간 어둡게 조정하여 최종 contrast PASS. 메신저 정체성 유지.
- next/font CSS 변수는 body에 공급되므로 root에서 참조한 family가 처음 기본 serif로 렌더됨. body에서 가족을 재정의해 Schibsted Grotesk 실측 완료. native radio span wrapper로 칩 줄 간격이 겹친 곳은 wrapper flex·label block으로 수정.
- mobile 회전 인장: 390px에서 scrollWidth 395px 실측. right를 24px로 옮긴 후 390px PASS. 가로 overflow 숨김으로 가리지 않음.
- favicon 404가 초기 Lighthouse Best Practices에 찍혀 metadata data SVG 아이콘을 추가. 최종 console audit 오류 없음.
- 최초 tsc는 BadgeRule union narrowing의 day 접근 오류 1건. kind별 분리 union으로 수정하여 baseline 0 유지.
- 최초 guards 테스트는 한 줄 JSX의 templates.cta 속성을 class 토큰으로 오탐. className 값에만 검사하도록 정규식 수정. 금지 규칙을 완화하지 않음.
- 브라우저 스크립트 최초 오류: Next route-announcer role=alert가 폼 오류 카운트에 포함돼 스코프를 quote-card로 한정. requestAnimationFrame 포커스 반영 전에 검사하던 것은 waitForFunction으로 대기. 최종 Q1–Q12 모두 PASS.
- push 최초 2회 github.com DNS 조회 실패, api.github.com 인증 API는 접근됨. 시스템 DNS 조회가 정상 복구된 뒤 기존 HTTPS remote 그대로 재시도하여 성공. trust/TLS/인증 우회 없음.

## 알려진 한계 / 후속
- 번역은 개발자 초안. README에 원어민 검수 필요 명시. 임상 규칙·가격·등록 샘플의 실데이터 검수는 후속.
- 실제 메신저·회원가입·추천 코드·파트너 문의·PDF·리드 저장·회신은 비목표. live 모드로 바꿔도 현재 quote API는 검증 전용이며 README에 별도 intake 구현 필요를 명시.
- Next 16.3.8의 dynamicParams=false 목록 밖 URL은 올바른 global 404 본문 및 HTTP 404를 반환하면서 서버에 `Internal: NoFallbackError` 스택을 출력한다. 이 현상은 dev-server.log에 그대로 남겼다. body 로그와 무관. proxy 수동404 폴백은 적용하지 않음(외부 동작은 정상).
- 개발 의존성 audit high 5건은 pinned ESLint 체인의 braces 관련. 당시 npm view braces latest=3.0.3이고 advisory 범위 <=3.0.3라 같은 체인의 호환 패치가 없음. production 의존성 0건. 강제 버전 교체는 하지 않음.
- profile required_checks=[]이고 workflow는 없음. GitHub/Vercel 자동 체크와 공개 production 상태는 다음 역할이 검증한다.
- QA용 로컬 production 서버를 포트 3000에 유지(PID 10175, session 96248). agent-browser 소유 headless 세션은 close 완료, Playwright는 성공 경로에서 browser.close 완료. 컨테이너/VM 생성 없음.

## 교훈 후보
- next/font variable이 정의된 DOM 레벨에서 CSS family를 해석해야 한다. 빌드 green만으로 폰트 실제 적용을 확인할 수 없다.
- 회전 transform의 실측 경계가 원래 CSS 크기보다 넓어질 수 있다. 인장처럼 음수 offset을 가진 요소는 mobile에서 scrollWidth를 확인해야 한다.
- browser role=alert 전체 카운트는 프레임워크 live announcer를 포함할 수 있다. UI 상태 전이 검증은 해당 폼 컨테이너를 범위로 한다.

## 사용량
- model: unknown / effort: unknown
- input tokens: unknown
- cached input tokens: unknown
- output tokens: unknown
- credits: unknown
- 출처: 이 API 실행 표면에 /status 또는 실제 모델·사용량 계측값이 노출되지 않음. CODEX_MODEL·OPENAI_MODEL·CODEX_REASONING_EFFORT도 설정되지 않음. roster 설정을 실제 사용량으로 추정하지 않음.

## r2 — Minor 처리
- 근거: dispatch-developer-r2.md / note-developer-g3-r2.md. Reviewer r4 APPROVE 92/100, QA r1 PASS 9/9 이후 지정 Minor 2건만 수정.
- PR #1 그대로: https://github.com/holmesLee-ws/kaniq-homepage/pull/1
- 새 head SHA: `e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf`. 로컬 HEAD·원격 branch·GitHub PR head 일치 확인(`evidence/dev-r2-pr.json`). 같은 `feat/kaniq-homepage`에 추가 커밋을 push했다. 새 PR·머지·배포 없음.
- 제품 변경 파일은 정확히 `src/lib/i18n/negotiate.ts`, `tests/negotiate.test.ts`, `tests/guards.test.ts` 3개(4 insertions / 2 deletions). 그 외 제품 파일 변경 없음.

### Minor 1 — 언어 태그 공백
- 태그 토큰을 `tag.trim()`으로 정규화. 품질값 처리·정렬·fallback은 그대로 유지.
- 테스트 2개 추가: `ja ;q=0.9` → ja, `ko ; q=0.5, en;q=0.4` → ko.
- 수정 전 red: negotiate 20 tests 중 2 FAIL / 18 PASS, 두 신규 케이스가 en을 반환. 로그 `evidence/dev-r2-negotiate-red.log` (exit 1).
- 수정 후 green: negotiate 20/20 PASS. `evidence/dev-r2-negotiate-green.log` (exit 0).
- 새 production 빌드에서 curl 실측: `Accept-Language: ja ;q=0.9` → HTTP 307, location `/ja`; `ko ; q=0.5, en;q=0.4` → HTTP 307, location `/ko`. 두 응답 모두 Vary: Accept-Language. `evidence/dev-r2-curl-ja.log`, `dev-r2-curl-ko.log`.

### Minor 2 — CTA 리터럴 표현식 가드
- className 직접 문자열·템플릿 검사에 중괄호 안의 double/single quoted 문자열 리터럴 표현식을 추가하고 공백을 허용. 기존 직접 문자열/템플릿 분기도 유지.
- 실제 SiteFooter className을 `className={"cta"}`로 잠시 변이 → guards FAIL, exit 1.
- `className={'cta cta--rogue'}` 변이 → guards FAIL, exit 1.
- finally에서 SiteFooter 원문을 byte-for-byte 복구 → guards PASS, exit 0. SiteFooter는 최종 git diff/커밋에 없음.
- 증적: `evidence/dev-r2-guards-mutation.log`, 재현 스크립트 `evidence/dev-r2-mutation.py`. 스크립트는 원복 finally를 포함하며 제품 커밋에 넣지 않았다.

### r2 검증
| 명령 | 결과 | 증적 |
|---|---|---|
| npm run lint | 오류·경고 0, exit 0 | evidence/dev-r2-lint.log |
| npx tsc --noEmit | baseline 0 → 0, exit 0 | evidence/dev-r2-typecheck.log (빈 출력) |
| npm test 전체 | 9 files / 75 tests PASS | evidence/dev-r2-test.log |
| npm run build | production 성공, exit 0 | evidence/dev-r2-build.log |
| git fetch origin → git rebase origin/main → npm test 전체 | 최신 base, 75 tests PASS | evidence/dev-r2-prepush-test.log |
| production curl 새 헤더 2종 | 307 /ja, 307 /ko | evidence/dev-r2-curl-{ja,ko}.log |
| production browser /ja smoke | lang ja, 해당 H1, overlay false; 종료 완료 | evidence/dev-r2-browser-smoke.log |
| git diff --check | 오류 0 | 로컬 실행 |
| push / PR head 확인 | 추가 커밋 push 성공, head SHA 일치 | evidence/dev-r2-push.log, dev-r2-pr.json |

PR 설명의 테스트 수(75)와 두 보강 검증 내용을 현재 결과에 맞췄다(`evidence/dev-r2-pr-edit.log`). 기존 UI·콘텐츠·API 동작 변경이 없어 Lighthouse 및 홈 전 섹션 실기는 r2에서 반복하지 않았다. r1 Developer 및 독립 QA 증적을 유지한다.

- 사람 게이트 / protected_paths 변경 없음. 병합·배포·원장 쓰기 미실행.
- QA용 production :3000 서버는 새 r2 빌드로 교체해 유지(PID 35446, session 44256). 이전 r1 PID 10175는 종료했다. 브라우저 headless 세션은 close 완료.
- r2 사용량: model / effort / input tokens / cached input tokens / output tokens / credits 모두 unknown. 실행 표면에 실제 계측값이 노출되지 않아 추정하지 않음.

## r3 — G4 fix-forward

- 근거: dispatch-developer-r3.md / note-developer-g4-fix.md. 지정된 ja H1 고아 줄바꿈·favicon 404 두 건만 처리.
- origin/main `edd3834fc6766466506c50453092a0967581af19`에서 신규 브랜치 `fix/ja-h1-favicon` 생성. push 직전 fetch·rebase 완료(최신 base).
- 신규 PR #2: https://github.com/holmesLee-ws/kaniq-homepage/pull/2 (base main, OPEN).
- head SHA: `f8904be49e076eff3ec247f01a56db8079af88f4`. 로컬 HEAD·원격 branch·PR head 일치 확인. 증적: evidence/dev-r3-pr.json, dev-r3-push.log, dev-r3-pr-create.log.
- 제품 변경 파일 정확히 3개: `src/styles/globals.css`, `src/lib/seo.ts`, `src/app/favicon.ico`. 13 insertions / 3 deletions + 새 binary. 사전·H1 문구·fixture는 변경하지 않음.

### H1 수정 및 실측

기존 일본어 구절 span에 nowrap을 적용하고 일본어 H1 font-size를 35.2–48px 범위로 조정했다. 1440에서도 「精密検診も歯科も、」가 한 줄로 유지된다. 한국어 H1과 span은 keep-all / overflow-wrap normal로 어절 중간 끊김을 방지했다. A3 원문 fixture 단언은 그대로 전체 테스트에서 PASS.

| 언어 | 폭 | 실측 H1 줄 ( / 는 줄 구분) | scrollWidth / innerWidth | 스크린샷 |
|---|---:|---|---|---|
| ja | 390 | ソウルまで2時間。 / 精密検診も歯科も、 / 週末で。 | 390 / 390 | evidence/dev-fix-A3-ja-390.png |
| ja | 768 | ソウルまで2時間。 / 精密検診も歯科も、 / 週末で。 | 768 / 768 | evidence/dev-fix-A3-ja-768.png |
| ja | 1440 | ソウルまで2時間。 / 精密検診も歯科も、 / 週末で。 | 1440 / 1440 | evidence/dev-fix-A3-ja-1440.png |
| ko | 390 | 동포와 유학생의 검진부터 / 기관 제휴까지, 한국어로. | 390 / 390 | evidence/dev-fix-A3-ko-390.png |
| ko | 768 | 동포와 유학생의 검진부터 기관 제휴까지, / 한국어로. | 768 / 768 | evidence/dev-fix-A3-ko-768.png |
| ko | 1440 | 동포와 유학생의 / 검진부터 기관 / 제휴까지, 한국어로. | 1440 / 1440 | evidence/dev-fix-A3-ko-1440.png |

DOM Range로 문자별 실제 좌표를 모아 줄 텍스트를 측정했다. 6개 화면 모두 H1 텍스트가 컨테이너 안에 있고 scrollWidth=innerWidth. 한국어 모든 어절은 각각 1줄에만 존재한다. 6개 스크린샷을 시각 확인했고 겹침·고아 구절이 없다. 브라우저 page errors 0. 실측 JSON/log: evidence/dev-r3-h1.json, dev-r3-h1.log. 재현 스크립트: evidence/dev-r3-h1.cjs.

### favicon

설치된 Next 공식 문서 `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md`의 root app favicon.ico 규약을 확인했다. 기존 data SVG와 같은 celadon/pine 물방울을 32×32 PNG-in-ICO로 만들어 `src/app/favicon.ico`에 저장하고 중복 metadata를 제거했다. 생성 스크립트: evidence/dev-favicon.mjs (기존 설치 sharp 사용, 의존성 추가 없음).

production curl: `/favicon.ico` HTTP 200 OK, Content-Type image/x-icon (evidence/dev-r3-favicon.log). 6개 페이지의 rel=icon은 각각 1개이며 `/favicon.ico?favicon.1h34ys-3ex26n.ico`로 자동 생성된다. 쿼리는 Next 파일 metadata 출력이며 pathname이 /favicon.ico임을 확인했다. data SVG 충돌 없음.

### r3 검증

| 명령 / 검증 | 결과 | 증적 |
|---|---|---|
| npm run lint | exit 0, 오류·경고 0 | evidence/dev-r3-lint.log |
| npx tsc --noEmit | exit 0, baseline 0 → 0 | evidence/dev-r3-typecheck.log |
| npm test 전체 | 9 files / 75 tests PASS | evidence/dev-r3-test.log |
| npm run build | production 성공, exit 0 | evidence/dev-r3-build.log |
| fetch → rebase origin/main → npm test | 최신 base, 75 tests PASS | evidence/dev-r3-prepush-test.log |
| npm start / production browser | :3000 정상, ja H1·lang 확인, overlay false | evidence/dev-r3-server.log, dev-r3-browser-smoke.log |
| ja·ko × 390·768·1440 | 구절/어절 보존, 가로 넘침 없음, page errors 0 | evidence/dev-r3-h1.json 및 여섯 PNG |
| curl -sI /favicon.ico | HTTP 200, image/x-icon | evidence/dev-r3-favicon.log |
| git diff --check | 오류 0 | 로컬 실행 |
| push / PR head | 성공, 동일 SHA 확인 | evidence/dev-r3-push.log, dev-r3-pr.json |

- QA용 production :3000 서버는 r3 빌드로 유지(PID 4258, session 52829). agent-browser kaniq-dev와 Playwright headless 브라우저는 close 완료.
- `.loop/`, `.lessons/`, protected_paths는 제품 커밋에 없음. 병합·배포·원장 변경 미실행.
- r3 사용량: model / effort / input tokens / cached input tokens / output tokens / credits 모두 unknown. 실제 계측값이 노출되지 않아 추정하지 않음.

## r4 — G5 보안 fix

- 지시: dispatch-developer-r4.md, G5 감사 Minor 4. 공개 테스트의 내부 KPI 수치 토큰 직접 나열을 제거.
- base: origin/main `91cdbf55979d834773adb05cad07ebdf9ed34c97`. 신규 branch: `fix/remove-internal-figures`.
- PR #3: https://github.com/holmesLee-ws/kaniq-homepage/pull/3 (base main, OPEN).
- head SHA: `91cdf7a4fcb681e6acf90fa8debe1781c4ecc53a`. 로컬 HEAD·원격 branch·PR head 일치 확인. 증적: evidence/dev-r4-pr.json, dev-r4-push.log, dev-r4-pr-create.log.
- 변경 파일: `tests/guards.test.ts`만 수정, 삭제 4줄. 내부 KPI 수치 토큰을 직접 나열하는 src·README 단언 두 개를 삭제. 콘텐츠 사전의 퍼센트·요율 금지, CTA·preview·의료 문구 일반 가드 유지. 우회 인코딩·해시 도입 없음.

### 검증

| 명령 / 검증 | 결과 | 증적 |
|---|---|---|
| npm run lint | exit 0, 오류·경고 없음 | evidence/dev-r4-lint.log |
| npx tsc --noEmit | exit 0, baseline 0 → 0 | evidence/dev-r4-typecheck.log |
| npm test 전체 | exit 0, 9 files / 75 tests PASS | evidence/dev-r4-test.log |
| npm run build | exit 0, production 빌드 성공 | evidence/dev-r4-build.log |
| commit → fetch → rebase origin/main → npm test 전체 | 최신 base, exit 0, 75 tests PASS | evidence/dev-r4-prepush-test.log |
| git diff origin/main --check | exit 0 | 로컬 실행 |
| PR·원격 head 및 변경 파일 조회 | 동일 head, 지정 파일 한 개 | evidence/dev-r4-pr.json |

- 메모리 압력 실측: 2. 모든 검증 순차 실행. lint·test는 NODE_OPTIONS=--max-old-space-size=3072, typecheck·build는 6144. OOM 없음, 재시도 없음.
- required_checks 없음. 추적 `.github/workflows` 없음, 별도 CI 스크립트 없음.

### git grep 결과와 판정 한계

- 지시문의 전체 검색을 그대로 실행: 텍스트 일치 0건, 보호된 PNG 원본 3개에 바이너리 일치. 전체 명령이 0건이라고 보고하지 않음. 원문 출력: evidence/dev-r4-grep.log.
- 같은 패턴의 git grep -I 검색: 추적 텍스트 파일 전체 0건 (exit 1). 증적: evidence/dev-r4-grep-text.log (일치가 없어 빈 파일).
- git grep -F도 동일한 PNG 바이너리 일치. PNG 청크를 분석하면 각 파일의 일치 1건은 압축 IDAT 데이터 안에 있음. 공개 문구·테스트 리터럴 노출과 별개인 바이너리 일치이며, 보호 원본은 변경하지 않음. 증적: evidence/dev-r4-grep-fixed.log, dev-r4-binary-analysis.log.
- 해당 원본: `design/drafts/img/src/a-hanok-tea.png`, `b-documents.png`, `c-family-palace.png`.
- 오케스트레이터 후속: 전체 검색의 문자 그대로 0건을 게이트 요건으로 유지한다면 protected_paths 규칙과 충돌하므로 바이너리 제외 판정을 기록하거나 별도 지시 필요. 테스트 수정과 PR 생성은 완료.

### Acceptance / 경계

- A9 / G5 Minor 4: 공개 가드 테스트의 내부 KPI 수치 토큰 리터럴 제거 완료. 추적 텍스트 전체 0건 확인.
- UI·제품 콘텐츠 변경 없음. 이번 테스트 수정에 새 브라우저 판정 항목은 없어 실기 재실행하지 않음. 기존 실기 증적 유지.
- human_gate_paths 변경 없음. protected_paths diff 없음. `.loop/`·`.lessons/`는 제품 커밋에 포함하지 않음.
- 머지·배포·원장 쓰기 실행하지 않음 — developer 역할 경계 및 명시 지시.

### r4 사용량

- model: unknown / effort: unknown
- input tokens: unknown
- cached input tokens: unknown
- output tokens: unknown
- credits: unknown
- 출처: 현재 API 실행 표면에 실제 모델 id·effort·누적 사용량 계측값이 노출되지 않아 읽을 수 없음. 추정하지 않음.

STATUS: done [r4]
