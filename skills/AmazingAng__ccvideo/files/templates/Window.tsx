import React from 'react';
import {AbsoluteFill, Interactive} from 'remotion';
import {colors, dark, fonts, type} from './theme';

const TrafficLight: React.FC<{color: string}> = ({color}) => (
  <div
    style={{
      width: 18,
      height: 18,
      borderRadius: '50%',
      backgroundColor: color,
    }}
  />
);

// A macOS terminal window centered on the canvas.
// variant="terracotta" (default): warm canvas, slate terminal, deep shadow.
// variant="dark": near-black canvas, warm-black terminal that blends into it,
// separated only by a subtle border and titlebar (the `ant` demo look).
// Children render inside the terminal body (flex column). Pin an input +
// status bar to the bottom by putting a <div style={{flex: 1}} /> spacer
// before them.
export const TerminalWindow: React.FC<{
  title: string;
  width?: number;
  height?: number;
  variant?: 'terracotta' | 'dark';
  children: React.ReactNode;
}> = ({title, width = 1560, height = 950, variant = 'terracotta', children}) => {
  const isDark = variant === 'dark';

  return (
    <AbsoluteFill
      style={{
        backgroundColor: isDark ? dark.canvas : colors.canvas,
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Interactive.Div
        name="Terminal window"
        style={{
          width,
          height,
          borderRadius: 14,
          backgroundColor: isDark ? dark.terminal : colors.terminal,
          boxShadow: isDark
            ? '0 24px 60px rgba(0, 0, 0, 0.6)'
            : '0 40px 90px rgba(0, 0, 0, 0.38)',
          border: isDark ? `1px solid ${dark.border}` : 'none',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div
          style={{
            height: isDark ? 52 : 58,
            flexShrink: 0,
            backgroundColor: isDark ? dark.titlebar : colors.titlebar,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            paddingLeft: 22,
            paddingRight: 22,
          }}
        >
          <TrafficLight color={isDark ? dark.close : colors.close} />
          <TrafficLight color={isDark ? dark.minimize : colors.minimize} />
          <TrafficLight color={isDark ? dark.zoom : colors.zoom} />
          <div
            style={{
              flex: 1,
              textAlign: 'center',
              fontFamily: fonts.mono,
              fontSize: isDark ? 20 : type.titlebar,
              fontWeight: isDark ? 400 : 700,
              color: isDark ? dark.titlebarText : colors.titlebarText,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              // Balance the traffic lights so the title is optically centered
              marginRight: 78,
            }}
          >
            {title}
          </div>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '36px 48px 28px 48px',
            fontFamily: fonts.mono,
            fontSize: type.terminal,
            lineHeight: type.terminalLineHeight,
            color: isDark ? dark.text : colors.text,
            overflow: 'hidden',
          }}
        >
          {children}
        </div>
      </Interactive.Div>
    </AbsoluteFill>
  );
};
