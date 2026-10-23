import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Audio } from 'remotion';
import type { EndVisuals } from '../types';
import { theme } from '../theme';

interface EndSceneProps {
  visuals: EndVisuals;
  audioSrc?: string;
  durationInFrames: number;
}

const EndScene: React.FC<EndSceneProps> = ({ visuals, audioSrc, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: 'clamp' });

  const titleScale = spring({ frame, fps, config: { damping: 12, mass: 0.5 } });
  const summarySpring = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 15 } });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: `linear-gradient(135deg, #0a0a1a 0%, ${theme.colors.primary}33 50%, #0a0a1a 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn,
        gap: 40,
      }}
    >
      <h2
        style={{
          fontFamily: theme.fonts.title,
          fontSize: theme.sizes.heading,
          fontWeight: 700,
          color: theme.colors.white,
          transform: `scale(${titleScale})`,
          margin: 0,
        }}
      >
        {visuals.title}
      </h2>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          opacity: summarySpring,
          transform: `translateY(${interpolate(summarySpring, [0, 1], [30, 0])}px)`,
        }}
      >
        {visuals.summary.map((item, i) => (
          <div
            key={i}
            style={{
              fontFamily: theme.fonts.body,
              fontSize: theme.sizes.body,
              color: theme.colors.textSecondary,
              textAlign: 'center',
            }}
          >
            {item}
          </div>
        ))}
      </div>

      {/* 底部装饰线 */}
      <div
        style={{
          position: 'absolute',
          bottom: 60,
          width: interpolate(frame, [10, 40], [0, 200], { extrapolateRight: 'clamp' }),
          height: 3,
          background: `linear-gradient(90deg, transparent, ${theme.colors.primary}, transparent)`,
          borderRadius: 2,
        }}
      />

      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};

export default EndScene;
