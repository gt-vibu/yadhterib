import React, { useEffect } from "react";
import { ArrowRight, Sparkles } from "lucide-react";
import { playSparkle, playKeyTap } from "../utils/audio";

interface IntroScreenProps {
  recipientName: string;
  onNext: () => void;
}

export default function IntroScreen({ recipientName, onNext }: IntroScreenProps) {
  useEffect(() => {
    playSparkle();
  }, []);

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center">
      
      {/* Soft warm/cool background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-pastel-pink-soft via-white to-pastel-blue-soft/50 pointer-events-none z-[-1]" />

      <div className="max-w-md w-full flex flex-col items-center space-y-6">
        
        {/* Animated Celebration Banner */}
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#5dade2] bg-blue-50 px-3 py-1 rounded-full animate-bounce">
            🎈 Mystery Delivery
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-neutral-700 leading-snug">
            Hey <span className="text-pink-500 underline decoration-pink-300 decoration-wavy">{recipientName}</span>...
          </h1>
        </div>

        {/* Dynamic cute Japanese/Korean Style Birthday Animal Band Graphics (Cats, Bears, Bunnies) */}
        <div className="relative w-64 h-64 flex items-center justify-center animate-float">
          <svg viewBox="0 0 200 200" className="w-full h-full select-none drop-shadow-lg">
            {/* Background floating decor */}
            <circle cx="40" cy="50" r="4" fill="#ffd3e1" className="animate-pulse" />
            <circle cx="160" cy="40" r="5" fill="#bde0fe" className="animate-pulse" />
            <polygon points="100,20 103,26 110,27 105,32 106,38 100,35 94,38 95,32 90,27 97,26" fill="#ffd3e1" />

            {/* Bear Character (Left) */}
            <g transform="translate(15, 60)">
              {/* Ears */}
              <circle cx="25" cy="40" r="8" fill="#bc987b" />
              <circle cx="25" cy="40" r="4.5" fill="#ffd3e1" />
              <circle cx="55" cy="40" r="8" fill="#bc987b" />
              <circle cx="55" cy="40" r="4.5" fill="#ffd3e1" />
              {/* Head */}
              <circle cx="40" cy="54" r="18" fill="#d2a679" />
              {/* Snout */}
              <ellipse cx="40" cy="58" rx="7" ry="5" fill="#fff" />
              <circle cx="40" cy="56" r="2" fill="#3a2512" />
              {/* Eyes */}
              <circle cx="34" cy="51" r="2" fill="#3a2512" />
              <circle cx="46" cy="51" r="2" fill="#3a2512" />
              {/* Little blush */}
              <circle cx="30" cy="56" r="3" fill="#ffccd5" />
              <circle cx="50" cy="56" r="3" fill="#ffccd5" />
              {/* Little bear body holding party streamer / flag */}
              <rect x="30" y="70" width="20" height="25" rx="8" fill="#d2a679" />
              <line x1="28" y1="78" x2="16" y2="70" stroke="#d2a679" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Kitty Character (Right) */}
            <g transform="translate(100, 60)">
              {/* Cat pointy ears */}
              <polygon points="20,40 34,26 40,43" fill="#cbd5e1" />
              <polygon points="24,38 31,29 35,40" fill="#fecdd3" />
              <polygon points="60,40 46,26 40,43" fill="#cbd5e1" />
              <polygon points="56,38 49,29 45,40" fill="#fecdd3" />
              {/* Cat head */}
              <circle cx="40" cy="54" r="18" fill="#e2e8f0" />
              {/* Eyes */}
              <circle cx="33" cy="51" r="2" fill="#1e293b" />
              <circle cx="47" cy="51" r="2" fill="#1e293b" />
              {/* Pink Nose & Whiskers */}
              <circle cx="40" cy="55" r="2" fill="#f43f5e" />
              <line x1="26" y1="56" x2="18" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="26" y1="60" x2="18" y2="61" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="54" y1="56" x2="62" y2="55" stroke="#94a3b8" strokeWidth="1.5" />
              <line x1="54" y1="60" x2="62" y2="61" stroke="#94a3b8" strokeWidth="1.5" />
              {/* Body holding small present */}
              <rect x="30" y="71" width="20" height="24" rx="8" fill="#e2e8f0" />
              <rect x="33" y="76" width="14" height="14" rx="3" fill="#fed7aa" />
              <line x1="40" y1="76" x2="40" y2="90" stroke="#f97316" strokeWidth="2" />
              <line x1="33" y1="83" x2="47" y2="83" stroke="#f97316" strokeWidth="2" />
            </g>

            {/* Cake on Table in Center */}
            <g transform="translate(68, 120)">
              {/* Table */}
              <ellipse cx="32" cy="53" rx="42" ry="8" fill="#e2e8f0" />
              {/* Mini birthday cake */}
              <rect x="15" y="24" width="34" height="25" rx="6" fill="#fdf2f8" />
              {/* Cake topping cream dripping */}
              <path d="M15 30 L15 34 Q20 38 25 32 Q30 38 35 32 Q40 38 45 32 L49 32 L49 24 Z" fill="#fbcfe8" />
              {/* Candles */}
              <line x1="22" y1="24" x2="22" y2="14" stroke="#fed7aa" strokeWidth="3" />
              <line x1="32" y1="24" x2="32" y2="10" stroke="#fbcfe8" strokeWidth="3" />
              <line x1="42" y1="24" x2="42" y2="14" stroke="#bde0fe" strokeWidth="3" />
              {/* Flame spark */}
              <circle cx="22" cy="11" r="2.5" fill="#fca5a5" className="animate-ping" />
              <circle cx="32" cy="7" r="2.5" fill="#fca5a5" className="animate-ping" />
              <circle cx="42" cy="11" r="2.5" fill="#fca5a5" className="animate-ping" />
            </g>
          </svg>
          
          <div className="absolute inset-0 border-[3px] border-dashed border-pink-200 rounded-full animate-spin-slow opacity-40 scale-105 pointer-events-none" />
        </div>

        {/* Narrative Intro dialogue */}
        <div className="bg-white/60 backdrop-blur-md rounded-2xl py-4.5 px-6 border border-pink-50/50 shadow-sm max-w-sm">
          <p className="text-neutral-600 font-cute font-medium text-sm leading-relaxed">
            “Someone has something very special and magical in store for you... Are you ready to see who is behind it?”
          </p>
        </div>

        {/* Next page action button */}
        <button
          onClick={() => { playKeyTap(); onNext(); }}
          className="px-8 py-3.5 bg-gradient-to-r from-[#5dade2] to-[#bde0fe] hover:from-sky-500 hover:to-sky-400 text-white rounded-full font-cute font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm animate-glow-pulse"
          id="intro-next-btn"
        >
          <span>See what's next</span>
          <ArrowRight className="w-4 h-4" />
        </button>

      </div>
    </div>
  );
}
