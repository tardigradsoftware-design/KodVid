# YouTube Shorts Factory

> Claude Code 스킬 — 유튜브 레퍼런스 영상 분석부터 AI 쇼츠 제작까지 원스톱 워크플로우

[![Claude Code Skill](https://img.shields.io/badge/Claude_Code-Skill-blueviolet?style=flat-square)](https://docs.anthropic.com/en/docs/claude-code/skills)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=flat-square)](LICENSE)

## What is this?

유튜브에서 잘 되는 Shorts 영상을 분석하고, 그 바이럴 공식을 추출한 뒤, 30% 이상 각색하여 새로운 AI 쇼츠를 제작하는 **7단계 자동화 워크플로우**입니다.

```
Step 1: 유튜브 URL → 자막 추출
Step 2: 영상 포렌식 분석 (바이럴 공식 해부)
Step 3: 30%+ 각색 스토리보드 기획
Step 4: rfn-video-pipeline용 Story JSON 생성
Step 5: 이미지 생성 (한국인/K드라마 스타일)
Step 6: 스토리보드 HTML 시각화
Step 7: AI 영상 생성 & 자막 추가
```

## Features

- **7축 포렌식 분석**: Hook 구조, 내러티브 아크, 감정 곡선, Open Loop, Silent Hero 패턴, Payoff 설계, 바이럴 계수
- **30%+ 각색 프레임워크**: 감정 공식은 보존하면서 인물·장소·소품·반전장치를 체계적으로 변경
- **한국인/K드라마 스타일 고정**: 모든 이미지 프롬프트에 한국 드라마 스타일 자동 적용
- **이미지 생성 전 컨펌 프로세스**: 스타일 테이블을 보여주고 사용자 승인 후 생성
- **HTML 스토리보드 시각화**: base64 이미지 주입, 텍스트 오버레이, 다크/라이트 테마
- **rfn-video-pipeline 연동**: Story JSON 스키마 v2.0, 감정→엔진 자동 매핑, dry-run 비용 확인
- **한국적 디테일 소품 라이브러리**: 감정별 한국 가정 소품 모음 (약통, 된장찌개, 냉장고 메모 등)

## Installation

### Quick Install (Recommended)

```bash
# 프로젝트의 .claude/skills/ 디렉토리에 복사
git clone https://github.com/ninestonelee/youtube-shorts-factory.git \
  .claude/skills/youtube-shorts-factory
```

### Manual Install

1. 이 저장소의 파일을 `.claude/skills/youtube-shorts-factory/`에 복사
2. `skill-rules.json`에 트리거 등록 (아래 참조)

### skill-rules.json 트리거 등록

프로젝트의 `.claude/skills/skill-rules.json`에 아래 항목을 추가하세요:

```json
{
  "youtube-shorts-factory": {
    "type": "domain",
    "enforcement": "suggest",
    "priority": "high",
    "description": "유튜브 레퍼런스 영상 분석 → 벤치마킹 → 30%+ 각색 → 스토리보드 → AI 영상 제작",
    "promptTriggers": {
      "keywords": [
        "레퍼런스 영상", "벤치마킹", "각색", "스토리보드",
        "유튜브 분석", "쇼츠 기획", "바이럴 분석", "감정 공학",
        "쇼츠 팩토리", "영상 기획", "콘텐츠 클론",
        "shorts factory", "youtube analysis", "viral formula",
        "storyboard", "reference video"
      ],
      "intentPatterns": [
        "(분석|analyze|해부).*?(유튜브|youtube|쇼츠|shorts|영상|video)",
        "(레퍼런스|reference).*?(영상|video|분석|analyze)",
        "(각색|adapt).*?(스토리보드|storyboard|영상|video)",
        "(바이럴|viral).*?(분석|공식|formula|패턴|pattern)",
        "(콘텐츠|content).*?(클론|clone|벤치마킹|benchmark)"
      ]
    }
  }
}
```

## File Structure

```
youtube-shorts-factory/
├── SKILL.md                          # 메인 스킬 (7단계 워크플로우)
├── README.md                         # 이 파일
├── LICENSE                           # MIT License
└── resources/
    ├── workflow-steps.md             # 단계별 상세 가이드
    ├── adaptation-guide.md           # 각색 원칙 + 소품 라이브러리
    └── storyboard-template.md        # HTML 템플릿 + 이미지 주입 코드
```

## Usage

### 자동 활성화

아래 키워드가 포함된 프롬프트에서 자동으로 활성화됩니다:

- `"이 유튜브 쇼츠를 분석해줘"`
- `"레퍼런스 영상 벤치마킹해서 각색해줘"`
- `"바이럴 공식 분석"`
- `"스토리보드 기획"`

### 직접 호출

```
Use the youtube-shorts-factory skill to analyze this YouTube Shorts
```

### 워크플로우 예시

```
1. "https://youtube.com/shorts/XXX 이 영상 분석하고 30% 각색해줘"
2. (포렌식 분석 → 각색 테이블 → 사용자 컨펌)
3. "rfn-video-pipeline용 Story JSON 만들어줘"
4. (JSON 생성 → dry-run 비용 확인 → 사용자 컨펌)
5. "각 신별 이미지 생성해줘"
6. (스타일 테이블 → 사용자 컨펌 → 이미지 생성 → 검증)
7. "스토리보드 HTML에 이미지 넣어줘"
8. (HTML 시각화 완성)
```

## Dependencies

이 스킬은 단독으로 동작하지만, 아래 도구와 함께 사용하면 최적의 결과를 얻습니다:

| 도구 | 용도 | 필수 여부 |
|------|------|----------|
| [rfn-video-pipeline](https://github.com/ninestonelee) | Story JSON → 이미지 → 영상 → 자막 | 권장 |
| youtube-transcript 스킬 | 유튜브 자막 추출 | 권장 |
| youtube-video-analyst 스킬 | 포렌식 분석 강화 | 선택 |
| `youtube_transcript_api` (Python) | 자막 API 직접 호출 | 선택 |

## Configuration

### 이미지 스타일 고정값

모든 이미지 프롬프트에 자동 적용되는 기본 스타일:

```
Korean actor/actress, realistic Korean facial features,
Korean drama style, K-drama cinematography, Korean drama lighting,
warm cinematic, 9:16 vertical, hyperrealistic
```

### 감정 → 엔진 매핑

| 감정 | 엔진 | 비용/클립 |
|------|------|----------|
| `emotional_climax` | `veo_standard` | $1.20 |
| `warmth`, `suspense` | `veo_fast` | $0.45 |
| `action`, `hope` | `minimax` | $0.05 |
| `establishing_character` | `ken_burns` | $0.00 |

## License

MIT License - see [LICENSE](LICENSE) for details.

## Author

Created by [@ninestonelee](https://github.com/ninestonelee)
