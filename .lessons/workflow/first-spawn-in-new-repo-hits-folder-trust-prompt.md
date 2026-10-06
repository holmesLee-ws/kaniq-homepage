---
id: workflow/first-spawn-in-new-repo-hits-folder-trust-prompt
tags: [leh, orca, spawn, trust, new-repo]
severity: medium
status: active
category: workflow
domain_trace:
  business_rule: "워커 탭은 로그인된 TUI가 준비된 상태에서만 지시를 받는다"
  workflow: "LEH 새 리포 첫 run — spawn/prewarm"
  upstream_tier: design
  upstream_gap: "새 리포·새 워크트리 준비 단계에 TUI별 폴더 신뢰 1회 승인이 없다"
technical_trace:
  pattern: "claude·codex가 처음 보는 폴더에서 신뢰 프롬프트를 띄워 readiness 판정 실패 → 탭 leaked, dispatch 거부(trust gate unresolved)"
  layer: orchestration
  upstream_tier: design
  upstream_gap: "spawn이 신뢰 프롬프트를 감지만 하고 해소 경로를 오케스트레이터 절차로 안내하지 않는다"
dna:
  layer: orchestration
  pattern_type: readiness-gate
  dependencies: [orca, claude-code, codex-cli]
impact_radius:
  ring1_hits: []
  ring2_hits: []
source_files: []
root_cause_tier: 2
recurrence: 1
propagated_to: []
created: 2026-10-06
---

## 문제 패턴 (Problem Pattern)
새 리포의 첫 run에서 claude(Designer)·codex(Developer) 탭이 "이 폴더를 신뢰하는가" 프롬프트에 멈춰 leaked로 표시되고 dispatch가 `trust gate unresolved`로 거부됐다. 오케스트레이터가 화면을 읽고 신뢰를 선택한 뒤 idle로 돌려 재사용해 해소했다(run 20261006-kaniq-homepage). grok은 프롬프트가 없었다.

## 업스트림 원인 (Upstream Cause)
- 도메인: 사용자가 만들라고 한 리포라 신뢰는 자명하지만, 그 판단을 언제 누가 하는지 절차가 없다.
- 기술: LEH §4-0 준비 단계에 TUI별 폴더 신뢰 승인이 없고, spawn은 감지(fail-closed)만 한다.

## 예방 규칙 (Prevention Rule)
IF 오케스트레이터가 새 리포/새 워크트리에서 첫 run을 연다 THEN 첫 dispatch 전에 claude·codex 역할을 `--prewarm`으로 띄우고, `terminal read --screen`에서 신뢰 프롬프트가 보이면 사용자가 그 리포 생성을 요청한 경우에 한해 신뢰를 선택한 뒤 `status=idle`로 돌려 재사용한다(§1b). 신뢰 판단 근거를 log.md에 한 줄 남긴다.

## 검증 (Verification)
첫 dispatch 전 `leh.sh status`에 leaked 워커 0, log.md에 신뢰 승인 근거 줄.
