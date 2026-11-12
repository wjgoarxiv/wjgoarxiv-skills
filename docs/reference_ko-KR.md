<p align="right"><a href="reference.md">English</a> · <b>한국어</b></p>

# 참고 자료

[README](../README_ko-KR.md) 뒤에 있는 관리용 목록입니다. 파일이 어디에 있는지, 패밀리 플러그인이 스킬 말고 무엇을
담고 있는지, 무언가를 바꿀 때 따르는 규칙이 무엇인지 정리했습니다. 처음 쓰는 분에게는 필요 없는 내용입니다.

## 저장소 구성

아래 경로는 모두 저장소 루트 기준입니다.

```text
README.md, README_ko-KR.md          이 페이지의 영어판과 한국어판
docs/assets/                        이 페이지에 쓰인 커버, 다이어그램, 도면, 패밀리별 그림
.claude-plugin/marketplace.json     패밀리 플러그인마다 항목 하나
plugins/<family>/.claude-plugin/plugin.json
plugins/<family>/skills/<id>/       그대로 복사한 스킬 폴더
plugins/<family>/lib/               스킬이 ../../lib로 읽는 공용 런타임 파일, 그대로 복사
plugins/<family>/bin/, vendor/      (figures) 어댑터가 ../../bin, ../../vendor로 읽는 doctor와 원본 소스
plugins/<family>/LICENSE            파일이 원래 따르던 라이선스
receipts/<family>.sha256            복사한 파일마다 sha256, 원본 경로, 대상 경로
variants/<product>/<id>/            다른 제품이 만든 그 스킬의 에디션, 혼자 돌아가도록 손본 것
variants/<product>/CHANGES.md       원본 복사 뒤에 그 에디션에서 바뀐 것과 이유
receipts/variants-<product>.sha256  sha256, 그 제품 커밋에서의 원본 경로, 원본 복사본의 대상 경로
test/                               매니페스트, 영수증, 설치 표를 확인하는 node --test 검사
```

이 트리에서 "이 페이지"는 README를 뜻하고, 지금은 `docs/`에 이 참고 페이지와 영어판도 들어 있습니다.

## 패밀리마다 담긴 것

LitClaude판 스킬은 자기 폴더 밖의 파일을 읽는 경우가 많아서, 패밀리 플러그인은 그 파일도 바꾸지 않고 같은 상대 위치에
담고 있습니다. 여기 나오는 폴더 중 `SKILL.md`가 없는 것은 스킬이 아니라 보조 폴더입니다.

### `decks`와 `documents`

`decks`에는 LitClaude 오피스 런타임 파일 16개가 `lib/`에 들어 있습니다. 처음 쓸 때 도는 설치
프로그램(`office-runtime.mjs`와 잠금 파일), Python 부트스트랩, 데이터, 무결성, 렌더, 마크 도우미와 이들이 불러오는
모듈입니다. `documents`에도 lit-docx용으로 같은 16개 파일이 들어 있습니다. LitClaude는 이제 오피스 런타임을 직접
배포하지 않습니다.

| 항목 | 내용 |
| --- | --- |
| 설치 위치 | 처음 쓸 때 `${XDG_CACHE_HOME:-~/.cache}/litclaude/office-runtime`에 설치(버전 고정) |
| 공유 캐시 | 예전 LitClaude 릴리스가 쓰던 캐시와 같은 자리라서, `decks`와 `documents`, 예전 LitClaude가 같이 있어도 한 번만 설치 |
| 단 하나의 차이 | `office-runtime.mjs`: `documents` 쪽은 lit-docx가 쓰는 Python 부분이 설치되면 상태가 `ready`로 표시 |

### `figures`

`figures`는 세 스킬이 자기 폴더 밖에서 읽는 파일을 담고 있습니다.
- **`lib/`:** 마크 도우미와 그것이 불러오는 모듈, 그리고 다이어그램 렌더러용 `npm-invocation.mjs`.
- **`skills/lit-humanizer/`:** 다이어그램 검증기와 doctor가 화면에 보이는 글자를 검사할 때 쓰는 `rules.json`과 스크립트
  네 개만 있습니다. `SKILL.md`가 없으니 여기서는 스킬이 아니고, lit-humanizer 전체는 LitFamily 제품에 남아 있습니다.
- **`vendor/scientific-visualization/`:** `lit-scientific-visualization`이 플롯을 그리기 전에 읽는 원본 소스 16개 파일과
  출처, MIT 라이선스.
- **`bin/litclaude-scientific-visualization-doctor.js`와 `lib/bundled-skills-integrity.mjs`:** 읽기만 하는 doctor. 무결성
  검사가 `vendor/handoff/`(파일 4개, 출처와 라이선스 포함)까지 보기 때문에 그 사본도 여기 있지만, 다른 곳에서는 쓰지
  않습니다.

lit-schematic은 Pretendard를 먼저 `lit-diagram-drawer/assets/fonts/`에서 찾고, 이 폴더는 `figures`에 들어 있습니다. 두
번째로 찾는 `lit-pptx/fonts/`는 복사하지 않았습니다.

### `design`

`design`은 frontend-ui-ux와 visual-qa가 자기 폴더 밖에서 읽는 파일을 담고 있습니다.
- **`lib/`:** 프로브, 증거 검사기, 리뷰 규칙이 불러오는 `strict-json.mjs`, `rename-aliases.mjs`, `secret-shapes.mjs`.
- **`skills/browser-drive/scripts/capability-probe.mjs`:** 인터페이스 프로브가 브라우저 드라이버를 찾고 확인할 때 씁니다.
  옆에 `SKILL.md`는 없고, browser-drive 자체는 LitFamily 제품에 남아 있습니다.
- **`skills/lit-diagram-drawer/assets/fonts/`와 `skills/lit-typographic-motion/fonts/jetbrains-mono/`:** OFL 라이선스가
  딸린 Pretendard와 JetBrains Mono 글꼴. 디자인 키트의 `kit/fonts.json`이 경로로 복사하고 sha256으로 확인합니다. 이
  폴더들에도 `SKILL.md`는 없습니다.

LitClaude는 웹 화면 수정을 이 프로브로 확인하기 때문에, frontend-ui-ux 스텁 안에 인터페이스 프로브 스크립트 사본을 남겨
두었습니다.

### `video-covers`

`video-covers`는 lit-typographic-motion과 readme-studio가 자기 폴더 밖에서 읽는 파일을 담고 있습니다.
- **`lib/`:** 커버 마크와 엔드 카드를 그리는 마크 도우미(`mark.mjs`, `mark-logo.png`, `output_mark.py`), 그리고
  `project-state-root.mjs`와 그것이 불러오는 `rules/` 모듈 세 개.
- **`skills/lit-pptx/fonts/pretendard/`:** OFL 라이선스가 딸린 Pretendard Regular와 Bold. 영상 엔진의 `fonts/manifest.json`이
  경로로 읽고 sha256으로 확인합니다. 여기에는 `SKILL.md`가 없고, lit-pptx 자체는 `decks`에 있습니다.

옮겨 온 lit-typographic-motion 문서 가운데 LitClaude에만 있는 부품을 말하는 줄은 README의
[LitClaude 밖에서 영상 스킬 쓰기](../README_ko-KR.md#video-covers)에 정리했습니다.

## 이 저장소의 규칙

이 규칙들은 모든 복사본을 원본과 대조해 증명할 수 있게 하고, 사용자가 늘 최신 복사본을 받게 합니다.

- **스킬은 바이트 그대로.** 옮겨 오는 스킬은 바이트 단위로 그대로 복사합니다. 영수증과 일치해야 하며, `npm test`가 이를
  확인합니다. 예외는 제품이 나중에 없앤 제품 명령을 실행하라는 줄 하나뿐입니다. 그런 파일은
  [옮긴 뒤 고친 파일](../README_ko-KR.md#옮긴-뒤-고친-파일)에 올리고, 영수증 행에 `edited-from:<sha256>`을 붙입니다.
- **에디션도 처음엔 바이트 그대로.** `variants/`의 하네스 에디션은 처음에 그 제품이 마지막으로 배포한 커밋에서 바이트
  단위로 그대로 들어오고, 파일마다 영수증 행을 남겨 영수증과 같은 커밋에 넣습니다. 혼자 돌아가도록 손보는 변경은 그 뒤
  별도 커밋으로 하고, 그 제품의 `CHANGES.md`에 적습니다.
- **스텁 명령은 함께 바뀝니다.** 제품 스텁의 설치 명령이 바뀌면, 같은 커밋에서 설치 표와 하네스별 참고, 그리고
  `npm test`가 둘을 대조하는 `test/stub-install-lines.json`도 바꿉니다.
- **내용이 바뀌면 버전도 올립니다.** 패밀리 플러그인의 내용을 바꿀 때마다 `plugins/<family>/.claude-plugin/plugin.json`의
  `version`을 올립니다. `claude plugin update`는 이 버전이 바뀌었을 때만 새 복사본을 설치하므로, 버전을 올리지 않은 변경은
  이미 플러그인을 가진 사람에게 끝내 닿지 않습니다. 마켓플레이스 항목에 `version`이 생기면 그것도 같이 올립니다.
- **패밀리 이전은 릴리스 한 번에.** 패밀리는 그 제품의 한 릴리스에서, 제품 스텁과 함께 옮깁니다.
- **제품 없이도 동작.** 패밀리 플러그인은 LitFamily 제품이 하나도 없어도 동작해야 합니다.
