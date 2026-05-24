import React, { useState, useEffect } from "react";
import { Sparkles, Key, Eye, HelpCircle, RefreshCw } from "lucide-react";
import { BirthdayState } from "../types";
import { playKeyTap, playSuccess, playAmbientBeep, playSparkle } from "../utils/audio";

interface PasscodeScreenProps {
  state: BirthdayState;
  onSuccess: () => void;
}

export default function PasscodeScreen({ state, onSuccess }: PasscodeScreenProps) {
  const [pin, setPin] = useState("");
  const [isError, setIsError] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  // Take current code config from state or default to 2005
  const correctCode = state.passcode || "2005";

  const handleKeyPress = (num: string) => {
    if (isUnlocked) return;
    playKeyTap();
    if (pin.length < 4) {
      const newPin = pin + num;
      setPin(newPin);
      
      // Auto-submit on 4 chars
      if (newPin === correctCode) {
        setIsUnlocked(true);
        playSuccess();
        setTimeout(() => {
          onSuccess();
        }, 1200);
      } else if (newPin.length === 4) {
        // Wrong passcode shake
        setTimeout(() => {
          setIsError(true);
          playAmbientBeep(220, 0.4, "sawtooth");
          setTimeout(() => {
            setIsError(false);
            setPin("");
          }, 800);
        }, 150);
      }
    }
  };

  const handleBackspace = () => {
    if (isUnlocked) return;
    playKeyTap();
    setPin((prev) => prev.slice(0, -1));
  };

  const handleClear = () => {
    playKeyTap();
    setPin("");
  };

  // Animate initial sparkles around the Polaroid
  useEffect(() => {
    playSparkle();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 relative z-10 font-cute">
      
      {/* Background Soft Interactive Ambient Layer */}
      <div className="absolute inset-0 bg-[#eaf6ff]/90 pointer-events-none z-[-1]" />

      {/* Main card box container */}
      <div 
        id="passcode-card"
        className={`w-full max-w-sm bg-white/70 backdrop-blur-md rounded-3xl p-6 shadow-xl border border-blue-50/80 text-center flex flex-col items-center transition-all ${
          isError ? "animate-wiggle border-red-200 bg-red-50/40" : ""
        } ${isUnlocked ? "scale-95 opacity-50 filter blur-xs duration-700" : ""}`}
      >
        
        {/* Decorative Top Banner */}
        <div className="mb-4">
          <span className="text-xs tracking-wider uppercase bg-blue-100 text-blue-600 px-3 py-1 rounded-full font-bold">
            🔒 Secret Entrance
          </span>
        </div>

        {/* Polaroid Style Photo Frame with Teddy Bear illustration */}
        <div className="relative w-full aspect-square max-w-[190px] bg-white p-3 shadow-md rounded-lg rotate-[-3deg] transition-transform hover:rotate-[1deg] hover:scale-105 duration-300">
          <div className="w-full aspect-square bg-sky-50 rounded-md overflow-hidden relative border border-neutral-100">
            {state.customPhotos && state.customPhotos[0] ? (
              <img
                src={state.customPhotos[0].url}
                alt="Birthday person photo preset"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-sky-100 text-sky-400">
                ⭐
              </div>
            )}
            
            {/* Ambient Sparkly Lights floating inside photo corners */}
            <div className="absolute top-1 right-1 text-yellow-300 animate-pulse text-sm">✨</div>
            <div className="absolute bottom-1 left-1 text-blue-300 animate-pulse text-xs">⭐</div>
          </div>
          <div className="pt-2 text-[10px] text-neutral-500 font-medium tracking-wide">
            For: {state.recipientName} 🎂
          </div>

          {/* Teddy Bear Beside Photo */}
          <div className="absolute -bottom-4 -right-12 w-16 h-16 pointer-events-none select-none drop-shadow-md animate-float">
            <svg viewBox="0 0 100 100" className="w-full h-full">
              {/* Ears */}
              <circle cx="28" cy="30" r="14" fill="#a07a55" />
              <circle cx="28" cy="30" r="8" fill="#dfa599" />
              <circle cx="72" cy="30" r="14" fill="#a07a55" />
              <circle cx="72" cy="30" r="8" fill="#dfa599" />
              {/* Head */}
              <circle cx="50" cy="50" r="34" fill="#bb936c" />
              {/* Head Inner snout */}
              <ellipse cx="50" cy="58" rx="14" ry="10" fill="#fff5ec" />
              {/* Nose */}
              <polygon points="46,55 54,55 50,59" fill="#4a3b32" />
              {/* Eyes */}
              <circle cx="38" cy="46" r="4.5" fill="#2d221c" />
              <circle cx="38" cy="46" r="1" fill="#fff" />
              <circle cx="62" cy="46" r="4.5" fill="#2d221c" />
              <circle cx="62" cy="46" r="1" fill="#fff" />
              {/* Cute Cheeks */}
              <circle cx="30" cy="53" r="5" fill="#ffa49e" opacity="0.8" />
              <circle cx="70" cy="53" r="5" fill="#ffa49e" opacity="0.8" />
            </svg>
          </div>
        </div>

        {/* Cinematic instructions */}
        <h2 className="mt-5 text-lg font-bold text-neutral-700 tracking-tight flex items-center gap-1.5 justify-center">
          <span>Enter Unlock Code</span>
          <span className="text-yellow-400 animate-pulse">✨</span>
        </h2>
        <p className="text-xs text-neutral-400 mt-0.5">
          Clue: Check the year she was born! 🌸
        </p>

        {/* Passcode Circles Displays */}
        <div className="flex gap-4.5 my-6.5">
          {[0, 1, 2, 3].map((idx) => (
            <div
              key={idx}
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                pin.length > idx
                  ? isUnlocked
                    ? "bg-emerald-400 border-emerald-400 scale-125 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
                    : "bg-blue-400 border-blue-400 scale-110 shadow-md"
                  : "bg-transparent border-blue-200"
              }`}
            />
          ))}
        </div>

        {/* Rounded Keypad */}
        <div id="keypad" className="grid grid-cols-3 gap-3 w-full max-w-[240px] mb-4">
          {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num)}
              className="aspect-square rounded-2xl bg-white border border-blue-50/70 hover:bg-blue-50/60 active:bg-blue-100 text-blue-600 font-bold text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
            >
              {num}
            </button>
          ))}
          
          {/* Backspace code */}
          <button
            onClick={handleClear}
            className="rounded-2xl bg-white border border-blue-50/70 hover:bg-red-50 text-red-400 font-medium text-xs shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            Clear
          </button>

          {/* Number 0 */}
          <button
            onClick={() => handleKeyPress("0")}
            className="aspect-square rounded-2xl bg-white border border-blue-50/70 hover:bg-blue-50/60 active:bg-blue-100 text-blue-600 font-bold text-lg shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            0
          </button>

          {/* Backspace single */}
          <button
            onClick={handleBackspace}
            className="rounded-2xl bg-white border border-blue-50/70 hover:bg-amber-50 text-amber-500 font-bold text-sm shadow-sm hover:scale-105 active:scale-95 transition-all cursor-pointer flex items-center justify-center"
          >
            ⌫
          </button>
        </div>

        {/* Display feedback on unlocks */}
        {isUnlocked && (
          <div className="text-xs font-semibold text-emerald-500 animate-pulse flex items-center gap-1 mt-1 justify-center">
            🔐 Unlocking magical adventure...
          </div>
        )}

        {/* Hint button */}
        {!isUnlocked && (
          <div className="mt-2 text-xs flex flex-col items-center">
            <button
              onClick={() => { playKeyTap(); setShowHint(!showHint); }}
              className="text-blue-400 hover:text-blue-500 underline flex items-center gap-1 cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Need the passcode?</span>
            </button>
            {showHint && (
              <span className="mt-1 bg-blue-50 text-blue-600 px-2.5 py-1 rounded-md text-[11px] font-mono shadow-xs animate-float">
                Secret code is: {correctCode} ✨
              </span>
            )}
          </div>
        )}
      </div>

    </div>
  );
}
