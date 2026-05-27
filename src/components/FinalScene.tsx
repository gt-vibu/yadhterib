import React, { useState, useEffect } from "react";
import { Sparkles, Trophy, Music, RotateCcw, Volume2 } from "lucide-react";
import { BirthdayState } from "../types";
import { playSparkle, playKeyTap, playCheer } from "../utils/audio";

interface FinalSceneProps {
  state: BirthdayState;
  onRestart: () => void;
}

export default function FinalScene({ state, onRestart }: FinalSceneProps) {
  const [typedWish, setTypedWish] = useState("");
  const [wishAnimFinished, setWishAnimFinished] = useState(false);

  useEffect(() => {
    // Initial cheer sound effect
    playCheer();
    playSparkle();

    // Typewriter effect on the final letter text
    let index = 0;
    setTypedWish("");
    setWishAnimFinished(false);

    const letterText = state.finalWishText;
    const interval = setInterval(() => {
      setTypedWish((prev) => prev + letterText.charAt(index));
      index++;
      if (index >= letterText.length) {
        clearInterval(interval);
        setWishAnimFinished(true);
      }
    }, 40);

    return () => clearInterval(interval);
  }, [state]);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center overflow-hidden">
      
      {/* Mystical soft warm glowing background gradient */}
      <div className="absolute inset-0 bg-gradient-to-tr from-slate-950 via-neutral-900 to-indigo-950 pointer-events-none z-[-1]" />
      
      {/* Moving slow falling glowing stardust overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:18px_18px] opacity-25 pointer-events-none z-[-1]" />

      <div className="max-w-md w-full flex flex-col items-center space-y-6">
        
        {/* Animated Celebration Crown Title */}
        <div className="space-y-1 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#fffb96] bg-amber-950 border border-amber-800 px-4 py-1.5 rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto animate-bounce">
            <Trophy className="w-3.5 h-3.5 text-yellow-300" />
            <span>Grand Finale Wish</span>
          </span>
          <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-300 via-pink-400 to-sky-300 bg-clip-text text-transparent transform hover:scale-105 transition-transform duration-500 font-cute py-1">
            {state.finalWishTitle}
          </h1>
        </div>

        {/* Polaroid frame showing final gorgeous photo */}
        <div 
          className="relative w-full aspect-square max-w-[210px] bg-white p-3.5 pb-10 shadow-2xl rounded-xl rotate-[1deg] transition-all hover:rotate-[-2deg] hover:scale-105 duration-300 border border-neutral-100/10 z-10"
          style={{ animation: "float 6s ease-in-out infinite" }}
        >
          <div className="w-full aspect-square bg-zinc-950 rounded-lg overflow-hidden border border-zinc-800 relative shadow-inner">
            {(() => {
              const finalPhoto = state.customPhotos && state.customPhotos.length > 0
                ? state.customPhotos[state.customPhotos.length - 1]
                : null;
              if (finalPhoto && finalPhoto.url) {
                return (
                  <img
                    src={finalPhoto.url}
                    alt="Final Celebration Scene portrait"
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover filter brightness-95"
                  />
                );
              }
              return (
                <div className="w-full h-full flex items-center justify-center bg-zinc-900 text-yellow-300">
                  ⭐
                </div>
              );
            })()}
            {/* Corner ambient sparkly lights */}
            <div className="absolute top-2 right-2 text-yellow-300 animate-pulse text-sm">✨</div>
            <div className="absolute bottom-2 left-2 text-blue-300 animate-pulse text-xs">⭐</div>
          </div>
          <div className="pt-2 text-[10px] text-neutral-400 font-bold tracking-wide">
            Our Forever Star 🌟
          </div>
        </div>

        {/* Cinematic Typewriter Letter container */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-2xl w-full max-w-sm min-h-48 flex items-center justify-center relative">
          <p className="text-white font-cute font-medium text-xs sm:text-sm leading-relaxed tracking-wide text-left justify-items-start whitespace-pre-line text-neutral-200">
            {typedWish}
            {!wishAnimFinished && (
              <span className="inline-block w-1.5 h-3.5 bg-yellow-300 ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Controller and Interactive Background sound message */}
        <div className="flex flex-col gap-3 w-full items-center max-w-xs z-20">
          <div className="text-xs bg-pink-950/80 border border-pink-800/60 rounded-full px-4 py-1.5 text-pink-300 flex items-center gap-1.5 shadow-sm animate-pulse">
            <Volume2 className="w-3.5 h-3.5 shrink-0" />
            <span className="text-[10px] font-semibold uppercase tracking-wider">Cinematic Instrumental Active</span>
          </div>

          <button
            onClick={() => { playKeyTap(); onRestart(); }}
            className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-2xl font-cute font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Watch Movie Again! 🎈</span>
          </button>
        </div>

        {/* Warm magical ending atmosphere copyright credit line (kept literal and clean per guidelines) */}
        <div className="text-[9px] text-neutral-500 tracking-wider uppercase font-sans">
          Happy Birthday Bhoomika ✨ • Strictly For Friendship
        </div>

      </div>
    </div>
  );
}
