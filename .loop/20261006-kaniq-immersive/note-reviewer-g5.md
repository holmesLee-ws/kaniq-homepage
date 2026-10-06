# Reviewer 지시 — G5 종결 게이트 독립 감사 (run 전체)

run 전체의 종결 감사다. 읽기 전용. PR 코멘트 생략. 산출물에 기획서 비공개 수치·개인정보를 쓰지 않는다.

읽을 것: spec.md(B1~B11 체크박스·증적), gates.md(게이트별 점수·증강 맥락), 04-review-r1~r6, 05-qa-r*, 03-dev.md, 06-release.md, 07-lessons.md, `.lessons/`(신규·수정), evidence/(경로 실재 표본).

감사:
1. Acceptance ↔ 증적: B1~B11 체크박스의 증적 경로 전수 `ls`, QA 판정과 일치.
2. 보고 정확성: gates.md 점수·판정·축별 점수가 04/05 원문과 같은가(라운드 번호 포함).
3. 운영 일치: `gh api repos/holmesLee-ws/kaniq-homepage/commits/main --jq .sha`, `curl -sI https://kaniq-homepage.vercel.app/en`, `vercel api /v13/deployments/dpl_84XGs4qiqNFkhPpXbqsKLSwQgnRD --scope wishket-aidp --raw`의 meta.gitCommitSha가 06-release·05-qa(운영 라운드)와 같은가.
4. 공개 리포 보안: `rg -f /Users/holmesmac/my-projects/customers/kaniq/brief/.confidential-patterns.txt .loop/20261006-kaniq-immersive .lessons src`(파일 수·무관 일치 판정만 기록, 매칭 문자열은 적지 않음), 개인 이메일·계정명 패턴 0건.
5. 잔여 위험 기록: 가려진 CSS 규칙(Minor), 원어민 검수, 사전 공개 모드, Vercel git 미연결, `edd3834` 히스토리 토큰(사용자 결정 대기)이 산출물에 적혀 있는가.
6. 교훈 품질: `.lessons/` 신규·수정 항목의 IF-THEN·업스트림·검증.

점수 표(Acceptance↔증적 · 보고 정확성 · 잔여 위험 기록 · 정리 상태(교훈·운영 일치·보안) 각 /25). APPROVE = 85+ 그리고 Blocking·Major 0. 지적은 "어느 파일 몇 줄을 어떻게".
