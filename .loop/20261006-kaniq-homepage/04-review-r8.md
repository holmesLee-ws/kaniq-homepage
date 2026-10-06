# Review — 20261006-kaniq-homepage round 8 — PR #3

VERDICT: APPROVE

## 점수: 93/100
| 축 | 점수(/25) | 근거 한 줄 |
| 정확성(Acceptance 충족) | 24 | 삭제된 단언은 2개, 4줄이다. 콘텐츠 사전의 `%`·요율 단어, CTA, `#` href, 의료 문구, `launchState === preview` 가드는 `tests/guards.test.ts`에 남아 있고 그 테스트가 PASS다. |
| 계획 준수/코드 품질 | 23 | 제품 diff는 `tests/guards.test.ts` 한 파일, 0 insertions / 4 deletions. 보호 경로와 해시 우회는 없다. 계획 §6.2 (5)의 수치 토큰 단언은 이번 보안 지시로 빠졌다. |
| 회귀·보안 | 23 | 삭제된 가드의 내부 KPI 수치 토큰은 추적 텍스트에서 0건이다. 제품 소스·UI diff는 없다. 이미 공개된 main 히스토리와 이 PR의 삭제 패치에는 그 줄이 남는다. |
| 검증 재현성 | 23 | lint rc 0, tsc rc 0, test 9 files / 75 tests가 03-dev r4와 같다. `npm run build`는 실행하지 않음. PNG 3건은 이 토큰으로 재현되지 않았다. |

통과선은 85점 이상이고 Blocking·Major 0이다. 이번 판정은 93점, Blocking 0, Major 0.

점수 표는 r4–r6과 같이 4축이다. 합은 100이고, 보안 확인은 회귀·보안 축에 넣었다.

HEAD `91cdf7a4fcb681e6acf90fa8debe1781c4ecc53a`. `gh pr view 3`의 head oid, 로컬 HEAD, `origin/fix/remove-internal-figures`가 같다. PR은 OPEN, base `main`, 파일 1개, additions 0, deletions 4. 이 워크트리는 그 브랜치에 이미 있었고 porcelain은 검증 전 0이라 `gh pr checkout`을 다시 하지 않았다. 첫 압력 조회는 2, test·lint·tsc 직전·직후는 1이었다. 무거운 검증은 처음부터 하나씩 돌렸다. heap은 vitest·eslint 3072, tsc 6144. OOM 없음. profile 갱신 요청 없음. Node v22.23.1.

상태 전이 표는 해당 없다. 이 diff는 가드 단언 삭제뿐이고, 플래그×종료 상태 같은 입력 축이 없다. 셀렉터·오버레이·레이아웃 계약을 바꾸는 파일이 없어 참조 기준 e2e는 돌리지 않았다.

## 재실행 결과 (명령 → 결과, 03-dev.md와 일치 여부)

`gh pr diff 3 --name-only`와 `git diff --name-only origin/main`은 `tests/guards.test.ts` 하나만 가리킨다. `git diff --numstat origin/main`은 `0 4`.

| 명령 | 결과 | 03-dev r4 |
|---|---|---|
| `NODE_OPTIONS=--max-old-space-size=3072 npm test` | rc 0. 9 files / 75 tests PASS. `tests/guards.test.ts` 1 test | 같음 |
| `NODE_OPTIONS=--max-old-space-size=3072 npm run lint` | rc 0. eslint 배너만 | 오류·경고 없음과 같음 |
| `NODE_OPTIONS=--max-old-space-size=6144 npx tsc --noEmit` | rc 0. stdout 비음 | baseline 0과 같음 |
| `npm run build`, 브라우저, `npm audit` | 실행하지 않음 | 03-dev 값을 재확인하지 않음 |

남은 가드(`tests/guards.test.ts`):

- 14–17행: `/cta/` 밖 tsx에서 `className`의 `cta` 클래스.
- 18행: `href="#"`.
- 20–22행: `src/content/`의 `%`, `수수료율`, `commission rate`, `referral rate`.
- 24–27행: 영문 의료 문구와 `최고|보장|줄기세포|전후|保証|最高|stem cell`.
- 29행: `site.launchState`가 `preview`.

삭제분은 src 순회 안의 수치 토큰 단언 1개와 README 단언 1개다. 우회용 인코딩·해시 단언은 diff에 없다.

### git grep

삭제된 정규식 리터럴 1개(대안 6개)를 `origin/main:tests/guards.test.ts`에서 뽑아 검색했다. 산출물에는 토큰 원문을 적지 않는다.

| 검색 | 결과 |
|---|---|
| 정규식 전체, `git grep -I -E` | rc 1, 일치 줄 0 |
| 대안 6개 각각, `git grep -I -F`와 `git grep -a -F` | 모두 rc 1, 파일 0 |
| HEAD의 `tests/guards.test.ts`에 그 정규식 포함 | 없음 |

03-dev r4는 같은 주제를 검색했을 때 텍스트 0건, PNG 원본 3개(`design/drafts/img/src/a-hanok-tea.png`, `b-documents.png`, `c-family-palace.png`)의 IDAT 일치라고 적는다. 이번 6개 대안으로는 그 PNG 일치가 나오지 않았다. `git grep -a -F IHDR`는 그 PNG를 찾으므로, 바이너리 검색 자체는 동작한다. 개발자 지시문의 더 넓은 `git grep -e` 목록은 지금 `[내부수치]`로만 남아 있어, 그 argv 그대로의 재실행은 하지 못했다.

## Blocking
없음.

## Major
없음.

## Minor
- 계획 §6.2 (5)는 `src/**`와 README의 내부 KPI 수치 토큰을 `tests/guards.test.ts`가 계속 확인한다고 적는다. 그 단언은 공개 리포 노출을 없애라는 이번 지시대로 삭제됐다. 이후 커밋이 같은 토큰을 다시 넣어도 이 테스트는 통과한다. 해시 비교는 지시가 금지했다. 현 상태를 받아들이거나, 수치를 적지 않는 다른 확인을 오케스트레이터가 정하면 해소된다.
- 03-dev r4의 PNG 3건은 삭제된 가드의 6개 대안으로 재현되지 않았다. 03-dev 해당 문장에 「이 6개 대안 재검색은 텍스트·바이너리 모두 0」을 붙이거나, 빨간 검색 목록이 복원된 뒤에만 그 명령을 다시 돌리면 보고와 실측이 맞는다.

## 후속 (판정 제외)
- 팁의 추적 텍스트에는 내부 KPI 수치 토큰이 없다. 그 토큰은 이번 PR 이전 main 파일에 이미 있었고, 삭제 커밋의 패치와 PR #3 diff에 제거된 줄로 남는다. 공개 히스토리 정리는 force-push 판단이라 이 PR의 코드 수정 요청으로 두지 않는다.
- `npm run build`와 브라우저는 실행하지 않음. 이번 diff에 UI·제품 소스 파일이 없다.
- `design/drafts/**`는 diff에 없다. 보호 원본은 수정하지 않았다.

## 잘된 점
- 변경이 가드 파일 4줄 삭제에 머문다. 커밋 제목과 PR 본문은 「내부 KPI 수치 토큰」이라고만 적는다.
- CTA, 콘텐츠 사전 `%`·요율 단어, preview, 의료 문구 가드가 같은 테스트에 남아 75 tests가 유지된다.
- 추적 텍스트의 `git grep -I`는 0건이다.

STATUS: done [r8]
