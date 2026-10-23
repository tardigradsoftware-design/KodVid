import React from 'react';
import {z} from 'zod';
import {B, C, Cm, Dim, K} from './Terminal';

// A JSON-expressible rich text segment — the bridge between capture files
// (props.json) and the styled token components.
export const segmentSchema = z.object({
  t: z.enum(['plain', 'kw', 'code', 'comment', 'dim', 'bold']),
  s: z.string(),
});

export const richLineSchema = z.array(segmentSchema);

export type Segment = z.infer<typeof segmentSchema>;

export const Rich: React.FC<{segments: Segment[]}> = ({segments}) => (
  <>
    {segments.map((seg, i) => {
      switch (seg.t) {
        case 'kw':
          return <K key={i}>{seg.s}</K>;
        case 'code':
          return <C key={i}>{seg.s}</C>;
        case 'comment':
          return <Cm key={i}>{seg.s}</Cm>;
        case 'dim':
          return <Dim key={i}>{seg.s}</Dim>;
        case 'bold':
          return <B key={i}>{seg.s}</B>;
        default:
          return <React.Fragment key={i}>{seg.s}</React.Fragment>;
      }
    })}
  </>
);
