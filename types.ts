export enum SoundCategory {
  SOLFEGGIO = 'Solfeggio',
  BINAURAL = 'Binaural',
  NOISE = 'Noise',
  NATURE = 'Nature',
  SLEEP = 'Sleep',
  CUSTOM = 'Custom'
}

export enum WaveType {
  SINE = 'sine',
  SQUARE = 'square',
  SAWTOOTH = 'sawtooth',
  TRIANGLE = 'triangle'
}

export interface SoundData {
  id: string;
  title: string;
  category: SoundCategory;
  frequencyDisplay: string; 
  description: string;
  scientificClaim: string; 
  isPseudo: boolean; 
  
  // Audio Engine Params
  type: 'oscillator' | 'binaural' | 'noise';
  
  // Synthesis Params
  baseFreq?: number; 
  beatFreq?: number; 
  waveType?: WaveType; // Oscillator waveform
  
  // Noise & Filter Params
  noiseType?: 'white' | 'pink' | 'brown' | 'green' | 'violet';
  filterType?: 'lowpass' | 'highpass' | 'bandpass' | 'notch';
  filterFreq?: number;
  filterQ?: number;
}

export interface ActiveSoundState {
  isPlaying: boolean;
  volume: number; 
}