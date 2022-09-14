import {AudioQueue} from './types/AudioQueue';

export interface QueueManagerListener {
  onQueueUpdated(queue: AudioQueue): void;
}
