# Lessons — 20261006-kaniq-homepage

## Review tier (feature run만 — SKILL §2.2 검증 루프)
- tier: standard (가판정 standard = `review-tier --apply` 확정 standard)
- 승격: 없음
- 결함 유출: 있음 — 공개 리포 노출(가드 테스트에 비공개 KPI 수치 토큰). QA r1이 관찰로 적었으나 A9 판정 범위(`src`·README) 밖이라 PASS, Reviewer r4는 범위 밖, G5 감사(r7)에서 재발견 → PR #3로 제거. 원인은 리뷰 강도가 아니라 spec이 수치를 금지어로 직접 적은 것(아래 Learn 1).

## 규모·예상 대비 실제 (`leh.sh actual` 출력)
- size: L
| 항목 | 예상(보통) | 예상(길어지면) | 실제 | 결과 |
|---|---|---|---|---|
| 걸리는 시간 | 3시간 56분 | 8시간 53분 | 2시간 5분 | 보통보다 47% 적음 |
| 비용(API 환산) | $109.72 | $159.69 | $21.21 | 보통보다 81% 적음 |
| 토큰(참고) | 173.4M | 479.3M | 41.1M | 보통보다 76% 적음 |
| 개발 라운드 | 3회 | 5회 | 4회 | 보통보다 1회 많음 (길어지면 예상 안) |
| 리뷰·QA 라운드 | 4회 | 8회 | 12회 | 길어지면 예상보다 4회 많음 |
- 워커 실작업 합계 2시간 10분 · 세션 16개 · 오케스트레이터 세션은 미검출(토큰·비용은 워커만).
- 예산(p80) 안: 시간·비용·토큰·개발 라운드는 예 / 리뷰·QA 라운드는 아니오 — 원인 태그 `고정비(오케스트레이터 지시의 게이트 독립 리뷰)`: 사용자 지시로 G1·G2·G5에 PR 없는 게이트 리뷰 4회(r1·r2·r3·r7)가 추가됐고, fix-forward 2건(ja H1·favicon / 공개 노출)이 리뷰·QA 델타 라운드를 각각 1~2회 더했다. 재작업(CHANGES/FAIL)으로 늘어난 라운드는 G1 spec r1 1회뿐.
- 누락 역할: 없음(오케스트레이터는 측정 대상 아님).
- 오차 해석: 그린필드 정적 사이트는 L 모집단(기존 코드 회귀가 큰 run) 대비 회귀 표면이 작아 시간·비용이 하단에 몰렸다. 등급 오판이라기보다 "DB·통합 없는 그린필드 PoC"가 L 안에서 가벼운 쪽이라는 신호 — 같은 유형이 3회 쌓이면 `references/size-estimation.md` 규칙 9에 "그린필드 정적 사이트는 L 하단" 예시 추가를 제안한다. 리뷰·QA 라운드 수는 게이트 리뷰 지시가 있는 run을 별도 모집단으로 봐야 한다.

## 게이트 요약 (사용자 지시 — 게이트별 독립 리뷰 점수)
| 게이트 | 독립 리뷰 | 점수 |
|---|---|---|
| G1 결과값 | Reviewer r1 → r2 | 68 CHANGES → 90 APPROVE |
| G2 설계 | Reviewer r3 | 91 APPROVE |
| G3 구현 | Reviewer r4 → r5(델타) ‖ QA r1 → r2(델타) | 92 → 96 APPROVE / 100 → 100 PASS |
| G4 배포 | QA r3 → r4(fix-forward 운영 델타), Reviewer r6(PR #2) | 98 → 100 PASS / 96 APPROVE |
| G5 종결 | Reviewer r7(종결 감사) + r8(PR #3 보안 fix) | 91 APPROVE / 93 APPROVE |

## Consult
- 프로젝트 `.lessons/` 없음(신규 리포). 스킬 교훈 중 `leh-spawn-readiness-timeout-recovers-live-tab`(leaked 표기 → 화면 실측 후 재사용)과 `leh-stop-marks-exited-tabs-leaked`(exited 탭 leaked 표기)가 이번 run에서 그대로 재현됐다 — 전자는 신뢰 프롬프트, 후자는 stop마다 수동 close 필요.

## Learn
- depth: standard
- created:
  - `.lessons/security/public-repo-run-artifacts-must-not-quote-confidential-brief-figures.md` (high)
  - `.lessons/external-api/vercel-link-dirties-tracked-gitignore-before-prod-deploy.md` (medium)
  - `.lessons/workflow/first-spawn-in-new-repo-hits-folder-trust-prompt.md` (medium)
- 기록만(파일 없음): 오케스트레이터가 지시 노트를 따옴표 없는 heredoc(`<<EOF`)으로 쓰면서 백틱 안의 파일명(`04-review-r4.md`, `03-dev.md`)이 명령 치환으로 사라졌다 → 같은 턴에 노트를 고치고 리뷰어에게 정정 send. 백틱이 든 노트는 `<<'EOF'`(따옴표)로만 쓴다. 일반화 가치가 낮아 .lessons 파일은 만들지 않음.
- skipped: 없음
- propagate_suggested (suggest-only, 승인 전 미적용):
  - LEH SKILL §4-1 / `references/goal-resolution.md` 해상도 체크리스트에 "리포가 public이면 비공개 수치를 spec·노트·테스트에 원문으로 적지 않는다(리포 밖 패턴 파일로 대조)" 1줄 추가.
  - LEH §4-9 closeout 전제 확인에 "public 리포면 리포 밖 패턴 파일로 `.loop/<run>` 스캔" 선택 단계.
  - LEH §4-0 준비에 "새 리포 첫 run은 claude·codex 역할을 prewarm해 폴더 신뢰 프롬프트를 먼저 해소" 1줄.
  - `roles/releaser.md` CLI 배포 절에 "배포 직전 `git status --porcelain` 빈 출력 확인, `vercel link`는 .gitignore를 바꿀 수 있음".
  - `roles/qa.md` 규범에 "관찰에 공개 노출·비밀 유출이 있으면 판정 범위와 무관하게 FAIL/Blocking으로 올린다".

## Developer model canary
- snapshot: codex gpt-6.1-sol / medium / normal tier (기본 편성; A/B 종결로 배정 없음)
- first_pass: false (`model-observation.json` — G3 Reviewer r4는 APPROVE였으나 Minor 처리 r2·fix-forward r3·보안 r4로 Developer 4라운드)
- developer_rounds / seconds: 4 / 2857
- reviewer_changes / qa_fail: true(G1 spec 리뷰 r1 CHANGES가 집계됨 — 코드 리뷰 CHANGES는 0) / unknown(QA FAIL 라운드 0)
- credits / tokens: unknown — Developer가 매 라운드 "실행 표면에 계측값 없음"으로 보고, 추정하지 않음
- escalation: 없음
- review_due: false

STATUS: done
