import React, { useState, useEffect } from "react";
import { ChevronRight, ArrowLeft, Volume2, Sparkles } from "lucide-react";
import { BirthdayState } from "../types";
import { playSparkle, playKeyTap } from "../utils/audio";

interface FirstGiftAnimaticProps {
  state: BirthdayState;
  onComplete: () => void;
}

export default function FirstGiftAnimatic({ state, onComplete }: FirstGiftAnimaticProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [isAnimating, setIsAnimating] = useState(false);

  const photos = state.customPhotos;
  const currentPhoto = photos[slideIndex];

  // Restarts typewriter effect on slide change
  useEffect(() => {
    if (!currentPhoto) return;
    setIsAnimating(true);
    let index = 0;
    setTypewriterText("");
    
    // Smooth timing interval
    const textTarget = currentPhoto.caption;
    const interval = setInterval(() => {
      if (index < textTarget.length) {
        const char = textTarget.charAt(index);
        setTypewriterText((prev) => prev + char);
        index++;
      }
      if (index >= textTarget.length) {
        clearInterval(interval);
        setIsAnimating(false);
      }
    }, 45);

    return () => clearInterval(interval);
  }, [slideIndex, currentPhoto]);

  const handleNextSlide = () => {
    playSparkle();
    if (slideIndex < photos.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center overflow-hidden">
      
      {/* Cool cinematic dark background for movie feel, but keeping pastel highlight borders */}
      <div className="absolute inset-0 bg-neutral-900/90 pointer-events-none z-[-1]" />
      
      {/* Decorative starry patterns in dark BG */}
      <div className="absolute inset-0 opacity-20 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px] z-[-1]" />

      <div className="max-w-md w-full flex flex-col items-center space-y-7">
        
        {/* Memory Animatic Headers */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-400 bg-pink-950/80 border border-pink-700/50 px-3.5 py-1 rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto">
            <Volume2 className="w-3.5 h-3.5 animate-bounce" />
            <span>Memory Lane Music Active</span>
          </span>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Cinematic Memories 🎬
          </h2>
          <p className="text-xs text-neutral-400">
            Slide {slideIndex + 1} of {photos.length}
          </p>
        </div>

        {/* Elegant Polaroid Container with Dynamic Drop & Swing & 3D Entrance Animation */}
        <div 
          key={slideIndex}
          className={`relative w-full aspect-[4/5] max-w-[280px] bg-white p-4.5 pb-12 shadow-2xl rounded-xl border border-neutral-100/10 z-10 ${
            slideIndex % 4 === 0 
              ? "animate-photo-left" 
              : slideIndex % 4 === 1 
              ? "animate-photo-swing" 
              : slideIndex % 4 === 2
              ? "animate-photo-right"
              : "animate-photo-3d"
          }`}
          style={{
            transformOrigin: "center center",
          }}
        >
          <div className="w-full h-[82%] bg-neutral-950 rounded-lg overflow-hidden border border-neutral-800 shadow-inner relative group">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.caption}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-1000 scale-100 group-hover:scale-115 group-hover:rotate-1 filter brightness-95"
            />
            {/* Soft lighting sparkle overlays in photo corners */}
            <div className="absolute top-2 right-2 text-yellow-300 animate-pulse text-sm">✨</div>
            <div className="absolute bottom-2 left-2 text-blue-300 animate-pulse text-xs">⭐</div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white/5 pointer-events-none text-6xl">✨</div>
          </div>
          
          {/* Handwritten-vibe Page indicator in actual polaroid margin */}
          <div className="absolute bottom-3 right-4 font-mono text-[10px] text-neutral-400 font-bold">
            {slideIndex + 1}/{photos.length}
          </div>
        </div>

        {/* Subtitles text box with live typewriter effect */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/10 shadow-lg w-full max-w-sm h-28 flex items-center justify-center text-center">
          <p className="text-white font-cute font-medium text-sm sm:text-base leading-relaxed tracking-wide">
            {typewriterText}
            {isAnimating && (
              <span className="inline-block w-1.5 h-4 bg-pink-400 ml-1 animate-pulse" />
            )}
          </p>
        </div>

        {/* Slide controller logic */}
        <div className="flex gap-4 w-full justify-center max-w-xs">
          <button
            onClick={handleNextSlide}
            className="w-full py-3.5 bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600 text-white rounded-2xl font-cute font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm"
          >
            <span>{slideIndex === photos.length - 1 ? "Complete Memory Lane ✨" : "Next Slide"}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
