# Developer 지시 — G3 r2 (Minor 2건만, 범위 엄수)

★중복 아님 — 신규 구현 지시★ G3는 Reviewer r4 92점 APPROVE, QA r1 PASS 9/9로 통과했다. 머지 전에 `04-review-r4.md`의 Minor 2건만 고친다. 다른 파일·동작은 바꾸지 않는다. 같은 브랜치 `feat/kaniq-homepage`에 커밋을 추가하고 PR #1에 push한다(새 PR 아님).

1. `src/lib/i18n/negotiate.ts:6` — 언어 태그 토큰도 trim해서 `ja ;q=0.9` → `/ja`. `tests/negotiate.test.ts`에 `"ja ;q=0.9"`, `"ko ; q=0.5, en;q=0.4"` 케이스를 추가(수정 전 red 확인 후 green).
2. `tests/guards.test.ts:15-17` — `className={"cta"}`·`className={'cta …'}` 같은 문자열 리터럴 표현식도 잡도록 검사 확장. 변이(`className={"cta"}`를 임시로 넣으면 FAIL, 되돌리면 PASS)를 실측해 `03-dev.md`에 적는다.

검증: lint · `npx tsc --noEmit` · `npm test` 전체 · `npm run build` · curl `Accept-Language: ja ;q=0.9` → 307 /ja. `03-dev.md`의 STATUS 줄 **위에** 「r2 — Minor 처리」 절을 추가하고 STATUS를 마지막 줄로 유지한다(새 head SHA 포함).
