import { useState, useEffect } from 'react';
import { SOUNDS } from './constants';
import { SoundCard } from './components/SoundCard';
import { CustomBuilder } from './components/CustomBuilder';
import { audioEngine } from './services/audioEngine';
import { ActiveSoundState, SoundCategory, SoundData } from './types';

export default function App() {
  // Track active state for each sound ID
  const [activeSounds, setActiveSounds] = useState<Record<string, ActiveSoundState>>({});
  const [isEngineStarted, setIsEngineStarted] = useState(false);
  const [filter, setFilter] = useState<SoundCategory | 'All' | 'Lab'>('All');
  const [showLab, setShowLab] = useState(false);

  // Timer State
  const [timerDuration, setTimerDuration] = useState<number | null>(null); // Total minutes
  const [timeLeft, setTimeLeft] = useState<number | null>(null); // Seconds remaining

  // Sync showLab with filter
  useEffect(() => {
    setShowLab(filter === 'Lab');
  }, [filter]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft === null) return;

    if (timeLeft <= 0) {
      stopAll();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft]);

  const cycleTimer = () => {
    if (timerDuration === null) {
      setTimerDuration(15);
      setTimeLeft(15 * 60);
    } else if (timerDuration === 15) {
      setTimerDuration(30);
      setTimeLeft(30 * 60);
    } else if (timerDuration === 30) {
      setTimerDuration(60);
      setTimeLeft(60 * 60);
    } else {
      // Turn off
      setTimerDuration(null);
      setTimeLeft(null);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const toggleSound = async (id: string, customData?: SoundData) => {
    if (!isEngineStarted) {
      await audioEngine.resume();
      setIsEngineStarted(true);
    }

    // Handle Custom Sound
    if (id === 'custom-builder' && customData) {
      setActiveSounds(prev => {
        const newState = { ...prev };
        const current = newState[id];

        if (current?.isPlaying) {
          // Toggle off
          audioEngine.stop(id);
          newState[id] = { ...current, isPlaying: false };
        } else {
          // Start
          audioEngine.play(customData, current?.volume || 0.5);
          newState[id] = { isPlaying: true, volume: current?.volume || 0.5 };
        }
        return newState;
      });
      return;
    }

    // Handle Library Sound
    const sound = SOUNDS.find(s => s.id === id);
    if (!sound) return;

    setActiveSounds(prev => {
      const newState = { ...prev };
      const current = newState[id];

      if (current?.isPlaying) {
        // Stop
        audioEngine.stop(id);
        newState[id] = { ...current, isPlaying: false };
      } else {
        // Play
        const vol = current?.volume || 0.5;
        audioEngine.play(sound, vol);
        newState[id] = { isPlaying: true, volume: vol };
      }
      return newState;
    });
  };

  const updateVolume = (id: string, vol: number) => {
    audioEngine.setVolume(id, vol);
    setActiveSounds(prev => ({
      ...prev,
      [id]: { ...prev[id], volume: vol }
    }));
  };

  const stopAll = () => {
    audioEngine.stopAll();
    // Clear timer when stopping all
    setTimerDuration(null);
    setTimeLeft(null);
    
    setActiveSounds(prev => {
      const newState: Record<string, ActiveSoundState> = {};
      Object.keys(prev).forEach(key => {
        const current = prev[key];
        if (current) {
          newState[key] = { ...current, isPlaying: false };
        }
      });
      return newState;
    });
  };

  // Calculate active count for sticky header
  const activeCount = Object.values(activeSounds).filter((s: ActiveSoundState) => s.isPlaying).length;

  // Filter logic
  const filteredSounds = filter === 'All'
    ? SOUNDS
    : filter === 'Lab'
    ? [] // Don't show sounds when lab is active
    : SOUNDS.filter(s => s.category === filter);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col items-center pb-32">
      
      {/* Hero / Header */}
      <header className="w-full max-w-6xl px-6 py-12 md:py-16 text-center relative">
        <h1 className="text-5xl md:text-7xl font-thin tracking-[0.2em] text-zinc-100 mb-6 animate-fade-in">
          RESONATE
        </h1>
        <p className="text-zinc-400 max-w-2xl mx-auto text-lg font-light leading-relaxed">
          A scientifically-grounded sonic playground. Curate your environment using psychoacoustic frequencies, binaural entrainment, and colored noise.
        </p>
      </header>


      {/* Filter Tabs */}
      <div className="sticky top-0 z-20 bg-zinc-950/80 backdrop-blur-md w-full flex justify-center border-b border-zinc-800 mb-10">
        <div className="flex gap-2 p-4 overflow-x-auto max-w-full no-scrollbar">
           {/* Regular category tabs */}
           {['All', ...Object.values(SoundCategory).filter(c => c !== 'Custom')].map((cat) => (
             <button
               key={cat}
               onClick={() => setFilter(cat as any)}
               className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${filter === cat ? 'bg-zinc-100 text-zinc-900' : 'text-zinc-500 hover:text-zinc-300'}`}
             >
               {cat}
             </button>
           ))}
           {/* Lab tab with distinctive styling */}
           <button
             onClick={() => setFilter('Lab')}
             className={`px-4 py-2 rounded-full text-sm font-medium transition-colors whitespace-nowrap border-2 ${filter === 'Lab' ? 'bg-amber-500 text-amber-900 border-amber-500' : 'text-amber-400 border-amber-700 hover:border-amber-500 hover:text-amber-300'}`}
           >
             Lab
           </button>
        </div>
      </div>


      {/* Custom Builder Section */}
      {showLab && (
        <CustomBuilder 
          isPlaying={activeSounds['custom-builder']?.isPlaying || false}
          onToggle={(data) => toggleSound('custom-builder', data)}
        />
      )} 

      {/* Grid */}
      <main className="w-full max-w-7xl px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSounds.map(sound => (
          <SoundCard
            key={sound.id}
            data={sound}
            isPlaying={activeSounds[sound.id]?.isPlaying || false}
            volume={activeSounds[sound.id]?.volume ?? 0.5}
            onToggle={() => toggleSound(sound.id)}
            onVolumeChange={(vol) => updateVolume(sound.id, vol)}
          />
        ))}
      </main>

      {/* Global Floating Controls */}
      <div className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-30 transition-all duration-500 ${activeCount > 0 ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}>
        <div className="bg-zinc-900/90 backdrop-blur-xl border border-zinc-700 text-zinc-100 px-6 py-3 rounded-full shadow-2xl flex items-center gap-6">
          <div className="flex flex-col">
             <span className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Active</span>
             <span className="font-mono text-lg">{activeCount} Sound{activeCount !== 1 ? 's' : ''}</span>
          </div>
          
          <div className="h-8 w-px bg-zinc-700"></div>
          
          {/* Timer Control */}
          <button 
            onClick={cycleTimer}
            className="flex items-center gap-2 group"
            title="Sleep Timer"
          >
            <div className={`p-2 rounded-full transition-colors ${timeLeft !== null ? 'bg-emerald-900/30 text-emerald-400' : 'bg-zinc-800 text-zinc-500 group-hover:bg-zinc-700'}`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>
            <div className="flex flex-col items-start min-w-[40px]">
              <span className="text-[10px] uppercase font-bold text-zinc-500">Timer</span>
              <span className={`font-mono text-sm ${timeLeft !== null ? 'text-emerald-400' : 'text-zinc-600'}`}>
                {timeLeft !== null ? formatTime(timeLeft) : 'Off'}
              </span>
            </div>
          </button>

          <div className="h-8 w-px bg-zinc-700"></div>

          <button 
            onClick={stopAll}
            className="bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-widest transition-colors"
          >
            Stop All
          </button>
        </div>
      </div>

      {/* Engine Starter */}
      {!isEngineStarted && (
        <div className="fixed inset-0 z-50 bg-zinc-950/90 backdrop-blur-sm flex items-center justify-center" onClick={() => { audioEngine.resume(); setIsEngineStarted(true); }}>
          <div className="text-center cursor-pointer group">
            <div className="w-20 h-20 mx-auto bg-zinc-100 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-zinc-900 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"></path></svg>
            </div>
            <h2 className="text-2xl font-light text-zinc-100">Enter the Resonate Space</h2>
            <p className="text-zinc-500 mt-2">Tap anywhere to initialize the audio engine</p>
          </div>
        </div>
      )}
      
    </div>
  );
}
