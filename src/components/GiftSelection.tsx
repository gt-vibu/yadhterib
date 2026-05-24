import React from "react";
import { Sparkles, Gift, CheckCircle } from "lucide-react";
import { playSparkle, playKeyTap } from "../utils/audio";

interface GiftSelectionProps {
  completedGifts: {
    gift1: boolean;
    gift2: boolean;
    gift3: boolean;
  };
  onSelectGift: (giftNumber: 1 | 2 | 3) => void;
}

export default function GiftSelection({ completedGifts, onSelectGift }: GiftSelectionProps) {
  
  // Decide what step of guide instructions they are on
  let guideMessage = "";
  let activeGift: 1 | 2 | 3 | null = null;

  if (!completedGifts.gift1) {
    guideMessage = "Click the FIRST gift box first ✨";
    activeGift = 1;
  } else if (!completedGifts.gift3) {
    guideMessage = "Now click the THIRD gift box ✨";
    activeGift = 3;
  } else if (!completedGifts.gift2) {
    guideMessage = "Now click the MIDDLE gift box ✨";
    activeGift = 2;
  } else {
    guideMessage = "Wow, you've unlocked all the secret items! Opening the final portal... 🌟";
    activeGift = null;
  }

  const handleSelect = (num: 1 | 2 | 3) => {
    // Rigid constraint: they must follow the sequence guide!
    if (num !== activeGift && activeGift !== null) {
      playKeyTap();
      alert(`Psst! Let's follow the surprise path! Please open the box currently guided: ${
        activeGift === 1 ? "FIRST" : activeGift === 3 ? "THIRD" : "MIDDLE"
      } Gift Box! ✨`);
      return;
    }
    
    playSparkle();
    onSelectGift(num);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center">
      
      {/* Cool background overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-pastel-pink-soft via-white to-pastel-blue-soft/50 pointer-events-none z-[-1]" />

      <div className="max-w-2xl w-full flex flex-col items-center space-y-7">
        
        {/* Banner Headers */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5dade2] bg-blue-50 px-3.5 py-1 rounded-full">
            🎁 Birthday Chests
          </span>
          <h1 className="text-3xl font-bold text-neutral-700 tracking-tight">
            Gift for you 🎁
          </h1>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            These containers are floating with pure joy! Go ahead and interact with them in order.
          </p>
        </div>

        {/* Dynamic Glowing Companion Guide Banner */}
        <div className="w-full max-w-sm py-3 px-5 rounded-2xl bg-amber-50/70 border border-amber-200 shadow-xs flex items-center justify-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4 text-amber-500 fill-amber-100" />
          <span className="text-xs font-semibold text-amber-700 tracking-wide font-cute">
            {guideMessage}
          </span>
        </div>

        {/* Gift Boxes Layout (1, 2, 3) */}
        {/* We place them horizontally relative to visual reference */}
        <div id="gift-boxes-deck" className="grid grid-cols-1 sm:grid-cols-3 gap-6.5 w-full max-w-lg mt-3">
          
          {/* GIFT BOX 1 */}
          <div 
            onClick={() => handleSelect(1)}
            className={`cursor-pointer rounded-3xl p-5 border flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden h-52 bg-white ${
              activeGift === 1 
                ? "border-pink-300 ring-2 ring-pink-200 animate-glow-pulse scale-105" 
                : completedGifts.gift1 
                ? "border-emerald-200 bg-emerald-50/20 grayscale-30 scale-95 opacity-80" 
                : "border-neutral-100 scale-95 opacity-50"
            }`}
          >
            {completedGifts.gift1 && (
              <CheckCircle className="absolute top-3 right-3 text-emerald-500 w-5 h-5 fill-white" />
            )}
            
            <div className={`text-4xl mb-3 ${activeGift === 1 ? "animate-wiggle" : ""}`}>
              🎁
            </div>
            <h3 className="font-bold text-sm text-neutral-700">The First Gift</h3>
            <span className="text-[10px] text-neutral-400 mt-1 uppercase font-semibold">Memory Animatic</span>
            
            <span className="mt-4 text-[11px] bg-pink-50 text-pink-500 font-bold px-3 py-1 rounded-full">
              {completedGifts.gift1 ? "Unwrapped ✓" : activeGift === 1 ? "Click to open ✨" : "Locked"}
            </span>
          </div>

          {/* GIFT BOX 2 (Middle) - Second to be opened */}
          <div 
            onClick={() => handleSelect(2)}
            className={`cursor-pointer rounded-3xl p-5 border flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden h-52 bg-white ${
              activeGift === 2 
                ? "border-amber-300 ring-2 ring-amber-200 animate-glow-pulse scale-105" 
                : completedGifts.gift2 
                ? "border-emerald-200 bg-emerald-50/20 grayscale-30 scale-95 opacity-80" 
                : "border-neutral-100 scale-95 opacity-50"
            }`}
          >
            {completedGifts.gift2 && (
              <CheckCircle className="absolute top-3 right-3 text-emerald-500 w-5 h-5 fill-white" />
            )}
            
            <div className={`text-4xl mb-3 ${activeGift === 2 ? "animate-wiggle" : ""}`}>
              🗝️
            </div>
            <h3 className="font-bold text-sm text-neutral-700">The Middle Gift</h3>
            <span className="text-[10px] text-neutral-400 mt-1 uppercase font-semibold">Glowing Door</span>
            
            <span className="mt-4 text-[11px] bg-amber-50 text-amber-600 font-bold px-3 py-1 rounded-full">
              {completedGifts.gift2 ? "Unwrapped ✓" : activeGift === 2 ? "Click to open ✨" : "Locked"}
            </span>
          </div>

          {/* GIFT BOX 3 - Clicked second (after gift1) */}
          <div 
            onClick={() => handleSelect(3)}
            className={`cursor-pointer rounded-3xl p-5 border flex flex-col items-center justify-center shadow-lg transition-all duration-300 relative overflow-hidden h-52 bg-white ${
              activeGift === 3 
                ? "border-blue-300 ring-2 ring-blue-200 animate-glow-pulse scale-105" 
                : completedGifts.gift3 
                ? "border-emerald-200 bg-emerald-50/20 grayscale-30 scale-95 opacity-80" 
                : "border-neutral-100 scale-95 opacity-50"
            }`}
          >
            {completedGifts.gift3 && (
              <CheckCircle className="absolute top-3 right-3 text-emerald-500 w-5 h-5 fill-white" />
            )}
            
            <div className={`text-4xl mb-3 ${activeGift === 3 ? "animate-wiggle" : ""}`}>
              🍜
            </div>
            <h3 className="font-bold text-sm text-neutral-700">The Third Gift</h3>
            <span className="text-[10px] text-neutral-400 mt-1 uppercase font-semibold">Street-Food Shop</span>
            
            <span className="mt-4 text-[11px] bg-blue-50 text-blue-600 font-bold px-3 py-1 rounded-full">
              {completedGifts.gift3 ? "Unwrapped ✓" : activeGift === 3 ? "Click to open ✨" : "Locked"}
            </span>
          </div>

        </div>

        {/* Dynamic Completed trigger */}
        {completedGifts.gift1 && completedGifts.gift2 && completedGifts.gift3 && (
          <div className="text-[11px] tracking-wide text-neutral-400 italic">
            🌟 All gifts are opened! You have been exceptional. Proceeding to destination...
          </div>
        )}
      </div>

    </div>
  );
}
