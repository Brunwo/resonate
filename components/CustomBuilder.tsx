import React, { useState, useEffect, useCallback } from 'react';
import { SoundData, SoundCategory, WaveType } from '../types';
import { audioEngine } from '../services/audioEngine';

interface CustomBuilderProps {
  isPlaying: boolean;
  onToggle: (data: SoundData) => void;
}

export const CustomBuilder: React.FC<CustomBuilderProps> = ({ isPlaying, onToggle }) => {
  // Builder State
  const [mode, setMode] = useState<'oscillator' | 'binaural' | 'noise'>('oscillator');
  const [waveType, setWaveType] = useState<WaveType>(WaveType.SINE);
  const [baseFreq, setBaseFreq] = useState(432);
  const [beatFreq, setBeatFreq] = useState(10); // For Binaural
  
  const [noiseType, setNoiseType] = useState<'white' | 'pink' | 'brown' | 'violet'>('brown');
  const [filterEnabled, setFilterEnabled] = useState(false);
  const [filterType, setFilterType] = useState<'lowpass' | 'highpass'>('lowpass');
  const [filterFreq, setFilterFreq] = useState(400);

  // Construct Data Object
  const getSoundData = useCallback((): SoundData => {
    return {
      id: 'custom-builder',
      title: 'Custom Lab',
      category: SoundCategory.CUSTOM,
      description: 'User generated soundscape',
      frequencyDisplay: mode === 'noise' ? noiseType : `${baseFreq}Hz`,
      scientificClaim: 'Experimental configuration.',
      isPseudo: false,
      type: mode,
      baseFreq,
      beatFreq: mode === 'binaural' ? beatFreq : 0,
      waveType,
      noiseType: mode === 'noise' ? noiseType : undefined,
      filterType: filterEnabled ? filterType : undefined,
      filterFreq: filterEnabled ? filterFreq : undefined,
      filterQ: 1
    };
  }, [mode, waveType, baseFreq, beatFreq, noiseType, filterEnabled, filterType, filterFreq]);

  // Real-time Updates
  useEffect(() => {
    if (isPlaying) {
      // If mode changes drastically (topology change), we might need to restart manually 
      // but here we assume the parent handles toggle off/on if needed, or we rely on UpdateOptions
      // AudioEngine's updateOptions handles param changes. 
      // Note: Changing 'type' (osc -> noise) requires a restart in AudioEngine usually.
      // For this Builder, we'll use updateOptions for sliders, but restart for Mode changes.
      
      const data = getSoundData();
      audioEngine.updateOptions('custom-builder', {
        baseFreq: data.baseFreq,
        beatFreq: data.beatFreq,
        waveType: data.waveType,
        filterFreq: data.filterFreq,
        filterType: data.filterType,
        filterQ: data.filterQ
      });
    }
  }, [baseFreq, beatFreq, waveType, filterFreq, filterType, filterEnabled, isPlaying, getSoundData]);

  // Restart on Topology Change (Mode / Noise Type / Filter Toggle)
  useEffect(() => {
    if (isPlaying) {
      // These changes require rebuilding the node graph
      onToggle(getSoundData()); 
    }
  }, [mode, noiseType, filterEnabled]); // eslint-disable-line react-hooks/exhaustive-deps


  return (
    <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 rounded-2xl p-6 md:p-8 shadow-2xl animate-fade-in w-full max-w-3xl mx-auto mb-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-light text-zinc-100 tracking-wide">Sound Lab</h2>
          <p className="text-zinc-500 text-sm">Design your own sonic environment.</p>
        </div>
        
        {/* Mode Selector */}
        <div className="flex bg-zinc-950 rounded-lg p-1 border border-zinc-800">
           {(['oscillator', 'binaural', 'noise'] as const).map((m) => (
             <button
               key={m}
               onClick={() => setMode(m)}
               className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-all ${mode === m ? 'bg-zinc-800 text-zinc-100 shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               {m}
             </button>
           ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        
        {/* Left Column: Core Generation */}
        <div className="space-y-6">
           
           {mode !== 'noise' && (
             <>
              <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Waveform</label>
                <div className="grid grid-cols-4 gap-2">
                  {[WaveType.SINE, WaveType.TRIANGLE, WaveType.SQUARE, WaveType.SAWTOOTH].map((w) => (
                    <button 
                      key={w} 
                      onClick={() => setWaveType(w)}
                      className={`h-10 rounded border flex items-center justify-center transition-colors ${waveType === w ? 'bg-cyan-900/30 border-cyan-500 text-cyan-400' : 'border-zinc-800 bg-zinc-950 text-zinc-600 hover:border-zinc-600'}`}
                      title={w}
                    >
                       {/* Simple SVG icons based on type */}
                       {w === WaveType.SINE && <svg width="20" height="12" viewBox="0 0 20 12" stroke="currentColor" fill="none"><path d="M0 6 Q5 -6 10 6 T20 6" /></svg>}
                       {w === WaveType.TRIANGLE && <svg width="20" height="12" viewBox="0 0 20 12" stroke="currentColor" fill="none"><path d="M0 11 L10 1 L20 11" /></svg>}
                       {w === WaveType.SQUARE && <svg width="20" height="12" viewBox="0 0 20 12" stroke="currentColor" fill="none"><path d="M0 11 L0 1 L10 1 L10 11 L20 11" /></svg>}
                       {w === WaveType.SAWTOOTH && <svg width="20" height="12" viewBox="0 0 20 12" stroke="currentColor" fill="none"><path d="M0 11 L20 1 L20 11" /></svg>}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                   <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Base Frequency</label>
                   <span className="text-xs font-mono text-cyan-400">{baseFreq} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="20" max="900" step="1"
                  value={baseFreq}
                  onChange={(e) => setBaseFreq(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
                <div className="flex gap-2">
                  {/* Fine tune buttons */}
                  <button onClick={() => setBaseFreq(b => Math.max(20, b-1))} className="flex-1 bg-zinc-800 py-1 rounded text-xs text-zinc-400 hover:bg-zinc-700">-1</button>
                  <button onClick={() => setBaseFreq(b => b+1)} className="flex-1 bg-zinc-800 py-1 rounded text-xs text-zinc-400 hover:bg-zinc-700">+1</button>
                </div>
              </div>
             </>
           )}

           {mode === 'binaural' && (
             <div className="space-y-3 p-4 bg-cyan-900/10 border border-cyan-900/30 rounded-xl">
               <div className="flex justify-between">
                   <label className="text-xs font-bold text-cyan-600 uppercase tracking-wider">Binaural Beat</label>
                   <span className="text-xs font-mono text-cyan-400">{beatFreq} Hz</span>
                </div>
                <input 
                  type="range" 
                  min="0.5" max="40" step="0.1"
                  value={beatFreq}
                  onChange={(e) => setBeatFreq(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
                />
                <p className="text-[10px] text-zinc-500 text-right">Target: {baseFreq + beatFreq} Hz (Right Ear)</p>
             </div>
           )}

           {mode === 'noise' && (
             <div className="space-y-3">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Noise Color</label>
                <div className="grid grid-cols-4 gap-2">
                  {(['white', 'pink', 'brown', 'violet'] as const).map(n => (
                    <button
                      key={n}
                      onClick={() => setNoiseType(n)}
                      className={`px-2 py-2 rounded border text-xs capitalize transition-colors ${noiseType === n ? 'bg-amber-900/30 border-amber-500 text-amber-400' : 'border-zinc-800 bg-zinc-950 text-zinc-500 hover:border-zinc-600'}`}
                    >
                      {n}
                    </button>
                  ))}
                </div>
             </div>
           )}

        </div>

        {/* Right Column: Shaping & Actions */}
        <div className="flex flex-col justify-between space-y-6">
           
           {/* Filter Section */}
           <div className={`space-y-4 p-4 rounded-xl border transition-colors ${filterEnabled ? 'bg-zinc-800/30 border-zinc-600' : 'bg-zinc-900/30 border-zinc-800'}`}>
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">EQ Filter</label>
                <button 
                  onClick={() => setFilterEnabled(!filterEnabled)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${filterEnabled ? 'bg-emerald-500' : 'bg-zinc-700'}`}
                >
                  <span className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${filterEnabled ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              
              <div className={`space-y-4 transition-all duration-300 ${filterEnabled ? 'opacity-100' : 'opacity-20 pointer-events-none'}`}>
                 <div className="flex gap-2">
                   {(['lowpass', 'highpass'] as const).map(t => (
                     <button
                       key={t}
                       onClick={() => setFilterType(t)}
                       className={`flex-1 py-1 text-xs rounded border ${filterType === t ? 'bg-zinc-600 border-zinc-500 text-white' : 'border-zinc-700 text-zinc-500'}`}
                     >
                       {t === 'lowpass' ? 'Low Cut' : 'High Cut'}
                     </button>
                   ))}
                 </div>

                 <div className="space-y-2">
                    <div className="flex justify-between">
                       <label className="text-[10px] text-zinc-400">Cutoff Freq</label>
                       <span className="text-[10px] font-mono text-zinc-300">{filterFreq} Hz</span>
                    </div>
                    <input 
                      type="range" 
                      min="50" max="2000" step="10"
                      value={filterFreq}
                      onChange={(e) => setFilterFreq(Number(e.target.value))}
                      className="w-full h-1.5 bg-zinc-900 rounded-lg appearance-none cursor-pointer accent-zinc-400"
                    />
                 </div>
              </div>
           </div>
           
           {/* Play Button */}
           <div className="mt-auto pt-4">
             <button
               onClick={() => onToggle(getSoundData())}
               className={`w-full h-14 rounded-xl font-bold text-lg tracking-widest uppercase transition-all shadow-lg flex items-center justify-center gap-3 ${
                 isPlaying 
                 ? 'bg-red-500/10 text-red-500 border border-red-500/50 hover:bg-red-500/20' 
                 : 'bg-zinc-100 text-zinc-900 hover:bg-white hover:scale-[1.02]'
               }`}
             >
               {isPlaying ? (
                 <>
                   <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                    </span>
                   Stop Generator
                 </>
               ) : (
                 <>
                   <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
                   Activate
                 </>
               )}
             </button>
           </div>

        </div>

      </div>
    </div>
  );
};
