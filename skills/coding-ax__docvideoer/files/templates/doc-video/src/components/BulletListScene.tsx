import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Audio } from 'remotion';
import type { BulletVisuals } from '../types';
import { theme } from '../theme';

interface BulletListSceneProps {
  visuals: BulletVisuals;
  audioSrc?: string;
  durationInFrames: number;
}

const BulletItem: React.FC<{ text: string; index: number; fps: number }> = ({ text, index, fps }) => {
  const frame = useCurrentFrame();
  const itemStart = index * 15; // 每条间隔 15 帧 = 0.5 秒
  const localFrame = Math.max(0, frame - itemStart);

  const slideIn = spring({ frame: localFrame, fps, config: { damping: 20, mass: 0.8 } });
  const opacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 20,
        opacity,
        transform: `translateX(${interpolate(slideIn, [0, 1], [-60, 0])}px)`,
        marginBottom: 20,
      }}
    >
      {/* 圆点标记 */}
      <div
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          background: theme.colors.primary,
          flexShrink: 0,
          transform: `scale(${slideIn})`,
        }}
      />
      <span
        style={{
          fontFamily: theme.fonts.body,
          fontSize: theme.sizes.body,
          color: theme.colors.text,
          lineHeight: 1.5,
        }}
      >
        {text}
      </span>
    </div>
  );
};

const BulletListScene: React.FC<BulletListSceneProps> = ({ visuals, audioSrc, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleSlide = interpolate(frame, [0, 15], [-30, 0], { extrapolateRight: 'clamp' });
  const titleOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '80px 120px',
        opacity: fadeIn * fadeOut,
      }}
    >
      <h2
        style={{
          fontFamily: theme.fonts.title,
          fontSize: theme.sizes.heading,
          fontWeight: 700,
          color: theme.colors.primary,
          marginBottom: 50,
          transform: `translateY(${titleSlide}px)`,
          opacity: titleOpacity,
          margin: '0 0 50px 0',
        }}
      >
        {visuals.title}
      </h2>
      <div>
        {visuals.items.map((item, i) => (
          <BulletItem key={i} text={item} index={i} fps={fps} />
        ))}
      </div>
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};

export default BulletListScene;
