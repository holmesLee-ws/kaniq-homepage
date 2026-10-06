# Reviewer 지시 — G5 종결 게이트 독립 감사 (run 전체)

이번 라운드는 코드 리뷰가 아니라 **run 전체의 종결 감사**다. 읽기 전용. PR 코멘트 생략.

## 읽을 것
`spec.md`(체크박스·증적 경로), `gates.md`(게이트별 점수·증강 맥락), `04-review-r1~r6.md`, `05-qa-r1~r4.md`, `03-dev.md`, `06-release.md`, `.lessons/`(신규 2건과 `_index.md`), `evidence/`(경로 실재만 표본 확인).

## 감사할 것
1. **Acceptance ↔ 증적**: A1~A10 체크박스마다 붙은 증적 경로가 실제로 존재하는가(전수 `ls`), QA 판정과 일치하는가.
2. **보고 정확성**: gates.md의 각 게이트 점수·판정·축별 점수가 04/05 원문과 정확히 같은가(숫자 하나라도 다르면 지적).
3. **운영 일치**: `gh api repos/holmesLee-ws/kaniq-homepage/commits/main --jq .sha`, `curl -sI https://kaniq-homepage.vercel.app/en`, Vercel 배포 메타(`vercel api /v13/deployments/dpl_6Mjd6j1oSSBgyGZWztYJxxsn2YQ9 --scope wishket-aidp --raw`의 meta.gitCommitSha)가 06-release·05-qa-r4와 같은가. 공개 리포에 기획서 내부 수치·비밀이 없는가(`gh api` 또는 로컬 rg 표본).
4. **잔여 위험 기록**: 원어민 검수 필요, 사전 공개 모드(launchState=preview), Vercel git 미연결(자동 배포 없음), dev 의존성 audit high 5건, 2단계 언어 404 시 NoFallbackError 서버 로그 — 이것들이 산출물(03-dev·06-release·README 등)에 적혀 있는가.
5. **교훈 품질**: `.lessons/` 2건이 IF-THEN 예방 규칙·업스트림 원인·검증을 갖췄는가.

## 점수 (VERDICT 바로 아래)
```
## 점수: NN/100
| 축 | 점수(/25) | 근거 한 줄 |
| Acceptance↔증적 대응 | | |
| 보고 정확성 | | |
| 잔여 위험 기록 | | |
| 정리 상태(교훈·운영 일치) | | |
```
APPROVE = 85+ 그리고 Blocking·Major 0. 지적은 "어느 파일 몇 줄을 어떻게 고치면 해소되는가"로.
