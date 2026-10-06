# Review — 20261006-kaniq-homepage round 7 — G5 종결 감사 (PR 코멘트 생략)

VERDICT: APPROVE

## 점수: 91/100
| 축 | 점수(/25) | 근거 한 줄 |
| Acceptance↔증적 대응 | 23 | A1~A10 체크박스의 증적 경로를 전수 `ls`했고 비어 있는 파일은 없다. QA 판정은 모두 PASS다. A10 증적 줄은 r3에서 멈춘다. |
| 보고 정확성 | 22 | 게이트 총점·판정·이름 붙은 축 점수는 04/05 원문과 같다. r4 축 점수가 최종 96점 옆에 라운드 없이 있고, 07-lessons 파일은 없다. |
| 잔여 위험 기록 | 24 | 원어민 검수·preview·git 미연결·audit high 5·NoFallbackError가 03-dev·06-release·README 중 한 곳 이상에 있다. |
| 정리 상태(교훈·운영 일치) | 22 | 교훈 2건은 IF-THEN·업스트림·검증이 있다. 오늘 실측 SHA·200·배포 id가 06-release·QA r4와 같다. 공개 테스트에 기획 수치 리터럴이 남는다. |

통과선은 85점 이상이고 Blocking·Major 0이다. 이번 판정은 91점, Blocking 0, Major 0.

## 재실행 결과 (명령 → 결과)

코드 수정·PR 코멘트·lint·tsc·vitest·build는 실행하지 않음. 이미지 픽셀은 열지 않음. 메모리 압력 조회와 OOM 재시도는 해당 없음.

| 확인 | 결과 | 대조 |
|---|---|---|
| A1~A10에 적힌 evidence 경로 전수 | 파일 있음, 크기 0인 파일 없음. A3 이름 지정 15장 15/15. A6 ja 1~6장. `qa-browser.json` 키에 A2·A3·A5·A6·A7 있음 | spec 체크박스·QA r1~r4 판정 PASS와 일치 |
| `gh api repos/holmesLee-ws/kaniq-homepage/commits/main --jq .sha` | `91cdbf55979d834773adb05cad07ebdf9ed34c97` | 06-release.md 67행, 05-qa-r4.md 3행과 같음 |
| `curl -sI https://kaniq-homepage.vercel.app/en` | `HTTP/2 200`, `server: Vercel`, `x-matched-path: /en`. location 없음 | QA r4 공개 접근 25와 같음 |
| 같은 URL GET에서 `data-dpl-id`만 추출 | `dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9`, 본문에 KANIQ | 06-release.md 72행, QA r4와 같음 |
| `vercel api` deployments `dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9` (`?slug=wishket-aidp`, `--scope wishket-aidp --raw`) | READY, target production, `meta.gitCommitSha` = `meta.sourceCommitSha` = 위 main SHA. meta 키에 gitDirty 없음. CLI 54.7.1 | 06-release.md 73행, QA r4 47행과 같음 |
| `origin/main` 추적 트리에서 기획 수치·비밀 패턴 | `.loop`·`.lessons` 없음. `src/`·`README.md`·`design/`에 해당 리터럴 0건. 비밀 접두(sk_live_, AKIA, private key, ghp_) 0건. `tests/guards.test.ts` 28·31행에 부정 정규식 리터럴. `package-lock.json`의 CPL 검색 1건은 integrity 해시 `CpLORg`라 기획 수치가 아님 | QA r1 50행이 이미 기록. A9 실행 범위(`src`·README) 밖 |

## Blocking
없음.

## Major
없음.

## Minor
- `spec.md` 67행: A10은 `[x]`이고 QA r3 PASS 경로(`evidence/qa-prod-A10.log`, `qa-prod-regress.log`, `qa-prod-browser.json`, `qa-prod-*.png`)는 실재한다. 그 배포는 `edd3834` / `dpl_HoS737…`이다. 현재 운영은 QA r4 PASS(`91cdbf5` / `dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9`)이고 증적은 `evidence/qa-prod2-A10.log`, `qa-prod2-regress.log`다. 67행 끝에 그 두 경로와 QA r4 PASS를 붙이면 체크박스가 지금 배포를 가리킨다.
- `gates.md` 48행: 「Reviewer 축별: 정확성 23 · 계획 준수/코드 품질 22 · 회귀·보안 24 · 검증 재현성 23」은 04-review-r4.md의 92점 축이다. 합은 92다. 최종 리뷰 96점의 축은 04-review-r5.md(정확성 24·계획 24·회귀 24·검증 24)이고, 그 숫자는 47행 괄호에 이미 있다. 48행 앞에 「r4」를 붙이면 해소된다.
- `gates.md` 72행: heredoc 백틱 치환을 `07-lessons`에 기록했다고 적혀 있다. 워크스페이스에 `07-lessons*` 파일이 없고, 그 문구는 gates.md에만 있다. 72행을 「기록하지 않음」으로 고치거나, `.loop/20261006-kaniq-homepage/07-lessons.md`에 그 한 단락을 만들고 경로를 72행에 적으면 해소된다.
- 공개 `tests/guards.test.ts` 28·31행에 리드·예산·CPL 토큰이 부정 정규식으로 있다. A9 명령 범위는 `src`와 README라 QA r1 PASS는 유지된다. 리터럴을 조각 결합으로 바꾸거나, README에 가드 패턴으로 남긴다고 한 줄을 넣으면 「리포에 없다」는 문장과 파일이 맞는다.

## 후속
- `.lessons/` 두 파일의 `propagated_to`는 비어 있다. IF-THEN을 LEH spawn 절차와 Releaser 체크리스트로 옮기는 일은 이 run의 산출물 밖이다.
- 06-release.md는 git connect 실패(26행)와 preview 유지(8행)를 적는다. NoFallbackError와 dev audit high 5건은 03-dev.md 177·178행에만 있다. README는 원어민 검수(9행)와 `launchState: preview`(7행)를 적는다.

## 잘된 점
- 체크박스 10개의 경로가 QA가 적은 PASS 증적과 어긋나지 않고, 파일도 비어 있지 않다.
- gates.md의 라운드 총점(G1 68→90, G2 91, G3 리뷰 92→96 · QA 100, G4 QA 98→100 · 리뷰 96)과 Blocking·Major 개수는 원문 판정 문장과 같다. G2 Minor 항목은 5개다.
- 오늘 main SHA, production 200, 배포 id, gitCommitSha, gitDirty 부재가 06-release와 QA r4와 같다.
- 교훈 두 건은 문제 패턴, 업스트림 원인, IF-THEN 예방 규칙, 검증 방법을 갖췄고 `_index.md`의 id·한 줄과 같다.
- 기획서 원장과 `.loop/`는 공개 트리에 없다.

## 잔여 위험이 적힌 곳
- 원어민 검수: README.md 9행, 03-dev.md 175행.
- `launchState: preview`: README.md 7행, 06-release.md 8행, 03-dev.md 109행.
- Vercel git 미연결(자동 배포 없음, CLI 배포): 06-release.md 26행. fix-forward는 재연결을 하지 않음(68행).
- dev 의존성 audit high 5건, production 0건: 03-dev.md 101·178행.
- 2단계 언어 404의 `NoFallbackError` 서버 로그: 03-dev.md 177행. 응답은 404.

STATUS: done [r7]
