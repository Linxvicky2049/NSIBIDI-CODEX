import React, { useState } from "react";
import { Glyph } from "../types";
import { getHistoricalDetails } from "../utils/historicalData";

interface GlyphCardProps {
  glyph: Glyph;
  isHighlighted: boolean;
  onClick?: () => void;
}

// Map glyph IDs or categories to generated high-quality AI images
const getGlyphAIImage = (id: string, category: string): string => {
  if (id === "Sun-Rays" || id === "Celestial" || id === "Eye" || id === "Origin-Dot" || id === "Flame" || id === "Six-Point-Star" || id === "Crescent") {
    return "/src/assets/images/holographic_glyph_sun_1781607539494.jpg";
  }
  if (id === "Crown" || id === "Power" || id === "Diamond" || id === "Upward-Triangle" || id === "Crossroads") {
    return "/src/assets/images/holographic_glyph_crown_1781607555322.jpg";
  }
  return "/src/assets/images/holographic_glyph_knot_1781607571710.jpg";
};

export const GlyphCard: React.FC<GlyphCardProps> = ({
  glyph,
  isHighlighted,
  onClick,
}) => {
  const [viewMode, setViewMode] = useState<"ai" | "vector">("ai");
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Rotate 12 degrees max
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  // Category-specific color theme tags (futuristic neon variants)
  const catClasses: { [key: string]: string } = {
    Conflict: "bg-red-950/40 text-red-400 border-red-500/30",
    Community: "bg-teal-950/40 text-teal-300 border-cyan-500/30",
    Journey: "bg-pink-950/40 text-pink-300 border-pink-500/30",
    Power: "bg-purple-950/40 text-fuchsia-300 border-fuchsia-500/30",
    Celestial: "bg-blue-950/40 text-cyan-300 border-cyan-500/30",
    Nature: "bg-emerald-950/40 text-emerald-300 border-emerald-500/30",
    Human: "bg-amber-950/40 text-amber-300 border-amber-500/30",
  };

  return (
    <div
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) translateZ(10px)`,
        transformStyle: "preserve-3d",
      }}
      className={`relative glass-card border transition-all duration-300 p-5 text-center flex flex-col items-center group cursor-pointer select-none rounded-lg overflow-hidden
        ${
          isHighlighted
            ? "border-cyber-blue shadow-[0_0_25px_rgba(0,240,255,0.25)] ring-1 ring-cyber-blue/50"
            : "border-cyber-blue/15 hover:border-cyber-magenta/60 hover:shadow-[0_0_20px_rgba(255,0,85,0.15)]"
        }`}
    >
      {/* Dynamic Cyber Tech Grid Line Overlay inside Card */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(0,240,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(0,240,255,0.02)_1px,transparent_1px)] bg-[size:10px_10px] opacity-40 pointer-events-none" />

      {/* Futuristic Corner brackets */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 border-t-2 border-l-2 border-cyber-blue/20 group-hover:border-cyber-blue/60 transition-colors" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 border-t-2 border-r-2 border-cyber-blue/20 group-hover:border-cyber-blue/60 transition-colors" />
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 border-b-2 border-l-2 border-cyber-blue/20 group-hover:border-cyber-blue/60 transition-colors" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 border-b-2 border-r-2 border-cyber-blue/20 group-hover:border-cyber-blue/60 transition-colors" />

      {/* Selector view tab */}
      <div className="absolute top-2 right-8 flex items-center bg-black/50 border border-cyber-blue/10 rounded-sm overflow-hidden text-[8px] font-mono select-none z-10 shrink-0">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode("ai");
          }}
          className={`px-1.5 py-0.5 ${viewMode === "ai" ? "bg-cyber-blue text-black font-semibold" : "text-ash hover:text-white"}`}
        >
          AI 3D
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setViewMode("vector");
          }}
          className={`px-1.5 py-0.5 ${viewMode === "vector" ? "bg-cyber-blue text-black font-semibold" : "text-ash hover:text-white"}`}
        >
          VEC
        </button>
      </div>

      {/* Rendering View modes */}
      <div className="w-[100px] h-[100px] flex items-center justify-center mb-3 mt-4 relative">
        {viewMode === "ai" ? (
          <div className="relative w-full h-full rounded-md overflow-hidden border border-cyber-blue/25 bg-black/50 group-hover:border-cyber-magenta/50 transition-colors shadow-lg flex items-center justify-center">
            {/* Reduced opacity background 3D holographic projection image */}
            <img
              src={getGlyphAIImage(glyph.id, glyph.cat)}
              alt="Holographic 3D glyph visual"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:opacity-35 group-hover:scale-115 transition-all duration-700 ease-out select-none pointer-events-none"
            />
            
            {/* Complete 3D hovering image overlay of the symbol/glyph */}
            <div className="relative z-10 p-2 w-14 h-14 animate-float-glyph filter drop-shadow-[0_0_10px_rgba(0,240,255,0.8)] group-hover:drop-shadow-[0_0_16px_rgba(255,0,85,0.9)] transition-all">
              <svg
                viewBox="0 0 100 100"
                className="w-full h-full stroke-cyber-blue group-hover:stroke-cyber-magenta fill-none stroke-[2.2] stroke-linecap-round stroke-linejoin-round transition-colors duration-300"
                dangerouslySetInnerHTML={{ __html: glyph.svg }}
              />
            </div>
            
            {/* Digital laser energy scanner grid line */}
            <div className="absolute left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyber-blue to-transparent animate-pulse opacity-50 pointer-events-none top-1/2" />
          </div>
        ) : (
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full stroke-cyber-blue fill-none stroke-[1.8] stroke-linecap-round stroke-linejoin-round transition-transform duration-300 group-hover:scale-108 filter drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]"
            dangerouslySetInnerHTML={{ __html: glyph.svg }}
          />
        )}
      </div>

      {/* Category Tag */}
      <span
        className={`px-2.5 py-0.5 mt-1 text-[8px] font-mono tracking-[2px] uppercase border rounded-xs mb-3 font-semibold ${
          catClasses[glyph.cat] || "bg-zinc-950/40 text-cyber-blue border-cyber-blue/30"
        }`}
      >
        {glyph.cat}
      </span>

      {/* Glyph Details */}
      <h3 className="font-cinzel text-xs font-semibold tracking-wide text-white group-hover:text-cyber-blue transition-colors uppercase">
        {glyph.name}
      </h3>
      <p className="font-serif text-xs text-cyber-magenta/95 italic mt-0.5 tracking-wide">
        {glyph.local}
      </p>
      <p className="font-serif text-[11px] text-ash line-clamp-3 leading-relaxed mt-2 text-center group-hover:text-white/90 transition-colors">
        {glyph.meaning}
      </p>

      {/* Historical Context Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          setIsHistoryModalOpen(true);
        }}
        className="mt-4 px-3 py-1.5 text-[9px] font-mono uppercase tracking-widest text-cyber-blue border border-cyber-blue/20 hover:border-cyber-magenta hover:text-cyber-magenta bg-black/40 hover:bg-black/80 transition-all rounded-md shrink-0 cursor-pointer hover:scale-105 active:scale-95"
        id={`btn-history-${glyph.id}`}
      >
        Historical Details
      </button>

      {/* Historical Modal Portal Layer */}
      {isHistoryModalOpen && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md cursor-default select-text"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="relative w-full max-w-lg bg-[#070512] border border-cyber-blue/30 p-6 md:p-8 rounded-xl shadow-2xl overflow-hidden text-left">
            {/* Corner Bracket decorations */}
            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-cyber-blue/40" />
            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-cyber-blue/40" />
            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-cyber-blue/40" />
            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-cyber-blue/40" />

            <div className="flex justify-between items-start border-b border-cyber-blue/10 pb-4 mb-5">
              <div>
                <span className="text-[9px] font-mono text-cyber-magenta uppercase tracking-widest block mb-0.5">ARCHAEOLOGICAL ARCHIVE DETAILS</span>
                <h3 className="font-cinzel text-base font-bold text-white tracking-wider uppercase">
                  {glyph.name} ({glyph.local})
                </h3>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsHistoryModalOpen(false);
                }}
                className="text-ash hover:text-white font-mono text-[10px] border border-cyber-blue/20 hover:border-cyber-magenta px-3 py-1.5 transition-all rounded-lg cursor-pointer bg-black/40 active:scale-95"
              >
                ✕ CLOSE
              </button>
            </div>

            {/* Modal Scrollable Content */}
            <div className="space-y-4 text-xs font-sans text-white/90 leading-relaxed max-h-[60vh] overflow-y-auto pr-1 select-text">
              <div>
                <h4 className="font-mono text-[10px] text-cyber-blue tracking-widest uppercase mb-1 font-semibold">Specific Cultural Origin</h4>
                <p className="bg-black/40 border border-white/5 p-3 rounded-md text-ash text-xs">
                  {getHistoricalDetails(glyph.id).culturalOrigin}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[10px] text-cyber-blue tracking-widest uppercase mb-1 font-semibold">Era of Use</h4>
                <p className="bg-black/40 border border-white/5 p-3 rounded-md text-ash text-xs">
                  {getHistoricalDetails(glyph.id).eraOfUse}
                </p>
              </div>

              <div>
                <h4 className="font-mono text-[10px] text-cyber-blue tracking-widest uppercase mb-1 font-semibold">Known Archaeological Findings</h4>
                <p className="bg-black/40 border border-white/5 p-3 rounded-md text-ash text-xs">
                  {getHistoricalDetails(glyph.id).archaeologicalFindings}
                </p>
              </div>

              <div className="border-t border-cyber-blue/10 pt-4 mt-2">
                <h4 className="font-mono text-[10px] text-cyber-magenta tracking-widest uppercase mb-1 font-semibold">Traditional Narrative</h4>
                <p className="font-serif text-sm italic text-[#f5f0e1]/90 leading-relaxed">
                  {getHistoricalDetails(glyph.id).narrativeText}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

