import { SoundCategory, SoundData } from "./types";

export const SOUNDS: SoundData[] = [
  // --- Sleep Category ---
  {
    id: 'noise-night',
    title: 'Night Shade',
    category: SoundCategory.SLEEP,
    frequencyDisplay: 'Deep Low Pass',
    description: 'Darker than brown noise. A warm, womb-like rumble designed to keep you asleep.',
    scientificClaim: 'By aggressively filtering out high frequencies (>300Hz), this sound minimizes "startle response" triggers while masking environmental interruptions.',
    isPseudo: false,
    type: 'noise',
    noiseType: 'brown',
    filterType: 'lowpass',
    filterFreq: 300,
    filterQ: 1
  },
  {
    id: 'binaural-4',
    title: 'Theta Dream',
    category: SoundCategory.SLEEP,
    frequencyDisplay: '4.5 Hz Beat',
    description: 'Deep meditation, light sleep, and REM dreaming.',
    scientificClaim: 'Theta activity is associated with memory encoding and the twilight state before sleep (hypnagogia).',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 150,
    beatFreq: 4.5
  },
  {
    id: 'binaural-2',
    title: 'Delta Restoration',
    category: SoundCategory.SLEEP,
    frequencyDisplay: '2 Hz Beat',
    description: 'Deep, dreamless sleep and physical regeneration.',
    scientificClaim: 'Delta waves (0.5-4Hz) are dominant during NREM stage 3 deep sleep, characterized by high amplitude and low frequency. Essential for healing.',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 100,
    beatFreq: 2
  },
  {
    id: 'binaural-0.5',
    title: 'Deepest Healing',
    category: SoundCategory.SLEEP,
    frequencyDisplay: '0.5 Hz Beat',
    description: 'Profound physical relaxation and empathy. The lowest Delta range.',
    scientificClaim: 'Frequencies below 1Hz are linked to the deepest levels of restorative sleep and the regulation of the autonomic nervous system.',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 100,
    beatFreq: 0.5
  },

  // --- Solfeggio & Frequencies ---
  {
    id: 'freq-174',
    title: 'Pain Relief',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '174 Hz',
    description: 'The lowest Solfeggio tone, often treated as a natural anaesthetic.',
    scientificClaim: 'Low frequency vibration (vibroacoustic therapy) can physically relax muscle tension and reduce perceived pain signals.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 174
  },
  {
    id: 'solfeggio-417',
    title: 'Facilitating Change',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '417 Hz',
    description: 'Clears negativity and undoes stagnation.',
    scientificClaim: 'In color therapy and chakra systems, this frequency is associated with the sacral chakra, governing emotions and creativity.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 417
  },
  {
    id: 'solfeggio-432',
    title: 'Universal Frequency',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '432 Hz',
    description: 'A pitch often cited as being mathematically consistent with the universe.',
    scientificClaim: 'Proponents claim instruments tuned to 432Hz are more harmonic than standard 440Hz, though physics regards pitch as arbitrary.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 432
  },
  {
    id: 'solfeggio-528',
    title: 'Transformation',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '528 Hz',
    description: 'Known as the "Miracle" tone, used for grounding and repair.',
    scientificClaim: 'Often linked to "DNA Repair" in alternative therapy. While sound affects stress hormones (cortisol), direct DNA manipulation via audio lacks peer-reviewed biological evidence.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 528
  },
  {
    id: 'solfeggio-639',
    title: 'Relational Harmony',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '639 Hz',
    description: 'Enhances communication, understanding, and tolerance.',
    scientificClaim: 'Alternative practitioners use 639Hz to balance the Heart Chakra, fostering connection and repairing relationships.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 639
  },
  {
    id: 'solfeggio-852',
    title: 'Awakening Intuition',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '852 Hz',
    description: 'Helps return to spiritual order and balances overthinking.',
    scientificClaim: 'Sound therapy posits high frequencies can stimulate alertness and mental clarity, metaphorically "opening" the mind.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 852
  },
  {
    id: 'solfeggio-963',
    title: 'Divine Consciousness',
    category: SoundCategory.SOLFEGGIO,
    frequencyDisplay: '963 Hz',
    description: 'The "Frequency of the Gods," activating the pineal gland.',
    scientificClaim: 'Metaphysically linked to the Crown Chakra and the return to "Oneness." No biological evidence exists for pineal activation via sound.',
    isPseudo: true,
    type: 'oscillator',
    baseFreq: 963
  },

  // --- Binaural Beats ---
  {
    id: 'binaural-40',
    title: 'Gamma Peak',
    category: SoundCategory.BINAURAL,
    frequencyDisplay: '40 Hz Beat',
    description: 'High-level information processing and memory recall.',
    scientificClaim: 'Gamma waves (30-100Hz) are linked to the "binding problem" in neuroscience. Studies suggest 40Hz stimulation may reduce Alzheimer’s pathology in mice.',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 200,
    beatFreq: 40
  },
  {
    id: 'binaural-14',
    title: 'Beta Focus',
    category: SoundCategory.BINAURAL,
    frequencyDisplay: '14 Hz Beat',
    description: 'Active, analytical concentration. Good for coding or studying.',
    scientificClaim: 'Beta waves (13-30Hz) dominate during awake, alert states. Entrainment to this range promotes vigilance.',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 200,
    beatFreq: 14
  },
  {
    id: 'binaural-12',
    title: 'Alpha Clarity',
    category: SoundCategory.BINAURAL,
    frequencyDisplay: '12 Hz Beat',
    description: 'High Alpha state for mental stability and absorbing new information.',
    scientificClaim: '12Hz sits on the border of Alpha and Beta waves. It promotes "relaxed alertness," ideal for reading or super-learning tasks.',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 250,
    beatFreq: 12
  },
  {
    id: 'binaural-10',
    title: 'Alpha Relaxation',
    category: SoundCategory.BINAURAL,
    frequencyDisplay: '10 Hz Beat',
    description: 'Calm but alert. The bridge between subconscious and conscious.',
    scientificClaim: 'Alpha waves (8-12Hz) are dominant during "flow states" and meditative relaxation. Proven to reduce anxiety.',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 200,
    beatFreq: 10
  },
  {
    id: 'binaural-8',
    title: 'Alpha Creativity',
    category: SoundCategory.BINAURAL,
    frequencyDisplay: '8 Hz Beat',
    description: 'The bridge between relaxation and creativity. Ideal for artistic flow and visualization.',
    scientificClaim: 'Low Alpha waves (8Hz) are often associated with the synchronization of brain hemispheres and moments of creative insight ("Aha!" moments).',
    isPseudo: false,
    type: 'binaural',
    baseFreq: 200,
    beatFreq: 8
  },
  {
    id: 'binaural-783',
    title: 'Earth Resonance',
    category: SoundCategory.BINAURAL,
    frequencyDisplay: '7.83 Hz Beat',
    description: 'Grounding frequency aligning with Earth\'s electromagnetic field.',
    scientificClaim: 'The Schumann resonances are global electromagnetic resonances (7.83Hz). While physical, biological entrainment claims are largely pseudo-scientific.',
    isPseudo: true,
    type: 'binaural',
    baseFreq: 144,
    beatFreq: 7.83
  },

  // --- Noise ---
  {
    id: 'noise-violet',
    title: 'Violet Noise',
    category: SoundCategory.NOISE,
    frequencyDisplay: 'High Pass',
    description: 'Sharp, hissing static. Concentrates energy at high frequencies.',
    scientificClaim: 'Violet noise power density increases 6 dB per octave. It is sometimes used in tinnitus retraining therapy to mask high-pitched ringing.',
    isPseudo: false,
    type: 'noise',
    noiseType: 'violet'
  },
  {
    id: 'noise-white',
    title: 'White Noise',
    category: SoundCategory.NOISE,
    frequencyDisplay: 'Static',
    description: 'Pure static. Equal energy per frequency.',
    scientificClaim: 'The most effective noise for masking all background sounds equally. Used heavily in office privacy systems and sleep machines.',
    isPseudo: false,
    type: 'noise',
    noiseType: 'white'
  },
  {
    id: 'noise-pink',
    title: 'Pink Noise',
    category: SoundCategory.NOISE,
    frequencyDisplay: '1/f Filter',
    description: 'Balanced frequency spectrum. Like steady rain or wind.',
    scientificClaim: 'Studies (e.g., Northwestern Medicine) show syncing Pink Noise to brainwaves during sleep improves deep sleep quality and memory retention in older adults.',
    isPseudo: false,
    type: 'noise',
    noiseType: 'pink'
  },
  {
    id: 'noise-brown',
    title: 'Brown Noise',
    category: SoundCategory.NOISE,
    frequencyDisplay: 'Low Pass',
    description: 'Deep, rumbling static. Like a distant waterfall or thunder.',
    scientificClaim: 'Anecdotal evidence strongly supports Brown Noise for quieting the "internal monologue" in ADHD minds, likely due to stochastic resonance.',
    isPseudo: false,
    type: 'noise',
    noiseType: 'brown'
  },
  {
    id: 'noise-green',
    title: 'Green Noise',
    category: SoundCategory.NOISE,
    frequencyDisplay: 'Mid Range',
    description: 'Centered on mid-range frequencies. Similar to ambient nature.',
    scientificClaim: 'Often called "the background noise of the world," it masks distracting high-pitched sounds without the harshness of White Noise.',
    isPseudo: true,
    type: 'noise',
    noiseType: 'green'
  },
];