import React from 'react';
import {Text, View} from 'react-native';
import {useAudioProgress} from '../hooks/useAudioProgress';

const ProgressTracker = () => {
  const progressState = useAudioProgress();
  return (
    <View>
      <Text>Duration {progressState.durationMillis}</Text>
      <Text>Progress {progressState.positionMillis}</Text>
    </View>
  );
};

export default ProgressTracker;
