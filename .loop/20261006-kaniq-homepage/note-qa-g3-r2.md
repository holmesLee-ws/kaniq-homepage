# QA 지시 — G3 델타 재라운드 (기준 커밋 불일치)

QA r1(PASS 9/9)의 기준 커밋 4be4286 이후 Developer r2가 커밋을 추가했다. 새 baseline = `e1730b90f7453fc2b3eaf4b40cc59d05d99cb1bf`. 변경 파일: src/lib/i18n/negotiate.ts tests/guards.test.ts tests/negotiate.test.ts 
델타 범위만 재실측한다: A1(언어 협상 — spec 헤더 9종 + `ja ;q=0.9`, `ko ; q=0.5, en;q=0.4`)과 A3의 CTA 가드(`npm test` 중 guards·negotiate). 새 baseline을 scratch 슬롯 `qa-cand`로 옮겨 빌드·기동해 curl한다. 나머지 A2·A4~A9는 `05-qa-r1.md` 증적 경로를 인용한다. `## 기준 커밋:`을 새 baseline으로 쓰고, 점수 절(`## 점수: NN/100`)과 VERDICT를 낸다.
