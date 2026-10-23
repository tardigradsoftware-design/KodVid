import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {colors, fonts, type} from './theme';

// Full-bleed terracotta card with a serif headline — used for intros,
// section breaks and end cards, matching the Claude promo look.
export const TitleCard: React.FC<{
  title: string;
  subtitle?: string;
  titleSize?: number;
}> = ({title, subtitle, titleSize = type.headline}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: colors.canvas,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 34,
        paddingLeft: 160,
        paddingRight: 160,
      }}
    >
      <Interactive.Div
        name="Headline"
        style={{
          fontFamily: fonts.serif,
          fontSize: titleSize,
          fontWeight: 600,
          color: '#1F1508',
          textAlign: 'center',
          lineHeight: 1.15,
          opacity: interpolate(frame, [0, 0.7 * fps], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.16, 1, 0.3, 1),
          }),
          translate: interpolate(
            frame,
            [0, 0.7 * fps],
            ['0px 26px', '0px 0px'],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            },
          ),
        }}
      >
        {title}
      </Interactive.Div>
      {subtitle ? (
        <Interactive.Div
          name="Subtitle"
          style={{
            fontFamily: fonts.mono,
            fontSize: type.subtitle,
            color: 'rgba(31, 21, 8, 0.68)',
            textAlign: 'center',
            opacity: interpolate(frame, [0.4 * fps, 1.1 * fps], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.16, 1, 0.3, 1),
            }),
            translate: interpolate(
              frame,
              [0.4 * fps, 1.1 * fps],
              ['0px 20px', '0px 0px'],
              {
                extrapolateLeft: 'clamp',
                extrapolateRight: 'clamp',
                easing: Easing.bezier(0.16, 1, 0.3, 1),
              },
            ),
          }}
        >
          {subtitle}
        </Interactive.Div>
      ) : null}
    </AbsoluteFill>
  );
};
