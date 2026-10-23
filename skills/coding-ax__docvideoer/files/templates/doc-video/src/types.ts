export interface SceneData {
  id: string;
  type: 'title' | 'content' | 'bullet' | 'image' | 'end';
  title: string;
  narration: string;
  duration: number; // 秒
  visuals: TitleVisuals | ContentVisuals | BulletVisuals | ImageVisuals | EndVisuals;
}

export interface TitleVisuals {
  type: 'title';
  title: string;
  subtitle?: string;
}

export interface ContentVisuals {
  type: 'content';
  title: string;
  body: string;
  imageUrl?: string;
}

export interface BulletVisuals {
  type: 'bullet';
  title: string;
  items: string[];
}

export interface ImageVisuals {
  type: 'image';
  imageUrl: string;
  caption?: string;
}

export interface EndVisuals {
  type: 'end';
  title: string;
  summary: string[];
}

export interface Storyboard {
  title: string;
  description: string;
  totalDuration: number;
  scenes: SceneData[];
}

export interface SubtitleCue {
  startMs: number;
  endMs: number;
  text: string;
}

export interface AudioTrack {
  sceneId: string;
  src: string;
  durationMs: number;
  subtitles?: SubtitleCue[];
}
