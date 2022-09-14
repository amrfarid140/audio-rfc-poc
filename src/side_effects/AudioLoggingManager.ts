import {AudioManagerListener} from 'src/AudioManagerListener';
import {QueueManagerListener} from 'src/QueueManagerListener';
import {AVPlayerProgress} from 'src/types/AVPlayerProgress';
import {AVPlayerStatus} from 'src/types/AVPlayerStatus';
import {PlaybackSpeed} from 'src/types/PlaybackSpeed';
import {PlaybackStatus} from 'src/types/PlaybackStatus';

class NativeControlsManager
  implements AudioManagerListener, QueueManagerListener
{
  onProgressUpdated(progress: AVPlayerProgress): void {
    console.log('onProgressUpdated');
  }
  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void {
    console.log('onProgressUpdated');
  }
  onQueueUpdated(queue: object): void {
    console.log('onProgressUpdated');
    throw new Error('Method not implemented.');
  }
}
