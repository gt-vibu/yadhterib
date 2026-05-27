import React, { useState } from "react";
import { Sparkles, Trophy, Cake, RefreshCw } from "lucide-react";
import { playCakeCut, playCheer, playSparkle } from "../utils/audio";

interface CakeTeleportationProps {
  targetAge: number; // e.g. 21
  recipientName: string;
  onCelebrationFinish: () => void;
}

interface Spark {
  id: number;
  x: number;
  y: number;
}

interface KnifeSlash {
  id: number;
  x: number;
  y: number;
}

interface BlastParticle {
  id: number;
  emoji: string;
  angle: number;
  speed: number;
}

export default function CakeTeleportation({ targetAge, recipientName, onCelebrationFinish }: CakeTeleportationProps) {
  const [cuts, setCuts] = useState(0);
  const [isCelebrated, setIsCelebrated] = useState(false);
  const [sparks, setSparks] = useState<Spark[]>([]);
  const [knives, setKnives] = useState<KnifeSlash[]>([]);
  const [blastParticles, setBlastParticles] = useState<BlastParticle[]>([]);
  const [isShaking, setIsShaking] = useState(false);

  // Trigger high-fidelity blast particles on completion
  const triggerBlastParticles = () => {
    const emojis = ["🎉", "⭐", "✨", "💥", "🧁", "🌟", "🎈", "🍒", "🔥"];
    const temp: BlastParticle[] = [];
    for (let i = 0; i < 35; i++) {
      temp.push({
        id: i,
        emoji: emojis[i % emojis.length],
        angle: Math.random() * 360,
        speed: 5 + Math.random() * 20
      });
    }
    setBlastParticles(temp);
  };

  const handleCakeClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isCelebrated) return;

    // Play slicing audio cue
    playCakeCut();

    // Coordinates of slicing spark click feedback
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Create a physical cutting knife slash
    const knifeId = Date.now() + Math.random();
    setKnives((prev) => [...prev, { id: knifeId, x, y }]);
    setTimeout(() => {
      setKnives((prev) => prev.filter((k) => k.id !== knifeId));
    }, 400);

    const checkSpark: Spark = {
      id: Date.now() + Math.random(),
      x,
      y
    };

    setSparks((prev) => [...prev, checkSpark]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== checkSpark.id));
    }, 800);

    const nextCuts = cuts + 1;
    setCuts(nextCuts);

    // Minor screen rumble on each slice
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 80);

    if (nextCuts >= targetAge) {
      setIsCelebrated(true);
      playCheer();
      playSparkle();
      triggerBlastParticles();
      
      // Intense screen rattle on final burst
      setIsShaking(true);
      setTimeout(() => {
        setIsShaking(false);
      }, 700);
    }
  };

  return (
    <div className={`min-h-screen w-full flex flex-col items-center justify-center p-6 relative z-10 font-cute text-center overflow-hidden transition-all duration-300 ${
      isShaking ? "animate-shake-blast bg-rose-100/20" : ""
    }`}>
      
      {/* Dreamy fantasy glowing skies background */}
      <div 
        className={`absolute inset-0 bg-gradient-to-b transition-colors duration-1000 pointer-events-none z-[-1] ${
          isCelebrated 
            ? "from-slate-900 via-neutral-950 to-blue-950" 
            : "from-pastel-pink-soft via-pastel-blue-soft to-white"
        }`} 
      />

      <div className="max-w-xl w-full flex flex-col items-center space-y-6">
        
        {/* Cinematic instructions Header */}
        <div className="space-y-1.5 z-10">
          <span className="text-xs font-bold uppercase tracking-widest text-pink-500 bg-pink-100 px-3.5 py-1 rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto animate-pulse">
            🎂 Magical Teleportation Portal
          </span>
          <h2 className={`text-2xl sm:text-3xl font-black tracking-tight transition-colors duration-1000 ${
            isCelebrated ? "text-yellow-300" : "text-neutral-700"
          }`}>
            {isCelebrated ? "IT'S A GIANT BLAST! 🎉" : "Cut the Birthday Cake! 🎂"}
          </h2>
          <p className={`text-xs transition-colors duration-1000 ${
            isCelebrated ? "text-neutral-300" : "text-neutral-500"
          }`}>
            {isCelebrated 
              ? `Hooray! Bhoomika's cake exploded with beautiful wishes! ✨` 
              : "cut the cake as the number of years you have grown beautiful"}
          </p>
        </div>

        {/* Clicks Cuts Progress Counter widget */}
        <div className={`rounded-xl px-5 py-2.5 transition-all duration-500 shadow-sm border font-mono flex items-center justify-center gap-2 ${
          isCelebrated 
            ? "bg-yellow-500/10 border-yellow-500/30 text-yellow-300" 
            : "bg-white border-pink-100 text-pink-500"
        }`}>
          <span className="text-[11px] font-bold uppercase tracking-wider font-cute">Cake Cuts Made:</span>
          <span className="text-sm font-bold">{cuts}</span>
        </div>

        {/* Teleportation Portal & Multi-tier HUGE Cake interaction */}
        <div 
          onClick={handleCakeClick}
          className={`relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center cursor-pointer select-none z-10 transition-transform ${
            isCelebrated ? "animate-cake-burst-bounce" : ""
          }`}
        >
          {/* Portal glow ring spin background animation */}
          <div className="absolute inset-2 rounded-full border-[3px] border-dashed border-pink-300 pointer-events-none animate-portal z-0 opacity-40" />
          <div className="absolute inset-8 rounded-full border-[2px] border-dashed border-sky-300 pointer-events-none animate-spin-slow z-0 opacity-30" />

          {/* Glowing particle dots rising from portal floor */}
          {!isCelebrated && (
            <div className="absolute inset-x-8 bottom-6 flex justify-around pointer-events-none z-10 opacity-60">
              <span className="w-2 h-8 bg-pink-300 rounded-full animate-steam" />
              <span className="w-2 h-8 bg-yellow-200 rounded-full animate-steam" style={{ animationDelay: "0.4s" }} />
              <span className="w-2 h-8 bg-sky-200 rounded-full animate-steam" style={{ animationDelay: "0.8s" }} />
              <span className="w-2 h-8 bg-white rounded-full animate-steam" style={{ animationDelay: "1.2s" }} />
            </div>
          )}

          {/* SVG Birthday Cake (MUCH BIGGER, grows, and splits on burst!) */}
          <div className="w-full h-full p-2 relative z-10 flex items-center justify-center">
            <svg viewBox="0 0 200 200" className="w-full h-full select-none drop-shadow-2xl overflow-visible">
              
              {/* Teleport Base ring */}
              <ellipse 
                cx="100" 
                cy="165" 
                rx={isCelebrated ? "85" : "70"} 
                ry="14" 
                fill={isCelebrated ? "#eab308" : "#ffccd5"} 
                opacity="0.35" 
                filter="blur(2px)" 
                style={{ transition: "all 0.8s ease-in-out" }}
              />
              
              {/* Stand Plate */}
              <ellipse cx="100" cy="158" rx="65" ry="9" fill="#ffffff" stroke="#ffccd5" strokeWidth="1.5" />

              {/* TIER 1 BASE (Moves downward on burst) */}
              <g style={{
                transform: isCelebrated ? "translateY(18px) rotate(-4deg)" : "none",
                transformOrigin: "100px 130px",
                transition: "transform 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}>
                <rect x="50" y="112" width="100" height="40" rx="8" fill="#ffe4e6" stroke="#fb7185" strokeWidth="1.5" />
                <path d="M50,120 Q62,127 75,120 Q87,127 100,120 Q112,127 125,120 Q137,127 150,120" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
                {/* Sprinkles decoration */}
                <circle cx="70" cy="132" r="3" fill="#ca8a04" />
                <circle cx="100" cy="136" r="3" fill="#f43f5e" />
                <circle cx="130" cy="132" r="3" fill="#38bdf8" />
                <circle cx="85" cy="140" r="3.5" fill="#10b981" />
                <circle cx="115" cy="140" r="3.5" fill="#f59e0b" />
              </g>

              {/* TIER 2 MID (Lifts high and tilts right on burst) */}
              <g style={{
                transform: isCelebrated ? "translateY(-25px) translateX(20px) rotate(14deg)" : "none",
                transformOrigin: "100px 100px",
                transition: "transform 0.85s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
              }}>
                {/* Cream dripping mid */}
                <rect x="62" y="80" width="76" height="34" rx="7" fill="#e0f2fe" stroke="#38bdf8" strokeWidth="1" />
                <path d="M62,88 Q72,94 82,88 Q92,94 102,88 Q112,94 122,88 Q132,94 138,88" fill="none" stroke="#ffffff" strokeWidth="3" />
                <ellipse cx="100" cy="81" rx="38" ry="5.5" fill="#ffffff" />
                
                {/* Slices cut progress */}
                {cuts > 0 && (
                  <g stroke="#ffffff" strokeWidth="2" opacity="0.8">
                    <line x1="100" y1="81" x2="80" y2="114" />
                    {cuts > 4 && <line x1="100" y1="81" x2="120" y2="114" />}
                    {cuts > 8 && <line x1="100" y1="81" x2="100" y2="114" />}
                    {cuts > 12 && <line x1="100" y1="81" x2="68" y2="95" />}
                    {cuts > 16 && <line x1="100" y1="81" x2="132" y2="95" />}
                  </g>
                )}
              </g>

              {/* TOP CANDLE (Launches high and flies away on burst) */}
              <g style={{
                transform: isCelebrated ? "translateY(-80px) translateX(-40px) rotate(-45deg) scale(0)" : "none",
                transformOrigin: "100px 65px",
                transition: "transform 1s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                opacity: isCelebrated ? 0 : 1
              }}>
                <rect x="96" y="52" width="8" height="30" rx="2" fill="#fdf2f8" stroke="#fbcfe8" strokeWidth="1" />
                <path d="M96,60 L104,65" stroke="#f43f5e" strokeWidth="2" />
                <line x1="100" y1="52" x2="100" y2="46" stroke="#374151" strokeWidth="1.5" />

                {/* Flame with glowing pulse */}
                <g className="animate-candle">
                  <path 
                    d="M100 28 C104 35, 105 44, 100 45 C95 44, 96 35, 100 28 Z" 
                    fill="#f43f5e"
                    style={{
                      transformOrigin: "100px 45px",
                      scale: 1.1 + (cuts * 0.05),
                      filter: "drop-shadow(0 0 6px #f43f5e)"
                    }}
                  />
                </g>
              </g>

            </svg>
          </div>

          {/* DYNAMIC SHINY METALLIC KNIVES SLASHING Downwards on click coordinates */}
          {knives.map((k) => (
            <div
              key={k.id}
              className="absolute pointer-events-none select-none z-30 animate-knife-slash origin-bottom-right"
              style={{
                left: `${k.x - 30}px`,
                top: `${k.y - 65}px`,
              }}
            >
              <svg viewBox="0 0 100 100" className="w-20 h-20 drop-shadow-2xl">
                {/* Shiny steel blade */}
                <path d="M15 85 L65 35 L75 35 L65 45 Z" fill="url(#steel-grad)" stroke="#94a3b8" strokeWidth="1.5" />
                {/* Ultra metal highlight sharp edge */}
                <line x1="15" y1="85" x2="65" y2="35" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" />
                {/* Wooden handle */}
                <rect x="68" y="22" width="10" height="24" rx="3.5" fill="#78350f" transform="rotate(45 68 22)" />
                {/* Cutting wind sparks */}
                <circle cx="25" cy="75" r="3" fill="#fff" className="animate-ping" />
                <line x1="30" y1="70" x2="10" y2="90" stroke="#f472b6" strokeWidth="2" opacity="0.75" />
                
                <defs>
                  <linearGradient id="steel-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#94a3b8" />
                    <stop offset="40%" stopColor="#f1f5f9" />
                    <stop offset="70%" stopColor="#cbd5e1" />
                    <stop offset="100%" stopColor="#475569" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
          ))}

          {/* Sparks/Cuts text info */}
          {sparks.map((spark) => (
            <div
              key={spark.id}
              className="absolute pointer-events-none select-none text-pink-600 font-extrabold font-cute animate-ping text-xl z-20"
              style={{
                left: `${spark.x}px`,
                top: `${spark.y}px`,
                textShadow: "0 2px 4px rgba(255,133,161,0.5)"
              }}
            >
              ⚡ SLASH!
            </div>
          ))}

          {/* DYNAMIC BLAST PARTICLES FLYING EVERYWHERE OUT FROM CAKE */}
          {isCelebrated && blastParticles.map((part) => (
            <div
              key={part.id}
              className="absolute pointer-events-none text-2xl"
              style={{
                animation: "float 2.5s cubic-bezier(0.1, 0.8, 0.3, 1) forwards",
                transform: `rotate(${part.angle}deg) translate(${part.speed * 8}px) rotate(-${part.angle}deg) scale(1.3)`,
                opacity: 0.9,
              }}
            >
              {part.emoji}
            </div>
          ))}

          {/* Comic Kaboom text label strictly on burst completion */}
          {isCelebrated && (
            <div className="absolute -top-6 -right-6 bg-yellow-400 border-4 border-neutral-900 text-neutral-900 font-black font-cute px-4 py-2.5 rounded-2xl rotate-12 scale-125 shadow-2xl animate-bounce z-40">
              ⚡ KABOOM! 🎂
            </div>
          )}

        </div>

        {/* MASSIVE CELEBRATION EFFECTS OVERLAY (Strictly NO Hearts) */}
        {isCelebrated && (
          <div className="absolute inset-0 z-20 pointer-events-none flex flex-col items-center justify-center overflow-hidden">
            {/* Confetti / Sparkle fall lists */}
            {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((id) => (
              <div
                key={id}
                className="absolute text-yellow-300 text-3xl animate-steam"
                style={{
                  left: `${5 + id * 8.5}%`,
                  top: `${Math.random() * -20}%`,
                  animationDuration: `${2.5 + Math.random() * 2.5}s`,
                  animationDelay: `${id * 0.15}s`
                }}
              >
                {["✨", "⭐", "🎉", "🎈", "🌟", "🎈", "🍿", "🎁", "🍬", "🍭", "✨", "🍿"][id % 12]}
              </div>
            ))}
          </div>
        )}

        {/* Action Next navigation block */}
        <div className="w-full flex justify-center z-20">
          {isCelebrated ? (
            <button
              onClick={() => { playCakeCut(); onCelebrationFinish(); }}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 hover:from-amber-500 text-neutral-900 rounded-full font-cute font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer text-sm animate-glow-pulse flex items-center gap-2 border-2 border-amber-300"
              id="celebrade-finish-btn"
            >
              <Trophy className="w-4.5 h-4.5" />
              <span>Let's Read Your Wish! 💖</span>
            </button>
          ) : (
            <div className="text-[11px] text-neutral-500 italic bg-white/60 backdrop-blur-sm px-4 py-1.5 rounded-full border border-pink-100 shadow-sm">
              🍰 Tap/click to slice the cake with a realistic knife! The flame swells!
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
