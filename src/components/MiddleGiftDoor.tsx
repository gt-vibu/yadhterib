import React, { useState } from "react";
import { Sparkles, DoorOpen, HelpCircle } from "lucide-react";
import { playKnock, playSparkle, playSuccess } from "../utils/audio";

interface MiddleGiftDoorProps {
  onDoorOpened: () => void;
}

interface KnockRipple {
  id: number;
  x: number;
  y: number;
}

export default function MiddleGiftDoor({ onDoorOpened }: MiddleGiftDoorProps) {
  const [knocks, setKnocks] = useState(0);
  const [doorOpen, setDoorOpen] = useState(false);
  const [ripples, setRipples] = useState<KnockRipple[]>([]);
  const [doorShake, setDoorShake] = useState(false);

  const targetKnocks = 5;

  const handleDoorClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (doorOpen) return;
    
    // Add ripple coordinates
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const newRipple: KnockRipple = {
      id: Date.now() + Math.random(),
      x,
      y
    };
    
    setRipples((prev) => [...prev, newRipple]);
    
    // Clean up older ripples
    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 1000);

    // Apply knock sound & shake
    playKnock();
    setDoorShake(true);
    setTimeout(() => setDoorShake(false), 200);

    const nextKnock = knocks + 1;
    setKnocks(nextKnock);

    if (nextKnock >= targetKnocks) {
      setDoorOpen(true);
      playSuccess();
      playSparkle();
      
      // Delay before proceeding to trigger the cinematic flythrough
      setTimeout(() => {
        onDoorOpened();
      }, 1600);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center overflow-hidden">
      
      {/* Foggy / mystical ambient background overlay */}
      <div 
        className={`absolute inset-0 bg-neutral-950/90 pointer-events-none z-[-1] transition-colors duration-1000 ${
          doorOpen ? "bg-white/95" : ""
        }`} 
      />
      
      {/* Stars on dark backdrop background */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px] opacity-15 pointer-events-none z-[-2]" />

      <div className="max-w-md w-full flex flex-col items-center space-y-6">
        
        {/* Header Title */}
        <div className="space-y-1.5">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full animate-pulse">
            🚪 Secret Corridor
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            knock the door as your lucky number 🚪✨
          </h2>
          <p className="text-xs text-neutral-400 max-w-xs mx-auto">
            A lucky key counts inside standard locks. Tap the door to release the magic.
          </p>
        </div>

        {/* Lucky Knocks Counter Display */}
        <div className="bg-amber-950/80 border border-amber-700/60 rounded-full px-5 py-2 font-mono flex items-center justify-center gap-2 shadow-inner text-amber-300">
          <span className="text-[11px] font-bold uppercase tracking-wider font-cute">Knocks Registered:</span>
          <span className="text-sm font-bold">{knocks}</span>
        </div>

        {/* Interactive Magical Mystery Door Frame */}
        <div 
          onClick={handleDoorClick}
          className={`relative w-48 h-72 rounded-t-full bg-neutral-800 border-4 border-amber-900/60 shadow-2xl overflow-hidden cursor-pointer flex items-center justify-center select-none transition-all duration-700 ${
            doorShake ? "animate-wiggle border-amber-400" : ""
          } ${
            doorOpen 
              ? "scale-125 rotate-y-90 translate-z-10 shadow-[0_0_50px_rgba(251,254,150,0.8)] outline-hidden border-yellow-300" 
              : "hover:scale-105 hover:shadow-yellow-300/10"
          }`}
          style={{
            perspective: "1000px",
            transformStyle: "preserve-3d"
          }}
        >
          {/* Glowing magical keyhole/glass elements */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center z-10 pointer-events-none">
            {/* Keyhole */}
            <div className={`w-6 h-6 rounded-full transition-all duration-500 bg-amber-400/90 shadow-[0_0_12px_#fbbf24] ${
              doorOpen ? "scale-[20] opacity-100" : "animate-pulse"
            }`} />
            <div className="w-2.5 h-4.5 -mt-1 bg-amber-400/90 shadow-[0_0_12px_#fbbf24] pointer-events-none" />
          </div>

          {/* Wooden texture details on Door */}
          {!doorOpen && (
            <div className="absolute inset-0 flex flex-col justify-around py-4 opacity-15 pointer-events-none">
              <div className="w-full h-[2px] bg-white" />
              <div className="w-full h-[2px] bg-white" />
              <div className="w-full h-[2px] bg-white" />
              <div className="w-full h-[2px] bg-white" />
            </div>
          )}

          {/* Sparkles decoration on Door facade */}
          <div className="absolute top-12 left-8 text-yellow-300 animate-pulse text-xs">✨</div>
          <div className="absolute bottom-12 right-8 text-amber-400 animate-pulse text-[10px]">⭐</div>

          {/* Click Knock Ripples */}
          {ripples.map((ripple) => (
            <span
              key={ripple.id}
              className="absolute pointer-events-none rounded-full border-2 border-yellow-300/80 animate-ping shadow-[0_0_15px_rgba(251,191,36,0.6)]"
              style={{
                left: `${ripple.x}px`,
                top: `${ripple.y}px`,
                width: "44px",
                height: "44px",
                marginLeft: "-22px",
                marginTop: "-22px"
              }}
            />
          ))}

          {/* Open Stage Light Beam Overlay */}
          {doorOpen && (
            <div className="absolute inset-0 bg-white animate-pulse flex items-center justify-center">
              <div className="text-amber-500 font-bold text-center text-xs animate-bounce font-cute">
                OPENING PORTAL...
              </div>
            </div>
          )}
        </div>

        {/* Visual guide details below */}
        {doorOpen && (
          <div className="text-emerald-400 text-xs font-semibold animate-pulse font-cute">
            🚪 Entering the memory tunnel... Hold tight!
          </div>
        )}

        {!doorOpen && (
          <p className="text-[11px] text-neutral-500 italic max-w-sm">
            💡 Tap/Click anywhere inside the door shape to register knocks.
          </p>
        )}
      </div>

    </div>
  );
}
