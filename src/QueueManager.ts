import {QueueManagerListener} from './QueueManagerListener';
import {AudioQueue} from './types/AudioQueue';
import {EventEmitter} from 'react-native';

export interface QueueManager {
  currentState(): AudioQueue;
  addListener(listener: QueueManagerListener): () => void;
  clearQueue: () => void;
  next: () => void;
  previous: () => void;
}

class DefaultQueueManager implements QueueManager {
  private static readonly EVENT = 'EVENT';
  private _queue: AudioQueue = [];
  private readonly queueEventEmitter = new EventEmitter();
  private set queue(value: AudioQueue) {
    this._queue = value;
    this.queueEventEmitter.emit(DefaultQueueManager.EVENT, value);
  }
  private get queue(): AudioQueue {
    return this._queue;
  }

  clearQueue(): void {
    this.queue = [];
  }

  next(): void {
    if (this.queue.length > 1) {
      const removed = this._queue.splice(0, 1);
      this.queue = [...this._queue, ...removed];
    }
  }

  previous(): void {
    if (this.queue.length > 1) {
      const removed = this._queue.splice(this._queue.length - 1, 1);
      this.queue = [...removed, ...this._queue];
    }
  }

  addListener(listener: QueueManagerListener): () => void {
    const sub = this.queueEventEmitter.addListener(
      DefaultQueueManager.EVENT,
      listener.onQueueUpdated,
    );
    return sub.remove;
  }

  currentState(): AudioQueue {
    return this.queue;
  }
}

export const queueManager: QueueManager = new DefaultQueueManager();
