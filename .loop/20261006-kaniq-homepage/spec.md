# spec — 20261006-kaniq-homepage

> 공개 리포 공개 전 처리(2026-10-06 G5): 기획서의 비공개 수치(파트너 배분율·예산·KPI 목표)는 이 run 산출물 전체에서 `[내부수치]`로 가렸다. 원문 수치는 리포 밖 기획서에만 있다.

## 배경
- 출처: 사용자(holmesLee-ws) 요청, 2026-10-06. 기획서 「KANIQ 차별화 홈페이지 구축 기획」(카닉㈜, 2026-10-05, 20장) → 오케스트레이터가 같은 세션에서 HTML 시안 3종을 만들었다(`design/drafts/`).
- 사용자 지시: "시안 중에서 좋은 거 골라서 알아서" 구현까지 완결하고, GitHub(holmesLee-ws, public)와 Vercel에 배포한다. 게이트 구성·게이트별 독립 리뷰 점수·게이트 간 맥락 증강을 보고한다.
- 기획서 원본(내부 요율·예산 포함 → 공개 리포에 넣지 않음): `/Users/holmesmac/my-projects/customers/kaniq/brief/kaniq-homepage-plan-deck.txt` (텍스트 추출본), 같은 폴더의 `.pptx`. **워커는 읽기만 하고 리포에 복사하지 않는다.**
- 기획서 핵심(구현에 쓰는 것만): 환자가 한국 의료 여정을 스스로 설계하고, 신뢰 근거를 확인한 뒤, 모국어로 상담을 시작하는 플랫폼. 비미용 5개 진료(검진·치과·안과·여성·난임). 5가지 차별화 — Trust Design, Journey Builder + Doctor OK, 커뮤니티 리퍼럴(앰버서더), 번역이 아닌 현지화(언어권 홈), 기관 파트너 존. 1단계 언어권 홈 5개(한·영·일·인니·몽), 2단계 6개(힌디·러·베·중·스·태, 12월). CTA는 2종만(메신저 / 견적). 모든 페이지 하단 메신저 상담 바 고정. 환자 수수료 0원 3원칙(환자 0원·직접 방문과 동일 가격·병원 부담), 요율 숫자는 노출하지 않는다. 의료광고 심의: 효과 보장·최상급·전후 사진 금지.

## 시안 선택 (오케스트레이터 결정 — 위임)
**기반 = 시안 A(여정이 먼저 보이는 홈)** 의 시각 체계(청자 녹색 팔레트, Schibsted Grotesk, 인터랙티브 여정 히어로)를 쓰고, 그 체계 안으로 **B의 "Who pays what" 영수증(수수료 0원)·병원/의사 기록 카드·문제 발생 절차**와 **C의 언어권별 홈(헤드라인·우선 진료·특화·메신저가 바뀜)·앰버서더·기관 존**을 흡수한다. 세 시안의 미감을 섞지 않는다 — 모든 섹션은 A의 토큰으로 다시 그린다.
- 근거: (1) 기획서가 "아무도 없는 자리"로 짚은 것이 여정 설계 + Doctor OK이고, 첫 화면에서 바로 체험되는 유일한 차별화다. (2) 신뢰(B)는 히어로가 아니라 결정 직전 구간에서 더 잘 작동한다. (3) 언어권 현지화(C)는 섹션이 아니라 라우팅·콘텐츠 구조로 구현해야 하는 요구(F01)다.

## 기획서 1단계 기능(F01~F10) 처리 — 포함 · 축소 · 제외
| 기능 | 처리 | 이 run에서의 모습 |
|---|---|---|
| F01 언어권 홈 5개 | 포함 | /en /ja /id /mn /ko — 헤드라인·우선 진료·특화·메신저가 언어권마다 다름 |
| F02 메신저 상담 바 | 포함(사전 공개 모드) | 언어권 메신저 정체성(이름·색) 표시. 공식 계정 미개설이라 링크 대신 "출시 때 열림" 상태 — 아래 제약 「오픈 태도」 |
| F03 3단계 견적 폼 + 픽업·체류 희망 | 포함 | 관심 진료 → 일정(+픽업·체류 희망 선택 필드) → 연락처. 저장·회신 없음 |
| F04 병원·의료진 카드 | 포함(샘플) | 등록번호·인증·전문의 수·언어 + 의사 실명 구조, 모두 "샘플" 표기 |
| F05 여정 템플릿 6종 + Doctor OK | 포함 | 목록 6종. "PDF 받기"는 견적 시작으로 연결(PDF 생성 없음) |
| F06 신뢰 페이지 | 축소 | 별도 페이지 대신 홈의 신뢰 구간(영수증·기록 카드·문제 발생 4단계) + 푸터 |
| F07 앰버서더 가입·코드 | 축소 | 환원처 4개 선택 UI + 금액 없는 추천 현황 미리보기(샘플). 가입·코드 발급 없음 |
| F08 B2B 기관 문의 | 축소 | 기관 파트너 존 문구와 대상 4종만. 문의 폼 없음 |
| F09 트래킹·CRM | 제외 | 비목표 |
| F10 Journey Builder 인터랙티브 | 포함(2단계 앞당김) | 히어로 플래너 — 시안 A 동작 그대로 |

헤더의 진료 찾기·여정·추천하기·신뢰는 별도 라우트가 아니라 같은 홈의 섹션 앵커다.

## 결과물 — 무엇이 나오면 끝인가
공개 GitHub 리포 `holmesLee-ws/kaniq-homepage`의 main에 Next.js(App Router, TypeScript) 사이트가 있고, Vercel 프로젝트 `wishket-aidp/kaniq-homepage`의 production `https://kaniq-homepage.vercel.app` 에서 누구나 로그인 없이 볼 수 있다.

```
/            → Accept-Language로 /en|/ja|/id|/mn|/ko 중 하나로 이동 (기본 /en)
/{lang}      언어권 홈 (5개)
  ┌ 헤더: 로고 · 진료 찾기 · 여정 · 추천하기 · 신뢰 · 언어 전환(1단계 5개 + 2단계 6개 "12월 오픈" 표시)
  ├ 히어로: 언어권 헤드라인 | 여정 플래너(진료 5 · 일수 5/7/10 · 인원) → D-1~귀국 타임라인, Doctor OK 배지, 참고가격·KANIQ 수수료 ₩0
  ├ 언어권 블록: 우선 진료 칩 · 특화(할랄/여성 의료진/비자 초청 등) · 언어권 메신저 버튼
  ├ Doctor OK 규칙 그리드 → 회복 주간 표(D0 / D1–2 / D3–5 / 경과 확인 후 × 숙소·관광·식사·문화)
  ├ 신뢰: "Who pays what" 영수증 + ₩0 인장 · 병원/의사 기록 카드(샘플 표기) · 문제 발생 시 4단계
  ├ 여정 템플릿 6종 목록
  ├ 앰버서더: 감사 환원처 4개 선택 + 추천 현황 미리보기(금액 없음) · 기관 파트너 존
  └ 푸터: 유치업·여행업 등록번호(샘플) · 수수료 원칙 · 개인정보 · 분쟁 절차
  + 하단 고정 메신저 상담 바 (언어권 메신저 + 견적)
/{lang}/quote 3단계 견적 폼 (관심 진료 → 일정 + 픽업·체류 희망(선택) → 연락처) → POST /api/quote → 완료 화면
```
- 콘텐츠는 언어별 타입 사전(헤드리스 CMS로 교체 가능한 구조)으로 두고, 5개 언어 모두 전 섹션을 그 언어로 쓴다. 브랜드명·로고·등록번호는 토큰/설정 한 곳에서 바꾼다(기획서: 브랜드 미확정).
- 이미지는 `design/drafts/img/*.jpg`(codex 생성)를 재사용·최적화한다.

## Acceptance (검증 가능한 문장 + 검증 방법. QA가 항목별 PASS/FAIL 판정)
- [x] A1. `/`는 Accept-Language의 1단계 언어(en·ja·id·mn·ko)로 리다이렉트한다. 지역 태그(`ko-KR`)는 기본 언어로, 품질값(`ko;q=0.1, en;q=0.9`)은 높은 쪽으로, 미일치(`fr`)·헤더 없음은 `/en`. 5개 언어 홈은 각각 200과 해당 `<html lang>`을 낸다. 2단계 언어 경로(/hi /ru /vi /zh /es /th)는 404다 — 검증: curl(헤더 9종 — en·ja·id·mn·ko·`ko-KR`·`ko;q=0.1, en;q=0.9`·`fr`·헤더 없음 — 리다이렉트 + 홈 5종 200·lang + 2단계 6종 404) + 미들웨어 단위 테스트 — QA r1 PASS: evidence/qa-A1-curl.log, evidence/qa-unit.log; QA r2 PASS(e1730b9): evidence/qa-r2-A1-curl.log, evidence/qa-r2-unit.log
- [x] A2. 히어로 여정 플래너는 페이지 이동 없이 다시 그린다 — (a) 진료(5종)를 바꾸면 제목·활동·참고가격이 바뀐다 (b) 일수(5/7/10)를 바꾸면 제목과 일차 구간이 바뀌고 참고가격은 같다 (c) 인원(1/2/3+)을 바꾸면 부제와 D-1 숙소 유형만 바뀌고 일차 골격·참고가격은 같다. 활동에는 Doctor OK 배지(가능 시점 또는 대기)가 붙는다. Tab/화살표/Space만으로 조작된다 — 검증: 플래너 데이터 함수 단위 테스트((a)(b)(c) 각 단언) + 브라우저 실기(조합 3개 스크린샷 + 키보드 조작) — QA r1 PASS: evidence/qa-A2-1440-*.png, evidence/qa-A2-390-*.png, evidence/qa-browser.json#A2
- [x] A3. 언어권 홈은 번역이 아니라 현지화다. 각 홈의 히어로 헤드라인(H1)은 시안 C의 해당 언어 문자열과 같다(아래 표). 우선 진료·특화 문구는 아래 표의 항목을 그 언어로 쓴다. 메신저는 en WhatsApp · ja LINE · id WhatsApp · mn Messenger · ko KakaoTalk. 페이지 본문 언어는 `<html lang>`과 같다. 언어 전환기는 2단계 6개를 링크 아닌 비활성 항목("12월 오픈")으로 보인다. 일본어 H1은 렌더 텍스트의 줄바꿈을 공백 없이 접은 문자열이 표와 같으면 PASS. preview 모드에서는 상단 사전 공개 띠가 있고, 메신저 버튼에 `href`가 없으며, "24시간"(그 언어 표현 포함) 회신 약속이 없다. CTA는 정확히 두 종류 — **메신저 상담**과 **견적 시작** — 이고, 템플릿의 "PDF 받기"는 견적 시작으로, 헤더 메뉴는 같은 페이지 앵커다 — 검증: 사전 단위 테스트(언어별 H1 문자열·우선 진료 id 목록·messenger 값 = fixture, preview/live 두 모드 단언) + 브라우저 실기(5개 홈 히어로+하단 바 스크린샷) — QA r1 PASS: evidence/qa-A3-{en,ja,id,mn,ko}-*.png, evidence/qa-A3-switcher-open-en-quote.png, evidence/qa-browser.json#A3; QA r2 PASS(e1730b9, CTA 가드): evidence/qa-r2-unit-delta.log, evidence/qa-r2-guards-mutation.log

  | 언어 | H1 (시안 C 원문) | 우선 진료 id | 특화 |
  |---|---|---|---|
  | en | Care your insurance won’t cover, planned in Korea. | implants, lasik, screening, fertility | 귀국 후 주치의에게 줄 영문 의료 리포트 |
  | ja | ソウルまで2時間。精密検診も歯科も、週末で。 | screening, dental, womens-wellness | 여성 의료진 지정 가능, JCB |
  | id | Perjalanan cek kesehatan yang aman, bersama seluruh keluarga. | screening, dental, womens-health | 협력 병원 인근 할랄 식사·기도실 |
  | mn | Солонгосын томоохон эмнэлэг — эхнээс нь дуустал монгол хэлээр. | screening, womens-health, serious-referral | 비자 초청장·장기 체류 지원 |
  | ko | 동포와 유학생의 검진부터 기관 제휴까지, 한국어로. | student-checkup, dental, eye | 학생증 인증 할인 |
- [x] A4. 신뢰 구간: "Who pays what" 영수증이 환자 부담 ₩0(언어별 통화 표기 허용 안 함 — ₩0 고정)을 보이고, 모든 페이지 푸터에 유치업·여행업 등록번호가 "샘플" 표기와 함께 있다. 병원·의사 카드에도 "샘플"이 보인다. 콘텐츠 사전(`src/content/**`)에 수수료·배분 수치가 없다 — 검증: 브라우저 실기 + `rg -n -w -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '수수료율' -e 'commission rate' -e 'referral rate' src/content` 0건 — QA r1 PASS: evidence/qa-A4-*.png, evidence/qa-A4-A9-guards.log
- [x] A5. 홈에 Doctor OK 규칙 그리드, 회복 주간 표, 문제 발생 4단계, 여정 템플릿 6종, 앰버서더(환원처 4개 선택 + 금액 없는 추천 현황 미리보기), 기관 파트너 존이 있다 — 검증: 사전 단위 테스트(5개 언어 모두 해당 섹션 키가 비어 있지 않음·템플릿 6개·환원처 4개·단계 4개) + 브라우저 실기(en 전 섹션 스크린샷, ja·mn 섹션 1개씩) — QA r1 PASS: evidence/qa-A5-*.png, evidence/qa-browser.json#A5
- [x] A6. `/{lang}/quote`는 3단계(관심 진료 → 일정 + 픽업·체류 희망(선택) → 연락처) 폼이다. 단계마다 필수값을 검증한다. 마지막 단계에 개인정보 고지 1문장(목적·항목·보관 기간·전달 대상 포함)과 필수 동의 체크가 있다. 사전 공개 모드 안내("등록 전이라 신청을 저장하거나 회신하지 않습니다")가 폼과 완료 화면에 그 언어로 보인다. 제출은 `POST /api/quote` — 유효하면 200(본문에 저장 id 없음), 무효하면 422(필드 오류 목록). 핸들러는 요청 본문을 저장·로그·외부 전송하지 않는다 — 검증: curl(200/422) + 라우트 단위 테스트(로그 호출 없음 단언 포함) + 브라우저 실기 1회(ja) — QA r1 PASS: evidence/qa-A6-curl.log, evidence/qa-A6-ja-*.png, evidence/qa-browser.json#A6
- [x] A7. 품질 하한: 390·768·1440px에서 `document.documentElement.scrollWidth ≤ innerWidth`, 키보드 포커스가 보이고, `prefers-reduced-motion: reduce`에서 애니메이션·트랜지션이 꺼진다. Lighthouse(mobile, 로컬 production 빌드) /en: Performance ≥ 85, Accessibility ≥ 95, Best Practices ≥ 95, SEO ≥ 95 — 검증: 브라우저 실기(3폭 수치 + 포커스 스크린샷 + 에뮬레이션) + Lighthouse JSON(evidence 저장) — QA r1 PASS: evidence/qa-A7-*.png, evidence/qa-A7-lighthouse-en-mobile-{1,2,3}.report.json, evidence/qa-browser.json#A7
- [x] A8. SEO·메타: 언어별 title/description, 5개 언어 hreflang alternates와 `x-default` → `/en`, OG 이미지, `sitemap.xml`(5개 홈 + 5개 견적)·`robots.txt` — 검증: curl — QA r1 PASS: evidence/qa-A8-curl.log
- [x] A9. 문구 준수와 회귀 보존: `src/` 아래 최상급·보장·비교·전후·미허가 시술 표현 0건 — `rg -n -i -w -e best -e guarantee -e guaranteed -e 'No\.1' -e 'half the cost' -e 'before and after' -e cheapest src` 및 `rg -n -e 최고 -e 보장 -e 줄기세포 -e 전후 -e 保証 -e 最高 -e 'stem cell' src` 0건(코드 식별자 오탐은 근거와 함께 제외 기록). 기획서 내부 수치(배분율 [내부수치], 예산 [내부수치], 리드 [내부수치]·[내부수치], CPL [내부수치])가 리포에 없다. `git diff origin/main -- design/drafts` 가 비어 있다 — 검증: 위 명령 출력 + `rg -n -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e '[내부수치]' -e 'CPL' -e '[내부수치]' src README.md` 0건. 부정 고지("보장하지 않습니다", "do not guarantee")와 코드 식별자는 근거와 함께 오탐 제외 — QA r1 PASS: evidence/qa-A4-A9-guards.log
- [x] A10. 배포: lint·typecheck·test·build 통과, 코드가 GitHub main에 머지, `curl -sI https://kaniq-homepage.vercel.app/en` 이 200(401·Vercel 로그인 302면 FAIL)이고 본문이 이 사이트이며, production 배포의 소스 SHA가 main 머지 SHA와 같다(git 연결 시 배포 메타 `githubCommitSha`, 미연결 시 main 머지 SHA 체크아웃에서 `vercel deploy --prod` 후 배포 메타에 SHA 기록) — 검증: CLI 출력 + `gh` + curl + Vercel deployments API — QA r3(G4) PASS: evidence/qa-prod-A10.log, evidence/qa-prod-regress.log, evidence/qa-prod-browser.json, evidence/qa-prod-*.png · 현재 운영(최종): QA r4 PASS `evidence/qa-prod2-A10.log`, `evidence/qa-prod2-regress.log` (91cdbf5) → PR #3 테스트 전용 변경 후 `eb0c41a` / `dpl_26A1HbyyNSr3ZtrrdT4KLFGEASEn` 재배포, `evidence/rel3-smoke.log`·`rel3-deployment.json`

## 형태
- shape: feature
- review_tier: standard (가판정 — 인가·결제·동시성 없음, 그린필드라 회귀 표면 작음. `review-tier --apply`로 확정)

## 규모·예상
- size: L — 판정 근거: 그린필드 독립 앱(DB·외부 통합 없음, 규칙 9 → L): Next.js 신규 구축 + 5개 언어권 홈(i18n 라우팅·현지화 콘텐츠) + 인터랙티브 여정 플래너 + 견적 폼/API + Vercel 신규 배포. 브라우저 판정 항목 7개.

| 항목 | 보통 | 길어지면 | 근거 |
|---|---|---|---|
| 걸리는 시간 | 3시간 56분 | 8시간 53분 | 비슷한 run 105건 |
| 비용(API 환산) | $109.72 | $159.69 | 비슷한 run 29건 · 단가 변경 전 run은 era 보정 |
| 토큰(참고) | 173.4M | 479.3M | 비슷한 run 94건 |
| 개발 라운드 | 3회 | 5회 | 비슷한 run 105건 |
| 리뷰·QA 라운드 | 4회 | 8회 | 비슷한 run 105건 |

## 운영 경로
| Acceptance | 실행 주체 | 필요 권한/scope | 승인 모델 | 러너·설치 릴리스 핀 | 레인 소유 | 예상 턴 수 | 확인값/미확인 |
|---|---|---|---|---|---|---|---|
| A10 GitHub 머지 | Releaser | gh `repo` scope (holmesLee-ws, 실측 OK) | 사용자 위임(배포 요청 원문) | gh CLI | 이 run | 1 | 확인: 로그인·scope 실측 |
| A10 Vercel production | Releaser | Vercel CLI 로그인 [redacted-user], 팀 wishket-aidp (실측 OK) | 사용자 위임 | vercel CLI 54.7.1 | 이 run | 1~2 | 확인: 프로젝트 `prj_st04zp2ldGxa0qku1Dx60Rp6rtnS` 생성·framework=nextjs·ssoProtection=preview(production 공개)·도메인 kaniq-homepage.vercel.app / kaniq-care.vercel.app verified. 미확인: Vercel↔GitHub git 연결 가능 여부(불가면 main 체크아웃에서 `vercel deploy --prod`) |

## 비목표
- CRM·HubSpot·메신저 공식 API 연동, 리드 저장(DB). 견적 API는 검증 후 200만 돌려준다.
- 헤드리스 CMS 실제 도입(구조만 교체 가능하게), 2단계 6개 언어 콘텐츠, 실제 병원·의사·등록번호 데이터(샘플 표기 유지).
- 진료 상세·병원 비교·앰버서더 로그인 포털·예약/결제·PDF 생성(템플릿 "PDF 받기"는 견적 시작으로 연결), GA4·Pixel 등 추적 태그, 커스텀 도메인(kaniq.com).
- 언어별 원어민 검수(번역은 개발자 초안 — README에 검수 필요 명시).

## 제약
- 작업 위치: 새 Orca 워크트리 `/Users/holmesmac/orca/workspaces/kaniq-homepage/kaniq-homepage-build` (브랜치 `holmesLee-ws/kaniq-homepage-build`, base `origin/main`). 근거: LEH 기본값(명시 답 없음).
- 스택: Next.js 최신 안정판(App Router, TypeScript, `src/`), next/font 자체 호스팅, next/image. 라이브러리는 최소(i18n은 라우트 세그먼트 + 타입 사전으로 직접 구현 가능). 디자인 토큰은 시안 A의 값을 정본으로 한다.
- `.github/**` 를 만들지 않는다(사람 게이트 ③ 회피 — CI는 이번 범위 밖). DB·마이그레이션 없음.
- `design/drafts/**` 수정 금지. 기획서 원본·텍스트를 리포에 복사 금지(공개 리포, 내부 요율 포함).
- 의료광고 심의 원칙: 효과 보장·최상급·비교·전후 사진 금지, 정식 시술명, '줄기세포' 금지.
- **오픈 태도(사전 공개 모드)**: 유치업 등록번호가 아직 없고(기획서 15·19장 '등록 전 상담·견적 공개 금지 → 제한 오픈') 메신저 공식 계정도 미개설이다. 그래서 설정 한 곳(`launchState: 'preview' | 'live'`)으로 모드를 두고 이번 배포는 `preview`다. preview에서는 (1) 모든 페이지 상단에 그 언어로 "등록 절차 중인 사전 공개 사이트 — 신청은 저장·회신되지 않습니다" 띠를 보이고 (2) 메신저 버튼은 채널 정체성(이름·색)을 유지하되 링크가 아닌 "출시 때 열림" 상태로 보이며 (3) "24시간 내 회신" 약속을 보이지 않는다. `live`로 바꾸고 채널 URL을 채우면 링크·회신 약속이 켜진다(두 모드 모두 단위 테스트). 이 판단은 사용자 위임(배포 요청)과 기획서 리스크 사이의 오케스트레이터 결정이다.
- 릴리즈 방식: `full` — QA PASS 뒤 바로 main 머지 + Vercel production(사용자 배포 요청 원문, staging 없음). 마이그레이션 없음.
- QA 접근 경로: `local-session`(로그인 없는 공개 사이트 — 로컬 `npm run build && npm start`로 전 항목 실기). preview는 SSO 보호. 운영 확인은 머지 후 production URL 스모크.
- 게이트 운영(사용자 지시): 게이트마다 독립 리뷰(Reviewer, grok)가 100점 만점 점수와 판정을 낸다. 통과선: 점수 ≥ 85 그리고 Blocking 0. 게이트 원장은 `.loop/20261006-kaniq-homepage/gates.md`(오케스트레이터 작성) — 다음 게이트 지시문은 이 원장의 "증강 맥락·진행 방향"을 동봉한다.

## 확정
- 사용자 확정: 2026-10-06 (auto-confirm-by-delegation — 사용자 원문 "니즈는 충분히 구체화했으니, 메인 에이전트가 합리적으로 판단하고 자율적으로 실행해서 구현까지 완결해. 시안 중에서 좋은 거 골라서 알아서해", inputs.jsonl 기록). G1 독립 리뷰 r1(68점 CHANGES) → 수정 → r2(90점 APPROVE) → Minor 5건 반영 후 동결(2026-10-06).
