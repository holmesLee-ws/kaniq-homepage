# Dev — 20261006-kaniq-immersive (round 1)

## 브랜치 / PR
- branch: `feat/immersive-motion` (기준 `origin/main` `7379aa5`)
- PR: https://github.com/holmesLee-ws/kaniq-homepage/pull/5 — `main` 대상, OPEN
- head: `5f5fd82f89807e10c100bc460e008996bd259d2d` (push 후 `gh pr view`로 원격 head 확인)
- 제품 커밋에 `.loop/`, `.lessons/`, 일회용 스크립트 없음. `.gitignore`의 `.lessons/` 줄만 제거했다. 머지·배포는 실행하지 않음(역할 밖).

## 변경 파일 (경로 — 한 줄)
- `.gitignore` — 교훈 무시 규칙 해제, 파일 커밋 제외.
- `src/styles/globals.css`, `src/styles/tokens.css` — 이미지 높이, 진료찾기 배치, 모션·축소 모드·헤더·진행선·포커스.
- `src/app/[lang]/layout.tsx`, `src/app/[lang]/page.tsx` — MotionRuntime, RecoveryExplorer 연결.
- `src/components/motion/MotionRuntime.tsx` — 진입 1회 IO, passive scroll + rAF 1회/프레임, 읽기 뒤 쓰기, 헤더 히스테리시스.
- `src/lib/motion/progress.ts`, `src/lib/motion/presence.ts`, `src/lib/recovery/recovery-day.ts` — 순수 진행값·출입 병합·회복 매핑과 출입 보존 훅.
- `src/lib/planner/build-plan.ts` — 일차의 안정된 slot 키.
- `src/components/layout/SiteHeader.tsx` — 전폭 sticky, 흐름 보존 축소, 읽기 진행 막대.
- `src/components/layout/LanguageSwitcher.tsx` — Lighthouse 접근성 이름에 표시 언어 포함(계획 목록 밖 최소 회귀 수정, 아래 설명).
- `src/components/home/Hero.tsx`, `JourneyPlanner.tsx` — 로드 시퀀스, intro 단일 소유, 행·라벨·항목 출입, 가격 변경 시 전환.
- `src/components/home/LocalBlock.tsx` — 단일 고해상도 이미지, 패널 우선 배치, 시차·칩 순차.
- `src/components/home/RecoveryExplorer.tsx`, `DoctorOkRules.tsx`, `RecoveryWeek.tsx` — D0~D6 네이티브 range, 표 연결, 가능한 활동·회복 단계 강조.
- `src/components/home/TrustReceipt.tsx`, `RecordCards.tsx`, `RecordFlip.tsx`, `ProblemSteps.tsx` — 영수증 순차 인쇄·날인, 접근 가능한 토글 카드, 스크롤 단계선.
- `src/components/home/TemplateList.tsx`, `src/components/cta/QuoteStartLink.tsx`, `src/content/shared/template-plans.ts` — 서버 미니 일정, hover/focus 펼침, 링크 설명.
- `src/components/home/Ambassador.tsx` — 환원처 선택 상태, 미리보기 전환, 점의 순차 채움.
- `src/components/quote/QuoteForm.tsx` — 단계 출입·방향·진행 막대·완료 인장. 검증/422/저장 없음 로직 유지.
- `src/content/types.ts`, `src/content/{ko,en,ja,id,mn}.ts` — 5개 언어 신규 인터랙션 키.
- `tests/{presence,motion-progress,recovery-day,template-plans}.test.ts` — 신규 순수 함수/데이터 검증.
- `tests/{planner,dictionary}.test.ts` — 기존 단언 유지, slot·신규 사전 키 단언 추가.

## 검증 결과
모든 경로는 `.loop/20261006-kaniq-immersive/` 기준. 로컬 production `http://localhost:3102`, 계정 없음, 시스템 Chrome headless + `/tmp/leh-qa-tools` Playwright. B1 및 대부분 실측 DPR 2. 계획 §6.2의 instant 스크롤·rAF·결정적 애니메이션 프레임 방식 사용.

- `NODE_OPTIONS=--max-old-space-size=3072 npm run lint` → 오류 0, 경고 0 → `evidence/dev-lint.log`.
- `NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit` → baseline 0 → 0 (신규 0) → `evidence/dev-typecheck.log`.
- `NODE_OPTIONS=--max-old-space-size=6144 npm run build` → 성공 → `evidence/dev-build.log`.
- `git fetch origin && git rebase origin/main` → up to date. 그 뒤 `NODE_OPTIONS=--max-old-space-size=3072 npm test` → 13파일·126건 PASS (기존 75건 포함) → `evidence/dev-test-final.log`.
- `.github/workflows` 없음, profile required_checks 없음. 추가 CI 스크립트 없음.
- 메모리 압력 전후 1. build/tsc는 각각 순차 실행; Lighthouse 3회 순차. OOM 없음, 힙 재시도·profile 갱신 필요 없음.
- 페이지 본문·키 컨트롤 표시, 오류 overlay 없음, browser pageerror 0 → `evidence/dev-browser-errors.json`, `dev-browser-interaction-errors.json`.
- 브라우저 재현 스크립트(커밋 금지): `.qa-tmp/browser.cjs`, `interactions.cjs`, `interactions-last.cjs`, `global-final.cjs`, `quote-reduce.cjs`, `supplement.cjs`, `final-keyboard.cjs`. `node <경로>`로 실행. 전체 결과는 아래 항목별 JSON/PNG가 정본이다.

## Acceptance 매핑

### B1 — 진료찾기 PASS
`evidence/dev-B1-measurements.json`, `dev-B1-{ko,en}-{1860,1440,768,390}-{no-preference,reduce}.png` 16장, `dev-B1-en-{1440,390}-*-final.png`.

- 실제 `currentSrc`는 `w=1920`, natural 1280×1600. getImageProps 설계대로 단일 src가 나와 이미지 폴백 불필요.
- 1860/1440 사진 rect 563.20×704px, 필요 해상도 1126.40×1408 ≤ natural. 모바일 최대 rect 563.20×422.40, 390은 385×288.75. 높이/폭 desktop 1.25, mobile 0.75로 상한 1.3 이하.
- 섹션 높이(px):

| 언어 | 1860×920 | 1440×900 | 768×1024 | 390×844 |
|---|---:|---:|---:|---:|
| ko | 763.8 | 767.5 | 907.8 | 753.0 |
| en | 763.8 | 767.5 | 905.0 | 861.8 |

두 모드에서 같고 뷰포트 ×1.4 이하. 모든 폭에서 h2·칩 in-viewport, desktop 특화 문단·메신저 in-viewport, mobile 패널 전체가 사진 위.
- 사진 translateY 변화 일반 1860 약 50.91px / 1440 51.2px / 768 30.72px / 390 21px. reduce 0px.
- 칩 delay 0/90/180/270ms 순차(해당 언어 칩 수만큼), 마지막 종료 ≤590ms, reduce 애니메이션 없음.

### B2 — 로드 시퀀스 PASS
`evidence/dev-B2.json`, `dev-B2-{0,400,1200}.png`, `dev-B2-nojs.json|png`, `dev-B7-static.json`.
- headline 시작 0ms, 카드 240ms, 일차 480ms 이후. 관측한 전체 hero endTime 최댓값 1100ms.
- 일정선 scaleY 0ms=0 / 400ms=0 / 1200ms=1. top/bottom 각각 8px.
- JS 비활성 1300ms 뒤 h1·모든 day opacity 1, 카드 두 면 표시. 초기 curl HTML에 헤드라인·일정·data-intro 존재.
- reduce 초기 document animations 0, 일정선 transform none(완료 길이). mobile 520 이하 선 없음 유지. CLS 0(B8).

### B3 — 플래너 전환 PASS
`evidence/dev-B3.json`, `dev-B3-keyboard.json|png`, `dev-B3-*.png`.
- 진료·7→10일·10→5일·인원·다른 진료 전환을 입력 후 약 81~84ms에 관측: 서로 다른 enter/exit 요소가 모두 running. enter delay 60ms, exit delay 0ms. intro 속성 제거 확인.
- 진료 변경 때만 가격 running, 일수·인원 변경 때 가격 문자열 동일 및 running 없음. 새 컨텍스트의 첫 입력이 일수인 경우 가격 애니메이션 0.
- 450ms에 running 0, exit 노드 0. 키보드 tx-screening 포커스 → ArrowRight로 womens-health 선택 및 동일 출입/가격 모션 확인.
- A2 기존 단위 단언 유지. presence 첫 항목 교체·단일 라벨 교체·재진입·순서 검사 PASS.

### B4 — 회복 스크러버 PASS
`evidence/dev-B4.json`, `dev-B4-{ko,en}-D{0,3,6}.png`, `dev-B7-static.json`, `dev-B7-scrub-D6.png`.
- 키보드 Home/→×3/End 값 0/3/6, 강조 열 D0/D3/D6, 강조 표 행 index 0/2/3.
- 가능한 활동 수 0/4/5, today 목록과 활동 이름 전수 일치. ko aria 각각 D0 — 진료 당일 / D3 — 회복과 문화 / D6 — 의료진 경과 확인 후. en도 사전 note와 일치.
- drag → D2, track click → D5 확인. 포커스 outline 3px.
- 5언어 × d0..6 및 clamp/round 순수 함수 PASS. reduce에서도 같은 상태·running 0.

### B5 — 섹션 인터랙션 PASS
- (a) `dev-B5a.json`, `dev-B5a-{700,1150,1800}.png`: 700ms 합계 opacity 0·인장 0, 1150ms 합계 1·인장 0, 1800ms 인장 .88. 나갔다 재진입 300ms 뒤 running 0, 1회 유지.
- (b) `dev-B5b.json`, `dev-B5b-front|back.png`: 클릭/Enter/Space에 pressed true/false/true, 숨은 면 inert·aria-hidden, 보이는 면만 AX 트리에 표시. 버튼 포커스 유지. 높이 262.203px 전후 변화 0. JS 없음 두 면 표시.
- (c) `dev-B5c.json`, `dev-B5c-*.png`: 1440·390 두 모드 모두 시작 0 → 중앙 약 .5002~.5004 → 통과 1 → 복귀 약 .5. reduce에서도 같은 비율.
- (d) `dev-B5d.json`, `dev-B5d-{hover,focus}-{1440,390}.png`: hover·키보드 focus 열림, 떠나면 닫힘, 다음 focus 항목만 열림. 목록 높이 1440 390.281px, 390 903.844px 전후 동일; 가로 넘침 0.
- (e) `dev-B5e.json`, `dev-B5e-before|after.png`: give-2 선택 시 Community fund로 내용 교체, 80ms에 strong running; 키보드 ArrowRight give-3 확인. 같은 행 점 지연 열별 +90ms, 행별 +40ms. 미리보기 inview 유지.

### B6 — 견적 PASS
`evidence/dev-B6.json`, `dev-B6-{no-preference,reduce}-{1,2,3,done}.png`.
- ja 실제 완주. 진행 비율 .333333/.666667/1. 단계 전환 81ms에 enter·leave 모두 running, leave inert. 400ms 후 leave 제거. 뒤로 전환 dir -1, 다시 앞으로 전환 확인.
- 완료 950ms 관측에 인장·circle·path 모두 finished. 사전 공개 안내 존재.
- 빈 첫 단계 → 오류 및 interest 포커스 확인. 기존 schema·route 검증 유지, curl API 422 확인. reduce에서도 완주, running 0.

### B7 — 모션 축소 PASS
`evidence/dev-B7.json`, `dev-B7-progress.json`, `dev-B7-static.json`, `dev-B7-*.png`.
- 로드, 플래너 3축, range Home/ArrowRight/End, 카드, 템플릿, 환원처, 견적 다음·완료, 헤더 조작 뒤 running 0.
- 동일 scrollY의 일반/reduce 문서 진행·4단계 진행 비율 오차 <.01. reduce care transform none, 칩·영수증 줄/합계 opacity 1, 인장 .88(설계 최종 상태).
- 카드 pressed 전환, 템플릿 열림, day/행 연결, 견적 완주 및 헤더 축소 모두 기능 유지. 언어 메뉴 열기·Esc·바깥 클릭 정상.

### B8 — 품질 PASS
`evidence/dev-B8-lh-{1,2,3}.json`, `dev-B8-lh-median.json`, `dev-B8-bundle.log`, `dev-B8-base-build.log`, `dev-B8-layout.json`, `dev-B8-focus-*.png`.

| 측정 | 1회 | 2회 | 3회 | 중앙값 |
|---|---:|---:|---:|---:|
| Performance | 96 | 97 | 96 | 96 |
| Accessibility | 100 | 100 | 100 | 100 |
| Best Practices | 100 | 100 | 100 | 100 |
| SEO | 100 | 100 | 100 | 100 |
| CLS | 0 | 0 | 0 | 0 |

- 명령: `NODE_OPTIONS=--max-old-space-size=3072 /tmp/leh-dev-lighthouse/node_modules/.bin/lighthouse http://localhost:3102/en --form-factor=mobile --screenEmulation.mobile --throttling-method=simulate --chrome-flags='--headless' --output=json --output-path=.qa-tmp/lh-final-N.json`.
- 원본 Lighthouse JSON에는 임의의 소수 타이밍이 리포 밖 패턴의 부분 문자열과 우연히 겹친다. 공개 증적 JSON은 점수/CLS 요약이며 원본은 커밋 제외 `.qa-tmp/lh-final-{1,2,3}.json`에 보존했다. 값은 원본에서 추출했고 보안 검사 PASS.
- 기준은 등록된 scratch `dev-base` (`/private/tmp/leh-20261006-kaniq-immersive-dev-base`), npm ci → build → production :3101. 후보 production :3102. HTML의 `/_next/static/chunks/*.js` URL만 중복 제거하여 다운로드, 동일 `gzip -c` 바이트 합.
- 기준 182,608 B → 후보 185,563 B, 증가 2,955 B ≤40,960 B. 스크립트 `.qa-tmp/bundle.py`.
- 390/768/1440/1860 두 모드, 템플릿 열린 상태도 scrollWidth−innerWidth 0. 신규 range·기록 버튼 2개·환원처·견적 버튼 포커스 증적. 측정 range·카드·환원처 outline 3px.

### B9 — 회귀 PASS
`evidence/dev-B9-curl.log`, `dev-test-final.log`, `dev-B9-{base-,}hero-{1440,390}.png`, `dev-B9-{base-,}records-{1440,390}.png`.
- curl / + Accept-Language ja → 307 Location /ja, Vary Accept-Language. /xx·/en/xx →404. POST /api/quote {}→422.
- 초기 /en HTML에 모션 대상 내용, 메신저 href 없음, live 응답 약속 없음. quote 저장/로그/전송 없음 기존 route test PASS.
- 전역 img height:auto 영향 확인: plan-photo 고정 크기 유지. registry는 계획 §7 폴백 4:3으로 정리했고 1440·390 기준/후보 스크린샷을 직접 확인했다.
- `git diff origin/main -- design/drafts` 출력 없음. `git check-ignore -v .lessons/_index.md` 출력 없음(rc1, 무시 안 함). 제품 PR에 교훈 파일 없음.
- `rg -l -f /Users/holmesmac/my-projects/customers/kaniq/brief/.confidential-patterns.txt src tests .lessons .loop/20261006-kaniq-immersive` 일치 없음(rc1). PR 본문도 같은 검사 일치 없음.

### B10 — Releaser 범위
운영 배포·운영 실기 실행하지 않음. 로컬 구현/검증 및 PR까지만 수행. 별도 독립 Reviewer·QA 판정은 다음 G3 게이트다.

### B11 — 전역 PASS
`evidence/dev-B11.json`, `dev-B11-{1440,390}-{no-preference,reduce}.png`, `dev-global-final.log`.
- sticky position, 펼침 78.109px → 축소 57.297px, 차이 20.812px. 헤더 + margin 흐름 변화 0.016px 이하.
- 히스테리시스 y60→축소,39→펼침,79→펼침,80→축소 확인.
- 문서 진행 시작 ≤.00061 → 하단 1. 로고·언어 summary 포커스 가능, 모바일 nav 숨김 유지.
- care/plan/trust/ambassador/trust-steps 앵커 top 모두 해당 헤더 높이−1 이상, 두 폭·두 모드 확인. 일반 모드 모바일 긴 smooth 이동 일부는 추가 여백으로 끝났으나 헤더와 겹치지 않음.

## 사람 게이트 해당
★ human_gate_paths 변경 없음. protected_paths 변경 없음. 마이그레이션 없음.

## 알려진 한계 / 후속
- 첫 Lighthouse 97/96/100/100에서 접근성 두 원인 실측: 새 스크러버를 감싼 grid child의 min-width 때문에 모바일 배경 밖으로 텍스트가 넘침 → `.okrules > div {min-width:0}`. 기존 언어 summary의 accessible name에 표시 텍스트가 없음 → `LanguageSwitcher.tsx` 한 줄 변경. 후자는 계획 파일 목록 밖이지만 B8 접근성 100을 충족하는 최소 범위라 진행했다. 새 색·서체·의존성 없음.
- 브라우저 스크립트 초기 실패는 locator `.logo`가 footer에도 일치, hover가 모바일 고정 메신저 아래에 걸림, 오류 포커스 rAF 전 관측이었다. 헤더 범위 locator·항목 중심 instant 스크롤·rAF 대기 후 다시 측정하여 PASS. 실패 로그는 그대로 보존했고 최종 로그는 `dev-global-final.log`, `dev-interactions-last.log`, `dev-quote-reduce.log`, `dev-supplement.log`, `dev-keyboard.log`다.
- 테스트 및 그림은 Chromium 로컬 production 실측이다. WebKit/Firefox·실제 모바일 기기는 실행하지 않음(계획 선택 항목).
- 번역은 기존 개발 초안 수준으로 원어민 검수 필요. 회복 규칙은 기존 예시 데이터를 연결했으며 의료 기준을 새로 정의하지 않았다.
- npm ci에서 기존 dependency audit high 5건을 표시했다. 의존성 변경은 이번 계획 범위 밖으로 실행하지 않음.
- 후보·기준 production 서버는 검증 후 모두 종료했다.
- 404 요청 중 Next 서버가 `Internal: NoFallbackError`를 로그에 기록했다. 기준 `7379aa5`도 /xx·/en/xx 요청에서 같은 로그를 내며 HTTP 404를 반환했다(`evidence/dev-B9-base-404.log`). 신규 회귀가 아니며 브라우저 pageerror는 0이었다.
- 다음 역할이 다시 서버를 열려면 후보 `npm start -- --port 3102`; 기준 scratch도 같은 build 상태로 보존한다. 직접 만든 새 역할 세션·서브에이전트 없음.

## 교훈 후보
모바일 가로 스크롤 테이블을 grid 내부에 한 단계 더 감쌀 때 새 부모도 `min-width:0`이 필요하다. 기존 scroll wrapper 규칙만으로는 부모의 intrinsic 최소 폭을 막지 못했다. Lighthouse 접근성의 배경 대비 실패와 overflow 관찰을 함께 보면 레이아웃 원인을 찾을 수 있다. 교훈 파일 수정·커밋은 실행하지 않음(closeout 범위).

## 사용량
- model: unknown / effort: unknown (Codex 세션의 정확한 모델 id/effort 조회 표면 제공되지 않음)
- input tokens: unknown
- cached input tokens: unknown
- output tokens: unknown
- credits: unknown
- 출처: 이 세션에서 TUI /status 계측을 읽을 수 없어 unknown. 모델·사용량 추정하지 않음.

STATUS: done [r1]
