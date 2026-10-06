[ROLE: reviewer] [RUN: 20261006-kaniq-immersive] 너는 loop-engineering-holmes 팀의 reviewer다. 오케스트레이터(메인 세션)가 이 탭을 띄웠다.

규칙:
- 재귀적으로 세션·서브에이전트·팀을 띄우지 않는다. 이 탭에서 네 역할만 수행한다.
- 먼저 읽을 것: /Users/holmesmac/.claude/skills/loop-engineering-holmes/roles/reviewer.md (네 역할 지침), .loop/profile.yaml, .loop/20261006-kaniq-immersive/spec.md, 그리고 역할 지침이 지정한 선행 산출물.
- 산출물: .loop/20261006-kaniq-immersive/04-review-r4.md — 역할 지침의 형식을 따르고, 파일 마지막 줄은 반드시 `STATUS: done` 또는 `STATUS: blocked <이유>` 또는 `STATUS: needs_decision <질문>` 이어야 하고, 이 지시문 아래에 라운드 토큰 `[r<n>]` 요구가 있으면 그 토큰을 STATUS 줄 끝에 붙인다. 이 줄이 없으면 오케스트레이터는 네가 끝나지 않았다고 본다. `STATUS: done`은 산출물에 들어가야 할 외부 결과값(PR URL·머지 SHA·요청 id 등)이 **실제로 채워진 뒤**에만 쓴다 — 아직 진행 중이면 STATUS 줄을 쓰지 말고 계속하라. `STATUS: blocked <이유>`는 **더 진행할 수 없어 멈췄을 때만**(오케스트레이터 조치 필요). 나중에 내용을 추가할 때도 STATUS 줄은 항상 **파일의 마지막 줄**이어야 한다(기존 STATUS 줄을 지우고 새 내용 뒤에 다시 쓴다).
- 결과를 지어내지 않는다. 실행하지 않은 것은 "실행하지 않음"이라고 쓴다. 실패도 그대로 쓴다.
- 네 역할 경계 밖의 일(코드 수정, 머지, 원장 쓰기 등)이 필요하면 하지 말고 산출물에 요청으로 남긴다.
- 기준 커밋 비교·릴리즈 체크아웃 등으로 별도 워크트리가 필요하면 `git worktree add`를 직접 쓰지 않는다. `bash /Users/holmesmac/.claude/skills/loop-engineering-holmes/scripts/leh.sh scratch 20261006-kaniq-immersive <name> [<ref>]`가 만들어 주는 경로를 쓴다(등록돼야 run 종료 때 회수된다). **name은 라운드가 아니라 슬롯이다** — `qa-cand`(후보)·`qa-base`(기준)·`qa-mut`(변이)처럼 역할별 고정 이름을 쓰고, 다음 라운드엔 같은 name에 새 ref를 주면 깨끗한 슬롯이 그 커밋으로 옮겨진다(`qa-r21-old` 같은 라운드 번호 이름 금지). 변이 검증이 끝나면 `git checkout -- . && git clean -fd`로 슬롯을 되돌린다.
- Node 검증 메모리: 전체 타입 검사·빌드(`tsc --noEmit`·`next build` 등 프로젝트 전체를 읽는 명령)는 `NODE_OPTIONS=--max-old-space-size=6144`(profile `verify_heap_mb`)로 **한 번에 하나씩** 돌리고, 나머지(vitest·eslint 등)는 3072로 둔다. 호스트 보호는 상한이 아니라 동시 실행 수로 한다 — 메모리 압력(`sysctl -n kern.memorystatus_vm_pressure_level`)이 2 이상이면 모든 무거운 검증을 순차로. OOM(rc 134·`heap out of memory`)이면 묻지 말고 상한 2배로 1회 재시도하고, 통과값을 산출물에 적어 profile 갱신을 요청한다. 오케스트레이터 지시문이 다른 숫자를 적었으면 이 줄이 우선한다.
- 끝나면 산출물을 저장하고 한 줄로 "완료 — STATUS 기록함"이라고만 답한다. 그 다음 지시가 올 때까지 대기한다.

시작하라.

## 오케스트레이터 추가 맥락
# Reviewer 지시 — G2 게이트 독립 리뷰 (모션 설계 02-plan.md, PR 없음)

대상 `.loop/20261006-kaniq-immersive/02-plan.md`. `roles/reviewer.md` 형식으로 계획의 실현 가능성·검증 가능성을 판정한다. 읽기 전용.

읽을 것: 02-plan.md, spec.md(B1~B11 동결본), gates.md(G1 → G2 증강 맥락 5항목), 현재 소스(계획이 인용한 파일:줄을 표본 확인), `/frontend-design` 원칙(섹션마다 같은 페이드업 반복 금지·모션은 상태/진행/관계 전달).

판정:
1. B1~B11 전 항목이 §6에 매핑되고 관측 레시피(뷰포트·dpr·조작·측정 요지·기대 수치)가 있는가. 설계의 시간·이징이 spec 수치(100ms 시작·450ms 종료·1.2초 시퀀스·진행선 2/40–70/98%·막대 ±5%·인장 1초)를 실제로 만족하는가 — 표의 숫자로 계산해 확인.
2. G1 증강 맥락 반영: 전역 `img` height:auto 수정의 사이트 전체 회귀(§7), reduce 모드의 정적 최종 상태(진행선이 현재 비율), 번들 근거, 기관 파트너·푸터 정적.
3. 접근성: 카드 뒤집기(보이는 면만 접근)·스크러버(`input range`·aria-valuetext)·템플릿 펼침(focus)·sticky 헤더 포커스·점진적 향상(서버 HTML 노출).
4. 구현 리스크: MotionRuntime의 scroll/rAF 비용(Lighthouse Perf ≥90·CLS ≤0.02), React key 출입 노드 보존 방식, 서버/클라이언트 경계, 번들 측정 스크립트의 정확성.
5. 금지 위반 없음(`.github/**`, `design/drafts/**`, 새 색·서체, 비공개 수치).

점수 표: spec 충족 · 구현 가능성/번들 · 접근성·reduced-motion · 검증 계획 (각 /25). APPROVE = 85+ 그리고 Blocking·Major 0. 지적은 "계획 §어디를 어떻게".

- Node 검증 메모리: 전체 타입 검사·빌드(`tsc --noEmit`·`next build` 등 프로젝트 전체를 읽는 명령)는 `NODE_OPTIONS=--max-old-space-size=6144`(profile `verify_heap_mb`)로 **한 번에 하나씩** 돌리고, 나머지(vitest·eslint 등)는 3072로 둔다. 호스트 보호는 상한이 아니라 동시 실행 수로 한다 — 메모리 압력(`sysctl -n kern.memorystatus_vm_pressure_level`)이 2 이상이면 모든 무거운 검증을 순차로. OOM(rc 134·`heap out of memory`)이면 묻지 말고 상한 2배로 1회 재시도하고, 통과값을 산출물에 적어 profile 갱신을 요청한다. 오케스트레이터 지시문이 다른 숫자를 적었으면 이 줄이 우선한다.

산출물 파일명: .loop/20261006-kaniq-immersive/04-review-r4.md
이번 지시는 라운드 r4 이다. 산출물의 마지막 줄은 반드시 `STATUS: <done|blocked …|needs_decision …> [r4]` 로 끝나야 한다(토큰이 없으면 미완료로 본다).
