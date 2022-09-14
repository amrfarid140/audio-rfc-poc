import {AudioManagerListener} from 'src/AudioManagerListener';
import {AVPlayerProgress} from 'src/types/AVPlayerProgress';
import {AVPlayerStatus} from 'src/types/AVPlayerStatus';
import {PlaybackSpeed} from 'src/types/PlaybackSpeed';
import {PlaybackStatus} from 'src/types/PlaybackStatus';

class ProgressCachingManager implements AudioManagerListener {
  onProgressUpdated(progress: AVPlayerProgress): void {
    // Cache progress
    cache.store(prgoress);
  }

  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void {
    // Nothing to do
  }
}
