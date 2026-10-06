# QA 지시 — G4 운영 실측 (production, 머지 후)

`06-release.md`의 머지 SHA·배포 확인. 공개 사이트, 로그인 없음, `/api/quote` 유효 POST 금지(무효 422만). 이 라운드는 G4 게이트의 독립 리뷰다.

- B10: `curl -sI https://kaniq-homepage.vercel.app/en` 200(401·로그인 302면 FAIL) · GitHub main SHA = Vercel 배포 `meta.gitCommitSha`(gitDirty 없음) · 머지 커밋 tree = 기준 커밋 tree.
- 운영 재확인: B1(1440×900·390×844, dpr 2, `/ko#care` — 사진 비율·natural 해상도·패널 뷰포트 포함) · B4(D3 키보드, aria-valuetext) · B11(sticky 헤더 축소·진행 표시) · 회귀(A1 헤더 9종 리다이렉트+Vary, 2단계 404, 사전 공개 모드 메신저 href 0·24시간 0, /api/quote 422) · Lighthouse mobile /en 1회(기록용, 요약만 공개 증적).
- 증적 `evidence/qa-prod-*`. B10 PASS면 spec [x]. 점수 절(공개 접근 · SHA 일치 · 운영 화면(B1·B4·B11) · 운영 회귀 각 /25), VERDICT. 관찰에 공개 노출·개인정보가 보이면 FAIL.
