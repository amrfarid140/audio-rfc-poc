import {AudioManager, myAudioManager} from 'src/AudioManager';
import {AudioManagerListener} from 'src/AudioManagerListener';
import {QueueManagerListener} from 'src/QueueManagerListener';
import {AVPlayerProgress} from 'src/types/AVPlayerProgress';
import {AVPlayerStatus} from 'src/types/AVPlayerStatus';
import {PlaybackSpeed} from 'src/types/PlaybackSpeed';
import {PlaybackStatus} from 'src/types/PlaybackStatus';

class NativeControlsManager
  implements AudioManagerListener, QueueManagerListener
{
  constructor(private readonly myAudioManager: AudioManager) {}
  onProgressUpdated(progress: AVPlayerProgress): void {
    // Update native controls with progress
  }
  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void {
    // Update native controls with status and speed
  }
  onQueueUpdated(queue: object): void {
    // Read currently playing track and prepare native controls
    const onTogglePlaybackClicked = myAudioManager.togglePlayback();
    setNativeControls(
      onTogglePlaybackClicked,
      //Add remainig required fields
    );
  }
}
