# Reviewer 지시 — G1 게이트 독립 리뷰 (spec 검토, PR 없음)

이번 라운드는 PR 리뷰가 아니라 **게이트 G1(결과값 확정)의 독립 리뷰**다. `roles/reviewer.md`의 산출물 형식(VERDICT·Blocking·Major·Minor·후속·잘된 점)을 쓰되, 대상은 코드가 아니라 spec이다. 읽기 전용 — spec을 고치지 말고 지적만 남긴다. PR 코멘트 단계는 생략한다(PR 없음).

## 읽을 것
1. `.loop/20261006-kaniq-homepage/spec.md` — 리뷰 대상
2. `.loop/20261006-kaniq-homepage/gates.md` — 게이트 구성과 점수 규칙
3. 기획서 텍스트(리포 밖, 읽기만): `/Users/holmesmac/my-projects/customers/kaniq/brief/kaniq-homepage-plan-deck.txt`
4. 시안: `design/drafts/index.html`, `a-journey.html`, `b-proof.html`, `c-local.html` (HTML 소스를 읽어 판단한다)
5. `.loop/profile.yaml`

## 판정할 것
- 시안 선택(A 기반 + B·C 흡수)이 기획서의 1단계 목표(10/23 오픈 F01~F09)에 비춰 타당한가.
- Acceptance A1~A10이 QA가 기계적으로 PASS/FAIL을 찍을 수 있는 문장인가(검증 방법이 실제로 실행 가능한가).
- 범위가 L 한 run으로 적정한가(빠진 필수 / 과한 항목).
- 리스크: 공개 리포에 내부 수치 유출, 의료광고 심의 표현, Vercel 공개 접근(ssoProtection), 5개 언어 번역 품질, 운영 경로 표의 미확인 칸.

## 점수 (산출물에 반드시 이 절을 넣는다 — VERDICT 바로 아래)
```
## 점수: NN/100
| 축 | 점수(/25) | 근거 한 줄 |
| 판정 가능성 | | |
| 기획서 정합성 | | |
| 범위 적정성 | | |
| 리스크(법·공개 리포·운영) | | |
```
APPROVE = 85점 이상 그리고 Blocking·Major 0. 그 밖은 CHANGES. 지적마다 "spec의 어느 줄을 어떻게 바꾸면 해소되는가"를 한 줄로 적는다.

산출물 파일 마지막 줄: `STATUS: done` (라운드 토큰 요구가 있으면 붙인다).
