# Releaser 지시 — G4 fix-forward 릴리즈 (PR #2 → main → Vercel production)

RELEASE_MODE: full. 사람 게이트 해당 없음. 직전 릴리즈는 `06-release.md`(PR #1 → edd3834 → dpl_HoS737…). 이번은 PR #2만. **`06-release.md`의 STATUS 줄 위에 「fix-forward (PR #2)」 절을 추가하고 STATUS를 마지막 줄로 유지**한다.

전제: 최신 리뷰(`04-review-r*.md` 마지막) APPROVE, PR #2 head = 리뷰한 SHA. `gh pr update-branch` 금지.
1. `gh pr merge 2 --squash` → 머지 SHA 기록 → 원격 브랜치 삭제.
2. 머지 SHA를 scratch 슬롯 `rel-main`으로 옮겨(`leh.sh scratch 20261006-kaniq-homepage rel-main <sha>`) **배포 전에 `git status --porcelain`이 비었는지 확인**한다. ⚠ 지난 라운드에서 `vercel link`가 `.gitignore`에 `.vercel`을 추가해 gitDirty 배포가 생겼다 — 이미 link된 `.vercel/`이 슬롯에 남아 있으면 재사용하고, link가 필요하면 link 뒤 `git checkout -- .gitignore`로 되돌린 다음 porcelain을 다시 확인하고 배포한다. 이번에는 git 연결 재시도를 하지 않는다.
3. `vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=<머지 SHA>` → READY, `meta.gitCommitSha`·gitDirty 확인, 도메인 `kaniq-homepage.vercel.app`·`kaniq-care.vercel.app`이 새 배포를 가리키는지.
4. 잔여 dirty 배포 정리: `dpl_BPKvDVVX6Ke8B89DhgpSQZcVYstX`(이전 라운드 중단, gitDirty=1)가 어떤 도메인에도 alias되지 않았음을 확인한 뒤 `vercel remove dpl_BPKvDVVX6Ke8B89DhgpSQZcVYstX --yes --scope wishket-aidp`. 다른 배포는 지우지 않는다(직전 깨끗한 배포 `dpl_HoS737…`는 롤백 대상으로 남긴다).
5. 스모크: `/en` 200, `/favicon.ico` 200, `/ja` 200, `Accept-Language: ja` → 307 /ja, `/hi` 404. `evidence/rel2-smoke.log`.
6. 롤백 방법: `vercel promote <dpl_HoS737… url> --scope wishket-aidp`. 실패 시 롤백하지 말고 blocked.
머지 SHA·배포·스모크가 채워지면 `STATUS: done [r2]`.
