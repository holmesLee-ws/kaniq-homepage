# Review — 20261006-kaniq-immersive round 1 — PR 없음 (G1 스펙)

VERDICT: CHANGES

## 점수: 73/100
| 축 | 점수(/25) | 근거 한 줄 |
|---|---|---|
| 판정 가능성 | 16 | B1·B2·B7·B9·B10은 수치·명령이 있다. B3·B4·B5(c)·B6·B8은 QA가 서로 다른 구현을 둘 다 PASS할 수 있다. |
| 사용자 의도 정합 | 17 | 결과 상자(14–21행)는 요청(몰입·조작·모션, `#care` 정리)을 섹션별로 받는다. 14·15·21행의 일부는 B1~B10에 없다. |
| 범위 적정성 | 22 | 새 페이지·WebGL·사운드·카피 개작·live 전환은 비목표다. L은 홈 전 섹션 모션과 견적 폼 모션을 한 run에 둔 요청 범위와 같다. |
| 리스크 | 18 | 점진적 향상(65행), reduced-motion(B7), Lighthouse·가로 스크롤(B8), A1~A9 회귀(B9)가 있다. 번들 비교 기준과 고정 헤더 회귀 부등식이 비어 있다. |

통과선은 85점 이상이고 Blocking 0, Major 0이다. 이번 점수는 73, Blocking 0, Major 2.

## 재실행 결과
PR이 없다. 린트·타입검사·테스트·빌드는 실행하지 않음.

실행한 것:
- `curl` `https://kaniq-homepage.vercel.app/ko` → HTTP 200, `#care` 마크업 존재. `/en` → HTTP 200, 같은 `section.section.wrap.split`과 `width="1280" height="1600"` 이미지.
- `sips` `public/img/c-family-palace.jpg` → 1280×1600.
- Chrome headless 1860×920, deviceScaleFactor 1, `https://kaniq-homepage.vercel.app/ko#care` 로드 후 레이아웃:
  - `scrollY` 1198, `#care` 1200×1855, top 0
  - `img` 박스 509×1600, computed `aspect-ratio` `4 / 5`, `object-fit` `cover`, used height `1600px`
  - `currentSrc` 쿼리 `w=750`, 디코드 natural 744×929
  - `.local-panel` 611×447, top 704
  - `#care` computed `align-items` `center`
- `/en#care` 레이아웃 수치는 재측정하지 않음. en 패널은 우선 진료 칩이 4개다.

## Blocking
없음.

## Major
### M1. 결과 상자 14·15·21행이 Acceptance에 없다
QA가 B1~B10만 PASS해도 아래가 없어도 된다.

- 14행 「일정선이 D-1→귀국으로 그려짐」. 선은 `.days::before`(globals.css:249–256)이고, 520px 이하에서는 `display: none`(globals.css:375–377)이다. B2·B3에 없다.
- 15행의 사진 시차/확대, 우선 진료 칩 순차 등장. B1은 비율·섹션 높이·칩의 노출만 본다.
- 15행 「메신저·특화 블록이 함께 보임」. B1은 제목 또는 첫 제목과 칩만 뷰포트 안으로 요구한다. 섹션 높이 상한은 뷰포트 × 1.4라서, 이동 직후 메신저 CTA가 화면 밖에 있어도 PASS다.
- 21행 스크롤 진행, 헤더 축소, `scroll-margin`. 현재 `.site-head`는 sticky가 아니다(`src/components/layout/SiteHeader.tsx:10`, globals.css:42–47).

해소: 14행 일정선은 B2에 넣는다. `prefers-reduced-motion: no-preference`에서 첫 방문 1.2초 안에 `.days::before`의 그려진 길이(scaleY 또는 동등한 진행)가 0에서 1이 되고, 1.2초 시점에 선이 `.days`의 위 8px~아래 8px를 채우면 PASS. 폭 390에서는 선이 없는 현재 동작이 PASS라고 적는다.

15행 모션은 B1에 넣는다. no-preference에서 `#care`로 스크롤하는 동안 `img`의 translateY 또는 scale이 8px 또는 0.04 이상 변하면 PASS. 칩은 `animation-delay`가 목록 순서대로 늘고 1.2초 안에 끝나면 PASS. reduced-motion에서는 두 변화량이 0이다.

15행 「함께 보임」은 폭을 나눈다. 1440·1860에서 `#care` 이동 직후 `.local-panel`의 특화 문단과 메신저 CTA가 뷰포트 안에 전부 들어온다(`getBoundingClientRect().bottom ≤ innerHeight`). 390·768에서는 패널 전체(제목·칩·특화·메신저)가 사진보다 위에서 전부 보이면 PASS이고, 사진은 그 아래에 있어도 된다. 25행의 「제목(또는 언어 블록 첫 제목)」은 「`h2`와 우선 진료 칩」으로 바꾼다.

21행은 B항목 하나로 둔다. (a) 진행 표시는 `scrollY = 0`에서 ≤ 2%, 문서 하단에서 ≥ 98%. (b) 헤더 높이는 `scrollY = 0`보다 `scrollY ≥ 200`에서 8px 이상 작아지고, 축소 후에도 로고와 언어 전환에 포커스가 간다. (c) 헤더의 진료찾기 링크를 누른 뒤 `#care`의 `top`이 헤더 높이 − 1 이상이다.

### M2. B3·B4·B5(c)·B6·B8의 검증이 요구 행동을 잠그지 못한다
- 27행 B3. 「변경 직후 `getAnimations()` > 0, 450ms 뒤 0」은 컨테이너 페이드 한 번으로 PASS다. 들어옴/나감/이동과 가격 숫자 전환을 구분하지 않는다. 클릭 직후 한 번만 재면 애니메이션이 다음 프레임에 시작해 거짓 FAIL이 난다. 해소: no-preference에서 변경 후 100ms 이내에, 사라지는 일정 노드와 들어오는 일정 노드가 서로 다른 요소로 애니메이션 중이고, `#price` 문자열이 바뀌는 동안 `#price`에 애니메이션이 있다. 450ms 시점에 그 애니메이션은 `finished`이거나 목록에 없다.
- 28행 B4. 회복 표는 일이 아니라 4행이다(D0, D1–2, D3–5, 경과 확인과 귀국. `src/content/en.ts:237–268`, ko note 「회복과 문화」는 `src/content/ko.ts:216`). 그리드는 D0~D6 열이고 가능 여부는 `okFromDay`다(`src/components/home/DoctorOkRules.tsx:17–32`). 「D3 — 회복과 문화」만 있으면 다른 언어·D6의 기대 문자열이 없다. 해소: 슬라이더 도메인은 정수 0..6. 행 매핑은 0→0행, 1–2→1행, 3–5→2행, 6→3행. 그리드 강조 열은 그 일이고, 활동 행은 `day >= okFromDay`일 때 켜진다. `aria-valuetext`는 그 언어의 `D{n} — {recovery.rows[map].note}`와 같다. 단위 테스트 기대값은 이 표와 사전 문자열이다. 브라우저 실기는 D0·D3·D6이다.
- 29행 B5(c). 「스크롤에 따라 채워짐」과 전/후 스크린샷만으로는 채움 비율이 없다. 해소: 진행선 비율이 스크롤 0에서 ≤ 2%, 4단계 목록이 뷰포트 중앙일 때 40–70%, 목록을 지난 뒤 ≥ 98%다. 스크롤을 되돌리면 비율도 줄어든다.
- 30행 B6. 슬라이드·진행 막대·인장에 시간과 비율이 없다. 해소: no-preference에서 단계 이동 후 100ms 이내에 떠나는 단계와 들어오는 단계가 애니메이션 중이고, 진행 막대 폭은 단계 1/3·2/3·3/3에서 ±5%다. 인장 애니메이션은 완료 화면 진입 후 1초 안에 `finished`다. A6(검증·422·사전 공개 안내·저장 없음)은 그대로다.
- 32행 B8. 「클라이언트 JS(gzip) 증가 ≤ 40KB(빌드 출력 비교)」에 기준 커밋과 집계 대상이 없다. 해소: 기준은 `7379aa5`의 `next build` 로그에서 `/[lang]` First Load JS gzip 한 줄이다. 같은 줄의 증가가 40KB 이하면 PASS. 청크 파일 합과 섞지 않는다고 적는다.

## Minor
- 8행 원인. 증상 수치(박스 509×1600, 섹션 높이 1855, 디코드 744px 확대)는 위 Chrome 측정과 같다. 메커니즘은 이렇게 고친다. `public/img/c-family-palace.jpg`와 HTML 속성은 1280×1600이다. 744×929는 `sizes="(max-width:860px) 100vw, 40vw"`가 고른 `w=750` 후보의 디코드 크기다. `.split img`는 이미 `aspect-ratio: 4/5`와 `object-fit: cover`다(globals.css:511–516). computed aspect-ratio도 `4 / 5`인데 used height는 1600px다. `img` 규칙이 `max-width: 100%`만 있고 `height: auto`가 없어서(globals.css:17–20) height 속성 1600이 이긴다. `object-fit: cover`라 비트맵은 비균일 변형이 아니라 높이 기준 약 1.72배 확대 후 가로가 잘린다. `.local-panel` 448px는 ko 측정 높이 447에 가깝고, 폭은 611이다. 패널은 위쪽에 붙어 있지 않다. `align-items: center`(globals.css:509)라서 top이 704px이고, `#care` 상단의 빈 왼쪽은 그 간격이다.
- 25행 선명도. `currentSrc` 요청 폭 ≥ 렌더 폭 × dpr 는 오늘 dpr 1에서 750 ≥ 509으로 통과한다. 흐림은 높이 축이다. Playwright `deviceScaleFactor`를 2로 고정하고, `naturalHeight ≥ 렌더 높이 × devicePixelRatio`를 추가한다. 높이 ≤ 폭 × 1.3과 섹션 높이 ≤ 뷰포트 × 1.4는 오늘 화면을 이미 FAIL로 만든다.
- 26행 B2. 스크린샷 3장의 시각을 0ms·400ms·1200ms로 적는다. 「첫 방문」은 해당 오리진의 저장소 없는 로드로 적는다.
- 29행 B5(a). 영수증은 진입 직후(줄만), 합계 전, 인장 후 세 장과, 섹션을 나갔다가 다시 들어왔을 때 재생되지 않는 한 번을 PASS로 적는다.
- 31행 B7. 「정적 최종 상태」를 「같은 스크롤 위치의 비모션 렌더와 내용·투명도가 같다」로 적는다. 진행선은 축소 모드에서 현재 스크롤 비율을 정적으로 보여 주면 PASS라고 적는다(0%로 비어 있으면 FAIL).
- 33행 B9. 직전 run `evidence/qa-r2-unit.log`는 Tests 75 passed다. `evidence/qa-unit.log`는 73이다. 「75+」를 「기존 테스트 전부 PASS」로 두고 건수 하한을 빼거나, 기준 로그 파일명을 적는다.
- 68행 `.gitignore`의 `.lessons/` 제거는 B항목 밖에 있다. B9 검증에 `git check-ignore -v .lessons`가 무시하지 않으면 PASS라는 한 줄을 넣는다.
- 기관 파트너(`Organizations`)는 결과 상자와 B항목 둘 다에 없다. 모션 대상에서 빼려면 비목표에 한 줄 넣는다.

## 후속
- G2가 섹션별 시간·이징·스크러버 데이터를 정한다. M2의 매핑·비율은 G1 Acceptance에 남겨야 G2가 그 위에서 이징만 정할 수 있다.
- 렌더 기하의 수정안(높이 auto, 패널 정렬)은 이 리뷰가 구현을 지정한 것이 아니다. B1 수치를 만족하는 설계는 G2가 고른다.
- `/en#care`의 패널 높이는 이번 라운드에서 재측정하지 않음.
- `review_tier` 가판정(38행)은 판정에서 제외한다.
- 기획서 비공개 수치는 이 파일에 적지 않았다. 패턴 파일 대조는 실행하지 않음.

## 잘된 점
- B1의 박스 비율과 섹션 높이 상한은 오늘 운영(509×1600, 섹션 1855, 뷰포트 920)을 FAIL로 만든다.
- B4는 그리드·회복 표·「오늘 가능한 것」 세 표면을 한 조작에 묶고, 키보드와 `aria-valuetext`를 요구한다.
- 65행은 초기 `opacity: 0` 숨김을 `no-preference`와 `@supports` 안으로 제한한다. B2는 JS 없는 HTML에 본문이 있는지를 `curl`로 본다.
- B7은 실행 중 애니메이션 0건과, 스크러버·카드·템플릿·폼의 기능 유지를 같이 요구한다.
- B8은 직전 A7보다 Lighthouse 하한을 올리면서 1860폭과 CLS 0.02를 넣는다.
- B9·B10은 사전 공개 모드, 금지어, `design/drafts` 무변경, 리포 밖 패턴 `rg -f`, 머지 SHA, `gitDirty` 없음을 유지한다. 비공개 수치는 산출물에 펼치지 않는다.
- 비목표는 새 섹션·영상·WebGL·사운드·커서 장식·2단계 언어·live 전환을 잘라 L 한 run에 맞춘다.

STATUS: done [r1]
