<p align="right"><a href="README.md">English</a> · <b>한국어</b></p>

<p align="center">
  <a href="docs/assets/cover/cover-dark.mp4">
    <picture>
      <source media="(prefers-reduced-motion: reduce) and (prefers-color-scheme: dark)" srcset="docs/assets/cover/poster-dark.webp">
      <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/cover/poster-light.webp">
      <source media="(prefers-color-scheme: dark)" srcset="docs/assets/cover/cover-dark.webp">
      <source media="(prefers-color-scheme: light)" srcset="docs/assets/cover/cover-light.webp">
      <img src="docs/assets/cover/cover-dark.webp" width="960" alt="스킬 아홉 개(덱, 문서, 도표, 디자인, 영상 커버)가 놓인 선반에서 한 번에 하나씩 선을 따라 일곱 코딩 에이전트(Claude Code, Codex CLI, OpenCode, Grok Build, Muse Code, Antigravity, Hermes Agent) 중 하나로 설치되는 모습.">
    </picture>
  </a>
</p>

<p align="center">
  <b>일곱 코딩 에이전트에서 쓰는 LitFamily 확장.</b><br>
  발표자료, 문서, 그림, 화면, 영상, README까지. 패밀리 단위로도, 폴더 하나 단위로도 설치할 수 있습니다.<br>
  <sub>소리 없는 커버 영상: <a href="docs/assets/cover/cover-dark.mp4">어두운 테마 MP4</a> · <a href="docs/assets/cover/cover-light.mp4">밝은 테마 MP4</a></sub>
</p>

# wjgoarxiv-skills

LitFamily를 위한 콘텐츠 스킬 아홉 개입니다. LitFamily는 계획, 루프, 목표, 리뷰로 이어지는 같은 작업 방식을 일곱 코딩
에이전트에 붙여 주는 애드온 묶음입니다. 발표자료, 문서, 그림, 화면, 영상, README를 만들고, 필요한 것만 골라 설치하며,
LitFamily 제품 없이도 하나씩 따로 쓸 수 있습니다.

> [!TIP]
> Claude Code라면 `claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills`와
> `claude plugin install decks@wjgoarxiv-skills`를 실행한 뒤 에이전트에게 발표자료를 부탁해 보세요. 다른 하네스는 이
> 저장소를 한 번 클론하고 폴더 하나만 복사합니다.

## 어디서 시작할까

대부분은 한 가지 일 때문에 이 페이지를 엽니다. 하려는 일부터 고르세요.

| 하려는 일 | 할 일 | 바로 가기 |
| --- | --- | --- |
| 스킬마다 무엇을 만드는지 보기 | 스킬 표와 패밀리 그림 보기 | [만들 수 있는 것](#만들-수-있는-것) |
| Claude Code에 설치 | 마켓플레이스 추가, 패밀리 하나 설치 | [Claude Code](#claude-code) |
| 다른 하네스에 설치 | 한 번 클론, 폴더 하나 복사 | [하네스별로 스킬 하나 설치하기](#하네스별로-스킬-하나-설치하기) |
| 복사본 업데이트·제거 | 같은 줄을 다시 돌리거나 옆으로 옮기기 | [업데이트와 제거](#업데이트와-제거) |
| 에디션의 출처 알기 | 원본 커밋과 바뀐 점 보기 | [동작 방식](#동작-방식) |
| 이 저장소 관리 | 구성, 고친 파일, 규칙, 검사 | [참고 자료](#참고-자료) |

## 빠른 시작

Claude Code가 가장 짧은 길입니다. GitHub에서 패밀리를 바로 설치하기 때문입니다. 다른 하네스라면
[하네스별 참고](#하네스별-참고)에 있는 그 하네스의 명령을 따르세요.

1. [설치 표](#하네스별로-스킬-하나-설치하기)에서 스킬과 그 패밀리를 찾습니다.
2. [Claude Code 확인 줄](#claude-code)로 이름이 같은 내 스킬을 먼저 옆으로 옮깁니다.
3. 아래 두 줄을 돌립니다. `decks` 자리에는 내 패밀리를 넣습니다.
4. 스킬이 만드는 것을 부탁합니다. 발표자료, 문서, 그림, 화면, 영상, README 무엇이든 됩니다.

아무 폴더에서나 실행하세요:

```bash
claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills
claude plugin install decks@wjgoarxiv-skills
```

스킬이 `decks:lit-pptx`(내 스킬이라면 `<family>:<id>`)라는 이름으로 응답하면 준비가 끝난 겁니다.

## 만들 수 있는 것

스킬은 각자 한 종류의 파일을 만들고, 그중 몇몇은 만든 걸 다른 스킬에 넘깁니다. 지도의 화살표는 스킬의 `SKILL.md`가 그
연결을 직접 적어 둔 곳에만 그렸고, 점선 하나는 README와 잘 어울리는 짝이라서 이어 둔 겁니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/skill-map.ko.dark.png">
    <img src="docs/assets/diagrams/skill-map.ko.light.png" width="900" alt="다섯 패밀리로 묶은 아홉 스킬과 각자 만드는 결과물. lit-scientific-visualization의 차트 PNG는 lit-docx와 lit-pptx로, lit-diagram-drawer의 다이어그램 PNG는 lit-pptx로 가고, frontend-ui-ux가 만든 화면은 visual-qa가 점검하며, lit-typographic-motion의 커버 루프는 readme-studio와 짝을 이룬다.">
  </picture>
</p>

| 부탁할 것 | 스킬(패밀리) | 받는 것 | 넘기는 곳 |
| --- | --- | --- | --- |
| 발표자료 | `lit-pptx` (`decks`) | 고칠 수 있는 `.pptx` | 차트와 다이어그램을 받아 씀 |
| 보고서, 메모, 원고 | `lit-docx` (`documents`) | `.docx`, 깔끔한 Markdown, PDF | 차트를 받아 씀 |
| 측정 데이터 플롯 | `lit-scientific-visualization` (`figures`) | 논문용 플롯 | 차트 PNG를 `lit-docx`, `lit-pptx`로 |
| 아이디어나 시스템 다이어그램 | `lit-diagram-drawer` (`figures`) | HTML/SVG, PNG, Office 호환 SVG | 다이어그램 PNG를 `lit-pptx`로 |
| 실제 장비 도면 | `lit-schematic` (`figures`) | 밀리미터 단위 SVG, 600 dpi 렌더 | — |
| 화면 | `frontend-ui-ux` (`design`) | 완성된 화면 | 완성된 화면을 `visual-qa`로 |
| 완성된 화면 점검 | `visual-qa` (`design`) | 스크린샷, 증거 목록, QA 보고서 | — |
| 짧은 영상이나 커버 루프 | `lit-typographic-motion` (`video-covers`) | 영상이나 소리 없는 커버 루프 | 커버 루프는 `readme-studio`와 짝 |
| README | `readme-studio` (`video-covers`) | 커버까지 붙은 사실에 맞는 README | — |

사실 이 페이지에 있는 그림들이 곧 견본입니다. 맨 위 커버가 바로 `video-covers`가 만드는 종류, 소리 없이 끊김 없이 도는
README 커버 루프입니다. 전체 그림, 스킬 지도, 설치 경로는 `lit-diagram-drawer`로, 공정 플랜트와 매니폴드는
`lit-schematic`으로 그리고 내보냈습니다.

### 품질 관문

같은 선반을 공정 플랜트로 그려 보면 요청이 어떻게 파일이 되는지 보입니다. 왼쪽으로 들어온 요청은 그 파일을 만드는
패밀리로 가고, 관문을 통과한 초안은 산출물로 나가며, 걸린 초안은 다시 작업하러 돌아갑니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/schematic/skill-plant.ko.dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/assets/schematic/skill-plant.ko.png">
    <img src="docs/assets/schematic/skill-plant.ko.png" width="900" alt="wjgoarxiv-skills를 공정 플랜트로 그린 PFD: 요청이 다섯 패밀리 유닛으로 나뉘고, 초안은 QA 분석계를 지나 분기 밸브에서 산출물로 가거나 재작업으로 돌아간다. 아래 스트림 표에 패밀리별 스킬과 산출물이 정리되어 있다.">
  </picture>
</p>

관문은 패밀리의 스킬이 원래 하던 검사를 그대로 가져다 만든 것입니다. 그림 아래쪽 스트림 표는 저장소 전체를 표 한 장에
담은 것으로, 어떤 플러그인에 어떤 스킬이 있고 무엇이 나오는지 한눈에 보입니다.

| 패밀리 | 관문이 보는 것 |
| --- | --- |
| `decks` | 넘침과 대비 |
| `documents` | 무결성과 문장 린트 |
| `figures` | 도면 QA 게이트와 렌더 확인 |
| `design` | 뷰포트 매트릭스 |
| `video-covers` | 섬광 검사와 이음새 |

### `decks`

`lit-pptx`는 요청이나 메모, 원본 파일을 받아서 편집 가능한 네이티브 차트와 Pretendard 글꼴을 넣은 PowerPoint
발표자료를 완성본으로 만듭니다. 차트는 `lit-scientific-visualization`에서, 다이어그램은 `lit-diagram-drawer`에서 받아 쓸 수
있습니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/decks.ko.dark.png">
    <img src="docs/assets/families/decks.ko.light.png" width="640" alt="스킬 지도의 일부: lit-diagram-drawer의 다이어그램 PNG와 lit-scientific-visualization의 차트 PNG가 lit-pptx로 들어가 .pptx 발표자료가 된다.">
  </picture>
</p>

<details>
<summary>lit-pptx가 발표자료를 만드는 순서</summary>

1. 먼저 청중과 내용에 맞는 디자인 방향을 정합니다.
2. 슬라이드를 Markdown으로 쓴 다음, 편집 가능한 네이티브 차트와 Pretendard 글꼴을 넣어 컴파일합니다.
3. QA 게이트가 넘치는 글, 약한 대비, 비었거나 허전한 슬라이드를 잡아냅니다.
4. 렌더링한 페이지까지 직접 확인해야 완성으로 칩니다.

</details>

### `documents`

`lit-docx`는 보고서, 브리프, 매뉴얼, 제안서, 메모, 학술지 원고 같은 워드 문서를 완성본으로 만들어 줍니다. DOCX나 PDF를
깔끔한 Markdown으로 바꾸는 일, 기존 .docx를 그 자리에서 고치는 일, PDF로 렌더링하는 일도 합니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/documents.ko.dark.png">
    <img src="docs/assets/families/documents.ko.light.png" width="640" alt="스킬 지도의 일부: lit-scientific-visualization의 차트 PNG가 lit-docx로 들어가 .docx 문서가 된다.">
  </picture>
</p>

<details>
<summary>lit-docx가 문서를 꾸미고 검사하는 방식</summary>

- **문체와 디자인:** 내용에 맞춰 고르거나, 지정한 출판사 양식(Elsevier, ACS, IEEE, Nature, 한국어 일반 양식)을 따릅니다.
- **검사:** 마지막에는 렌더링한 페이지를 놓고 무결성, 문장, 디자인을 검사합니다.

</details>

### `figures`

그림은 "읽는 사람이 지금 뭘 보게 되나"라는 질문 하나에서 시작합니다. 측정한 데이터면 플롯, 아이디어나 시스템이면
다이어그램, 실제 장비면 도면입니다.

| 스킬 | 읽는 사람이 보는 것 | 만드는 것 |
| --- | --- | --- |
| `lit-scientific-visualization` | 측정 데이터 | 원본 scientific-visualization 스킬을 바탕으로 한 논문용 플롯 |
| `lit-diagram-drawer` | 아이디어나 시스템 | HTML/SVG 개념도와 기술 다이어그램, PNG와 Office 호환 SVG로 내보내기 |
| `lit-schematic` | 실물 장비 | 밀리미터 단위 SVG, QA 게이트와 600 dpi 렌더 |

`lit-diagram-drawer`는 발표자료와 문서에 넣을 형태로 내보냅니다. `lit-schematic`은 P&ID, PFD, BFD, 장비 배치도, 실험
장치도, 아이소메트릭 단면도를 다룹니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/figures.ko.dark.png">
    <img src="docs/assets/families/figures.ko.light.png" width="640" alt="스킬 지도의 일부: lit-scientific-visualization, lit-diagram-drawer, lit-schematic으로 이루어진 figures 패밀리와, 이들이 lit-docx와 lit-pptx로 넘기는 차트와 다이어그램 PNG.">
  </picture>
</p>

### `design`

`frontend-ui-ux`는 화면을 만들고 살펴봅니다. 화면이 다 만들어지면 그다음은 `visual-qa`가 넘겨받아 확인합니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/design.ko.dark.png">
    <img src="docs/assets/families/design.ko.light.png" width="340" alt="스킬 지도의 일부: frontend-ui-ux가 화면을 만들어 visual-qa에 넘기고, visual-qa가 시각 QA 보고서를 쓴다.">
  </picture>
</p>

<details>
<summary>디자인 스킬마다 뒤에 붙은 것</summary>

- **`frontend-ui-ux`** 는 하나로 고정한 하우스 스타일, 레이아웃 계열, 디자인 키트를 바탕으로 일합니다. 여기에 디자인 계약,
  디자인 지식 데이터베이스, 반응형 매트릭스 전체를 훑는 인터페이스 프로브가 같이 붙습니다.
- **`visual-qa`** 는 여러 뷰포트 크기에서 상태를 하나씩 바꿔 보며 스크린샷을 찍고 증거 목록을 남깁니다. 확인을 막는 게
  있으면 정확히 무엇이 막았는지 짚어 줍니다.

</details>

### `video-covers`

`lit-typographic-motion`은 한 줄짜리 요청 하나로 짧은 영상을 끝까지 연출하고, 커버 모드로는 이 페이지 맨 위에 있는 것 같은
소리 없이 끊김 없이 도는 README 커버 루프를 만듭니다. `readme-studio`는 저장소를 직접 읽고 사실에 맞는 README를 씁니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/video-covers.ko.dark.png">
    <img src="docs/assets/families/video-covers.ko.light.png" width="340" alt="스킬 지도의 일부: lit-typographic-motion이 영상과 커버 루프를 만들고, 커버 루프는 README를 만드는 readme-studio와 짝을 이룬다.">
  </picture>
</p>

<details>
<summary>영상과 README가 만들어지는 과정</summary>

- **영상 단계:** `lit-typographic-motion`은 트리트먼트를 먼저 쓰고, 본 렌더 전에 눈으로 볼 수 있는 스토리보드 단계를
  거칩니다. 그다음 직접 만든 음악과 룩 조정, 그리고 섬광, 가독성, 결정성, 소리를 보는 QA 게이트를 지납니다.
- **영상 종류:** 키네틱 타이포그래피, 가사나 인용구 영상, 타이틀 시퀀스, 무대형 영상까지 만듭니다.
- **README 덧붙임:** `readme-studio`는 검수한 커버, 윤곽선으로 바꾼 제목 글자, 원하면 움직이는 커버까지 붙여 줍니다.

</details>

<details>
<summary>LitClaude 밖에서 영상 스킬 쓰기</summary>

옮겨 온 lit-typographic-motion 문서는 LitClaude를 기준으로 쓴 거라서, 몇 줄은 이 플러그인에 따라오지 않는 LitClaude 부품
얘기를 합니다.
- `SKILL.md`, `references/look.md`, `references/cover.md`에는 Stop 훅이 완료 목록을 확인하고 턴을 붙잡는다고 적혀
  있습니다. 이건 LitClaude 훅이라 LitClaude 밖에서는 돌지 않습니다. 스킬 자체의 `motion.mjs gate`와 완료 목록은 그대로
  적용되지만, 턴을 대신 끝내 주는 장치는 없습니다.
- 미리 받기 명령은 원래 `litclaude-ai motion-runtime install`이었는데, LitClaude 1.0.50에서 빠졌습니다. 이제는
  플러그인이 직접 실행합니다: `node <plugin>/skills/lit-typographic-motion/scripts/motion-runtime.mjs install` (또는
  `status`). `litclaude doctor`가 보여 주던 점검 항목은 `scripts/motion-doctor.mjs`가 보여 줍니다. BLOCKED 14와 15
  메시지는 모두 설치된 스크립트의 절대 경로로 이 명령을 알려 줍니다. 설치 위치는 LitClaude가 쓰던 캐시인
  `${XDG_CACHE_HOME:-~/.cache}/litclaude/motion-runtime`이라서, LitClaude 1.0.49 이하로 미리 받아 둔 컴퓨터라면 새로 할
  일이 없습니다. [옮긴 뒤 고친 파일](#옮긴-뒤-고친-파일)을 보세요.
- `recipes/painted-light/expected.json`은 LitClaude 저장소의 테스트 픽스처를 가리키는데, 그 픽스처는 가져오지
  않았습니다. 그래서 레시피의 참고 이미지는 설명으로만 남아 있습니다.

</details>

## 하네스별로 스킬 하나 설치하기

설치하는 길은 두 가지인데, 어느 쪽으로 갈지는 쓰는 에이전트가 정해 줍니다. Claude Code는 이 마켓플레이스를 추가하고
패밀리 플러그인을 설치하면 되고, 나머지 하네스는 저장소를 한 번 클론한 뒤 폴더 하나만 옮기면 됩니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/install-paths.ko.dark.png">
    <img src="docs/assets/diagrams/install-paths.ko.light.png" width="900" alt="스킬 하나를 설치하는 두 가지 길: Claude Code는 마켓플레이스 추가 후 패밀리 플러그인 설치, 다른 여섯 하네스는 한 번 클론한 뒤 폴더 하나를 하네스별 한 줄 명령으로 옮긴다.">
  </picture>
</p>

왼쪽 열에서 확장을 찾으세요. Claude Code는 그 옆에 적힌 패밀리 플러그인을 GitHub에서 바로 설치하고, 나머지 여섯
하네스는 그 스킬을 자기 하네스에 맞게 고친 에디션을 로컬 클론에서 가져갑니다.

| 스킬 | 패밀리 | Claude Code가 설치하는 것 | 나머지 여섯이 복사하는 폴더 |
| --- | --- | --- | --- |
| `lit-pptx` | `decks` | `decks@wjgoarxiv-skills` | `variants/<product>/lit-pptx/` |
| `lit-docx` | `documents` | `documents@wjgoarxiv-skills` | `variants/<product>/lit-docx/` |
| `lit-diagram-drawer` | `figures` | `figures@wjgoarxiv-skills` | `variants/<product>/lit-diagram-drawer/` |
| `lit-schematic` | `figures` | `figures@wjgoarxiv-skills` | `variants/<product>/lit-schematic/` |
| `lit-scientific-visualization` | `figures` | `figures@wjgoarxiv-skills` | `variants/<product>/lit-scientific-visualization/` |
| `frontend-ui-ux` | `design` | `design@wjgoarxiv-skills` | `variants/<product>/frontend-ui-ux/` |
| `visual-qa` | `design` | `design@wjgoarxiv-skills` | `variants/<product>/visual-qa/` |
| `lit-typographic-motion` | `video-covers` | `video-covers@wjgoarxiv-skills` | `variants/<product>/lit-typographic-motion/` |
| `readme-studio` | `video-covers` | `video-covers@wjgoarxiv-skills` | `variants/<product>/readme-studio/` |

나머지 여섯 하네스는 먼저 `git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`를 한 번 돌리고
`<path to your wjgoarxiv-skills clone>` 자리에 그 폴더 경로를 넣으면 됩니다.

### 패밀리 통째로, 또는 폴더 하나

Claude Code에서 패밀리 플러그인을 통째로 설치하는 건 LitClaude판 스킬이 옆에 있는 공용 파일(`lib/`, `vendor/`, 보조
폴더)을 읽기 때문입니다. 그래도 설치되는 건 그 패밀리 하나뿐입니다. 다른 하네스는 각 제품이 만든 자기 에디션 폴더 하나만
설치하는데, 스킬이 읽는 파일이 이 폴더 안에 다 들어 있습니다.

Grok Build는 폴더 경로를 스킬 하나짜리 플러그인으로 받아서 그 폴더만 플러그인 저장소로 복사하고, Muse Code는
`muse skills install`로 설치하며, Codex CLI, OpenCode, Antigravity CLI, Hermes Agent는 각자 스킬 폴더에 복사합니다.
OpenCode에서는 복사본이 같은 이름의 LitOpenCode 안내 폴더 자리에 들어갑니다. 다른 하네스에서는 복사본이 제품 스텁 옆에
다른 이름으로 자리 잡고, 제품 설치 프로그램도 업그레이드할 때 이 폴더는 건드리지 않습니다.

Grok Build에는 폴더 경로 그대로 넘겨야 합니다. 저장소의 `#` 하위 폴더 형식으로 넘기면 스킬마다 `.git`까지 포함해 저장소 전체를
복사해 버리기 때문에 그 형식은 쓰지 않습니다.

### 설치 명령이 내 파일을 지키는 방식

설치하다가 새 복사본이 옛 복사본에 섞이거나, 스킬 옆에 넣어 둔 내 파일이 사라지면 곤란합니다. 그래서 하네스마다 명령은
먼저 살펴보는 줄로 시작하고, 명령이 폴더를 직접 복사하는 하네스에서는 아래 네 단계를 밟습니다.

| 단계 | 하는 일 | 이유 |
| --- | --- | --- |
| 살펴보기 | 읽기만 하며, 하네스가 함께 불러올 같은 이름의 폴더를 모두 알려 줌 | 이름이 같은 스킬이 둘이면 부딪치고, 하네스는 말없이 하나만 남김 |
| 옆으로 옮기기 | 기존 복사본을 통째로 하네스 홈 안의 날짜별 `extension-backups/` 폴더로 옮김 | 스킬을 읽는 어느 폴더에도 속하지 않아, 내 파일은 남고 두 번째 스킬로 불려 오지 않음 |
| 복사 | 비운 자리에 에디션을 복사 | 새 복사본이 옛 복사본 위에 얹히지 않음 |
| 영수증 | 복사본 안에 `.litfamily-extension.json`(id, 출처, 에디션, 설치 시각)을 씀 | 복사본이 어디서 왔는지 스스로 기록 |

> [!NOTE]
> Grok Build와 Muse Code는 설치 기록을 스스로 남기고 이미 있는 이름 위에는 설치를 거부하므로, 살펴보고, 부딪치는
> 복사본을 옮기고, 설치하는 줄만 있습니다.

- **폴더를 지우는 줄은 하나도 없습니다.** 그래서 남겨 둔 파일이 사라지지 않습니다.
- **업데이트**는 같은 줄을 다시 돌리면 됩니다.
- **제거**는 복사본을 옆으로 옮기면 됩니다.

### 다른 스킬의 명령

[하네스별 참고](#하네스별-참고)의 명령은 `lit-pptx`를 예로 적었습니다. 그 하네스의 LitFamily 스텁이 안내하는 명령을 그대로
옮겨 온 거라서, 스텁과 이 페이지는 늘 같은 말을 합니다.

- **다른 스킬:** `lit-pptx` 자리에 그 스킬의 id를 넣으세요(Claude Code라면 `decks` 자리에 그 패밀리도). 그 스킬의 스텁은
  이름을 채운 같은 명령을 보여 줍니다.
- **`lit-scientific-visualization`:** 원본 scientific-visualization 스킬을 감싸는 어댑터입니다. 패밀리 플러그인은 그 원본을
  `plugins/figures/vendor/scientific-visualization/`에 두고, `variants/`의 에디션은 원본 사본을 스킬 폴더 안에 같이 담고
  있어서 한 번 설치하면 둘 다 들어옵니다.
- **Antigravity CLI:** 스텁이 같은 복사를 작업 공간에만 하는 `.agents/skills/` 형식도 함께 안내합니다
  ([Antigravity CLI](#antigravity-cli) 참고).
- **OpenCode 영상 스텁:** 복사한 다음 런타임 설치를 한 단계 더 합니다:
  `node ~/.config/opencode/skills/lit-typographic-motion/runtime.mjs install`. 나머지 에디션은 처음 쓸 때 엔진을 알아서
  설치합니다.

## 하네스별 참고

하네스마다 스킬을 읽는 폴더가 다르고, 이름이 같은 스킬을 정리하는 방식도 다릅니다. 그래서 하네스마다 명령이 따로
있습니다. 아래 표로 먼저 훑어보고, 명령은 각 절에서 확인하세요.

| 하네스 | 들어가는 것 | 명령 | 그다음 |
| --- | --- | --- | --- |
| [Claude Code](#claude-code) | 패밀리 플러그인 하나 | 살펴보기, 옆으로 옮기기, 설치 | 스킬이 `<family>:<id>`로 응답 |
| [Codex CLI](#codex-cli) | `variants/litcodex/<id>/` | 살펴보기, 옆으로 옮기기, 복사, 영수증 | Codex 세션 새로 시작 |
| [OpenCode](#opencode) | `variants/litopencode/<id>/` | 살펴보기, 옆으로 옮기기, 복사, 영수증 | 세션 새로 시작 |
| [Grok Build](#grok-build) | `variants/litgrok/<id>/`를 플러그인으로 | 확인 두 줄, 설치 | Grok 플러그인 저장소가 기록 |
| [Muse Code](#muse-code) | `variants/litmuse/<id>/` | 살펴보기, 옆으로 옮기기, 설치 | Muse 잠금 파일이 기록 |
| [Antigravity CLI](#antigravity-cli) | `variants/litgravity/<id>/` | 살펴보기, 옆으로 옮기기, 복사, 영수증 | 대화 새로 시작 또는 `/skills reload` |
| [Hermes Agent](#hermes-agent) | `variants/lithermes/<id>/` | 이름 정하기, 살펴보기, 옆으로 옮기기, 복사, 영수증 | 복사본 안에 영수증 |

### Claude Code

Claude Code에서는 패밀리를 이 마켓플레이스의 플러그인으로 받습니다. 쓰는 패밀리만 골라 설치하면 됩니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 살펴보기 | `~/.claude/skills`나 프로젝트 `.claude/skills`의 `lit-pptx` 폴더를 보여 줌 | 그 폴더가 `decks:lit-pptx` 옆에 함께 불려 와 부딪침 | 없음 |
| 옆으로 옮기기 | 개인 복사본(둘째 줄)이나 프로젝트 복사본(셋째 줄)을 `.claude` 옆 날짜별 `extension-backups/`로 통째로 옮김 | Claude Code는 이 폴더를 읽지 않음 | 폴더 하나 이동 |
| 마켓플레이스 추가 | `wjgoarxiv/wjgoarxiv-skills`를 등록 | 패밀리 플러그인이 여기서 옴 | 있음 |
| 설치 | 적은 패밀리를 설치 | 쓰는 패밀리만 받음 | 있음 |

설치하기 전에 프로젝트 폴더에서 실행하세요:

```bash
ls -d ~/.claude/skills/lit-pptx .claude/skills/lit-pptx 2>/dev/null
d="$HOME/.claude/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$d" && mv ~/.claude/skills/lit-pptx "$d"/
d=".claude/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$d" && mv .claude/skills/lit-pptx "$d"/
```

아무 폴더에서나 실행하되, 원하는 패밀리 줄만 남기세요:

```bash
claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills
claude plugin install decks@wjgoarxiv-skills
claude plugin install documents@wjgoarxiv-skills
claude plugin install figures@wjgoarxiv-skills
claude plugin install design@wjgoarxiv-skills
claude plugin install video-covers@wjgoarxiv-skills
```

- **세션 안에서:** `/plugin marketplace add wjgoarxiv/wjgoarxiv-skills`를 실행하고
  `/plugin install decks@wjgoarxiv-skills`처럼 설치합니다.
- **오프라인:** 마켓플레이스를 로컬 클론으로 지정합니다:
  `claude plugin marketplace add <path to your wjgoarxiv-skills clone>`.

**설치 뒤:** 스킬은 `decks:lit-pptx`, `documents:lit-docx`, `figures:lit-diagram-drawer`, `figures:lit-schematic`,
`design:frontend-ui-ux`, `design:visual-qa`, `video-covers:lit-typographic-motion`, `video-covers:readme-studio`라는
이름으로 응답합니다. LitClaude의 `lit` 라우팅도 발표자료, 문서, 그림, 화면, 영상, README에 대해 그대로 동작합니다. 옮겨 간
스킬이 설치되어 있으면, 라우팅이 불러오는 스텁이 그쪽을 가리키기 때문입니다.

> [!NOTE]
> `lit-scientific-visualization`은 LitClaude에서와 마찬가지로 사용자가 직접 불러야 동작합니다:
> `/figures:lit-scientific-visualization <request>`.

### Codex CLI

Codex는 자기 `skills` 폴더와 `~/.agents/skills`, 그리고 프로젝트의 `.agents/skills`와 `.codex/skills`에서 스킬을 읽습니다.
같은 이름의 스킬은 그 이름을 가진 폴더마다 한 번씩 목록에 올리고, 스킬 폴더 안에 중첩된 `SKILL.md`도 올리기 때문에,
복사는 이미 차 있는 폴더에는 절대 들어가지 않습니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 살펴보기 | 네 곳에서 같은 이름의 폴더마다 `found:`를 출력 | Codex가 그 모두를 목록에 올림 | 없음 |
| 옆으로 옮기기 | `${CODEX_HOME:-$HOME/.codex}/skills`의 복사본을 그 안의 `extension-backups/<date-time>/lit-pptx`로 옮김 | Codex는 이 폴더를 읽지 않음 | 복사본이 있을 때만 |
| 복사 | `variants/litcodex/lit-pptx`를 스킬 폴더로 복사 | 차 있는 폴더 앞에서는 멈춤 | 있음 |
| 영수증 | 복사본 안에 `.litfamily-extension.json`을 씀 | id, 출처, 에디션, 시각 기록 | 파일 하나 |

네 줄을 프로젝트 폴더에서 돌리세요. 줄마다 경로를 스스로 정하므로 한 줄만 붙여 넣어도 동작합니다:

```bash
cx="${CODEX_HOME:-$HOME/.codex}"; p="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; for d in "$cx/skills" "$HOME/.agents/skills" "$p/.agents/skills" "$p/.codex/skills"; do [ -e "$d/lit-pptx" ] && echo "found: $d/lit-pptx"; done; echo "check done"
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/lit-pptx" ]; then b="$cx/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$b" && [ ! -e "$b/lit-pptx" ] && mv "$cx/skills/lit-pptx" "$b/lit-pptx" && echo "moved aside: $b/lit-pptx"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/lit-pptx" ]; then echo "stopped: $cx/skills/lit-pptx still exists"; else mkdir -p "$cx/skills" && cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "$cx/skills/lit-pptx"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; [ -f "$cx/skills/lit-pptx/SKILL.md" ] && printf '{"id":"lit-pptx","source":"%s","variant":"litcodex","installed_at":"%s"}\n' "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$cx/skills/lit-pptx/.litfamily-extension.json"
```

**설치 뒤:** Codex 세션을 새로 시작하세요.

<details>
<summary><code>found:</code> 줄 읽는 법</summary>

- **`${CODEX_HOME:-$HOME/.codex}/skills` 아래:** 옛 복사본입니다. 둘째 줄이 그것을 통째로
  `${CODEX_HOME:-$HOME/.codex}/extension-backups/<date-time>/lit-pptx`로 옮깁니다.
- **다른 곳:** Codex가 함께 올릴 같은 이름의 둘째 스킬이니, 그 폴더는 직접 옮겨 두세요.

</details>

### OpenCode

OpenCode는 `~/.config/opencode/skills`, `~/.agents/skills`, `~/.claude/skills`와 프로젝트의 `.opencode/`, `.agents/`,
`.claude/` 스킬을 읽고, 이름 하나에 스킬 하나만 둡니다. 그래서 확장은 같은 이름의 LitOpenCode 안내 폴더 자리에
들어갑니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 살펴보기 | OpenCode가 읽는 같은 이름의 폴더를 보여 줌 | `~/.config/opencode/skills` 밖에 있는 것은 직접 치워 두기 | 없음 |
| 옆으로 옮기기 | 안내 폴더를 통째로 날짜별 백업으로 옮김 | `extension-backups/`에서 불려 오는 스킬은 없음 | 있을 때만 |
| 복사 | `variants/litopencode/lit-pptx`를 복사 | 확장이 안내 폴더 자리에 들어감 | 있음 |
| 영수증 | 복사본 안에 `.litfamily-extension.json`을 씀 | id, 출처, 에디션, 시각 기록 | 파일 하나 |

아무 폴더에서나 실행하세요:

```bash
ls -d ~/.config/opencode/skills/lit-pptx ~/.agents/skills/lit-pptx ~/.claude/skills/lit-pptx 2>/dev/null
d=~/.config/opencode/extension-backups/$(date +%Y%m%d-%H%M%S); [ ! -e ~/.config/opencode/skills/lit-pptx ] || { mkdir -p "$d" && mv ~/.config/opencode/skills/lit-pptx "$d/"; }
mkdir -p ~/.config/opencode/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" ~/.config/opencode/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litopencode","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ~/.config/opencode/skills/lit-pptx/.litfamily-extension.json
```

**설치 뒤:** 세션을 새로 시작하세요.

> [!NOTE]
> `XDG_CONFIG_HOME`을 쓰고 있다면 `~/.config/opencode/` 대신 `$XDG_CONFIG_HOME/opencode/`를 넣으세요.

### Grok Build

Grok Build는 에디션을 스킬 하나짜리 플러그인으로 자기 플러그인 저장소에 설치하고, 어디서 왔는지도 거기 기록합니다. 그래서
이 명령은 영수증을 따로 쓰지 않습니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 클론 | 이 저장소를 한 번 클론 | 설치가 로컬 폴더를 읽음 | 새 폴더 |
| 세기 | 설치된 `lit-pptx` 복사본 수를 셈 | 0보다 크면 설치를 건너뜀. 다시 설치하면 `already installed`로 멈춤 | 없음 |
| 찾기 | Grok이 읽는 스킬 폴더의 개인 복사본을 보여 줌 | LitGrok 안내문보다 먼저 `/lit-pptx` 이름을 차지함 | 없음 |
| 설치 | 에디션 폴더를 `--trust`로 설치 | Grok이 그 폴더만 복사 | 있음 |

프로젝트 루트에서 읽기만 하는 확인 두 줄을 돌린 다음 설치 줄을 돌리세요:

```bash
git clone https://github.com/wjgoarxiv/wjgoarxiv-skills
grok plugin list --json | grep -cF '"name": "lit-pptx"'
grep -L '^description: "Moved: lit-pptx ' {.grok,.agents,.claude,.cursor,~/.grok,~/.agents,~/.claude,~/.cursor}/skills/lit-pptx/SKILL.md 2>/dev/null
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust
```

둘째 확인이 경로를 보여 줬다면, 그 경로에서 `/SKILL.md`를 뺀 폴더를 먼저 통째로 옮기세요(안내문 자체는 확인에서
건너뜁니다):

```bash
mkdir -p ~/.grok/extension-backups && mv "<that folder>" "$(mktemp -d ~/.grok/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXXXX)/"
```

**설치 뒤:** 복사본은 Grok 플러그인 저장소에 있고, `grok plugin update`는 로컬 폴더를 다시 복사하지 않습니다.
[업데이트와 제거](#업데이트와-제거)를 보세요.

### Muse Code

Muse는 Muse 사용자 스킬, Muse가 함께 읽는 `~/.claude/skills`와 `~/.codex/skills`, 프로젝트의 `.agents/skills`와
`.claude/skills`에서 `lit-pptx`를 불러올 수 있습니다. 이미 있는 폴더 위에는 설치를 거부하고, `--force`를 쓰면 새 파일을 옛
파일에 섞어 버리므로, 명령은 차 있는 폴더를 먼저 옆으로 옮깁니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 살펴보기 | Muse가 `lit-pptx`로 불러올 수 있는 폴더를 모두 보여 줌 | 같은 이름의 복사본이 확장과 순위를 다툼 | 없음 |
| 옆으로 옮기기 | Muse 쪽 복사본을 Muse 스킬 옆의 `extension-backups/`로 옮김 | Muse는 차 있는 폴더를 거부함 | 있을 때만 |
| 설치 | `muse skills install … --scope user` 실행 | Muse 잠금 파일이 복사본을 기록 | 있음 |

프로젝트 폴더에서 실행하세요:

```bash
command ls -d "${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/lit-pptx" "$HOME/.claude/skills/lit-pptx" "$HOME/.codex/skills/lit-pptx" .agents/skills/lit-pptx .claude/skills/lit-pptx 2>/dev/null
D="${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/lit-pptx"; B="${XDG_CONFIG_HOME:-$HOME/.config}/muse/extension-backups/$(date +%Y%m%d-%H%M%S)"; [ -e "$D" ] && mkdir -p "$B" && mv "$D" "$B/" && echo "moved to $B/lit-pptx"
muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-pptx --scope user
```

**설치 뒤:** Muse는 출처와 시각, 파일마다 해시를 자기 잠금 파일 `$CONFIG_DIR/skills/.muse/lock.json`에 남기므로 다른
영수증은 필요 없습니다. `~/.claude/skills`나 `~/.codex/skills`의 개인 복사본은 설치한 확장보다 순위가 낮아서
가려진(shadowed) 것으로 나옵니다.

> [!WARNING]
> 프로젝트의 `.agents/skills`나 `.claude/skills` 복사본은 그 프로젝트 안에서 확장보다 앞섭니다. 거기서 확장을 쓰려면 그
> 복사본을 옮기거나 이름을 바꾸세요.

### Antigravity CLI

agy는 작업 공간의 `.agents/skills`와 `_agents/skills`, 그다음 `~/.gemini/config/skills`와 `~/.gemini/skills`에서 스킬을
불러오고, 이름이 같은 스킬은 아무 말 없이 하나만 남깁니다. 스킬 폴더 안에 남긴 백업이 진짜 복사본을 이기기도 해서, 백업은
agy가 절대 읽지 않는 `~/.gemini/extension-backups/`로 보냅니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 살펴보기 | 네 곳에서 이름이 `lit-pptx`인 `SKILL.md`를 모두 찾음 | agy는 말없이 하나만 남김 | 없음 |
| 옆으로 옮기기 | 사용자 복사본을 날짜별 `~/.gemini/extension-backups/` 폴더로 옮김 | agy는 이 폴더를 읽지 않음 | 있을 때만 |
| 복사 | `variants/litgravity/lit-pptx`를 agy 사용자 스킬로 복사 | 모든 작업 공간이 함께 봄 | 있음 |
| 영수증 | 복사본 안에 `.litfamily-extension.json`을 씀 | id, 출처, 에디션, 시각 기록 | 파일 하나 |

agy를 쓰는 작업 공간에서 네 줄을 한 줄씩 붙여 넣으세요:

```bash
find .agents/skills _agents/skills ~/.gemini/config/skills ~/.gemini/skills -maxdepth 2 -name SKILL.md -exec grep -l -E '^name: *"?lit-pptx"? *$' {} + 2>/dev/null
if [ -e ~/.gemini/config/skills/lit-pptx ] || [ -L ~/.gemini/config/skills/lit-pptx ]; then b=~/.gemini/extension-backups/$(date +%Y%m%d-%H%M%S); mkdir -p "$b" && mv ~/.gemini/config/skills/lit-pptx "$b/" && echo "moved to $b/lit-pptx"; fi
mkdir -p ~/.gemini/config/skills && [ ! -e ~/.gemini/config/skills/lit-pptx ] && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" ~/.gemini/config/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litgravity","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ~/.gemini/config/skills/lit-pptx/.litfamily-extension.json
```

**설치 뒤:** 대화를 새로 시작하거나 `/skills reload`를 입력하세요.

<details>
<summary>한 작업 공간에만 설치하기</summary>

위의 첫 줄을 돌린 뒤, 작업 공간 루트에서 다음 세 줄을 돌리세요:

```bash
if [ -e .agents/skills/lit-pptx ] || [ -L .agents/skills/lit-pptx ]; then b=~/.gemini/extension-backups/$(date +%Y%m%d-%H%M%S)-project; mkdir -p "$b" && mv .agents/skills/lit-pptx "$b/" && echo "moved to $b/lit-pptx"; fi
mkdir -p .agents/skills && [ ! -e .agents/skills/lit-pptx ] && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" .agents/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litgravity","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > .agents/skills/lit-pptx/.litfamily-extension.json
```

</details>

### Hermes Agent

Hermes는 프로필의 `skills/` 폴더(그 안의 카테고리 폴더 포함), 신뢰한 프로젝트의 `.hermes/skills`와 `.agents/skills`,
그리고 설정한 `external_dirs`에서 스킬을 읽습니다.

| 단계 | 하는 일 | 이유 | 바뀌는 것 |
| --- | --- | --- | --- |
| 이름 정하기 | `H`, `ID`, `SRC`를 정함 | 나머지 줄이 이 이름을 쓰므로 한꺼번에 붙여 넣기 | 없음 |
| 살펴보기 | `taken:`이나 `free:`, 같은 이름의 스킬, `external_dirs` 설정을 보여 줌 | 부딪칠 것을 미리 확인 | 없음 |
| 옆으로 옮기기 | 폴더를 프로필의 `extension-backups/<date-time>/`로 옮김 | 폴더가 있을 때만 동작 | 그때만 |
| 복사 | 비어 있는 `skills/lit-pptx/`에 에디션을 복사 | 폴더가 남아 있으면 멈춤 | 있음 |
| 영수증 | 복사본 안에 `.litfamily-extension.json`을 씀 | id, 출처, 에디션, 시각 기록 | 파일 하나 |

프로젝트 최상위 폴더에서 bash나 zsh에 한꺼번에 붙여 넣으세요:

```bash
H="${HERMES_HOME:-$HOME/.hermes}"; ID=lit-pptx; SRC="<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-pptx"
[ -e "$H/skills/${ID:?}" ] && echo "taken: $H/skills/$ID" || echo "free: $H/skills/$ID"; grep -rlE --include=SKILL.md "^name: *[\"']?${ID}[\"']? *\$" "$H/skills" .hermes/skills .agents/skills 2>/dev/null; grep -A3 -E '^ *(external_dirs|create_dir):' "$H/config.yaml" 2>/dev/null
if [ -e "$H/skills/${ID:?}" ]; then mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"; fi
if [ -e "$H/skills/${ID:?}" ]; then echo "stopped: $H/skills/$ID is still there"; else mkdir -p "$H/skills" && cp -R "$SRC" "$H/skills/$ID" && echo "copied: $H/skills/$ID"; fi
printf '{"id":"%s","source":"%s","variant":"lithermes","installed_at":"%s"}\n' "${ID:?}" "$SRC" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$H/skills/$ID/.litfamily-extension.json"
```

> [!WARNING]
> `skills/` 아래에 같은 이름의 서로 다른 복사본이 둘 있으면 비겨서 Hermes는 둘 다 불러오지 않습니다.

## 동작 방식

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/big-picture.ko.dark.png">
    <img src="docs/assets/diagrams/big-picture.ko.light.png" width="900" alt="일곱 LitFamily 제품이 핵심 스킬과 스텁 아홉 개를 지닌 채 wjgoarxiv-skills 저장소를 가리킨다. LitClaude는 패밀리 플러그인 다섯 개를, 나머지 여섯 제품은 variants 아래 자기 에디션 폴더를 가리킨다.">
  </picture>
</p>

LitFamily 제품들은 핵심 스킬은 그대로 두고, 옮겨 간 스킬마다 스텁을 하나씩 남겼으며, 스텁은 모두 이 저장소의 한 곳을
가리킵니다. LitClaude 스텁은 패밀리 플러그인 다섯 개를, 나머지 여섯 제품은 `variants/<product>/<id>/` 아래 스킬마다 혼자
돌아가는 자기 에디션 폴더를 가리킵니다.

### 스킬을 이쪽으로 옮긴 이유

여기 스킬들은 원래 LitFamily 안에서 자랐는데, 쓰다 보니 제품마다 제일 무거운 덩어리가 되어 버렸습니다. 자체 오피스
런타임을 가진 발표자료 빌더, 문서 스튜디오, 세 종류의 그림 도구, 화면 디자인 키트, 영상 엔진까지 다 들어 있었으니까요.
대부분은 설치할 때마다 이걸 전부 받을 필요가 없었기에, 핵심은 가볍게 두고 스킬만 한 글자도 고치지 않은 채 이쪽으로 따로
뺐습니다.

LitFamily의 핵심은 이 저장소 없이도 완결되어 있습니다. 각 LitFamily 제품에는 같은 이름의 작은 스텁만 남겼고, 스텁이 그
스킬이 무슨 일을 하는지, 이 선반에서 어떻게 설치하는지 알려 줍니다.

쓰고 있는 LitFamily 제품 옆에 원하는 확장을 설치하면 LitFamily를 온전히 다 누릴 수 있습니다. 발표자료, 문서, 그림, 화면,
영상, README를 부탁하면 LitFamily가 이름으로 확장을 찾아 일을 넘깁니다. 지금 쓰는 에이전트에 필요한 것만 골라 가시고,
나머지는 선반에 두시면 됩니다.

저장소 주소는 https://github.com/wjgoarxiv/wjgoarxiv-skills 입니다.

### 패밀리 플러그인과 그 출처

패밀리 플러그인에는 Claude Code용으로 쓴 LitClaude판이 고치지 않은 채 들어 있습니다.

| 플러그인 | 옮겨 온 LitClaude 커밋 |
| --- | --- |
| `decks` | `fc0fe5d` (1.0.48) |
| `documents` | `8c736ce` (1.0.49와 decks 이전분) |
| `figures` | `2381bfe` (파일은 1.0.49와 같음) |
| `design` | `aaea364` (파일은 1.0.49와 같음) |
| `video-covers` | `4d03ca8` (파일은 1.0.49와 같음) |

### `variants/`의 에디션

다른 여섯 제품은 스킬을 옮기기 전까지 같은 아홉 스킬을 자기 하네스에 맞게 다시 쓴 에디션을 갖고 있었습니다. 저장소를
탱크 하나로, 하네스를 헤더 하나에서 갈라져 나가는 가지로 생각하면 쉽습니다. Claude Code 가지는 패밀리를 통째로 받아 가고,
나머지 가지는 각자 에디션에서 폴더 하나씩만 받아 갑니다.

<p align="center">
  <picture>
    <source media="(prefers-reduced-motion: reduce) and (prefers-color-scheme: dark)" srcset="docs/assets/schematic/editions-manifold.ko.dark.png">
    <source media="(prefers-reduced-motion: reduce)" srcset="docs/assets/schematic/editions-manifold.ko.png">
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/schematic/editions-manifold-loop.ko.dark.webp">
    <source media="(prefers-color-scheme: light)" srcset="docs/assets/schematic/editions-manifold-loop.ko.webp">
    <img src="docs/assets/schematic/editions-manifold-loop.ko.webp" width="900" alt="매니폴드 아이소메트릭 단면도: 다섯 패밀리가 담긴 wjgoarxiv-skills 저장소 탱크가 수직 헤더로 이어지고, 헤더에서 밸브 달린 가지 일곱 개가 나간다. 맨 위의 굵은 빨간 가지는 Claude Code(패밀리 플러그인 통째로)이고, 아래 여섯 가지는 Codex CLI, OpenCode, Grok Build, Muse Code, Antigravity CLI, Hermes Agent로 각자 variants 폴더 하나를 받는다.">
  </picture>
</p>

에디션은 처음에 `variants/<product>/<id>/` 아래로 아무것도 안 바꾼 채 들어왔습니다. 그 제품이 마지막으로 배포한 커밋에서
바이트 단위로 그대로 복사했고, 제품마다 영수증을 하나씩 `receipts/variants-<product>.sha256`에 남겼습니다.

| 폴더 | 하네스 | 복사한 곳 |
| --- | --- | --- |
| `variants/litcodex/` | Codex CLI | LitCodex `b82ad1c` (1.0.38과 skills lock), `plugins/litcodex/skills/<id>/` |
| `variants/litopencode/` | OpenCode | LitOpenCode `dc56845` (1.0.43과 skills lock), `skills/<id>/` |
| `variants/litgrok/` | Grok Build | LitGrok `8fd2c96` (1.0.34와 skills lock), `.grok/skills/<id>/` |
| `variants/litgravity/` | Antigravity CLI | LitGravity `9f2533c` (0.1.8과 skills lock), `plugin/skills/<id>/` |
| `variants/litmuse/` | Muse Code | LitMuse `e966b07` (0.1.11과 skills lock), `plugin/skills/<id>/` |
| `variants/lithermes/` | Hermes Agent | LitHermes `a2466f2` (1.0.39와 skills lock), `packages/lithermes-installer/assets/lithermes-plugin/skills/<id>/` |

그런데 제품 안에 있을 때 각 에디션은 폴더 하나만 설치해서는 따라오지 않는 것들에 기대고 있었습니다. 그래서 제품마다
커밋을 하나씩 더 해서 폴더가 혼자 돌아가게 만들었고, 무엇을 왜 바꿨는지는 `variants/<product>/CHANGES.md`에 하나씩 적어
두었습니다.

<details>
<summary>그 커밋에서 바뀐 것과 남은 것</summary>

- **에디션이 기대던 것:** 런타임 명령, 환경 변수, 훅과 완료 관문, doctor 항목, 에이전트 정의, 그리고 이웃 스킬이나 제품
  공용 `lib/`, `vendor/` 폴더에 있는 파일들.
- **바뀐 것:** 읽는 파일은 폴더 안으로 복사하고, 제품 명령은 폴더 안의 스크립트로 바꾸고, 폴더 밖으로 나가는 경로는 전부
  없앴습니다.
- **남은 것:** 절차, 참고 자료, 엔진, QA 게이트는 그대로 두었습니다. Codex 에디션만 LitCodex 플러그인 내부를 돌리던
  테스트를 뺐습니다.
- **일부러 남긴 내부 이름:** 측정해 둔 기댓값이나 저장된 파일이 그 이름에 기대고 있어서입니다. `litfamily.*` 같은 스키마
  id와 제품 접두사가 붙은 id, 견본 커버 레시피의 브랜드 단어, 그리고 Codex 에디션 스크립트의 `LITCODEX_*` 설정값과 오류
  코드가 그렇습니다.
- **해시로 고정한 외부 자료:** frontend-ui-ux의 `references/_canonical-corpus/`처럼 손대지 않은 자료라서, 그 안에 다른
  코딩 에이전트 이름이 나올 수도 있습니다.

</details>

## 업데이트와 제거

업데이트는 같은 줄을 다시 돌리면 되고, 복사본을 없앨 때는 대개 옆으로 옮기므로 없앤 복사본은 백업 폴더에 남아 있습니다.
Claude Code와 Grok Build는 각자의 명령으로 업데이트하며, 그 명령은 표 아래에 있습니다.

| 하네스 | 업데이트 | 제거 | 다시 시작 |
| --- | --- | --- | --- |
| Claude Code | 마켓플레이스를 새로 받고 패밀리를 업데이트 | — | 필요: `/reload-plugins` |
| Codex CLI | 클론을 pull 한 뒤 네 줄을 다시 | 옆으로 옮기는 줄만 | 필요: Codex 세션 새로 시작 |
| OpenCode | 네 줄을 다시 | 둘째 줄. 그러면 `litopencode install`이 안내 폴더를 다시 놓아 줌 | 필요: 세션 새로 시작 |
| Grok Build | pull, 센 복사본 수만큼 제거, 다시 설치 | `grok plugin uninstall lit-pptx`. 원본은 클론에 남음 | — |
| Muse Code | 세 줄을 다시 | 둘째 줄 뒤 `muse skills uninstall lit-pptx` | — |
| Antigravity CLI | 같은 줄을 다시 | 둘째 줄만 | 필요: 대화 새로 시작 또는 `/skills reload` |
| Hermes Agent | 클론을 pull 한 뒤 같은 줄을 다시 붙여 넣기 | 첫 줄을 붙여 넣고 아래 제거 줄 | — |

**Claude Code.** 두 줄을 이 순서대로 돌립니다. 첫 줄이 마켓플레이스를 새로 받고, 둘째 줄이 받은 내용과 플러그인 버전을
비교합니다. Claude Code는 버전이 바뀌었을 때만 새 복사본을 설치하고, 새 복사본은 `/reload-plugins` 뒤에 불려 옵니다.

```bash
claude plugin marketplace update wjgoarxiv-skills
claude plugin update decks@wjgoarxiv-skills
```

**Grok Build.** 같은 폴더를 다시 설치하면 `already installed`로 멈추므로, 첫 확인에서 센 복사본 수만큼 제거합니다. 아무
폴더에서나 실행하세요:

```bash
git -C "<path to your wjgoarxiv-skills clone>" pull
grok plugin uninstall lit-pptx
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust
```

**Hermes Agent.** 복사본을 없애려면 Hermes 첫 줄을 붙여 넣고 이 줄을 이어서 돌리세요. 폴더를 백업으로 옮길 뿐 아무것도
지우지 않습니다:

```bash
[ -e "$H/skills/${ID:?}" ] && mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"
```

- **Antigravity CLI:** 업데이트하면 옛 복사본은 새 날짜별 백업으로 옮겨지고 영수증은 새로 쓰입니다. 필요 없어진 백업은
  `~/.gemini/extension-backups/`에서 직접 정리하면 됩니다.

> [!WARNING]
> Muse Code에서 업데이트할 때 `--force`와 `muse skills update lit-pptx`는 쓰지 마세요. 둘 다 새 에디션에서 빠진 파일을 그대로
> 남깁니다.

## 문제 해결과 자주 묻는 질문

**LitFamily 제품이 꼭 있어야 하나요?** 아닙니다. 패밀리 플러그인은 LitFamily 제품이 하나도 없어도 동작합니다. 제품이 있으면
그 라우팅이 이름으로 옮겨 간 스킬을 찾아갑니다.

**스킬 이름에 왜 `lit-`이 남아 있나요?** 접두사는 스킬이 어디서 왔는지 달아 둔 이름표라서, lit이라는 이름의 무언가를 따로
설치할 필요는 없습니다. 각 제품 스텁이 같은 id를 써야 라우팅이 옮겨 간 스킬을 찾고, 여기서 이름을 바꾸면 그 연결이 끊기며
복사본이 원본과 같다는 걸 증명하는 영수증도 더는 맞지 않게 됩니다.

**하네스가 엉뚱한 복사본을 불러와요.** 이름이 같은 스킬이 둘이면 부딪치고 하네스는 말없이 하나만 남깁니다. 그 하네스의
살펴보기 줄을 돌리고 다른 폴더를 옆으로 옮기세요.

**영상 스킬이 없는 Stop 훅 얘기를 해요.** 그 훅은 LitClaude에 있던 것입니다.
[LitClaude 밖에서 영상 스킬 쓰기](#video-covers)를 보세요.

## 참고 자료

여기부터는 저장소를 관리하는 사람을 위한 내용이라, 처음 쓰는 분은 건너뛰어도 됩니다. 긴 목록은
[docs/reference_ko-KR.md](docs/reference_ko-KR.md)에 있습니다.

| 주제 | 위치 |
| --- | --- |
| 저장소 구성 | [docs/reference_ko-KR.md › 저장소 구성](docs/reference_ko-KR.md#저장소-구성) |
| 패밀리 플러그인이 스킬 말고 담고 있는 것 | [docs/reference_ko-KR.md › 패밀리마다 담긴 것](docs/reference_ko-KR.md#패밀리마다-담긴-것) |
| 이 저장소의 규칙 | [docs/reference_ko-KR.md › 이 저장소의 규칙](docs/reference_ko-KR.md#이-저장소의-규칙) |
| 옮긴 뒤 고친 파일 | [옮긴 뒤 고친 파일](#옮긴-뒤-고친-파일) |
| `npm test`가 확인하는 것 | [확인](#확인) |

### 옮긴 뒤 고친 파일

옮겨 온 파일은 받은 그대로 둡니다. 예외는 하나입니다. 제품이 나중에 없앤 LitFamily 제품 명령을 실행하라고 사용자(또는
모델)에게 말하는 줄인데, 그런 줄은 설치된 플러그인이 혼자 실행할 수 있는 명령으로 바꾸고 파일의 나머지는 건드리지
않습니다.

<details>
<summary>패밀리별로 고친 파일</summary>

고친 파일도 영수증 행을 그대로 두되, 첫 칸에 지금의 sha256을 적고 넷째 칸에
`edited-from:<원래 복사본의 sha256>`을 붙입니다. `npm test`는 둘 다 확인하고, 고친 파일이 모두 영어 README의 같은 목록에
올라 있는지도 확인합니다. 캐시 경로는 그대로라서, 예전 제품 릴리스가 설치해 둔 런타임을 다시 씁니다.

`video-covers` (LitClaude 1.0.50에서 `litclaude-ai motion-runtime`과 모션 doctor 줄이 빠짐):
- `skills/lit-typographic-motion/engine/node/runtime.mjs`: BLOCKED 14·15 메시지, status, doctor가 모두 출력하는
  `INSTALL_COMMAND`가 `node "<스킬 폴더 절대 경로>/scripts/motion-runtime.mjs" install`입니다.
- `skills/lit-typographic-motion/engine/node/stage-serve.mjs`: 스테이지 글꼴 BLOCKED 메시지 두 개가 이 명령을 출력합니다.
- `skills/lit-typographic-motion/scripts/motion-runtime.mjs`: 사용법 안내가 스크립트 자신을 가리킵니다.
- `skills/lit-typographic-motion/SKILL.md`: exit 14 행.
- `skills/lit-typographic-motion/references/runtime.md`: 설치 표, 미리 받기 절(미리 받기, doctor, status를 스크립트로),
  exit 14 행, 오디오 경고.
- `engine/audio/beat_grid.py`, `fonts/manifest.json`, `engine/models/word-timing.json`, `engine/THIRD_PARTY_NOTICES`:
  설치 프로그램을 가리키는 줄.

`engine/package.json`과 `engine/audio/requirements.lock`에는 옛 명령이 일부러 남아 있습니다. 이 두 파일의 바이트가 캐시
폴더 이름(`node-<lockdigest>-...`, `audio-<digest>`)에 해시로 들어가서, 고치면 이미 받아 둔 캐시를 모두 버리게 됩니다.

`figures` (LitClaude 1.0.50에서 `litclaude doctor`의 scientific-visualization doctor가 빠짐):
- `skills/lit-scientific-visualization/SKILL.md`: 4단계는 번들 doctor만 실행하고, 더는 `litclaude doctor`를 권하지 않습니다.

`decks`와 `documents`는 고칠 게 없습니다. 오피스 런타임은 `lib/office-runtime.mjs`가 처음 쓸 때 스스로 설치하고, 그
`status`도 플러그인에서 돌아갑니다. `variants/`의 에디션들은 이미 혼자 돌아가도록 손봤고(각 `CHANGES.md` 참고), 제품이 없앤
명령을 가리키는 에디션은 없습니다.

</details>

### 확인

이 페이지가 약속하는 내용은 `npm test`가 지킵니다. 무엇이든 바꾼 뒤에는 플러그인 검사와 함께 돌리세요.

| `npm test`가 확인하는 것 | 대조하는 곳 |
| --- | --- |
| 패밀리 플러그인이 담은 스킬마다 설치 표 행이 하나씩 있는지 | 마켓플레이스 |
| 하네스별 명령이 글자 하나까지 같은지 | 스텁의 명령을 담아 둔 `test/stub-install-lines.json` |
| 그 명령이 스킬마다 가리키는 폴더가 실제로 있는지 | 이 저장소 |
| 영수증이 맞는지(`edited-from:` 행 포함) | 복사한 파일의 바이트 |

저장소 루트에서 실행하세요:

```bash
npm test
claude plugin validate .
claude plugin validate plugins/decks
claude plugin validate plugins/documents
claude plugin validate plugins/figures
claude plugin validate plugins/design
claude plugin validate plugins/video-covers
```

## 라이선스

저장소 전체에 붙는 라이선스는 따로 없습니다. 대신 패밀리 플러그인마다 원래 파일이 따르던 라이선스를
`plugins/<family>/LICENSE`에 담고, `plugin.json`에 밝혀 두었습니다.

| 플러그인 | 밝힌 라이선스 | 출처 |
| --- | --- | --- |
| `decks` | MIT | LitClaude 자체 파일 |
| `documents` | MIT | LitClaude 자체 파일 |
| `figures` | MIT | LitClaude 자체 파일. `vendor/` 아래 사본은 각자의 출처와 라이선스 파일을 그대로 지닙니다 |
| `design` | MIT AND Apache-2.0 | frontend-ui-ux의 `LICENSE`(MIT)와 `THIRD-PARTY-NOTICE.txt`가 디자인 데이터를, `references/_canonical-corpus/legal/`의 Apache-2.0 라이선스가 참고 코퍼스를 다룹니다 |
| `video-covers` | MIT AND OFL-1.1 | LitClaude 자체 파일과 OFL 라이선스를 따르는 Pretendard 글꼴 |

Pretendard와 JetBrains Mono 글꼴은 수정하지 않은 채 각자의 OFL 라이선스 파일과 함께 들어 있습니다. `variants/`의
에디션은 제품이 스킬 폴더 안에 넣어 배포하던 라이선스와 글꼴 라이선스 파일을 그대로 갖고 있습니다. `docs/assets/`의
그림은 이 페이지를 위해 만든 것이고, 그 안의 글꼴은 렌더링된 픽셀로만 들어 있습니다.
