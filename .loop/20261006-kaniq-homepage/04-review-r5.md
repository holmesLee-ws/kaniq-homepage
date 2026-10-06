# Review — 20261006-kaniq-homepage round 5 — PR #1

VERDICT: APPROVE

## 점수: 96/100
| 축 | 점수(/25) | 근거 한 줄 |
| 정확성(Acceptance 충족) | 24 | r4의 `ja ;q=0.9` 셀이 307 `/ja`로 닫혔다. negotiate 20 tests에 그 헤더와 `ko ; q=0.5, en;q=0.4` → ko가 있다. A7 기하는 이번 델타에서 다시 재지 않았다. |
| 계획 준수·코드 품질 | 24 | 델타 3파일(4 insertions / 2 deletions). `className={"cta"}` 변이는 guards FAIL이다. `design/drafts`·`.github/**`는 이 범위에 없다. |
| 회귀·보안 | 24 | 견적·메신저·비밀 경로는 이 커밋이 건드리지 않는다. r4 재실행을 유지하고 이번 라운드에서 다시 돌리지 않았다. |
| 검증 재현성 | 24 | lint rc 0, tsc rc 0, test 9 files / 75 tests가 03-dev r2와 같다. `npm run build`·브라우저는 실행하지 않음. |

통과선은 85점 이상이고 Blocking·Major 0이다. 이번 판정은 96점, Blocking 0, Major 0. r4는 92점(정확성 23, 계획 22, 회귀 24, 검증 23)이었다.

HEAD `e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf`. 비교 범위는 `4be4286d59ea116bedaf1034284b0106871bd4f2..e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf`. 재실행 위치는 이 워크트리(깨끗한 HEAD, porcelain 0). 메모리 압력은 1이었다. lint·tsc·test는 한 번에 하나씩 돌렸다. heap은 lint·vitest 3072, tsc 6144. OOM 없음. profile 갱신 요청 없음.

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

`git diff --stat`와 `gh pr diff 1`의 해당 파일은 같은 3파일이다. PR 전체 파일 목록은 r1 산출물이 포함돼 더 길다. 이번 판정은 델타만 읽었다.

| 명령 | 결과 | 03-dev r2 |
|---|---|---|
| `NODE_OPTIONS=--max-old-space-size=3072 npm run lint` | rc 0, eslint 배너만 | 오류·경고 0과 같음 |
| `NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit` | rc 0, stdout 비음 | baseline 0과 같음 |
| `NODE_OPTIONS=--max-old-space-size=3072 npm test` | 9 files / 75 tests PASS. negotiate 20, guards 1 | 같음 |
| `npm run build`, `npm ci`, 브라우저, `npm audit` | 실행하지 않음 | 03-dev 값을 재확인하지 않음 |

델타 내용:

- `src/lib/i18n/negotiate.ts`: 태그 토큰을 `tag.trim()`으로 넘긴다. q 파싱·정렬·fallback은 그대로다.
- `tests/negotiate.test.ts`: `ja ;q=0.9` → ja, `ko ; q=0.5, en;q=0.4` → ko.
- `tests/guards.test.ts`: `className` 뒤 공백, 큰따옴표·작은따옴표 리터럴, `{ "…" }`·`{ '…' }`·템플릿을 본다.

## Minor 재현

언어 태그 공백. 이미 떠 있는 `next-server` PID 35446, cwd가 이 워크트리, 기동 20:15:20 KST. 내가 빌드하거나 서버를 띄우지는 않았다. 리다이렉트는 따라가지 않았다.

| 헤더 | 기대 | 실제 |
|---|---|---|
| `ja ;q=0.9` | 307 `/ja` | 307 `/ja`, `Vary: Accept-Language` |
| `ko ; q=0.5, en;q=0.4` | 307 `/ko` | 307 `/ko`, `Vary: Accept-Language` |
| `en; q=0.1, ja;q=0.9` | 307 `/ja` | 307 `/ja` |

r4에서 같은 `ja ;q=0.9`는 307 `/en`이었다. 단위 테스트 20건도 PASS다.

CTA 가드. `src/components/layout/SiteFooter.tsx`의 `className="site-foot"`를 `className={"cta"}`로 바꾼 뒤 `npx vitest run tests/guards.test.ts`는 rc 1, 1 failed. 메시지는 그 정규식에 `<footer className={"cta"}>`가 걸린다는 AssertionError다. `finally`에서 원문 바이트를 되돌렸다. 이후 `git status --porcelain`과 `git diff --stat`은 비었다. 이 형태는 커밋에 없다.

## Blocking

없음.

## Major

없음.

## Minor

없음. r4의 두 Minor는 위 재현으로 닫혔다.

## 후속 (판정 제외)

- 정규식은 `className={cn("cta")}` 같은 호출은 보지 않는다. 현재 `src/**/*.tsx`의 비리터럴 className은 `schibsted.variable`과 `"y"`/`"n"`뿐이라 이번 소스에는 세 번째 CTA가 생기지 않는다. 재현으로 연 결함은 아니다.
- A2·A5·A7 기하, Lighthouse, `npm audit`, A10 머지는 실행하지 않음.
- 견적 본문·preview 메신저·금지어 rg는 r4 결과를 유지한다. 이 커밋의 파일 목록에 해당 경로가 없다.

## 잘된 점

- 고친 범위가 지적한 3파일에 머문다. 태그 trim은 q 계산과 fallback을 바꾸지 않는다.
- 가드는 리터럴 `className={"cta"}`를 실패시키고, 변이 파일은 커밋 밖에 남는다.
- lint·tsc·75 tests가 03-dev r2와 같다.

STATUS: done [r5]
