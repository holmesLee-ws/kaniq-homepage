# Releaser 지시 — G4 배포 (PR #5 → main → Vercel production)

RELEASE_MODE: full. 사람 게이트 해당 없음(`.github/**`·마이그레이션 없음). base == release == main, staging 없음 — PR squash가 production 소스다. run 증적(.loop/.lessons)은 커밋하지 않는다. 산출물·커밋 메시지에 기획서 비공개 수치·개인정보를 쓰지 않는다.

전제(아니면 blocked): 최신 `04-review-r*.md` APPROVE, 최신 `05-qa-r*.md` PASS이고 `## 기준 커밋` = `leh.sh baseline 20261006-kaniq-immersive` = PR #5 head. `gh pr update-branch` 금지.

1. 동반 검토(`gh pr list --state open`). 2. `gh pr merge 5 --squash --match-head-commit <head>` → 머지 SHA → 원격 브랜치 삭제.
3. scratch 슬롯 `rel-main`을 머지 SHA로(`leh.sh scratch 20261006-kaniq-immersive rel-main <sha>`). `.vercel/project.json`은 직전 run과 같은 값(`{"projectId":"prj_st04zp2ldGxa0qku1Dx60Rp6rtnS","orgId":"team_rdnNbKGm0IMlks5tTYKYUk5X"}`)으로 직접 써 넣고 `vercel link`는 쓰지 않는다(교훈: link가 .gitignore를 오염). `.vercel/`은 제품 .gitignore가 무시한다 — 배포 직전 `git status --porcelain` 빈 출력 확인.
4. `vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=<머지 SHA>` → READY, `meta.gitCommitSha`·gitDirty 없음, `kaniq-homepage.vercel.app`·`kaniq-care.vercel.app` alias가 새 배포인지.
5. 스모크: `/en` 200, `/ko` 200, `Accept-Language: ja` → 307 /ja, `/hi` 404, `/favicon.ico` 200, `/api/quote` 무효 422. `evidence/rel-smoke.log`.
6. 롤백 방법: 직전 production(`dpl_26A1HbyyNSr3ZtrrdT4KLFGEASEn`) promote. 실패 시 롤백하지 말고 blocked.
머지 SHA·배포·스모크가 채워지면 `STATUS: done`. 06-release.md 형식은 roles/releaser.md + 「Vercel」 절.
