# Review — 20261006-kaniq-homepage round 6 — PR #2

VERDICT: APPROVE

## 점수: 96/100
| 축 | 점수(/25) | 근거 한 줄 |
| 정확성(Acceptance 충족) | 24 | ja H1을 줄바꿈 없이 접으면 spec 원문과 같다. `/favicon.ico`는 200 `image/x-icon`. 줄 단위 렌더 기하는 브라우저로 다시 재지 않았다. |
| 계획 준수·코드 품질 | 24 | 제품 diff는 지시된 3파일(13 insertions / 3 deletions + ico). `design/drafts`·`.github/**`는 없다. ja font-size clamp는 `--step-3`과 최댓값이 다르다. |
| 회귀·보안 | 24 | 75 tests PASS. `/en`·`/ko`·`/ja`·`/ja/quote`의 icon 링크는 1개이고 data SVG는 없다. 견적 화면은 다시 열지 않았다. 새 입력 경로는 없다. |
| 검증 재현성 | 24 | lint·tsc·test·build·curl이 03-dev r3과 같다. 개발자가 남긴 6개 뷰포트 스크린샷은 실행하지 않음. |

통과선은 85점 이상이고 Blocking·Major 0이다. 이번 판정은 96점, Blocking 0, Major 0.

HEAD `f8904be49e076eff3ec247f01a56db8079af88f4`. `gh pr view 2`의 headRefOid와 같다. PR은 OPEN, base `main`, 파일 3개. 재실행 위치는 scratch `/private/tmp/leh-20261006-kaniq-homepage-review-cand`(porcelain 0, 같은 SHA). 메인 워크트리의 `:3000` PID 4258은 멈추지 않았다. 메모리 압력은 모든 단계가 1이었다. heap은 lint·vitest·`next start` 3072, tsc·build 6144. 한 번에 하나씩. OOM 없음. profile 갱신 요청 없음.

상태 전이 표는 해당 없다. 이 diff는 CSS·아이콘·metadata icons 삭제뿐이고, 플래그×종료 상태 같은 입력 축이 없다. `tests/`에서 H1 셀렉터를 단언하는 e2e는 없다. 계약은 `tests/dictionary.test.ts`의 `headline.join("") === fixture`이다.

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

`gh pr diff 2`와 `gh pr view 2 --json files`는 같은 3파일이다. `src/styles/globals.css`, `src/lib/seo.ts`, `src/app/favicon.ico`. 사전·fixture·`Hero.tsx`는 diff에 없다.

| 명령 | 결과 | 03-dev r3 |
|---|---|---|
| `npm ci` | scratch에서 rc 0, 374 packages. 메인 워크트리는 실행하지 않음(설치본과 lock의 버전 불일치 0, optional sharp 플랫폼 패키지만 lock에 더 있음) | 03-dev는 npm ci를 적지 않음 |
| `NODE_OPTIONS=--max-old-space-size=3072 npm run lint` | rc 0. eslint 배너만, 경고 없음 | 오류·경고 0과 같음 |
| `NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit` | rc 0, stdout 비음 | baseline 0과 같음 |
| `NODE_OPTIONS=--max-old-space-size=3072 npm test` | 9 files / 75 tests PASS. dictionary 5 포함 | 같음 |
| `NODE_OPTIONS=--max-old-space-size=6144 npm run build` | rc 0. Compiled successfully, static 17/17 | production 성공과 같음 |
| `npx next start -p 3016` 후 `curl -sI /favicon.ico` | `HTTP/1.1 200 OK`, `content-type: image/x-icon`, 본문 512 bytes, 소스 ico와 `cmp` 일치. `file`: 32×32 PNG-in-ICO | 200, image/x-icon과 같음 |
| 페이지가 가리키는 `/favicon.ico?favicon.1h34ys-3ex26n.ico` | 200, `image/x-icon` | 03-dev가 적은 쿼리와 같다 |
| `curl /ja` H1 | `<span>ソウルまで2時間。</span><span><br/>精密検診も歯科も、</span><span><br/>週末で。</span>` | 구절 3개. 줄 좌표는 실행하지 않음 |
| 브라우저 6화면·Lighthouse·`npm audit` | 실행하지 않음 | 03-dev 스크린샷을 재확인하지 않음 |

A3 fixture. `tests/fixtures/localization.ts`의 ja H1은 `ソウルまで2時間。精密検診も歯科も、週末で。`이다. 렌더 HTML에서 태그를 지운 문자열과 같다. span 사이에 공백 텍스트 노드가 없다. dictionary 테스트 5개가 이 단언을 포함해 PASS다.

접근성. 스크린리더 실기는 실행하지 않음. DOM으로 확인한 구조는 h1이 1개이고, 그 안에 span 3개와 구절 사이의 `<br>` 2개뿐이다. span에 role·aria-label·aria-hidden이 없다. `<br>`은 글자를 넣지 않아 접근 이름은 접은 원문 하나다. `white-space: nowrap`은 접근성 트리를 나누지 않는다. `<br>`은 강제 줄바꿈이라 nowrap이 구절 사이의 줄바꿈을 지우지 않는다. 소프트 랩만 구절 안에서 막는다.

아이콘. 설치된 Next 16.3.8 문서 `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/01-metadata/app-icons.md`는 `app/favicon.ico`가 `<link rel="icon" href="/favicon.ico" sizes="any" />`를 낸다고 적는다. 실측 태그는 `href="/favicon.ico?favicon.1h34ys-3ex26n.ico"` `sizes="32x32"` `type="image/x-icon"` 1개다. `/ja` `/ko` `/en` `/ja/quote` 모두 그렇다. data SVG는 이 네 응답에 없다. `seo.ts`의 `icons` data URI 삭제는 그 결과와 맞다.

범위. ja 규칙은 직접 자식 span에 nowrap, font-size `clamp(2.2rem, 1.5rem + 2vw, 3rem)`. `--step-3`은 `clamp(2.2rem, 1.5rem + 2.2vw, 3.3rem)`이다. ko 규칙 `word-break: keep-all`과 `overflow-wrap: normal`은 전역 `span { overflow-wrap: anywhere }`보다 구체적이라 한국어 어절 중간 소프트 랩을 끈다. ko 사전은 구절이 1개라 `<br>`이 없다. 실측 HTML이 그 한 문장이다.

렌더 기하(추정). 1440·768·390에서 각 구절이 한 줄을 넘지 않는지, scrollWidth가 innerWidth와 같은지는 이 라운드에서 브라우저로 재지 않았다. 셀렉터 `.hero h1:lang(ja) > span`은 실측 DOM의 직접 자식 span과 맞다.

## Blocking

없음.

## Major

없음.

## Minor

없음.

## 후속 (판정 제외)

- 줄 구성·넘침은 QA 실측 대상이다. 개발자 증적 `evidence/dev-fix-A3-{ja,ko}-{390,768,1440}.png`와 `evidence/dev-r3-h1.json`은 인용만 했다.
- VoiceOver·NVDA로 헤딩을 읽어 보지는 않았다.
- `npm audit`, Lighthouse, 견적 제출, 언어 협상 curl은 실행하지 않음. 이 커밋의 파일 목록에 그 경로가 없다.
- 메인 워크트리 `:3000`은 재시작하지 않았다. 이번 curl은 scratch의 `:3016`이고, 측정 후 프로세스를 종료했다. 3016은 닫혀 있다.

## 잘된 점

- 고친 파일이 관찰 2건(ja 구절 줄바꿈, favicon 404)에 머문다. H1 문구와 fixture는 그대로다.
- 접은 ja H1이 spec 표와 같고, 아이콘 응답 바이트가 `src/app/favicon.ico`와 같다.
- lint·tsc·75 tests·build가 03-dev r3과 같다. icon 링크는 페이지당 하나다.

STATUS: done [r6]
