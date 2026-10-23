import { registerRoot, Composition } from 'remotion';
import Root from './Root';
import type { Storyboard, AudioTrack } from './types';

const defaultStoryboard: Storyboard = {
  title: '示例视频',
  description: '这是一个示例视频',
  totalDuration: 30,
  scenes: [
    {
      id: 'scene-1',
      type: 'title',
      title: '标题场景',
      narration: '',
      duration: 5,
      visuals: { type: 'title', title: '欢迎', subtitle: '示例视频' },
    },
    {
      id: 'scene-2',
      type: 'end',
      title: '结尾',
      narration: '',
      duration: 5,
      visuals: { type: 'end', title: '感谢观看', summary: [] },
    },
  ],
};

const defaultAudio: AudioTrack[] = [];

const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="DocVideo"
      component={Root as unknown as React.FC<Record<string, unknown>>}
      durationInFrames={30 * 30}
      fps={30}
      width={1920}
      height={1080}
      defaultProps={{
        storyboard: defaultStoryboard,
        audioTracks: defaultAudio,
      }}
    />
  );
};

registerRoot(RemotionRoot);
