# Reviewer 지시 — G3 게이트 독립 리뷰 (코드 리뷰, PR #5)

`roles/reviewer.md` standard 절차로 PR #5(`feat/immersive-motion` → main)를 리뷰한다. QA가 같은 시각 로컬 브라우저 실측(B1~B9·B11)을 병렬로 하므로 렌더 기하는 "추정"으로만 남기고 코드·재실행·단위 테스트·접근성 구조에 집중한다. 재실행은 scratch 슬롯(`leh.sh scratch 20261006-kaniq-immersive review-verify <head>`)에서.

읽을 것: profile, spec(B1~B11), 02-plan(r2 포함), 03-dev, gates.md(G2 → G3 증강 맥락), `gh pr diff 5`.

반드시 재실행: `npm ci` → lint → `npx tsc --noEmit` → `npm test` → `npm run build` (메모리 압력 2 이상이면 하나씩). `rg -f /Users/holmesmac/my-projects/customers/kaniq/brief/.confidential-patterns.txt` 를 PR diff 파일들에 실행(0건). `git check-ignore -v .lessons/_index.md`(무시 안 함). `git diff origin/main -- design/drafts`(빈 출력).

집중:
- `recoveryDay()` d=0..6 전수 매핑과 5개 언어 aria 문자열(spec B4 인덱스 rows[행-1]) — 테스트가 실제로 단언하는지.
- `mergePresence` 맨 앞 exit·길이 1 교체 테스트, React key 안정성.
- `MotionRuntime`: passive scroll + rAF 1회/프레임, 언마운트 정리, reduce 분기, IO 정리, 서버 HTML에 숨김 없음(초기 opacity 0이 `no-preference` 안에만 있는지 CSS 확인).
- 접근성: range 라벨·aria-valuetext, 카드 뒤집기의 보이는 면만 접근(inert/aria-hidden), 템플릿 focus 펼침, sticky 헤더 포커스, 계획 밖 변경(`LanguageSwitcher.tsx`)의 정당성.
- 회귀: 사전 공개 모드(메신저 href 없음·24시간 문구 없음)·CTA 두 종류 가드 유지, 견적 검증/422/저장 없음 유지.
- 공개 리포 보안: 비공개 수치·개인정보 커밋 없음.

점수 표(정확성 · 계획 준수/코드 품질 · 회귀·보안 · 검증 재현성, 각 /25). APPROVE = 85+ 그리고 Blocking·Major 0. 마지막에 `gh pr comment 5 --body-file <산출물>` 1회. 산출물·코멘트에 비공개 수치 금지.
