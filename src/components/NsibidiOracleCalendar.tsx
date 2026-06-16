import React, { useState } from "react";
import { 
  Compass, 
  Moon, 
  Sparkles, 
  Layers, 
  Calendar, 
  Clock, 
  Volume2, 
  VolumeX, 
  RefreshCw, 
  Info, 
  ChevronRight, 
  BookOpen, 
  HelpCircle 
} from "lucide-react";

// Web Audio synthesizer for mystic sound triggers
const playMysticSound = (type: "drum" | "chant") => {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (type === "drum") {
      // Simulate rich bass traditional log drum (Udu / Ikoro sound)
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(75, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      
      gain.gain.setValueAtTime(0.8, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.45);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === "chant") {
      // Simulate ethereal rising synth string/chord sweep
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = "triangle";
      osc1.frequency.setValueAtTime(220, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(329.6, ctx.currentTime + 1.1); // Harmony Fifth
      
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(164.8, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(246.9, ctx.currentTime + 1.1);
      
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1.25);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 1.3);
      osc2.stop(ctx.currentTime + 1.3);
    }
  } catch (err) {
    console.warn("Web Audio API blocked or not supported:", err);
  }
};

// Igbo traditional lunar months & spiritual festivals
const FESTIVALS_TIMELINE = [
  { era: "Onwa Izizi (First Moon)", name: "Ifejioku Harvest Covenant", date: "June Solstice", desc: "Honoring the soil matrix and primordial seed elements. Central focus: Yam essence (Ji)." },
  { era: "Onwa Asato (Eighth Moon)", name: "Iri Ji (New Yam Festival)", date: "Late August", desc: "The grand cosmic transition. Sharing first fruits in community squares, accompanied by secret logogram flags." },
  { era: "Onwa Iri (Tenth Moon)", name: "Ikeji Arondizuogu Alliance", date: "Autumnal Tides", desc: "The convergence of guilds and traditional masquerades. High-strength protective sigil shields are drafted." },
  { era: "Onwa Mmiri (Rain Epoch)", name: "Mami Wata Ocean Reverence", date: "Deep Winter Tide", desc: "Sacred fluid communion at the delta. Water/reflection alignments are explored in silent meditation." }
];

// Igbo 4 cosmological horoscope division signs index
const HOROSCOPES = [
  {
    signName: "Amadioha",
    signTitle: "The Sky Fire / Thunder Spirit",
    period: "Conjunction of Light (Mar 21 - Jun 20)",
    glyphSvg: `<polyline points="35,15 50,45 25,50 65,85" stroke="currentColor" stroke-width="2.5" fill="none" />
               <circle cx="65" cy="85" r="4" fill="currentColor" />`,
    strength: "Incorruptible drive, radical truth, intense action metrics",
    tip: "Let grounding earth soothe your peak sparks; balance fire with cool reflective stream water.",
    tradition: "Associated with red solar clays and high judicial oak groves."
  },
  {
    signName: "Ala",
    signTitle: "The Great Womb / Earth Mother",
    period: "Epoch of Abundance (Jun 21 - Sep 22)",
    glyphSvg: `<path d="M20,50 C20,30 50,15 50,50 C50,85 80,70 80,50" stroke="currentColor" stroke-width="2.5" fill="none" />
               <circle cx="50" cy="50" r="5" fill="currentColor" />`,
    strength: "Generational memory, deep empathy, unbreakable stability",
    tip: "Anchor your heels in traditional ways; do not let chaotic wind gusts pull your roots from the soil.",
    tradition: "Symbolizes communal covenant temples and agricultural cycles."
  },
  {
    signName: "Agwu",
    signTitle: "The Mystic Guide of Spontaneity",
    period: "Equinox of Divine Choice (Sep 23 - Dec 21)",
    glyphSvg: `<path d="M50,20 L50,80 M20,50 L80,50" stroke="currentColor" stroke-width="2.5" />
               <circle cx="50" cy="50" r="16" stroke="currentColor" fill="none" stroke-width="1.8" />
               <circle cx="20" cy="50" r="3" fill="currentColor" />
               <circle cx="80" cy="50" r="3" fill="currentColor" />`,
    strength: "Dual wisdom, creative chaos, healing insight, adaptation",
    tip: "Embrace the double spiral of reality; understand that linear answers rarely fit circular problems.",
    tradition: "Connected to herbal medicine, spiritual oracles, and sacred arts."
  },
  {
    signName: "Ani",
    signTitle: "The Fluid Tide / Sacred Wave",
    period: "Winter lunar tides (Dec 22 - Mar 20)",
    glyphSvg: `<path d="M15,40 Q32.5,15 50,40 T85,40" stroke="currentColor" stroke-width="2.5" fill="none" />
               <path d="M15,60 Q32.5,35 50,60 T85,60" stroke="currentColor" stroke-width="2.5" fill="none" />`,
    strength: "Intuitive detection, deep dream tracking, water-like flexibility",
    tip: "Speak only after the highest tide has retreated. True silence carries absolute authority.",
    tradition: "Governs secret stream crossings and deep-ocean spirit covenants."
  }
];

// Tarot Deck representing 4 legendary Nsibidi archetypes 
const TAROT_CARDS = [
  {
    id: "nze",
    name: "NZE (The Sacred Initiate)",
    svg: `<circle cx="50" cy="50" r="28" stroke="currentColor" stroke-width="2" fill="none" stroke-dasharray="3 3"/>
          <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" stroke-width="2.5" />
          <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" stroke-width="2.5" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />`,
    upright: "New spiritual quests, boundless courage, stepping past boundaries.",
    advice: "An old threshold is dissolving around you today. Take the bold leap of Nze. The ancestral council has prepared the pathway."
  },
  {
    id: "afa",
    name: "AFA (The Cosmic Oracle)",
    svg: `<path d="M50,20 C32,20 18,50 18,50 C18,50 32,80 50,80 C68,80 82,50 82,50 C82,50 68,20 50,20 Z" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="12" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="50" r="4" fill="currentColor" />`,
    upright: "Hidden alignments made manifest, supreme clarity, celestial guidance.",
    advice: "Step quiet into the forest of your thoughts. An unexpected transmission of clarity is coming. The oracle sees the truth."
  },
  {
    id: "ezeala",
    name: "EZE-ALA (The Ancestor')",
    svg: `<path d="M50,15 L15,85 L85,85 Z" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="50" cy="45" r="5" fill="currentColor" />
          <circle cx="35" cy="70" r="5" fill="currentColor" />
          <circle cx="65" cy="70" r="5" fill="currentColor" />`,
    upright: "Rooted protection, lineage wisdom, ancient pacts, secure shelters.",
    advice: "You are not walking alone; you carry the composite matrix of those who walked before you. Honor history and stay secure."
  },
  {
    id: "iyi",
    name: "IYI (The Primordial Pact)",
    svg: `<path d="M50,50 C50,30 80,30 80,50 C80,70 50,70 50,50 C50,30 20,30 20,50 C20,70 50,70 50,50" stroke="currentColor" stroke-width="2" fill="none" />
          <circle cx="35" cy="50" r="3" fill="currentColor" />
          <circle cx="65" cy="50" r="3" fill="currentColor" />`,
    upright: "Flowing adapter cycles, deep emotional clearing, legal alignments.",
    advice: "Let temporary situations flow through your fingers like deep river sand. Adapt quickly and do not fight the cosmic tide."
  }
];

// Core 4 traditional market quadrants for the calendar wheel
const CALENDAR_QUADRANTS = [
  {
    id: "eke",
    market: "EKE",
    direction: "EAST (Fire / Initiation)",
    overlord: "Anyanwụ",
    glowingColor: "rgba(255, 120, 0, 0.4)",
    borderColor: "border-orange-500/45",
    accentText: "text-orange-400",
    meanings: "The inception of creative thought, cleansing spiritual fields, launching primary active projects."
  },
  {
    id: "orie",
    market: "ORIE",
    direction: "WEST (Water / Reflection)",
    overlord: "Osun / Waters",
    glowingColor: "rgba(0, 240, 255, 0.4)",
    borderColor: "border-cyber-blue/45",
    accentText: "text-cyber-blue",
    meanings: "Deep contemplation, establishing community alliances, gathering internal strength for long paths."
  },
  {
    id: "afo",
    market: "AFO",
    direction: "NORTH (Earth / Harvest)",
    overlord: "Ala Goddess",
    glowingColor: "rgba(16, 185, 129, 0.4)",
    borderColor: "border-emerald-500/45",
    accentText: "text-emerald-400",
    meanings: "Fecundity, anchoring wealth foundations, expressing deep gratitude to our shared land systems."
  },
  {
    id: "nkwo",
    market: "NKWO",
    direction: "SOUTH (Air / councils)",
    overlord: "Agwu Spirit",
    glowingColor: "rgba(188, 0, 221, 0.4)",
    borderColor: "border-fuchsia-500/45",
    accentText: "text-fuchsia-400",
    meanings: "The flowing stream of news, market transactions, diplomatic logic, and intellectual debates."
  }
];

// Presets for the "Cast Daily Lots" generator (randomly combined lines of divination)
const DAILY_LOTS_POOL = [
  { title: "THE COMPASS OF COVENANT", text: "Three concentric loops converge on the eastern crossroads. Guard your word." },
  { title: "REVELATION IN THE VOID", text: "The solar wheel rests in eclipse. Quiet preparation is more powerful than shouting." },
  { title: "FLOW OF TRIPLE SPRINGS", text: "Two zigzag streams pass a central anchor dot. Adapt fluidly to unexpected family news." },
  { title: "THE CHIEFTAIN'S ASCENT", text: "Dual upward arrows rise above the protective border grid. Destiny calls for leadership." },
  { title: "ANCESTRAL COMFORT", text: "Footprint glyphs indicate a quiet road behind you. Your legacy shields your current decisions." }
];

export const NsibidiOracleCalendar: React.FC = () => {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [activeQuad, setActiveQuad] = useState<string>("eke");
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [expandedReading, setExpandedReading] = useState<string | null>(null);
  
  // Daily lots state
  const [dailyLot, setDailyLot] = useState<any>(DAILY_LOTS_POOL[0]);
  const [isCasting, setIsCasting] = useState(false);
  
  // Hidden tarot cards status
  const [flippedTarot, setFlippedTarot] = useState<{ [key: string]: boolean }>({
    nze: false,
    afa: false,
    ezeala: false,
    iyi: false
  });

  const handleSoundTrigger = (type: "drum" | "chant") => {
    if (soundEnabled) {
      playMysticSound(type);
    }
  };

  const handleWheelMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Tilt max 15deg
    const rotateX = -(y / (rect.height / 2)) * 15;
    const rotateY = (x / (rect.width / 2)) * 15;
    
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleWheelMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Flip tarot handler
  const toggleTarot = (id: string) => {
    handleSoundTrigger("drum");
    setFlippedTarot(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Cast Daily divination coordinates
  const triggerDailyCast = () => {
    setIsCasting(true);
    handleSoundTrigger("chant");
    
    // Simulate computational oracle scanning mist
    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * DAILY_LOTS_POOL.length);
      setDailyLot(DAILY_LOTS_POOL[randomIdx]);
      setIsCasting(false);
    }, 1100);
  };

  const currentQuadData = CALENDAR_QUADRANTS.find(q => q.id === activeQuad) || CALENDAR_QUADRANTS[0];

  return (
    <div className="border-t border-cyber-blue/15 pt-16 mt-16" id="cosmologicalSection">
      
      {/* HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-[4px] font-bold">
              IGBO COSMOLOGICAL ORACLE & CALENDAR MATRIX
            </span>
          </div>
          <h2 className="font-display text-2xl sm:text-3xl font-black uppercase tracking-[3px] text-white">
            COSMIC DIVISION & HOROSCOPES
          </h2>
          <p className="text-xs text-ash mt-1 max-w-2xl leading-relaxed">
            Unfold ancient West African temporal dynamics. Align to traditional Igbo Market Quadrants, trace mystical horoscope timelines, and decode Nsibidi Tarot spreads fused with next-gen holographic interfaces.
          </p>
        </div>

        {/* Audio monitor switch client-side */}
        <div className="flex items-center gap-2.5 bg-black/55 border border-emerald-500/20 px-4 py-2.5 rounded-lg select-none">
          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if(!soundEnabled) playMysticSound("drum");
            }}
            className="text-ash hover:text-white flex items-center gap-2 transition-colors test-audio-btn text-[10px] font-mono tracking-widest uppercase font-semibold cursor-pointer"
          >
            {soundEnabled ? (
              <>
                <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>CHUNTS MONITOR: ON</span>
              </>
            ) : (
              <>
                <VolumeX className="w-4 h-4 text-red-500/60" />
                <span>CHUNTS MONITOR: OFF</span>
              </>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
        
        {/* LEFT COLUMN (8-SPAN): THE SACRED ROTATING CALENDAR WHEEL & DIVINATION VIEW */}
        <div className="lg:col-span-8 flex flex-col justify-between glass-card border border-emerald-500/20 p-6 sm:p-8 rounded-xl relative overflow-hidden emerald-bronze-mesh">
          
          {/* Futuristic Matrix grids in background */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.01)_1px,transparent_1px),linear-gradient(90deg,rgba(16,185,129,0.01)_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
            
            {/* 3D PARALLAX ROTATING CALENDAR WHEEL CONTAINER */}
            <div className="md:col-span-6 flex flex-col items-center justify-center">
              <span className="text-[9px] font-mono tracking-[3px] text-emerald-400 uppercase mb-4 opacity-75 font-bold">
                DRAG OR HOVER TO PARALLAX TILT
              </span>

              <div
                onMouseMove={handleWheelMouseMove}
                onMouseLeave={handleWheelMouseLeave}
                style={{
                  transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
                  transformStyle: "preserve-3d"
                }}
                className="relative w-[230px] h-[230px] xs:w-[270px] xs:h-[270px] rounded-full border border-orange-500/25 flex items-center justify-center transition-all duration-200 cursor-pointer shadow-[0_0_40px_rgba(199,143,62,0.1)] bg-black/60 overflow-hidden"
              >
                {/* Embedded sacred text overlay as backdrop */}
                <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] select-none pointer-events-none uppercase font-serif font-black text-center text-4xl leading-tight">
                  EKE ORIE<br />AFO NKWO<br />AFA COVENANT
                </div>

                {/* Rotating Bronze-colored Outer Celestial Ring */}
                <div className="absolute inset-2 border-2 border-dashed border-orange-500/15 rounded-full animate-slow-spin flex items-center justify-center">
                  <div className="w-[85%] h-[85%] border border-[#c78f3e]/30 rounded-full border-dotted" />
                </div>

                <div className="absolute inset-8 rounded-full border border-emerald-500/25 bg-[#030705]/80 flex items-center justify-center">
                  {/* Wheel Axis Crosslines mapping the 4 Market Quadrants */}
                  <div className="absolute inset-0 w-full h-[0.5px] bg-emerald-500/25 top-1/2" />
                  <div className="absolute inset-0 h-full w-[0.5px] bg-emerald-500/25 left-1/2" />

                  {/* Complete interactive quadrant areas */}
                  <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                    {CALENDAR_QUADRANTS.map((quad) => (
                      <button
                        key={quad.id}
                        onClick={() => {
                          setActiveQuad(quad.id);
                          handleSoundTrigger("drum");
                        }}
                        className={`transition-all duration-300 flex flex-col items-center justify-center p-2 group/quad select-none cursor-pointer border-collapse
                          ${
                            activeQuad === quad.id 
                              ? "bg-emerald-500/10 shadow-[inner_0_0_12px_rgba(16,185,129,0.3)] font-extrabold" 
                              : "hover:bg-white/5 opacity-70 hover:opacity-100"
                          }`}
                      >
                        <span className={`text-xs tracking-widest font-mono font-black ${activeQuad === quad.id ? quad.accentText : "text-white/60"}`}>
                          {quad.market}
                        </span>
                        <span className="text-[7.5px] font-mono tracking-tighter opacity-50 uppercase scale-90">
                          {quad.id === "eke" ? "East" : quad.id === "orie" ? "West" : quad.id === "afo" ? "North" : "South"}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Center glowing golden eye/matrix pivot core */}
                  <div
                    onClick={() => {
                      setExpandedReading(currentQuadData.market);
                      handleSoundTrigger("chant");
                    }} 
                    className="relative w-12 h-12 rounded-full border border-orange-500 bg-[#150d03] flex items-center justify-center shadow-[0_0_15px_rgba(199,143,62,0.5)] cursor-pointer group hover:scale-110 active:scale-90 transition-transform z-10 select-none animate-pulse"
                  >
                    <Compass className="w-5 h-5 text-orange-400 group-hover:rotate-45 transition-transform" />
                  </div>
                </div>
              </div>
            </div>

            {/* HOLOGRAM PANEL SHOWING ACTIVE QUADRANT DIVINATION TELEMETRY */}
            <div className="md:col-span-6 space-y-5">
              <div className="border border-orange-500/20 bg-[#120e0a]/80 backdrop-blur-xl p-5 rounded-lg relative overflow-hidden group hover:border-orange-500/40 transition-colors">
                
                {/* Ambient glowing coordinates */}
                <div className="absolute top-2 right-2 text-[8px] font-mono text-orange-400 font-semibold uppercase tracking-widest">
                  COSMIC POSITION
                </div>

                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full bg-orange-400/20 border border-orange-400 animate-pulse`} />
                  <div>
                    <span className="text-[10px] font-mono text-orange-400 font-bold uppercase tracking-widest block">IGBO MARKET DAY</span>
                    <h3 className="font-display text-lg font-black tracking-widest text-white uppercase mt-0.5">
                      {currentQuadData.market} ARCHETYPES
                    </h3>
                  </div>
                </div>

                <div className="mt-4 space-y-3.5 border-t border-[#c78f3e]/15 pt-3.5">
                  <div>
                    <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400 block mb-0.5">Cardinal Direction</span>
                    <p className="text-white text-xs font-mono font-bold">{currentQuadData.direction}</p>
                  </div>

                  <div>
                    <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400 block mb-0.5">Cosmic Overlord</span>
                    <p className="text-white text-xs font-mono font-bold">{currentQuadData.overlord}</p>
                  </div>

                  <div>
                    <span className="text-[8px] font-mono tracking-widest uppercase text-emerald-400 block mb-0.5">Divination Guideline</span>
                    <p className="text-[#f5f0e1]/85 text-xs font-serif leading-relaxed italic">
                      "{currentQuadData.meanings}"
                    </p>
                  </div>
                </div>

                {/* Instant reading feedback activator button */}
                <button
                  onClick={() => {
                    setExpandedReading(currentQuadData.market);
                    handleSoundTrigger("chant");
                  }}
                  className="mt-5 w-full bg-emerald-500 hover:bg-orange-500 text-black hover:text-white transition-all py-2.5 px-4 rounded-lg font-mono text-[10px] tracking-widest uppercase cursor-pointer text-center font-bold shadow-[0_0_12px_rgba(16,185,129,0.2)] hover:scale-102 active:scale-95"
                >
                  Expand 3D Divination Reading
                </button>
              </div>

              {/* Expansion dialog whenClicked */}
              {expandedReading && (
                <div className="border border-emerald-500/40 bg-[#06140f]/95 p-4 rounded-lg animate-[text-fade_0.4s_ease-out_forwards]">
                  <div className="flex justify-between items-center mb-2 inline-block">
                    <span className="text-[9px] font-mono text-emerald-300 tracking-wider font-bold">📡 EXPANDED TRANSMISSION DECLARATION</span>
                    <button 
                      onClick={() => setExpandedReading(null)} 
                      className="text-ash hover:text-white font-mono text-[9px] cursor-pointer font-bold ml-2 border border-white/10 px-1.5 py-0.5 rounded"
                    >
                      CLEAR
                    </button>
                  </div>
                  <p className="text-xs text-emerald-300 leading-relaxed font-sans">
                    <strong>Quantum Alignment:</strong> Casting lots in the meridian of <span className="font-bold underline">{expandedReading}</span> indicates a powerful surge of ancestral support. Balance boundaries carefully, and seek reflective water markers in the physical plane before taking irreversible steps.
                  </p>
                </div>
              )}
            </div>

          </div>

          {/* LOWER SECTION OF THE INNER CONTAINER: THE SCROLLING DAILY DIVINATION INITIATION */}
          <div className="mt-8 border-t border-emerald-500/15 pt-6 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            <div className="md:col-span-8">
              <h4 className="font-mono text-[11px] text-orange-400 tracking-widest uppercase mb-1 font-bold">
                Casting Daily Lots Panel
              </h4>
              <p className="text-[11px] text-ash/85 leading-relaxed font-sans">
                Initiate a recursive simulation to cast symbolic lots. Nsibidi glyph components emerge from quantum mists to align into customized Guidance formations.
              </p>
            </div>

            <div className="md:col-span-4 flex items-center justify-end">
              <button
                onClick={triggerDailyCast}
                disabled={isCasting}
                className="w-full sm:w-auto bg-black border border-emerald-500/40 hover:border-emerald-500 hover:text-white px-5 py-3 rounded-lg text-emerald-400 font-mono text-[10px] tracking-widest uppercase transition-all cursor-pointer flex items-center justify-center gap-2 group outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isCasting ? "animate-spin" : "group-hover:rotate-45"}`} />
                {isCasting ? "CASTING SECRETS..." : "CAST DAILY LOTS"}
              </button>
            </div>
          </div>

          {/* CAST RESULTS VIEW */}
          <div className="mt-4 bg-black/45 border border-emerald-500/10 p-4 rounded-lg relative overflow-hidden flex flex-col md:flex-row gap-4 items-center h-28 justify-between">
            {isCasting ? (
              <div className="flex items-center gap-3 w-full justify-center">
                <div className="w-5 h-5 border border-emerald-500 border-t-transparent rounded-full animate-spin shrink-0" />
                <span className="font-mono text-[10px] text-emerald-400 uppercase tracking-[3px] animate-pulse">Scanning Cosmological Matrix Coordinates...</span>
              </div>
            ) : (
              <>
                <div className="flex-1 md:border-r md:border-emerald-500/10 md:pr-4">
                  <span className="text-[8px] font-mono text-[#c78f3e] tracking-widest font-bold uppercase mb-1 block">DAILY LOT DECREED:</span>
                  <h5 className="text-[11px] text-white tracking-widest font-mono uppercase font-bold">{dailyLot.title}</h5>
                  <p className="text-[11px] text-ash/90 leading-relaxed font-serif italic mt-1 font-semibold">{dailyLot.text}</p>
                </div>
                <div className="shrink-0 flex items-center gap-2 select-none">
                  {/* Decorative glowing miniature runes representing lot */}
                  <div className="h-12 w-12 rounded bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center relative">
                    <span className="text-xl text-emerald-400 font-bold animate-pulse">⚔️</span>
                  </div>
                  <div className="h-12 w-12 rounded bg-emerald-500/5 border border-emerald-500/15 flex items-center justify-center relative">
                    <span className="text-xl text-emerald-400 font-bold animate-pulse">🌀</span>
                  </div>
                </div>
              </>
            )}
          </div>

        </div>

        {/* RIGHT COLUMN (4-SPAN): HOROSCOPE LIST & traditional FESTIVALS LIST */}
        <div className="lg:col-span-4 space-y-8 flex flex-col justify-between">
          
          {/* HOROSCOPE SIGNS CONTAINER */}
          <div className="glass-card border border-orange-500/20 p-6 rounded-xl flex-1 relative overflow-hidden">
            <h3 className="font-display text-base font-black uppercase text-white tracking-widest border-b border-orange-500/15 pb-3 mb-4 flex items-center gap-2">
              <Layers className="w-4 h-4 text-orange-400" />
              IGBO COSMO HOROSCOPES
            </h3>

            <div className="space-y-4 max-h-[360px] overflow-y-auto pr-1.5 scrollbar-thin">
              {HOROSCOPES.map((hor) => (
                <div
                  key={hor.signName}
                  className="bg-black/45 border border-[#c78f3e]/10 hover:border-orange-500/35 p-3.5 rounded-lg transition-colors flex gap-4 items-start select-none"
                >
                  <div className="w-12 h-12 bg-[#090604] border border-[#c78f3e]/20 rounded-md flex items-center justify-center shrink-0 text-orange-400 p-1 font-bold shadow-inner">
                    <svg viewBox="0 0 100 100" className="w-9 h-9 stroke-orange-400 fill-none" dangerouslySetInnerHTML={{ __html: hor.glyphSvg }} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2.5">
                      <span className="font-mono text-xs font-bold text-white uppercase tracking-wider block">{hor.signName}</span>
                      <span className="text-[7.5px] font-mono tracking-tighter text-[#c78f3e]/70 shrink-0">{hor.period}</span>
                    </div>
                    <span className="text-[9px] text-fuchsia-400/80 font-mono tracking-tight font-semibold block uppercase">{hor.signTitle}</span>
                    <p className="text-[10px] text-ash/80 font-serif leading-relaxed mt-1.5 italic">
                      <strong>Strengths:</strong> {hor.strength}
                    </p>
                    <p className="text-[10px] text-emerald-400/90 font-sans leading-relaxed mt-1 font-medium">
                      <strong>Divine Guide:</strong> {hor.tip}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* TRADITIONAL LUNAR CALENDAR / TIME SENSOR */}
          <div className="glass-card border border-emerald-500/20 p-6 rounded-xl relative overflow-hidden flex flex-col justify-between">
            <div>
              <h3 className="font-display text-base font-black uppercase text-white tracking-widest border-b border-emerald-500/15 pb-3 mb-4 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-emerald-400" />
                ANCESTRAL MOON CYCLES
              </h3>

              <div className="space-y-4.5">
                {FESTIVALS_TIMELINE.map((fest) => (
                  <div key={fest.name} className="border-l-2 border-[#c78f3e]/40 hover:border-emerald-400 bg-black/35 pl-3 py-1.5 rounded-r transition-colors">
                    <div className="flex justify-between items-center text-[9px] font-mono">
                      <span className="text-[#c78f3e] uppercase font-bold tracking-wide">{fest.era}</span>
                      <span className="text-emerald-400 font-bold shrink-0">{fest.date}</span>
                    </div>
                    <h4 className="text-[11px] font-mono text-white tracking-wide uppercase font-bold mt-0.5">{fest.name}</h4>
                    <p className="text-[10px] text-ash mt-1 font-sans leading-relaxed">{fest.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-5 pt-4 border-t border-emerald-500/10 flex items-center justify-between text-[8px] font-mono tracking-widest text-emerald-400/50 uppercase font-bold">
              <span>UNIFIED LUNAR ALIGNMENT</span>
              <span>13 EPOCHS ARCHIVE</span>
            </div>
          </div>

        </div>

      </div>

      {/* TAROT CARDS PORTFOLIO SECTION */}
      <div className="mt-12 glass-card border border-[#c78f3e]/20 p-8 rounded-xl relative overflow-hidden select-none">
        
        {/* Background ambient lighting overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-400/[0.015] filter blur-3xl pointer-events-none" />
        
        <div className="text-center max-w-lg mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 border border-orange-500/25 bg-orange-500/5 rounded-full mb-3 select-none">
            <Sparkles className="w-3.5 h-3.5 text-orange-400 animate-pulse" />
            <span className="font-mono text-[9px] text-orange-400 tracking-wider font-bold">ANCIENT IGBO ARCHETYPES</span>
          </div>
          <h3 className="font-display text-xl sm:text-2xl font-black text-white uppercase tracking-wider">
            NSIBIDI TAROT ARCHE CODES
          </h3>
          <p className="text-xs text-ash leading-relaxed mt-1">
            Tap on any holographic card back to flip in 3D, trigger deep log drum synthesizer echoes, and decrypt ancestral divination readings.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TAROT_CARDS.map((card) => {
            const isFlipped = flippedTarot[card.id];
            
            return (
              <div 
                key={card.id} 
                className="w-full h-80 cursor-pointer tarot-card-container group"
                onClick={() => toggleTarot(card.id)}
              >
                <div className={`w-full h-full relative tarot-flipper duration-500 ${isFlipped ? "tarot-flipped" : ""}`}>
                  
                  {/* CARD BACK SIDE (THE SECRETE NSIBIDI LOGO) */}
                  <div className="tarot-front absolute inset-0 rounded-lg bg-gradient-to-br from-[#100b06] to-[#040201] border border-[#c78f3e]/20 hover:border-orange-500/60 p-5 flex flex-col justify-between items-center shadow-lg group-hover:shadow-[0_0_20px_rgba(199,143,62,0.15)] select-none transition-colors">
                    {/* Corner Brackets */}
                    <div className="absolute top-2 left-2 w-3 h-3 border-t border-l border-[#c78f3e]/30 group-hover:border-orange-500 transition-colors" />
                    <div className="absolute bottom-2 right-2 w-3 h-3 border-b border-r border-[#c78f3e]/30 group-hover:border-orange-500 transition-colors" />

                    <div className="text-[8px] font-mono tracking-widest text-[#c78f3e]/60 font-semibold">
                      AFA DIVINATION
                    </div>

                    {/* Central Cryptic Sigil Back Symbol */}
                    <div className="w-20 h-20 rounded-full bg-[#18120b] border border-[#c78f3e]/15 flex items-center justify-center p-2 animate-[pulse_3s_infinite]">
                      <svg viewBox="0 0 100 100" className="w-[85%] h-[85%] text-[#c78f3e] fill-none stroke-[2.5]" strokeLinecap="round" strokeLinejoin="round">
                        {/* Dynamic back pattern */}
                        <circle cx="50" cy="50" r="38" stroke="currentColor" stroke-dasharray="3 3" opacity="0.6" />
                        <path d="M50,15 C33,40 33,60 50,85 C67,60 67,40 50,15 Z" stroke="currentColor" />
                        <circle cx="50" cy="50" r="5" fill="currentColor" />
                      </svg>
                    </div>

                    <div className="text-[9px] font-mono text-[#c78f3e]/85 tracking-[5px] uppercase font-bold flex items-center gap-1.5">
                      tap to flip
                    </div>
                  </div>

                  {/* CARD FRONT SIDE (THE DECRYPTED READING) */}
                  <div className="tarot-back absolute inset-0 rounded-lg bg-black border-2 border-emerald-500 p-5 flex flex-col justify-between items-center shadow-2xl overflow-hidden select-none">
                    {/* Matrix overlay scanner lines */}
                    <div className="absolute inset-x-0 h-[0.5px] bg-emerald-400 opacity-40 top-4 animate-bounce pointer-events-none" />

                    <div className="text-[8px] font-mono tracking-widest text-emerald-400 font-bold uppercase">
                      DECRYPTED DECREE
                    </div>

                    {/* Glowing Vector Archetype glyph overlay */}
                    <div className="w-16 h-16 bg-[#030c06] border border-emerald-500/25 rounded-md flex items-center justify-center text-emerald-400 p-2.5 shadow-inner">
                      <svg viewBox="0 0 100 100" className="w-full h-full stroke-emerald-400 fill-none" dangerouslySetInnerHTML={{ __html: card.svg }} />
                    </div>

                    <div className="text-center flex-1 mt-4">
                      <h4 className="font-mono text-xs font-black tracking-wide text-white uppercase">{card.name}</h4>
                      <div className="text-[8.5px] text-orange-400 font-mono tracking-widest font-bold uppercase mt-1 mb-2">
                        UPRIGHT: {card.upright}
                      </div>
                      <p className="text-[10px] text-ash/95 leading-relaxed font-serif italic line-clamp-4 mt-1 border-t border-emerald-500/10 pt-1.5 font-semibold">
                        "{card.advice}"
                      </p>
                    </div>

                    <div className="text-[7.5px] font-mono text-emerald-400/60 uppercase tracking-widest mt-2">
                      TAP CONSOLE TO RESET
                    </div>
                  </div>

                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
