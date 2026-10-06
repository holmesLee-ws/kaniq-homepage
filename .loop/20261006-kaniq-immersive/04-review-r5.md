# Review — 20261006-kaniq-immersive round 5 — PR 없음 (G2 모션 설계 재리뷰)

VERDICT: APPROVE

대상: `.loop/20261006-kaniq-immersive/02-plan.md` r2. 읽기 전용. 제품 코드는 고치지 않았다.

점수 (통과 = 85 이상이고 Blocking·Major 0):

| 축 | 점수 | 이유 |
|---|---|---|
| spec 충족 | 24 / 25 | B1~B11가 §6.1에 있고, 아래 계산으로 100ms·450ms·1.2초·진행선·막대·인장 1초·앰버서더 점 570이 맞다. B3 출입·intro가 같은 요소에서 열리도록 바뀌었다 |
| 구현 가능성/번들 | 22 / 25 | `article.plan`이 `section.hero`의 직계 자식이라 `:has(> .plan)`이 성립한다. 맨 앞 exit 규칙과 `data-roll`이 코드로 적혀 있다. `getImageProps`의 `w=`는 이번에도 실행하지 않음 |
| 접근성·reduced-motion | 24 / 25 | 번호 기본색 pine 유지, 미도달만 text-3, `data-reached`가 `frame()`에 있다. `.site-nav{display:none}`은 이동 대상에서 빠졌다. 인장은 `pathLength="1"` |
| 검증 계획 | 23 / 25 | R-B1은 instant 스크롤 뒤 `data-inview`와 칩 `animationName`을 보고 잰다. R-B5a는 그 확인 뒤에 `currentTime`을 건다 |
| 합계 | 93 / 100 | |

## r4 지적 대조

### M1. `data-intro` 소유 — 해소

§3.2(167–182행)는 intro 속성을 `article.plan#plan-card` 하나로 두고, 키프레임을 `.hero:has(> .plan[data-intro])`(표 #1~#3)와 `.plan[data-intro]`(#4~#7)로 나눈다. 첫 조작 렌더에서 같은 요소의 속성을 지워 `.plan:not([data-intro])` 출입 게이트(§3.4, 275–280행)가 같은 커밋에 열린다. §4는 `Hero.tsx`에 `data-intro`를 달지 않는다.

소스: `Hero.tsx:5`는 서버 `<section class="hero">`이고 자식은 `JourneyPlanner`뿐이다. `JourneyPlanner.tsx:31`은 fragment이고, `:32–99`의 `div`(children·`form#planner`·견적 링크)와 `:100` `article.plan#plan-card`를 반환한다. fragment는 DOM 노드가 아니므로 `article.plan`은 `section.hero`의 직계 자식이다. `.hero > .plan`이 맞다. `QuoteStartLink.tsx:15`는 `<a>`라 `#planner ~ a`(174행)도 그 형제에 맞다. 서버 첫 렌더의 `touched=false`는 `data-intro=""`를 HTML에 남긴다.

`data-roll`(281행)은 게이트가 열릴 때 기존 `#price > span`이 `price-roll`에 새로 맞는 것을 막는다. 가격이 바뀔 때만 `rolled:true`이고, 일수·인원만 바뀌면 key와 속성이 그대로다.

### M2. `mergePresence` 맨 앞 exit — 해소

§3.4(270행): prev에만 있는 key는 앞에 있던 남는 key 뒤에 exit으로 끼우고, **그 앞에 남는 key가 없으면 결과 맨 앞에 exit**을 둔다. 같은 앵커의 exit은 prev 순서를 유지하고, exit은 빼지 않는다고 적혀 있다. 예로 D0의 첫 항목 Treat와 자식 1개인 home 라벨을 든다.

소스: `build-plan.ts:79–83`의 D0 `items`는 Treat가 첫 항목이다. `JourneyPlanner.tsx:119–121`의 라벨은 `<span>` 하나다. §4 `tests/presence.test.ts`(528행)에 (1) `[A,B]→[C,B]` ⇒ `[A:exit, C:enter, B:stay]` (2) `[D6]→[D9]` ⇒ `[D6:exit, D9:enter]`가 있다.

### M3. R-B1 측정 시점 — 해소

§6 서두(544행)의 instant 스크롤을 R-B1(566–571행)이 쓴다. load → `#care` 문서 위치에서 `scroll-margin-top`을 뺀 `scrollTo({behavior:"instant"})` → rAF 2회 뒤 `scrollY` 오차 ≤ 1 → no-preference는 `.local-panel[data-inview]`와 `.care-chips li`의 `animationName !== "none"`(3000ms 타임아웃=실패) 뒤에 `getBoundingClientRect`와 `animationDelay`를 읽는다. 600ms 고정 대기는 없다. reduce는 `data-inview`만 기다린다.

### Minor 6건

- 앰버서더 점 끝 시각 — 해소. §3.2 표 #25는 지연 (열−1)×90+(행−1)×40, 3행×4열 최대 270+80=350, 지속 220, 끝 ≤570이다. `en.ts:425–441`은 행 3개, `Ambassador.tsx:51`은 `[1,2,3,4]` 네 칸이다. 350+220=570.
- 번호 색 — 해소. `globals.css:1119–1122`는 `color: var(--pine)`이다. §3.6(c)(378행)는 그 값을 유지하고 미도달만 `var(--text-3)`로 바꾼다. 선택자는 `#trust-steps[data-reached="N"]`(N=0..3). `data-reached`가 없으면 전부 pine이다.
- §3.10 이동 범위 — 해소. 466행은 `:91–93`의 `justify-content`와 `:1457–1459`의 `gap`만 옮기고 `.site-nav{display:none}`(`:88–90`)은 남긴다. 소스와 같다. `:87`은 `@media` 시작, `:88–90`이 nav, `:91–93`이 justify-content, `:1457–1459`가 `gap: 1rem`이다. §7(712행)도 같은 줄이다. `:41–46`은 41행 주석을 포함하지만 display·align-items·gap·padding-block은 43–46행에 있어 옮길 선언은 맞다.
- 완료 인장 — 해소. §3.7(413행)은 `pathLength="1"`, `stroke-dasharray:1`, `stroke-dashoffset` 1→0, 날인 지연 560+지속 300=860이다.
- `frame()`의 `data-reached` — 해소. §3.8(440행) `steps.dataset.reached = String(reachedSteps(ps[si]))`. `reachedSteps`(448행)는 `min(4, floor(p*4+0.5))`로 §3.6(c)와 같다. `ProblemSteps.tsx:11–18`의 `ol.steps` 자식은 `li`뿐이라 `li:nth-child`가 단계 번호와 맞는다. 계획의 진행선 `div`는 ol 밖이다.
- R-B5a — 해소. 622행은 `scrollIntoView({behavior:"instant"})` 뒤 `data-inview`와 `.seal` 애니메이션 생성을 확인하고 나서 `pause()` + `currentTime = T`를 건다. T=700·1150·1800은 표 #16–#19의 끝(줄 640, 합계 1100, 인장 1750)과 맞다.

새 Major·새 Minor 없음.

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

03-dev.md 없음. 설계 단계라 lint·tsc·vitest·`next build`·브라우저는 실행하지 않음. 무거운 검증을 돌리지 않아 메모리 압력·OOM 재시도도 없음.

한 일:

- 위 인용 줄을 소스에서 다시 열었다. 맞는 인용: `Hero.tsx:5`, `JourneyPlanner.tsx:31·100·119–121`, `QuoteStartLink.tsx:15`, `build-plan.ts:79–83`, `Ambassador.tsx:51`, `en.ts:425–441`, `ProblemSteps.tsx:11–18`, `globals.css:17–20`(height:auto 없음)·`:42–47`·`:88–93`·`:349–361`(swap)·`:509`(align-items:center)·`:1119–1122`·`:1457–1459`, `ko.ts:201·217·225`(note), `tokens.css:18`(`--wrap`).
- 가격 문자열은 `src/content/shared/planner-data.ts`에 진료 5종이고 서로 다르다(값은 적지 않음). 진료 변경마다 `#price` 애니메이션 조건이 있다.
- 비공개 패턴 13개를 `02-plan.md`·`spec.md`에 부분 문자열로 대조. 일치 0. 셸의 `rg`는 PATH에 없어(rc 127) 같은 13개를 리터럴로 세었다. 패턴 원문은 적지 않음.
- spec 시간 계산 (아래). 번들 정규식은 r2에서 바꾸지 않았다. 이번 라운드에서 HTML에 다시 적용하지는 않음(r4에서 청크 23곳 불일치 0).

### 수치 (계획 표의 ms·비율을 다시 더함)

- B2 기본 7일 5행: 일차 지연 480+4×80=800, 지속 300, 끝 1100. 10일 6행은 480+5×80+300=1180. 둘 다 ≤ 1200. 헤드라인 시작 0, 카드 240, 일차 480.
- B3: 나감 0–180(제거 200), 들어옴 60–320, 가격 0–280. 100ms 안에 출입 둘 다 시작(들어옴 지연 60). 450ms에는 끝.
- B1 칩: 지연 0·90·180·270 + 320 = 590 ≤ 1200.
- 앰버서더 점: 최대 지연 350 + 220 = 570.
- B5(c)·B11(a): `p=(vh−top)/(vh+height)`. 목록 중심이 화면 중심이면 p=0.5(40–70). 지나간 뒤 1, scrollY 0에서 0. 문서 진행 `y/max`도 0과 1.
- B6: 막대 scaleX는 1/3·2/3·1(오차 0, ±5% 안). 출입 시작 0과 40. 인장 560+300=860 ≤ 1000.
- B11(b): padding-block 1.25rem→0.6rem은 양쪽 1.3rem = 20.8px(루트 16px). ≥ 8px. `--head-h` 88은 예측 펼침 78보다 큼.

## Blocking (확정만. 파일:줄 · 재현 방법 · 기대 vs 실제)

없음. 구현물이 없어 브라우저로 재현한 실패는 없다.

## Major (확정 또는 "추정 — 실측 필요" 표기)

없음.

## Minor

없음.

## 후속 (판정 제외 항목: 부채·tooling·환경특정)

- `getImageProps`가 돌려주는 `src`의 `w=` 값은 이번 환경에서 실행하지 않음. 계획의 dev 확인(natural 1280×1600, 아니면 width 고정 → unoptimized)으로 남긴다.
- 390 섹션 높이와 헤더 펼침 높이는 계획도 추정으로 두고 실측 분기를 적었다.
- Lighthouse·rAF 비용은 실측 전이다. 판정은 R-B8에 맡긴다.
- 노드 검증 명령은 돌리지 않았다.

## 잘된 점

- r4의 세 Major가 같은 요소·같은 문장·같은 레시피로 닫혔다. intro 소유, 출입 게이트, 가격 재생 방지가 한 프레임으로 맞다.
- 섹션 동사가 갈라져 있고 스크롤 값은 transition 없는 CSS 변수다. reduce에서도 진행선이 현재 비율이다.
- 모션 라이브러리가 없다. 기관 파트너·푸터는 파일 목록에 없다. `.github/**`·`design/drafts/**`·새 서체 없음. 비공개 패턴 일치 0.
- B4 aria는 `D{d} — rows[rowIndex].note`이고 rowIndex가 0,1,1,2,2,2,3이다. ko note 「진료 당일」「회복과 문화」「의료진 경과 확인 후」와 같다.

STATUS: done [r5]
