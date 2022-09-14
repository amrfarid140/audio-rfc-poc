import {QueueManagerListener} from './QueueManagerListener';
import {AudioQueue} from './types/AudioQueue';
import {Route} from './types/Route';

export interface QueueManager {
  currentState(): AudioQueue;
  addListener(listener: QueueManagerListener): () => void;
  clearQueue: (persistChange?: boolean) => void;
  next: () => void;
  previous: () => void;
}

class DefaultQueueManager implements QueueManager {
  clearQueue(persistChange: boolean | undefined): void {
  }

  next(): void {
  }

  previous(): void {
  }

  addListener(listener: QueueManagerListener): () => void {
    return function() {
    };
  }

  currentState(): AudioQueue {
    return [];
  }
}

export const myQueue: QueueManager = new DefaultQueueManager();
