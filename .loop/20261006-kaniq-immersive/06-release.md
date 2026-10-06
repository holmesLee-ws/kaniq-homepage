# Release — 20261006-kaniq-immersive
## 전제 확인
- Reviewer r6 APPROVE (95/100), QA r1 PASS 10/10(B1~B9·B11). B10은 머지 후 운영 범위.
- QA 기준 커밋 = leh.sh baseline = PR #5 head: `5f5fd82f89807e10c100bc460e008996bd259d2d`.
- 사람 게이트 해당 없음. 마이그레이션 없음. protected_paths 변경 없음.
- required_checks [] / PR 체크 없음(gh pr checks: no checks reported). 미해결 리뷰 스레드 0, 다음 페이지 없음.
- 보존 불변식: 배포 소스는 머지 SHA, 배포 직전 scratch porcelain 0, READY·gitDirty 없음·지정 alias 일치·지정 스모크 PASS.
## 동반 릴리즈 검토
없음. gh pr list --state open 결과는 대상 PR #5만. base=release=main이라 미릴리즈 base 차이 없음.
## staging: PR #5 → merge 16db6a34d47180d6c8af79f5cd3a36b84fe23479
- 별도 staging 없음. https://github.com/holmesLee-ws/kaniq-homepage/pull/5
- squash --match-head-commit 사용, mergedAt 2026-10-06T14:45:12Z.
- 원격 feat/immersive-motion 삭제 완료. gh pr update-branch 실행하지 않음.
- post-merge 워크플로 없음(.github/workflows 없음).
## production
- main squash SHA가 production 소스. 별도 release PR 없음.
- scratch rel-main: /private/tmp/leh-20261006-kaniq-immersive-rel-main
## 열차
해당 없음(base=release=main).
## Vercel
- 실행: `NODE_OPTIONS=--max-old-space-size=6144 vercel deploy --prod --yes --scope wishket-aidp -m sourceCommitSha=16db6a34d47180d6c8af79f5cd3a36b84fe23479`.
- 배포 직전/직후 scratch `git status --porcelain` 출력 0. `.vercel/project.json`만 지정 projectId/orgId로 작성(제품 ignore 적용), vercel link 실행하지 않음.
- 배포 ID: `dpl_84XGs4qiqNFkhPpXbqsKLSwQgnRD`, target production, READY, CLI rc 0.
- URL: https://kaniq-homepage-hvnyojla6-wishket-aidp.vercel.app
- Inspector: https://vercel.com/wishket-aidp/kaniq-homepage/84XGs4qiqNFkhPpXbqsKLSwQgnRD
- Vercel API `meta.gitCommitSha` = `meta.sourceCommitSha` = 머지 SHA, `gitDirty` 키 없음. 개인정보를 제외한 증적: `evidence/rel-deployment.json`.
- `vercel inspect <domain> --format=json`으로 kaniq-homepage.vercel.app와 kaniq-care.vercel.app 각각 동일 배포 ID/READY 확인.
- 빌드 성공. post-merge GitHub Actions 없음(`gh run list --branch main` = []). 원격 main 머지 SHA 일치, feature 브랜치 부재 재확인.

### 운영 스모크
| 요청 | 기대/실측 | 판정 |
|---|---|---|
| GET /en | 200 | PASS |
| GET /ko | 200 | PASS |
| GET /, Accept-Language: ja | 307 /ja | PASS |
| GET /hi | 404 | PASS |
| GET /favicon.ico | 200 | PASS |
| POST /api/quote, {} | 422 | PASS |
증적: `evidence/rel-smoke.log`. 로그인 없이 운영 도메인 직접 요청.

### 운영 B10 재확인
- 공개 페이지이므로 사용자 Chrome/login 불필요. 기존 QA Playwright 스크립트를 리포 밖에서 운영 URL로 실행했으며 QA 증적을 덮지 않았다. 시스템 Chrome headless, 계정 없음.
- B1: ko/en × 1440/390 × no-preference/reduce, DPR 2, 8/8 PASS. 사진 비율·해상도·섹션 높이·패널 노출·시차·칩 지연 충족. `evidence/rel-B1.json`, `rel-B1-{ko,en}-{1440,390}-{no-preference,reduce}.png`.
- B4: ko/en × 2모드 키보드 D0..D6 전부 PASS(D3 포함), drag D2/click D5 PASS. 강조 열·활동·표 행·오늘 목록·aria 일치. `evidence/rel-B4.json`, `rel-B4-{ko,en}-D{0,3,6}.png`.
- 실행 로그: `evidence/rel-browser.log`. B1 ko 1440/390 및 B4 ko D3 스크린샷 직접 열어 레이아웃 확인.
- B10 PASS: main 머지·운영 소스 SHA·gitDirty 없음·공개 200·운영 B1/B4 완료.
- 코드 수정·run 증적 커밋·원장 쓰기·별도 세션/서브에이전트 생성 실행하지 않음. WebKit/Firefox·실제 기기 실행하지 않음.
## 롤백 방법
직전 production `dpl_26A1HbyyNSr3ZtrrdT4KLFGEASEn`을 `vercel promote dpl_26A1HbyyNSr3ZtrrdT4KLFGEASEn --yes --scope wishket-aidp`로 promote. 실패 시 자동 롤백하지 않고 blocked 보고. 롤백 실행하지 않음.

STATUS: done
