---
id: security/public-repo-run-artifacts-must-not-quote-confidential-brief-figures
tags: [security, public-repo, confidentiality, leh, closeout, spec]
severity: high
status: active
category: security
domain_trace:
  business_rule: "고객 기획서의 비공개 수치(파트너 배분율·예산·KPI 목표)는 공개 리포에 어떤 형태로도 남지 않는다"
  workflow: "LEH spec 작성 → 금지어 가드 테스트 → closeout(.loop 전수 커밋)"
  upstream_tier: requirement
  upstream_gap: "'수치를 리포에 넣지 않는다'를 검증하려고 spec·테스트에 그 수치를 금지어로 적었다 — 검증 수단이 유출 경로가 됐다"
technical_trace:
  pattern: "금지 목록에 비밀 원문을 나열(negative regex literal) + 공개 리포에 run 증적 자동 커밋"
  layer: governance
  upstream_tier: design
  upstream_gap: "공개 리포에서 closeout이 .loop 전체를 올린다는 사실을 spec 작성 시점에 고려하지 않았다"
dna:
  layer: governance
  pattern_type: secret-in-denylist
  dependencies: [leh-closeout, github-public]
impact_radius:
  ring1_hits: [tests/guards.test.ts, .loop/20261006-kaniq-homepage/spec.md]
  ring2_hits: []
source_files: [tests/guards.test.ts]
root_cause_tier: 1
recurrence: 1
notes:
  - "2026-10-06 run 20261006-kaniq-immersive: Lighthouse 원본 JSON의 임의 소수 타이밍이 패턴 파일 항목과 우연히 부분 일치 → 공개 증적에는 점수·CLS 요약만, 원본은 커밋 제외 경로(.qa-tmp)에 둔다. 비공개 수치 원문 노출 0건(예방 규칙 준수)."
propagated_to: []
created: 2026-10-06
---

## 문제 패턴 (Problem Pattern)
공개 리포(holmesLee-ws/kaniq-homepage) run에서 오케스트레이터가 spec A4·A9에 기획서의 배분율·예산·KPI 수치를 금지어 rg 명령으로 적었고, Developer가 그대로 가드 테스트 정규식으로 옮겨 main(edd3834)에 공개됐다. QA r1이 관찰로 짚었지만 PASS 범위 밖이라 넘어갔고, G5 감사에서 재발견해 PR #3으로 제거·`.loop` 산출물은 closeout 전 `[내부수치]`로 가렸다. git 히스토리에는 남는다.

## 업스트림 원인 (Upstream Cause)
- 도메인: "비밀을 넣지 않는다"를 검증하려면 비밀을 알아야 한다 — 검증 기준을 공개 산출물에 두면 안 된다는 요구가 없었다.
- 기술: LEH closeout이 `.loop/<run>/` 전체를 base에 커밋한다는 사실과 리포 공개 여부를 spec 단계에서 교차하지 않았다.

## 예방 규칙 (Prevention Rule)
IF 리포가 public이거나 public이 될 수 있다 THEN (1) spec·디스패치·테스트에 비공개 수치 원문을 적지 않고 "리포 밖 파일(경로)의 항목과 대조"로 검증을 정의한다 — 대조 명령은 리포 밖 파일을 패턴 소스로 읽는다(`rg -f <리포 밖 패턴 파일>`) (2) QA 관찰에 "공개 리포 노출"이 나오면 PASS 여부와 무관하게 그 라운드에서 Blocking으로 다룬다 (3) closeout 전에 `.loop/<run>/`을 같은 패턴 파일로 스캔한다.

## 검증 (Verification)
`rg -f <리포 밖 패턴 파일> .` 가 리포 전체(.loop 포함)에서 0건 — closeout --dry-run 직전에 실행.
