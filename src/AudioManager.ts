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
import {DeviceEventEmitter} from 'react-native';
import {AudioQueue} from './types/AudioQueue';
import {Sound} from 'expo-av/build/Audio/Sound';
import {AVPlaybackStatus, AVPlaybackStatusSuccess} from 'expo-av';
import isEqual from 'lodash.isequal';
import { queueManager, QueueManager } from "./QueueManager";

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

  private sound: Sound | null = null;
  private latestQueue: AudioQueue = [];
  private lastPlaybackStatus: AudioManagerStateEvent | null = null;

  constructor(queue: QueueManager) {
    this.latestQueue = queue.currentState();
  }

  async seekTo(positionMs: number): Promise<void> {
    if (this.sound) {
      await this.sound.setPositionAsync(positionMs);
    }
  }

  async setPlaybackSpeed(speed: number): Promise<void> {
    if (this.sound) {
      await this.sound.setRateAsync(speed, true);
    }
  }

  async skipSeekTime(direction: TrackDirection): Promise<void> {
    if (this.sound) {
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
    if (this.sound) {
      const status: AVPlaybackStatus = await this.sound.getStatusAsync();
      if (status.isLoaded) {
        let successStatus = status as AVPlaybackStatusSuccess;
        if (successStatus.isPlaying) {
          await this.sound.pauseAsync();
          return;
        }
      }
    }
    const track = this.latestQueue[0];
    const result = await Sound.createAsync(
      {uri: track.url},
      {shouldPlay: true},
      (status: AVPlaybackStatus) => {
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
            DeviceEventEmitter.emit(
              DefaultAudioManager.STATE_EVENT,
              playbackStatus,
            );
          }
          DeviceEventEmitter.emit(
            DefaultAudioManager.PROGRESS_EVENT,
            status.positionMillis,
          );
        }
      },
    );
    this.sound = result.sound;
  }

  addListener(listener: AudioManagerListener): () => void {
    const subscription = DeviceEventEmitter.addListener(
      DefaultAudioManager.STATE_EVENT,
      (event: AudioManagerStateEvent) =>
        listener.onStateUpdated(event.playerStatus, event.speed, event.status),
    );
    return subscription.remove;
  }

  addProgressListener(listener: AudioProgressListener): () => void {
    const subscription = DeviceEventEmitter.addListener(
      DefaultAudioManager.PROGRESS_EVENT,
      listener.onProgressUpdated,
    );
    return subscription.remove;
  }

  async currentState(): Promise<{
    playerStatus: AVPlayerStatus;
    speed: PlaybackSpeed;
    status: PlaybackStatus;
    progress: AVPlayerProgress;
  }> {
    if (this.sound) {
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

  onQueueUpdated(queue: AudioQueue): void {
    this.latestQueue = queue;
  }

  async stopPlayback(): Promise<void> {
    if (this.sound) {
      await this.sound.stopAsync();
      this.sound = null;
    }
    return Promise.resolve();
  }
}

export const audioManager: AudioManager = new DefaultAudioManager(queueManager);
