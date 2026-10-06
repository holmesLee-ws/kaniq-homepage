# Reviewer 지시 — G1 게이트 독립 리뷰 (spec, PR 없음)

게이트 G1(결과값)의 독립 리뷰다. 대상은 `.loop/20261006-kaniq-immersive/spec.md`. `roles/reviewer.md` 산출물 형식(VERDICT·점수·Blocking·Major·Minor·후속·잘된 점)으로 쓰되 PR·코드가 아니라 spec을 판정한다. 읽기 전용.

읽을 것: spec.md, gates.md, 현재 소스(`src/` — 특히 `src/components/home/*`, `src/styles/globals.css`, `src/app/[lang]/page.tsx`), 운영 사이트 https://kaniq-homepage.vercel.app/ko#care 와 /en (curl 또는 브라우저 가능하면), 직전 run 산출물 `.loop/20261006-kaniq-homepage/`(spec·05-qa-r1).

판정: (1) 사용자 요청("몰입형·인터랙티브·모션 다 개선" + `#care` 이미지 화면 정리)을 B1~B10이 빠짐없이·과하지 않게 담는가 (2) 각 항목이 QA가 기계적으로 PASS/FAIL할 수 있는가(수치·조작 조건) (3) `#care` 버그 원인 진단(spec 배경)이 소스와 맞는가 — 해당 CSS/마크업을 파일:줄로 확인 (4) 성능·접근성·reduced-motion·점진적 향상·회귀 리스크가 닫혔는가 (5) L 한 run 범위로 적정한가.
점수 표: 판정 가능성 · 사용자 의도 정합 · 범위 적정성 · 리스크 (각 /25). APPROVE = 85+ 그리고 Blocking·Major 0. 지적마다 spec 몇 행을 어떻게 바꾸면 해소되는지.
산출물에 기획서 비공개 수치를 쓰지 않는다.
