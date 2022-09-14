import {AudioManagerListener} from '../AudioManagerListener';
import {QueueManagerListener} from '../QueueManagerListener';
import {AudioManager} from '../AudioManager';
import {AVPlayerStatus} from '../types/AVPlayerStatus';
import {PlaybackSpeed} from '../types/PlaybackSpeed';
import {PlaybackStatus} from '../types/PlaybackStatus';
import {AudioQueue} from '../types/AudioQueue';
import MusicControl, {Command} from 'react-native-music-control';
import {QueueManager} from '../QueueManager';

type RNMusicControlOptions = {
  album: string | undefined;
  artist: string;
  duration: number; // Seconds
  speed: PlaybackSpeed | 0;
  title: string;
};

const musicControlPlaybackStatusMap = {
  [PlaybackStatus.Play]: MusicControl.STATE_PLAYING,
  [PlaybackStatus.Pause]: MusicControl.STATE_PAUSED,
  [PlaybackStatus.Stop]: MusicControl.STATE_STOPPED,
};

export class NativeControlsManager
  implements AudioManagerListener, QueueManagerListener
{
  constructor(
    private readonly myAudioManager: AudioManager,
    private readonly myQueueManager: QueueManager,
  ) {
    MusicControl.enableControl(Command.play, true);
    MusicControl.enableControl(Command.pause, true);
    MusicControl.enableControl(Command.togglePlayPause, true);
  }

  onStateUpdated(
    playerStatus: AVPlayerStatus,
    speed: PlaybackSpeed,
    status: PlaybackStatus,
  ): void {
    const options: RNMusicControlOptions = {
      album: 'The OOP POC',
      artist: 'Reach Who?',
      duration: 22,
      speed,
      title: 'React is a UI Framework',
    };
    MusicControl.setNowPlaying(options);
    MusicControl.updatePlayback({state: musicControlPlaybackStatusMap[status]});
    MusicControl.on(Command.play, () => {
      this.myAudioManager.togglePlayback().catch(console.error);
    });
    MusicControl.on(Command.pause, () => {
      this.myAudioManager.togglePlayback().catch(console.error);
    });
    MusicControl.on(Command.togglePlayPause, () => {
      this.myAudioManager.togglePlayback().catch(console.error);
    });
    MusicControl.on(Command.nextTrack, this.myQueueManager.next);
    MusicControl.on(Command.previousTrack, this.myQueueManager.previous);
    MusicControl.enableControl(
      Command.nextTrack,
      this.myQueueManager.currentState().length !== 0,
    );
    MusicControl.enableControl(
      Command.previousTrack,
      this.myQueueManager.currentState().length !== 0,
    );
    // Update native controls with status and speed
  }
  onQueueUpdated(queue: AudioQueue): void {
    MusicControl.enableControl(Command.nextTrack, queue.length !== 0);
    MusicControl.enableControl(Command.previousTrack, queue.length !== 0);
  }
}
