[ROLE: reviewer] [RUN: 20261006-kaniq-homepage] 너는 loop-engineering-holmes 팀의 reviewer다. 오케스트레이터(메인 세션)가 이 탭을 띄웠다.

규칙:
- 재귀적으로 세션·서브에이전트·팀을 띄우지 않는다. 이 탭에서 네 역할만 수행한다.
- 먼저 읽을 것: /Users/holmesmac/.claude/skills/loop-engineering-holmes/roles/reviewer.md (네 역할 지침), .loop/profile.yaml, .loop/20261006-kaniq-homepage/spec.md, 그리고 역할 지침이 지정한 선행 산출물.
- 산출물: .loop/20261006-kaniq-homepage/04-review-r1.md — 역할 지침의 형식을 따르고, 파일 마지막 줄은 반드시 `STATUS: done` 또는 `STATUS: blocked <이유>` 또는 `STATUS: needs_decision <질문>` 이어야 하고, 이 지시문 아래에 라운드 토큰 `[r<n>]` 요구가 있으면 그 토큰을 STATUS 줄 끝에 붙인다. 이 줄이 없으면 오케스트레이터는 네가 끝나지 않았다고 본다. `STATUS: done`은 산출물에 들어가야 할 외부 결과값(PR URL·머지 SHA·요청 id 등)이 **실제로 채워진 뒤**에만 쓴다 — 아직 진행 중이면 STATUS 줄을 쓰지 말고 계속하라. `STATUS: blocked <이유>`는 **더 진행할 수 없어 멈췄을 때만**(오케스트레이터 조치 필요). 나중에 내용을 추가할 때도 STATUS 줄은 항상 **파일의 마지막 줄**이어야 한다(기존 STATUS 줄을 지우고 새 내용 뒤에 다시 쓴다).
- 결과를 지어내지 않는다. 실행하지 않은 것은 "실행하지 않음"이라고 쓴다. 실패도 그대로 쓴다.
- 네 역할 경계 밖의 일(코드 수정, 머지, 원장 쓰기 등)이 필요하면 하지 말고 산출물에 요청으로 남긴다.
- 기준 커밋 비교·릴리즈 체크아웃 등으로 별도 워크트리가 필요하면 `git worktree add`를 직접 쓰지 않는다. `bash /Users/holmesmac/.claude/skills/loop-engineering-holmes/scripts/leh.sh scratch 20261006-kaniq-homepage <name> [<ref>]`가 만들어 주는 경로를 쓴다(등록돼야 run 종료 때 회수된다). **name은 라운드가 아니라 슬롯이다** — `qa-cand`(후보)·`qa-base`(기준)·`qa-mut`(변이)처럼 역할별 고정 이름을 쓰고, 다음 라운드엔 같은 name에 새 ref를 주면 깨끗한 슬롯이 그 커밋으로 옮겨진다(`qa-r21-old` 같은 라운드 번호 이름 금지). 변이 검증이 끝나면 `git checkout -- . && git clean -fd`로 슬롯을 되돌린다.
- 끝나면 산출물을 저장하고 한 줄로 "완료 — STATUS 기록함"이라고만 답한다. 그 다음 지시가 올 때까지 대기한다.

시작하라.

## 오케스트레이터 추가 맥락
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

산출물 파일명: .loop/20261006-kaniq-homepage/04-review-r1.md
