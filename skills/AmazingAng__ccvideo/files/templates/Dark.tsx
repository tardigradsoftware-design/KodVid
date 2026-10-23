import React from 'react';
import {
  AbsoluteFill,
  Easing,
  Interactive,
  interpolate,
  Sequence,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {z} from 'zod';
import {Rich, richLineSchema} from './Rich';
import {Line} from './Terminal';
import {Cursor, TypeText} from './Typing';
import {TerminalWindow} from './Window';
import {dark, fonts} from './theme';

// ---------------------------------------------------------------------------
// Schema — dark chaptered promo (the `ant` CLI demo grammar):
// wordmark card → [interstitial card → shell beat] per chapter → outro.
// ---------------------------------------------------------------------------

const chapterSchema = z.object({
  kicker: z.string(),
  claim: z.string(),
  command: z.string(), // typed verbatim; may contain \n continuation lines
  output: z.array(richLineSchema),
});

export const darkVideoSchema = z.object({
  wordmark: z.object({name: z.string(), tagline: z.string()}),
  windowTitle: z.string(),
  dir: z.string(), // shell cwd shown in the prompt, e.g. "~/xapi"
  chapters: z.array(chapterSchema),
  outro: z.object({name: z.string(), tagline: z.string()}),
});

export type DarkVideoProps = z.infer<typeof darkVideoSchema>;

// ---------------------------------------------------------------------------
// Timing
// ---------------------------------------------------------------------------

const CPS = 45;
const WORDMARK_FRAMES = 95;
const CARD_FRAMES = 75;
const OUTRO_FRAMES = 105;
const FADE_FRAMES = 10;

const chapterTiming = (c: z.infer<typeof chapterSchema>, fps: number) => {
  const typeStart = 10;
  const typeDur = Math.ceil((c.command.length / CPS) * fps);
  const outputStart = typeStart + typeDur + 16;
  const promptBack = outputStart + c.output.length * 15 + 14;
  return {typeStart, typeDur, outputStart, promptBack, total: promptBack + 60};
};

export const darkVideoDuration = (props: DarkVideoProps, fps: number): number => {
  const segments = [
    WORDMARK_FRAMES,
    ...props.chapters.flatMap((c) => [CARD_FRAMES, chapterTiming(c, fps).total]),
    OUTRO_FRAMES,
  ];
  const fades = segments.length - 1;
  return segments.reduce((a, b) => a + b, 0) - fades * FADE_FRAMES;
};

// ---------------------------------------------------------------------------
// Pixel logo — original chunky pixel "x" with a gold sparkle (0 empty,
// 1 accent, 2 gold). Not a copy of any existing mascot.
// ---------------------------------------------------------------------------

const PIXEL_X = [
  [1, 0, 0, 0, 0, 0, 1, 0, 2],
  [1, 1, 0, 0, 0, 1, 1, 2, 0],
  [0, 1, 1, 0, 1, 1, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 0, 1, 1, 1, 0, 0, 0, 0],
  [0, 1, 1, 0, 1, 1, 0, 0, 0],
  [1, 1, 0, 0, 0, 1, 1, 0, 0],
  [1, 0, 0, 0, 0, 0, 1, 1, 0],
];

const PixelLogo: React.FC<{cell?: number}> = ({cell = 16}) => (
  <div style={{display: 'flex', flexDirection: 'column'}}>
    {PIXEL_X.map((row, y) => (
      <div key={y} style={{display: 'flex'}}>
        {row.map((v, x) => (
          <div
            key={x}
            style={{
              width: cell,
              height: cell,
              backgroundColor:
                v === 1 ? dark.accent : v === 2 ? dark.gold : 'transparent',
            }}
          />
        ))}
      </div>
    ))}
  </div>
);

// ---------------------------------------------------------------------------
// Cards
// ---------------------------------------------------------------------------

const fadeUp = (frame: number, from: number, fps: number) => ({
  opacity: interpolate(frame, [from, from + 0.5 * fps], [0, 1], {
    extrapolateLeft: 'clamp' as const,
    extrapolateRight: 'clamp' as const,
    easing: Easing.bezier(0.16, 1, 0.3, 1),
  }),
});

export const WordmarkCard: React.FC<{
  name: string;
  tagline: string;
  logo?: boolean;
}> = ({name, tagline, logo = true}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark.canvas,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 44,
      }}
    >
      {logo ? (
        <div style={fadeUp(frame, 0, fps)}>
          <PixelLogo />
        </div>
      ) : null}
      <Interactive.Div
        name="Wordmark"
        style={{
          fontFamily: fonts.mono,
          fontSize: 190,
          fontWeight: 700,
          color: dark.accent,
          lineHeight: 1,
          ...fadeUp(frame, Math.round(0.2 * fps), fps),
        }}
      >
        {name}
      </Interactive.Div>
      <Interactive.Div
        name="Tagline"
        style={{
          fontFamily: fonts.serif,
          fontSize: 48,
          color: dark.dim,
          textAlign: 'center',
          maxWidth: 1100,
          lineHeight: 1.35,
          ...fadeUp(frame, Math.round(0.55 * fps), fps),
        }}
      >
        {tagline}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

export const InterstitialCard: React.FC<{
  kicker: string;
  claim: string;
}> = ({kicker, claim}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();

  return (
    <AbsoluteFill
      style={{
        backgroundColor: dark.canvas,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 30,
      }}
    >
      <Interactive.Div
        name="Kicker"
        style={{
          fontFamily: fonts.mono,
          fontSize: 32,
          color: dark.accent,
          letterSpacing: 2,
          ...fadeUp(frame, 0, fps),
        }}
      >
        {kicker}
      </Interactive.Div>
      <div
        style={{
          width: 64,
          height: 2,
          backgroundColor: '#3A3835',
          ...fadeUp(frame, Math.round(0.15 * fps), fps),
        }}
      />
      <Interactive.Div
        name="Claim"
        style={{
          fontFamily: fonts.serif,
          fontSize: 78,
          color: dark.serif,
          textAlign: 'center',
          maxWidth: 1500,
          lineHeight: 1.2,
          ...fadeUp(frame, Math.round(0.3 * fps), fps),
        }}
      >
        {claim}
      </Interactive.Div>
    </AbsoluteFill>
  );
};

// ---------------------------------------------------------------------------
// Shell beat — fresh dark terminal, prompt types the real command, real
// output fades in, then a new idle prompt with blinking cursor.
// ---------------------------------------------------------------------------

const ShellPrompt: React.FC<{dir: string}> = ({dir}) => (
  <>
    <span style={{color: dark.arrow}}>▶ </span>
    <span style={{color: dark.text, fontWeight: 700}}>{dir}</span>
    <span style={{color: dark.chevron}}> &gt;</span>{' '}
  </>
);

export const ShellBeat: React.FC<{
  dir: string;
  windowTitle: string;
  command: string;
  output: z.infer<typeof richLineSchema>[];
}> = ({dir, windowTitle, command, output}) => {
  const {fps} = useVideoConfig();
  const T = chapterTiming({kicker: '', claim: '', command, output}, fps);

  return (
    <TerminalWindow title={windowTitle} variant="dark" width={1860} height={1010}>
      <div style={{whiteSpace: 'pre-wrap'}}>
        <ShellPrompt dir={dir} />
        <TypeText text={command} from={T.typeStart} cps={CPS} color={dark.text} />
      </div>
      <Sequence from={T.outputStart} layout="none">
        <div style={{marginTop: '0.8em'}}>
          {output.map((l, i) => (
            <Line key={i} from={i * 15}>
              <Rich segments={l} />
            </Line>
          ))}
        </div>
      </Sequence>
      <Sequence from={T.promptBack} layout="none">
        <Line from={0} style={{marginTop: '0.8em'}}>
          <ShellPrompt dir={dir} />
          <Cursor color={dark.text} />
        </Line>
      </Sequence>
    </TerminalWindow>
  );
};

// ---------------------------------------------------------------------------
// DarkVideo — the full chaptered promo.
// ---------------------------------------------------------------------------

const xfade = (
  <TransitionSeries.Transition
    presentation={fade()}
    timing={linearTiming({durationInFrames: FADE_FRAMES})}
  />
);

export const DarkVideo: React.FC<DarkVideoProps> = (props) => {
  const {fps} = useVideoConfig();

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={WORDMARK_FRAMES} name="Wordmark">
        <WordmarkCard name={props.wordmark.name} tagline={props.wordmark.tagline} />
      </TransitionSeries.Sequence>
      {props.chapters.flatMap((c, i) => [
        <React.Fragment key={`t${i}`}>{xfade}</React.Fragment>,
        <TransitionSeries.Sequence
          key={`card${i}`}
          durationInFrames={CARD_FRAMES}
          name={`Card ${i + 1}`}
        >
          <InterstitialCard kicker={c.kicker} claim={c.claim} />
        </TransitionSeries.Sequence>,
        <React.Fragment key={`t2${i}`}>{xfade}</React.Fragment>,
        <TransitionSeries.Sequence
          key={`shell${i}`}
          durationInFrames={chapterTiming(c, fps).total}
          name={`Shell ${i + 1}`}
        >
          <ShellBeat
            dir={props.dir}
            windowTitle={props.windowTitle}
            command={c.command}
            output={c.output}
          />
        </TransitionSeries.Sequence>,
      ])}
      {xfade}
      <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES} name="Outro">
        <WordmarkCard
          name={props.outro.name}
          tagline={props.outro.tagline}
          logo={false}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
