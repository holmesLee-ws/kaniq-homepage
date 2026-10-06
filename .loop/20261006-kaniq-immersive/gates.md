# 게이트 원장 — 20261006-kaniq-immersive

사용자 지시(직전 run에서 받은 방식 유지): (1) 최적 게이트 구성·보고 (2) 게이트 종결마다 독립 리뷰·점수 보고 (3) 다음 게이트로 넘어갈 때 이전 기록으로 맥락 증강·방향 갱신·보고.

운영 규칙: 독립 리뷰어 = LEH Reviewer(grok-4.7, 구현 codex·설계 claude와 다른 모델). 100점(4축×25), 통과 = 85점 이상 + Blocking 0. 다음 지시문에 해당 게이트의 증강 맥락을 동봉.

## 게이트 구성
| 게이트 | 무엇을 닫나 | 실행 | 독립 리뷰 (4축 × 25) |
|---|---|---|---|
| G1 결과값 | 모션 범위·버그 원인·Acceptance B1~B10 | 오케스트레이터 | Reviewer: 판정 가능성 · 사용자 의도 정합 · 범위 적정성 · 리스크(성능·접근성·회귀) |
| G2 모션 설계 | 섹션별 모션 명세(트리거·시간·이징·축소 모드)·스크러버 데이터·번들 예산·관측 레시피 | Designer(claude) | Reviewer: spec 충족 · 구현 가능성/번들 · 접근성·reduced-motion · 검증 계획 |
| G3 구현 | PR·로컬 검증 | Developer(codex) | Reviewer 코드 리뷰 ‖ QA 로컬 실기(B1~B9) |
| G4 배포 | main 머지·Vercel production·운영 실측 | Releaser → QA | QA 운영 실측(B10 + B1·B4 + 회귀) |
| G5 종결 | 교훈·실측·closeout(비공개 수치·개인정보 스캔 포함) | 오케스트레이터 | Reviewer 종결 감사 |

## 직전 run에서 가져온 맥락
- 사이트 구조: Next 16.3.8 App Router, `src/content/*` 타입 사전, `buildPlan()` 순수 함수, `launchState=preview`, CTA 두 종류 가드, Schibsted Grotesk + 시스템 CJK 폰트, Lighthouse 운영 99/100/100/100.
- 교훈 3건(.lessons/): 공개 리포 비공개 수치 금지(리포 밖 패턴 파일로 대조) · `vercel link`의 .gitignore 오염 → 배포 직전 porcelain 확인 · 새 리포 첫 spawn 폴더 신뢰 프롬프트.
- 배포: Vercel git 미연결 → 머지 SHA 깨끗한 체크아웃에서 CLI 배포.

---
## G1 결과값 — PASS (91/100)
- 라운드: r1 73 CHANGES(Major 2) → r2 84 CHANGES(Major 2) → r3 91 APPROVE(Blocking·Major·Minor 0)
- r3 축별: 판정 가능성 23 · 사용자 의도 정합 24 · 범위 적정성 22 · 리스크 22
- 핵심 변화: 결과 상자의 모든 효과를 Acceptance로 수치화(B1 시차·칩, B2 일정선, B11 전역 스크롤 UI 신설) · B3/B5(c)/B6 시점·비율 잠금 · B4 스크러버 매핑(0..6 → 표 4행, aria `rows[행-1].note`) · B8 번들 기준을 "/en이 참조하는 청크 gzip 합"으로 교체(Next 16 로그에 First Load JS 줄 없음) · 원인 메커니즘 정정.

### 증강 맥락·진행 방향 (→ G2 모션 설계)
1. **버그의 진짜 원인은 전역 CSS**: `img { max-width:100% }`에 `height:auto`가 없어 HTML height 속성이 이긴다(globals.css:17–20). 이 수정은 사이트의 모든 이미지에 닿는다 → 설계는 다른 이미지(히어로·플래너 사진 등) 회귀까지 §7에 넣는다.
2. **판정은 수치로 잠겼다**: 설계의 모든 모션은 spec의 측정 가능 조건(100ms 안 시작, 450ms 종료, 1.2초 시퀀스, 진행선 2%/40–70%/98%, 막대 ±5%)을 만족하는 시간·이징이어야 한다. 섹션별 표에 그 숫자를 그대로 적는다.
3. **reduce 모드는 '정적 최종 상태'**: 진행선은 현재 스크롤 비율을 정적으로 보여 줘야 PASS(0%면 FAIL) → 스크롤 연동 값은 모션과 분리된 상태(CSS 변수)로 설계.
4. **번들 예산은 /en 참조 청크 gzip +40KB** → 라이브러리 도입은 근거 필수, 기본은 CSS + 작은 훅.
5. 기관 파트너·푸터는 정적(비목표). `.gitignore`의 `.lessons/` 제거는 B9에 포함.

## G2 모션 설계 — PASS (93/100)
- 라운드: Designer r1(716줄) → Reviewer r4 81 CHANGES(Major 3: intro 속성 소유 요소·presence 맨 앞 exit·R-B1 측정 시점, Minor 6) → Designer r2 → Reviewer r5 93 APPROVE(Blocking·Major·Minor 0)
- r5 축별: spec 충족 24 · 구현 가능성/번들 22 · 접근성·reduced-motion 24 · 검증 계획 23
- 설계 핵심: 모션 라이브러리 없음(motion 불채택) — CSS transition/keyframes + `--i` 순차 지연 + 클라이언트 `MotionRuntime` 1개(IO 진입·passive scroll/rAF 진행값 → CSS 변수, 예상 ~1.5KB gzip). scroll-driven/View Transitions 불채택(reduce·지원 편차·판정 불일치). `article.plan[data-intro]`가 로드 시퀀스와 출입 게이트를 함께 소유. `mergePresence`로 출입 노드 보존. 스크러버는 `<input type=range>` 0..6 + `recoveryDay()` 순수 함수. 진료찾기는 전역 `img{height:auto}` + 고정 비율 + 데스크톱 sticky 사진/패널, 모바일 패널 위.

### 증강 맥락·진행 방향 (→ G3 구현)
1. **재작업 1위 원인 차단**: 이 run은 판정 매체가 거의 전부 브라우저 수치다(B1~B7·B11). Developer는 계획 §6.2 레시피를 그대로 돌려 숫자와 스크린샷을 남긴 뒤에만 done — 숫자가 없으면 done이 아니다.
2. **리뷰어가 실행 못 한 미확인 1건**: `getImageProps`가 dpr 2에서 요구 폭(`w=`) 후보를 실제로 내는지 — B1(a) natural 조건의 성패가 여기 달려 있다. 구현 첫 단계에서 실측하고, 안 되면 계획의 이미지 폴백 분기를 쓴다.
3. **전역 `img{height:auto}`는 모든 이미지에 닿는다** → 히어로·플래너·기록 카드 사진 회귀를 B9와 함께 1440·390 스크린샷으로 확인.
4. **번들·성능**: 기준 `7379aa5` 대비 `/en` 참조 청크 gzip 합 비교 로그 필수, Lighthouse 3회 중앙값(Perf ≥ 90, CLS ≤ 0.02). scroll 핸들러는 passive + rAF 1회/프레임.
5. **공개 리포**: 비공개 수치 금지 — 새 테스트·문구에도. 확인은 리포 밖 패턴 파일 `rg -f`.

## G3 구현 — PASS (리뷰 95/100 · QA 100/100)
- 라운드: Developer r1(PR #5, head 5f5fd82, 약 18분) → Reviewer r6 95 APPROVE(정확성 24 · 계획 준수/코드 품질 23 · 회귀·보안 24 · 검증 재현성 24, Minor 1: 가려진 `.registry img` aspect-ratio 규칙) ‖ QA r1 PASS 10/10(100점)
- QA 핵심 수치: 진료찾기 16조합 전부 충족(사진 512×1600 → 512×640, natural 1280×1600 ≥ 요구, 섹션 ≤ 뷰포트×1.4, 시차 21~51px) · 히어로 시퀀스 끝 1100ms, 일정선 0→1 · 스크러버 5개 언어 D0..D6 키보드 일치 · 영수증 3단계 1회, 카드 AX 한 면, 진행선 0/0.50/1 · reduce 조작 11종 running 0 · Lighthouse 중앙값 97/100/100/100, CLS 0 · 번들 +2,955B · 테스트 126건(기존 75 포함) · 헤더 78.1→57.3px.
- 수용한 Minor: 가려진 CSS 규칙 1개(동작 무영향) — 후속 정리 후보.

### 증강 맥락·진행 방향 (→ G4 배포)
1. 배포 대상 = PR #5 head 5f5fd82(QA 기준 커밋과 동일) → squash 머지 SHA의 깨끗한 체크아웃에서 CLI 배포. `vercel link` 금지(.vercel/project.json 직접 작성), 배포 직전 porcelain 빈 출력.
2. 운영에서만 깨질 수 있는 것: 이미지 최적화 `w=1920` 후보가 Vercel 이미지 최적화에서도 나오는지(B1 natural 조건), sticky 헤더·스크롤 런타임이 CDN HTML에서 정상인지, 언어 협상 Vary 캐시 유지.
3. 공개 증적에는 Lighthouse 원본 JSON을 넣지 않는다(리포 밖 패턴과 우연 겹침) — 요약만.

## G4 배포 — PASS (100/100)
- 라운드: Releaser r1 — PR #5 squash `16db6a3`(14:45Z) → `.vercel/project.json` 직접 작성(link 없음), 배포 직전·직후 porcelain 0 → CLI `vercel deploy --prod` `dpl_84XGs4qiqNFkhPpXbqsKLSwQgnRD` READY(gitCommitSha = 머지 SHA, gitDirty 없음), 스모크 6/6, 운영 B1 8/8·B4 → QA r2 운영 실측 100점 PASS
- QA 축별: 공개 접근 25 · SHA 일치 25(머지 tree = 기준 커밋 tree) · 운영 화면 25(B1 8/8, B4 4/4 + 포인터, B11 4/4) · 운영 회귀 25(A1 9종 307+Vary, 404, 사전 공개 0건, 422, Lighthouse 99/100/100/100)
- 교훈 적용 확인: `vercel link` 미사용 + porcelain 확인으로 직전 run의 gitDirty 사고 재발 없음.

### 증강 맥락·진행 방향 (→ G5 종결)
1. 종결 감사: B1~B11 ↔ 증적, gates 점수 ↔ 원문, 운영 SHA 일치, 리포 밖 패턴 `rg -f`·개인정보 스캔, 잔여 위험(가려진 CSS 규칙, 원어민 검수, 사전 공개 모드, Vercel git 미연결, `edd3834` 히스토리).
2. 교훈 후보: (a) 결과물 스케치의 효과는 각각 Acceptance로 — G1에서 3라운드 소요 (b) grid 안 가로 스크롤 래퍼는 부모마다 `min-width:0` (c) Lighthouse 원본 JSON의 임의 숫자가 비공개 패턴과 우연히 겹침 → 공개 증적은 요약만(기존 security 교훈 보강).

## G5 종결 — PASS (98/100)
- Reviewer r7 종결 감사 98 APPROVE(Acceptance↔증적 25 · 보고 정확성 24 · 잔여 위험 기록 25 · 정리 상태 24, Minor 2 → 처리: 05-qa-r2 조합 수 정정 주석, vercel 교훈 예방 규칙을 `.vercel/project.json` 직접 작성으로 갱신)
- 수거: cleanup rc 0(잔여 탭 0, leaked 0, scratch 3개 제거). 실측 1시간 43분 · $20.28 · 개발 1라운드 · 리뷰/QA 9라운드.
- 교훈: 신규 2(spec 효과별 Acceptance, grid min-width:0) · 보강 2(security, vercel). 직전 run 교훈 3건 포함해 이번 closeout으로 리포에 실림(.gitignore 해제).
- 증적 보호: closeout 전 리포 밖 패턴 파일 `rg -f`·개인정보 스캔.
