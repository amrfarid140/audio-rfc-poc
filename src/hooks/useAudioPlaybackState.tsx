import {AVPlayerStatus} from '../types/AVPlayerStatus';
import {PlaybackSpeed} from '../types/PlaybackSpeed';
import {PlaybackStatus} from '../types/PlaybackStatus';
import {useEffect, useMemo, useState} from 'react';
import {AudioManagerListener} from '../AudioManagerListener';
import {audioManager} from '../AudioManager';

type AudioState = {
  playerStatus: AVPlayerStatus;
  speed: PlaybackSpeed;
  status: PlaybackStatus;
};

export const useAudioPlayback = () => {
  const [currentAudioState, setAudioState] = useState<AudioState | null>(null);
  const listener: AudioManagerListener = useMemo(() => {
    return {
      onStateUpdated(
        playerStatus: AVPlayerStatus,
        speed: PlaybackSpeed,
        status: PlaybackStatus,
      ): void {
        setAudioState({
          playerStatus,
          speed,
          status,
        });
      },
    };
  }, []);
  useEffect(() => {
    return audioManager.addListener(listener);
  }, [listener]);
  return {
    state: currentAudioState,
  };
};
