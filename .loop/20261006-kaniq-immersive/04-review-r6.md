# Review — 20261006-kaniq-immersive round 6 — PR #5

VERDICT: APPROVE

대상: https://github.com/holmesLee-ws/kaniq-homepage/pull/5 (`feat/immersive-motion` → `main`, head `5f5fd82f89807e10c100bc460e008996bd259d2d`). 읽기 전용. 제품 코드는 고치지 않았다. 재실행은 scratch `/private/tmp/leh-20261006-kaniq-immersive-review-verify` (같은 head). 렌더 기하·스크린샷·Lighthouse는 다시 찍지 않았다. QA가 같은 시각에 브라우저를 재므로 여기서는 추정으로 단정하지 않는다.

점수 (통과 = 85 이상이고 Blocking·Major 0):

| 축 | 점수 | 이유 |
|---|---|---|
| 정확성 | 24 / 25 | B4 매핑·aria, presence 맨 앞 exit·길이 1 교체, 런타임·접근성 구조, 견적 검증 순서를 코드와 단위 테스트로 확인했다. 브라우저 시점 수치는 이 라운드에서 실행하지 않음 |
| 계획 준수/코드 품질 | 23 / 25 | §4 파일과 일치한다. `LanguageSwitcher.tsx` 한 줄은 계획 밖이나 B8 이름 일치 수정으로 타당하다. 죽은 `aspect-ratio` 규칙 1개가 남아 있다 |
| 회귀·보안 | 24 / 25 | 사전 공개·24시간 문구·CTA 가드·견적 422/저장 없음 테스트가 그대로 통과했다. 비공개 패턴 0건, `design/drafts` diff 없음. 로컬 서버 curl은 실행하지 않음 |
| 검증 재현성 | 24 / 25 | scratch에서 lint·tsc·test·build를 순차로 재실행했고 `03-dev.md`와 같다. 브라우저 실측은 실행하지 않음 |
| 합계 | 95 / 100 | |

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

메모리 압력은 전 구간 2. tsc·build는 6144, lint·test는 3072. 한 번에 하나씩. OOM 없음. profile 갱신 요청 없음.

- `npm ci` → 패키지 374, rc 0. lock·의존성 diff 없음. audit high 5는 기존 의존성 경고(의존성 파일 무변경).
- `NODE_OPTIONS=--max-old-space-size=3072 npm run lint` → rc 0, 경고·오류 없음. `03-dev.md`와 일치.
- `NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit` → rc 0. baseline 0과 일치.
- `NODE_OPTIONS=--max-old-space-size=3072 npm test` → 13파일, 126건 PASS (`recovery-day` 36, `presence` 5, `planner` 21, `quote-route` 1, `launch` 5, `guards` 1 포함). `03-dev.md`의 126건과 일치.
- `NODE_OPTIONS=--max-old-space-size=6144 npm run build` → Next.js 16.3.8 성공, rc 0. 라우트 표만 출력(First Load JS 줄 없음). `03-dev.md`와 일치.
- `git diff origin/main -- design/drafts` → 출력 없음.
- `git check-ignore -v .lessons/_index.md` → 출력 없음, rc 1 (무시하지 않음).
- 비공개 패턴 파일 13개로 PR diff 39개 파일을 대조 → 일치 0건. 패턴 원문과 일치 줄은 적지 않음.
- Lighthouse, 브라우저 기하, 참조 청크 gzip 비교, curl → 실행하지 않음.

`git diff origin/main --stat`은 39파일, +1540/−316. `package.json`·lock·`design/drafts`·`.github`·API 라우트는 없다.

## 전이 표 (코드로 확정, 빈 칸 없음)

회복 일차 `recoveryDay()` (`src/lib/recovery/recovery-day.ts`). 행은 0부터. aria는 `D{column} — {rows[rowIndex].note}`.

| d | rowIndex | 표 행(1부터) | 활동 |
|---|---|---|---|
| 0 | 0 | 1행 | `column >= okFromDay`인 행 |
| 1, 2 | 1 | 2행 | 같음 |
| 3, 4, 5 | 2 | 3행 | 같음 |
| 6 | 3 | 4행 | 같음 |

경계: −1→0, 7→6, 2.6→3. `tests/recovery-day.test.ts`가 `LANGS` 5개 × d 0..6에서 column, rowIndex, aria(그 언어 사전의 note), activeRuleIds를 단언한다. 36건이 실행되어 PASS. 사전 문구를 테스트에 다시 박아 두지 않고 사전과 비교한다. ko·en·ja·id·mn의 `scrub.label` / `todayTitle` / `todayNone`은 계획 §3.5 표와 같다.

`mergePresence` (`tests/presence.test.ts`, 5건 PASS):

| 이전 | 다음 | 결과 |
|---|---|---|
| A, B | C, B | A:exit, C:enter, B:stay (exit가 맨 앞) |
| D6 | D9 | D6:exit, D9:enter |
| A, B, C, D | A, E, D | A:stay, B:exit, C:exit, E:enter, D:stay |
| A:exit, C:enter, B:stay | A, B | A:enter, C:exit, B:stay, key 중복 없음 |
| A, B | B, A | B:stay, A:stay |

React key는 일차 `slot`(5·7·10일 모두 슬롯 유일, `planner.test.ts`가 단언), 라벨 문자열, 항목 `track|text`다. stay는 같은 key를 유지하고 exit key는 next에 없다.

`usePresence`는 `prefers-reduced-motion: reduce`이면 exit을 만들지 않고 다음 목록만 stay로 둔다. 이 분기의 단위 테스트는 없다. 구현은 읽었고, 동작 실측은 QA(B7).

견적 단계 (`QuoteForm.tsx`): 빈 값·검증 실패는 `validateStep` 실패 시 `changeStep`을 호출하지 않는다. 통과한 뒤에만 단계를 바꾼다. 최종 단계는 `validateQuote` 후 `POST /api/quote`. 422면 해당 단계로 되돌리고 오류를 보여 준다. 저장·로그 호출은 이 파일이 새로 만들지 않았다. `tests/quote-route.test.ts`는 그대로이며 422 3건과 fetch·console 미호출을 단언하고 PASS. leave 노드는 220ms 뒤 제거, `inert` + `aria-hidden`. reduce면 leave 노드를 만들지 않는다. 단계별 `name`은 겹치지 않는다.

카드 (`RecordFlip.tsx`): 서버·JS 없음(`mounted` false)에서는 두 면 모두 inert가 아니다. 마운트 후 숨은 면만 `inert`와 `aria-hidden`. 버튼 `aria-pressed`가 `on`과 같다. Enter/Space는 버튼의 기본 동작이다.

## Blocking

없음.

## Major

없음.

## Minor

- `src/styles/globals.css:1090`의 `.registry img { aspect-ratio: 4/5 }`는 같은 특이도의 `:1668` `aspect-ratio: 4/3`에 가려진다. 실제로 적용되는 값은 계획 §7의 4/3 폴백이다. 앞의 4/5 규칙은 동작에 영향이 없다.

## 후속 (판정 제외)

- 브라우저 수치(B1~B7, B11), Lighthouse, 참조 청크 gzip, curl 언어 협상·404·초기 HTML은 실행하지 않음. QA 실측 범위.
- `npm audit` high 5. `package.json`·lock 무변경. 이번 범위 밖.
- WebKit·Firefox·실기기는 실행하지 않음.
- 의존성 audit와 Next `NoFallbackError` 서버 로그는 이번 diff 밖이다. 재현하지 않음.

## 잘된 점

- `MotionRuntime`는 scroll을 `{ passive: true }`로 듣고, `raf`가 있을 때 다시 예약하지 않는다. 언마운트에서 `io.disconnect()`, scroll·resize 해제, `cancelAnimationFrame`, `data-enhanced` 삭제를 한다. IO가 없으면 리스너를 달기 전에 반환한다. `--p`·`--doc-p`에는 transition을 걸지 않는다.
- 내용의 `opacity: 0`은 `@media (prefers-reduced-motion: no-preference)` 안에만 있다. 칩·영수증·앰버서더 점은 거기에 더해 `[data-enhanced] … :not([data-inview])`일 때만 숨긴다. `data-enhanced`는 클라이언트 효과에서만 붙는다. 히어로 숨김은 같은 미디어 쿼리의 `animation-fill-mode: both` from 프레임이다. reduce 블록은 `animation/transition: none !important` 하나다. 라디오를 시각적으로 숨기는 `opacity: 0`(`.chips input`, `.give input`)은 모션 숨김이 아니다.
- 범위 입력은 `<label for="scrub-day">`, `min=0 max=6 step=1`, `aria-valuetext`가 `recoveryDay`의 aria와 같다. 보이는 `D{n}`은 `aria-hidden`이다. 포커스 링은 `.scrub input:focus-visible`이다.
- 템플릿 미니 일정은 서버 HTML에 있고, `:hover`와 `:focus-within` 모두에서 펼쳐진다. 이 규칙은 reduce 미디어 쿼리 밖이라 축소 모드에서도 펼침이 남는다. 링크에 `aria-describedby`가 있다.
- 헤더 축소는 `data-compact`일 때 padding·로고 scale만 바꾸고, 로고 링크와 언어 `summary`를 DOM에서 빼지 않는다. `scroll-margin-top`은 `--head-h: 88px`다.
- `LanguageSwitcher.tsx`는 §4에 없다. diff는 `aria-label`을 `"{언어}: {표시 이름}"`으로 바꾼 한 줄뿐이다. 표시 텍스트가 접근 이름에 포함된다. 메뉴 동작은 그대로다. B8 접근성 100을 위한 수정으로 인정한다.
- `LocalBlock`은 `getImageProps`의 `srcSet`을 버리고 단일 `img`만 둔다. 전역 `img { height: auto }`가 있고 `.plan-photo`는 `height: 120px`로 남는다. 860px 이하에서 진료찾기 패널이 사진보다 먼저다.
- `launchState === "preview"` 가드, 메신저 `href` null, 24시간 문구 정규식(`tests/launch.test.ts`)이 PASS. CTA 클래스 소유 가드(`tests/guards.test.ts`)가 PASS. 플래너 A2(일수·인원에서 가격 동일, 인원에서 첫 날 이후 일정 동일)와 slot 단언이 PASS.
- `.gitignore`는 `.lessons/` 한 줄만 빠졌다. 교훈 본문은 이 PR에 없다. `.loop/`는 여전히 무시된다.

STATUS: done [r6]
