---
id: workflow/result-sketch-effects-each-need-an-acceptance-line
tags: [spec, acceptance, motion, ui, leh]
severity: medium
status: active
category: workflow
domain_trace:
  business_rule: "사용자가 본 결과물 스케치의 모든 효과는 QA가 PASS/FAIL로 닫을 수 있어야 한다"
  workflow: "LEH G1 spec 작성 — 결과물 스케치 → Acceptance 번역"
  upstream_tier: requirement
  upstream_gap: "스케치에만 있고 Acceptance에 없는 효과(일정선 그리기·사진 시차·헤더 축소)와 '애니메이션 있음' 수준의 검증 문장이 남았다"
technical_trace:
  pattern: "모션 요구를 존재 여부(getAnimations>0)로만 검증 — 서로 다른 구현이 모두 PASS"
  layer: spec
  upstream_tier: requirement
  upstream_gap: "모션 Acceptance에 시점(시작 ms·종료 ms)·대상 노드·비율·reduce 최종 상태가 없었다"
dna:
  layer: spec
  pattern_type: unverifiable-acceptance
  dependencies: [playwright]
impact_radius: {ring1_hits: [], ring2_hits: []}
source_files: []
root_cause_tier: 1
recurrence: 1
propagated_to: []
created: 2026-10-06
---

## 문제 패턴 (Problem Pattern)
run 20261006-kaniq-immersive의 G1 spec이 독립 리뷰 3라운드(73 → 84 → 91)를 탔다. 결과 상자의 효과 일부가 Acceptance에 없었고, 모션 검증이 "애니메이션 개수 > 0"이라 어떤 구현도 PASS할 수 있었으며, 사전 배열 인덱스와 빌드 로그 줄 같은 전제가 실측되지 않았다.

## 업스트림 원인 (Upstream Cause)
- 도메인: 스케치 → Acceptance 번역 체크가 "모든 문장이 항목이 됐는가"를 보지 않았다.
- 기술: 모션은 시점·대상·비율·축소 모드로만 판정 가능한데 그 축을 spec 단계에서 정하지 않았다.

## 예방 규칙 (Prevention Rule)
IF spec 결과물에 모션·인터랙션 효과가 있다 THEN 효과마다 Acceptance 한 줄을 두고 (1) 트리거 후 시작 상한(ms)·종료 상한(ms) (2) 애니메이션 대상 노드(출입·이동 구분) (3) 스크롤 연동이면 위치별 비율 (4) reduce 모드의 정적 최종 상태를 적는다. 인덱스·로그 줄·파일 경로처럼 검증이 기대는 전제는 spec 확정 전에 소스에서 실측한다.

## 검증 (Verification)
spec 결과 상자의 효과 동사 수 = Acceptance 중 모션 항목이 덮는 효과 수, 각 항목에 ms·노드·reduce 문구 존재.
