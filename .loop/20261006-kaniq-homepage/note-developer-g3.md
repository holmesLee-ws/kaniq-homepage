# Developer 지시 — G3 구현 (Next.js 사이트 + PR)

`02-plan.md`(G2 91점 통과)를 그대로 구현하고 `main` 대상 PR을 만든다. `roles/developer.md` 절차·산출물(`03-dev.md`) 형식을 따른다. 머지·배포는 하지 않는다(Releaser 몫).

- 브랜치: `feat/kaniq-homepage` (origin/main에서). 이 워크트리의 현재 브랜치(`holmesLee-ws/kaniq-homepage-build`)에는 `.loop/`만 있다 — 제품 커밋에 `.loop/`·`.lessons/`를 넣지 않는다.
- 읽을 것: `.loop/profile.yaml`, `.loop/20261006-kaniq-homepage/spec.md`, `02-plan.md`, `04-review-r3.md`(G2 리뷰), `gates.md`의 「G2 → 증강 맥락·진행 방향」.
- 기획서 텍스트(리포 밖, 읽기 전용, 복사 금지): `/Users/holmesmac/my-projects/customers/kaniq/brief/kaniq-homepage-plan-deck.txt`

## G2에서 넘어온 증강 맥락·진행 방향 (계획보다 우선)
1. G2 Minor 5건 반영: (a) 모바일(≤860px) 헤더 nav 숨김은 시안 그대로, A7 포커스 실측은 1440×900 (b) 플래너·템플릿 → 견적 `interest` 대응: implants→dental, lasik→eye, screening→screening, womens-wellness→womens-health, fertility→fertility, family-screening→screening (c) 히어로 플래너 카드 푸터에 "KANIQ 수수료 ₩0"(언어별 라벨 + 상수 ₩0) (d) 시안 A 338행 `Liability insurance ₩100M+` 문구는 넣지 않는다 (e) hreflang `x-default`→`/en`은 타입 허용 — 빌드 후 curl로 렌더 확인.
2. 버전: Next 16.3.8 / React 19.3 / TypeScript 5.x(typescript-eslint peer <6.1) / ESLint 9.x / Node 22. `npm install` 후 `package-lock.json` 커밋.
3. 브라우저 판정 항목(A2·A3·A5·A6·A7)은 계획 §6.3 레시피대로 직접 실측하고 `.loop/20261006-kaniq-homepage/evidence/dev-A<n>-*.png`와 수치를 남긴 뒤에만 done. Playwright 일회용 스크립트(`.qa-tmp/`, 커밋 금지)를 써도 된다. Lighthouse(A7)도 로컬 production 빌드(`npm run build && npm start`)로 1회 돌려 점수를 `03-dev.md`에 적는다.
4. A4·A9 금지어 명령(spec 원문)을 PR 전에 그대로 돌려 결과를 `03-dev.md`에 붙인다.
5. 번역(ja·id·mn·ko)은 계획 §3.8 지침대로 네가 쓴다. README에 "원어민 검수 필요"를 적는다.

## 금지
`.github/**` 생성 · `design/drafts/**` 수정(이미지는 `public/`로 복사·최적화만) · 기획서 텍스트·수치 복사 · 리드 저장/로그/외부 전송.

## 다음 게이트
PR은 G3 독립 리뷰(Reviewer 코드 리뷰 100점: 정확성·계획 준수/코드 품질·회귀·보안·검증 재현성)와 QA 로컬 실기를 동시에 받는다. 통과선 85점 + Blocking 0.
