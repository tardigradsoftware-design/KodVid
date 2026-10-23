import React from 'react';
import {Easing, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from './theme';
import {Cursor, TypeText} from './Typing';

// ---------------------------------------------------------------------------
// Inline token helpers — color spans matching the Claude Code theme.
// ---------------------------------------------------------------------------

export const K: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: colors.keyword}}>{children}</span>
);

export const C: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: colors.code}}>{children}</span>
);

export const Cm: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: colors.comment}}>{children}</span>
);

export const Dim: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: colors.dim}}>{children}</span>
);

export const B: React.FC<{children: React.ReactNode}> = ({children}) => (
  <span style={{color: colors.text, fontWeight: 700}}>{children}</span>
);

// ---------------------------------------------------------------------------
// SessionHeader — the Claude Code welcome block: pixel logo, version line,
// model/cwd line, hairline rule. Anchors every frame of a session scene.
// ---------------------------------------------------------------------------

// Chunky pixel face approximating the Claude Code mark (1 body, 2 dark).
const PIXEL_FACE = [
  [0, 1, 1, 0, 0, 0, 0, 0, 0],
  [1, 1, 1, 1, 1, 1, 1, 1, 0],
  [1, 2, 1, 1, 1, 1, 2, 1, 1],
  [1, 2, 1, 1, 1, 1, 2, 1, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 0],
  [0, 1, 0, 1, 0, 1, 0, 1, 0],
];

export const SessionHeader: React.FC<{
  version: string;
  modelLine: string;
}> = ({version, modelLine}) => (
  <div
    style={{
      display: 'flex',
      gap: 24,
      alignItems: 'flex-start',
      paddingBottom: 12,
      marginBottom: 14,
      borderBottom: `2px solid ${colors.lineNo}33`,
      flexShrink: 0,
    }}
  >
    <div style={{display: 'flex', flexDirection: 'column', paddingTop: 4}}>
      {PIXEL_FACE.map((row, y) => (
        <div key={y} style={{display: 'flex'}}>
          {row.map((v, x) => (
            <div
              key={x}
              style={{
                width: 9,
                height: 9,
                backgroundColor:
                  v === 1 ? colors.canvas : v === 2 ? '#4A2418' : 'transparent',
              }}
            />
          ))}
        </div>
      ))}
    </div>
    <div>
      <div>
        <B>Claude Code</B> <span style={{color: colors.canvas}}>{version}</span>
      </div>
      <Dim>{modelLine}</Dim>
    </div>
  </div>
);

// ---------------------------------------------------------------------------
// PromptEcho — the submitted user message as a subtly highlighted block.
// ---------------------------------------------------------------------------

export const PromptEcho: React.FC<{children: React.ReactNode}> = ({children}) => (
  <div
    style={{
      backgroundColor: '#383944',
      borderRadius: 3,
      padding: '4px 16px',
      marginLeft: -16,
      marginRight: -16,
      marginTop: '0.5em',
      whiteSpace: 'pre-wrap',
    }}
  >
    {children}
  </div>
);

// ---------------------------------------------------------------------------
// AlertLine — a highlighted red-tint row, e.g. a background review surfacing
// something mid-session.
// ---------------------------------------------------------------------------

export const AlertLine: React.FC<{
  from?: number;
  children: React.ReactNode;
}> = ({from = 0, children}) => (
  <Line from={from} style={{display: 'flex', gap: 18, marginTop: '0.8em'}}>
    <span style={{color: colors.text, flexShrink: 0}}>●</span>
    <span
      style={{
        backgroundColor: '#7A3D33',
        borderRadius: 2,
        padding: '0 8px',
        marginLeft: -8,
        whiteSpace: 'pre-wrap',
      }}
    >
      {children}
    </span>
  </Line>
);

// ---------------------------------------------------------------------------
// ToolChild — a "⎿" child row under a ToolLine (file names, tips).
// ---------------------------------------------------------------------------

export const ToolChild: React.FC<{
  from?: number;
  children: React.ReactNode;
}> = ({from = 0, children}) => (
  <Line from={from} style={{paddingLeft: 42, display: 'flex', gap: 12}}>
    <Dim>⎿</Dim>
    <span style={{whiteSpace: 'pre-wrap', color: colors.dim}}>{children}</span>
  </Line>
);

// ---------------------------------------------------------------------------
// Line — one row of terminal output. Fade-in only: any positional entrance
// would make the transcript appear to drift as lines stream in.
// ---------------------------------------------------------------------------

export const Line: React.FC<{
  from?: number;
  style?: React.CSSProperties;
  children?: React.ReactNode;
}> = ({from = 0, style, children}) => {
  const frame = useCurrentFrame();

  return (
    <div
      style={{
        opacity: interpolate(frame, [from, from + 8], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.bezier(0.16, 1, 0.3, 1),
        }),
        minHeight: '1.65em',
        whiteSpace: 'pre-wrap',
        ...style,
      }}
    >
      {children}
    </div>
  );
};

// ---------------------------------------------------------------------------
// ToolLine — "● Created /path — description" style bullet.
// ---------------------------------------------------------------------------

export const ToolLine: React.FC<{
  from: number;
  bullet?: string;
  bulletColor?: string;
  children: React.ReactNode;
}> = ({from, bullet = '●', bulletColor = colors.text, children}) => (
  <Line from={from} style={{display: 'flex', gap: 18, marginTop: '0.8em'}}>
    <span style={{color: bulletColor, flexShrink: 0}}>{bullet}</span>
    <span style={{whiteSpace: 'pre-wrap'}}>{children}</span>
  </Line>
);

// ---------------------------------------------------------------------------
// Thinking — "✻ Cogitating… (esc to interrupt)" with animated dots.
//
// Place it in a fixed-height slot between the transcript and the <InputBox>
// (like the real Claude Code spinner), never inside the transcript flow —
// otherwise its disappearance reflows every line below it. Pass `until`
// (frames, relative to mount) to fade it out in place.
// ---------------------------------------------------------------------------

const fmtTokens = (n: number): string =>
  n >= 1000 ? `${(n / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(n);

export const Thinking: React.FC<{
  from?: number;
  until?: number;
  word?: string;
  detail?: string;
  stats?: boolean;
  // Real token count from a capture. Displayed as a ramp up to this value;
  // never invented — when absent, only elapsed seconds are shown.
  tokens?: number;
  tip?: string;
}> = ({from = 0, until, word = 'Thinking', detail, stats = false, tokens, tip}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const dots = '.'.repeat((Math.floor(((frame - from) * 3) / fps) % 3) + 1);
  const secs = Math.max(0, Math.floor((frame - from) / fps));
  const shownTokens =
    tokens === undefined
      ? undefined
      : Math.round(
          tokens *
            Math.min(1, Math.max(0, (frame - from) / Math.max(1, (until ?? 75) - 8))),
        );

  const fadeOut =
    until === undefined
      ? 1
      : interpolate(frame, [until - 6, until], [1, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });

  return (
    <>
      <Line from={from}>
        <span style={{opacity: fadeOut}}>
          <span style={{color: colors.canvas}}>✻ </span>
          <span style={{color: colors.canvas}}>
            {word}
            <span style={{display: 'inline-block', width: '3ch'}}>{dots}</span>
          </span>
          <Dim>
            {stats
              ? shownTokens === undefined
                ? ` (${secs}s)`
                : ` (${secs}s · ↓ ${fmtTokens(shownTokens)} tokens)`
              : detail
                ? ` ${detail}`
                : ''}
          </Dim>
        </span>
      </Line>
      {tip ? (
        <Line from={from}>
          <span style={{opacity: fadeOut, display: 'flex', gap: 12, paddingLeft: 14}}>
            <Dim>⎿</Dim>
            <Dim>Tip: {tip}</Dim>
          </span>
        </Line>
      ) : null}
    </>
  );
};

// ---------------------------------------------------------------------------
// CodeBlock — line-numbered source listing, lines revealed with a stagger.
// ---------------------------------------------------------------------------

export const CodeBlock: React.FC<{
  from: number;
  stagger?: number;
  startLineNo?: number;
  lines: React.ReactNode[];
  expandNote?: string;
}> = ({from, stagger = 3, startLineNo = 1, lines, expandNote}) => (
  <div style={{marginTop: '0.8em'}}>
    {lines.map((line, i) => (
      <Line key={i} from={from + i * stagger} style={{display: 'flex'}}>
        <span
          style={{
            color: colors.lineNo,
            width: '3.2em',
            textAlign: 'right',
            paddingRight: '1.2em',
            flexShrink: 0,
          }}
        >
          {startLineNo + i}
        </span>
        <span style={{whiteSpace: 'pre-wrap'}}>{line}</span>
      </Line>
    ))}
    {expandNote ? (
      <Line
        from={from + lines.length * stagger}
        style={{display: 'flex'}}
      >
        <span
          style={{
            color: colors.lineNo,
            width: '3.2em',
            textAlign: 'right',
            paddingRight: '1.2em',
            flexShrink: 0,
          }}
        >
          …
        </span>
        <Dim>{expandNote}</Dim>
      </Line>
    ) : null}
  </div>
);

// ---------------------------------------------------------------------------
// InputBox — the "> " prompt row with optional typewriter text.
// ---------------------------------------------------------------------------

export const InputBox: React.FC<{
  typedText?: string;
  from?: number;
  cps?: number;
}> = ({typedText, from = 0, cps = 40}) => (
  <div
    style={{
      borderTop: `2px solid ${colors.lineNo}44`,
      marginTop: 20,
      paddingTop: 16,
      display: 'flex',
      gap: 16,
    }}
  >
    <span style={{color: colors.dim}}>&gt;</span>
    <span style={{flex: 1, whiteSpace: 'pre-wrap'}}>
      {typedText ? (
        <TypeText text={typedText} from={from} cps={cps} />
      ) : (
        <Cursor />
      )}
    </span>
  </div>
);

// ---------------------------------------------------------------------------
// StatusBar — "⏵⏵ auto mode on (shift+tab to cycle) · esc to interrupt"
// ---------------------------------------------------------------------------

export const StatusBar: React.FC<{
  mode?: string;
  hint?: string | null;
}> = ({mode = 'auto mode on (shift+tab to cycle)', hint = null}) => (
  <div style={{display: 'flex', gap: 14, marginTop: 14, fontSize: '0.92em'}}>
    <span style={{color: colors.gold}}>⏵⏵</span>
    <span style={{color: colors.dim}}>
      {mode}
      {hint ? ` · ${hint}` : ''}
    </span>
  </div>
);
