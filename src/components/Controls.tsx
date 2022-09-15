import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {queueManager} from '../QueueManager';
import {audioManager} from '../AudioManager';
import {PlaybackStatus} from '../types/PlaybackStatus';
import {useAudioPlayback} from '../hooks/useAudioPlaybackState';

const Controls = () => {
  const audioState = useAudioPlayback();
  return (
    <View style={{flexDirection: 'row'}}>
      <Pressable onPress={() => queueManager.previous()}>
        <Text>Previous</Text>
      </Pressable>
      <Pressable
        onPress={() => audioManager.togglePlayback().catch(console.error)}>
        <Text>
          {audioState?.status === PlaybackStatus.Play ? 'Pause' : 'Play'}
        </Text>
      </Pressable>
      <Pressable onPress={() => queueManager.next()}>
        <Text>Next</Text>
      </Pressable>
    </View>
  );
};

export default Controls;
