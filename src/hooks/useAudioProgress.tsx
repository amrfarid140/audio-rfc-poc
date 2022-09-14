import {AVPlayerProgress} from '../types/AVPlayerProgress';
import {useEffect, useMemo, useState} from 'react';
import {audioManager} from '../AudioManager';
import {AudioProgressListener} from '../AudioManagerListener';

export const useAudioProgress = () => {
  const [currentAudioProgress, setAudioProgress] = useState<AVPlayerProgress>({
    durationMillis: 0,
    positionMillis: 0,
  });
  const listener: AudioProgressListener = useMemo(() => {
    return {
      onProgressUpdated(progress: AVPlayerProgress): void {
        setAudioProgress(progress);
      },
    };
  }, []);
  useEffect(() => {
    return audioManager.addProgressListener(listener);
  }, [listener]);
  return {
    progress: currentAudioProgress,
  };
};
