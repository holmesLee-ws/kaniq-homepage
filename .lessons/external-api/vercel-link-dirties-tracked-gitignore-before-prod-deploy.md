---
id: external-api/vercel-link-dirties-tracked-gitignore-before-prod-deploy
tags: [vercel, deploy, release, git, provenance]
severity: medium
status: active
category: external-api
domain_trace:
  business_rule: "운영 배포는 리뷰·QA를 통과한 커밋과 바이트 단위로 같은 소스여야 한다(A10 SHA 일치)"
  workflow: "release — CLI 폴백 배포(vercel deploy --prod)"
  upstream_tier: design
  upstream_gap: "Releaser 지시서가 'scratch 체크아웃에서 link 후 deploy'만 적고, link가 추적 파일을 바꾼다는 전제를 다루지 않았다"
technical_trace:
  pattern: "도구의 초기화 명령이 작업 트리의 추적 파일(.gitignore)을 수정 → gitDirty 배포"
  layer: deploy
  upstream_tier: design
  upstream_gap: "배포 직전 porcelain 빈 출력 확인이 절차에 없었다"
dna:
  layer: deploy
  pattern_type: provenance-drift
  dependencies: [vercel-cli]
impact_radius:
  ring1_hits: []
  ring2_hits: []
source_files: [.gitignore]
root_cause_tier: 2
recurrence: 1
propagated_to: []
created: 2026-10-06
---

## 문제 패턴 (Problem Pattern)
Vercel git 연결이 실패해 머지 SHA 체크아웃에서 `vercel link` → `vercel deploy --prod`로 폴백했다. `vercel link`가 `.gitignore`에 `.vercel` 한 줄을 추가해 첫 production 배포가 gitDirty=1로 생성됐다(run 20261006-kaniq-homepage, 중단 후 원복·재배포, 잔여 배포는 fix-forward 때 삭제).

## 업스트림 원인 (Upstream Cause)
- 도메인: "운영 소스 = 검증 커밋" 불변식을 배포 직전에 기계로 확인하는 단계가 지시서에 없었다.
- 기술: CLI 초기화 명령(`vercel link`)이 추적 파일을 바꿀 수 있다는 전제를 다루지 않았다.

## 예방 규칙 (Prevention Rule)
IF CLI로 production을 배포한다 THEN (1) `vercel link`를 쓰지 않고 `.vercel/project.json`(projectId·orgId)을 직접 작성한다 — 제품 `.gitignore`가 `.vercel/`을 무시하는지 확인 (2) 배포 명령 직전에 `git status --porcelain`이 빈 출력인지 확인하고 (3) 배포 후 deployments API의 `meta.gitCommitSha`·gitDirty 부재를 증적으로 남긴다. (2026-10-06 run 20261006-kaniq-immersive에서 이 방식으로 재발 0)

## 검증 (Verification)
`git status --porcelain` 빈 출력 로그 + `vercel api /v13/deployments/<id>`의 `meta.gitDirty` 부재.
