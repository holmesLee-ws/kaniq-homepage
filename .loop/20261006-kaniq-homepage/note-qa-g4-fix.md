# QA 지시 — G4 fix-forward 운영 델타 (production)

PR #2가 main에 머지·재배포됐다(`06-release.md` 「fix-forward (PR #2)」). 델타만 실측: (1) `/ja`·`/ko` H1 줄 구성 390·768·1440(구절 중간 끊김 없음, scrollWidth=innerWidth) 스크린샷 (2) `/favicon.ico` 200 (3) 운영 회귀 스모크 — A10(main SHA = Vercel meta.gitCommitSha, gitDirty 없음, 공개 200), A1 헤더 9종, 2단계 404 6종, `/api/quote` 무효 422, A3 메신저 href 0·24시간 0. 나머지는 `05-qa-r3.md` 인용. `## 기준 커밋:`은 `leh.sh baseline` 출력(PR #2 head). 증적 `evidence/qa-prod2-*`. 점수 절(공개 접근·SHA 일치·운영 화면·운영 회귀 /25), VERDICT.
