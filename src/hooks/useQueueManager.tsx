import {useEffect, useMemo, useState} from 'react';
import {myQueue} from 'src/QueueManager';
import {QueueManagerListener} from 'src/QueueManagerListener';
import {AudioQueue} from 'src/types/AudioQueue';

export const useQueueManager = () => {
  const [currentAudioQueue, setAudioQueue] = useState<AudioQueue>(
    myQueue.currentState(),
  );
  const listener: QueueManagerListener = useMemo(() => {
    return {
      onQueueUpdated(queue: AudioQueue): void {
        setAudioQueue(queue);
      },
    };
  }, []);
  useEffect(() => {
    return myQueue.addListener(listener);
  }, [listener]);
  return {
    state: currentAudioQueue,
    ...myQueue,
  };
};
