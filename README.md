# agent-dev

에이전트 개발 관련 자료 저장소.

## seminar — 에이전트 개발자를 위한 인증·인가 세미나 (4회)

Java/Spring 경험은 있지만 SSO·IdP·OAuth를 처음 다루는 에이전트 개발 실무자를 위한 시리즈.

| 회차 | 제목 | 파일 |
|---|---|---|
| 1 | SSO — 로그인을 한 곳에 맡기기 | [seminar/01_sso.html](seminar/01_sso.html) |
| 2 | Keycloak — IdP를 직접 운영하기 | [seminar/02_keycloak.html](seminar/02_keycloak.html) |
| 3 | BFF — 토큰을 브라우저에 두지 않기 | [seminar/03_bff.html](seminar/03_bff.html) |
| 4 | A2A — 에이전트 간 인증과 위임 | [seminar/04_a2a.html](seminar/04_a2a.html) |

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
  01_sso.html … 04_a2a.html
  _template.html        새 회차 템플릿 (작성 규칙은 파일 안 주석)
  assets/slides.css     공통 스타일 (1280×720, 라이트/다크)
  assets/slides.js      내비게이션, 코드 하이라이트, 공유 SVG 마커
  reference/            참고 문서
```

새 회차는 `_template.html`을 복사해 만든다. `파일.html?check=1` 로 열면 슬라이드 넘침 검사 결과가 상단에 표시된다.
