import React from 'react';
import {useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from './theme';

export const Cursor: React.FC<{
  blink?: boolean;
  color?: string;
}> = ({blink = true, color = colors.text}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const on = blink ? Math.floor(frame / (fps * 0.55)) % 2 === 0 : true;

  return (
    <span
      style={{
        display: 'inline-block',
        width: '0.6em',
        height: '1.15em',
        verticalAlign: 'text-bottom',
        backgroundColor: color,
        opacity: on ? 1 : 0,
      }}
    />
  );
};

// Typewriter text driven by useCurrentFrame(). Reveals `text` starting at
// frame `from`, at `cps` characters per second. While typing, the cursor is
// solid; after finishing it blinks (or disappears with cursor="none").
export const TypeText: React.FC<{
  text: string;
  from: number;
  cps?: number;
  cursor?: 'block' | 'none';
  color?: string;
  style?: React.CSSProperties;
}> = ({text, from, cps = 40, cursor = 'block', color = colors.text, style}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const visible = Math.max(0, Math.floor(((frame - from) * cps) / fps));
  const done = visible >= text.length;

  return (
    <span style={{color, whiteSpace: 'pre-wrap', ...style}}>
      {text.slice(0, visible)}
      {cursor === 'block' ? <Cursor blink={done} color={color} /> : null}
    </span>
  );
};
