import React, { useState } from 'react';
import { useStore } from '../store';
import { ParticleShape } from '../types';
import { Heart, Flower2, CircleDot, Orbit, Zap, Hand, Loader2, Minimize2, Maximize2 } from 'lucide-react';

const SHAPE_OPTIONS = [
  { id: ParticleShape.HEART, label: 'Love', icon: Heart },
  { id: ParticleShape.FLOWER, label: 'Bloom', icon: Flower2 },
  { id: ParticleShape.SATURN, label: 'Saturn', icon: Orbit },
  { id: ParticleShape.SPIRAL, label: 'Galaxy', icon: CircleDot },
  { id: ParticleShape.FIREWORK, label: 'Spark', icon: Zap },
];

const COLORS = [
  '#ff0066', // Hot Pink
  '#00ffff', // Cyan
  '#ffff00', // Yellow
  '#00ff66', // Spring Green
  '#ff6600', // Orange
  '#ffffff', // White
  '#9966ff', // Purple
];

const UI: React.FC = () => {
  const { currentShape, setShape, particleColor, setColor, isHandDetected, handDistance, isLoading } = useStore();
  const [fullscreen, setFullscreen] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setFullscreen(false);
      }
    }
  };

  return (
    <div className="absolute inset-0 pointer-events-none z-10 flex flex-col justify-between p-6">
      
      {/* Header / Status */}
      <div className="flex justify-between items-start pointer-events-auto">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tighter drop-shadow-lg">ZEN PARTICLE</h1>
          <p className="text-white/60 text-sm mt-1 flex items-center gap-2">
            {isLoading ? (
               <><Loader2 className="w-3 h-3 animate-spin" /> Loading Vision Model...</>
            ) : (
               <>
                 <span className={`w-2 h-2 rounded-full ${isHandDetected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
                 {isHandDetected ? `Hand Control Active (${Math.round(handDistance * 100)}%)` : 'Show hand to control'}
               </>
            )}
          </p>
        </div>
        
        <button 
            onClick={toggleFullscreen}
            className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-white transition-all"
        >
            {fullscreen ? <Minimize2 size={20}/> : <Maximize2 size={20}/>}
        </button>
      </div>

      {/* Main Controls */}
      <div className="flex flex-col gap-6 pointer-events-auto max-w-md">
        
        {/* Shape Selectors */}
        <div className="flex gap-2 bg-black/40 backdrop-blur-xl p-2 rounded-2xl border border-white/10 overflow-x-auto">
          {SHAPE_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setShape(opt.id)}
              className={`flex flex-col items-center gap-1 p-3 min-w-[70px] rounded-xl transition-all duration-300 ${
                currentShape === opt.id 
                  ? 'bg-white/20 text-white shadow-lg scale-105' 
                  : 'text-white/50 hover:bg-white/5 hover:text-white'
              }`}
            >
              <opt.icon size={24} strokeWidth={currentShape === opt.id ? 2.5 : 2} />
              <span className="text-[10px] font-medium uppercase tracking-wider">{opt.label}</span>
            </button>
          ))}
        </div>

        {/* Color Picker */}
        <div className="flex gap-3 bg-black/40 backdrop-blur-xl p-4 rounded-2xl border border-white/10 w-fit">
          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => setColor(c)}
              className={`w-8 h-8 rounded-full border-2 transition-transform duration-200 hover:scale-110 ${
                particleColor === c ? 'border-white scale-110 shadow-[0_0_10px_currentColor]' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c, color: c }}
              aria-label={`Select color ${c}`}
            />
          ))}
        </div>

        {/* Instructions */}
        {!isHandDetected && !isLoading && (
           <div className="bg-blue-500/20 backdrop-blur-md border border-blue-500/30 p-4 rounded-xl text-white/90 text-sm flex items-start gap-3 animate-fade-in">
              <Hand className="shrink-0 mt-1" size={18} />
              <div>
                <p className="font-semibold">Gesture Control</p>
                <p className="text-xs opacity-70 mt-1">Pinch thumb & index finger to shrink particles. Open hand to expand.</p>
              </div>
           </div>
        )}
      </div>
    </div>
  );
};

export default UI;
