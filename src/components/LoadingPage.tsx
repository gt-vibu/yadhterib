import React, { useState } from "react";
import { Sparkles } from "lucide-react";
import { playSparkle, playCheer } from "../utils/audio";

interface LoadingPageProps {
  onContinue: () => void;
}

export default function LoadingPage({ onContinue }: LoadingPageProps) {
  const [wishMade, setWishMade] = useState(false);
  const [intensified, setIntensified] = useState(false);

  const handleMakeWish = () => {
    if (intensified) return;
    setWishMade(true);
    setIntensified(true);
    playCheer();
    
    // Smooth timing transition
    setTimeout(() => {
      onContinue();
    }, 1800);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute">
      
      {/* Background Soft dream overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pastel-pink-soft/80 via-white/40 to-pastel-blue-soft/80 pointer-events-none z-[-1]" />

      <div className="max-w-md w-full text-center flex flex-col items-center space-y-6">
        
        {/* Wish Prompt Banner */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 bg-pink-50 px-3 py-1 rounded-full animate-pulse">
            ✨ Sweet Tradition
          </span>
          <h1 className="text-3xl font-bold text-neutral-700 tracking-tight">
            Make a Wish!
          </h1>
          <p className="text-xs text-neutral-400">
            Close your eyes, think of a dream, and tap the button to blow the candle...
          </p>
        </div>

        {/* Cinematic Animated Birthday Cake & Flame */}
        <div className="relative w-64 h-64 flex items-center justify-center my-4 select-none drop-shadow-xl">
          <svg viewBox="0 0 200 200" className="w-full h-full">
            {/* Table Surface */}
            <ellipse cx="100" cy="170" rx="80" ry="12" fill="#ffd3e1" opacity="0.4" />
            
            {/* Stand / Plate */}
            <path d="M40 162 L160 162 A6 6 0 0 1 154 168 L46 168 A6 6 0 0 1 40 162 Z" fill="#ebf7ff" />
            <path d="M85 168 L115 168 L110 180 L90 180 Z" fill="#d3e2f0" />

            {/* Cake Tiers (Pastel Blue & Blush Pink) */}
            {/* Tier 1 (Base) */}
            <rect x="50" y="105" width="100" height="58" rx="14" fill="#ffccd5" />
            {/* Cream Drippiness */}
            <path d="M50 115 C 65 125, 75 108, 90 120 C 105 132, 115 115, 130 125 C 145 135, 142 115, 150 115" fill="none" stroke="#ffffff" strokeWidth="6" strokeLinecap="round" />
            {/* Frosting sprinkles */}
            <circle cx="65" cy="135" r="3.5" fill="#ffd3e1" />
            <circle cx="95" cy="142" r="3" fill="#bde0fe" />
            <circle cx="125" cy="138" r="4.5" fill="#fffb96" />
            <circle cx="140" cy="128" r="3" fill="#eaf6ff" />

            {/* Frosting Top layer */}
            <ellipse cx="100" cy="105" rx="50" ry="8" fill="#ffffff" />

            {/* Middle tier biscuit */}
            <rect x="62" y="70" width="76" height="35" rx="10" fill="#bde0fe" />
            {/* Cream drizzle */}
            <ellipse cx="100" cy="70" rx="38" ry="6" fill="#ffffff" />
            <circle cx="75" cy="85" r="3" fill="#ff85a1" />
            <circle cx="100" cy="88" r="3.5" fill="#fffb96" />
            <circle cx="120" cy="82" r="2.5" fill="#ffffff" />

            {/* Cherries/Cute Toppers */}
            <circle cx="70" cy="65" r="6" fill="#ff5c8a" />
            <circle cx="100" cy="62" r="6" fill="#ff5c8a" />
            <circle cx="130" cy="65" r="6" fill="#ff5c8a" />

            {/* Main Center Candle */}
            <rect x="96" y="28" width="8" height="34" rx="4" fill="#fffb96" stroke="#ffd3e1" strokeWidth="1" />
            {/* Candle ribbon stripes */}
            <path d="M96 36 L104 42 M96 46 L104 52" stroke="#ff85a1" strokeWidth="2.5" />
            <line x1="100" y1="28" x2="100" y2="24" stroke="#4a3b32" strokeWidth="2" strokeLinecap="round" />

            {/* Candle Glowing Flame */}
            <g className={intensified ? "animate-pulse" : "animate-candle"}>
              <path 
                d="M100 6 C105 12, 106 23, 100 24 C94 23, 95 12, 100 6 Z" 
                fill="#ffd3e1" 
                className="transition-all duration-700"
                style={{
                  transformOrigin: "100px 24px",
                  scale: intensified ? 2.5 : 1.25,
                  fill: intensified ? "#fffb96" : "#ff85a1",
                  filter: intensified ? "drop-shadow(0 0 16px rgba(253, 224, 71, 1))" : "drop-shadow(0 0 8px rgba(255, 133, 161, 0.7))"
                }}
              />
            </g>
          </svg>

          {/* Magical sparkle indicators floating over cake */}
          <div className="absolute top-2 left-6 text-yellow-300 animate-sparkle" style={{ animationDelay: "0.2s" }}>✨</div>
          <div className="absolute top-10 right-8 text-sky-400 animate-sparkle" style={{ animationDelay: "0.8s" }}>⭐</div>
          <div className="absolute bottom-6 left-12 text-pink-400 animate-sparkle" style={{ animationDelay: "1.4s" }}>✨</div>
        </div>

        {/* Glow-glowing Continue button */}
        <button
          onClick={handleMakeWish}
          disabled={wishMade}
          className={`px-8 py-3.5 rounded-full font-cute font-bold text-sm tracking-wide shadow-md hover:shadow-xl hover:scale-105 active:scale-95 transition-all text-white cursor-pointer z-20 ${
            wishMade 
              ? "bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 scale-95" 
              : "bg-gradient-to-r from-pink-400 via-pink-500 to-pink-400 hover:from-pink-500 hover:to-pink-600 animate-glow-pulse"
          }`}
          id="blow-candle-btn"
        >
          {wishMade ? (
            <span className="flex items-center gap-1.5 font-cute text-white">
              <span>Wish Sent Upwards! 💖</span>
              <Sparkles className="w-4 h-4 animate-spin-slow" />
            </span>
          ) : (
            <span className="flex items-center gap-1">
              <span>Make a Wish & Continue ✨</span>
            </span>
          )}
        </button>

        {/* Interactive hint context */}
        <div className="text-[10px] text-neutral-400 italic">
          💡 The candles flicker beautifully; click top to trigger your magical adventure!
        </div>
      </div>

    </div>
  );
}
