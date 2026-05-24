import React, { useEffect, useState } from "react";
import { Sparkles, Compass } from "lucide-react";
import { BirthdayState } from "../types";
import { playSparkle } from "../utils/audio";

interface MagicalTunnelProps {
  state: BirthdayState;
  onComplete: () => void;
}

interface FloatingPhotoNode {
  id: number;
  url: string;
  x: number;
  y: number;
  delay: number;
}

export default function MagicalTunnel({ state, onComplete }: MagicalTunnelProps) {
  const [nodes, setNodes] = useState<FloatingPhotoNode[]>([]);

  useEffect(() => {
    // Collect customized photo list to fly outwards
    const list: FloatingPhotoNode[] = [];
    const photos = state.customPhotos || [];
    
    // Duplicate or map them to create continuous floating cards in 3D-like tunnel
    for (let i = 0; i < 8; i++) {
      const idx = i % photos.length;
      list.push({
        id: i,
        url: photos[idx].url,
        // Place them nicely in outward quad-coordinates
        x: 15 + (i % 3) * 30 + (Math.random() * 8),
        y: 20 + Math.floor(i / 3) * 25 + (Math.random() * 8),
        delay: i * 0.8
      });
    }
    setNodes(list);

    // Audio cue
    playSparkle();
    const soundTimer = setInterval(playSparkle, 1500);

    // Automatic flight duration: transitions to cake scene after 6 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 6000);

    return () => {
      clearTimeout(timer);
      clearInterval(soundTimer);
    };
  }, [state, onComplete]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center overflow-hidden bg-neutral-950">
      
      {/* Epic background vortex styling */}
      <div className="absolute inset-0 bg-radial-gradient from-zinc-900 via-neutral-950 to-black pointer-events-none z-[-1]" />

      {/* Futuristic zooming grid lines lines to mimic flying tunnel */}
      <div className="absolute inset-0 w-full h-full pointer-events-none opacity-20 z-[-1]">
        <svg viewBox="0 0 100 100" className="w-full h-full stroke-pink-500" preserveAspectRatio="none">
          {/* Radial speed lines */}
          <line x1="50" y1="50" x2="0" y2="0" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="100" y2="0" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="0" y2="100" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="100" y2="100" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="50" y2="0" strokeWidth="0.5" />
          <line x1="50" y1="50" x2="50" y2="100" strokeWidth="0.5" />
          
          {/* Circular expanding tunnel rings */}
          <circle cx="50" cy="50" r="10" fill="none" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "3s" }} />
          <circle cx="50" cy="50" r="25" fill="none" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "4s", animationDelay: "1s" }} />
          <circle cx="50" cy="50" r="40" fill="none" strokeWidth="0.5" className="animate-ping" style={{ animationDuration: "5s", animationDelay: "2s" }} />
        </svg>
      </div>

      {/* Flying floating 3D Polaroid images */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        {nodes.map((node) => (
          <div
            key={node.id}
            className="absolute bg-white p-2 pb-6 shadow-2xl rounded-sm border border-neutral-200 rotate-[-4deg]"
            style={{
              left: `${node.x}%`,
              top: `${node.y}%`,
              width: "120px",
              height: "150px",
              opacity: 0,
              // Animate Scale and Translate Outwards/Upwards to feel like flying past the screen!
              animation: `tunnelFly 4.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite`,
              animationDelay: `${node.delay}s`
            }}
          >
            {/* Slide photo container */}
            <div className="w-full h-[80%] bg-neutral-900 rounded-xs overflow-hidden">
              <img
                src={node.url}
                alt="Tunnel slide"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Style inline styles for fly anim to bypass tailwind complexity */}
            <style>{`
              @keyframes tunnelFly {
                0% {
                  transform: scale(0.1) translate3d(0, 0, 0);
                  opacity: 0;
                  filter: blur(4px);
                }
                15% {
                  opacity: 0.9;
                  filter: blur(0px);
                }
                85% {
                  opacity: 0.8;
                }
                100% {
                  transform: scale(2.8) translate3d(${(node.x - 50) * 1.5}px, ${(node.y - 50) * 1.5}px, 0);
                  opacity: 0;
                  filter: blur(2px);
                }
              }
            `}</style>
          </div>
        ))}
      </div>

      <div className="max-w-md w-full flex flex-col items-center space-y-5 z-10 pointer-events-none">
        {/* Navigation Indicator */}
        <div className="w-12 h-12 rounded-full border-2 border-dashed border-pink-400 bg-black/60 flex items-center justify-center text-pink-400 animate-spin-slow">
          <Compass className="w-6 h-6" />
        </div>

        {/* Narrative flight details */}
        <div className="space-y-1 text-center">
          <h2 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-pink-300 via-amber-200 to-sky-300 bg-clip-text text-transparent tracking-widest animate-pulse font-cute">
            FLYING THROUGH MEMORY SPACE ✨
          </h2>
          <p className="text-xs text-neutral-400">
            Hold on... we are teleporting into the fantasy birthday planet!
          </p>
        </div>

        {/* Soft magical sparkling particles moving on stage */}
        <div className="flex gap-2">
          <span className="w-2 h-2 rounded-full bg-pink-400 animate-ping" />
          <span className="w-2 h-2 rounded-full bg-yellow-300 animate-ping" style={{ animationDelay: "0.2s" }} />
          <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" style={{ animationDelay: "0.4s" }} />
        </div>
      </div>

    </div>
  );
}
