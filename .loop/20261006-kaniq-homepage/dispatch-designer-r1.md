[ROLE: designer] [RUN: 20261006-kaniq-homepage] 너는 loop-engineering-holmes 팀의 designer다. 오케스트레이터(메인 세션)가 이 탭을 띄웠다.

규칙:
- 재귀적으로 세션·서브에이전트·팀을 띄우지 않는다. 이 탭에서 네 역할만 수행한다.
- 먼저 읽을 것: /Users/holmesmac/.claude/skills/loop-engineering-holmes/roles/designer.md (네 역할 지침), .loop/profile.yaml, .loop/20261006-kaniq-homepage/spec.md, 그리고 역할 지침이 지정한 선행 산출물.
- 산출물: .loop/20261006-kaniq-homepage/02-plan.md — 역할 지침의 형식을 따르고, 파일 마지막 줄은 반드시 `STATUS: done` 또는 `STATUS: blocked <이유>` 또는 `STATUS: needs_decision <질문>` 이어야 하고, 이 지시문 아래에 라운드 토큰 `[r<n>]` 요구가 있으면 그 토큰을 STATUS 줄 끝에 붙인다. 이 줄이 없으면 오케스트레이터는 네가 끝나지 않았다고 본다. `STATUS: done`은 산출물에 들어가야 할 외부 결과값(PR URL·머지 SHA·요청 id 등)이 **실제로 채워진 뒤**에만 쓴다 — 아직 진행 중이면 STATUS 줄을 쓰지 말고 계속하라. `STATUS: blocked <이유>`는 **더 진행할 수 없어 멈췄을 때만**(오케스트레이터 조치 필요). 나중에 내용을 추가할 때도 STATUS 줄은 항상 **파일의 마지막 줄**이어야 한다(기존 STATUS 줄을 지우고 새 내용 뒤에 다시 쓴다).
- 결과를 지어내지 않는다. 실행하지 않은 것은 "실행하지 않음"이라고 쓴다. 실패도 그대로 쓴다.
- 네 역할 경계 밖의 일(코드 수정, 머지, 원장 쓰기 등)이 필요하면 하지 말고 산출물에 요청으로 남긴다.
- 기준 커밋 비교·릴리즈 체크아웃 등으로 별도 워크트리가 필요하면 `git worktree add`를 직접 쓰지 않는다. `bash /Users/holmesmac/.claude/skills/loop-engineering-holmes/scripts/leh.sh scratch 20261006-kaniq-homepage <name> [<ref>]`가 만들어 주는 경로를 쓴다(등록돼야 run 종료 때 회수된다). **name은 라운드가 아니라 슬롯이다** — `qa-cand`(후보)·`qa-base`(기준)·`qa-mut`(변이)처럼 역할별 고정 이름을 쓰고, 다음 라운드엔 같은 name에 새 ref를 주면 깨끗한 슬롯이 그 커밋으로 옮겨진다(`qa-r21-old` 같은 라운드 번호 이름 금지). 변이 검증이 끝나면 `git checkout -- . && git clean -fd`로 슬롯을 되돌린다.
- 끝나면 산출물을 저장하고 한 줄로 "완료 — STATUS 기록함"이라고만 답한다. 그 다음 지시가 올 때까지 대기한다.

시작하라.

## 오케스트레이터 추가 맥락
# Designer 지시 — G2 설계 (02-plan.md)

동결된 `.loop/20261006-kaniq-homepage/spec.md`(G1 90점 통과)를 Developer가 질문 없이 구현할 수 있는 계획으로 바꾼다. `roles/designer.md`의 9섹션 형식. 읽기 전용(코드·설정 수정 금지).

## 반드시 읽을 것
- `spec.md`(정본) · `gates.md`의 「G1 → 증강 맥락·진행 방향」 5항목(아래에 그대로 인용) · `04-review-r1.md`, `04-review-r2.md`(G1 리뷰 지적의 배경)
- 시안 HTML 소스: `design/drafts/a-journey.html`(기반 — 토큰·레이아웃·플래너 데이터 `TX`·`render()`), `b-proof.html`(영수증·기록 카드·4단계), `c-local.html`(언어권 데이터 `L`·메신저 색 `MSG`·앰버서더·기관 존). 이미지 `design/drafts/img/*.jpg`.
- 기획서 텍스트(리포 밖, 읽기만·복사 금지): `/Users/holmesmac/my-projects/customers/kaniq/brief/kaniq-homepage-plan-deck.txt`
- 그린필드 리포다. §2 「현재 구조」는 리포에 있는 것(README·design/drafts)과 시안에서 가져올 토큰·데이터의 위치(파일:줄)를 적는다.

## G1에서 넘어온 증강 맥락·진행 방향
1. 설계가 반드시 담을 구조 3개: (a) `launchState` preview/live 분기 — 설정 1곳, 메신저·상단 띠·회신 문구·견적 완료 문구가 모두 이 값을 읽는다 (b) 언어별 타입 사전 — A3/A5 단위 테스트가 fixture와 대조할 수 있게 키 구조를 고정 (c) 플래너 순수 함수 — A2 (a)(b)(c) 단언이 가능하도록 UI와 분리.
2. CTA 두 종류 규칙을 컴포넌트 수준에서 강제: 메신저 버튼·견적 시작 버튼 외의 버튼형 링크를 만들지 않는다. 헤더 메뉴는 앵커, 템플릿 "PDF 받기"는 견적 시작.
3. 금지어 검증(A4·A9)이 `src/` 전체를 훑는다 → 콘텐츠 사전에 부정 고지("보장하지 않습니다")도 오탐 후보다. 처음부터 그런 문구를 피한다.
4. 성능 목표(Lighthouse mobile Perf ≥85)와 다국어 폰트(일본어·한국어·몽골어 키릴)가 충돌할 수 있다 → 폰트 전략(next/font 서브셋, 언어별 로드, 시스템 폰트 폴백)을 설계에서 정한다.
5. 리스크 이월: Vercel↔GitHub git 연결 미확인(G4 Releaser가 확인, 폴백 `vercel deploy --prod`). 원어민 검수는 비목표.

## 계획이 정해야 할 것 (빠짐없이)
- **스택 버전 실측**: `npm view next version`, `npm view react version` 등으로 현재 안정판을 확인해 적는다. Next.js 최신 메이저에서 미들웨어 파일 이름·`params` 비동기 여부·`generateStaticParams`·`metadata`/hreflang API가 바뀌었을 수 있다 — 공식 문서(가능하면 context7 MCP, 아니면 nextjs.org/docs)로 확인한 근거를 §3에 적고, 실측/추정을 표로 구분한다.
- 라우팅: `/` 언어 협상(Accept-Language q값·지역 태그), `/[lang]`, `/[lang]/quote`, `/api/quote`, 2단계 언어 404, `sitemap.xml`·`robots.txt`·OG 이미지.
- 콘텐츠 사전 스키마(TypeScript 타입) + 5개 언어 파일 + A3 fixture. 번역은 Developer가 쓴다 — 시안 A·B·C의 영어 카피를 원문으로, ja·id·mn·ko 번역 지침(정식 시술명, 의료광고 금지어, 사전 공개 띠 문구)을 적는다.
- 컴포넌트 트리와 각 컴포넌트의 클라이언트/서버 경계(플래너·견적 폼·언어 전환기·환원처 선택만 클라이언트).
- 디자인 토큰: 시안 A `:root` 값을 정본으로 CSS 변수/모듈화. B·C 섹션을 A 토큰으로 다시 그리는 규칙(영수증·인장·언어 블록·앰버서더 패널).
- 견적 폼 3단계 상태 전이 표(단계 × 입력 → 다음/오류), `/api/quote` 검증 스키마와 응답 형식(200/422), 로그·저장 없음.
- 검증: 단위 테스트 러너(vitest 등) · 테스트 파일 목록 · A1~A10 매핑 · 브라우저 항목마다 관측 레시피(URL·뷰포트·조작·기대 화면 한 줄) · Lighthouse 실행 방법(로컬 production 빌드).
- `profile.yaml` verify_cmds(`npm run lint`, `npx tsc --noEmit`, `npm test`, `npm run build`)가 그대로 동작하도록 package.json 스크립트를 정한다.
- 금지: `.github/**` 생성, `design/drafts/**` 수정, 기획서 텍스트 복사.

## 다음 게이트
너의 `02-plan.md`는 G2 독립 리뷰(Reviewer, 100점 — spec 충족 · 구현 가능성/단순성 · 현지화·접근성 설계 · 검증 계획, 통과 85점+Blocking 0)를 받는다.

산출물 파일명: .loop/20261006-kaniq-homepage/02-plan.md
