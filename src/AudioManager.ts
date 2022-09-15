import {
  AudioManagerListener,
  AudioProgressListener,
} from './AudioManagerListener';
import {QueueManagerListener} from './QueueManagerListener';
import {AVPlayerProgress} from './types/AVPlayerProgress';
import {AVPlayerStatus} from './types/AVPlayerStatus';
import {PlaybackSpeed} from './types/PlaybackSpeed';
import {PlaybackStatus} from './types/PlaybackStatus';
import {TrackDirection} from './types/TrackDirection';
import EventEmitter from 'eventemitter2';
import {AudioQueue} from './types/AudioQueue';
import {Sound} from 'expo-av/build/Audio/Sound';
import {
  Audio,
  AVPlaybackStatus,
  AVPlaybackStatusSuccess,
  InterruptionModeAndroid,
  InterruptionModeIOS,
} from 'expo-av';
import isEqual from 'lodash.isequal';
import {queueManager, QueueManager} from './QueueManager';

interface AudioManagerState {
  readonly playerStatus: AVPlayerStatus;
  readonly speed: PlaybackSpeed;
  readonly status: PlaybackStatus;
  readonly progress: AVPlayerProgress;
}

export interface AudioManager extends QueueManagerListener {
  currentState(): Promise<AudioManagerState>;
  addListener(listener: AudioManagerListener): () => void;
  addProgressListener(listener: AudioProgressListener): () => void;
  togglePlayback: () => Promise<void>;
  stopPlayback(): Promise<void>;
  seekTo: (positionMs: number) => Promise<void>;
  skipSeekTime: (direction: TrackDirection) => Promise<void>;
  setPlaybackSpeed: (speed: number) => Promise<void>;
}

type AudioManagerStateEvent = Omit<AudioManagerState, 'progress'> & {
  duration: number;
};

class DefaultAudioManager implements AudioManager {
  private static readonly STATE_EVENT = 'STATE';
  private static readonly PROGRESS_EVENT = 'PROGRESS';

  private readonly sound: Sound = new Sound();
  private latestQueue: AudioQueue = [];
  private lastPlaybackStatus: AudioManagerStateEvent | null = null;
  private eventEmitter = new EventEmitter();

  constructor(queue: QueueManager) {
    this.latestQueue = queue.currentState();
    Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true, // Get the app to ignore the mute switch on iOS
      playThroughEarpieceAndroid: false,
      shouldDuckAndroid: false, // Audio from other apps will pause your audio playback
      staysActiveInBackground: true,
    });
  }

  async seekTo(positionMs: number): Promise<void> {
    if (this.sound._loaded) {
      await this.sound.setPositionAsync(positionMs);
    }
  }

  async setPlaybackSpeed(speed: number): Promise<void> {
    if (this.sound._loaded) {
      await this.sound.setRateAsync(speed, true);
    }
  }

  async skipSeekTime(direction: TrackDirection): Promise<void> {
    if (this.sound._loaded) {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        const successStatus = status as AVPlaybackStatusSuccess;
        if (direction === TrackDirection.Backward) {
          await this.seekTo(successStatus.positionMillis - 15000);
        } else {
          await this.seekTo(successStatus.positionMillis + 15000);
        }
      }
    }
  }

  async togglePlayback(): Promise<void> {
    if (this.sound._loaded) {
      const status: AVPlaybackStatus = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        let successStatus = status as AVPlaybackStatusSuccess;
        if (successStatus.isPlaying) {
          await this.sound.pauseAsync();
          return;
        } else {
          await this.sound.playAsync();
        }
      }
    } else {
      const track = this.latestQueue[0];
      await this.sound.loadAsync({uri: track.url}, {shouldPlay: true});
      this.sound.setOnPlaybackStatusUpdate((status: AVPlaybackStatus) => {
        if (status.isLoaded) {
          const success = status as AVPlaybackStatusSuccess;
          const playbackStatus: AudioManagerStateEvent = {
            playerStatus: {
              isBuffering: success.isBuffering,
              isPlaying: success.isPlaying,
              isLoading: !success.isLoaded,
            },
            duration: success.durationMillis ?? 0,
            status: success.isPlaying
              ? PlaybackStatus.Play
              : PlaybackStatus.Pause,
            speed: success.rate,
          };
          if (!isEqual(this.lastPlaybackStatus, playbackStatus)) {
            this.lastPlaybackStatus = playbackStatus;
            this.eventEmitter.emit(
              DefaultAudioManager.STATE_EVENT,
              playbackStatus,
            );
          }
          this.eventEmitter.emit(DefaultAudioManager.PROGRESS_EVENT, <
            AVPlayerProgress
          >{
            durationMillis: success.durationMillis,
            positionMillis: success.positionMillis,
          });
        }
      });
    }
  }

  addListener(listener: AudioManagerListener): () => void {
    const subscription = this.eventEmitter.addListener(
      DefaultAudioManager.STATE_EVENT,
      (event: AudioManagerStateEvent) =>
        listener.onStateUpdated(event.playerStatus, event.speed, event.status),
    );
    return () => {
      this.eventEmitter.removeListener(
        DefaultAudioManager.STATE_EVENT,
        subscription.off,
      );
    };
  }

  addProgressListener(listener: AudioProgressListener): () => void {
    const subscription = this.eventEmitter.addListener(
      DefaultAudioManager.PROGRESS_EVENT,
      progress => listener.onProgressUpdated(progress),
    );
    return () => {
      this.eventEmitter.removeListener(
        DefaultAudioManager.PROGRESS_EVENT,
        subscription.off,
      );
    };
  }

  async currentState(): Promise<{
    playerStatus: AVPlayerStatus;
    speed: PlaybackSpeed;
    status: PlaybackStatus;
    progress: AVPlayerProgress;
  }> {
    if (this.sound._loaded) {
      const status = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        const success = status as AVPlaybackStatusSuccess;
        return {
          playerStatus: {
            isBuffering: success.isBuffering,
            isPlaying: success.isPlaying,
            isLoading: !success.isLoaded,
          },
          progress: {
            durationMillis: success.durationMillis ?? 0,
            positionMillis: success.positionMillis,
          },
          status: success.isPlaying
            ? PlaybackStatus.Play
            : PlaybackStatus.Pause,
          speed: success.rate,
        };
      }
    }
    return {
      playerStatus: {
        isBuffering: false,
        isLoading: false,
        isPlaying: false,
      },
      progress: {
        durationMillis: 0,
        positionMillis: 0,
      },
      speed: PlaybackSpeed.One,
      status: PlaybackStatus.Stop,
    };
  }

  async onQueueUpdated(queue: AudioQueue): Promise<void> {
    this.latestQueue = queue;
    console.log('AMR', {latestQueue: this.latestQueue, sound: this.sound});
    if (this.latestQueue.length > 0 && this.sound) {
      console.log('AMR check');
      const topTrack = this.latestQueue[0];
      console.log('AMR topTrack', {topTrack});
      const status = await this.sound.getStatusAsync();
      console.log('AMR status');
      if (status.isLoaded) {
        console.log('AMR loaded - success', {
          su: status.uri,
          topTrack: topTrack.url,
        });
        const success = status as AVPlaybackStatusSuccess;
        const shouldPlay = success.isPlaying;
        if (success.uri !== topTrack.url) {
          await this.stopPlayback();
          if (shouldPlay) {
            await this.togglePlayback();
          }
        }
      }
    }
  }

  async stopPlayback(): Promise<void> {
    if (this.sound._loaded) {
      await this.sound.stopAsync();
    }
    return Promise.resolve();
  }
}

export const audioManager: AudioManager = new DefaultAudioManager(queueManager);
