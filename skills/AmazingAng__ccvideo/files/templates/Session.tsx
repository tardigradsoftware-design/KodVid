import React from 'react';
import {Sequence, useCurrentFrame, useVideoConfig} from 'remotion';
import {linearTiming, TransitionSeries} from '@remotion/transitions';
import {fade} from '@remotion/transitions/fade';
import {z} from 'zod';
import {Rich, richLineSchema} from './Rich';
import {
  AlertLine,
  B,
  CodeBlock,
  Dim,
  InputBox,
  Line,
  PromptEcho,
  SessionHeader,
  StatusBar,
  Thinking,
  ToolChild,
  ToolLine,
} from './Terminal';
import {CutZoom} from './Camera';
import {TerminalWindow} from './Window';
import {TitleCard} from './Cards';

// ---------------------------------------------------------------------------
// Schema — the JSON contract between capture scripts and the renderer.
// Everything shown in a session scene must arrive through these props.
// ---------------------------------------------------------------------------

const codeBeat = z.object({
  kind: z.literal('code'),
  lines: z.array(richLineSchema),
  expandNote: z.string(),
});

const toolBeat = z.object({
  kind: z.literal('tool'),
  line: richLineSchema,
  children: z.array(richLineSchema).optional(),
});

const runBeat = z.object({
  kind: z.literal('run'),
  command: richLineSchema,
  output: z.array(richLineSchema),
});

const summaryBeat = z.object({
  kind: z.literal('summary'),
  heading: z.string(),
  bullets: z.array(richLineSchema),
});

// Rich prose block — headings, numbered items, explanation lines.
const answerBeat = z.object({
  kind: z.literal('answer'),
  lines: z.array(richLineSchema),
});

// Highlighted red-tint row, e.g. a background review surfacing a finding.
const alertBeat = z.object({
  kind: z.literal('alert'),
  line: richLineSchema,
});

export const sessionSchema = z.object({
  windowTitle: z.string(),
  windowTitleIdle: z.string().optional(),
  header: z
    .object({version: z.string(), modelLine: z.string()})
    .optional(),
  // Optional pre-prompt step (e.g. installing a skill/CLI) shown in the
  // transcript before the prompt is typed — as if run in a prior turn.
  setup: z
    .object({command: richLineSchema, output: z.array(richLineSchema)})
    .optional(),
  prompt: z.string(),
  thinkingWord: z.string(),
  thinkingTip: z.string().optional(),
  // Real token count from a capture; omit to show elapsed seconds only.
  thinkingTokens: z.number().optional(),
  beats: z.array(
    z.discriminatedUnion('kind', [
      codeBeat,
      toolBeat,
      runBeat,
      summaryBeat,
      answerBeat,
      alertBeat,
    ]),
  ),
});

export type SessionProps = z.infer<typeof sessionSchema>;

const cardSchema = z.object({
  title: z.string(),
  subtitle: z.string(),
});

export const groundedVideoSchema = z.object({
  intro: cardSchema,
  session: sessionSchema,
  outro: cardSchema,
});

export type GroundedVideoProps = z.infer<typeof groundedVideoSchema>;

// ---------------------------------------------------------------------------
// Timing — a pure function of the content, so composition duration can be
// derived via calculateMetadata and beats never overrun the scene.
// ---------------------------------------------------------------------------

const CPS = 38;

export const sessionTiming = (props: SessionProps, fps: number) => {
  const setupStart = props.setup ? 12 : 0;
  const setupDur = props.setup
    ? 16 + props.setup.output.length * 14 + 24
    : 0;
  const typeStart = setupStart + setupDur + Math.round(0.66 * fps);
  const typeDur = Math.ceil((props.prompt.length / CPS) * fps);
  const submit = typeStart + typeDur + 18;
  const thinkStart = submit + 5;
  const thinkDur = 60;

  let t = thinkStart + thinkDur;
  const beatStarts: number[] = [];
  for (const b of props.beats) {
    beatStarts.push(t);
    if (b.kind === 'code') t += (b.lines.length + 1) * 4 + 30;
    else if (b.kind === 'tool') t += 35 + (b.children?.length ?? 0) * 12;
    else if (b.kind === 'run') t += 20 + b.output.length * 18 + 50;
    else if (b.kind === 'answer') t += 12 + b.lines.length * 6 + 25;
    else if (b.kind === 'alert') t += 40;
    else t += 15 + b.bullets.length * 15 + 20;
  }

  return {
    setupStart,
    typeStart,
    typeDur,
    submit,
    thinkStart,
    thinkDur,
    beatStarts,
    total: t + 100,
  };
};

const INTRO_FRAMES = 100;
const OUTRO_FRAMES = 110;
const FADE_FRAMES = 12;

export const groundedVideoDuration = (
  props: GroundedVideoProps,
  fps: number,
): number =>
  INTRO_FRAMES +
  sessionTiming(props.session, fps).total +
  OUTRO_FRAMES -
  2 * FADE_FRAMES;

// Rows the transcript will occupy at the final beat, including inter-beat
// margins and an allowance for long lines wrapping (~90 chars per row).
// Used to warn (at render time, frame 0 only) before content clips.
const lineRows = (segs: {s: string}[]): number =>
  Math.max(1, Math.ceil(segs.reduce((n, seg) => n + seg.s.length, 0) / 90));

const estimateRows = (props: SessionProps): number => {
  let rows = 1; // prompt echo
  if (props.header) rows += 3.2;
  if (props.setup) rows += 1.8 + props.setup.output.length;
  for (const b of props.beats) {
    rows += 0.8; // marginTop of each beat
    if (b.kind === 'code') rows += b.lines.length + 1;
    else if (b.kind === 'tool')
      rows += lineRows(b.line) + (b.children?.length ?? 0);
    else if (b.kind === 'run')
      rows += 1 + b.output.reduce((n, l) => n + lineRows(l), 0);
    else if (b.kind === 'answer')
      rows += b.lines.reduce((n, l) => n + lineRows(l), 0);
    else if (b.kind === 'alert') rows += lineRows(b.line);
    else rows += 1.6 + b.bullets.reduce((n, l) => n + lineRows(l), 0);
  }
  return Math.round(rows);
};

// ---------------------------------------------------------------------------
// DataSession — renders any sessionSchema value in the house style.
// Locked-off camera, fade-in-only lines, fixed-height spinner slot.
// ---------------------------------------------------------------------------

export const DataSession: React.FC<SessionProps> = (props) => {
  const {fps} = useVideoConfig();
  const frame = useCurrentFrame();
  const T = sessionTiming(props, fps);

  if (frame === 0 && estimateRows(props) > 15) {
    console.warn(
      `[ccvideo] Session content is ${estimateRows(props)} rows — more than ~15 will clip inside the terminal window. Trim beats or raise the window height.`,
    );
  }

  // Camera: brief eased push into the run beat's output, eased pull back
  // just before the next beat. Locked between moves; same origin both ways
  // so the pull-out doesn't read as a lateral slide.
  const runIdx = props.beats.findIndex((b) => b.kind === 'run');
  const cuts: {from: number; scale?: number; origin?: string; ease?: number}[] =
    [{from: 0}];
  if (runIdx >= 0) {
    // Consecutive run beats share one framing: pull back only after the last.
    let lastRun = runIdx;
    while (
      lastRun + 1 < props.beats.length &&
      props.beats[lastRun + 1].kind === 'run'
    ) {
      lastRun++;
    }
    const zoomOutAt =
      (lastRun + 1 < props.beats.length
        ? T.beatStarts[lastRun + 1]
        : T.beatStarts[lastRun] + 160) - 10;
    cuts.push({
      from: T.beatStarts[runIdx] + 10,
      scale: 1.25,
      origin: '32% 26%',
      ease: 18,
    });
    cuts.push({from: zoomOutAt, scale: 1, origin: '32% 26%', ease: 22});
  }

  return (
    <CutZoom cuts={cuts}>
      <TerminalWindow
        title={
          frame < T.submit
            ? (props.windowTitleIdle ?? props.windowTitle)
            : props.windowTitle
        }
        height={props.header ? 1010 : 950}
      >
        {props.header ? (
          <SessionHeader
            version={props.header.version}
            modelLine={props.header.modelLine}
          />
        ) : null}
        <div style={{flex: 1, overflow: 'hidden'}}>
          {props.setup ? (
            <Sequence from={T.setupStart} layout="none">
              <ToolLine from={0}>
                <Rich segments={props.setup.command} />
              </ToolLine>
              {props.setup.output.map((l, j) => (
                <ToolChild key={j} from={12 + j * 14}>
                  <Rich segments={l} />
                </ToolChild>
              ))}
            </Sequence>
          ) : null}
          <Sequence from={T.submit} layout="none">
            <PromptEcho>
              <Dim>&gt; </Dim>
              {props.prompt}
            </PromptEcho>
          </Sequence>
          {props.beats.map((b, i) => (
            <Sequence key={i} from={T.beatStarts[i]} layout="none">
              {b.kind === 'code' ? (
                <CodeBlock
                  from={0}
                  stagger={4}
                  lines={b.lines.map((l, j) => (
                    <Rich key={j} segments={l} />
                  ))}
                  expandNote={b.expandNote}
                />
              ) : b.kind === 'tool' ? (
                <>
                  <ToolLine from={0}>
                    <Rich segments={b.line} />
                  </ToolLine>
                  {(b.children ?? []).map((l, j) => (
                    <ToolChild key={j} from={8 + j * 10}>
                      <Rich segments={l} />
                    </ToolChild>
                  ))}
                </>
              ) : b.kind === 'run' ? (
                <>
                  <ToolLine from={0}>
                    <Rich segments={b.command} />
                  </ToolLine>
                  {b.output.map((l, j) => (
                    <Line
                      key={j}
                      from={12 + j * 18}
                      style={{paddingLeft: j === 0 ? 42 : 76}}
                    >
                      {j === 0 ? <Dim>⎿ </Dim> : null}
                      <Rich segments={l} />
                    </Line>
                  ))}
                </>
              ) : b.kind === 'answer' ? (
                <div style={{marginTop: '0.8em'}}>
                  {b.lines.map((l, j) => (
                    <Line key={j} from={j * 6} style={{paddingLeft: 42}}>
                      <Rich segments={l} />
                    </Line>
                  ))}
                </div>
              ) : b.kind === 'alert' ? (
                <AlertLine from={0}>
                  <Rich segments={b.line} />
                </AlertLine>
              ) : (
                <>
                  <Line from={0} style={{marginTop: '0.8em'}}>
                    <B>{b.heading}</B>
                  </Line>
                  {b.bullets.map((l, j) => (
                    <Line
                      key={j}
                      from={15 + j * 15}
                      style={j === 0 ? {marginTop: '0.6em'} : undefined}
                    >
                      - <Rich segments={l} />
                    </Line>
                  ))}
                </>
              )}
            </Sequence>
          ))}
        </div>
        <div
          style={{
            height: props.thinkingTip ? '3.3em' : '1.65em',
            flexShrink: 0,
          }}
        >
          <Sequence from={T.thinkStart} durationInFrames={T.thinkDur} layout="none">
            <Thinking
              word={props.thinkingWord}
              stats
              tokens={props.thinkingTokens}
              tip={props.thinkingTip}
              until={T.thinkDur}
            />
          </Sequence>
        </div>
        <Sequence durationInFrames={T.submit} layout="none">
          <InputBox typedText={props.prompt} from={T.typeStart} cps={CPS} />
        </Sequence>
        <Sequence from={T.submit} layout="none">
          <InputBox />
        </Sequence>
        <StatusBar hint={frame >= T.submit ? 'esc to interrupt' : null} />
      </TerminalWindow>
    </CutZoom>
  );
};

// ---------------------------------------------------------------------------
// GroundedVideo — intro card → data-driven session → outro card.
// The complete promo, rendered entirely from a captures/<name>/props.json.
// ---------------------------------------------------------------------------

export const GroundedVideo: React.FC<GroundedVideoProps> = (props) => {
  const {fps} = useVideoConfig();
  const sessionFrames = sessionTiming(props.session, fps).total;

  return (
    <TransitionSeries>
      <TransitionSeries.Sequence durationInFrames={INTRO_FRAMES} name="Intro">
        <TitleCard title={props.intro.title} subtitle={props.intro.subtitle} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: FADE_FRAMES})}
      />
      <TransitionSeries.Sequence durationInFrames={sessionFrames} name="Session">
        <DataSession {...props.session} />
      </TransitionSeries.Sequence>
      <TransitionSeries.Transition
        presentation={fade()}
        timing={linearTiming({durationInFrames: FADE_FRAMES})}
      />
      <TransitionSeries.Sequence durationInFrames={OUTRO_FRAMES} name="Outro">
        <TitleCard
          title={props.outro.title}
          subtitle={props.outro.subtitle}
          titleSize={168}
        />
      </TransitionSeries.Sequence>
    </TransitionSeries>
  );
};
