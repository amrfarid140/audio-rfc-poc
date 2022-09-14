import {useEffect, useMemo, useState} from 'react';
import {myAudioManager} from 'src/AudioManager';
import {AudioManagerListener} from 'src/AudioManagerListener';
import {AVPlayerProgress} from 'src/types/AVPlayerProgress';
import {AVPlayerStatus} from 'src/types/AVPlayerStatus';
import {PlaybackSpeed} from 'src/types/PlaybackSpeed';
import {PlaybackStatus} from 'src/types/PlaybackStatus';

const useAudioProgress = () => {
  const [currentAudioProgress, setAudioProgress] = useState<AVPlayerProgress>(
    myAudioManager.currentState().progress,
  );
  const listener: AudioManagerListener = useMemo(() => {
    return {
      onProgressUpdated(progress: AVPlayerProgress): void {
        setAudioProgress(progress);
      },
      onStateUpdated(
        playerStatus: AVPlayerStatus,
        speed: PlaybackSpeed,
        status: PlaybackStatus,
      ): void {},
    };
  }, []);
  useEffect(() => {
    return myAudioManager.addListener(listener);
  }, [listener]);
  return {
    progress: currentAudioProgress,
  };
};
