# Reviewer 지시 — G3 델타 재리뷰 (PR #1 r2 커밋)

직전 `04-review-r4.md`(92점 APPROVE)의 Minor 2건을 Developer가 r2로 고쳤다(`03-dev.md` 「r2 — Minor 처리」). 범위는 `4be4286..e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf` 델타뿐: src/lib/i18n/negotiate.ts tests/guards.test.ts tests/negotiate.test.ts 
델타만 읽고 재실행한다: `gh pr diff 1`에서 해당 파일, `npm test`(75), `npx tsc --noEmit`, `npm run lint`, 그리고 Minor 2건의 재현(`Accept-Language: ja ;q=0.9` → /ja, guards 변이 `className={"cta"}` → FAIL)을 직접 확인. 같은 점수 표 형식(4축 /25)으로 G3 최종 점수를 낸다 — r4 점수에서 델타 결과를 반영해 조정. APPROVE = 85+ 그리고 Blocking·Major 0. `gh pr comment 1` 1회.
