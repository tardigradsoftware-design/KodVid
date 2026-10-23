---
name: youtube-shorts-factory
description: "유튜브 레퍼런스 영상 분석 → 벤치마킹 → 30%+ 각색 → 스토리보드 기획 → rfn-video-pipeline용 JSON 생성 → 이미지 생성 → HTML 시각화 → AI 영상 제작까지의 전체 쇼츠 제작 워크플로우. 유튜브 쇼츠 분석, 벤치마킹, 각색, 스토리보드, 레퍼런스 영상, 바이럴 분석, 감정 공학, 쇼츠 팩토리, 영상 기획, 콘텐츠 클론 시 자동 활성화."
---

# YouTube Shorts Factory — 레퍼런스 기반 AI 쇼츠 제작 스킬

## 전체 워크플로우

```
Step 1: 유튜브 URL 입력 & 자막 추출
         ↓
Step 2: 영상 포렌식 분석 (바이럴 공식 해부)
         ↓
Step 3: 30%+ 각색 스토리보드 기획
         ↓
Step 4: rfn-video-pipeline용 Story JSON 생성
         ↓
Step 5: 이미지 생성 (한국인/K드라마 스타일 고정)
         ↓
Step 6: 스토리보드 HTML 시각화
         ↓
Step 7: AI 영상 생성 & 자막 추가
```

---

## Step 1: 유튜브 자막 추출

### 방법 A: youtube-transcript 스킬 사용
```
/youtube-transcript {URL}
```

### 방법 B: Python 직접 추출
```python
from youtube_transcript_api import YouTubeTranscriptApi

# Shorts URL에서 ID 추출
# youtube.com/shorts/1nZRnJVtSew → ID: 1nZRnJVtSew
video_id = "1nZRnJVtSew"
api = YouTubeTranscriptApi()
transcript = api.fetch(video_id, languages=['ko'])
```

**주의:** Shorts URL(`youtube.com/shorts/`)은 일반 URL과 ID 추출 패턴이 다름. 직접 비디오 ID만 전달할 것.

---

## Step 2: 영상 포렌식 분석

### 분석 프레임워크 (7개 축)

| 분석 축 | 핵심 질문 |
|---------|----------|
| **Hook 구조** | 첫 1~3초에 어떤 시각적/텍스트 훅을 사용했는가? |
| **내러티브 아크** | 3막 구조(설정→전개→반전)가 어떻게 구성되었는가? |
| **감정 곡선** | 어떤 감정이 어떤 순서로 배치되었는가? |
| **Open Loop** | 시청자가 "다음엔?"이라고 궁금해하게 만드는 장치는? |
| **Silent Hero 패턴** | 대사 없이 행동으로 감동을 전달하는 구조인가? |
| **Payoff 설계** | 마지막 반전/감동의 장치는 무엇인가? |
| **바이럴 계수** | 공유 욕구를 자극하는 요소는? (10점 만점 평가) |

### 출력 형식

```markdown
## 포렌식 분석 결과

### 1. Hook 분석
- 시각적 훅: {설명}
- 텍스트 훅: {설명}
- 호기심 갭: {설명}

### 2. 내러티브 구조
- Act 1 (설정): 00:00~{mm:ss} — {요약}
- Act 2 (전개): {mm:ss}~{mm:ss} — {요약}
- Act 3 (반전): {mm:ss}~{mm:ss} — {요약}

### 3. 감정 엔지니어링
| 타임스탬프 | 감정 | 장치 |
|-----------|------|------|
| 00:00 | {감정} | {장치 설명} |

### 4. Open Loop 카운트
- Loop 1: {설명}
- Loop 2: {설명}

### 5. 바이럴 계수: {X}/10
- 공유 트리거: {설명}
```

---

## Step 3: 30%+ 각색

각색은 **원본의 감정 공학 공식은 유지**하되, **설정·인물·소품·반전장치를 30% 이상 변경**하는 것.

### 각색 체크리스트

| 요소 | 원본 | 각색 | 변경률 |
|------|------|------|--------|
| 주인공 | {원본} | {각색} | ✅/❌ |
| 관계 | {원본} | {각색} | ✅/❌ |
| 장소 | {원본} | {각색} | ✅/❌ |
| 핵심 소품 | {원본} | {각색} | ✅/❌ |
| Payoff 장치 | {원본} | {각색} | ✅/❌ |
| **총 변경률** | | | **≥30%** |

### 각색 원칙
1. **감정 공식 보존**: Hook → 긴장 → 행동 → 반전의 구조는 그대로 유지
2. **문화적 공감**: 한국 가정의 현실적 디테일 반영 (예: 약통, 된장찌개, 냉장고 메모)
3. **소품 교체**: 원본의 핵심 소품을 동일 감정을 유발하는 다른 소품으로 교체
4. **인물 변환**: 부부→부모자식, 친구→동료 등 관계축 변경

상세 가이드: [adaptation-guide.md](resources/adaptation-guide.md)

---

## Step 4: Story JSON 생성

rfn-video-pipeline 스킬의 스토리 JSON 스키마 v2.0을 따름.

### 필수 구조

```json
{
  "schema_version": "2.0",
  "title": "영상 제목",
  "slug": "story_파일명",
  "description": "한 줄 설명",
  "category": "family|inspiration|humor|drama",
  "target_duration_seconds": 60,
  "aspect_ratio": "9:16",
  "scenes": [
    {
      "frame": 1,
      "timestamp": "00:00",
      "act": 1,
      "description": "장면 설명 (한글)",
      "emotion": "establishing_character",
      "prompt": "이미지 프롬프트 (영어, K드라마 스타일 고정)",
      "video_prompt": "영상 움직임 프롬프트 (영어)",
      "video_duration": 6,
      "camera_motion": "slow_push_in",
      "video_engine": "veo_fast",
      "video_priority": "high",
      "subtitle": "화면 자막 (한국어)"
    }
  ]
}
```

### 감정 → 엔진 자동 매핑

| 감정 | 엔진 | 비용 |
|------|------|------|
| `emotional_climax`, `sacrifice` | `veo_standard` | $1.20 |
| `suspense`, `warmth`, `joy` | `veo_fast` | $0.45 |
| `action`, `hope`, `determination` | `minimax` | $0.05 |
| `establishing_character`, `reflection` | `ken_burns` | $0.00 |

### 비용 확인 (Dry-run)

```bash
cd rfn_generator
python scripts/run.py stories/{slug}.json --dry-run
```

---

## Step 5: 이미지 생성

### 스타일 고정값 (필수)

모든 이미지 프롬프트에 아래 키워드를 반드시 포함:

```
Korean actor/actress, realistic Korean facial features,
Korean drama style, K-drama cinematography, Korean drama lighting,
warm cinematic, 9:16 vertical, hyperrealistic
```

### 생성 전 컨펌 프로세스 (필수)

이미지 생성 전에 반드시 아래 테이블을 사용자에게 보여주고 컨펌을 받을 것:

```markdown
| Frame | 장면 | 핵심 시각 요소 | 스타일 |
|-------|------|---------------|--------|
| 1 | {장면 설명} | {핵심 요소} | K드라마 |
| 2 | {장면 설명} | {핵심 요소} | K드라마 |
| ... | ... | ... | ... |
```

### 실행

```bash
cd rfn_generator
# 기존 이미지 삭제 후 재생성 (프롬프트 수정 시)
rm output/{slug}/frames/*.png
python scripts/run.py stories/{slug}.json --max-frames 999 --dry-run  # 비용 확인
python scripts/run.py stories/{slug}.json  # Phase 1만 실행
```

### 이미지 검증

생성 후 각 프레임을 반드시 시각적으로 확인하고, 스토리와 불일치하는 프레임은:
1. 프롬프트에 네거티브 키워드 추가 (`NO face, NO skincare` 등)
2. 구체적 묘사 강화 (`70s elderly man, eyes closed, lying on sofa`)
3. 해당 프레임만 삭제 후 재생성

---

## Step 6: 스토리보드 HTML 시각화

생성된 이미지를 스토리보드 HTML에 base64로 주입.

### 이미지 주입 패턴

```python
import base64, re

def inject_images(html_path, frames_dir, scene_frame_map):
    """
    scene_frame_map: {"sc1": [1], "sc2": [2], "sc3": [3,4,5], ...}
    """
    with open(html_path, 'r') as f:
        html = f.read()

    for scene_id, frame_nums in scene_frame_map.items():
        for frame_num in frame_nums:
            img_path = f"{frames_dir}/frame_{frame_num:04d}.png"
            with open(img_path, 'rb') as f:
                b64 = base64.b64encode(f.read()).decode()
            img_tag = f'<img src="data:image/png;base64,{b64}" style="width:100%;border-radius:12px;">'
            # scene-body-inner 안에 삽입
            pattern = f'(id="{scene_id}"[^>]*>.*?class="scene-body-inner"[^>]*>)'
            html = re.sub(pattern, f'\\1\n{img_tag}', html, flags=re.DOTALL)

    with open(html_path, 'w') as f:
        f.write(html)
```

### AI 텍스트 한계 대응

AI 이미지 생성기는 한국어 텍스트를 정확히 렌더링하지 못함. 텍스트가 중요한 프레임(메모, 간판 등)은 CSS 오버레이로 보완:

```html
<div style="position:relative;">
  <img src="data:image/png;base64,...">
  <div style="position:absolute; bottom:20%; left:50%; transform:translateX(-50%);
    background:rgba(255,255,240,0.92); padding:16px 28px;
    font-family:'Nanum Pen Script',cursive; font-size:1.5rem;
    color:#333; border-radius:8px;">
    밥 먹었어.<br>고마워.
  </div>
</div>
```

---

## Step 7: AI 영상 생성

### Google AI 스택 (권장)

| 단계 | 도구 | 용도 |
|------|------|------|
| 영상 생성 | Google Veo 2 (VideoFX) | 이미지→영상 변환 |
| 나레이션 | Google Cloud TTS `ko-KR-Journey-D` | 한국어 내레이션 |
| BGM | Google MusicFX | AI 배경음악 생성 |
| 편집 | Google Vids | 최종 편집 |

### rfn-video-pipeline 실행

```bash
cd rfn_generator

# Phase 2: 영상 생성 (이미지 완료 후)
python scripts/run.py stories/{slug}.json --resume

# 자막 추가
python scripts/add_subtitles.py stories/{slug}.json
```

### 출력 구조

```
rfn_generator/output/{slug}/
├── frames/frame_0001.png    # Phase 1 이미지
├── clips/clip_0001.mp4      # Phase 2 영상 클립
├── final.mp4                # Phase 3 조립
└── final_subtitled.mp4      # 자막 burn-in
```

---

## 빠른 실행 가이드

사용자가 유튜브 URL을 제공하면 아래 순서로 진행:

1. **자막 추출** → youtube-transcript 스킬 또는 Python API
2. **포렌식 분석** → 7축 프레임워크로 바이럴 공식 해부
3. **각색 테이블** → 30%+ 변경 체크리스트 작성 후 사용자 컨펌
4. **Story JSON** → `rfn_generator/stories/{slug}.json` 생성
5. **Dry-run** → 비용 확인 후 사용자 컨펌
6. **이미지 생성** → 스타일 테이블 보여준 후 컨펌 → 생성 → 검증
7. **HTML 스토리보드** → 이미지 주입한 시각 스토리보드 생성
8. **영상 제작** → `run.py --resume` + `add_subtitles.py`

---

## 리소스 파일

- [워크플로우 단계별 상세](resources/workflow-steps.md)
- [각색 가이드 & 사례](resources/adaptation-guide.md)
- [스토리보드 HTML 템플릿](resources/storyboard-template.md)
