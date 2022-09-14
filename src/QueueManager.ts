import {QueueManagerListener} from './QueueManagerListener';
import {AudioQueue} from './types/AudioQueue';
import {DeviceEventEmitter} from 'react-native';

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
  private set queue(value: AudioQueue) {
    this._queue = value;
    DeviceEventEmitter.emit(DefaultQueueManager.EVENT, value);
  }
  private get queue(): AudioQueue {
    return this._queue;
  }

  constructor() {
    this._queue = [
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
    const sub = DeviceEventEmitter.addListener(
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
