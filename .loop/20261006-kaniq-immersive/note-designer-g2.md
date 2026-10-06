# Designer 지시 — G2 모션 설계 (02-plan.md)

동결된 `spec.md`(B1~B11)를 Developer가 질문 없이 구현할 수 있는 **모션·인터랙션 설계**로 바꾼다. `roles/designer.md` 9섹션 형식. 읽기 전용. `/frontend-design` 원칙을 따른다: 모션은 상태·진행·관계를 전달할 때만, 섹션마다 같은 페이드업을 반복하지 않는다(섹션별로 다른 동사 — 그리기·인쇄·뒤집기·채우기·전환), 한 번의 오케스트레이션된 로드 시퀀스, 사용자 조작에 대한 응답 모션은 적극적으로.

## 읽을 것
`spec.md`, `gates.md`(G1 기록과 아래 증강 맥락), `04-review-r1~r3.md`(G1 리뷰 — 특히 r1의 원인 메커니즘·파일:줄), 현재 소스 `src/**`(특히 `components/home/*`, `components/quote/QuoteForm.tsx`, `components/layout/*`, `styles/globals.css`, `styles/tokens.css`, `content/*.ts`, `lib/planner/build-plan.ts`), 직전 run `.loop/20261006-kaniq-homepage/02-plan.md`(구조 정본), `.lessons/`.

## G1에서 넘어온 증강 맥락·진행 방향
(오케스트레이터가 G1 통과 시 gates.md에 쓴 「G1 → G2」 절을 그대로 따른다 — 이 노트 하단에 첨부)

## 계획이 반드시 정할 것
1. **모션 기술 선택 표**: CSS(transition·keyframes·`animation-timeline: view()/scroll()` + `@supports` 폴백) vs IntersectionObserver 훅 vs 모션 라이브러리(motion 등). 기본은 CSS + 작은 훅. 라이브러리를 쓰려면 B8 번들 예산(참조 청크 gzip 증가 ≤ 40KB) 안임을 `npm view <pkg>`·번들 크기 근거로 보인다. Safari/Firefox의 scroll-driven animation 미지원 폴백(IO 기반 진행값 → CSS 변수)을 명시.
2. **섹션별 모션 명세 표**: 섹션 · 트리거(로드/뷰포트 진입/스크롤 진행/조작) · 동사 · 시간(ms) · 이징 · 순서/지연 · reduce 모드 최종 상태 · 관련 B항목. 히어로 로드 시퀀스(B2)는 타임라인 다이어그램으로.
3. **B1 진료찾기 레이아웃 수정**: 원인(`img`에 height:auto 부재로 HTML height 속성이 이김 + `align-items:center` + 섹션 높이)을 고치는 CSS와 `sizes`/이미지 후보(dpr 2에서 naturalWidth/Height 조건 충족) 설계, 1440·1860 패널 전체가 뷰포트 안에 들어오는 배치(예: sticky 사진 + 패널), 390·768은 패널이 사진 위. 시차·칩 순차 등장 수치.
4. **B4 스크러버**: 순수 함수 시그니처(`recoveryDay(d) → {column, activeRuleIds, rowIndex, ariaText}`), 컴포넌트 구조(네이티브 `<input type=range>` 권장 — 접근성), 그리드·회복 표·"오늘 가능한 것" 연결, 5개 언어 신규 문구 키.
5. **B5 각 인터랙션의 접근성 패턴**(카드 뒤집기 버튼 + `aria-pressed`, 보이는 면만 접근 가능; 템플릿 펼침은 focus-within/hover + 펼침 영역의 레이아웃 시프트 없음).
6. **B3 플래너 전환**: 출입 노드 키 전략(React key)·FLIP 또는 View Transitions API(지원 여부·폴백)·가격 숫자 전환 방식.
7. **B11 전역**: sticky 헤더 축소, 진행 표시, `scroll-margin-top` 값.
8. **점진적 향상 규칙**: 서버 HTML에 모든 텍스트가 보이고, 숨김 초기 상태는 `@media (prefers-reduced-motion: no-preference)` + `@supports` 또는 `.js` 클래스 안에서만.
9. **검증 계획**: B1~B11 ↔ 테스트/실측 매핑, 각 브라우저 항목의 관측 레시피(뷰포트·dpr·조작·측정 스크립트 요지·기대 수치), 번들 측정 스크립트, `.gitignore`의 `.lessons/` 제거.
10. 금지: `.github/**`, `design/drafts/**` 수정, 새 색·서체, 기획서 비공개 수치.

## 다음 게이트
`02-plan.md`는 G2 독립 리뷰(Reviewer: spec 충족 · 구현 가능성/번들 · 접근성·reduced-motion · 검증 계획, 85점+Blocking 0)를 받는다.
### 증강 맥락·진행 방향 (→ G2 모션 설계)
1. **버그의 진짜 원인은 전역 CSS**: `img { max-width:100% }`에 `height:auto`가 없어 HTML height 속성이 이긴다(globals.css:17–20). 이 수정은 사이트의 모든 이미지에 닿는다 → 설계는 다른 이미지(히어로·플래너 사진 등) 회귀까지 §7에 넣는다.
2. **판정은 수치로 잠겼다**: 설계의 모든 모션은 spec의 측정 가능 조건(100ms 안 시작, 450ms 종료, 1.2초 시퀀스, 진행선 2%/40–70%/98%, 막대 ±5%)을 만족하는 시간·이징이어야 한다. 섹션별 표에 그 숫자를 그대로 적는다.
3. **reduce 모드는 '정적 최종 상태'**: 진행선은 현재 스크롤 비율을 정적으로 보여 줘야 PASS(0%면 FAIL) → 스크롤 연동 값은 모션과 분리된 상태(CSS 변수)로 설계.
4. **번들 예산은 /en 참조 청크 gzip +40KB** → 라이브러리 도입은 근거 필수, 기본은 CSS + 작은 훅.
5. 기관 파트너·푸터는 정적(비목표). `.gitignore`의 `.lessons/` 제거는 B9에 포함.

