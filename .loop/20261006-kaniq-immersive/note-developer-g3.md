# Developer 지시 — G3 구현 (모션·인터랙션 + 진료찾기 수정, PR)

`02-plan.md`(G2 통과본, r2 변경 내역 포함)를 그대로 구현하고 `main` 대상 PR을 만든다. `roles/developer.md` 절차·산출물(`03-dev.md`) 형식. 머지·배포는 하지 않는다.

- 브랜치: `feat/immersive-motion` (origin/main `7379aa5`에서). 제품 커밋에 `.loop/`를 넣지 않는다. `.lessons/`는 이 PR에서 `.gitignore`의 `.lessons/` 줄만 지우고 **파일은 커밋하지 않는다**(closeout이 올린다).
- 읽을 것: `.loop/profile.yaml`, `spec.md`(B1~B11), `02-plan.md`, `04-review-r4.md`·`04-review-r5.md`(G2 리뷰), `gates.md` 「G2 → G3 증강 맥락」(아래 첨부), `.lessons/`(3건).
- 공개 리포: 기획서 비공개 수치를 코드·테스트·커밋·PR 본문·03-dev에 쓰지 않는다. 확인은 `rg -f /Users/holmesmac/my-projects/customers/kaniq/brief/.confidential-patterns.txt <경로>`.

## 반드시
1. 브라우저 판정 B1~B7·B11은 계획 §6.2 레시피로 직접 측정하고 `.loop/20261006-kaniq-immersive/evidence/dev-B<n>-*.png|json`과 수치를 `03-dev.md`에 남긴 뒤에만 done. Playwright 일회용 스크립트(`.qa-tmp/`, 커밋 금지) 허용. `deviceScaleFactor: 2`(B1).
2. B8: 기준 `7379aa5`와 후보를 각각 `next build` → `/en`이 참조하는 청크 gzip 합 비교 로그(`evidence/dev-B8-bundle.log`), Lighthouse mobile /en 3회 중앙값.
3. B9: 기존 테스트 전부 PASS + 새 테스트(스크러버 매핑·presence·진행값) · 언어 협상/404/사전 공개 모드 curl · `git diff origin/main -- design/drafts` 빈 출력 · `git check-ignore -v .lessons/_index.md` 무시 안 함.
4. 메모리 압력이 2 이상이면 무거운 명령(build·Lighthouse)은 하나씩, `NODE_OPTIONS=--max-old-space-size=3072`(build는 6144).

## 다음 게이트
G3 독립 리뷰 = Reviewer 코드 리뷰(정확성·계획 준수/코드 품질·회귀·보안·검증 재현성) ‖ QA 로컬 실기(B1~B9·B11). 통과선 85점 + Blocking 0.

## G2 → G3 증강 맥락·진행 방향
1. **재작업 1위 원인 차단**: 이 run은 판정 매체가 거의 전부 브라우저 수치다(B1~B7·B11). Developer는 계획 §6.2 레시피를 그대로 돌려 숫자와 스크린샷을 남긴 뒤에만 done — 숫자가 없으면 done이 아니다.
2. **리뷰어가 실행 못 한 미확인 1건**: `getImageProps`가 dpr 2에서 요구 폭(`w=`) 후보를 실제로 내는지 — B1(a) natural 조건의 성패가 여기 달려 있다. 구현 첫 단계에서 실측하고, 안 되면 계획의 이미지 폴백 분기를 쓴다.
3. **전역 `img{height:auto}`는 모든 이미지에 닿는다** → 히어로·플래너·기록 카드 사진 회귀를 B9와 함께 1440·390 스크린샷으로 확인.
4. **번들·성능**: 기준 `7379aa5` 대비 `/en` 참조 청크 gzip 합 비교 로그 필수, Lighthouse 3회 중앙값(Perf ≥ 90, CLS ≤ 0.02). scroll 핸들러는 passive + rAF 1회/프레임.
5. **공개 리포**: 비공개 수치 금지 — 새 테스트·문구에도. 확인은 리포 밖 패턴 파일 `rg -f`.
