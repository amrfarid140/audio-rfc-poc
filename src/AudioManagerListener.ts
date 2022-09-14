import {AVPlayerProgress} from './types/AVPlayerProgress';
import {AVPlayerStatus} from './types/AVPlayerStatus';
import {PlaybackSpeed} from './types/PlaybackSpeed';
import {PlaybackStatus} from './types/PlaybackStatus';

export interface AudioManagerListener {
  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void;
}

export interface AudioProgressListener {
  onProgressUpdated(progress: AVPlayerProgress): void;
}
