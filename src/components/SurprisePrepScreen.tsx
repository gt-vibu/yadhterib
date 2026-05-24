import React, { useState } from "react";
import { Sparkles, ThumbsUp, ShieldAlert, RotateCcw } from "lucide-react";
import { playSparkle, playKeyTap, playAngry } from "../utils/audio";

interface SurprisePrepProps {
  recipientName: string;
  onYes: () => void;
}

export default function SurprisePrepScreen({ recipientName, onYes }: SurprisePrepProps) {
  const [isAngry, setIsAngry] = useState(false);

  const handleNoClick = () => {
    setIsAngry(true);
    playAngry();
  };

  const handleTryAgain = () => {
    playKeyTap();
    setIsAngry(false);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center">
      
      {/* Dynamic background color shifts when angry */}
      <div 
        className={`absolute inset-0 transition-all duration-700 pointer-events-none z-[-1] ${
          isAngry 
            ? "bg-rose-100/90" 
            : "bg-gradient-to-br from-pastel-blue-soft via-white to-pastel-pink-soft/70"
        }`} 
      />

      <div className="max-w-md w-full flex flex-col items-center space-y-6">
        
        {/* Header Text */}
        {!isAngry ? (
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-widest text-[#ff85a1] bg-pink-50 px-3 py-1 rounded-full animate-pulse">
              🧐 Big Decision
            </span>
            <h1 className="text-2xl sm:text-3xl font-bold text-neutral-700 tracking-tight">
              Are you ready for your surprise? ✨
            </h1>
            <p className="text-xs text-neutral-400">
              Only choose Yes if you promise to smile all along!
            </p>
          </div>
        ) : (
          <div className="space-y-1 animate-bounce">
            <span className="text-xs font-bold uppercase tracking-widest text-red-600 bg-red-100 px-3 py-1 rounded-full">
              🚨 HOW DARE YOU!
            </span>
            <h1 className="text-3xl font-bold text-red-600 tracking-tight">
              NO IS NOT AN OPTION! 😤
            </h1>
            <p className="text-xs text-red-500">
              The bunny demands absolute birthday compliance!
            </p>
          </div>
        )}

        {/* Dynamic Interactive Bunny SVG */}
        <div 
          className={`w-64 h-64 relative flex items-center justify-center transition-transform duration-300 ${
            isAngry ? "animate-wiggle scale-110" : "animate-float"
          }`}
        >
          <svg viewBox="0 0 200 200" className="w-full h-full select-none">
            {/* Ambient Sparkles around Bunny when Happy */}
            {!isAngry && (
              <g className="animate-pulse">
                <path d="M40 30 L45 35 M45 30 L40 35" stroke="#fffb96" strokeWidth="2" strokeLinecap="round" />
                <path d="M165 40 L170 45 M170 40 L165 45" stroke="#ffd3e1" strokeWidth="2.5" strokeLinecap="round" />
                <circle cx="150" cy="150" r="3" fill="#bde0fe" />
                <circle cx="50" cy="140" r="2.5" fill="#fffb96" />
              </g>
            )}

            {/* Angry Steam puffs near head when Angry */}
            {isAngry && (
              <g className="animate-steam">
                {/* Left steam puff */}
                <circle cx="35" cy="55" r="7" fill="#fff" opacity="0.8" />
                <circle cx="43" cy="50" r="5" fill="#fff" opacity="0.8" />
                {/* Right steam puff */}
                <circle cx="165" cy="55" r="7" fill="#fff" opacity="0.8" />
                <circle cx="157" cy="50" r="5" fill="#fff" opacity="0.8" />
              </g>
            )}

            <g transform="translate(40, 20)">
              {/* Bunny Long Ears */}
              {/* Left Ear */}
              <path 
                d="M30 40 C15 0, 10 -10, 25 2 C30 20, 32 30, 35 45" 
                fill={isAngry ? "#ffccd5" : "#fff"} 
                stroke={isAngry ? "#f43f5e" : "#e4e4e7"}
                strokeWidth="2"
                className={isAngry ? "origin-bottom rotate-[-12deg] transition-all" : "animate-wiggle origin-bottom"}
              />
              <path 
                d="M26 35 C18 10, 15 5, 23 15 C27 25, 29 32, 31 40" 
                fill="#fda4af" 
              />
              
              {/* Right Ear */}
              <path 
                d="M90 40 C105 0, 110 -10, 95 2 C90 20, 88 30, 85 45" 
                fill={isAngry ? "#ffccd5" : "#fff"} 
                stroke={isAngry ? "#f43f5e" : "#e4e4e7"}
                strokeWidth="2"
                className={isAngry ? "origin-bottom rotate-[12deg] transition-all" : "animate-wiggle origin-bottom"}
                style={{ animationDelay: "0.25s" }}
              />
              <path 
                d="M94 35 C102 10, 105 5, 97 15 C93 25, 91 32, 89 40" 
                fill="#fda4af" 
              />

              {/* Head */}
              <circle 
                cx="60" 
                cy="75" 
                r="35" 
                fill={isAngry ? "#fff1f2" : "#ffffff"} 
                stroke={isAngry ? "#f43f5e" : "#f4f4f5"} 
                strokeWidth="2.5" 
              />

              {/* Snout Whiskers */}
              <line x1="18" y1="78" x2="6" y2="76" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" />
              <line x1="18" y1="83" x2="4" y2="84" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" />
              <line x1="102" y1="78" x2="114" y2="76" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" />
              <line x1="102" y1="83" x2="116" y2="84" stroke="#d4d4d8" strokeWidth="2" strokeLinecap="round" />

              {/* Angry VS Excited Eyes & Cheeks */}
              {!isAngry ? (
                <>
                  {/* Happy closed curve eyes */}
                  <path d="M43 72 Q48 66 53 72" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
                  <path d="M67 72 Q72 66 77 72" fill="none" stroke="#27272a" strokeWidth="3" strokeLinecap="round" />
                  {/* Cute rosy cheeks */}
                  <circle cx="34" cy="79" r="6" fill="#fecdd3" opacity="0.9" />
                  <circle cx="86" cy="79" r="6" fill="#fecdd3" opacity="0.9" />
                  {/* Waving Smile mouth */}
                  <path d="M56 82 Q60 85 64 82" fill="none" stroke="#27272a" strokeWidth="2.5" strokeLinecap="round" />
                </>
              ) : (
                <>
                  {/* Furrowed angry eyes / diagonal slash */}
                  <line x1="42" y1="67" x2="52" y2="73" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
                  <line x1="78" y1="67" x2="68" y2="73" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
                  {/* Angry cheeks / red blushing */}
                  <circle cx="34" cy="79" r="6.5" fill="#f43f5e" opacity="0.6" className="animate-ping" />
                  <circle cx="86" cy="79" r="6.5" fill="#f43f5e" opacity="0.6" className="animate-ping" />
                  {/* Frowning mouth */}
                  <path d="M54 85 Q60 79 66 85" fill="none" stroke="#e11d48" strokeWidth="3.5" strokeLinecap="round" />
                </>
              )}

              {/* Cute Bunny Nose */}
              <polygon points="58,78 62,78 60,81" fill={isAngry ? "#e11d48" : "#f43f5e"} />

              {/* Dancing clap paws */}
              {!isAngry ? (
                <g className="animate-bounce" style={{ transformOrigin: "60px 105px" }}>
                  <ellipse cx="42" cy="106" rx="7" ry="12" fill="#fff" stroke="#f4f4f5" strokeWidth="2" />
                  <ellipse cx="78" cy="106" rx="7" ry="12" fill="#fff" stroke="#f4f4f5" strokeWidth="2" />
                </g>
              ) : (
                <g className="animate-wiggle" style={{ transformOrigin: "60px 105px" }}>
                  {/* Stompy cross paws */}
                  <ellipse cx="36" cy="103" rx="10" ry="6" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2.5" />
                  <ellipse cx="84" cy="103" rx="10" ry="6" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2.5" />
                </g>
              )}
            </g>
          </svg>

          {/* Stompy lines when angry */}
          {isAngry && (
            <div className="absolute -bottom-2 inset-x-0 flex justify-between px-6 pointer-events-none">
              <div className="w-1.5 h-6 bg-red-400 rounded-full animate-bounce" />
              <div className="w-1.5 h-6 bg-red-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
            </div>
          )}
        </div>

        {/* Question Choices buttons */}
        {!isAngry ? (
          <div id="prep-options" className="flex gap-4 w-full justify-center max-w-xs">
            <button
              onClick={onYes}
              className="flex-1 py-3.5 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-white rounded-2xl font-cute font-bold shadow-md hover:shadow-lg transition-all scale-100 hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1.5 text-sm"
            >
              <ThumbsUp className="w-4 h-4" />
              <span>YES, READY! ✨</span>
            </button>

            <button
              onClick={handleNoClick}
              className="flex-1 py-3.5 bg-white border border-rose-100 hover:bg-rose-50 text-rose-400 rounded-2xl font-cute font-bold shadow-xs hover:shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-1 text-sm"
            >
              <span>NO 🤫</span>
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3 w-full justify-center max-w-xs animate-pulse">
            <button
              onClick={handleTryAgain}
              className="w-full py-4 bg-gradient-to-r from-red-400 to-red-500 hover:from-red-500 hover:to-red-600 text-white rounded-2xl font-cute font-bold shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-sm"
              id="bunny-retry-btn"
            >
              <RotateCcw className="w-4 h-4" />
              <span>I'M SORRY, LET ME BE READY! ✨</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
