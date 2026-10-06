# Reviewer 지시 — G3 게이트 독립 리뷰 (코드 리뷰, PR #1)

`roles/reviewer.md` 절차 전부(standard 티어)로 PR #1(`feat/kaniq-homepage` → main)을 리뷰한다. QA가 같은 시각 로컬 브라우저 실기를 병렬로 하므로, 렌더·기하는 "추정"으로만 남기고 코드·재실행·단위 테스트에 집중한다.

## 읽을 것
`.loop/profile.yaml`, `spec.md`(A1~A10), `02-plan.md`, `03-dev.md`, `gates.md`(G2→G3 증강 맥락 5항목), `04-review-r3.md`(G2 Minor 5건 — 구현 반영 여부 확인), `gh pr diff 1`.

## 반드시 재실행 (결과를 03-dev.md와 대조)
- `npm ci` → `npm run lint` → `npx tsc --noEmit` → `npm test` → `npm run build`
- spec A4·A9의 `rg` 금지어 명령 원문, `git diff origin/main -- design/drafts`
- `npm start` 후 A1(헤더 9종 리다이렉트·홈 5종 200·lang·2단계 6종 404), A6(`/api/quote` 200/422, 본문에 id 없음), A8(hreflang·x-default·sitemap·robots) curl

## 집중
- `launchState` preview에서 메신저 버튼에 href가 없고 24시간 문구가 없는지, live 전환 시 링크·문구가 켜지는지(단위 테스트 포함)
- `/api/quote` 핸들러가 본문을 로그·저장·외부 전송하지 않는지, 입력 검증이 서버에서 이뤄지는지(클라이언트만 검증 금지)
- proxy의 Accept-Language 파싱 셀 전수(q값·지역 태그·미일치·헤더 없음·대소문자) — 표로 열거
- 공개 리포 보안: 비밀·토큰·기획서 내부 수치 커밋 여부, `.github/**` 없음
- CTA 두 종류 강제(guards 테스트가 실제로 위반을 잡는지)

## 점수 (VERDICT 바로 아래)
```
## 점수: NN/100
| 축 | 점수(/25) | 근거 한 줄 |
| 정확성(Acceptance 충족) | | |
| 계획 준수·코드 품질 | | |
| 회귀·보안 | | |
| 검증 재현성 | | |
```
APPROVE = 85점 이상 그리고 Blocking·Major 0. 마지막에 `gh pr comment 1 --body-file <산출물>` 1회.
