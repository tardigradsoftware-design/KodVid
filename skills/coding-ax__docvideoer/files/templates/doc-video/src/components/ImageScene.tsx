import React from 'react';
import { useCurrentFrame, interpolate, spring, useVideoConfig, Audio, Img, staticFile } from 'remotion';
import type { ImageVisuals } from '../types';
import { theme } from '../theme';

interface ImageSceneProps {
  visuals: ImageVisuals;
  audioSrc?: string;
  durationInFrames: number;
}

const ImageScene: React.FC<ImageSceneProps> = ({ visuals, audioSrc, durationInFrames }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const fadeIn = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const fadeOut = interpolate(frame, [durationInFrames - 15, durationInFrames], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const imageScale = spring({ frame, fps, config: { damping: 20, mass: 0.5 } });
  const imageSrc = /^(https?:|data:|\/)/.test(visuals.imageUrl)
    ? visuals.imageUrl
    : staticFile(visuals.imageUrl);

  const captionOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: 'clamp' });
  const captionSlide = interpolate(frame, [20, 40], [30, 0], { extrapolateRight: 'clamp' });

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        background: theme.colors.background,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: fadeIn * fadeOut,
        padding: 60,
        gap: 30,
      }}
    >
      <Img
        src={imageSrc}
        style={{
          maxWidth: '85%',
          maxHeight: '70%',
          borderRadius: 16,
          transform: `scale(${imageScale})`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      />
      {visuals.caption && (
        <p
          style={{
            fontFamily: theme.fonts.body,
            fontSize: theme.sizes.subtitle,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            opacity: captionOpacity,
            transform: `translateY(${captionSlide}px)`,
            margin: 0,
          }}
        >
          {visuals.caption}
        </p>
      )}
      {audioSrc && <Audio src={audioSrc} />}
    </div>
  );
};

export default ImageScene;
