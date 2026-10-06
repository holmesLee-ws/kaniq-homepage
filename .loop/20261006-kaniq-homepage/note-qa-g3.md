# QA 지시 — G3 로컬 실기 (PR #1, round 1)

`roles/qa.md` standard 절차로 spec A1~A9를 실측한다(A10은 배포 후 운영 라운드). 접근 경로 `local-session`: 공개 사이트라 로그인 없음. `feat/kaniq-homepage` 기준 커밋(`leh.sh baseline 20261006-kaniq-homepage`)에서 `npm ci && npm run build && npm start`(포트 충돌 시 다른 포트)로 띄우고 claude-in-chrome(또는 Playwright)으로 조작한다. Reviewer가 같은 시각 코드 리뷰를 병렬로 한다.

## 읽을 것
`.loop/profile.yaml`, `spec.md`, `02-plan.md` §6.3(관측 레시피), `03-dev.md`(Developer 증적 dev-A*), `gates.md`(G2→G3 증강 맥락).

## 실측 메모
- A2: 진료/일수/인원 축별 (a)(b)(c) 각각 + 키보드만 조작. A3: 5개 홈 히어로 H1(일본어는 줄바꿈 접어 비교)·우선 진료·특화·메신저, preview 단언 3개(상단 띠·메신저 href 없음·24시간 문구 없음), 언어 전환기 2단계 비활성. A6: ja로 1회 완주 + 422 경로. A7: 390·768·1440 scrollWidth, 포커스는 1440×900, reduced-motion 에뮬레이션, Lighthouse mobile JSON 저장.
- 각 항목 증적 `.loop/20261006-kaniq-homepage/evidence/qa-A<n>-*.png|json|log`. PASS 항목마다 spec 체크박스 [x] + 증적 경로.
- 산출물 표 아래에 **QA 점수**를 넣는다: `## 점수: NN/100 — (PASS 항목 수/9 × 100, 소수 버림)` 와 축별 한 줄(기능·현지화·품질 하한·문구 준수).
- FAIL은 재현 단계 + 사유 태그(`조건 불일치`|`구현 결함`|`환경`).
- Developer가 포트 3000에 production 서버(PID 10175)를 띄워 두었다. 그 서버가 기준 커밋과 같은 빌드인지 확인할 수 없으면 직접 다른 포트(예: 3100)로 새로 빌드·기동해 실측한다.
