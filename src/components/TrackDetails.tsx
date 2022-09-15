import React from 'react';
import {Text} from 'react-native';
import {useQueueManager} from '../hooks/useQueueManager';

const TrackDetails = () => {
  const queue = useQueueManager();
  return <Text>Currently Playing: {queue?.[0]?.name}</Text>;
};

export default TrackDetails;
