# Review — 20261006-kaniq-immersive round 2 — PR 없음 (G1 스펙 재리뷰)

VERDICT: CHANGES

## 직전 지적
- M1 해소 — 일정선은 B2(26행), `#care` 시차·칩 지연·데스크톱 패널 전체는 B1(25행), 스크롤 진행·sticky 축소·앵커 여백은 B11(35행)에 수치로 있다. 390·768에서 메신저·특화의 뷰포트 포함은 빠졌다. 이건 아래 Minor로 둔다. 1860에서 보고된 빈 왼쪽은 1440·1860의 패널 전체 조건으로 닫힌다.
- M2 B3 해소 — 27행이 100ms 안의 서로 다른 출입 노드, `#price` 애니메이션, 450ms 종료를 요구한다.
- M2 B4 미해소 — 28행 (b)의 행 번호와 (d)의 `recovery.rows[행]`이 한 칸 어긋난다. 아래 Major.
- M2 B5(c) 해소 — 29행에 0%대·중앙 40–70%·지난 뒤 98%·되돌리면 감소가 있다.
- M2 B6 해소 — 30행에 100ms, 막대 1/3·2/3·3/3 ±5%, 인장 1초 안 `finished`, A6 유지가 있다.
- M2 B8 문장은 반영됐다 — 32행이 기준 `7379aa5`, `/[lang]` First Load JS gzip 한 줄, 청크 합 금지를 적는다. 그 한 줄은 이 리포의 `next build` 로그에 없다. 아래 Major.
- r1 Minor 7건은 반영됐다. 8행 원인(height 속성·`w=750`·`align-items: center`·패널 611×447), B1 `deviceScaleFactor: 2`와 natural 폭·높이, B2 0/400/1200ms와 빈 저장소, B5(a) 3장과 1회, B7 비모션 렌더·진행선, B9 75건 로그와 `git check-ignore`, 62행 Organizations·푸터 정적.

## 점수: 84/100
| 축 | 점수(/25) | 근거 한 줄 |
|---|---|---|
| 판정 가능성 | 19 | B1·B2·B5·B6·B7·B9·B10·B11은 수치·명령이 있다. B4 배열 식과 B8 로그 줄은 그대로 두면 PASS/FAIL이 갈린다. |
| 사용자 의도 정합 | 23 | 결과 상자 14·15·21행이 B1·B2·B11로 닫힌다. 15행의 「함께 보임」은 390·768 Acceptance보다 넓다. |
| 범위 적정성 | 22 | Organizations·푸터 모션이 비목표다. L은 홈 모션과 견적 폼 모션 한 run과 같다. |
| 리스크 | 20 | 점진적 향상·reduced-motion·Lighthouse·A1~A9·비공개 수치 금지가 유지된다. 번들 40KB는 실측 로그에 없는 줄을 본다. |

통과선은 85점 이상이고 Blocking 0, Major 0이다. 이번 점수는 84, Blocking 0, Major 2.

## 재실행 결과
PR이 없다. 린트·타입검사·테스트·빌드·브라우저 측정은 실행하지 않음.

읽어서 대조한 것:
- `spec.md` 전문과 `04-review-r1.md`.
- `src/content/ko.ts:198–231` 회복 표 4행. `src/content/types.ts:87` `rows: T4<...>`.
- `.gitignore:9` `.lessons/`.
- 직전 run `evidence/dev-build.log`(Next.js 16.3.8, Turbopack)와 `evidence/qa-build.log`. 둘 다 경로 표만 있고 `First Load JS`·`kB`·`gzip` 문자열이 없다. 이번 라운드에서 `next build`는 다시 돌리지 않음.

## Blocking
없음.

## Major
### M1. B4 (d) 배열 인덱스가 1부터 센 행 번호와 어긋난다
28행 (b)는 d=0→1행(D0), d=3→3행(D3–5), d=6→4행이다. 사전은 4행이고 0번이 D0다(`ko.ts:199–230`). (d)는 `recovery.rows[행].note`다.

이 식 그대로면 d=0이 `rows[1]`(ko 「회복 초기」)이고, d=3이 `rows[3]`(ko 「의료진 경과 확인 후」)이며, d=6은 `rows[4]`라서 행이 없다. 맞는 aria는 d=0 `D0 — 진료 당일`, d=3 `D3 — 회복과 문화`, d=6 `D6 — 의료진 경과 확인 후`다. 영문도 같은 인덱스의 `note`다.

해소: 28행 (d)를 `D{d} — {recovery.rows[행-1].note}`로 바꾼다. d=0·3·6의 기대 인덱스를 0·2·3으로 한 줄 적는다.

### M2. B8의 First Load JS 한 줄이 Next 16.3.8 빌드 로그에 없다
32행은 `next build` 로그의 `/[lang]` First Load JS(gzip) 한 줄을 `7379aa5`와 비교하라고 한다. `evidence/dev-build.log` 22–38행과 `evidence/qa-build.log`의 경로 표에는 크기 열이 없다.

해소: 32행의 번들 문장을 바꾼다. 기준 커밋과 후보를 각각 `next build`한 뒤, 로컬 production `/en` 문서가 참조하는 `/_next/static/chunks/*.js`만 gzip한 바이트 합의 증가가 40KB 이하면 PASS. 경로 표의 First Load JS 줄과 청크 디렉터리 전체 합은 쓰지 않는다고 적는다.

## Minor
- 15행은 메신저·특화 블록이 함께 보인다고 하고, 25행 B1(c)는 그 조건을 1440·1860에만 둔다. 390·768은 패널이 사진보다 위이고 `h2`와 칩만 뷰포트 안이면 PASS다. 15행에 「1440·1860에서」를 붙이면 결과 상자와 B1이 같다.
- 27행 B3은 진료·일수·인원 변경 모두에 (a)(b)를 건다. 일수·인원은 가격 문자열이 그대로다(A2). 인원은 일차 개수도 그대로다. (b)는 가격 문자열이 바뀔 때만 적용한다고 적는다. 일수·인원에서 `#price` 텍스트는 같고 애니메이션이 없으면 PASS. 인원 변경은 같은 일차의 이동 애니메이션도 PASS이고, 노드가 반드시 빠지고 들어오지 않아도 된다.
- 26행 일정선의 0→1은 no-preference에서 재고, reduce에서는 1.2초 시점의 완료 길이가 0ms부터 있으면 PASS라고 적는다. B7의 running 0과 같이 갈 수 있다.
- 16행의 「D0~D6+」를 B4의 정수 0..6(6은 4행)과 같은 말로 바꾼다.

## 후속
- G2는 B4 인덱스와 B8 측정 경로가 바뀐 뒤에 이징·번들 예산을 정한다.
- `/en#care` 패널 높이는 이번 라운드에도 재측정하지 않음.
- `review_tier` 가판정(39행)은 판정에서 제외한다.
- 기획서 비공개 수치는 이 파일에 적지 않았다. 패턴 파일 대조는 실행하지 않음.

## 잘된 점
- 8행은 height 속성이 aspect-ratio를 이기고, 흐림은 `w=750` 후보의 세로 확대이며, 빈 왼쪽은 `align-items: center`라고 적는다.
- B1은 dpr 2에서 렌더 높이·natural 폭·높이를 같이 보고, 데스크톱에서는 특화 문단과 메신저 CTA의 `top`·`bottom`을 본다.
- B2는 빈 저장소, 0/400/1200ms, 520px 이하에서 선이 없는 현재 동작을 나눈다.
- B7은 진행선을 0%로 비우면 FAIL, 헤더 축소 기능은 reduce에서도 유지라고 적는다.
- B9는 `qa-r2-unit.log` 75건, `design/drafts` diff, `rg -f`, `.lessons/_index.md` 무시 해제를 한 항목에 둔다.
- B11은 진행률, 8px 축소, `#care` top ≥ 헤더 높이 − 1, 다른 앵커를 Playwright 수치로 고정한다.
- 62행은 기관 파트너와 푸터를 정적 유지로 비목표에 넣는다.

STATUS: done [r2]
