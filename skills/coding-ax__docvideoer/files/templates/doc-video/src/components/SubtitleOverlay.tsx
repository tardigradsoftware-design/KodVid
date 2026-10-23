import React from 'react';
import { useCurrentFrame, useVideoConfig } from 'remotion';
import type { SubtitleCue } from '../types';

interface SubtitleOverlayProps {
  subtitles: SubtitleCue[];
}

const SubtitleOverlay: React.FC<SubtitleOverlayProps> = ({ subtitles }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const currentMs = (frame / fps) * 1000;

  if (!subtitles || subtitles.length === 0) return null;

  // 找到当前时间点激活的字幕
  // 支持前一条的残留显示（最多重叠 100ms 用于过渡）
  const activeCues = subtitles.filter(
    (cue) => currentMs >= cue.startMs - 50 && currentMs <= cue.endMs,
  );

  if (activeCues.length === 0) return null;

  // 取第一条命中的字幕
  const cue = activeCues[0];

  // 入场/出场动画：当前帧相对于字幕开始/结束的进度
  const fadeInDuration = 150; // ms
  const fadeOutDuration = 200; // ms
  const timeIn = (currentMs - cue.startMs) / fadeInDuration;
  const timeOut = (cue.endMs - currentMs) / fadeOutDuration;
  const opacity = Math.min(1, timeIn, timeOut);

  // 轻微上移动画
  const slideUp = Math.min(1, timeIn);
  const translateY = (1 - slideUp) * 8;

  return (
    <div
      style={{
        position: 'absolute',
        bottom: 80,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        pointerEvents: 'none',
      }}
    >
      <div
        style={{
          display: 'inline-block',
          background: 'rgba(0, 0, 0, 0.72)',
          backdropFilter: 'blur(8px)',
          borderRadius: 12,
          padding: '14px 32px',
          maxWidth: '85%',
          textAlign: 'center',
          opacity,
          transform: `translateY(${translateY}px)`,
        }}
      >
        <span
          style={{
            fontFamily: '"PingFang SC", "Microsoft YaHei", "Noto Sans SC", sans-serif',
            fontSize: 28,
            fontWeight: 500,
            color: '#ffffff',
            lineHeight: 1.5,
            letterSpacing: '0.5px',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
          }}
        >
          {cue.text}
        </span>
      </div>
    </div>
  );
};

export default SubtitleOverlay;
