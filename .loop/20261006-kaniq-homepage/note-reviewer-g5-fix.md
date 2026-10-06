# Reviewer 지시 — G5 보안 fix 델타 리뷰 (PR #3)

PR #3은 공개 리포의 `tests/guards.test.ts`에서 기획서 비공개 KPI 수치 토큰을 직접 나열하던 단언 2개(4줄)를 삭제한다(근거: `04-review-r7.md` Minor 4, `03-dev.md` 「r4 — G5 보안 fix」). `gh pr diff 3` 확인 → `npm test`(75 PASS) · lint · tsc 재실행 → 추적 텍스트 파일에 해당 수치 토큰이 0건인지 `git grep -I` 로 확인(바이너리 PNG IDAT 일치는 제외 — 03-dev 분석 참조). 남은 가드(콘텐츠 사전 % 금지·CTA·preview·의료 문구)가 유지되는지. 산출물에 수치를 다시 쓰지 말고 "내부 KPI 수치 토큰"이라고만 쓴다.
점수 표(정확성·계획 준수/코드 품질·회귀·보안·검증 재현성 /25), APPROVE = 85+ 그리고 Blocking·Major 0. `gh pr comment 3` 1회.
