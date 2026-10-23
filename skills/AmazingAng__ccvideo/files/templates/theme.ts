import {loadFont as loadMono} from '@remotion/google-fonts/JetBrainsMono';
import {loadFont as loadSerif} from '@remotion/google-fonts/SourceSerif4';
import {loadFont as loadCjk} from '@remotion/google-fonts/NotoSansSC';

const mono = loadMono('normal', {
  weights: ['400', '700'],
  subsets: ['latin'],
});

const serif = loadSerif('normal', {
  weights: ['400', '600'],
  subsets: ['latin'],
});

// CJK fallback — JetBrains Mono and Source Serif 4 have no Chinese glyphs,
// and transcript-driven videos may carry Chinese prompts. CJK fonts ship as
// many unicode-range slices; browsers only fetch slices actually used, but
// limit weights and silence the request-count warning.
const cjk = loadCjk('normal', {
  weights: ['400'],
  ignoreTooManyRequestsWarning: true,
});

export const fonts = {
  mono: `${mono.fontFamily}, ${cjk.fontFamily}`,
  serif: `${serif.fontFamily}, ${cjk.fontFamily}`,
};

// Palette sampled from Claude video team promo footage.
export const colors = {
  // Canvas
  canvas: '#CC7D5D',
  canvasDeep: '#C06F4F',

  // Terminal window
  terminal: '#2B2C36',
  titlebar: '#3A3634',
  titlebarText: '#A9A4A3',
  windowBorder: 'rgba(0, 0, 0, 0.35)',

  // Text
  text: '#E3E4EB',
  dim: '#9899A1',
  comment: '#6C6E6A',
  lineNo: '#83848C',

  // Syntax / accents
  keyword: '#85BEC5',
  code: '#B8B9F2',
  gold: '#F2C43D',
  green: '#4EBA65',
  red: '#E5695E',

  // Traffic lights
  close: '#FF5F57',
  minimize: '#FEBC2E',
  zoom: '#28C840',
};

// Dark variant — sampled from the official `ant` CLI demo. Same brand family:
// its accent is the terracotta that serves as the light theme's canvas.
export const dark = {
  canvas: '#0B0B0B',
  terminal: '#181716',
  titlebar: '#232522',
  titlebarText: '#8A8A86',
  border: '#2E2C2A',

  text: '#CFCBC5',
  serif: '#D6D4CF',
  dim: '#A1A09D',
  comment: '#6E6D69',

  accent: '#D97656',
  arrow: '#8B92C9',
  chevron: '#5FA97B',
  gold: '#E8B64C',

  close: '#B0473F',
  minimize: '#B08A2E',
  zoom: '#3E7A46',
};

// Type scale for 1920x1080 compositions. Scale linearly for other widths.
export const type = {
  headline: 132,
  subtitle: 52,
  terminal: 26,
  terminalLineHeight: 1.65,
  titlebar: 22,
};
