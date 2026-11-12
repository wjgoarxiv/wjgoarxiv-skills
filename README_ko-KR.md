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

여기 있는 스킬 아홉 개는 LitFamily의 확장입니다. LitFamily는 계획, 루프, 목표, 리뷰로 이어지는 같은 작업 방식을 일곱
코딩 에이전트에 붙여 주는 애드온 묶음이고, 그 핵심은 이 저장소 없이도 완결되어 있습니다. 여기 스킬들은 원래
LitFamily 안에서 자랐는데, 쓰다 보니 제품마다 제일 무거운 덩어리가 되어 버렸습니다. 자체 오피스 런타임을 가진 발표자료
빌더, 문서 스튜디오, 세 종류의 그림 도구, 화면 디자인 키트, 영상 엔진까지 다 들어 있었으니까요. 대부분은 설치할 때마다
이걸 전부 받을 필요가 없었습니다. 그래서 핵심은 가볍게 두고, 스킬만 한 글자도 고치지 않은 채 이쪽으로 따로 뺐습니다. 각
LitFamily 제품에는 같은 이름의 작은 스텁만 남겼고, 스텁이 그 스킬이 무슨 일을 하는지, 이 선반에서 어떻게 설치하는지 알려
줍니다.

쓰고 있는 LitFamily 제품 옆에 원하는 확장을 설치하면 LitFamily를 온전히 다 누릴 수 있습니다. 발표자료, 문서, 그림, 화면,
영상, README를 부탁하면 LitFamily가 이름으로 확장을 찾아 일을 넘깁니다. 지금 쓰는 에이전트에 필요한 것만 골라 가시고,
나머지는 선반에 두시면 됩니다. 스킬 하나만 필요하다면 LitFamily 제품 없이 써도 됩니다.

저장소 주소는 https://github.com/wjgoarxiv/wjgoarxiv-skills 입니다.

## 전체 그림

LitFamily 제품들은 핵심 스킬은 그대로 두고, 옮겨 간 스킬마다 스텁을 하나씩 남겼습니다. 스텁은 모두 이 저장소의 한 곳을
가리키는데, 그게 어디인지는 하네스마다 다릅니다. LitClaude판 스킬은 옆에 있는 공용 파일(`lib/`, `vendor/`, 보조 폴더)에
기대고 있어서, Claude Code에서는 패밀리 플러그인을 통째로 설치합니다. 나머지 여섯 제품은 같은 아홉 스킬을 각자 하네스에
맞게 다시 쓴 에디션을 갖고 있었습니다. 이 에디션들이 지금은 `variants/<product>/<id>/` 아래에 스킬마다 혼자 돌아가는
폴더 하나씩으로 들어 있습니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/big-picture.ko.dark.png">
    <img src="docs/assets/diagrams/big-picture.ko.light.png" width="900" alt="일곱 LitFamily 제품이 핵심 스킬과 스텁 아홉 개를 지닌 채 wjgoarxiv-skills 저장소를 가리킨다. LitClaude는 패밀리 플러그인 다섯 개를, 나머지 여섯 제품은 variants 아래 자기 에디션 폴더를 가리킨다.">
  </picture>
</p>

## 안을 들여다보면: 요청 하나, 유닛 다섯, 관문 다섯

같은 선반을 이번에는 공정 플랜트로 그려 봤습니다. 왼쪽으로 들어온 요청은 그 파일을 만드는 패밀리로 갑니다. 패밀리마다
품질 관문이 하나씩 있는데, 스킬이 원래 하던 검사를 그대로 가져다 쓴 것입니다. 발표자료는 넘침과 대비, 문서는 무결성과
문장 린트, 그림은 도면 QA 게이트와 렌더 확인, 화면은 뷰포트 매트릭스, 영상은 섬광 검사와 이음새를 봅니다. 통과한 초안은
산출물로 나가고, 걸린 초안은 다시 작업하러 돌아갑니다. 아래쪽 스트림 표는 저장소 전체를 표 한 장에 담은 겁니다. 어떤
플러그인에 어떤 스킬이 있고 무엇이 나오는지 한눈에 보입니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/schematic/skill-plant.ko.dark.png">
    <source media="(prefers-color-scheme: light)" srcset="docs/assets/schematic/skill-plant.ko.png">
    <img src="docs/assets/schematic/skill-plant.ko.png" width="900" alt="wjgoarxiv-skills를 공정 플랜트로 그린 PFD: 요청이 다섯 패밀리 유닛으로 나뉘고, 초안은 QA 분석계를 지나 분기 밸브에서 산출물로 가거나 재작업으로 돌아간다. 아래 스트림 표에 패밀리별 스킬과 산출물이 정리되어 있다.">
  </picture>
</p>

## 다섯 패밀리

스킬은 각자 한 종류의 파일을 만들고, 그중 몇몇은 만든 걸 다른 스킬에 넘깁니다. 차트와 다이어그램은 발표자료와 문서로
들어가고, 완성된 화면은 점검으로 넘어갑니다. 지도의 화살표는 스킬의 `SKILL.md`가 그 연결을 직접 적어 둔 곳에만
그렸습니다. 점선 하나만 예외인데, README와 잘 어울리는 짝이라서 이어 둔 겁니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/skill-map.ko.dark.png">
    <img src="docs/assets/diagrams/skill-map.ko.light.png" width="900" alt="다섯 패밀리로 묶은 아홉 스킬과 각자 만드는 결과물. lit-scientific-visualization의 차트 PNG는 lit-docx와 lit-pptx로, lit-diagram-drawer의 다이어그램 PNG는 lit-pptx로 가고, frontend-ui-ux가 만든 화면은 visual-qa가 점검하며, lit-typographic-motion의 커버 루프는 readme-studio와 짝을 이룬다.">
  </picture>
</p>

사실 이 페이지에 있는 그림들이 곧 견본입니다. 맨 위 커버가 바로 `video-covers`가 만드는 종류, 소리 없이 끊김 없이 도는
README 커버 루프입니다. 전체 그림, 스킬 지도, 설치 경로는 `lit-diagram-drawer`로, 공정 플랜트와 매니폴드는
`lit-schematic`으로 그리고 내보냈습니다.

### `decks`: 받은 사람이 고칠 수 있는 발표자료

`lit-pptx`는 요청이나 메모, 원본 파일을 받아서 완성된 PowerPoint 발표자료를 만듭니다. 먼저 청중과 내용에 맞는 디자인
방향을 정하고, 슬라이드는 Markdown으로 쓴 다음, 편집 가능한 네이티브 차트와 Pretendard 글꼴을 넣어 컴파일합니다. QA
게이트가 넘치는 글, 약한 대비, 비었거나 허전한 슬라이드를 잡아내고, 렌더링한 페이지까지 직접 확인해야 완성으로 칩니다.
차트는 `lit-scientific-visualization`에서, 다이어그램은 `lit-diagram-drawer`에서 받아 쓸 수 있습니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/decks.ko.dark.png">
    <img src="docs/assets/families/decks.ko.light.png" width="640" alt="스킬 지도의 일부: lit-diagram-drawer의 다이어그램 PNG와 lit-scientific-visualization의 차트 PNG가 lit-pptx로 들어가 .pptx 발표자료가 된다.">
  </picture>
</p>

LitClaude `fc0fe5d`(1.0.48)에서 옮겼습니다.

### `documents`: 디자인한 티가 나는 워드 문서

`lit-docx`는 보고서, 브리프, 매뉴얼, 제안서, 메모, 학술지 원고 같은 워드 문서를 완성본으로 만들어 줍니다. 문체와
디자인은 내용에 맞춰 고르거나, 지정한 출판사 양식(Elsevier, ACS, IEEE, Nature, 한국어 일반 양식)을 따릅니다. DOCX나
PDF를 깔끔한 Markdown으로 바꾸는 일, 기존 .docx를 그 자리에서 고치는 일, PDF로 렌더링하는 일도 합니다. 마지막에는
렌더링한 페이지를 놓고 무결성, 문장, 디자인을 검사합니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/documents.ko.dark.png">
    <img src="docs/assets/families/documents.ko.light.png" width="640" alt="스킬 지도의 일부: lit-scientific-visualization의 차트 PNG가 lit-docx로 들어가 .docx 문서가 된다.">
  </picture>
</p>

LitClaude `8c736ce`(1.0.49와 decks 이전분)에서 옮겼습니다.

### `figures`: 세 종류의 그림, 세 개의 스킬

그림은 "읽는 사람이 지금 뭘 보게 되나"라는 질문 하나에서 시작합니다. 측정한 데이터면 플롯, 아이디어나 시스템이면
다이어그램, 실제 장비면 도면입니다. `lit-scientific-visualization`은 원본 scientific-visualization 스킬을 바탕으로 측정
데이터를 논문용 플롯으로 그립니다. `lit-diagram-drawer`는 개념도와 기술 다이어그램을 HTML/SVG로 그리고, 발표자료와
문서에 넣을 PNG와 Office 호환 SVG로 내보냅니다. `lit-schematic`은 P&ID, PFD, BFD, 장비 배치도, 실험 장치도, 아이소메트릭
단면도 같은 실물 장비 도면을 밀리미터 단위 SVG로 그리고, QA 게이트와 600 dpi 렌더까지 거칩니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/figures.ko.dark.png">
    <img src="docs/assets/families/figures.ko.light.png" width="640" alt="스킬 지도의 일부: lit-scientific-visualization, lit-diagram-drawer, lit-schematic으로 이루어진 figures 패밀리와, 이들이 lit-docx와 lit-pptx로 넘기는 차트와 다이어그램 PNG.">
  </picture>
</p>

LitClaude `2381bfe`(파일은 1.0.49와 같음)에서 옮겼습니다.

### `design`: 화면을 만들고, 만든 화면을 점검하고

`frontend-ui-ux`는 하나로 고정한 하우스 스타일, 레이아웃 계열, 디자인 키트를 바탕으로 화면을 만들고 살펴봅니다. 여기에
디자인 계약, 디자인 지식 데이터베이스, 반응형 매트릭스 전체를 훑는 인터페이스 프로브가 같이 붙습니다. 화면이 다
만들어지면 그다음은 `visual-qa` 차례입니다. 여러 뷰포트 크기에서 상태를 하나씩 바꿔 보며 스크린샷을 찍고, 증거 목록을
남기고, 확인을 막는 게 있으면 정확히 무엇이 막았는지 짚어 줍니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/design.ko.dark.png">
    <img src="docs/assets/families/design.ko.light.png" width="340" alt="스킬 지도의 일부: frontend-ui-ux가 화면을 만들어 visual-qa에 넘기고, visual-qa가 시각 QA 보고서를 쓴다.">
  </picture>
</p>

LitClaude `aaea364`(파일은 1.0.49와 같음)에서 옮겼습니다.

### `video-covers`: 짧은 영상과, 그 영상이 걸릴 README

`lit-typographic-motion`은 한 줄짜리 요청 하나로 짧은 영상을 끝까지 연출합니다. 트리트먼트를 먼저 쓰고, 본 렌더 전에
눈으로 볼 수 있는 스토리보드 단계를 거친 다음, 직접 만든 음악과 룩 조정, 그리고 섬광, 가독성, 결정성, 소리를 보는 QA
게이트를 지납니다. 키네틱 타이포그래피, 가사나 인용구 영상, 타이틀 시퀀스, 무대형 영상까지 만들 수 있고, 커버 모드로는
이 페이지 맨 위에 있는 것 같은, 소리 없이 끊김 없이 도는 README 커버 루프를 만듭니다. `readme-studio`는 저장소를 직접
읽고 사실에 맞는 README를 씁니다. 검수한 커버, 윤곽선으로 바꾼 제목 글자, 원하면 움직이는 커버까지 붙여 줍니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/families/video-covers.ko.dark.png">
    <img src="docs/assets/families/video-covers.ko.light.png" width="340" alt="스킬 지도의 일부: lit-typographic-motion이 영상과 커버 루프를 만들고, 커버 루프는 README를 만드는 readme-studio와 짝을 이룬다.">
  </picture>
</p>

LitClaude `4d03ca8`(파일은 1.0.49와 같음)에서 옮겼습니다.

## 하네스별로 스킬 하나 설치하기

설치하는 길은 두 가지인데, 어느 쪽으로 갈지는 쓰는 에이전트가 정해 줍니다. Claude Code는 이 마켓플레이스를 추가하고
패밀리 플러그인을 설치하면 되고, 나머지 하네스는 저장소를 한 번 클론한 뒤 폴더 하나만 옮기면 됩니다.

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/assets/diagrams/install-paths.ko.dark.png">
    <img src="docs/assets/diagrams/install-paths.ko.light.png" width="900" alt="스킬 하나를 설치하는 두 가지 길: Claude Code는 마켓플레이스 추가 후 패밀리 플러그인 설치, 다른 여섯 하네스는 한 번 클론한 뒤 폴더 하나를 하네스별 한 줄 명령으로 옮긴다.">
  </picture>
</p>

왼쪽 열에서 확장을 찾으세요. Claude Code는 그 옆에 적힌 패밀리 플러그인을 GitHub에서 바로 설치합니다. 나머지 여섯
하네스는 그 스킬을 자기 하네스에 맞게 고친 에디션, `variants/<product>/<id>/`를 로컬 클론에서 가져갑니다. 먼저
`git clone https://github.com/wjgoarxiv/wjgoarxiv-skills`를 한 번 돌리고 `<path to your wjgoarxiv-skills clone>` 자리에 그
폴더 경로를 넣으면 됩니다.

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

Claude Code에서 패밀리 플러그인을 통째로 설치하는 건 LitClaude판 스킬이 옆에 있는 공용 파일(`lib/`, `vendor/`, 보조
폴더)을 읽기 때문입니다. 그래도 설치되는 건 그 패밀리 하나뿐입니다. 다른 하네스는 폴더 하나만 설치합니다. 각 제품이 만든
자기 에디션인데, 스킬이 읽는 파일이 이 폴더 안에 다 들어 있습니다. Grok Build는 폴더 경로를 스킬 하나짜리 플러그인으로
받아서 그 폴더만 플러그인 저장소로 복사합니다. 저장소의 `#` 하위 폴더 형식으로 넘기면 스킬마다 `.git`까지 포함해 저장소
전체를 복사해 버리기 때문에 그 형식은 쓰지 않습니다. Muse Code는 `muse skills install`로 설치하고, Codex CLI, OpenCode,
Antigravity CLI, Hermes Agent는 각자 스킬 폴더에 복사합니다. OpenCode에서는 복사본이 같은 이름의 LitOpenCode 안내 폴더
자리에 들어갑니다. 다른 하네스에서는 복사본이 제품 스텁 옆에 다른 이름으로 자리 잡고, 제품 설치 프로그램도 업그레이드할
때 이 폴더는 건드리지 않습니다.

설치하다가 새 복사본이 옛 복사본에 섞이거나, 스킬 옆에 넣어 둔 내 파일이 사라지면 곤란합니다. 그래서 하네스마다 명령은
먼저 살펴보는 줄로 시작합니다. 첫 줄은 읽기만 합니다. 그 하네스가 함께 불러올 같은 이름의 폴더를 모두 알려 주는데, 이름이
같은 스킬이 둘이면 서로 부딪치고 하네스는 말없이 하나만 남기기 때문입니다. 명령이 폴더를 직접 복사하는 하네스에서는 다음
줄이 기존 복사본을 통째로 그 하네스 홈 안의 날짜별 `extension-backups/` 폴더로 옮깁니다. 이 폴더는 하네스가 스킬을 읽는
어느 폴더에도 속하지 않아서, 내 파일은 거기 그대로 남고 백업이 두 번째 스킬로 불려 오는 일도 없습니다. 복사는 그렇게 비운
자리에 들어가고, 마지막 줄이 복사본 안에 작은 영수증 `.litfamily-extension.json`(id, 출처, 에디션, 설치 시각)을 남깁니다.
Grok Build와 Muse Code는 설치 기록을 스스로 남기고 이미 있는 이름 위에는 설치를 거부하므로, 살펴보고, 부딪치는 복사본을
옮기고, 설치하는 줄만 있습니다. 폴더를 지우는 줄은 하나도 없습니다. 업데이트는 같은 줄을 다시 돌리면 되고, 복사본을
없앨 때는 옆으로 옮기면 됩니다.

하네스별 명령은 [하네스별 참고](#하네스별-참고)에 `lit-pptx`를 예로 적어 두었습니다. 그 하네스의 LitFamily 스텁이 안내하는
명령을 그대로 옮겨 온 거라서, 스텁과 이 페이지는 늘 같은 말을 합니다. 다른 스킬이라면 `lit-pptx` 자리에 그 스킬의 id를
넣으세요(Claude Code라면 `decks` 자리에 그 패밀리도). 그 스킬의 스텁은 이름을 채운 같은 명령을 보여 줍니다.

`lit-scientific-visualization`은 원본 scientific-visualization 스킬을 감싸는 어댑터입니다. 패밀리 플러그인은 그 원본을
`plugins/figures/vendor/scientific-visualization/`에 두고, `variants/`의 에디션은 원본 사본을 스킬 폴더 안에 같이 담고
있어서 한 번 설치하면 둘 다 들어옵니다. Antigravity 스텁은 같은 복사를 작업 공간에만 하는 `.agents/skills/` 형식도 함께
안내합니다. OpenCode 영상 스텁은 복사한 다음 런타임 설치를 한 단계 더 합니다:
`node ~/.config/opencode/skills/lit-typographic-motion/runtime.mjs install`. 나머지 에디션은 처음 쓸 때 엔진을 알아서
설치합니다.

`npm test`가 이 표를 마켓플레이스와 대조합니다. 패밀리 플러그인이 담은 스킬마다 행이 하나씩 있는지 보고, 아래
하네스별 명령이 스텁의 명령을 담아 둔 `test/stub-install-lines.json`과 글자 하나까지 같은지, 그 명령이 스킬마다 가리키는
폴더가 실제로 있는지도 봅니다.

## 하네스별 참고

### Claude Code

Claude Code에서는 패밀리를 이 마켓플레이스의 플러그인으로 받습니다. 쓰는 패밀리만 골라 설치하면 됩니다.

```bash
claude plugin marketplace add wjgoarxiv/wjgoarxiv-skills
claude plugin install decks@wjgoarxiv-skills
claude plugin install documents@wjgoarxiv-skills
claude plugin install figures@wjgoarxiv-skills
claude plugin install design@wjgoarxiv-skills
claude plugin install video-covers@wjgoarxiv-skills
```

세션 안에서는 `/plugin marketplace add wjgoarxiv/wjgoarxiv-skills`를 실행하고
`/plugin install decks@wjgoarxiv-skills`처럼 설치하면 됩니다. 오프라인이면 마켓플레이스를 로컬 클론으로 지정해도 됩니다:
`claude plugin marketplace add <path to your wjgoarxiv-skills clone>`.

이름이 같은 내 스킬이 있으면 걸림돌이 됩니다. `~/.claude/skills`나 프로젝트의 `.claude/skills`에 `lit-pptx` 폴더가 있으면
`decks:lit-pptx` 옆에 함께 불려 와서 서로 부딪칩니다. 그러니 설치하기 전에 먼저 찾아보세요. 아래 첫 줄은 그런 폴더를
보여 주기만 하고, 나머지 두 줄은 개인 복사본이나 프로젝트 복사본을 통째로 그 `.claude` 폴더 옆의 날짜별
`extension-backups/` 폴더로 옮깁니다. Claude Code는 이 폴더를 읽지 않습니다.

```bash
ls -d ~/.claude/skills/lit-pptx .claude/skills/lit-pptx 2>/dev/null
d="$HOME/.claude/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$d" && mv ~/.claude/skills/lit-pptx "$d"/
d=".claude/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$d" && mv .claude/skills/lit-pptx "$d"/
```

업데이트는 두 줄을 이 순서대로 돌립니다. 첫 줄이 마켓플레이스를 새로 받고, 둘째 줄이 받은 내용과 플러그인 버전을
비교합니다. Claude Code는 버전이 바뀌었을 때만 새 복사본을 설치하고, 새 복사본은 `/reload-plugins` 뒤에 불려 옵니다:

```bash
claude plugin marketplace update wjgoarxiv-skills
claude plugin update decks@wjgoarxiv-skills
```

설치하고 나면 스킬은 `decks:lit-pptx`, `documents:lit-docx`, `figures:lit-diagram-drawer`, `figures:lit-schematic`,
`design:frontend-ui-ux`, `design:visual-qa`, `video-covers:lit-typographic-motion`, `video-covers:readme-studio`라는
이름으로 응답합니다. `lit-scientific-visualization`은 LitClaude에서와 마찬가지로 사용자가 직접 불러야 동작합니다:
`/figures:lit-scientific-visualization <request>`. LitClaude의 `lit` 라우팅도 발표자료, 문서, 그림, 화면, 영상, README에
대해 그대로 동작합니다. 옮겨 간 스킬이 설치되어 있으면, 라우팅이 불러오는 스텁이 그쪽을 가리키기 때문입니다.

### 나머지 여섯 하네스 (`variants/`)

패밀리 플러그인에 들어 있는 건 Claude Code용으로 쓴 LitClaude판입니다. 다른 여섯 제품은 스킬을 옮기기 전까지 같은 아홉
스킬을 자기 하네스에 맞게 다시 쓴 에디션을 갖고 있었습니다. 저장소를 탱크 하나로, 하네스를 헤더 하나에서 갈라져 나가는
가지로 생각하면 쉽습니다. Claude Code 가지는 패밀리를 통째로 받아 가고, 나머지 가지는 각자 에디션에서 폴더 하나씩만 받아
갑니다.

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

그런데 제품 안에 있을 때 각 에디션은 폴더 하나만 설치해서는 따라오지 않는 것들에 기대고 있었습니다. 런타임 명령, 환경
변수, 훅과 완료 관문, doctor 항목, 에이전트 정의, 그리고 이웃 스킬이나 제품 공용 `lib/`, `vendor/` 폴더에 있는
파일들이죠. 그래서 제품마다 커밋을 하나씩 더 해서 폴더가 혼자 돌아가게 만들었습니다. 읽는 파일은 폴더 안으로 복사하고,
제품 명령은 폴더 안의 스크립트로 바꾸고, 폴더 밖으로 나가는 경로는 전부 없앴습니다. 무엇을 왜 바꿨는지는
`variants/<product>/CHANGES.md`에 하나씩 적어 두었습니다. 절차, 참고 자료, 엔진, QA 게이트는 그대로 두었고, Codex
에디션만 LitCodex 플러그인 내부를 돌리던 테스트를 뺐습니다.

일부 내부 이름은 일부러 남겼습니다. 측정해 둔 기댓값이나 저장된 파일이 그 이름에 기대고 있어서입니다. `litfamily.*` 같은
스키마 id와 제품 접두사가 붙은 id, 견본 커버 레시피의 브랜드 단어, 그리고 Codex 에디션 스크립트의 `LITCODEX_*` 설정값과
오류 코드가 그렇습니다. frontend-ui-ux의 `references/_canonical-corpus/`처럼 해시로 고정한 외부 자료는 손대지 않았기
때문에, 그 안에 다른 코딩 에이전트 이름이 나올 수도 있습니다.

### Codex CLI

Codex는 자기 `skills` 폴더와 `~/.agents/skills`, 그리고 프로젝트의 `.agents/skills`와 `.codex/skills`에서 스킬을 읽고,
같은 이름의 스킬은 그 이름을 가진 폴더마다 한 번씩 목록에 올립니다. 스킬 폴더 안에 중첩된 `SKILL.md`도 목록에 올리기
때문에, 복사는 이미 차 있는 폴더에는 절대 들어가지 않습니다. 네 줄을 프로젝트 폴더에서 돌리세요. 살펴보기, 옆으로 옮기기,
복사, 영수증 순서입니다. 줄마다 경로를 스스로 정하므로 한 줄만 붙여 넣어도 동작합니다.

```bash
cx="${CODEX_HOME:-$HOME/.codex}"; p="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"; for d in "$cx/skills" "$HOME/.agents/skills" "$p/.agents/skills" "$p/.codex/skills"; do [ -e "$d/lit-pptx" ] && echo "found: $d/lit-pptx"; done; echo "check done"
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/lit-pptx" ]; then b="$cx/extension-backups/$(date +%Y%m%d-%H%M%S)"; mkdir -p "$b" && [ ! -e "$b/lit-pptx" ] && mv "$cx/skills/lit-pptx" "$b/lit-pptx" && echo "moved aside: $b/lit-pptx"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; if [ -e "$cx/skills/lit-pptx" ]; then echo "stopped: $cx/skills/lit-pptx still exists"; else mkdir -p "$cx/skills" && cp -R "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "$cx/skills/lit-pptx"; fi
cx="${CODEX_HOME:-$HOME/.codex}"; [ -f "$cx/skills/lit-pptx/SKILL.md" ] && printf '{"id":"lit-pptx","source":"%s","variant":"litcodex","installed_at":"%s"}\n' "<path to your wjgoarxiv-skills clone>/variants/litcodex/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$cx/skills/lit-pptx/.litfamily-extension.json"
```

`${CODEX_HOME:-$HOME/.codex}/skills` 아래의 `found:` 줄은 옛 복사본이고, 둘째 줄이 그것을 통째로
`${CODEX_HOME:-$HOME/.codex}/extension-backups/<date-time>/lit-pptx`로 옮깁니다. Codex는 이 폴더를 읽지 않습니다. 다른
곳의 `found:` 줄은 Codex가 함께 올릴 같은 이름의 둘째 스킬이니, 그 폴더는 직접 옮겨 두세요. 복사 줄은 차 있는 폴더 앞에서
멈춥니다. 다 끝나면 Codex 세션을 새로 시작하세요. 업데이트는 클론을 pull 한 뒤 네 줄을 다시 돌리면 되고, 복사본을 없애려면
옆으로 옮기는 줄만 돌리면 됩니다.

### OpenCode

OpenCode는 `~/.config/opencode/skills`, `~/.agents/skills`, `~/.claude/skills`와 프로젝트의 `.opencode/`, `.agents/`,
`.claude/` 스킬을 읽고, 이름 하나에 스킬 하나만 둡니다. 그래서 확장은 같은 이름의 LitOpenCode 안내 폴더 자리에
들어갑니다. 첫 줄은 OpenCode가 읽는 같은 이름의 폴더를 보여 줍니다. `~/.config/opencode/skills` 밖에 있는 것은 직접
치워 두세요. 둘째 줄은 안내 폴더를 통째로 날짜별 백업으로 옮기고, 셋째 줄이 확장을 복사하고, 넷째 줄이 영수증을 남깁니다.

```bash
ls -d ~/.config/opencode/skills/lit-pptx ~/.agents/skills/lit-pptx ~/.claude/skills/lit-pptx 2>/dev/null
d=~/.config/opencode/extension-backups/$(date +%Y%m%d-%H%M%S); [ ! -e ~/.config/opencode/skills/lit-pptx ] || { mkdir -p "$d" && mv ~/.config/opencode/skills/lit-pptx "$d/"; }
mkdir -p ~/.config/opencode/skills && cp -R "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" ~/.config/opencode/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litopencode","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litopencode/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ~/.config/opencode/skills/lit-pptx/.litfamily-extension.json
```

`XDG_CONFIG_HOME`을 쓰고 있다면 `~/.config/opencode/` 대신 `$XDG_CONFIG_HOME/opencode/`를 넣으세요. `extension-backups/`에서
불려 오는 스킬은 없습니다. 업데이트는 네 줄을 다시 돌리고 세션을 새로 시작하면 됩니다. 복사본을 없애려면 둘째 줄을
돌리세요. 그러면 `litopencode install`이 안내 폴더를 다시 놓아 줍니다.

### Grok Build

Grok Build는 에디션을 스킬 하나짜리 플러그인으로 자기 플러그인 저장소에 설치하고, 어디서 왔는지도 거기 기록합니다. 그래서
이 명령은 영수증을 따로 쓰지 않습니다. 같은 폴더를 다시 설치하면 `already installed`로 멈추고, `grok plugin update`는 로컬
폴더를 다시 복사하지 않습니다. 프로젝트 루트에서 읽기만 하는 확인 두 줄을 돌린 다음 설치 줄을 돌리세요:

```bash
git clone https://github.com/wjgoarxiv/wjgoarxiv-skills
grok plugin list --json | grep -cF '"name": "lit-pptx"'
grep -L '^description: "Moved: lit-pptx ' {.grok,.agents,.claude,.cursor,~/.grok,~/.agents,~/.claude,~/.cursor}/skills/lit-pptx/SKILL.md 2>/dev/null
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust
```

첫 확인은 설치된 복사본 수를 셉니다. 0보다 크면 설치를 건너뛰세요. 둘째 확인은 Grok이 읽는 스킬 폴더에 있는 개인
복사본을 보여 줍니다. 이 복사본은 LitGrok 안내문보다 먼저 `/lit-pptx` 이름을 차지합니다(안내문 자체는 건너뜁니다). 보여 준
경로에서 `/SKILL.md`를 뺀 폴더를 먼저 통째로 옮기세요:

```bash
mkdir -p ~/.grok/extension-backups && mv "<that folder>" "$(mktemp -d ~/.grok/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXXXX)/"
```

업데이트는 클론을 pull 하고, 센 복사본 수만큼 제거한 다음 다시 설치합니다. `grok plugin uninstall lit-pptx`만 돌리면
플러그인이 제거되고, 원본은 클론에 남습니다.

```bash
git -C "<path to your wjgoarxiv-skills clone>" pull
grok plugin uninstall lit-pptx
grok plugin install "<path to your wjgoarxiv-skills clone>/variants/litgrok/lit-pptx" --trust
```

### Muse Code

Muse는 이미 있는 폴더 위에는 설치를 거부하고, `--force`를 쓰면 새 파일을 옛 파일에 섞어 버립니다. 그래서 차 있는 폴더는
먼저 옆으로 옮깁니다. Muse는 출처와 시각, 파일마다 해시를 자기 잠금 파일 `$CONFIG_DIR/skills/.muse/lock.json`에 남기므로
다른 영수증은 필요 없습니다. 첫 줄은 읽기만 하며, Muse가 `lit-pptx`로 불러올 수 있는 폴더를 모두 보여 줍니다. Muse 사용자
스킬, Muse가 함께 읽는 `~/.claude/skills`와 `~/.codex/skills`, 프로젝트의 `.agents/skills`와 `.claude/skills`입니다. 둘째
줄은 Muse 쪽 복사본을 Muse 스킬 옆의 `extension-backups/`로 옮기고, 셋째 줄이 설치합니다.

```bash
command ls -d "${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/lit-pptx" "$HOME/.claude/skills/lit-pptx" "$HOME/.codex/skills/lit-pptx" .agents/skills/lit-pptx .claude/skills/lit-pptx 2>/dev/null
D="${XDG_CONFIG_HOME:-$HOME/.config}/muse/skills/lit-pptx"; B="${XDG_CONFIG_HOME:-$HOME/.config}/muse/extension-backups/$(date +%Y%m%d-%H%M%S)"; [ -e "$D" ] && mkdir -p "$B" && mv "$D" "$B/" && echo "moved to $B/lit-pptx"
muse skills install <path to your wjgoarxiv-skills clone>/variants/litmuse/lit-pptx --scope user
```

`~/.claude/skills`나 `~/.codex/skills`의 개인 복사본은 설치한 확장보다 순위가 낮아서 가려진(shadowed) 것으로 나옵니다.
프로젝트의 `.agents/skills`나 `.claude/skills` 복사본은 그 프로젝트 안에서 확장보다 앞서니, 거기서 확장을 쓰려면 그
복사본을 옮기거나 이름을 바꾸세요. 업데이트는 세 줄을 다시 돌리면 됩니다. `--force`와 `muse skills update lit-pptx`는 새
에디션에서 빠진 파일을 그대로 남기므로 쓰지 마세요. 복사본을 없애려면 둘째 줄을 돌린 뒤 `muse skills uninstall lit-pptx`를
돌리세요.

### Antigravity CLI

agy는 작업 공간의 `.agents/skills`와 `_agents/skills`, 그다음 `~/.gemini/config/skills`와 `~/.gemini/skills`에서 스킬을
불러오고, 이름이 같은 스킬은 아무 말 없이 하나만 남깁니다. 스킬 폴더 안에 남긴 백업이 진짜 복사본을 이기기도 해서, 백업은
agy가 절대 읽지 않는 `~/.gemini/extension-backups/`로 보냅니다. agy를 쓰는 작업 공간에서 네 줄을 한 줄씩 붙여 넣으세요.
스킬은 모든 작업 공간이 함께 보는 agy 사용자 스킬에 들어갑니다:

```bash
find .agents/skills _agents/skills ~/.gemini/config/skills ~/.gemini/skills -maxdepth 2 -name SKILL.md -exec grep -l -E '^name: *"?lit-pptx"? *$' {} + 2>/dev/null
if [ -e ~/.gemini/config/skills/lit-pptx ] || [ -L ~/.gemini/config/skills/lit-pptx ]; then b=~/.gemini/extension-backups/$(date +%Y%m%d-%H%M%S); mkdir -p "$b" && mv ~/.gemini/config/skills/lit-pptx "$b/" && echo "moved to $b/lit-pptx"; fi
mkdir -p ~/.gemini/config/skills && [ ! -e ~/.gemini/config/skills/lit-pptx ] && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" ~/.gemini/config/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litgravity","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > ~/.gemini/config/skills/lit-pptx/.litfamily-extension.json
```

한 작업 공간에만 두려면 첫 줄을 돌린 뒤, 작업 공간 루트에서 다음 세 줄을 돌리세요:

```bash
if [ -e .agents/skills/lit-pptx ] || [ -L .agents/skills/lit-pptx ]; then b=~/.gemini/extension-backups/$(date +%Y%m%d-%H%M%S)-project; mkdir -p "$b" && mv .agents/skills/lit-pptx "$b/" && echo "moved to $b/lit-pptx"; fi
mkdir -p .agents/skills && [ ! -e .agents/skills/lit-pptx ] && cp -R "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" .agents/skills/lit-pptx
printf '{"id":"%s","source":"%s","variant":"litgravity","installed_at":"%s"}\n' lit-pptx "<path to your wjgoarxiv-skills clone>/variants/litgravity/lit-pptx" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > .agents/skills/lit-pptx/.litfamily-extension.json
```

대화를 새로 시작하거나 `/skills reload`를 입력하세요. 업데이트는 같은 줄을 다시 돌리면 됩니다. 옛 복사본은 새 날짜별
백업으로 옮겨지고 영수증은 새로 쓰입니다. 복사본을 없애려면 둘째 줄만 돌리세요. 필요 없어진 백업은
`~/.gemini/extension-backups/`에서 직접 정리하면 됩니다.

### Hermes Agent

Hermes는 프로필의 `skills/` 폴더(그 안의 카테고리 폴더 포함), 신뢰한 프로젝트의 `.hermes/skills`와 `.agents/skills`,
그리고 설정한 `external_dirs`에서 스킬을 읽습니다. `skills/` 아래에 같은 이름의 서로 다른 복사본이 둘 있으면 비겨서 Hermes는
둘 다 불러오지 않습니다. 첫 줄이 나머지 줄이 쓰는 이름 세 개를 정하므로, 프로젝트 최상위 폴더에서 bash나 zsh에 한꺼번에
붙여 넣으세요. 살펴보는 줄은 읽기만 하고, 옆으로 옮기는 줄은 폴더가 있을 때만 그것을 프로필의
`extension-backups/<date-time>/`로 옮기며, 복사는 비어 있는 `skills/lit-pptx/`에 들어가고, 마지막 줄이 영수증을 남깁니다.

```bash
H="${HERMES_HOME:-$HOME/.hermes}"; ID=lit-pptx; SRC="<path to your wjgoarxiv-skills clone>/variants/lithermes/lit-pptx"
[ -e "$H/skills/${ID:?}" ] && echo "taken: $H/skills/$ID" || echo "free: $H/skills/$ID"; grep -rlE --include=SKILL.md "^name: *[\"']?${ID}[\"']? *\$" "$H/skills" .hermes/skills .agents/skills 2>/dev/null; grep -A3 -E '^ *(external_dirs|create_dir):' "$H/config.yaml" 2>/dev/null
if [ -e "$H/skills/${ID:?}" ]; then mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"; fi
if [ -e "$H/skills/${ID:?}" ]; then echo "stopped: $H/skills/$ID is still there"; else mkdir -p "$H/skills" && cp -R "$SRC" "$H/skills/$ID" && echo "copied: $H/skills/$ID"; fi
printf '{"id":"%s","source":"%s","variant":"lithermes","installed_at":"%s"}\n' "${ID:?}" "$SRC" "$(date -u +%Y-%m-%dT%H:%M:%SZ)" > "$H/skills/$ID/.litfamily-extension.json"
```

업데이트는 클론을 pull 한 뒤 같은 줄을 다시 붙여 넣으면 됩니다. 복사본을 없애려면 첫 줄을 붙여 넣고 이 줄을 이어서
돌리세요. 폴더를 백업으로 옮길 뿐 아무것도 지우지 않습니다:

```bash
[ -e "$H/skills/${ID:?}" ] && mkdir -p "$H/extension-backups" && B=$(mktemp -d "$H/extension-backups/$(date +%Y%m%d-%H%M%S)-XXXX") && mv "$H/skills/$ID" "$B/" && echo "moved aside: $B/$ID"
```

### 스킬 이름에 `lit-`이 남아 있는 이유

`lit-` 접두사는 스킬이 어디서 왔는지 달아 둔 이름표입니다. 이 스킬을 쓰려고 lit이라는 이름의 무언가를 따로 설치할 필요는
없습니다. id를 그대로 둔 건 각 LitFamily 제품의 스텁이 같은 이름을 쓰기 때문입니다. LitFamily 제품이 깔려 있으면 그
라우팅이 이 이름으로 옮겨 간 스킬을 찾아가고, 없으면 그냥 이름일 뿐입니다. 여기서 이름을 바꾸면 그 연결이 끊기고,
복사본이 원본과 같다는 걸 증명하는 영수증도 더는 맞지 않게 됩니다.

## 구성

```
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

`decks`에는 LitClaude 오피스 런타임 파일 16개가 `lib/`에 들어 있습니다. 처음 쓸 때 도는 설치
프로그램(`office-runtime.mjs`와 잠금 파일), Python 부트스트랩, 데이터, 무결성, 렌더, 마크 도우미와 이들이 불러오는
모듈입니다. `documents`에도 lit-docx용으로 같은 16개 파일이 들어 있습니다. LitClaude는 이제 오피스 런타임을 직접
배포하지 않습니다. 버전이 고정된 런타임은 처음 쓸 때 `${XDG_CACHE_HOME:-~/.cache}/litclaude/office-runtime`에
설치됩니다. 예전 LitClaude 릴리스가 쓰던 캐시와 같은 자리라서, `decks`와 `documents`, 예전 LitClaude가 같이 있는
컴퓨터에서도 한 번만 설치됩니다. 두 사본은 `office-runtime.mjs` 하나만 다른데, `documents` 쪽은 lit-docx가 쓰는 Python
부분이 설치되면 상태가 `ready`로 표시됩니다.

`figures`는 세 스킬이 자기 폴더 밖에서 읽는 파일을, 바꾸지 않고 같은 상대 위치에 담고 있습니다.
- `lib/`: 마크 도우미와 그것이 불러오는 모듈, 그리고 다이어그램 렌더러용 `npm-invocation.mjs`
- `skills/lit-humanizer/`: 다이어그램 검증기와 doctor가 화면에 보이는 글자를 검사할 때 쓰는 `rules.json`과 스크립트
  네 개만. `SKILL.md`가 없으니 여기서는 스킬이 아니고, lit-humanizer 전체는 LitFamily 제품에 남아 있습니다.
- `vendor/scientific-visualization/`: `lit-scientific-visualization`이 플롯을 그리기 전에 읽는 원본 소스 16개 파일과
  출처, MIT 라이선스
- `bin/litclaude-scientific-visualization-doctor.js`와 `lib/bundled-skills-integrity.mjs`: 읽기만 하는 doctor. 무결성
  검사가 `vendor/handoff/`(파일 4개, 출처와 라이선스 포함)까지 보기 때문에 그 사본도 여기 있지만, 다른 곳에서는 쓰지
  않습니다.

`design`은 frontend-ui-ux와 visual-qa가 자기 폴더 밖에서 읽는 파일을, 바꾸지 않고 같은 상대 위치에 담고 있습니다.
- `lib/`: 프로브, 증거 검사기, 리뷰 규칙이 불러오는 `strict-json.mjs`, `rename-aliases.mjs`, `secret-shapes.mjs`
- `skills/browser-drive/scripts/capability-probe.mjs`: 인터페이스 프로브가 브라우저 드라이버를 찾고 확인할 때 씁니다.
  옆에 `SKILL.md`는 없고, browser-drive 자체는 LitFamily 제품에 남아 있습니다.
- `skills/lit-diagram-drawer/assets/fonts/`와 `skills/lit-typographic-motion/fonts/jetbrains-mono/`: OFL 라이선스가 딸린
  Pretendard와 JetBrains Mono 글꼴. 디자인 키트의 `kit/fonts.json`이 경로로 복사하고 sha256으로 확인합니다. 이 폴더들에도
  `SKILL.md`는 없습니다.

LitClaude는 웹 화면 수정을 이 프로브로 확인하기 때문에, frontend-ui-ux 스텁 안에 인터페이스 프로브 스크립트 사본을
남겨 두었습니다.

`video-covers`는 lit-typographic-motion과 readme-studio가 자기 폴더 밖에서 읽는 파일을, 바꾸지 않고 같은 상대 위치에
담고 있습니다.
- `lib/`: 커버 마크와 엔드 카드를 그리는 마크 도우미(`mark.mjs`, `mark-logo.png`, `output_mark.py`), 그리고
  `project-state-root.mjs`와 그것이 불러오는 `rules/` 모듈 세 개
- `skills/lit-pptx/fonts/pretendard/`: OFL 라이선스가 딸린 Pretendard Regular와 Bold. 영상 엔진의 `fonts/manifest.json`이
  경로로 읽고 sha256으로 확인합니다. 여기에는 `SKILL.md`가 없고, lit-pptx 자체는 `decks`에 있습니다.

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
  일이 없습니다. 아래 "옮긴 뒤 고친 파일"을 보세요.
- `recipes/painted-light/expected.json`은 LitClaude 저장소의 테스트 픽스처를 가리키는데, 그 픽스처는 가져오지
  않았습니다. 그래서 레시피의 참고 이미지는 설명으로만 남아 있습니다.

lit-schematic은 Pretendard를 먼저 `lit-diagram-drawer/assets/fonts/`에서 찾고, 이 폴더는 `figures`에 들어 있습니다. 두
번째로 찾는 `lit-pptx/fonts/`는 복사하지 않았습니다.

### 옮긴 뒤 고친 파일

옮겨 온 파일은 받은 그대로 둡니다. 예외는 하나입니다. 제품이 나중에 없앤 LitFamily 제품 명령을 실행하라고 사용자(또는
모델)에게 말하는 줄입니다. 그런 줄은 설치된 플러그인이 혼자 실행할 수 있는 명령으로 바꾸고, 파일의 나머지는 건드리지
않습니다. 고친 파일도 영수증 행을 그대로 두되, 첫 칸에 지금의 sha256을 적고 넷째 칸에
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

## 이 저장소의 규칙

- 옮겨 오는 스킬은 바이트 단위로 그대로 복사합니다. 영수증과 일치해야 하며, `npm test`가 이를 확인합니다. 예외는 제품이
  나중에 없앤 제품 명령을 실행하라는 줄 하나뿐입니다. 그런 파일은 "옮긴 뒤 고친 파일"에 올리고, 영수증 행에
  `edited-from:<sha256>`을 붙입니다.
- `variants/`의 하네스 에디션은 처음에 그 제품이 마지막으로 배포한 커밋에서 바이트 단위로 그대로 들어오고, 파일마다
  영수증 행을 남겨 영수증과 같은 커밋에 넣습니다. 혼자 돌아가도록 손보는 변경은 그 뒤 별도 커밋으로 하고, 그 제품의
  `CHANGES.md`에 적습니다.
- 제품 스텁의 설치 명령이 바뀌면, 같은 커밋에서 설치 표와 하네스별 참고, 그리고 `npm test`가 둘을 대조하는
  `test/stub-install-lines.json`도 바꿉니다.
- 패밀리 플러그인의 내용을 바꿀 때마다 `plugins/<family>/.claude-plugin/plugin.json`의 `version`을 올립니다.
  `claude plugin update`는 이 버전이 바뀌었을 때만 새 복사본을 설치하므로, 버전을 올리지 않은 변경은 이미 플러그인을 가진
  사람에게 끝내 닿지 않습니다. 마켓플레이스 항목에 `version`이 생기면 그것도 같이 올립니다.

- 패밀리는 그 제품의 한 릴리스에서, 제품 스텁과 함께 옮깁니다.
- 패밀리 플러그인은 LitFamily 제품이 하나도 없어도 동작해야 합니다.

## 확인

```bash
npm test
claude plugin validate .
claude plugin validate plugins/decks
claude plugin validate plugins/documents
claude plugin validate plugins/figures
claude plugin validate plugins/design
claude plugin validate plugins/video-covers
```
