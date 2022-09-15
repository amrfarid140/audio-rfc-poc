/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';
import {audioManager} from './src/AudioManager';
import {useQueueManager} from './src/hooks/useQueueManager';
import {useAudioProgress} from './src/hooks/useAudioProgress';
import {useAudioPlayback} from './src/hooks/useAudioPlaybackState';
import {queueManager} from './src/QueueManager';
import {PlaybackStatus} from './src/types/PlaybackStatus';

const App = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const queue = useQueueManager();
  const progressState = useAudioProgress();
  const audioState = useAudioPlayback();

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}>
        <View>
          <Text>Currently Playing: {queue?.[0]?.name}</Text>
          <Text>Duration {progressState.durationMillis}</Text>
          <Text>Progress {progressState.positionMillis}</Text>
        </View>
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
      </ScrollView>
    </SafeAreaView>
  );
};

export default App;
