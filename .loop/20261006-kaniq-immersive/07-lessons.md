# Lessons — 20261006-kaniq-immersive

## Review tier (feature run만 — SKILL §2.2 검증 루프)
- tier: standard (가판정 = `review-tier --apply` 확정)
- 승격: 없음
- 결함 유출: 없음 — G3 코드 리뷰 95·QA 로컬 100, G4 운영 100, 운영에서 새로 발견된 결함 0.

## 규모·예상 대비 실제 (`leh.sh actual` 출력)
- size: L
| 항목 | 예상(보통) | 예상(길어지면) | 실제 | 결과 |
|---|---|---|---|---|
| 걸리는 시간 | 3시간 55분 | 8시간 49분 | 1시간 43분 | 보통보다 56% 적음 |
| 비용(API 환산) | $109.72 | $159.69 | $20.28 | 보통보다 82% 적음 |
| 토큰(참고) | 173.4M | 479.3M | 33.2M | 보통보다 81% 적음 |
| 개발 라운드 | 3회 | 5회 | 1회 | 보통보다 2회 적음 |
| 리뷰·QA 라운드 | 4회 | 8회 | 9회 | 길어지면 예상보다 1회 많음 |
- 워커 실작업 1시간 44분 · 세션 11개 · 오케스트레이터 미검출.
- 예산(p80) 안: 리뷰·QA 라운드만 아니오 — 원인 태그 `고정비(게이트 독립 리뷰)`: 사용자 지시의 PR 없는 게이트 리뷰 6회(G1 3·G2 2·G5 1). 재작업(코드 CHANGES·QA FAIL)으로 늘어난 라운드는 0. 설계 단계에서 리뷰 라운드를 쓴 대신 개발은 1라운드로 끝났다(first-pass 코드).
- 오차 해석: 직전 run과 같이 그린필드 정적 사이트의 UI 개선은 L 모집단의 하단. 2건째 — 3건이 쌓이면 `references/size-estimation.md`에 "DB·통합 없는 정적 사이트 UI 개선은 L 하단" 예시 제안.

## 게이트 요약 (사용자 지시 — 게이트별 독립 리뷰 점수)
| 게이트 | 독립 리뷰 | 점수 |
|---|---|---|
| G1 결과값 | Reviewer r1 → r2 → r3 | 73 CHANGES → 84 CHANGES → 91 APPROVE |
| G2 모션 설계 | Reviewer r4 → r5 | 81 CHANGES → 93 APPROVE |
| G3 구현 | Reviewer r6 ‖ QA r1 | 95 APPROVE / 100 PASS (10/10) |
| G4 배포 | QA r2(운영) | 100 PASS |
| G5 종결 | Reviewer r7(종결 감사) | 98 APPROVE |

## Consult
- 직전 run 교훈 3건을 시작 시 적용: (1) 공개 리포 비공개 수치 — spec·노트에 원문 없이 리포 밖 패턴 파일로 대조, Developer·QA가 Lighthouse 원본 JSON의 우연 일치를 스스로 걸러 요약만 공개 (2) `vercel link` 금지 + 배포 직전 porcelain — 재발 0 (3) 새 리포 신뢰 프롬프트 — 이번 워크트리에서는 프롬프트가 뜨지 않음(리포 단위 신뢰가 저장됨).
- 스킬 교훈 `leh-stop-marks-exited-tabs-leaked`가 매 stop마다 재현(탭 exited인데 leaked 표기 → close --tab 수동).

## Learn
- depth: standard
- created:
  - `.lessons/workflow/result-sketch-effects-each-need-an-acceptance-line.md` (medium) — G1 3라운드의 원인
  - `.lessons/architecture/grid-child-scroll-wrapper-needs-min-width-zero-at-every-level.md` (low) — Developer 교훈 후보 승격
- updated:
  - `.lessons/security/public-repo-run-artifacts-must-not-quote-confidential-brief-figures.md` — Lighthouse 원본 JSON 우연 일치 노트(재발 아님: 원문 노출 0)
  - `.lessons/external-api/vercel-link-dirties-tracked-gitignore-before-prod-deploy.md` — index 문구에 `.vercel/project.json` 직접 작성 방식 반영
- 직전 run 후속 처리: 제품 `.gitignore`의 `.lessons/` 제거(PR #5) → 이번 closeout부터 교훈 파일이 리포에 실린다(직전 run 3건 포함).
- skipped: 없음
- propagate_suggested (suggest-only, 승인 전 미적용):
  - LEH `references/goal-resolution.md` 해상도 체크리스트에 "모션 효과마다 시작/종료 ms·대상 노드·reduce 최종 상태" 1줄.
  - LEH `roles/releaser.md` CLI 배포 절에 "`vercel link` 대신 `.vercel/project.json` 직접 작성".
  - LEH `leh.sh stop`: exited 탭을 stopped로 판정(스킬 교훈 recurrence 증가 보고).

## Developer model canary
- snapshot: codex gpt-6.1-sol / medium / normal tier
- first_pass: false (`model-observation.json` — 코드 리뷰 CHANGES 0이지만 게이트 리뷰 CHANGES(G1·G2 spec/plan)가 reviewer_changes로 집계됨)
- developer_rounds / seconds: 1 / 1166
- reviewer_changes / qa_fail: 코드 리뷰 CHANGES 0 / QA FAIL 0
- credits / tokens: unknown — Developer가 실행 표면에 계측값 없음으로 보고, 추정하지 않음
- escalation: 없음
- review_due: false

## 잔여 위험 (사용자 결정·후속)
- `edd3834` 히스토리의 비공개 KPI 수치 토큰(직전 run) — 히스토리 재작성은 사용자 결정 대기.
- Vercel ↔ GitHub git 미연결 — main push가 자동 배포되지 않음(CLI 배포 유지).
- 사전 공개 모드(`launchState: preview`) 유지, 번역 원어민 검수 필요.
- 가려진 CSS 규칙 1개(`.registry img` 4/5가 4/3에 가려짐, 동작 무영향) — 정리 후보.

STATUS: done
