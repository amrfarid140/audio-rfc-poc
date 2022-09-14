export type AVPlayerStatus = {
  isBuffering: boolean; // Track has been loaded into the OS and is buffering
  isLoading: boolean; // Track is still loading into the OS
  isPlaying: boolean;
};
