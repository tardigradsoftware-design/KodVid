import React from 'react';
import { Sequence, useVideoConfig } from 'remotion';
import type { Storyboard, AudioTrack } from './types';
import TitleScene from './components/TitleScene';
import ContentScene from './components/ContentScene';
import BulletListScene from './components/BulletListScene';
import ImageScene from './components/ImageScene';
import EndScene from './components/EndScene';
import SubtitleOverlay from './components/SubtitleOverlay';

interface RootProps {
  storyboard: Storyboard;
  audioTracks: AudioTrack[];
}

const SceneRenderer: React.FC<{
  scene: Storyboard['scenes'][0];
  audioTrack?: AudioTrack;
  fps: number;
}> = ({ scene, audioTrack, fps }) => {
  const durationInFrames = Math.round(scene.duration * fps);
  const audioSrc = audioTrack?.src;
  const subtitles = audioTrack?.subtitles;

  const sceneElement = (() => {
    switch (scene.type) {
      case 'title':
        return (
          <TitleScene
            visuals={scene.visuals as any}
            audioSrc={audioSrc}
            durationInFrames={durationInFrames}
          />
        );
      case 'content':
        return (
          <ContentScene
            visuals={scene.visuals as any}
            audioSrc={audioSrc}
            durationInFrames={durationInFrames}
          />
        );
      case 'bullet':
        return (
          <BulletListScene
            visuals={scene.visuals as any}
            audioSrc={audioSrc}
            durationInFrames={durationInFrames}
          />
        );
      case 'image':
        return (
          <ImageScene
            visuals={scene.visuals as any}
            audioSrc={audioSrc}
            durationInFrames={durationInFrames}
          />
        );
      case 'end':
        return (
          <EndScene
            visuals={scene.visuals as any}
            audioSrc={audioSrc}
            durationInFrames={durationInFrames}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {sceneElement}
      {subtitles && subtitles.length > 0 && <SubtitleOverlay subtitles={subtitles} />}
    </div>
  );
};

const Root: React.FC<RootProps> = ({ storyboard, audioTracks }) => {
  const { fps } = useVideoConfig();

  const audioMap = new Map(audioTracks.map((t) => [t.sceneId, t]));

  let currentFrame = 0;
  const sequences: Array<{ from: number; duration: number; scene: Storyboard['scenes'][0]; audio?: AudioTrack }> = [];

  for (const scene of storyboard.scenes) {
    const durationInFrames = Math.round(scene.duration * fps);
    sequences.push({
      from: currentFrame,
      duration: durationInFrames,
      scene,
      audio: audioMap.get(scene.id),
    });
    currentFrame += durationInFrames;
  }

  return (
    <div
      style={{
        width: 1920,
        height: 1080,
        background: '#0a0a1a',
        fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
      }}
    >
      {sequences.map(({ from, duration, scene, audio }) => (
        <Sequence key={scene.id} from={from} durationInFrames={duration}>
          <SceneRenderer scene={scene} audioTrack={audio} fps={fps} />
        </Sequence>
      ))}
    </div>
  );
};

export default Root;
