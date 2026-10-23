import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Audio, Img, staticFile } from 'remotion';
import type { ContentVisuals } from '../types';
import { theme } from '../theme';

interface ContentSceneProps {
  visuals: ContentVisuals;
  audioSrc?: string;
  durationInFrames: number;
}

const ContentScene: React.FC<ContentSceneProps> = ({ visuals, audioSrc, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // 入场动画
  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const slideUp = interpolate(frame, [0, 25], [60, 0], { extrapolateRight: 'clamp' });
  const titleSlide = interpolate(frame, [0, 15], [-30, 0], { extrapolateRight: 'clamp' });

  // 出场动画
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // 图片弹性动画
  const imageScale = spring({ frame: Math.max(0, frame - 10), fps, config: { damping: 15 } });
  const imageSrc = visuals.imageUrl
    ? /^(https?:|data:|\/)/.test(visuals.imageUrl)
      ? visuals.imageUrl
      : staticFile(visuals.imageUrl)
    : undefined;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme.colors.background,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn * fadeOut,
        padding: 80,
        gap: 60,
      }}
    >
      {/* 左侧文字区域 */}
      <div
        style={{
          flex: visuals.imageUrl ? 1 : 'none',
          display: 'flex',
          flexDirection: 'column',
          gap: 30,
          maxWidth: visuals.imageUrl ? '55%' : '80%',
        }}
      >
        <h2
          style={{
            fontFamily: theme.fonts.title,
            fontSize: theme.sizes.heading,
            fontWeight: 700,
            color: theme.colors.primary,
            transform: `translateY(${titleSlide}px)`,
            opacity: interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' }),
            margin: 0,
          }}
        >
          {visuals.title}
        </h2>
        <div
          style={{
            fontFamily: theme.fonts.body,
            fontSize: theme.sizes.body,
            color: theme.colors.text,
            lineHeight: 1.7,
            transform: `translateY(${slideUp}px)`,
            whiteSpace: 'pre-wrap',
          }}
        >
          {visuals.body}
        </div>
      </div>

      {/* 右侧图片 */}
      {imageSrc && (
        <div
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transform: `scale(${imageScale})`,
          }}
        >
            <Img
            src={imageSrc}
            style={{
              maxWidth: '100%',
              maxHeight: '70%',
              borderRadius: 16,
              boxShadow: '0 20px 60px rgba(0,0,0,0.4)',
            }}
          />
        </div>
      )}

      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};

export default ContentScene;
