import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Audio } from 'remotion';
import type { TitleVisuals } from '../types';
import { theme } from '../theme';

interface TitleSceneProps {
  visuals: TitleVisuals;
  audioSrc?: string;
  durationInFrames: number;
}

const TitleScene: React.FC<TitleSceneProps> = ({ visuals, audioSrc, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const subtitleSpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 15 } });

  const fadeOut = interpolate(frame, [durationInFrames - 20, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const bgOpacity = interpolate(frame, [0, 20], [0, 0.6], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, ${theme.colors.background} 0%, #1a1040 50%, #0a0a1a 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeOut,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* 背景装饰 */}
      <div
        style={{
          position: 'absolute',
          top: '20%',
          left: '10%',
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.colors.primary}44, transparent 70%)`,
          opacity: bgOpacity,
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '20%',
          right: '10%',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: `radial-gradient(circle, ${theme.colors.secondary}33, transparent 70%)`,
          opacity: bgOpacity,
        }}
      />

      {/* 标题 */}
      <h1
        style={{
          fontFamily: theme.fonts.title,
          fontSize: theme.sizes.title,
          fontWeight: 800,
          color: theme.colors.white,
          textAlign: 'center',
          maxWidth: '80%',
          lineHeight: 1.2,
          transform: `scale(${titleSpring})`,
          textShadow: '0 4px 30px rgba(108, 99, 255, 0.3)',
          margin: 0,
        }}
      >
        {visuals.title}
      </h1>

      {/* 副标题 */}
      {visuals.subtitle && (
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: theme.sizes.subtitle,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            maxWidth: '70%',
            marginTop: 40,
            opacity: subtitleSpring,
            transform: `translateY(${interpolate(subtitleSpring, [0, 1], [20, 0])}px)`,
          }}
        >
          {visuals.subtitle}
        </p>
      )}

      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};

export default TitleScene;
