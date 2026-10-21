# agent-dev

에이전트 개발 관련 자료 저장소.

## seminar — 에이전트 개발자를 위한 인증·인가 세미나 (들어가며 + 3회 + 보충 2편 + 별도 1편)

Java/Spring 경험은 있지만 SSO·IdP·OAuth를 처음 다루는 에이전트 개발 실무자를 위한 시리즈.

| 회차 | 제목 | 파일 |
|---|---|---|
| 들어가며 | 놀이공원으로 이해하는 인증·인가 — 용어 없이 그림으로 시리즈 전체를 훑는다 (약 15분) | [seminar/00_intro.html](seminar/00_intro.html) |
| 1 | SSO — 로그인을 한 곳에 맡기기 | [seminar/01_sso.html](seminar/01_sso.html) |
| 2 | Keycloak — IdP를 직접 운영하기 | [seminar/02_keycloak.html](seminar/02_keycloak.html) |
| 3 | BFF — 토큰을 브라우저에 두지 않기 | [seminar/03_bff.html](seminar/03_bff.html) |

### 보충 자료

1회차 '개념' 장의 OAuth 2.0과 OIDC를 각각 한 편으로 깊게 다룬다 (편당 약 35분). 1회차 뒤, 2회차 전에 보는 것을 권한다.

| 편 | 제목 | 파일 |
|---|---|---|
| A | OAuth 2.0 — 권한을 빌려주는 규칙 | [seminar/oauth2.html](seminar/oauth2.html) |
| B | OIDC — 로그인한 사람이 누구인지 알기 | [seminar/oidc.html](seminar/oidc.html) |

### 별도 자료

본 시리즈(1~3회차)의 결론을 전제로 하되, 인증·인가의 기본 흐름과는 별개 주제라 따로 둔다 (약 50분).

| 편 | 제목 | 파일 |
|---|---|---|
| 별도 | A2A — 에이전트 간 인증과 위임 | [seminar/a2a.html](seminar/a2a.html) |

목차: [seminar/index.html](seminar/index.html)

### 보는 방법

- 로컬: `seminar/index.html`을 브라우저로 연다. 외부 라이브러리·네트워크 없이 동작한다.
- GitHub Pages를 켜면(Settings → Pages → Branch `main`, `/ (root)`) `https://ollybaysion.github.io/agent-dev/seminar/` 에서 바로 볼 수 있다.

### 조작

`→`/`Space` 다음 · `←` 이전 · `O`/`Esc` 발표 모드 ↔ 문서 모드 · `T` 테마 · `N` 발표자 노트 · `F` 전체 화면 · `?` 도움말 · `Ctrl+P` 인쇄/PDF

### 구조

```
seminar/
  index.html            목차
  00_intro.html         들어가며 (놀이공원 비유, 용어 없음)
  01_sso.html … 03_bff.html   본 시리즈
  oauth2.html, oidc.html      보충 자료 A·B
  a2a.html                    별도 자료 (A2A)
  _template.html        새 회차 템플릿 (작성 규칙은 파일 안 주석)
  assets/slides.css     공통 스타일 (1280×720, 라이트/다크)
  assets/slides.js      내비게이션, 코드 하이라이트, 공유 SVG 마커
  reference/            참고 문서
```

새 회차는 `_template.html`을 복사해 만든다. `파일.html?check=1` 로 열면 슬라이드 넘침 검사 결과가 상단에 표시된다.

## reports — 조사 보고서

| 날짜 | 제목 | 파일 |
|---|---|---|
| 2026-10-21 | 최근 Claude Code 이슈 총정리 (10-07 ~ 10-21) | [reports/claude_code_issues_2026-10-07_to_10-21.md](reports/claude_code_issues_2026-10-07_to_10-21.md) |