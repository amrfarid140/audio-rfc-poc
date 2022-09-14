import {AudioManagerListener} from '../AudioManagerListener';
import {QueueManagerListener} from '../QueueManagerListener';
import {AVPlayerProgress} from '../types/AVPlayerProgress';
import {AVPlayerStatus} from '../types/AVPlayerStatus';
import {PlaybackSpeed} from '../types/PlaybackSpeed';
import {PlaybackStatus} from '../types/PlaybackStatus';
import {AudioQueue} from '../types/AudioQueue';

export class AudioLoggingManager
  implements AudioManagerListener, QueueManagerListener
{
  onProgressUpdated(progress: AVPlayerProgress): void {
    console.log('onProgressUpdated', {progress});
  }
  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void {
    console.log('onProgressUpdated', {
      playerStatus,
      speed,
      status,
    });
  }
  onQueueUpdated(queue: AudioQueue): void {
    console.log('onQueueUpdated', {queue});
  }
}
