import {useEffect, useMemo, useState} from 'react';
import {AudioQueue} from '../types/AudioQueue';
import {queueManager} from '../QueueManager';
import {QueueManagerListener} from '../QueueManagerListener';

export const useQueueManager = () => {
  const [currentAudioQueue, setAudioQueue] = useState<AudioQueue>(
    queueManager.currentState,
  );
  const listener: QueueManagerListener = useMemo(() => {
    return {
      onQueueUpdated(queue: AudioQueue): void {
        setAudioQueue(queue);
      },
    };
  }, []);
  useEffect(() => {
    return queueManager.addListener(listener);
  }, [listener]);
  return {
    state: currentAudioQueue,
  };
};
