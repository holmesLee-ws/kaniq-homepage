# Release — 20261006-kaniq-homepage

## 전제 확인 (APPROVE r5 / QA r2 PASS 9/9 / 사람 게이트: 해당 없음)
- RELEASE_MODE: full. Reviewer r5 96/100, Blocking 0. QA r2 PASS 9/9; A10은 머지 후 G4 대상.
- `leh.sh baseline` = QA 기준 커밋 = PR #1 head: `e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf`.
- PR 파일에 `.github/**`·`.claude/rules/**`·마이그레이션 없음. 보호 경로 변경 없음.
- `gh pr checks 1`: no checks reported (rc 1). required_checks=[]이고 등록된 Vercel 체크도 없었음. MERGEABLE, 미해결 리뷰 스레드 0(GraphQL, pagination 없음).
- 보존 불변식: 승인된 PR head만 squash 머지, 지정 Vercel 프로젝트/팀에 머지 SHA 소스 배포, preview 공개 모드 유지, 증적·비밀값 미커밋, 운영 실패 시 자동 롤백 없음.

## 동반 릴리즈 검토
없음. `git fetch origin` 성공; 열린 PR은 #1뿐. base=release=main.

## staging
해당 없음 — staging 없음. PR #1 → main이 production 소스다.

## production: PR #1 → merge edd3834fc6766466506c50453092a0967581af19
- PR URL: https://github.com/holmesLee-ws/kaniq-homepage/pull/1
- `gh pr merge 1 --squash --match-head-commit e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf` 성공. `--admin`·`--auto`·`--delete-branch` 사용 없음.
- 머지 시각: 2026-10-06T11:21:41Z. `gh pr view` state MERGED 및 mergeCommit 확인.
- `git push origin --delete feat/kaniq-homepage` 성공. 최종 `git ls-remote`: main = 머지 SHA, feature ref 없음.
- release 브랜치/PR·열차·post-merge workflow 없음. run 증적 커밋하지 않음.
- 등록 scratch: `/private/tmp/leh-20261006-kaniq-homepage-rel-main`, HEAD = 머지 SHA. 첫 scratch 호출은 로컬에 새 SHA가 없어 실패; `git fetch origin` 후 성공.

## Vercel
- scope: `wishket-aidp`; project: `kaniq-homepage`; project id: `prj_st04zp2ldGxa0qku1Dx60Rp6rtnS`.
- 연결 방식: **cli**. `vercel link --yes --project kaniq-homepage --scope wishket-aidp` 성공. `vercel git connect https://github.com/holmesLee-ws/kaniq-homepage --yes --scope wishket-aidp` 실패(rc 1, Failed to connect); 정확한 권한/설치 원인은 미확정. 지시된 CLI 폴백 사용.
- 최종 배포: `vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=edd3834fc6766466506c50453092a0967581af19` 성공(rc 0).
- 배포 URL: https://kaniq-homepage-c66o12l4l-wishket-aidp.vercel.app
- deployment id: `dpl_HoS737YjPzBKTUv416fLpPRM1jm1`; target production; **READY** (`vercel inspect` 및 deployments API).
- 소스: **머지 SHA 체크아웃에서 배포**. 배포 직전 `git rev-parse HEAD` = `edd3834fc6766466506c50453092a0967581af19`, `git status --porcelain` 빈 출력. 최종 API `meta.gitCommitSha`·`meta.sourceCommitSha`도 동일하며 gitDirty 필드 없음.
- 원격 build: Next.js 16.3.8, compile·TypeScript·정적 페이지 생성 성공. Releaser 로컬 lint/typecheck/test/build는 실행하지 않음 — Developer r2·Reviewer r5·QA r2 PASS 증적 인용. OOM 없음.
- 도메인 alias: **https://kaniq-homepage.vercel.app**, **https://kaniq-care.vercel.app**, https://kaniq-homepage-wishket-aidp.vercel.app. inspect/API에서 모두 최종 배포에 연결 확인. `/v9/projects/<id>/domains`에서도 두 지정 도메인 verified=true.
- 증적: `evidence/rel-deployment.json`, `evidence/rel-inspect.log`.
- 배포 대기 완료: 2026-10-06 20:22–20:23 KST, 상한 30분 이내 READY.

### 배포 중 발견·처리
`vercel link`가 `.gitignore`에 `.vercel` 한 줄을 추가했다. 이를 첫 deploy 직전 확인했으나 명령이 이미 시작되어 클라이언트를 중단(rc 130); 서버에는 `dpl_BPKvDVVX6Ke8B89DhgpSQZcVYstX`가 생성됐다(gitDirty=1). `.gitignore`를 원복하고 깨끗한 트리에서 최종 배포를 다시 실행했다. 첫 배포는 최종 릴리스 증적으로 쓰지 않는다. 제품 코드 변경·커밋 없음. 최종 도메인은 위의 깨끗한 SHA 배포를 가리킨다. `.vercel/`·토큰 커밋 없음.

## 운영 스모크 (1회)
공개 사이트 curl, 로그인/쿠키/보호 우회 없음. `evidence/rel-smoke.log` **PASS 6/6**.

| 검사 | 실제 | 판정 |
|---|---|---|
| HEAD `/en` | 200 | PASS |
| HEAD `/`, Accept-Language: ja | 307, Location `/ja` | PASS |
| HEAD `/hi` | 404 | PASS |
| POST `/api/quote`, 무효 JSON `{}` | 422, 필드 오류 목록 | PASS |
| HEAD `/sitemap.xml` | 200 | PASS |
| GET `/en` 사이트 정체성 | KANIQ 및 지정 영어 H1 확인 | PASS |

본문 증적: `evidence/rel-en.html`. 401·Vercel 로그인 302 없음. 유효 신청 제출·운영 데이터 쓰기 실행하지 않음.

## 열차
해당 없음 — base=release=main.

## 롤백 방법
롤백 실행하지 않음. 이전에 검증한 READY 배포가 있으면 `vercel promote <previous-url> --scope wishket-aidp` 또는 `vercel rollback <previous-url> --scope wishket-aidp`. 신규 프로젝트라 이번 작업 전 운영 배포는 API 목록에 없었음; 직전 중단 배포는 검증된 이전 릴리스로 간주하지 않는다. 소스 수정이 필요하면 Developer가 수정 PR·검증을 진행하고 새 운영 배포를 한다.

## 다음 게이트
G4 독립 QA: A10 + 운영 회귀 실측, 통과선 85점 이상·Blocking 0. 원장/spec 갱신은 수행하지 않음(오케스트레이터/QA 역할).


## fix-forward (PR #2)
- RELEASE_MODE: full; 사람 게이트 해당 없음. 보존 불변식: 리뷰된 PR #2 head만 머지, 깨끗한 머지 SHA 체크아웃에서 지정 프로젝트 production 배포, 두 지정 도메인의 새 배포 연결 확인, 지정 dirty 배포만 alias 없음 확인 후 삭제, 실패 시 자동 롤백 없음.
- Reviewer r6 APPROVE 96/100, Blocking/Major 0. PR head `f8904be49e076eff3ec247f01a56db8079af88f4` 일치. 최신 QA r3 PASS 10/10은 직전 릴리스 증적이며, 이번 delta는 Developer r3 실측·Reviewer r6 재검증 및 디스패치 전제로 진행.
- PR #2 파일 3개, 사람 게이트·보호 경로 변경 없음. MERGEABLE, statusCheckRollup=[], required_checks=[], 미해결 리뷰 스레드 0(페이지 끝 확인). 열린 다른 PR 없음.
- PR #2 https://github.com/holmesLee-ws/kaniq-homepage/pull/2 → squash merge `91cdbf55979d834773adb05cad07ebdf9ed34c97`, MERGED `2026-10-06T11:41:36Z`. `--match-head-commit` 사용. 원격 `fix/ja-h1-favicon` 삭제 성공, main SHA 일치·feature ref 없음.
- 등록 scratch `rel-main` HEAD가 머지 SHA이고 porcelain 빈 출력 확인. 기존 `.vercel/project.json` 재사용; link·git 연결 재시도 없음. 증적 `evidence/rel2-predeploy.log`.

### fix-forward 배포 결과
- `vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=91cdbf55979d834773adb05cad07ebdf9ed34c97` rc 0. CLI 54.7.1, 로그인 [redacted-user]. 기존 link 재사용.
- deployment id: `dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9`; URL: https://kaniq-homepage-ih0gijsur-wishket-aidp.vercel.app; target production; **READY** (inspect/API).
- `meta.gitCommitSha` = `meta.sourceCommitSha` = `91cdbf55979d834773adb05cad07ebdf9ed34c97`; gitDirty 필드 없음. 배포 직전 porcelain 빈 출력.
- `kaniq-homepage.vercel.app`·`kaniq-care.vercel.app` 각각 alias API의 deploymentId가 새 배포 id와 일치. 증적: `evidence/rel2-deployment.json`, `rel2-inspect.log`, `rel2-alias-homepage.json`, `rel2-alias-care.json`, `rel2-deploy.log`.
- 원격 production build 성공. Releaser 로컬 lint/typecheck/test/build는 실행하지 않음 — Developer r3·Reviewer r6 검증 인용. CLI heap 6144, OOM 없음.

### 잔여 dirty 배포 정리
- 대상 `dpl_BPKvDVVX6Ke8B89DhgpSQZcVYstX`의 현재 aliases endpoint 결과 `{"aliases":[]}`를 확인한 뒤 지정 `vercel remove ... --yes --scope wishket-aidp` 실행, rc 0, Removed 1 deployment.
- 상세 deployment API의 `alias` 배열은 과거 할당값이 남아 있었음. 현재 aliases endpoint 및 두 도메인의 alias API로 실제 연결 여부를 확인했다.
- 삭제 후 동일 deployment GET → Deployment not found (404). 증적: `evidence/rel2-old-dirty-aliases.json`, `rel2-remove-dirty.log`, `rel2-removed-confirm.log`.
- 다른 배포 삭제 없음. 직전 깨끗한 `dpl_HoS737YjPzBKTUv416fLpPRM1jm1`은 API READY 확인, 롤백 대상으로 보존(`evidence/rel2-rollback-deployment.json`).

### fix-forward 운영 스모크
공개 사이트 curl, 로그인·쿠키·보호 우회 없음. `evidence/rel2-smoke.log` **PASS 5/5**.

| 검사 | 실제 | 판정 |
|---|---|---|
| HEAD `/en` | 200 | PASS |
| HEAD `/favicon.ico` | 200, image/x-icon | PASS |
| HEAD `/ja` | 200 | PASS |
| HEAD `/`, Accept-Language: ja | 307, Location `/ja` | PASS |
| HEAD `/hi` | 404 | PASS |

GET `/en` 본문 KANIQ 및 새 deployment id 확인(`evidence/rel2-en.html`). 운영 신청 제출·데이터 쓰기·브라우저 시각 실측 실행하지 않음. 후속 G4 QA는 오케스트레이터/QA 역할.

### fix-forward 롤백 방법
`vercel promote https://kaniq-homepage-c66o12l4l-wishket-aidp.vercel.app --scope wishket-aidp`

롤백 실행하지 않음. 증적 커밋·원장·spec 갱신 실행하지 않음.

## G5 보안 fix (PR #3)
- RELEASE_MODE: full; 사람 게이트 해당 없음. 보존 불변식: 리뷰된 PR #3 head만 squash 머지, 깨끗한 머지 SHA에서 기존 Vercel 연결로 production 배포, 두 지정 도메인의 새 배포 연결 확인, 실패 시 자동 롤백 없음.
- Reviewer r8 APPROVE 93/100, Blocking/Major 0; head `91cdf7a4fcb681e6acf90fa8debe1781c4ecc53a` 일치. 최신 QA r4 PASS 10/10은 직전 production 증적; 이번 테스트 단언 삭제는 Developer r4·Reviewer r8 검증과 명시 디스패치 전제로 진행.
- 변경 파일 `tests/guards.test.ts` 하나, 내부 KPI 수치 토큰 단언 삭제. 사람 게이트·보호 경로 변경 없음. 다른 열린 PR 없음. required_checks=[], statusCheckRollup=[], gh pr checks는 no checks reported(rc 1). 미해결 리뷰 스레드 0, pagination 없음.
- PR https://github.com/holmesLee-ws/kaniq-homepage/pull/3 → squash merge `eb0c41a1d486f92197b892edc690deb8fdb3d0ae`, MERGED `2026-10-06T12:03:22Z`. match-head-commit 사용, 원격 `fix/remove-internal-figures` 삭제 성공.
- Vercel production 배포·검증 완료. 단계 상한 30분 이내.


### G5 배포 결과
- 등록 scratch `/private/tmp/leh-20261006-kaniq-homepage-rel-main` HEAD = `eb0c41a1d486f92197b892edc690deb8fdb3d0ae`. 배포 전·후 `git status --porcelain` 빈 출력 확인. 원격 main도 동일 SHA, 삭제한 feature ref 없음.
- 기존 `.vercel/project.json` 재사용, link 실행하지 않음. scope `wishket-aidp`, project `kaniq-homepage`, project id `prj_st04zp2ldGxa0qku1Dx60Rp6rtnS`.
- `NODE_OPTIONS=--max-old-space-size=6144 vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=eb0c41a1d486f92197b892edc690deb8fdb3d0ae` rc 0. 원격 production build 성공, CLI OOM 없음.
- deployment id: `dpl_26A1HbyyNSr3ZtrrdT4KLFGEASEn`; URL: https://kaniq-homepage-ljaa6u1e9-wishket-aidp.vercel.app; target production; **READY** (inspect 및 API).
- `meta.gitCommitSha` = `meta.sourceCommitSha` = 머지 SHA, `gitDirty` 필드 없음.
- `kaniq-homepage.vercel.app`·`kaniq-care.vercel.app` 각각 alias API deploymentId가 새 배포와 일치.
- 증적: `evidence/rel3-pr.json`, `rel3-deploy.log`, `rel3-deployment.json`, `rel3-inspect.log`, `rel3-alias-homepage.json`, `rel3-alias-care.json`.

### G5 운영 스모크
공개 사이트 curl GET 및 무효 POST, 로그인·쿠키·보호 우회 없음. `evidence/rel3-smoke.log` **PASS 6/6**.

| 검사 | 실제 | 판정 |
|---|---|---|
| GET `/en` | 200 | PASS |
| GET `/ja` | 200 | PASS |
| GET `/`, Accept-Language: ja | 307, Location `/ja` | PASS |
| GET `/hi` | 404 | PASS |
| GET `/favicon.ico` | 200 | PASS |
| POST `/api/quote`, 무효 JSON `{}` | 422 | PASS |

Releaser 로컬 lint·typecheck·test·build 및 브라우저 시각 실측은 실행하지 않음. Developer r4·Reviewer r8 검증 인용. 유효 신청 제출·원장·spec 갱신·증적 커밋 실행하지 않음.

### G5 롤백 방법
`vercel promote dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9 --scope wishket-aidp`

직전 운영 배포를 promote하는 방법만 기록. 롤백 실행하지 않음. 릴리스 실패 없음.

STATUS: done [r3]
