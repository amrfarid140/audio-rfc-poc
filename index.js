/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {queueManager} from './src/QueueManager';
import {audioManager} from './src/AudioManager';
import {AudioLoggingManager} from './src/side_effects/AudioLoggingManager';
import {NativeControlsManager} from './src/side_effects/NativeControlsManager';

queueManager.addListener(audioManager);

const audioLogging = new AudioLoggingManager();
const nativeControlsManager = new NativeControlsManager(audioManager);

audioManager.addListener(audioLogging);
audioManager.addListener(nativeControlsManager);

queueManager.addListener(audioLogging);
queueManager.addListener(nativeControlsManager);

AppRegistry.registerComponent(appName, () => App);
