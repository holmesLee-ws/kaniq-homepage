---
id: architecture/grid-child-scroll-wrapper-needs-min-width-zero-at-every-level
tags: [css, grid, overflow, accessibility, lighthouse]
severity: low
status: active
category: architecture
domain_trace:
  business_rule: "모바일에서 가로 넘침 없이 표를 보여 준다(scrollWidth ≤ innerWidth)"
  workflow: "홈 Doctor OK 구간 — 스크러버 래퍼 추가"
  upstream_tier: implementation
  upstream_gap: "기존 스크롤 래퍼 규칙만 믿고 새로 감싼 부모의 intrinsic 최소 폭을 놓쳤다"
technical_trace:
  pattern: "grid item의 기본 min-width:auto가 자식 표의 min-content 폭을 끌어올려 overflow → Lighthouse 대비 오류로 드러남"
  layer: css
  upstream_tier: implementation
  upstream_gap: "가로 스크롤 테이블을 감싸는 새 grid 자식에 min-width:0 규칙이 없었다"
dna:
  layer: css
  pattern_type: intrinsic-size-overflow
  dependencies: []
impact_radius: {ring1_hits: [], ring2_hits: []}
source_files: [src/styles/globals.css]
root_cause_tier: 3
recurrence: 1
propagated_to: []
created: 2026-10-06
---

## 문제 패턴 (Problem Pattern)
회복 스크러버를 넣으며 표를 grid 안에서 한 단계 더 감싸자 모바일에서 텍스트가 배경 밖으로 넘쳤고, Lighthouse 접근성이 대비 오류로 97에서 100이 되지 않았다(Developer r1이 스스로 발견·수정).

## 업스트림 원인 (Upstream Cause)
- 기술: grid/flex 자식의 `min-width:auto`는 래퍼 깊이마다 다시 적용된다. 바깥 스크롤 래퍼 규칙은 새 부모를 막지 못한다.

## 예방 규칙 (Prevention Rule)
IF grid/flex 자식 안에 가로 스크롤 영역(표·코드·칩 줄)을 감싼다 THEN 스크롤 컨테이너까지 이어지는 모든 grid/flex 자식에 `min-width:0`을 준다. Lighthouse 대비 실패와 overflow가 함께 보이면 레이아웃 원인부터 본다.

## 검증 (Verification)
390px에서 `document.documentElement.scrollWidth === innerWidth`, 해당 섹션 각 래퍼의 `getComputedStyle(el).minWidth === "0px"`.
