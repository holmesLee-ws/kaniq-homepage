# 게이트 원장 — 20261006-kaniq-homepage

사용자 지시(2026-10-06): (1) 과업에 최적인 게이트를 구성하고 보고한다. (2) 게이트를 닫을 때마다 독립 리뷰를 하고 점수를 보고한다. (3) 다음 게이트로 넘어갈 때 이전 게이트 기록으로 맥락을 증강하거나 방향을 갱신하고 보고한다.

운영 규칙
- 독립 리뷰어: LEH Reviewer(grok-4.7, 구현 담당 codex·기획 담당 claude와 다른 모델). 읽기 전용.
- 점수: 100점 만점, 게이트별 루브릭 4개 축 × 25점. 통과선 = **85점 이상 그리고 Blocking 0**. 미달이면 같은 게이트에서 보완 후 재리뷰.
- 다음 게이트 지시문에는 이 원장의 해당 게이트 "증강 맥락·진행 방향" 절을 그대로 동봉한다.

## 게이트 구성

| 게이트 | 무엇을 닫나 | 실행 | 독립 리뷰 (루브릭 4축 × 25) | 산출물 |
|---|---|---|---|---|
| G1 결과값 | 시안 선택·범위·Acceptance 확정 | 오케스트레이터 | Reviewer: 판정 가능성 · 기획서 정합성 · 범위 적정성 · 리스크(법·공개 리포·운영) | spec.md · 04-review-r1 |
| G2 설계 | 정보구조·컴포넌트·i18n 구조·콘텐츠 사전·토큰·테스트 계획 | Designer(claude) | Reviewer: spec 충족 · 구현 가능성/단순성 · 현지화·접근성 설계 · 검증 계획 | 02-plan.md · 04-review-r2 |
| G3 구현 | Next.js 사이트·PR·로컬 검증 | Developer(codex) | Reviewer 코드 리뷰: 정확성 · 계획 준수/코드 품질 · 회귀·보안 · 검증 재현성 ‖ QA 로컬 실기(Acceptance 항목 PASS율) | 03-dev · 04-review-r3+ · 05-qa-r1+ |
| G4 배포 | main 머지 · Vercel production · 운영 스모크 | Releaser(codex) → QA | QA 운영 실측: 공개 접근 · SHA 일치 · 운영 화면 · 회귀 | 06-release · 05-qa-rN |
| G5 종결 | 교훈·실측·증적 closeout·수거 | 오케스트레이터 | Reviewer 최종 감사: Acceptance↔증적 대응 · 보고 정확성 · 잔여 위험 · 정리 상태 | 07-lessons · 04-review-rN |

---

## G1 결과값 — PASS (90/100)
- 라운드: r1 68점 CHANGES(Major 4) → spec 수정 → r2 90점 APPROVE(Blocking·Major 0, Minor 5 → 반영 후 동결)
- r2 축별: 판정 가능성 22 · 기획서 정합성 23 · 범위 적정성 23 · 리스크 22
- 핵심 변화(r1→r2): A2를 진료/일수/인원 축별 변화로 분리(시안 A `render()`와 일치) · A3를 시안 C H1 원문·우선 진료 id·메신저 fixture로 고정 · F01~F10 포함/축소/제외 표 추가 · **사전 공개 모드(`launchState: preview`)** 신설(등록번호 없음·메신저 계정 미개설 → 상단 띠, 메신저 비링크, 24시간 약속 금지, 견적은 저장·회신 없음).

### 증강 맥락·진행 방향 (→ G2 설계)
1. **설계가 반드시 담을 구조 3개**: (a) `launchState` preview/live 분기 — 설정 1곳, 메신저·띠·회신 문구·견적 완료 문구가 모두 이 값을 읽는다 (b) 언어별 타입 사전 — A3/A5 단위 테스트가 fixture와 대조할 수 있게 키 구조를 고정 (c) 플래너 순수 함수 — A2 (a)(b)(c) 단언이 가능하도록 UI와 분리.
2. **CTA 두 종류 규칙**을 컴포넌트 수준에서 강제: 메신저 버튼·견적 시작 버튼 외의 버튼형 링크를 만들지 않는다. 헤더 메뉴는 앵커, 템플릿 "PDF 받기"는 견적 시작.
3. **금지어 검증(A4·A9)이 `src/` 전체를 훑는다** → 콘텐츠 사전 작성 시 부정 고지("보장하지 않습니다")도 오탐 후보다. 문구 선택을 처음부터 피하는 쪽을 권고.
4. **성능 목표(Lighthouse mobile Perf ≥85)** 와 다국어 폰트(일본어·한국어·몽골어 키릴)가 충돌할 수 있다 → 폰트 전략(next/font 서브셋, 언어별 로드)을 설계 단계에서 정한다.
5. 리스크 이월: Vercel↔GitHub git 연결 미확인(→ G4 Releaser 사전 확인, 폴백 `vercel deploy --prod`). 원어민 검수는 비목표.

## G2 설계 — PASS (91/100)
- 라운드: Designer r1(02-plan.md, 696줄, 12분) → Reviewer r3 91점 APPROVE(Blocking·Major 0, Minor 5)
- 축별: spec 충족 23 · 구현 가능성/단순성 23 · 현지화·접근성 설계 22 · 검증 계획 23
- 리뷰어 실측 확인: next 16.3.8(proxy.ts가 middleware 대체, params Promise), react 19.3.0, Schibsted Grotesk는 latin/latin-ext만, `x-default` 타입 허용, typescript-eslint peer 상한(<6.1) → TS 5 고정 필요.
- 설계 핵심: Next 16 + `src/proxy.ts` 언어 협상, `[lang]` + `dynamicParams=false` + global-not-found(2단계 404), `site.ts`/`launch.ts`로 preview/live, `Dictionary` 타입 + `tests/fixtures/localization.ts`, `buildPlan()` 순수 함수, `MessengerCta`·`QuoteStartLink` + guards 테스트, 웹폰트는 Schibsted latin 하나(ja/ko/mn 시스템 스택), vitest 단위 + 브라우저 실기.

### 증강 맥락·진행 방향 (→ G3 구현)
1. **G2 Minor 5건을 구현 지시로 승격**(설계 재작성 없이 Developer가 반영): (a) 모바일 nav 숨김은 시안 그대로 — A7 포커스 실측은 1440×900 (b) 플래너·템플릿 → 견적 `interest` 대응표: implants→dental, lasik→eye, screening→screening, womens-wellness→womens-health, fertility→fertility, family-screening→screening (c) 히어로 카드 푸터에 "KANIQ 수수료 ₩0" 상수 표시 (d) 시안 A 338행 `Liability insurance ₩100M+`는 넣지 않는다(미등록 상태의 보험 주장) (e) `x-default`는 타입 허용 실측 — A8 curl로 렌더 확인.
2. **버전 함정 선제 차단**: TypeScript 5.x(typescript-eslint peer), ESLint 9.x(eslint-plugin-import/jsx-a11y peer), Node 22 로컬. `next build`의 typegen 전에 `tsc --noEmit`이 PageProps를 못 찾을 수 있음 → 스크립트 순서를 계획 §3.9대로.
3. **QA 재작업 1위 원인 차단**: 브라우저 판정 A2·A3·A5·A6·A7은 Developer가 계획 §6.3 레시피로 직접 보고 `evidence/dev-A<n>-*.png` + 수치(scrollWidth 등)를 남긴 뒤에만 done.
4. **G3 독립 리뷰 기준 예고**: Reviewer(정확성·계획 준수/코드 품질·회귀·보안·검증 재현성) ‖ QA 로컬 실기(A1~A9 PASS율). 둘 다 점수를 낸다.

## G3 구현 — PASS (최종: 리뷰 96/100 · QA 100/100)
- 라운드: Developer r1(PR #1, head 4be4286, 약 38분) → Reviewer r4 92점 APPROVE ‖ QA r1 PASS 9/9(100점) → Developer r2(Minor 2건, head e1730b9, 3파일 +4/-2, red→green 확인) → Reviewer r5 델타 96점 APPROVE(정확성 24·계획 24·회귀 24·검증 24, Minor 0) ‖ QA r2 델타 PASS 9/9(A1·A3 재실측, 나머지 r1 인용)
- Reviewer r4 축별: 정확성 23 · 계획 준수/코드 품질 22 · 회귀·보안 24 · 검증 재현성 23. 스크래치 새 클론에서 npm ci→lint→tsc→test 73→build 재현, Accept-Language 셀 25종 표 실측, CTA guards 변이 테스트.
- QA 축별: 기능 3/3 · 현지화 2/2 · 품질 하한 2/2(scrollWidth 30회 일치, Lighthouse mobile 중앙값 96/100/100/100) · 문구 준수 2/2.
- Minor(머지 전 r2로 닫음): `ja ;q=0.9`처럼 세미콜론 앞 공백이면 /en으로 감(negotiate 태그 trim 누락) · guards 테스트가 `className={"cta"}` 형태를 못 잡음.
- 알려진 한계(수용): 2단계 언어 404 시 서버 로그에 Next 16 `NoFallbackError` 스택(응답은 정상 404) · dev 의존성 audit high 5건(ESLint 9 체인, production 0건) · 번역 원어민 검수 필요.

### 증강 맥락·진행 방향 (→ G4 배포)
1. **배포 대상 SHA = r2 후 PR #1 head**. r2 변경은 negotiate.ts·테스트 2파일뿐 → Reviewer는 델타만, QA는 A1(언어 협상) 델타만 재실측하고 나머지는 r1 증적 인용(기준 커밋 불변식).
2. **Vercel**: 프로젝트는 framework=nextjs·ssoProtection=preview로 준비됨. 배포 SHA 증명이 A10의 핵심 → git 연결이 되면 `githubCommitSha`, 안 되면 머지 SHA 체크아웃에서 `vercel deploy --prod` 후 배포 메타·`vercel inspect`로 SHA 기록.
3. **운영 확인 포인트**(QA 운영 스모크): 공개 접근(로그인 없이 200), `/` 언어 리다이렉트가 Vercel 엣지에서도 동작(Vary 헤더·캐시 주의), 2단계 404, `/api/quote` 200/422, OG 이미지 절대 URL이 production 도메인인지.
4. 메모리 압력 레벨 2가 지속됨 → 무거운 빌드·Lighthouse는 하나씩.

## G4 배포 — PASS (최종 100/100 · 1차 98/100)
- 라운드: Releaser r1 — PR #1 squash → main `edd3834`(11:21Z), Vercel git 연결 실패(원인 미확정) → 머지 SHA 깨끗한 체크아웃에서 CLI `vercel deploy --prod` → `dpl_HoS737…` READY, 스모크 6/6 → QA r3 운영 실측 98점 PASS 10/10
- QA 축별: 공개 접근 25 · SHA 일치 25(GitHub main = Vercel meta.gitCommitSha = edd3834, PR head와 tree 동일) · 운영 화면 23 · 운영 회귀 25(리다이렉트 9/9 + 언어별 CDN 캐시 분리, 404 6/6, 422 3/3, SEO 절대 URL). 운영 Lighthouse 99/100/100/100.
- 배포 중 사고(처리됨): `vercel link`가 `.gitignore`에 `.vercel`을 추가해 첫 배포가 gitDirty로 생성됨(`dpl_BPKv…`, 중단) → 원복 후 깨끗한 트리에서 재배포. 도메인은 깨끗한 배포를 가리킴. 잔여 dirty 배포는 fix-forward 릴리즈 때 정리.
- Minor(fix-forward PR #2로 처리 중): ja H1이 1440에서 「も、」만 다음 줄로 떨어짐 · `/favicon.ico` 404.

### 증강 맥락·진행 방향 (→ fix-forward → G5)
1. fix-forward는 별도 PR #2 → Reviewer 델타 → Releaser(머지 + 같은 CLI 방식 재배포 + dirty 배포 `dpl_BPKv…` 제거) → QA 운영 델타(ja/ko H1, favicon, 회귀 스모크). Releaser에게 `vercel link`가 `.gitignore`를 건드린다는 사실을 미리 알려 재발 방지.
2. G5 교훈 후보: (a) 새 리포 첫 spawn에서 claude·codex 폴더 신뢰 프롬프트가 탭을 leaked로 만든다 (b) `vercel link`가 추적 파일을 바꿔 gitDirty 배포를 만든다 (c) 오케 노트 heredoc의 백틱 치환으로 파일명이 빠졌다.
- fix-forward 결과: Developer r3 PR #2(head f8904be, globals.css·seo.ts·favicon.ico) → Reviewer r6 96점 APPROVE(Minor 0) → Releaser r2 squash `91cdbf5` → CLI 배포 `dpl_6Mjd6j1o…`(porcelain 빈 출력 확인 후, gitDirty 없음), dirty 배포 `dpl_BPKv…` alias 없음 확인 후 삭제 → QA r4 운영 델타 **100점 PASS 10/10**(ja 3폭 세 구절, ko 어절 끊김 0, favicon 200, 회귀 전부 일치).

### 증강 맥락·진행 방향 (→ G5 종결)
1. 종결 감사 대상: spec A1~A10 체크박스 ↔ 증적 경로 실재, gates.md 점수 ↔ 04/05 원문 일치, 운영 URL·SHA 일치, 잔여 리스크(원어민 검수, 사전 공개 모드, Vercel git 미연결, dev 의존성 audit, NoFallbackError 로그) 기록 여부.
2. 교훈 확정(.lessons/). heredoc 백틱 치환은 오케스트레이터 노트 작성 실수로 `07-lessons.md` 「Learn」 절에 한 단락으로 기록(일반화 가치 낮아 .lessons 파일은 만들지 않음).

## G5 종결 — PASS (감사 91/100 · 보안 fix 93/100)
- Reviewer r7 종결 감사 91점 APPROVE(Acceptance↔증적 23 · 보고 정확성 22 · 잔여 위험 기록 24 · 정리 상태 22, Minor 4)
- Minor 처리: spec A10 증적에 최종 운영 경로 추가 · gates.md G3 축 라운드 표기 · heredoc 기록 위치 정정 · **공개 리포 노출(가드 테스트의 비공개 KPI 수치 토큰)** → Developer r4 PR #3(테스트 4줄 삭제) → Reviewer r8 93점 APPROVE → Releaser r3 squash `eb0c41a` → 재배포 `dpl_26A1HbyyNSr3ZtrrdT4KLFGEASEn`(gitDirty 없음, 스모크 6/6). 런타임 무변경이라 QA 재실측은 생략(근거 decisions 기록, 오케스트레이터 스모크 교차 확인).
- 증적 보호: closeout 전 `.loop/<run>` 전체를 리포 밖 패턴 파일로 스캔, 비공개 수치를 `[내부수치]`로 가림(잔여 일치는 Vercel API의 무관한 숫자 2건뿐).
- 수거: cleanup rc 0(잔여 탭 0, leaked 0, scratch 4개 제거). 교훈 3건 `.lessons/`, `07-lessons.md` STATUS done.
- 잔여 위험(사용자 결정 필요): main 히스토리 커밋 `edd3834`의 테스트 파일에 비공개 KPI 수치 토큰이 남아 있다(현재 트리에는 없음). 제거하려면 히스토리 재작성(강제 push)이 필요하다.
