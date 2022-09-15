import {QueueManagerListener} from './QueueManagerListener';
import {AudioQueue} from './types/AudioQueue';
import EventEmitter from 'eventemitter2';

export interface QueueManager {
  currentState(): AudioQueue;
  addListener(listener: QueueManagerListener): () => void;
  clearQueue: () => void;
  next: () => void;
  previous: () => void;
}

class DefaultQueueManager implements QueueManager {
  private static readonly EVENT = 'EVENT';
  private eventEmitter = new EventEmitter();
  private removed: AudioQueue = [];
  private _queue: AudioQueue = [
    {
      name: '3 Violins & Continuo',
      id: '0',
      url: 'https://www.mfiles.co.uk/mp3-downloads/pachelbel-canon-in-d.mp3',
    },
    {
      name: 'Sofeggietto',
      id: '1',
      url: 'https://www.mfiles.co.uk/mp3-downloads/cpe-bach-solfeggietto.mp3',
    },
    {
      name: 'Por Una Cabeza',
      id: '2',
      url: 'https://www.mfiles.co.uk/mp3-downloads/por-una-cabeza.mp3',
    },
  ];
  private set queue(value: AudioQueue) {
    this._queue = value;
    this.eventEmitter.emit(DefaultQueueManager.EVENT, value);
  }
  private get queue(): AudioQueue {
    return this._queue;
  }

  clearQueue(): void {
    this.queue = [];
  }

  next(): void {
    if (this._queue.length > 1) {
      this.removed = [...this.removed, ...this._queue.splice(0, 1)];
      this.queue = [...this._queue];
    }
  }

  previous(): void {
    if (this.removed.length > 0) {
      this.queue = [this.removed[this.removed.length - 1], ...this._queue];
      this.removed.splice(this._queue.length - 1, 1);
    }
  }

  addListener(listener: QueueManagerListener): () => void {
    const sub = this.eventEmitter.addListener(
      DefaultQueueManager.EVENT,
      queue => listener.onQueueUpdated(queue),
    );
    return () => {
      this.eventEmitter.removeListener(DefaultQueueManager.EVENT, sub.off);
    };
  }

  currentState(): AudioQueue {
    return this.queue;
  }
}

export const queueManager: QueueManager = new DefaultQueueManager();
