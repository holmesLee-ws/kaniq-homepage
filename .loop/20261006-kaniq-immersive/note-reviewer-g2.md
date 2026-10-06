# Reviewer 지시 — G2 게이트 독립 리뷰 (모션 설계 02-plan.md, PR 없음)

대상 `.loop/20261006-kaniq-immersive/02-plan.md`. `roles/reviewer.md` 형식으로 계획의 실현 가능성·검증 가능성을 판정한다. 읽기 전용.

읽을 것: 02-plan.md, spec.md(B1~B11 동결본), gates.md(G1 → G2 증강 맥락 5항목), 현재 소스(계획이 인용한 파일:줄을 표본 확인), `/frontend-design` 원칙(섹션마다 같은 페이드업 반복 금지·모션은 상태/진행/관계 전달).

판정:
1. B1~B11 전 항목이 §6에 매핑되고 관측 레시피(뷰포트·dpr·조작·측정 요지·기대 수치)가 있는가. 설계의 시간·이징이 spec 수치(100ms 시작·450ms 종료·1.2초 시퀀스·진행선 2/40–70/98%·막대 ±5%·인장 1초)를 실제로 만족하는가 — 표의 숫자로 계산해 확인.
2. G1 증강 맥락 반영: 전역 `img` height:auto 수정의 사이트 전체 회귀(§7), reduce 모드의 정적 최종 상태(진행선이 현재 비율), 번들 근거, 기관 파트너·푸터 정적.
3. 접근성: 카드 뒤집기(보이는 면만 접근)·스크러버(`input range`·aria-valuetext)·템플릿 펼침(focus)·sticky 헤더 포커스·점진적 향상(서버 HTML 노출).
4. 구현 리스크: MotionRuntime의 scroll/rAF 비용(Lighthouse Perf ≥90·CLS ≤0.02), React key 출입 노드 보존 방식, 서버/클라이언트 경계, 번들 측정 스크립트의 정확성.
5. 금지 위반 없음(`.github/**`, `design/drafts/**`, 새 색·서체, 비공개 수치).

점수 표: spec 충족 · 구현 가능성/번들 · 접근성·reduced-motion · 검증 계획 (각 /25). APPROVE = 85+ 그리고 Blocking·Major 0. 지적은 "계획 §어디를 어떻게".
