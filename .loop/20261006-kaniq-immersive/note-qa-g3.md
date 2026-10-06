# QA 지시 — G3 로컬 실측 (PR #5, round 1)

`roles/qa.md` standard로 spec B1~B9·B11을 실측한다(B10은 G4 운영). 접근 `local-session`(공개 사이트). 기준 커밋(`leh.sh baseline 20261006-kaniq-immersive`)을 scratch 슬롯 `qa-cand`로 체크아웃해 `npm ci && npm run build && npm start -- -p 3200`(포트 충돌 시 변경)으로 띄운다. Developer의 서버는 쓰지 않는다. Reviewer가 같은 시각 코드 리뷰를 병렬로 한다.

읽을 것: profile, spec, 02-plan §6.2(관측 레시피 — 측정 시점·스크롤 고정·`data-inview` 확인 규칙 포함), 03-dev(Developer 수치·증적), gates.md(G2 → G3 증강 맥락).

메모:
- B1은 Playwright `deviceScaleFactor: 2`, 4폭 × ko·en, no-preference/reduce 둘 다. B2는 빈 저장소 첫 로드 0·400·1200ms 스크린샷 + 일정선 길이. B3·B6은 변경 후 100ms·450ms 시점 `getAnimations()` 측정. B4는 키보드만으로 D0·D3·D6 + 5개 언어 aria-valuetext. B5 (a)~(e) 각각. B7은 reduce 에뮬레이션 전 항목. B8은 Lighthouse mobile /en 3회 중앙값 + 기준 `7379aa5` 대비 `/en` 참조 청크 gzip 합(직접 재측정). B11은 1440·390. 회귀(B9): 히어로·플래너·기록 카드 사진 1440·390 스크린샷(전역 img height:auto 영향).
- 증적 `.loop/20261006-kaniq-immersive/evidence/qa-B<n>-*`. 원본 Lighthouse JSON은 리포 밖 패턴과 우연히 겹칠 수 있으니 공개 증적에는 점수 요약만 두고 원본은 `.qa-tmp/`(커밋 제외).
- PASS 항목마다 spec 체크박스 [x] + 증적. 점수 절 `## 점수: NN/100 — (PASS 항목 수/10 × 100, 소수 버림)` + 축별 한 줄(진료찾기·히어로/플래너·섹션 인터랙션·품질 하한/회귀). FAIL은 재현 단계 + 사유 태그.
- 관찰에 공개 노출·비밀·개인정보가 보이면 판정 범위와 무관하게 FAIL로 올린다(교훈 security/…).
