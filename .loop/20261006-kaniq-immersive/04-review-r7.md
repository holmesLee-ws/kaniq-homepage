# Review — 20261006-kaniq-immersive round 7 — PR 없음 (G5 종결 감사)

VERDICT: APPROVE

읽기 전용. 제품 코드는 고치지 않았다. PR 코멘트는 지시대로 생략했다. 린트·타입검사·테스트·빌드·브라우저는 이 라운드 감사 목록에 없어 실행하지 않음.

점수 (통과 = 85 이상이고 Blocking·Major 0):

| 축 | 점수 | 이유 |
|---|---|---|
| Acceptance ↔ 증적 | 25 / 25 | B1~B11 체크박스가 모두 켜져 있고, 인용한 증적 경로가 있으며 QA 판정과 같다 |
| 보고 정확성 | 24 / 25 | gates.md의 라운드·점수·축별 점수·Blocking/Major 수가 04·05 원문과 같다. QA r2 본문 한 줄만 조합 수를 틀린다 |
| 잔여 위험 기록 | 25 / 25 | 가려진 CSS, 원어민 검수, 사전 공개, Vercel git 미연결, `edd3834`가 07-lessons.md에 있다 |
| 정리 상태 | 24 / 25 | 운영 SHA·HTTP 200·패턴 0건·교훈 IF-THEN이 맞다. vercel 교훈 본문과 색인이 한 문장 어긋난다 |
| 합계 | 98 / 100 | |

## 재실행 결과

이 라운드에서 돌린 것:

- `gh api repos/holmesLee-ws/kaniq-homepage/commits/main --jq .sha` → `16db6a34d47180d6c8af79f5cd3a36b84fe23479`
- `curl -sI https://kaniq-homepage.vercel.app/en` → HTTP/2 200, `cache-control: public, max-age=0, must-revalidate`. 로그인 리다이렉트 없음.
- `vercel api /v13/deployments/dpl_84XGs4qiqNFkhPpXbqsKLSwQgnRD --scope wishket-aidp --raw` (CLI 54.7.1) → `readyState` READY, `target` production, `meta.gitCommitSha` = `meta.sourceCommitSha` = 위 SHA, `gitDirty` 키 없음.
- 패턴 대조와 증적 `ls`는 아래. `rg`는 PATH에 없어(exit 127) Python 부분 문자열 대조로 대신했다. 패턴 원문과 일치 줄은 적지 않음.
- `tsc`·`next build`·vitest·eslint·브라우저 → 실행하지 않음. OOM 재시도 없음. profile 갱신 요청 없음.

## Acceptance ↔ 증적

`spec.md` 25–35행 B1~B11은 모두 `- [x]`다. QA r1은 B1~B9·B11 PASS(10/10), B10 보류. QA r2는 B10과 운영 B1·B4·B11 PASS. 체크박스의 라운드와 같다.

이번 run `evidence/`에서 인용 파일을 세었다. 없는 파일 0.

- B1: `qa-B1.json` + `{ko,en}×{1860,1440,768,390}×{no-preference,reduce}` PNG 16장.
- B2: `qa-B2.json`, `{1440,390}×{0,400,1200}` 6장, `qa-B2-reduce-{1440,390}.png`, `qa-B2-nojs.png`, `qa-B8-lh-summary.json`.
- B3: `qa-B3.json`, `qa-B3-after.png`, `qa-B9-test.log`(Tests 126 passed).
- B4: `qa-B4.json`, `{ko,en}-D{0,3,6}` 6장, 같은 테스트 로그.
- B5: `qa-B5.json`, `qa-B5a-{1,2,3}.png`, `qa-B5b-{front,back}.png`, `qa-B5c-{1440,390}-mid.png`, `qa-B5d-{hover,focus}-{1440,390}.png`, `qa-B5e-{before,after}.png`.
- B6: `qa-B6.json`, `{no-preference,reduce}×{1,2,3,done}` 8장, `qa-B9-test.log`.
- B7: `qa-B7.json`과 reduce 분기로 인용된 `qa-B4.json`·`qa-B6.json`.
- B8: `qa-B8-lh-summary.json`(중앙값 perf 97, a11y/bp/seo 100, cls 0), `qa-B8-bundle.log`(`diff=2955 B` PASS), `qa-B8-layout-focus.json`, `qa-B8-focus-*.png` 7장.
- B9: `qa-B9-{test,lint,build}.log`, `qa-B9-tsc.log`(0바이트 — QA r1의 tsc 0줄과 같다), `qa-B9-curl.log`, `qa-B9-git.log`, `qa-B9-images.json`, `{base,cand}×{hero,records}×{1440,390}` 8장.
- B10: `qa-prod-B10.log`, `qa-prod-B10-deployment.json`(READY, 위 SHA, gitDirty 키 없음), `qa-prod-B1.json` + PNG 8장, `qa-prod-B4.json` + PNG 6장.
- B11: `qa-B11.json`, `qa-B11-*.png` 8장.

직전 기준 `evidence/qa-r2-unit.log`는 이번 run 폴더가 아니라 `.loop/20261006-kaniq-homepage/evidence/qa-r2-unit.log`에 있다. Tests 75 passed. spec이 말하는 직전 기준과 같다.

QA r2가 추가로 인용한 `qa-prod-B11.json`, `qa-prod-B11-*.png` 8장, `qa-prod-regression.log`, `qa-prod-browser-errors.json`, `qa-prod-lh-summary.json`도 있다. 06-release가 인용한 `rel-smoke.log`, `rel-deployment.json`, `rel-browser.log`, `rel-B1.json`·PNG 8장, `rel-B4.json`·PNG 6장도 있다.

## 보고 정확성

gates.md와 원문:

| 원장 | 원문 |
|---|---|
| G1 r1 73 CHANGES Major 2 → r2 84 CHANGES Major 2 → r3 91 APPROVE, Minor 0 | 04-review-r1.md 73(16/17/22/18), r2.md 84(19/23/22/20), r3.md 91(23/24/22/22). Blocking 0. r3 Major·Minor 없음 |
| G2 r4 81 CHANGES Major 3 Minor 6 → r5 93 APPROVE Minor 0. 축 24/22/24/23 | 04-review-r4.md 합계 81, M1–M3, Minor 6줄(80–85행). r5.md 93, 축 같음, Major·Minor 없음 |
| G3 r6 95, 축 24/23/24/24, Minor 1. QA r1 100, 10/10 | 04-review-r6.md와 같다. Minor는 `globals.css:1090`의 가려진 `.registry img`. 05-qa-r1.md 100, B10만 보류 |
| G3 수치(시퀀스 끝 1100ms, 번들 +2,955B, Lighthouse 97/100/100/100, 테스트 126·기존 75, 헤더 78.1→57.3) | 05-qa-r1.md 9–12행·37행과 `qa-B8-lh-summary.json`·`qa-B8-bundle.log`·`qa-B9-test.log` |
| G4 QA r2 100. 축 25/25/25/25. B1 8/8, B4 4/4, B11 4/4. 머지 `16db6a3`, 배포 `dpl_84XGs4qiqNFkhPpXbqsKLSwQgnRD` | 05-qa-r2.md 9–15행. 06-release.md 스모크 표 6행 전부 PASS, 같은 SHA·배포 ID |

## 운영 일치

GitHub main, 06-release.md 10행, 05-qa-r2.md 3행·13행, `evidence/qa-prod-B10-deployment.json`, 이번 라운드 `gh`·Vercel API가 같은 SHA `16db6a34d47180d6c8af79f5cd3a36b84fe23479`다. 운영 `/en`은 HTTP 200이다. 배포는 READY production이고 `gitDirty` 키는 없다.

## 공개 리포 보안

패턴 파일 13줄. 대상은 `.loop/20261006-kaniq-immersive`, `.lessons`, `src`(이미지 확장자 제외). 일치 파일 0, 일치 횟수 0. 무관 일치(바이너리·Vercel API 숫자)로 제외한 건 없음.

이메일 형태 0건. `github.com/` 식별자는 공개 리포 슬러그 `holmesLee-ws` 7건뿐이다. 그 외 `@` 토큰은 `@media` `@keyframes` `@supports` `@import`와 패키지 태그 `@next` `@latest`다. 개인 계정명으로 볼 항목 0건.

## 잔여 위험 기록

07-lessons.md 48–52행에 다섯 가지가 있다.

- `edd3834` 히스토리 토큰, 사용자 결정 대기.
- Vercel git 미연결, CLI 배포 유지.
- `launchState: preview`와 번역 원어민 검수.
- 가려진 CSS 1개(`.registry img` 4/5가 4/3에 가려짐, 동작 무영향). 같은 항목이 04-review-r6.md 74행 Minor다.

gates.md 62행은 이 다섯을 G5 감사 입력으로 다시 적는다.

## 교훈

신규 2건은 IF-THEN, 업스트림, 검증이 있다.

- `.lessons/workflow/result-sketch-effects-each-need-an-acceptance-line.md` — 효과마다 시작·종료 ms, 대상 노드, 비율, reduce 최종 상태. 업스트림은 requirement.
- `.lessons/architecture/grid-child-scroll-wrapper-needs-min-width-zero-at-every-level.md` — grid/flex 자식마다 `min-width:0`. 업스트림은 implementation. 검증은 390px `scrollWidth`와 `minWidth === "0px"`.

수정 2건:

- `.lessons/security/public-repo-run-artifacts-must-not-quote-confidential-brief-figures.md` — 예방 규칙(리포 밖 패턴 파일, 공개 노출은 PASS와 무관하게 Blocking, closeout 전 스캔)와 검증 명령이 남아 있다. notes에 Lighthouse 원본 JSON은 요약만 공개한다고 보강돼 있다. 이 감사의 패턴 대조는 0건이다.
- `.lessons/external-api/vercel-link-dirties-tracked-gitignore-before-prod-deploy.md` — 업스트림(배포 직전 porcelain 부재, `vercel link`가 추적 파일을 바꿈)과 검증(porcelain 빈 출력, API의 gitDirty 부재)이 있다. 이번 배포는 link 없이 porcelain 0, gitDirty 키 없음으로 그 검증을 만족한다. 본문과 색인 차이는 Minor.

`_index.md`는 위 5건을 한 줄씩 가리킨다. 07-lessons.md 24–31행의 created/updated 목록과 파일 집합이 같다.

## Blocking

없음.

## Major

없음.

## Minor

- `05-qa-r2.md:14`는 운영 화면을 `16+4+4`라고 한다. 같은 파일 20행은 B1 PASS 8/8(1440·390 × ko·en × 2모드)이고, 21–22행은 B4 4/4, B11 4/4다. `gates.md:58`은 8/8·4/4·4/4로 원 표와 같다. 14행만 `8+4+4`로 고치면 된다. 판정은 바뀌지 않는다.
- `.lessons/external-api/vercel-link-dirties-tracked-gitignore-before-prod-deploy.md:38-39`의 IF-THEN은 여전히 `vercel link` 뒤 `.gitignore`를 되돌리라고 한다. `.lessons/_index.md:7`과 `07-lessons.md:31`은 link 대신 `.vercel/project.json`을 직접 쓴다고 한다. 본문 예방 규칙을 색인과 같게 고친다. 이번 배포 절차(06-release.md 22행)는 이미 직접 작성이다.

## 후속 (판정 제외)

- 07-lessons.md 48–52행의 잔여 위험 5건. 이 라운드에서 새로 재현하지 않음.
- propagate_suggested 3건(07-lessons.md 34–37행)은 승인 전 미적용으로 적혀 있다. 스킬 파일은 이 감사에서 수정하지 않음.
- 07-lessons.md 9행·17행·41–46행은 `leh.sh actual`과 model-observe 후 기입으로 비어 있다. 종결 감사 뒤 오케스트레이터 기입이다.
- WebKit·Firefox·실기기, Lighthouse 원본 JSON 재실행은 실행하지 않음.

## 잘된 점

- 게이트 원장의 점수와 라운드 번호가 리뷰·QA 원문 표와 같다. G4 수치도 배포 ID·SHA·스모크 6건까지 06-release와 같다.
- 운영 재실측 SHA가 머지 SHA와 같고 gitDirty 키가 없다. 직전 run의 gitDirty 경로를 이번 배포는 밟지 않았다.
- 공개 증적은 Lighthouse 요약 JSON만 두고, 패턴 대조 0건이다.
- B1~B11 체크박스가 로컬 QA와 운영 QA의 증적 경로를 각각 가리키고, 그 파일이 있다.

STATUS: done [r7]
