import {useEffect, useMemo, useState} from 'react';
import {myAudioManager} from 'src/AudioManager';
import {AudioManagerListener} from 'src/AudioManagerListener';
import {AVPlayerProgress} from 'src/types/AVPlayerProgress';
import {AVPlayerStatus} from 'src/types/AVPlayerStatus';
import {PlaybackSpeed} from 'src/types/PlaybackSpeed';
import {PlaybackStatus} from 'src/types/PlaybackStatus';

type AudioState = {
  playerStatus: AVPlayerStatus;
  speed: PlaybackSpeed;
  status: PlaybackStatus;
};

const useAudioPlayback = () => {
  const [currentAudioState, setAudioState] = useState<AudioState>(
    myAudioManager.currentState(),
  );
  const listener: AudioManagerListener = useMemo(() => {
    return {
      onProgressUpdated(progress: AVPlayerProgress): void {},
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
    return myAudioManager.addListener(listener);
  }, [listener]);
  return {
    state: currentAudioState,
    ...myAudioManager,
  };
};
