import React, { useState, useEffect } from "react";
import { Sparkles, Soup, ArrowRight, Store, Volume2, Flame, RefreshCw } from "lucide-react";
import { playSparkle, playKeyTap, playSlide, playSteam, playSizzle, playSuccess, playCakeCut } from "../utils/audio";

interface ThirdGiftStreetFoodProps {
  recipientName: string;
  onComplete: () => void;
}

interface DialogueNode {
  speaker: string;
  text: string;
  foodId?: number; // 1: golgappa, 2: noodles, 3: lemon rice, 4: masala puri
  foodName?: string;
}

export default function ThirdGiftStreetFood({ recipientName, onComplete }: ThirdGiftStreetFoodProps) {
  const [dialogueIndex, setDialogueIndex] = useState(0);
  const [typewriterText, setTypewriterText] = useState("");
  const [isBlinking, setIsBlinking] = useState(false);
  const [handGesture, setHandGesture] = useState<"wave" | "clap" | "point" | "neutral">("wave");

  // Interaction states for each specific food item
  const [puris, setPuris] = useState<number[]>([0, 0, 0, 0, 0, 0]); // 0: untouched, 1: cracked, 2: filled with pani, 3: eaten!
  const [chopstickRotation, setChopstickRotation] = useState(0);
  const [noodleMouthCount, setNoodleMouthCount] = useState(0);
  const [lemonSqueezes, setLemonSqueezes] = useState(0);
  const [cashewPositions, setCashewPositions] = useState<{ x: number; y: number }[]>([]);
  const [sevSprinkleCount, setSevSprinkleCount] = useState(0);
  const [corianderLeaves, setCorianderLeaves] = useState<{ x: number; y: number; r: number }[]>([]);
  const [servingAnimState, setServingAnimState] = useState<"hidden" | "incoming" | "served">("hidden");

  // Story Nodes list for street food shop dialogue clicks
  const dialogueNodes: DialogueNode[] = [
    {
      speaker: "Subramani",
      text: `Hi ${recipientName}, I am Subramani! Hope you are having a beautiful, joyous day. You have come to the best street food corner in town today. Let me whip up some of your absolute favorites! 👨‍🍳✨`
    },
    {
      speaker: "Subramani",
      text: "First up! Crispy, gold-colored Golgappas / Pani Puri! Tap each puri to crack it open, fill it with green tangy mint pani, and eat it! 😋",
      foodId: 1,
      foodName: "Crispy Pani Puri"
    },
    {
      speaker: "Subramani",
      text: "Coming up next! Sizzling Hot Veggie Noodles, cooked to perfection under high flame. Tap the chopsticks to swirl and grab a delicious bite! 🍜🔥",
      foodId: 2,
      foodName: "Hot Veggie Noodles"
    },
    {
      speaker: "Subramani",
      text: "Here's a comforting classic: Warm, golden-fragrant Lemon Rice served elegantly on a fresh banana leaf! Squeeze the juicy lemon wedge and drop crunchy cashews! 🍋🍚",
      foodId: 3,
      foodName: "Fragrant Lemon Rice"
    },
    {
      speaker: "Subramani",
      text: "No hometown street trip is ever complete without Hot Masala Puri! Tap to crush the crispy toppings, bubble up the pea gravy, and sprinkle golden crunchy sev! ✨🍛",
      foodId: 4,
      foodName: "Chaat Special Masala Puri"
    },
    {
      speaker: "Subramani",
      text: "Aaah, it fills my heart with joy to cook for you! You have tasted all our special street treats. Let's make way for your sweet wishes! Stay tuned... ✨"
    }
  ];

  const currentNode = dialogueNodes[dialogueIndex];

  // Blinking behavior loops
  useEffect(() => {
    const blinkInterval = setInterval(() => {
      setIsBlinking(true);
      setTimeout(() => setIsBlinking(false), 200);
    }, 3500);
    return () => clearInterval(blinkInterval);
  }, []);

  // Update typewriter effect on dialogue node click
  useEffect(() => {
    let index = 0;
    setTypewriterText("");
    setServingAnimState("incoming");
    
    // Select fitting hand gesture
    if (currentNode.foodId) {
      setHandGesture("point");
    } else if (dialogueIndex === 0) {
      setHandGesture("wave");
    } else if (dialogueIndex === dialogueNodes.length - 1) {
      setHandGesture("clap");
    } else {
      setHandGesture("neutral");
    }

    // Trigger initial sounds
    if (currentNode.foodId === 1) {
      playSlide();
      setPuris([0, 0, 0, 0, 0, 0]);
    } else if (currentNode.foodId === 2) {
      playSteam();
      setChopstickRotation(0);
      setNoodleMouthCount(0);
    } else if (currentNode.foodId === 3) {
      playSlide();
      setLemonSqueezes(0);
      setCashewPositions([]);
    } else if (currentNode.foodId === 4) {
      playSizzle();
      setSevSprinkleCount(0);
      setCorianderLeaves([]);
    }

    // Transition serving presentation animation state
    const timer = setTimeout(() => {
      setServingAnimState("served");
    }, 400);

    const textToType = currentNode.text;
    const interval = setInterval(() => {
      if (index < textToType.length) {
        const char = textToType.charAt(index);
        setTypewriterText((prev) => prev + char);
        index++;
      }
      if (index >= textToType.length) {
        clearInterval(interval);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [dialogueIndex]);

  const handleNextClick = () => {
    playKeyTap();
    if (dialogueIndex < dialogueNodes.length - 1) {
      setDialogueIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  // 1. PANI PURI INTERACTIVE TRIGGERS
  const handlePuriTap = (index: number) => {
    const currentStatus = puris[index];
    let nextStatus = currentStatus;

    if (currentStatus === 0) {
      playCakeCut(); // crunch crack sound
      nextStatus = 1; // cracked
    } else if (currentStatus === 1) {
      playSlide(); // pouring sound
      playSparkle();
      nextStatus = 2; // filled with pani
    } else if (currentStatus === 2) {
      playSuccess(); // happy eat sound
      nextStatus = 3; // eaten!
    }

    const updated = [...puris];
    updated[index] = nextStatus;
    setPuris(updated);
  };

  // 2. NOODLE INTERACTIVE TRIGGERS
  const handleNoodleSwirl = () => {
    setChopstickRotation((prev) => prev + 45);
    setNoodleMouthCount((prev) => Math.min(prev + 1, 10));
    playSteam();
    playSparkle();
  };

  // 3. LEMON RICE INTERACTIVE TRIGGERS
  const handleLemonSqueeze = () => {
    playSizzle(); // sizzling water drop
    playSparkle();
    setLemonSqueezes((prev) => prev + 1);

    // Drop cashews automatically on random coordinates on the leaf
    const newCashew = {
      x: 70 + Math.random() * 60,
      y: 55 + Math.random() * 30
    };
    setCashewPositions((prev) => [...prev, newCashew]);
  };

  // 4. MASALA PURI INTERACTIVE TRIGGERS
  const handleMasalaPuriPinch = () => {
    playSizzle();
    setSevSprinkleCount((prev) => prev + 1);

    // Drop fresh coriander green leaves
    const newCoriander = {
      x: 65 + Math.random() * 70,
      y: 60 + Math.random() * 35,
      r: Math.random() * 360
    };
    setCorianderLeaves((prev) => [...prev, newCoriander]);
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-6 relative z-10 font-cute text-center overflow-hidden">
      
      {/* Background Shop Ambient Wall overlay */}
      <div className="absolute inset-0 bg-[#ffd3e1]/10 pointer-events-none z-[-1]" />
      
      {/* Dark night street food booth background */}
      <div className="absolute inset-0 bg-neutral-900/90 pointer-events-none z-[-2]" />

      <div className="max-w-xl w-full flex flex-col items-center space-y-6">
        
        {/* Street food shop header banner */}
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-400 bg-amber-950 border border-amber-800 px-3 py-1 rounded-full flex items-center justify-center gap-1.5 w-fit mx-auto animate-pulse">
            <Store className="w-3.5 h-3.5 text-amber-400" />
            <span>Subramani's Live Platter</span>
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Interactive Street Food Corner 🏮
          </h2>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            Freshly prepared live cuisine served with sweet friendship and birthday magic!
          </p>
        </div>

        {/* SHOPKEEPER SUBRAMANI PANEL */}
        <div className="w-full flex flex-col sm:flex-row items-center gap-4 bg-neutral-800/80 backdrop-blur-md rounded-3xl p-4 border border-neutral-700/60 shadow-xl overflow-hidden">
          
          {/* Character Avatar Box */}
          <div className="relative w-32 h-32 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-700 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full p-2">
              <g transform="translate(18, 5)">
                {/* Chef Hat */}
                <path d="M20,12 C10,12 8,24 20,23 C8,23 10,34 32,34 C54,34 56,23 44,23 C56,23 54,12 44,12 C32,8 32,12 20,12 Z" fill="#ffffff" />
                <rect x="23" y="28" width="18" height="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="0.5" />

                {/* Head */}
                <circle cx="32" cy="46" r="14" fill="#fbcfe8" />

                {/* Eyes & Blinking mechanism */}
                {isBlinking ? (
                  <>
                    <line x1="25" y1="44" x2="29" y2="44" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
                    <line x1="35" y1="44" x2="39" y2="44" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <circle cx="27" cy="44" r="2.5" fill="#1e293b" />
                    <circle cx="37" cy="44" r="2.5" fill="#1e293b" />
                  </>
                )}

                {/* Happy Mustache & Nose */}
                <path d="M22,50 Q32,54 42,50" fill="none" stroke="#ca8a04" strokeWidth="2" strokeLinecap="round" />
                <path d="M30,52 Q32,55 34,52" fill="none" stroke="#991b1b" strokeWidth="2" />

                {/* Body */}
                <rect x="22" y="60" width="20" height="28" rx="6" fill="#ffffff" stroke="#e4e4e7" strokeWidth="1" />
                {/* Red apron bow */}
                <circle cx="32" cy="64" r="3" fill="#ef4444" />

                {/* Arms gestures */}
                {handGesture === "wave" && (
                  <path d="M42,66 Q54,48 50,42" fill="none" stroke="#fbcfe8" strokeWidth="5.5" strokeLinecap="round" className="animate-wiggle" />
                )}
                {handGesture === "point" && (
                  <path d="M42,66 Q58,68 64,64" fill="none" stroke="#fbcfe8" strokeWidth="5.5" strokeLinecap="round" />
                )}
                {handGesture === "clap" && (
                  <g className="animate-bounce">
                    <path d="M22,66 Q13,63 11,67" fill="none" stroke="#fbcfe8" strokeWidth="5.5" strokeLinecap="round" />
                    <path d="M42,66 Q51,63 53,67" fill="none" stroke="#fbcfe8" strokeWidth="5.5" strokeLinecap="round" />
                  </g>
                )}
                {handGesture === "neutral" && (
                  <path d="M42,66 Q48,72 46,81" fill="none" stroke="#fbcfe8" strokeWidth="5.5" strokeLinecap="round" />
                )}
              </g>
            </svg>
            <span className="absolute bottom-1 right-1.5 bg-emerald-600 px-1.5 py-0.5 rounded text-[8px] font-bold text-white uppercase tracking-wider font-sans">
              Chef Live
            </span>
          </div>

          {/* Dialogue bubble */}
          <div className="flex-1 bg-neutral-900/80 rounded-2xl p-4 border border-neutral-800 text-left relative min-h-24 flex items-center">
            <p className="text-neutral-200 font-cute text-sm sm:text-base leading-relaxed">
              {typewriterText}
              <span className="inline-block w-1.5 h-3.5 bg-amber-400 ml-1 animate-pulse" />
            </p>
          </div>

        </div>

        {/* MASSIVE DETAILED SERVING TABLE PLATTER */}
        {currentNode.foodId !== undefined && (
          <div 
            className={`w-full bg-amber-950/20 rounded-3xl p-6 border-2 border-dashed border-amber-500/20 flex flex-col items-center justify-center transition-all duration-700 ${
              servingAnimState === "incoming" 
                ? "scale-90 opacity-0 translateY(40px)" 
                : "scale-100 opacity-100 translateY(0)"
            }`}
          >
            {/* Header description of dish */}
            <div className="mb-4 space-y-1">
              <h3 className="text-xl font-bold text-yellow-300">
                ✨ Live Dining: {currentNode.foodName} ✨
              </h3>
              <p className="text-[11px] text-neutral-300">
                {currentNode.foodId === 1 && "👇 Tap each crispy gold sphere to Crack ➔ Fill ➔ Pop/Eat it!"}
                {currentNode.foodId === 2 && "👇 Tap the wooden Chopsticks repeatedly to twist and swirl yummy veggie noodles!"}
                {currentNode.foodId === 3 && "👇 Tap the fresh lemon to squeeze juice on the leaf & scatter golden crunchy cashews!"}
                {currentNode.foodId === 4 && "👇 Tap anywhere on the chaat plate to bubble sauce and sprinkle sev toppings!"}
              </p>
            </div>

            {/* HIGH-FIDELITY INTERACTIVE VECTOR FOOD ITEM CONTAINER */}
            <div className="relative w-full aspect-video max-w-[420px] bg-neutral-950 rounded-2xl border border-neutral-800 flex items-center justify-center overflow-hidden p-2 shadow-2xl">
              
              {/* Steaming Clouds rising out of food */}
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex justify-around w-48 pointer-events-none z-20 opacity-40">
                <span className="w-2 h-10 bg-white/40 rounded-full animate-steam" />
                <span className="w-2 h-10 bg-white/40 rounded-full animate-steam" style={{ animationDelay: "0.6s" }} />
                <span className="w-2 h-10 bg-white/40 rounded-full animate-steam" style={{ animationDelay: "1.2s" }} />
              </div>

              {/* DYNAMIC FOOD SVG DRAWINGS */}
              <svg viewBox="0 0 200 120" className="w-full h-full select-none overflow-visible">
                
                {/* 1. GOLGAPPA / PANI PURI INTERACTIVE SVG */}
                {currentNode.foodId === 1 && (
                  <g id="golgappa-dish">
                    {/* Clay Platter pot (Matka-style rustic dish) */}
                    <ellipse cx="100" cy="88" rx="80" ry="24" fill="#a16207" opacity="0.85" />
                    <ellipse cx="100" cy="84" rx="76" ry="20" fill="#78350f" />
                    {/* Inner deep groove */}
                    <ellipse cx="100" cy="84" rx="64" ry="14" fill="#451a03" />

                    {/* Central Cup/Pani Bowl bowl */}
                    <ellipse cx="100" cy="81" rx="22" ry="9" fill="#1e3a1e" stroke="#15803d" strokeWidth="1" />
                    {/* Fill Level of delicious green mint water with bubbles */}
                    <ellipse cx="100" cy="83" rx="18" ry="6" fill="#15803d" className="animate-pulse" />
                    {/* Coriander leaf on water */}
                    <path d="M96,82 Q100,80 104,82" stroke="#4ade80" strokeWidth="1.5" />
                    <text x="96" y="78" className="text-[6px] fill-emerald-300 font-bold">Tangy Pani 🍲</text>

                    {/* Render 6 customizable Puris positioned circularly */}
                    {[
                      { cx: 52, cy: 74, rx: 11, ry: 10, labelId: 1 },
                      { cx: 72, cy: 90, rx: 11, ry: 10, labelId: 2 },
                      { cx: 100, cy: 96, rx: 12, ry: 10, labelId: 3 },
                      { cx: 128, cy: 90, rx: 11, ry: 10, labelId: 4 },
                      { cx: 148, cy: 74, rx: 11, ry: 10, labelId: 5 },
                      { cx: 100, cy: 68, rx: 12, ry: 9, labelId: 6 }
                    ].map((p, idx) => {
                      const status = puris[idx] || 0;
                      return (
                        <g 
                          key={idx} 
                          onClick={() => handlePuriTap(idx)} 
                          className="cursor-pointer group hover:opacity-90"
                        >
                          {/* Shadow beneath puri */}
                          <ellipse cx={p.cx} cy={p.cy + 6} rx={p.rx - 2} ry="3px" fill="#1c0a00" opacity="0.6" />

                          {status === 0 && (
                            /* UNTOUCHED CRISPY GOLD SPHERE */
                            <g className="hover:animate-float">
                              <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill="url(#puri-grad)" stroke="#d97706" strokeWidth="1" />
                              {/* Shiny surface highlights */}
                              <ellipse cx={p.cx - 3} cy={p.cy - 3} rx={4} ry={2.5} fill="#fef08a" opacity="0.6" />
                            </g>
                          )}

                          {status === 1 && (
                            /* CRACKED OPEN GOLGAPPA (Shows hollow opening) */
                            <g>
                              <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill="url(#puri-grad)" stroke="#d97706" strokeWidth="1" />
                              {/* Dark broken hollow hole in the center */}
                              <path d={`M ${p.cx - 6} ${p.cy - 1} Q ${p.cx} ${p.cy - 7} ${p.cx + 6} ${p.cy - 1} Q ${p.cx} ${p.cy + 5} ${p.cx - 6} ${p.cy - 1}`} fill="#451a03" stroke="#92400e" strokeWidth="1" />
                              {/* Tiny potato bits inside */}
                              <circle cx={p.cx - 2} cy={p.cy + 1} r="1.5" fill="#fef08a" />
                              <circle cx={p.cx + 2} cy={p.cy + 1} r="1.5" fill="#ca8a04" />
                            </g>
                          )}

                          {status === 2 && (
                            /* FILLED WITH GREEN TANGY PANI WATER */
                            <g className="animate-pulse">
                              <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill="url(#puri-grad)" stroke="#d97706" strokeWidth="1" />
                              {/* Outer broken rim */}
                              <path d={`M ${p.cx - 6} ${p.cy - 1} Q ${p.cx} ${p.cy - 7} ${p.cx + 6} ${p.cy - 1} Q ${p.cx} ${p.cy + 5} ${p.cx - 6} ${p.cy - 1}`} fill="#166534" stroke="#4ade80" strokeWidth="1" />
                              {/* Liquid reflection */}
                              <ellipse cx={p.cx} cy={p.cy + 1} rx="4" ry="2" fill="#86efac" opacity="0.7" />
                            </g>
                          )}

                          {status === 3 && (
                            /* EATEN / POPPED INDICATION (Show sparkles coordinates) */
                            <g>
                              <ellipse cx={p.cx} cy={p.cy} rx={p.rx} ry={p.ry} fill="none" stroke="#ca8a04" strokeWidth="1" strokeDasharray="2,2" opacity="0.3" />
                              <text x={p.cx - 8} y={p.cy + 3} className="text-[9px] fill-amber-400 font-black tracking-tighter">YUM! ⭐</text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 2. HOT VEGGIE NOODLES INTERACTIVE SVG */}
                {currentNode.foodId === 2 && (
                  <g id="noodles-dish">
                    {/* Ceramic Blue/White bowl */}
                    <ellipse cx="100" cy="90" rx="65" ry="20" fill="#1e3a8a" stroke="#ffffff" strokeWidth="1.5" />
                    {/* Plate base shadow */}
                    <ellipse cx="100" cy="100" rx="50" ry="8" fill="#111827" opacity="0.5" />

                    <path d="M35,90 C35,108, 165,108, 165,90 Z" fill="#ffffff" stroke="#1e3a8a" strokeWidth="2" />
                    {/* Internal food level rim */}
                    <ellipse cx="100" cy="88" rx="60" ry="12" fill="#d97706" />

                    {/* Sizzling golden-yellow curly noodles lines */}
                    <g className="stroke-[#fef08a] stroke-[3]" fill="none" strokeLinecap="round">
                      <path d="M45,86 Q55,75 70,88 Q85,99 100,85 Q115,72 130,86 Q140,94 152,84" />
                      <path d="M50,91 Q65,80 80,93 Q95,104 110,91 Q125,78 140,92" />
                      <path d="M42,88 Q58,98 75,85 Q92,72 112,88 Q130,101 148,87" />
                      
                      {/* Interactive swirl noodles */}
                      <path 
                        d="M80,82 Q100,60 120,82" 
                        stroke="#facc15" 
                        strokeWidth="3.5" 
                        style={{
                          transform: `rotate(${chopstickRotation * 0.15}deg)`,
                          transformOrigin: "100px 80px",
                          transition: "transform 0.4s ease-out"
                        }}
                      />
                    </g>

                    {/* Healthy crunchy veggie shreds sprinkled on top */}
                    {/* Red sweet carrot juliennes */}
                    <rect x="55" y="85" width="8" height="2" fill="#f97316" transform="rotate(15 55 85)" />
                    <rect x="85" y="88" width="8" height="2" fill="#f97316" transform="rotate(-30 85 88)" />
                    <rect x="115" y="84" width="8" height="2" fill="#f97316" transform="rotate(25 115 84)" />
                    <rect x="140" y="88" width="8" height="2" fill="#f97316" transform="rotate(10 140 88)" />

                    {/* Green crispy bell pepper strips */}
                    <rect x="68" y="82" width="7" height="1.8" fill="#22c55e" transform="rotate(-10 68 82)" />
                    <rect x="100" y="87" width="7" height="1.8" fill="#22c55e" transform="rotate(45 100 87)" />
                    <rect x="128" y="83" width="7" height="1.8" fill="#22c55e" transform="rotate(-40 128 83)" />

                    {/* Little yellow sweet corn gems */}
                    <circle cx="75" cy="88" r="2" fill="#eab308" />
                    <circle cx="95" cy="85" r="2" fill="#eab308" />
                    <circle cx="110" cy="89" r="2.5" fill="#eab308" />
                    <circle cx="132" cy="86" r="2" fill="#eab308" />

                    {/* INTERACTIVE CHOPSTICKS Gimmick */}
                    <g 
                      onClick={handleNoodleSwirl}
                      className="cursor-pointer"
                      style={{
                        transform: `translate(100px, 60px) rotate(${chopstickRotation}deg) translate(-100px, -60px)`,
                        transformOrigin: "100px 60px",
                        transition: "transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)"
                      }}
                    >
                      {/* Left Chopstick */}
                      <polygon points="85,25 105,74 108,74 88,25" fill="#d97706" stroke="#b45309" strokeWidth="0.5" />
                      {/* Right Chopstick crossed */}
                      <polygon points="115,25 95,74 92,74 112,25" fill="#b45309" stroke="#78350f" strokeWidth="0.5" />
                      
                      {/* Noodle grabbing indicator text */}
                      <circle cx="100" cy="18" r="14" fill="#ef4444" opacity="0.9" />
                      <text x="100" y="21" textAnchor="middle" className="text-[8px] fill-white font-sans font-bold tracking-tighter">TAP SWIRL</text>
                    </g>

                    {/* Noodle intake bite counters */}
                    <rect x="145" y="10" width="48" height="18" rx="6" fill="#f43f5e" />
                    <text x="169" y="21" textAnchor="middle" className="text-[8px] fill-white font-bold font-cute">Bites: {noodleMouthCount}/10 🍽️</text>
                  </g>
                )}

                {/* 3. FRAGRANT LEMON RICE INTERACTIVE SVG */}
                {currentNode.foodId === 3 && (
                  <g id="lemon-rice-dish">
                    {/* Realistic green Banana Leaf Tray base */}
                    <path d="M25,85 C15,65 185,55 175,85 C165,115 35,115 25,85 Z" fill="#15803d" stroke="#16a34a" strokeWidth="2.5" />
                    {/* Leaf middle spine vein */}
                    <path d="M25,85 L175,85" stroke="#166534" strokeWidth="1.5" strokeDasharray="3,3" />

                    {/* Heap of bright fragrant lemon-yellow rice cooked grains */}
                    <ellipse cx="100" cy="80" rx="45" ry="18" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" filter="drop-shadow(0 0 4px rgba(251,191,36,0.3))" />
                    <ellipse cx="100" cy="76" rx="38" ry="13" fill="#facc15" />

                    {/* Detailed roasted texture cashews (Drawn dynamically based on squeezes state) */}
                    <g fill="#fed7aa" stroke="#ca8a04" strokeWidth="0.5">
                      {/* Static default 3 cashews */}
                      <path d="M85,73 Q90,70 93,75 Q89,78 85,73 Z" />
                      <path d="M115,76 Q120,73 123,78 Q119,81 115,76 Z" />
                      <path d="M100,82 Q105,79 108,84 Q104,87 100,82 Z" />

                      {/* Fresh cashews falling from interactions */}
                      {cashewPositions.map((pos, idx) => (
                        <path 
                          key={idx} 
                          d={`M ${pos.x},${pos.y} Q ${pos.x + 5},${pos.y - 3} ${pos.x + 8},${pos.y + 2} Q ${pos.x + 4},${pos.y + 5} ${pos.x},${pos.y} Z`} 
                          className="animate-bounce"
                        />
                      ))}
                    </g>

                    {/* Tiny green curry leaves & dark mustard seeds sprinkles */}
                    <circle cx="80" cy="78" r="1.5" fill="#111827" />
                    <circle cx="120" cy="74" r="1.5" fill="#111827" />
                    <circle cx="95" cy="84" r="1.5" fill="#111827" />
                    <circle cx="108" cy="80" r="1.5" fill="#111827" />

                    {/* Green curry leaf structures */}
                    <path d="M72,74 Q76,71 78,76 Q74,78 72,74" fill="#166534" />
                    <path d="M125,82 Q129,79 131,84 Q127,86 125,82" fill="#166534" />

                    {/* INTERACTIVE FRESH LEMON WEDGE SQUEEZE MECHANISM */}
                    <g 
                      onClick={handleLemonSqueeze}
                      className="cursor-pointer group hover:scale-105"
                      transform="translate(150, 48)"
                    >
                      {/* Squeezed yellow lemon slice */}
                      <path d="M0,0 C15,-10 32,10 0,0" fill="#fef08a" stroke="#eab308" strokeWidth="1.5" />
                      <path d="M2,-2 C10,-8 22,5 2,-2" fill="#facc15" />
                      {/* Squeeze target tag */}
                      <circle cx="28" cy="1" r="11" fill="#eab308" />
                      <text x="28" y="4" textAnchor="middle" className="text-[7px] fill-white font-black">SQUEEZE</text>

                      {/* Drop of juice animating downwards when tapped */}
                      {lemonSqueezes > 0 && (
                        <path d="M2,-12 L-10,18" fill="none" stroke="#fef08a" strokeWidth="2.5" className="animate-ping" />
                      )}
                    </g>

                    {/* Lemon Juice splash indicators on rice */}
                    {lemonSqueezes > 0 && (
                      <g className="animate-ping" opacity="0.8">
                        <ellipse cx="106" cy="76" rx={Math.min(lemonSqueezes * 5, 25)} ry={Math.min(lemonSqueezes * 2, 10)} fill="none" stroke="#fef08a" strokeWidth="2" />
                        <circle cx="85" cy="65" r="2" fill="#fef08a" />
                        <circle cx="118" cy="68" r="2.5" fill="#fef08a" />
                      </g>
                    )}

                    {/* Lemon Squeezes indicators text */}
                    <rect x="6" y="8" width="60" height="18" rx="6" fill="#ca8a04" />
                    <text x="36" y="19" textAnchor="middle" className="text-[8px] fill-white font-bold font-cute">Squeezes: {lemonSqueezes} 🍋</text>
                  </g>
                )}

                {/* 4. SPARKY MASALA PURI INTERACTIVE SVG */}
                {currentNode.foodId === 4 && (
                  <g id="masala-puri-dish">
                    {/* Street plate border - disposable leaf dona container */}
                    <path d="M20,80 C15,55 185,55 180,80 C175,105 25,105 20,80 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" />
                    <ellipse cx="100" cy="80" rx="72" ry="18" fill="#78350f" />

                    {/* Hot bubbly pea gravy brown base */}
                    <ellipse cx="100" cy="78" rx="64" ry="14" fill="#a16207" />
                    {/* Gravy shining sauce drops */}
                    <circle cx="80" cy="80" r="3" fill="#ca8a04" className="animate-pulse" />
                    <circle cx="120" cy="76" r="2.5" fill="#d97706" className="animate-pulse" style={{ animationDelay: "0.5s" }} />

                    {/* Crushed crispy puris drowned in gravy */}
                    <path d="M60,76 Q65,65 72,78 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
                    <path d="M125,75 Q133,67 138,78 Z" fill="#fbbf24" stroke="#d97706" strokeWidth="0.5" />
                    <path d="M96,82 Q105,73 112,83 Z" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />

                    {/* Garnishings - Sliced onions & coriander */}
                    {/* Tiny purple onion squares */}
                    <rect x="75" y="74" width="4" height="4" fill="#c084fc" />
                    <rect x="110" y="80" width="4" height="4" fill="#c084fc" />
                    <rect x="92" y="72" width="3.5" height="3.5" fill="#f472b6" />

                    {/* Golden crispy SEV thread lines (density based on clicks!) */}
                    <g stroke="#eab308" strokeWidth="1.2" fill="none">
                      {/* Fixed default sev */}
                      <path d="M55,73 Q60,70 65,71" />
                      <path d="M120,76 Q128,73 133,75" />
                      <path d="M90,78 Q95,74 100,77" />
                      <path d="M82,75 Q86,71 90,75" />
                      <path d="M108,79 Q112,74 118,77" />

                      {/* Extra sev lines generated dynamically by clicking */}
                      {Array.from({ length: Math.min(sevSprinkleCount * 5, 45) }).map((_, i) => {
                        const sx = 52 + (i % 8) * 12 + Math.random() * 6;
                        const sy = 70 + (i % 4) * 4 + Math.random() * 3;
                        return (
                          <line key={i} x1={sx} y1={sy} x2={sx + 6} y2={sy - 3} stroke="#facc15" strokeWidth="1" />
                        );
                      })}
                    </g>

                    {/* Fresh dynamically dropped green coriander leaves */}
                    {corianderLeaves.map((leaf, idx) => (
                      <g key={idx} transform={`translate(${leaf.x}, ${leaf.y}) rotate(${leaf.r})`}>
                        <path d="M-2,0 Q0,-4 2,0 Q0,4 -2,0" fill="#22c55e" />
                        <path d="M0,-2 Q2,-5 3,-1 Q1,1 0,-2" fill="#15803d" />
                      </g>
                    ))}

                    {/* TAP TO ACTION PINCH BOX */}
                    <g 
                      onClick={handleMasalaPuriPinch} 
                      className="cursor-pointer group"
                      transform="translate(145, 10)"
                    >
                      {/* Garnish sprinkle box */}
                      <rect x="0" y="0" width="45" height="18" rx="5" fill="#10b981" />
                      <text x="22.5" y="11" textAnchor="middle" className="text-[7.5px] fill-white font-extrabold">🍕 PINCH SEV</text>
                    </g>

                    {/* Garnish count indicator info text */}
                    <rect x="6" y="8" width="65" height="18" rx="6" fill="#1e3a1e" />
                    <text x="38" y="19" textAnchor="middle" className="text-[8px] fill-white font-bold font-cute">Garnishing: +{sevSprinkleCount} ⭐</text>
                  </g>
                )}

              </svg>
              
              {/* Tap Indicator Ring for first time interaction guidance */}
              <div className="absolute top-2 right-2 flex items-center gap-1.5 bg-yellow-400 text-neutral-900 px-2 py-0.5 rounded-md text-[9px] font-bold tracking-tight animate-bounce pointer-events-none shadow-md">
                <Sparkles className="w-3 h-3 text-neutral-900" />
                <span>Tap ingredients below!</span>
              </div>

            </div>

            {/* Interaction State Summary feedback box */}
            <div className="mt-4 w-full max-w-sm bg-neutral-900/60 p-3 rounded-2xl border border-neutral-800 text-center">
              <p className="text-[11px] sm:text-xs text-neutral-300 font-cute">
                {currentNode.foodId === 1 && (
                  `Progress: Packed ${puris.filter(st => st > 0).length} / 6 puris. Ready to serve? 🥳`
                )}
                {currentNode.foodId === 2 && (
                  noodleMouthCount >= 10 
                    ? "🎉 Maximum swirls achieved! Subramani's noodles are the absolute highest level yummy!" 
                    : `Twirl rate: ${noodleMouthCount * 10}% noodle roll. Click chopsticks to munch!`
                )}
                {currentNode.foodId === 3 && (
                  `Squeeze status: Squeezed ${lemonSqueezes} times. Added ${cashewPositions.length} crispy cashews on the leaf!`
                )}
                {currentNode.foodId === 4 && (
                  `Sev sprinkled: ${sevSprinkleCount} layers decoration. ${corianderLeaves.length} coriander leaves strewn!`
                )}
              </p>
            </div>

          </div>
        )}

        {/* Serving slider button indicators */}
        <div className="flex flex-col gap-2.5 w-full items-center max-w-sm z-20">
          
          {currentNode.foodName && (
            <div className="text-xs bg-gradient-to-r from-amber-400 to-amber-300 text-neutral-950 font-black px-4 py-1.5 rounded-full animate-bounce shadow-md border-2 border-amber-500">
              🍛 Serving: {currentNode.foodName} ✨
            </div>
          )}

          <button
            onClick={handleNextClick}
            className="w-full py-4 bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-yellow-400 hover:to-amber-500 text-neutral-950 rounded-2xl font-cute font-bold shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 text-sm border-2 border-amber-300"
          >
            <span className="font-bold">{dialogueIndex === dialogueNodes.length - 1 ? "Head back to Birthday Special ✨" : "Serve Next Tasty Item ➔"}</span>
          </button>
        </div>

      </div>
    </div>
  );
}
