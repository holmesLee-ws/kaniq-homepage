# Designer 지시 — G2 r2 (02-plan.md 수정)

G2 독립 리뷰 `04-review-r4.md`가 81점 CHANGES다(spec 충족 21 · 구현 가능성 18 · 접근성 23 · 검증 19). `02-plan.md`를 고쳐 **Major 3건과 Minor 6건 전부**를 해소한다. 다른 설계는 바꾸지 않는다.

- M1 `data-intro` 소유: intro 속성을 JourneyPlanner가 실제 렌더하는 요소 하나(예: `article.plan` 또는 플래너 래퍼)로 정하고, 로드 시퀀스 키프레임 선택자를 그 요소 기준(`.plan[data-intro]` 또는 `.hero:has([data-intro])`)으로 바꾼다. 서버 HTML에 속성이 있어 JS 없이도 시퀀스가 돌고, 첫 조작 렌더에서 같은 요소의 속성을 지워 출입 게이트가 열리는지 §3.2·§3.4·§4에 일관되게 적는다.
- M2 `mergePresence`: 앞에 남는 key가 없으면 목록 맨 앞에 exit을 둔다는 규칙과, `tests/presence.test.ts`에 (1) 첫 항목만 교체 (2) 길이 1 목록 키 교체 케이스를 추가한다.
- M3 R-B1: load 뒤 `scrollTo({top, behavior:"instant"})`로 `#care` 고정 → `data-inview`/칩 `animation-name` 확인 후 측정. 고정 600ms 대기를 판정 조건에서 뺀다.
- Minor: 앰버서더 점 끝 시각 570ms로 표 수정 · 번호 색 「현재 pine, 미도달만 text-3」 · §3.10 옮길 선언은 `.site-head{justify-content}`뿐(`.site-nav{display:none}` 유지) · 완료 인장 `pathLength="1"` · `frame()`에 `reachedSteps(p)`를 `#trust-steps`에 쓰는 줄 · R-B5a `data-inview` 확인 후 `currentTime` 설정.

`02-plan.md` 끝에 「r2 변경 내역」 절(지적 → 수정 위치)을 추가하고, STATUS 줄을 마지막 줄 `STATUS: done [r2]`로.
