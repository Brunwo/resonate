import { SoundData, WaveType } from "../types";

interface ActiveNodeData {
  mainGain: GainNode;
  nodes: AudioNode[]; // All nodes to disconnect/stop
  oscillators: OscillatorNode[]; // References for updates
  filter?: BiquadFilterNode; // Reference for filter updates
  config: SoundData;
}

class AudioEngine {
  private ctx: AudioContext | null = null;
  private activeNodes: Map<string, ActiveNodeData> = new Map();

  private getContext(): AudioContext {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    return this.ctx;
  }

  public async resume() {
    const ctx = this.getContext();
    if (ctx.state === 'suspended') {
      await ctx.resume();
    }
  }

  public setVolume(id: string, volume: number) {
    const active = this.activeNodes.get(id);
    if (active && this.ctx) {
      active.mainGain.gain.setTargetAtTime(volume, this.ctx.currentTime, 0.1);
    }
  }

  // Real-time parameter updates without restarting
  public updateOptions(id: string, options: Partial<SoundData>) {
    const active = this.activeNodes.get(id);
    if (!active || !this.ctx) return;

    const now = this.ctx.currentTime;

    // 1. Update Oscillators
    if (active.oscillators.length > 0) {
      // Waveform
      if (options.waveType) {
        active.oscillators.forEach(osc => osc.type = options.waveType!);
      }

      // Frequencies
      if (options.baseFreq !== undefined) {
        const base = options.baseFreq;
        
        if (active.config.type === 'oscillator') {
          active.oscillators[0].frequency.setTargetAtTime(base, now, 0.05);
        } 
        else if (active.config.type === 'binaural' && active.oscillators.length === 2) {
          // Preserve existing beat if not provided, or use new beat
          const beat = options.beatFreq !== undefined ? options.beatFreq : (active.config.beatFreq || 0);
          
          active.oscillators[0].frequency.setTargetAtTime(base, now, 0.05);
          active.oscillators[1].frequency.setTargetAtTime(base + beat, now, 0.05);
        }
      }

      // Beat Frequency Only Change
      if (options.beatFreq !== undefined && active.config.type === 'binaural' && active.oscillators.length === 2) {
        const base = options.baseFreq !== undefined ? options.baseFreq : (active.config.baseFreq || 200);
        active.oscillators[1].frequency.setTargetAtTime(base + options.beatFreq, now, 0.05);
      }
    }

    // 2. Update Filter
    if (active.filter) {
      if (options.filterFreq !== undefined) {
        active.filter.frequency.setTargetAtTime(options.filterFreq, now, 0.1);
      }
      if (options.filterQ !== undefined) {
        active.filter.Q.setTargetAtTime(options.filterQ, now, 0.1);
      }
      if (options.filterType !== undefined) {
        active.filter.type = options.filterType;
      }
    }

    // Merge new config
    active.config = { ...active.config, ...options };
  }

  public stop(id: string) {
    const active = this.activeNodes.get(id);
    if (active && this.ctx) {
      // Fade out
      active.mainGain.gain.setTargetAtTime(0, this.ctx.currentTime, 0.2);
      
      setTimeout(() => {
        active.nodes.forEach((node) => {
          if (node instanceof OscillatorNode || node instanceof AudioBufferSourceNode) {
            try { node.stop(); } catch(e) {}
          }
          node.disconnect();
        });
        active.mainGain.disconnect();
        this.activeNodes.delete(id);
      }, 250);
    }
  }

  public stopAll() {
    Array.from(this.activeNodes.keys()).forEach(id => this.stop(id));
  }

  public play(sound: SoundData, volume: number = 0.5) {
    const ctx = this.getContext();
    
    if (this.activeNodes.has(sound.id)) {
      this.stop(sound.id);
    }

    const mainGain = ctx.createGain();
    mainGain.gain.value = 0;
    mainGain.connect(ctx.destination);
    mainGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.5);

    const activeData: ActiveNodeData = {
      mainGain,
      nodes: [],
      oscillators: [],
      config: sound
    };

    try {
      // --- Oscillator ---
      if (sound.type === 'oscillator' && sound.baseFreq) {
        const osc = ctx.createOscillator();
        osc.type = sound.waveType || WaveType.SINE;
        osc.frequency.value = sound.baseFreq;
        osc.connect(mainGain);
        osc.start();
        
        activeData.nodes.push(osc);
        activeData.oscillators.push(osc);
      } 
      // --- Binaural ---
      else if (sound.type === 'binaural' && sound.baseFreq && sound.beatFreq !== undefined) {
        const merger = ctx.createChannelMerger(2);
        
        // Left Ear
        const oscL = ctx.createOscillator();
        oscL.type = sound.waveType || WaveType.SINE;
        oscL.frequency.value = sound.baseFreq;
        const pannerL = ctx.createStereoPanner();
        pannerL.pan.value = -1;
        oscL.connect(pannerL).connect(mainGain);
        
        // Right Ear
        const oscR = ctx.createOscillator();
        oscR.type = sound.waveType || WaveType.SINE;
        oscR.frequency.value = sound.baseFreq + sound.beatFreq;
        const pannerR = ctx.createStereoPanner();
        pannerR.pan.value = 1;
        oscR.connect(pannerR).connect(mainGain);

        oscL.start();
        oscR.start();
        
        activeData.nodes.push(oscL, oscR, pannerL, pannerR);
        activeData.oscillators.push(oscL, oscR);
      } 
      // --- Noise ---
      else if (sound.type === 'noise' && sound.noiseType) {
        const bufferSize = ctx.sampleRate * 5; 
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        
        this.fillNoiseBuffer(data, sound.noiseType);

        const noiseSource = ctx.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.loop = true;
        
        let lastNode: AudioNode = noiseSource;
        activeData.nodes.push(noiseSource);

        // Apply Filter if defined OR if it's green noise (legacy support)
        if (sound.filterType || sound.noiseType === 'green') {
             const filter = ctx.createBiquadFilter();
             
             if (sound.filterType) {
               filter.type = sound.filterType;
               filter.frequency.value = sound.filterFreq || 1000;
               filter.Q.value = sound.filterQ || 1;
             } else if (sound.noiseType === 'green') {
               // Default Green handling
               filter.type = 'bandpass';
               filter.frequency.value = 500;
               filter.Q.value = 0.5;
             }

             lastNode.connect(filter);
             lastNode = filter;
             activeData.nodes.push(filter);
             activeData.filter = filter;
        }

        lastNode.connect(mainGain);
        noiseSource.start();
      }

      this.activeNodes.set(sound.id, activeData);
    } catch (e) {
      console.error("Audio Engine Error:", e);
    }
  }

  // Noise Algorithms
  private fillNoiseBuffer(data: Float32Array, type: string) {
    const l = data.length;
    if (type === 'white') {
      for (let i = 0; i < l; i++) { data[i] = Math.random() * 2 - 1; }
    } else if (type === 'pink') {
      let b0=0, b1=0, b2=0, b3=0, b4=0, b5=0, b6=0;
      for (let i = 0; i < l; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      }
    } else if (type === 'brown') {
      let lastOut = 0.0;
      for (let i = 0; i < l; i++) {
        const white = Math.random() * 2 - 1;
        lastOut = (lastOut + (0.02 * white)) / 1.02;
        data[i] = lastOut * 3.5;
      }
    } else if (type === 'green') {
       for (let i = 0; i < l; i++) { data[i] = Math.random() * 2 - 1; }
    } else if (type === 'violet') {
      let lastWhite = 0;
      for (let i = 0; i < l; i++) {
        const white = Math.random() * 2 - 1;
        data[i] = (white - lastWhite) * 0.5;
        lastWhite = white;
      }
    }
  }
}

export const audioEngine = new AudioEngine();