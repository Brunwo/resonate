import React from 'react';
import { SoundData, SoundCategory } from '../types';

interface SoundCardProps {
  data: SoundData;
  isPlaying: boolean;
  volume: number;
  onToggle: () => void;
  onVolumeChange: (val: number) => void;
}

export const SoundCard: React.FC<SoundCardProps> = ({
  data,
  isPlaying,
  volume,
  onToggle,
  onVolumeChange
}) => {
  // Category colors
  const getAccentColor = () => {
    switch (data.category) {
      case SoundCategory.SOLFEGGIO: return 'text-violet-400 border-violet-500/30 bg-violet-900/10 group-hover:border-violet-500/50';
      case SoundCategory.BINAURAL: return 'text-cyan-400 border-cyan-500/30 bg-cyan-900/10 group-hover:border-cyan-500/50';
      case SoundCategory.NOISE: return 'text-amber-400 border-amber-500/30 bg-amber-900/10 group-hover:border-amber-500/50';
      default: return 'text-zinc-400';
    }
  };

  const getGlow = () => {
    if (!isPlaying) return '';
    switch (data.category) {
      case SoundCategory.SOLFEGGIO: return 'shadow-[0_0_20px_rgba(139,92,246,0.2)] border-violet-500';
      case SoundCategory.BINAURAL: return 'shadow-[0_0_20px_rgba(6,182,212,0.2)] border-cyan-500';
      case SoundCategory.NOISE: return 'shadow-[0_0_20px_rgba(245,158,11,0.2)] border-amber-500';
      default: return '';
    }
  };

  return (
    <div className={`group relative p-6 rounded-2xl border transition-all duration-300 ${isPlaying ? getGlow() + ' bg-zinc-900' : 'bg-zinc-900/50 border-zinc-800 hover:bg-zinc-900'}`}>
      
      {/* Header */}
      <div className="flex justify-between items-start mb-3">
        <div>
          <span className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded-full border ${getAccentColor().split(' group')[0]} bg-opacity-20`}>
            {data.category}
          </span>
          <h3 className="text-xl font-light text-zinc-100 mt-3 leading-none">{data.title}</h3>
          <p className={`text-sm font-mono mt-1 opacity-80 ${getAccentColor().split(' ')[0]}`}>{data.frequencyDisplay}</p>
        </div>
        <button 
          onClick={onToggle}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isPlaying ? 'bg-zinc-100 text-zinc-950 scale-110' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'}`}
        >
          {isPlaying ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          ) : (
             <svg className="w-4 h-4 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
          )}
        </button>
      </div>

      {/* Description */}
      <p className="text-zinc-400 text-sm leading-relaxed mb-4 min-h-[40px]">
        {data.description}
      </p>

      {/* Controls (Visible when playing) */}
      <div className={`overflow-hidden transition-all duration-300 ${isPlaying ? 'max-h-24 opacity-100 mt-4' : 'max-h-0 opacity-0'}`}>
        <div className="flex items-center gap-3">
           <svg className="w-4 h-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"></path></svg>
           <input 
             type="range" 
             min="0" 
             max="1" 
             step="0.01" 
             value={volume}
             onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
             className={`flex-1 h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer ${getAccentColor().split(' ')[0]}`}
           />
        </div>
      </div>

      {/* Scientific Footnote */}
      <div className="mt-5 pt-4 border-t border-zinc-800/50">
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-1.5 h-1.5 rounded-full ${data.isPseudo ? 'bg-amber-500' : 'bg-emerald-500'}`}></span>
          <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold">
            {data.isPseudo ? 'Alternative Theory' : 'Scientific Basis'}
          </span>
        </div>
        <p className="text-xs text-zinc-500 italic leading-relaxed">
          "{data.scientificClaim}"
        </p>
      </div>
    </div>
  );
};