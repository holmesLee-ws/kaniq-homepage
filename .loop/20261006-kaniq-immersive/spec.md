# spec — 20261006-kaniq-immersive

> 공개 리포다. 기획서의 비공개 수치(파트너 배분율·예산·KPI 목표)는 이 run의 어떤 산출물·코드·테스트에도 원문으로 적지 않는다. 대조가 필요하면 리포 밖 패턴 파일 `/Users/holmesmac/my-projects/customers/kaniq/brief/.confidential-patterns.txt`를 `rg -f`로 읽는다(교훈 `security/public-repo-run-artifacts-must-not-quote-confidential-brief-figures`).

## 배경
- 출처: 사용자 요청(2026-10-06 22:07 KST) — "몰입형, 인터랙티브, 모션 효과 넣을 수 있는 부분 다 개선해 줘. '진료찾기' 탭에서 이런 어색한 이미지 화면 나오는 거도 적절히 위 효과 혹은 별도 UI 개선 통해서 정리해 주고" + 스크린샷(`/ko#care`, 1860px 폭: 왼쪽이 비고 흐릿한 궁궐 사진만 보임).
- 직전 run `20261006-kaniq-homepage`(closeout PR #4, main `7379aa5`)가 만든 사이트 https://kaniq-homepage.vercel.app 를 개선한다. 사이트 구조·사전 공개 모드·Acceptance A1~A10은 그대로 유지한다.
- **버그 원인(오케스트레이터 실측 + G1 리뷰 정정, 1860×920)**: `#care` 섹션(`section.section.wrap.split`)의 사진이 509×1600px로 그려진다. `.split img`에는 `aspect-ratio: 4/5`·`object-fit: cover`가 있지만(globals.css:511–516) 전역 `img` 규칙에 `height: auto`가 없어(globals.css:17–20) HTML `height="1600"` 속성이 이긴다. `sizes="(max-width:860px) 100vw, 40vw"`가 고른 `w=750` 후보(디코드 744×929)가 높이 기준 약 1.72배 확대되어 흐리다. 섹션 높이는 1855px, `align-items: center`(globals.css:509)라 `.local-panel`(611×447)이 top 704px에 놓여 `#care` 이동 직후 화면에는 빈 왼쪽과 흐린 사진만 보인다.

## 결과물 — 무엇이 나오면 끝인가
같은 홈(5개 언어)이 **스크롤과 조작에 반응하는 몰입형 경험**이 된다. 모든 모션은 의미(상태 변화·진행·관계)를 전달하고, `prefers-reduced-motion`에서는 꺼지며, 성능·접근성 점수는 떨어지지 않는다.

```
히어로     로드 시퀀스(헤드라인 → 플래너 카드 → 일정 일차가 순서대로) · 선택을 바꾸면 일정이 형태 전환(들어오고 나가는 항목, 가격 숫자 전환), 일정선이 D-1→귀국으로 그려짐
진료찾기   (#care, 버그 수정) 사진은 고정 비율·고해상도, 섹션이 한 화면 안팎. 사진은 스크롤에 따라 부드러운 시차/확대, 우선 진료 칩은 순서대로 등장, 1440·1860에서 메신저·특화 블록이 함께 보임
Doctor OK  새 인터랙션 「회복 일차 스크러버」(정수 D0~D6 슬라이더/드래그/키보드, D6 = 경과 확인·귀국 단계): 움직이면 규칙 그리드에서 그날 가능한 활동이 켜지고, 회복 주간 표의 해당 단계가 강조되고, "오늘 가능한 것" 목록이 바뀜
신뢰       영수증이 화면에 들어올 때 줄 단위로 "인쇄"되고 합계가 ₩0으로 확정된 뒤 인장이 찍힘 · 병원/의사 기록 카드는 "확인" 조작으로 뒤집혀 등록 정보 면을 보임 · 문제 발생 4단계는 스크롤 진행선이 단계를 이어 감
템플릿     목록 항목에 마우스/포커스를 두면 그 여정의 미니 일정이 펼쳐짐
앰버서더   환원처를 고르면 미리보기 패널이 전환되고 추천 현황 점이 단계별로 채워짐
견적       단계 전환 슬라이드 · 진행 막대 · 완료 시 인장 확정 애니메이션
전역       스크롤 진행 표시, 고정 헤더 축소, 앵커 이동 시 고정 헤더만큼 여백(scroll-margin)  (B11)
```

## Acceptance (QA가 항목별 PASS/FAIL)
- [x] B1. 진료찾기 정리(버그 + 몰입): Playwright `deviceScaleFactor: 2`로 1860×920·1440×900·768×1024·390×844에서 `/ko#care`와 `/en#care`로 이동한 직후 — (a) 사진 렌더 높이 ≤ 렌더 폭 × 1.3, `naturalHeight ≥ 렌더 높이 × devicePixelRatio`, `naturalWidth ≥ 렌더 폭 × devicePixelRatio` (b) `#care` 섹션 높이 ≤ 뷰포트 높이 × 1.4 (c) 1440·1860에서는 `.local-panel`의 `h2`·우선 진료 칩·특화 문단·메신저 CTA가 모두 뷰포트 안(`getBoundingClientRect().bottom ≤ innerHeight`, `top ≥ 0`); 390·768에서는 패널 전체가 사진보다 위에 있고 이동 직후 `h2`와 칩이 뷰포트 안 (d) `prefers-reduced-motion: no-preference`에서 `#care`를 스크롤로 통과하는 동안 사진의 translateY가 8px 이상 또는 scale이 0.04 이상 변하고, 칩의 `animation-delay`가 목록 순서대로 증가하며 1.2초 안에 끝난다; reduce에서는 두 변화량이 0 — 검증: Playwright 수치(4폭 × 2언어) + 스크린샷 — QA r1 PASS: evidence/qa-B1.json, qa-B1-{ko,en}-{1860,1440,768,390}-{no-preference,reduce}.png
- [x] B2. 히어로 로드 시퀀스: 오리진 저장소가 빈 첫 로드에서 헤드라인 → 플래너 카드 → 일차가 순서대로 등장하고 1.2초 안에 끝난다. 일정선(`.days::before` 또는 동등 요소)의 그려진 길이가 0→1로 진행해 1.2초 시점에 `.days`의 위 8px~아래 8px를 채운다(폭 ≤ 520px에서 선이 없는 현재 동작은 PASS). reduce에서는 0ms부터 완료 길이면 PASS. JS 비활성·애니메이션 미지원에서도 내용이 숨지 않는다. CLS ≤ 0.02 — 검증: 0ms·400ms·1200ms 스크린샷 3장 + 선 길이 수치 + `curl` 초기 HTML 텍스트 + Lighthouse CLS — QA r1 PASS: evidence/qa-B2.json, qa-B2-{1440,390}-{0,400,1200}.png, qa-B2-reduce-*.png, qa-B2-nojs.png, qa-B8-lh-summary.json(CLS)
- [x] B3. 플래너 전환 모션: no-preference에서 진료·일수·인원 변경 후 100ms 안에 (a) 사라지는 일정 노드와 들어오는 일정 노드가 서로 다른 요소로 각각 애니메이션 중이고 (b) `#price` 문자열이 바뀌는 경우(진료 변경)에만 그동안 `#price`(또는 그 자식)에 애니메이션이 있다 — 일수·인원 변경은 가격 문자열이 같고 애니메이션이 없어도 PASS, 인원 변경은 같은 일차 노드의 이동/갱신 애니메이션이면 출입 노드가 없어도 PASS — (c) 450ms 시점에 그 애니메이션들이 `finished`이거나 `getAnimations()`에 없다. 기존 A2(축별 변화 규칙: 진료=제목·활동·가격 / 일수=제목·일차 구간, 가격 동일 / 인원=부제·D-1 숙소, 골격·가격 동일)와 키보드 조작은 그대로 — 검증: 단위 테스트(A2 단언 유지) + Playwright 시점 측정 — QA r1 PASS: evidence/qa-B3.json, qa-B3-after.png, qa-B9-test.log
- [x] B4. 회복 일차 스크러버: Doctor OK 구간에 정수 0..6 슬라이더(키보드 ←→/Home/End, 드래그, 클릭). 값 d에 대해 (a) 규칙 그리드에서 열 d가 강조되고, 각 활동 행은 `d >= okFromDay`일 때 켜진다(`DoctorOkRules`의 기존 `okFromDay` 기준) (b) 회복 주간 표 강조 행은 0→1행(D0), 1–2→2행(D1–2), 3–5→3행(D3–5), 6→4행(경과 확인·귀국) (c) "오늘 가능한 것" 목록은 (a)에서 켜진 활동과 같다 (d) `aria-valuetext`는 그 언어의 `D{d} — {recovery.rows[행-1].note}` (사전 배열은 0부터: d=0→rows[0], d=3→rows[2], d=6→rows[3]) — 검증: 순수 함수 단위 테스트(d=0..6 전수, 5개 언어 aria 문자열 = 사전) + 브라우저 실기(D0·D3·D6 스크린샷, 키보드만) — QA r1 PASS: evidence/qa-B4.json, qa-B4-{ko,en}-D{0,3,6}.png, qa-B9-test.log
- [x] B5. 섹션 인터랙션·모션: (a) 영수증 — 진입 직후(줄만)·합계 확정 후·인장 후 순서 스크린샷 3장, 섹션을 나갔다 다시 들어와도 재생되지 않음(1회) (b) 기록 카드 — "확인" 조작(클릭·Enter·Space)으로 앞/뒤 면 전환, `aria-pressed` 또는 `aria-expanded`가 상태와 일치, 뒤 면 내용이 스크린리더에 노출(앞/뒤 중 보이는 면만 접근 가능) (c) 문제 발생 4단계 진행선 비율 — 스크롤 0에서 ≤ 2%, 목록이 뷰포트 중앙일 때 40–70%, 목록을 지난 뒤 ≥ 98%, 되돌리면 감소 (d) 템플릿 — hover와 키보드 focus 모두에서 그 여정의 미니 일정이 펼쳐지고 focus를 떠나면 접힘 (e) 앰버서더 — 환원처를 바꾸면 미리보기 패널 내용이 그 환원처로 전환되고 추천 현황 점이 단계 순서대로 채워짐 — 검증: Playwright 수치 + 항목별 전/후 스크린샷 — QA r1 PASS: evidence/qa-B5.json, qa-B5a-{1,2,3}.png, qa-B5b-{front,back}.png, qa-B5c-*-mid.png, qa-B5d-*.png, qa-B5e-{before,after}.png
- [x] B6. 견적 폼 모션: no-preference에서 단계 이동 후 100ms 안에 떠나는 단계와 들어오는 단계가 각각 애니메이션 중, 진행 막대 폭이 단계 1/3·2/3·3/3에서 ±5%, 완료 화면 인장 애니메이션이 진입 후 1초 안에 `finished`. 기존 A6(필수값 검증·422·사전 공개 안내·저장 없음)은 그대로 — 검증: 기존 라우트·스키마 테스트 + Playwright(ja 완주) — QA r1 PASS: evidence/qa-B6.json, qa-B6-{no-preference,reduce}-{1,2,3,done}.png, qa-B9-test.log
- [x] B7. 모션 축소: `prefers-reduced-motion: reduce`에서 로드 후·각 조작 후 `document.getAnimations().filter(a=>a.playState==='running').length === 0`. 스크롤 연동 효과는 같은 스크롤 위치의 비모션 렌더와 내용·투명도가 같다(진행선은 현재 스크롤 비율을 정적으로 보여 주면 PASS, 0%로 비면 FAIL). 스크러버·카드 뒤집기·템플릿 펼침·폼·헤더 축소는 기능이 같다 — 검증: Playwright 에뮬레이션 — QA r1 PASS: evidence/qa-B7.json, qa-B4.json(reduce), qa-B6.json(reduce)
- [x] B8. 품질 하한: Lighthouse(mobile, 로컬 production) /en 3회 중앙값 Performance ≥ 90, Accessibility 100, Best Practices ≥ 95, SEO 100, CLS ≤ 0.02. 390·768·1440·1860에서 `scrollWidth ≤ innerWidth`. 새 컨트롤 전부 키보드 포커스 표시. 번들: 기준 커밋 `7379aa5`와 후보를 각각 `next build` 후 로컬 production `/en` 문서가 참조하는 `/_next/static/chunks/*.js`만 gzip한 바이트 합의 증가 ≤ 40KB (빌드 경로 표의 First Load JS 줄·청크 디렉터리 전체 합은 쓰지 않음) — 검증: Lighthouse JSON + 수치 + 두 빌드의 참조 청크 gzip 합 로그 — QA r1 PASS: evidence/qa-B8-lh-summary.json, qa-B8-bundle.log, qa-B8-layout-focus.json, qa-B8-focus-*.png
- [x] B9. 회귀 보존: 기존 테스트 전부 PASS(직전 기준 `evidence/qa-r2-unit.log` 75건 포함, 신규 추가 가능), 언어 협상·2단계 404·사전 공개 모드(메신저 href 없음·24시간 문구 없음)·CTA 두 종류·금지어 가드·`git diff origin/main -- design/drafts` 비어 있음, 리포 밖 패턴 파일 `rg -f` 0건(바이너리·Vercel API 무관 숫자 제외), `git check-ignore -v .lessons/_index.md`가 무시하지 않음 — 검증: `npm test` + curl + rg + git — QA r1 PASS: evidence/qa-B9-{test,lint,tsc,build}.log, qa-B9-curl.log, qa-B9-git.log, qa-B9-images.json, qa-B9-{base,cand}-{hero,records}-{1440,390}.png
- [x] B10. 배포: GitHub main 머지, Vercel production(`kaniq-homepage.vercel.app`) 소스 SHA = 머지 SHA(gitDirty 없음), 로그인 없이 200, 운영에서 B1(1440·390)·B4(D3) 재확인 — 검증: gh + Vercel API + curl + 운영 Playwright — QA r2 PASS(운영, merge 16db6a3): evidence/qa-prod-B10.log, qa-prod-B10-deployment.json, qa-prod-B1.json, qa-prod-B1-{ko,en}-{1440,390}-{no-preference,reduce}.png, qa-prod-B4.json, qa-prod-B4-{ko,en}-D{0,3,6}.png
- [x] B11. 전역 스크롤 UI: (a) 스크롤 진행 표시는 `scrollY = 0`에서 ≤ 2%, 문서 하단에서 ≥ 98% (b) 헤더가 고정(sticky)되고 높이가 `scrollY ≥ 200`에서 `scrollY = 0` 대비 8px 이상 작아지며 축소 후에도 로고·언어 전환에 포커스가 간다 (c) 헤더의 진료찾기 링크를 누른 뒤 `#care`의 `getBoundingClientRect().top ≥ 헤더 높이 − 1` (다른 앵커도 동일) — 검증: Playwright 수치(1440·390) — QA r1 PASS: evidence/qa-B11.json, qa-B11-*.png

## 형태
- shape: feature
- review_tier: standard (가판정)

## 규모·예상
- size: L — UI 전용(데이터 모델 없음)이나 홈 전 섹션 + 견적 폼 교체(규칙 7) + 브라우저 판정 동작 다수(규칙 12) → M+1 = L.

| 항목 | 보통 | 길어지면 | 근거 |
|---|---|---|---|
| 걸리는 시간 | 3시간 55분 | 8시간 49분 | 비슷한 run 106건 |
| 비용(API 환산) | $109.72 | $159.69 | 비슷한 run 29건 |
| 토큰(참고) | 173.4M | 479.3M | 비슷한 run 94건 |
| 개발 라운드 | 3회 | 5회 | 비슷한 run 106건 |
| 리뷰·QA 라운드 | 4회 | 8회 | 비슷한 run 106건 |

## 운영 경로
| Acceptance | 실행 주체 | 권한 | 승인 | 핀 | 레인 | 턴 | 확인값 |
|---|---|---|---|---|---|---|---|
| B10 | Releaser | gh repo scope(holmesLee-ws), Vercel CLI(팀 wishket-aidp) | 사용자 위임(직전 run 배포 요청 + 이번 개선 요청) | vercel CLI 54.7.1 | 이 run | 1~2 | 확인: 직전 run에서 동일 경로 성공. git 연결은 미연결 — CLI 배포(머지 SHA 깨끗한 체크아웃, 배포 직전 porcelain 빈 출력) |

## 비목표
- 새 콘텐츠 섹션·새 페이지·영상·WebGL/3D·사운드·커서 트레일 같은 장식 효과.
- 2단계 언어, live 모드 전환, CRM·메신저 연동, CMS.
- 카피 변경(모션 보조 라벨·스크러버 라벨·"오늘 가능한 것" 같은 신규 UI 문구만 추가, 5개 언어로).
- main 히스토리 재작성(직전 run 잔여 위험 — 사용자 결정 대기).
- 기관 파트너 존(`Organizations`)과 푸터의 모션(정적 유지).

## 제약
- 작업 위치: 새 Orca 워크트리 `/Users/holmesmac/orca/workspaces/kaniq-homepage/kaniq-immersive` (base `origin/main` 7379aa5). 근거: LEH 기본값.
- 모션 원칙: 모든 모션은 상태·진행·관계를 전달한다(장식용 반복 루프 금지). CSS 우선(transition·keyframes·`animation-timeline: view()` + 미지원 폴백), 상호작용 상태는 기존 React 컴포넌트에서. 모션 라이브러리 도입은 설계(G2)에서 번들 예산(B8) 안일 때만. 모든 효과는 `prefers-reduced-motion` 분기.
- 점진적 향상: 서버 렌더 HTML만으로 모든 내용이 보여야 한다(초기 opacity 0으로 숨긴 뒤 JS로 드러내는 방식 금지 — 숨김은 `@media (prefers-reduced-motion: no-preference)` + `@supports` 안에서만).
- 디자인 체계 유지: 시안 A 토큰(청자·소나무·Doctor OK 노랑, Schibsted Grotesk). 새 색·서체 추가 금지.
- `.github/**` 금지, `design/drafts/**` 무변경, 기획서 비공개 수치 금지(위 머리말).
- 직전 run 후속: 제품 `.gitignore`의 `.lessons/` 줄을 제거해 교훈이 closeout에 실리게 한다(`.loop/`·`.vercel/` 무시는 유지).
- 릴리즈 방식: `full`(QA PASS 후 main 머지 + Vercel production). 마이그레이션 없음.
- QA 접근: `local-session`(공개 사이트, 로컬 production 빌드) + 머지 후 운영 실측.
- 게이트 운영(사용자 지시 유지): 게이트마다 독립 리뷰(Reviewer grok) 100점 만점·통과 85점+Blocking 0, 게이트 원장 `gates.md`에 점수·증강 맥락·진행 방향 기록, 다음 지시문에 동봉.

## 확정
- 사용자 확정: 2026-10-06 (auto-confirm-by-delegation — 직전 run의 위임 원문 + 이번 요청 "다 개선해 줘"). G1 독립 리뷰 r1 73 → r2 84 → r3 91 APPROVE 후 동결.
