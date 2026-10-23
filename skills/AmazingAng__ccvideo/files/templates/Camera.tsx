import React from 'react';
import {
  AbsoluteFill,
  Easing,
  interpolate,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

// Camera moves between static framings — the only camera movement allowed on
// terminal scenes. Each framing change is a brief, strongly-eased push
// (~0.6 s), then the camera is locked again. Sustained slow zooms stay
// banned: text may only be mid-scale during a deliberate, fast move.
export type Framing = {
  from: number;
  scale?: number;
  origin?: string;
  ease?: number; // frames the move takes (default 18)
};

export const CutZoom: React.FC<{
  cuts: Framing[];
  children: React.ReactNode;
}> = ({cuts, children}) => {
  const frame = useCurrentFrame();
  const sorted = [...cuts].sort((a, b) => a.from - b.from);
  let idx = 0;
  for (let i = 0; i < sorted.length; i++) {
    if (frame >= sorted[i].from) idx = i;
  }
  const cur = sorted[idx] ?? ({from: 0} as Framing);
  const prev = sorted[idx - 1] ?? cur;
  const ease = cur.ease ?? 18;

  return (
    <AbsoluteFill
      style={{
        scale: String(
          interpolate(
            frame,
            [cur.from, cur.from + ease],
            [prev.scale ?? 1, cur.scale ?? 1],
            {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
              easing: Easing.bezier(0.45, 0, 0.22, 1),
            },
          ),
        ),
        transformOrigin: interpolate(
          frame,
          [cur.from, cur.from + ease],
          [prev.origin ?? '50% 50%', cur.origin ?? '50% 50%'],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
            easing: Easing.bezier(0.45, 0, 0.22, 1),
          },
        ),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Slow push-in over the whole scene — the signature "living camera" of the
// Claude promo style. Keep the range very subtle: fractional scaling of live
// text causes subpixel swim, so 1.0 → 1.015 is the ceiling.
export const SlowZoom: React.FC<{
  from?: number;
  to?: number;
  children: React.ReactNode;
}> = ({from = 1, to = 1.015, children}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        scale: interpolate(frame, [0, durationInFrames], [from, to], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          output: 'perceptual-scale',
        }),
      }}
    >
      {children}
    </AbsoluteFill>
  );
};
