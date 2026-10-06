# Releaser 지시 — G5 보안 fix 릴리즈 (PR #3 → main → Vercel production)

RELEASE_MODE: full. 사람 게이트 해당 없음. `06-release.md`의 STATUS 줄 **위에** 「G5 보안 fix (PR #3)」 절을 추가하고 STATUS를 마지막 줄로 유지한다. 산출물·커밋 메시지에 기획서 수치를 쓰지 않는다("내부 KPI 수치 토큰"이라고만).

전제: 최신 리뷰(`04-review-r*.md` 마지막) APPROVE, PR #3 head = 리뷰한 SHA.
1. `gh pr merge 3 --squash --match-head-commit <head>` → 머지 SHA → 원격 브랜치 삭제.
2. scratch `rel-main`을 머지 SHA로 옮기고 `git status --porcelain` 빈 출력 확인(기존 `.vercel/` 재사용, link 금지) → `vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=<머지 SHA>` → READY·`meta.gitCommitSha`·gitDirty 없음·두 도메인 alias가 새 배포인지 확인. (테스트 파일만 바뀌어 런타임은 같지만 A10 "운영 소스 = main SHA"를 유지하기 위해 재배포한다.)
3. 스모크: `/en` 200, `/ja` 200, `Accept-Language: ja` → 307 /ja, `/hi` 404, `/favicon.ico` 200, `/api/quote` 무효 422. `evidence/rel3-smoke.log`.
4. 롤백 방법: 직전 `dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9` promote. 실패 시 롤백하지 말고 blocked.
머지 SHA·배포·스모크가 채워지면 `STATUS: done [r3]`.
