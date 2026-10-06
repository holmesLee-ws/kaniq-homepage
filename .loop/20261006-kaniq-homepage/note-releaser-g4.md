# Releaser 지시 — G4 배포 (PR #1 → main → Vercel production)

RELEASE_MODE: full  (사용자 원문: "github이랑 vercel에 배포까지 해 줘" — staging 없음)
사람 게이트: 해당 없음(`.github/**`·마이그레이션 없음)

`roles/releaser.md`를 따르되 이 리포는 **base == release == main**이고 staging이 없다. PR #1의 main squash 머지가 곧 production 반영이므로 `release/*` 브랜치·릴리즈 PR은 만들지 않는다. run 증적(`.loop/`)은 커밋하지 않는다.

## 전제 (하나라도 아니면 STATUS: blocked)
- 최신 리뷰 APPROVE: `04-review-r*.md` 중 마지막. 최신 QA PASS: `05-qa-r*.md` 중 마지막, `## 기준 커밋`이 `bash ~/.claude/skills/loop-engineering-holmes/scripts/leh.sh baseline 20261006-kaniq-homepage` 와 같아야 한다.
- PR #1 head SHA가 그 기준 커밋과 같다(`gh pr view 1 --json headRefOid`). `gh pr update-branch` 금지.

## 절차
1. 동반 검토: `git fetch origin`, `gh pr list --state open` — PR #1 외 없으면 "없음".
2. `gh pr checks 1`(required_checks 없음 — Vercel 체크가 생겼으면 green 확인) → `gh pr merge 1 --squash` (`--admin`/`--auto`/`--delete-branch` 금지) → 머지 SHA 기록 → `git push origin --delete feat/kaniq-homepage`.
3. Vercel 연결 (scope `wishket-aidp`, project `kaniq-homepage`, id `prj_st04zp2ldGxa0qku1Dx60Rp6rtnS` — framework=nextjs, ssoProtection=preview 이미 설정됨):
   - 먼저 git 연결을 시도: 머지 SHA를 `scratch`(`leh.sh scratch 20261006-kaniq-homepage rel-main <merge-sha>`)로 체크아웃한 경로에서 `vercel link --yes --project kaniq-homepage --scope wishket-aidp` 후 `vercel git connect https://github.com/holmesLee-ws/kaniq-homepage --yes --scope wishket-aidp`. 성공하면 main 푸시가 자동 배포를 만든다 — 머지 SHA의 production 배포가 생기는지 확인(`vercel ls kaniq-homepage --scope wishket-aidp --prod`, 또는 `vercel api /v6/deployments?projectId=…&target=production`의 `meta.githubCommitSha`).
   - git 연결이 실패하거나 10분 안에 머지 SHA 배포가 안 생기면 폴백: 같은 scratch 경로(머지 SHA, 깨끗한 트리)에서 `vercel deploy --prod --yes --scope wishket-aidp` . 배포 URL과 `vercel inspect <url> --scope wishket-aidp`로 READY 확인. 소스 SHA는 "머지 SHA 체크아웃에서 배포"로 기록하고 `git rev-parse HEAD`를 함께 남긴다.
   - `.vercel/`·토큰을 커밋하지 않는다. 비밀값을 산출물에 쓰지 않는다.
4. 도메인: production 배포가 `kaniq-homepage.vercel.app`(보조 `kaniq-care.vercel.app`)에 붙었는지 확인(`vercel api /v9/projects/prj_st04zp2ldGxa0qku1Dx60Rp6rtnS/domains`).
5. 스모크 1회(공개 사이트 — 로그인 없음, 읽기만): `curl -sI https://kaniq-homepage.vercel.app/en` 200(401·Vercel 로그인 302면 실패), `curl -sI -H 'Accept-Language: ja' https://kaniq-homepage.vercel.app/` → 307 /ja, `/hi` 404, `/api/quote` 무효 본문 422, `/sitemap.xml` 200. 결과를 `.loop/20261006-kaniq-homepage/evidence/rel-smoke.log`에.
6. 실패 시 롤백하지 않는다 — 증상·추정 원인·롤백 방법(이전 배포 promote 또는 `vercel rollback`)을 쓰고 `STATUS: blocked prod 스모크 실패`.

## 대기
배포 빌드 대기는 이 라운드 안에서 바운디드(상한 30분). 기다리는 동안 `06-release.md`에 `대기 중: <무엇> · 시작 <시각> · 상한 <시각>`을 갱신한다.

## 산출물 `06-release.md`
roles/releaser.md 형식 + 「Vercel」 절(연결 방식 git|cli, 배포 URL, deployment id, 소스 SHA, 도메인 alias). 머지 SHA·배포 URL·스모크가 채워지면 그 자리에서 `STATUS: done`.

## 다음 게이트
G4 독립 리뷰 = QA 운영 실측(A10 + 운영 회귀). 통과선 85점 + Blocking 0.
