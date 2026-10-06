# Lessons index — kaniq-homepage

| id | category | severity | recurrence | 한 줄 |
|---|---|---|---|---|
| security/public-repo-run-artifacts-must-not-quote-confidential-brief-figures | security | high | 1 | 공개 리포에서는 비공개 수치를 spec·테스트 금지어로도 적지 않는다 — 리포 밖 패턴 파일로 대조, closeout 전 .loop 스캔, Lighthouse 원본 JSON은 요약만 공개 |
| workflow/result-sketch-effects-each-need-an-acceptance-line | workflow | medium | 1 | 결과물 스케치의 효과마다 Acceptance(시작·종료 ms, 대상 노드, 비율, reduce 최종 상태) — 전제는 확정 전 실측 |
| external-api/vercel-link-dirties-tracked-gitignore-before-prod-deploy | external-api | medium | 1 | CLI 배포 전 `vercel link`가 .gitignore를 바꿔 gitDirty 배포 → link 대신 `.vercel/project.json` 직접 작성, 배포 직전 porcelain 빈 출력 확인 |
| workflow/first-spawn-in-new-repo-hits-folder-trust-prompt | workflow | medium | 1 | 새 리포 첫 spawn에서 claude·codex 폴더 신뢰 프롬프트 → prewarm 후 화면 확인·신뢰·idle 재사용 |
| architecture/grid-child-scroll-wrapper-needs-min-width-zero-at-every-level | architecture | low | 1 | grid 안 가로 스크롤 래퍼는 부모마다 min-width:0 — Lighthouse 대비 실패가 overflow 신호 |
