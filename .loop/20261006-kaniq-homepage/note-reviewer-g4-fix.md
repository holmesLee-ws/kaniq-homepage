# Reviewer 지시 — G4 fix-forward 델타 리뷰 (PR #2)

PR #2(`fix/ja-h1-favicon` → main)는 G4 운영 QA(`05-qa-r3.md` 98점)의 관찰 2건(ja H1 「も、」 고아 줄바꿈, `/favicon.ico` 404)만 고친다. 근거: `note-developer-g4-fix.md`, `03-dev.md` 「r3 — G4 fix-forward」.
`gh pr diff 2`만 읽고 재실행: `npm ci`(필요 시) → lint → `npx tsc --noEmit` → `npm test` → `npm run build` → `npm start` 후 `curl -sI /favicon.ico`(200), `/ja` HTML의 H1 구조. A3 fixture(줄바꿈 접은 H1 = spec 원문)가 계속 통과하는지, 범위 밖 변경이 없는지, 접근성(H1 텍스트를 스크린리더가 이어 읽는지 — `<br>`/span 구조) 확인. 렌더 기하는 "추정"으로만.
점수 표(정확성·계획 준수/코드 품질·회귀·보안·검증 재현성, 각 /25), APPROVE = 85+ 그리고 Blocking·Major 0. `gh pr comment 2` 1회.
