export interface AudioTrack {
  readonly id: string;
  readonly url: string;
  readonly name: string;
}
export type AudioQueue = AudioTrack[]; // Use real type in the Economist app
