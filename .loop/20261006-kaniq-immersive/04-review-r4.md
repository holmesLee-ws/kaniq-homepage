# Review — 20261006-kaniq-immersive round 4 — PR 없음 (G2 모션 설계)

VERDICT: CHANGES

대상: `.loop/20261006-kaniq-immersive/02-plan.md`. 읽기 전용. 제품 코드는 고치지 않았다.

점수 (통과 = 85 이상이고 Blocking·Major 0):

| 축 | 점수 | 이유 |
|---|---|---|
| spec 충족 | 21 / 25 | B1~B11가 §6.1에 있고, 아래 계산으로 100ms·450ms·1.2초·진행선·막대·인장 1초는 맞다. B3을 만드는 출입·intro 계약이 그 숫자를 구현에서 빠뜨릴 수 있다 |
| 구현 가능성/번들 | 18 / 25 | 라이브러리 없음, 번들 정규식은 이 저장소의 Turbopack HTML과 맞다. `data-intro`의 소유 요소와 `mergePresence`의 맨 앞 exit이 비어 있다 |
| 접근성·reduced-motion | 23 / 25 | range·inert·focus-within·진행선의 정적 값·서버 HTML 노출이 spec과 같다. 번호 색 인용과 헤더 미디어쿼리 범위만 어긋난다 |
| 검증 계획 | 19 / 25 | 레시피가 뷰포트·조작·기대 수치까지 있다. R-B1만 §6 서두의 instant 스크롤을 쓰지 않는다 |
| 합계 | 81 / 100 | |

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

03-dev.md 없음. 설계 단계라 lint·tsc·vitest·`next build`·브라우저는 실행하지 않음.

한 일:

- 계획이 인용한 줄을 소스와 대조했다. 맞는 인용: `globals.css:17–20`(height:auto 없음), `:509`(align-items:center), `:349–361`(swap), `:371–377`(520px에서 `::before` display:none), `:698–703`과 `:1465–1473`(reduce 중복), `:1119–1122`(번호 색은 pine), `JourneyPlanner.tsx:113`(ol key), `ko.ts:201·217·225`(note 문구), `tokens.css:18`(`--wrap: min(1200px, …)`), `schema.ts:35–38`(STEP_FIELDS 세 단계 필드 겹치지 않음), `build-plan.ts:72–113`(7일 5행·10일 6행), 이미지 컴포넌트는 LocalBlock·JourneyPlanner·RecordCards 세 곳뿐, `globals.css:87–90`(860px에서 `.site-nav{display:none}`).
- spec 시간 계산 (아래 「수치」).
- 비공개 패턴 13개를 `02-plan.md`·`spec.md`에 부분 문자열로 대조. 일치 0. 패턴 원문은 적지 않음.
- 번들 정규식 `[A-Za-z0-9_./~-]+`를 이전 로컬 production HTML `/tmp/review-r6/en.html`의 `/_next/static/chunks/*.js` 23곳(고유 9)에 적용. 불일치 0. 이 빌드의 청크 이름은 `3s6nzrbk-8mnv.js` 같은 해시라 `%5Blang%5D` 경로는 없다. 이번 라운드에서 빌드하지는 않았다.
- `getImageProps`의 `src`가 `w=1920`인지는 `node_modules`가 없어 실행하지 않음. 계획의 dev 실측·폴백(width 고정, 그다음 unoptimized)은 남아 있다.

### 수치 (계획 표의 ms·비율을 다시 더함)

- B2 기본 7일 5행: 일차 지연 480+4×80=800, 지속 300, 끝 1100. 10일 6행은 480+5×80+300=1180. 둘 다 ≤ 1200. 헤드라인 시작 0, 카드 240, 일차 480이라 시작 순서는 헤드라인 → 카드 → 일차.
- B3: 나감 0–180(제거 200), 들어옴 60–320, 가격 0–280. 100ms 안에 출입 둘 다 시작(들어옴 지연 60). 450ms에는 끝. 가격 문자열 5종(`planner-data.ts`)은 서로 달라 진료 변경마다 가격 애니메이션이 있다.
- B1 칩: en 4개 지연 0·90·180·270 + 320 = 590 ≤ 1200. 시차 translateY 변화는 사진 높이의 8%. `--wrap`이 1200px라 1440과 1860의 패널 폭이 같고, 직전 실측 패널 높이 447px이면 패널 bottom ≈ 88+48+447 = 583 ≤ 900.
- B5(c)·B11(a): `p=(vh−top)/(vh+height)`. 목록 중심이 화면 중심이면 p=0.5(40–70). 지나간 뒤 1, scrollY 0에서 0. 문서 진행 `y/max`도 0과 1.
- B6: 막대 scaleX는 1/3·2/3·1(오차 0, ±5% 안). 출입 시작 0과 40. 인장 560+300=860 ≤ 1000.
- B11(b): padding-block 1.25rem→0.6rem은 양쪽 1.3rem = 20.8px(루트 16px). margin-bottom 1.3rem과 같음. ≥ 8px. `--head-h` 88은 예측 펼침 높이 78보다 큼.

## Blocking (확정만. 파일:줄 · 재현 방법 · 기대 vs 실제)

없음. 구현물이 없어 브라우저로 재현한 실패는 없다.

## Major (확정 또는 "추정 — 실측 필요" 표기)

### M1. `data-intro`가 서버 섹션에 걸려 있고, 지우는 쪽은 자식 클라이언트다

계획 §3.2(167행)는 키프레임을 `.hero[data-intro]` 밑에만 두고, JourneyPlanner가 첫 조작에서 `data-intro`를 지운다고 한다. §3.4 CSS(259행)는 `.plan:not([data-intro])`일 때만 출입 애니메이션을 켠다. §4는 `Hero.tsx`를 h1의 `--i`만 고치고, `data-intro` 상태는 JourneyPlanner 수정 항목이다.

소스: `Hero.tsx:5`의 `<section class="hero">`는 서버 컴포넌트다. `JourneyPlanner.tsx:31`은 fragment를 반환하고, 그 안에 헤드라인 children과 `article.plan`이 있다. 자식은 `section.hero` 속성을 렌더로 달거나 지우지 못한다.

그대로 구현하면 둘 중 하나다.

- 속성을 `section.hero`에만 두면 조작 후에도 intro 지연(일차 480ms~)이 새 노드에 남는다. B3의 450ms 종료를 넘긴다.
- 속성을 `article.plan`에만 두면 `.hero[data-intro]`가 맞지 않아 B2 로드 시퀀스가 없다. 서버 HTML에 속성이 있어야 JS 없이도 시퀀스가 돈다는 §3.2 문장도 같이 깨진다.

어떻게: intro 속성을 JourneyPlanner가 실제로 렌더하는 요소 하나로 정한다. 키프레임 선택자를 `.plan[data-intro]`(또는 `.hero:has([data-intro])`)로 바꾸고, 출입 게이트 `.plan:not([data-intro])`와 같은 요소에서 첫 조작 렌더에 지운다. `Hero.tsx`를 클라이언트로 올리지 않아도 된다.

### M2. `mergePresence`가 목록 첫 항목이 나갈 위치를 정하지 않는다

§3.4(249행 주석)는 exit을 prev 자리에 끼운다고 하고, 254행 규칙은 「prev에서 바로 앞에 있던 남는 key 뒤에」만 말한다. 앞에 남는 key가 없을 때는 없다.

그 경우가 B3 표의 두 축이다.

- 진료 변경: D0 항목은 Treat·Move 순서다(`build-plan.ts:79–83`). Treat가 목록 첫 항목이라 앞에 남는 키가 없다.
- 일수 변경: 홈 라벨 span은 자식이 하나다(D6↔D4↔D9). 남는 형제가 없다. §3.4 표와 R-B3는 이 라벨을 나가는 노드로 센다.

앞에 남는 키가 없을 때 구현이 exit을 빼면, 진료·일수 변경에서 `[data-presence=exit]`가 없어 B3(a)가 실패한다.

어떻게: 254행에 「앞에 남는 키가 없으면 그 목록의 맨 앞에 exit을 둔다」를 넣는다. `tests/presence.test.ts`에 (1) 첫 항목만 교체 (2) 길이 1 목록의 키 교체 두 경우를 넣는다.

### M3. R-B1이 해시 이동의 끝난 프레임을 재지 않는다

§6 서두(524행)는 `scroll-behavior: smooth` 때문에 측정 이동은 `scrollTo({behavior:"instant"})`라고 한다. R-B1(546행)은 `/ko#care`·`/en#care`를 열고 600ms만 기다린다. instant도 `scrollend`도 없다.

B1(c)의 `getBoundingClientRect`와 B1(d)의 칩 `animation-delay`는 `#care`가 도착한 뒤, 그리고 `[data-inview]`가 붙은 뒤의 값이다. smooth 해시 스크롤이 600ms 안에 끝나지 않거나 IO 콜백이 그 전이면, 맞는 레이아웃도 h2가 화면 밖이거나 칩 지연이 0s로 읽힌다.

어떻게: R-B1을 load 뒤 `scrollTo({top: careOffset, behavior:"instant"})`로 `#care`를 고정하고, `.care-chips li`의 `animation-name`이 붙은 뒤(또는 `data-inview` 확인 뒤) 측정하게 고친다. 600ms 고정 대기를 판정 조건으로 두지 않는다.

## Minor

- §3.2 표 25행의 끝 ≤480은 지연식과 안 맞는다. 앰버서더 점은 3행×4열이다(`en.ts:425–441`). 지연 (열−1)×90+(행−1)×40의 최댓값은 270+80=350, 지속 220, 끝 570. spec B5(e)는 순서를 요구하고 상한 ms는 없다. 표의 480만 고치면 된다.
- §3.6(c)는 기본 번호 색이 `var(--text-3)`라고 한다. `globals.css:1119–1122`는 `var(--pine)`이다. 미도달을 text-3로 바꾸는 설계라면 「현재 pine, 미도달만 text-3」로 고친다.
- §3.10이 `:87–94` 전체를 `.site-head-in`으로 옮기라고 한다. 그 블록의 `.site-nav{display:none}`(87–90행)은 그대로 둬야 390에서 내비 숨김이 유지된다. 옮길 선언은 `.site-head{justify-content}`뿐이다.
- §3.7 완료 인장의 `stroke-dasharray: var(--len)`에 `--len`을 넣는 방법이 없다. 애니메이션은 끝나므로 B6의 finished 판정은 통과할 수 있으나, 선이 안 그려진다. path 길이 또는 `pathLength="1"`을 적는다.
- §3.8 주석은 ProblemSteps의 `data-reached`를 갱신한다고 하지만 `frame()` 코드는 `--p`만 쓴다. B5(c) 비율은 `--p`로 충족된다. 번호 색을 유지하려면 `reachedSteps(p)`를 `#trust-steps`에 쓰는 한 줄을 코드 블록에 넣는다.
- R-B5a는 `scrollIntoView` 다음 프레임에 T=700을 건다. `data-inview` 전에 걸면 재생 시각이 0이 아니다. `data-inview`를 확인한 뒤 `currentTime`을 건다.

## 후속 (판정 제외 항목: 부채·tooling·환경특정)

- `getImageProps`가 돌려주는 `src`의 `w=` 값은 이번 환경에 `node_modules`가 없어 실행하지 않음. 계획의 dev 확인( natural 1280×1600, 아니면 width 고정 → unoptimized )으로 남긴다.
- 390 섹션 높이와 헤더 펼침 높이는 계획도 추정으로 두고 실측 분기를 적었다. 기하 추정만으로 Major로 올리지 않았다.
- Lighthouse·rAF 비용은 실측 전이다. 스크롤 핸들러는 요소 2개의 rect를 읽고 CSS 변수만 쓴다. 판정은 R-B8에 맡긴다.
- 노드 검증 명령은 돌리지 않았다. 메모리 압력·OOM 재시도 없음.

## 잘된 점

- 섹션 동사가 세우기·바꿔 끼우기·시차·인쇄·뒤집기·잇기·펼치기로 갈라져 있다. 섹션마다 같은 페이드업이 아니다. 모션은 상태·진행·관계에 붙어 있다.
- 스크롤 값은 transition 없는 CSS 변수다. reduce에서도 진행선이 현재 비율이고, 0%로 비지 않는다. `animation-timeline`을 버린 이유(reduce kill-switch가 진행선을 0으로 만듦)가 B7과 맞다.
- 모션 라이브러리를 넣지 않는다. 번들 스크립트는 `/en` 문서가 참조하는 청크만 gzip하고, 위 실측 HTML에서 정규식이 청크를 빠뜨리지 않았다.
- srcset을 빼는 이유(밀도 보정 naturalWidth)가 G1의 744×929 실측과 같다. 전역 `img{height:auto}`의 회귀를 §7에 레지스트리 사진까지 넣었다.
- B4 aria는 `D{d} — rows[rowIndex].note`이고 rowIndex가 0,1,1,2,2,2,3이다. ko note 「진료 당일」「회복과 문화」「의료진 경과 확인 후」와 R-B4 기대 문자열이 같다. 스크러버는 `input[type=range]`다.
- 카드는 숨은 면에 `inert`+`aria-hidden`, 버튼은 면 밖이다. 템플릿은 `:hover`와 `:focus-within`. 하이드레이션 전에는 두 면이 보인다.
- 기관 파트너·푸터는 파일 목록에 없다. `.github/**`·`design/drafts/**`·새 서체 없음. `#fff`와 `rgba(255,255,255,…)`는 기존 `globals.css`에 있다. 비공개 패턴 일치 0.

STATUS: done [r4]
