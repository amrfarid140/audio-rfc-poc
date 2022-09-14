import {AudioManagerListener} from '../AudioManagerListener';
import {QueueManagerListener} from '../QueueManagerListener';
import {AudioManager} from '../AudioManager';
import {AVPlayerStatus} from '../types/AVPlayerStatus';
import {PlaybackSpeed} from '../types/PlaybackSpeed';
import {PlaybackStatus} from '../types/PlaybackStatus';
import {AudioQueue} from '../types/AudioQueue';

export class NativeControlsManager
  implements AudioManagerListener, QueueManagerListener
{
  constructor(private readonly myAudioManager: AudioManager) {}

  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void {
    // Update native controls with status and speed
  }
  onQueueUpdated(queue: AudioQueue): void {}
}
