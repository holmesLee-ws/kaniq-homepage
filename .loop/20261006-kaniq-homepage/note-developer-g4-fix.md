# Developer 지시 — G4 fix-forward (PR #2, 범위 2건)

★중복 아님 — 신규 구현 지시★ PR #1은 main(edd3834)에 머지·운영 배포됐고 G4 운영 QA(`05-qa-r3.md`)가 98점 PASS다. 관찰 2건만 새 PR로 고친다. 다른 동작·문구는 바꾸지 않는다.

- 브랜치: `fix/ja-h1-favicon` (origin/main에서 새로). PR base main. 머지·배포는 하지 않는다.

1. **ja H1 고아 줄바꿈** (`05-qa-r3.md` 「관찰 1」): `/ja` 1440×900에서 H1이 「ソウルまで2時間。/ 精密検診も歯科 / も、/ 週末で。」로 「も、」가 떨어진다. 의도는 시안 C의 세 구절(「ソウルまで2時間。」「精密検診も歯科も、」「週末で。」). 구절이 중간에서 끊기지 않게 한다 — 권고: 사전에 구절 배열(또는 기존 문자열 유지 + 렌더에서 구절 단위 `<span>`+`white-space: nowrap`/`word-break: keep-all`)을 두고, 좁은 폭(390)에서는 구절 사이에서만 줄이 바뀌게. ko H1에도 같은 `word-break: keep-all`이 맞는지 확인(어절 중간 끊김 방지). A3 fixture 단언(줄바꿈 접은 문자열 = spec 원문)은 그대로 통과해야 한다.
   - 실측: `/ja`·`/ko` × 390·768·1440 H1 줄 구성 스크린샷 `evidence/dev-fix-A3-{ja,ko}-{390,768,1440}.png` + 각 줄 텍스트를 `03-dev.md`에. scrollWidth=innerWidth 유지.
2. **`/favicon.ico` 404** (`05-qa-r2.md` 관찰): 브라우저 기본 요청 `/favicon.ico`가 200이 되게 한다(Next App Router 파일 규약 `src/app/favicon.ico` 또는 `icon` — 공식 문서 확인). 기존 data SVG 아이콘 metadata와 충돌하지 않게.

검증: lint · `npx tsc --noEmit` · `npm test` 전체 · `npm run build` · `npm start` 후 `curl -sI /favicon.ico` 200. `03-dev.md` STATUS 줄 **위에** 「r3 — G4 fix-forward」 절(PR #2 URL·head SHA·변경 파일·검증·스크린샷)을 추가하고 마지막 줄 `STATUS: done [r3]`.
