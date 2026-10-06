# QA 지시 — G4 운영 실측 (production, 머지 후)

Releaser가 PR #1을 main에 머지하고 Vercel production에 배포했다(`06-release.md`의 머지 SHA·배포 URL·소스 SHA 확인). 이 라운드는 **G4 게이트의 독립 리뷰**다. 공개 사이트라 로그인 없음. 운영 데이터는 없지만 `/api/quote` 유효 POST는 하지 않는다(무효 422만).

## 실측 (production `https://kaniq-homepage.vercel.app`)
- **A10**: `curl -sI /en` 200(401·Vercel 로그인 302면 FAIL), 본문이 이 사이트(H1 일치), 배포 소스 SHA = main 머지 SHA(`gh api repos/holmesLee-ws/kaniq-homepage/commits/main --jq .sha`와 `06-release.md`/Vercel 배포 메타 대조), `git diff`·lint·test·build 결과는 `03-dev.md`·`04-review-r5.md` 인용. GitHub main에 코드가 있는지 `gh api repos/holmesLee-ws/kaniq-homepage/contents/src/proxy.ts?ref=main`.
- **운영 회귀**(엣지 환경에서 깨지기 쉬운 것): A1 헤더 9종 리다이렉트(+ `Vary`), 홈 5종 200·lang, 2단계 6종 404, A6 `/api/quote` 무효 본문 422, A8 hreflang·sitemap·robots·og:image가 **production 절대 URL**인지, 브라우저로 /en·/ja 히어로·플래너 1회 조작·하단 바(390×844) 스크린샷, Lighthouse mobile /en 1회(운영값 기록, A7 판정은 r1 로컬 값 기준).
- 보조 도메인 `https://kaniq-care.vercel.app/en` 200.
- 증적: `.loop/20261006-kaniq-homepage/evidence/qa-prod-*`. A10 PASS면 spec 체크박스 [x] + 증적.
- 점수 절: `## 점수: NN/100` + 축(공개 접근 · SHA 일치 · 운영 화면 · 운영 회귀) 각 /25. 통과선 85 + Blocking 0. VERDICT PASS/FAIL.
