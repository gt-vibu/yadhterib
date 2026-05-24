import React, { useEffect, useState } from "react";

interface SparkleParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  delay: string;
  duration: string;
  type: "star" | "sparkle" | "balloon" | "cloud" | "confetti";
  rotation?: number;
}

export default function SparkleOverlay() {
  const [particles, setParticles] = useState<SparkleParticle[]>([]);

  useEffect(() => {
    // Generate initial decorative assets (clouds, stars, balloons, sparkles)
    // Avoid any hearts
    const initialList: SparkleParticle[] = [];
    
    // Add 4 fluffy clouds
    for (let i = 0; i < 4; i++) {
      initialList.push({
        id: Math.random() + i * 100,
        x: 10 + i * 25 + Math.random() * 5,
        y: 8 + Math.random() * 12,
        size: 80 + Math.random() * 60,
        color: "rgba(255, 255, 255, 0.75)",
        delay: `${Math.random() * -10}s`,
        duration: `${20 + Math.random() * 15}s`,
        type: "cloud"
      });
    }

    // Add 6 cute balloons floating upwards
    const colors = ["#bde0fe", "#ffc8dd", "#ffd3e1", "#eaf6ff", "#ff85a1", "#f9f1ff"];
    for (let i = 0; i < 6; i++) {
      initialList.push({
        id: Math.random() + i * 1000,
        x: 5 + i * 16 + Math.random() * 6,
        y: 85 + Math.random() * 10,
        size: 35 + Math.random() * 20,
        color: colors[i % colors.length],
        delay: `${Math.random() * -15}s`,
        duration: `${14 + Math.random() * 10}s`,
        type: "balloon"
      });
    }

    // Add 15 glowing stars
    for (let i = 0; i < 15; i++) {
      initialList.push({
        id: Math.random() + i * 10000,
        x: Math.random() * 100,
        y: Math.random() * 85,
        size: 10 + Math.random() * 16,
        color: ["#fffb96", "#bde0fe", "#ffd3e1", "#fff"][i % 4],
        delay: `${Math.random() * -5}s`,
        duration: `${2 + Math.random() * 4}s`,
        type: "star"
      });
    }

    // Add 10 magical sparkles
    for (let i = 0; i < 10; i++) {
      initialList.push({
        id: Math.random() + i * 100000,
        x: Math.random() * 100,
        y: Math.random() * 90,
        size: 12 + Math.random() * 14,
        color: "#fff",
        delay: `${Math.random() * -6}s`,
        duration: `${3 + Math.random() * 3}s`,
        type: "sparkle"
      });
    }

    setParticles(initialList);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* Background Gradient Soft Pink to Blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#fcf6f8] via-[#eaf6ff] to-[#fff5f7] opacity-80" />

      {/* Festive Hanging Ribbons and Flag Bunting */}
      <div className="absolute top-0 inset-x-0 h-16 flex justify-around items-start opacity-90 z-20">
        {[
          { color: "fill-pink-400", delay: "0s" },
          { color: "fill-amber-400", delay: "0.2s" },
          { color: "fill-sky-400", delay: "0.4s" },
          { color: "fill-emerald-400", delay: "0.1s" },
          { color: "fill-purple-400", delay: "0.3s" },
          { color: "fill-rose-400", delay: "0.5s" },
          { color: "fill-yellow-400", delay: "0.2s" },
          { color: "fill-cyan-400", delay: "0.4s" },
          { color: "fill-red-400", delay: "0.3s" },
          { color: "fill-indigo-400", delay: "0.1s" },
        ].map((flag, idx) => (
          <div
            key={idx}
            className="w-10 h-12 animate-wiggle origin-top"
            style={{ animationDelay: flag.delay, animationDuration: "1.8s" }}
          >
            <svg viewBox="0 0 40 50" className="w-full h-full drop-shadow-md">
              <path d="M 0,0 L 40,0 L 40,40 L 20,50 L 0,40 Z" className={flag.color} />
              <path d="M 12,12 L 28,12 L 20,28 Z" fill="rgba(255,255,255,0.4)" />
              <circle cx="20" cy="5" r="3" fill="#ffffff" />
            </svg>
          </div>
        ))}
      </div>

      {particles.map((p) => {
        if (p.type === "cloud") {
          return (
            <div
              key={p.id}
              className="absolute select-none opacity-40 blur-[1px] transition-transform animate-float"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size / 1.6}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              <svg viewBox="0 0 100 60" fill={p.color}>
                <path d="M 20,40 a 20,20 0 0,1 30,-15 a 25,25 0 0,1 40,5 a 15,15 0 0,1 0,25" />
                <rect x="20" y="35" width="70" height="20" rx="10" />
              </svg>
            </div>
          );
        }

        if (p.type === "balloon") {
          return (
            <div
              key={p.id}
              className="absolute opacity-70 transition-all flex flex-col items-center animate-float"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              {/* Balloon Head */}
              <div
                className="rounded-full shadow-md"
                style={{
                  width: `${p.size}px`,
                  height: `${p.size * 1.25}px`,
                  backgroundColor: p.color,
                  boxShadow: `inset -6px -6px 0px rgba(0,0,0,0.06), 0 4px 10px rgba(0,0,0,0.03)`,
                  borderRadius: "50% 50% 50% 50% / 40% 40% 60% 60%",
                }}
              />
              {/* Balloon tie */}
              <div
                className="w-2 h-2 -mt-1 border-t-0 border-l-4 border-r-4 border-b-6 border-transparent"
                style={{ borderBottomColor: p.color }}
              />
              {/* Balloon String */}
              <div className="w-[1.5px] h-12 bg-neutral-300 opacity-60 animate-wiggle origin-top" />
            </div>
          );
        }

        if (p.type === "star") {
          return (
            <svg
              key={p.id}
              viewBox="0 0 24 24"
              fill={p.color}
              className="absolute animate-sparkle"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              <path d="M12 0l3.05 8.91h9.38l-7.59 5.51 3.05 8.91-7.84-5.55-7.84 5.55 3.05-8.91-7.59-5.51h9.38z" />
            </svg>
          );
        }

        if (p.type === "sparkle") {
          return (
            <svg
              key={p.id}
              viewBox="0 0 512 512"
              fill={p.color}
              className="absolute animate-sparkle filter drop-shadow-[0_0_2px_rgba(255,255,255,0.8)]"
              style={{
                left: `${p.x}%`,
                top: `${p.y}%`,
                width: `${p.size}px`,
                height: `${p.size}px`,
                animationDelay: p.delay,
                animationDuration: p.duration,
              }}
            >
              <path d="M256 0c-4.4 0-8 3.6-8 8v160c0 4.4 3.6 8 8 8s8-3.6 8-8V8c0-4.4-3.6-8-8-8zm0 336c4.4 0 8-3.6 8-8V168c0-4.4-3.6-8-8-8s-8 3.6-8 8v160c0 4.4 3.6 8 8 8zM168 256c0 4.4-3.6 8-8 8H8c-4.4 0-8-3.6-8-8s3.6-8 8-8h152c4.4 0 8 3.6 8 8zm336 0c0-4.4-3.6-8-8-8H344c-4.4 0-8 3.6-8 8s3.6 8 8 8h152c4.4 0 8-3.6 8-8zm-308.5-73.4c3.1 3.1 8.2 3.1 11.3 0s3.1-8.2 0-11.3l-113.1-113.1c-3.1-3.1-8.2-3.1-11.3 0s-3.1 8.2 0 11.3l113.1 113.1zm225 225c-3.1-3.1-8.2-3.1-11.3 0s-3.1 8.2 0 11.3l113.1 113.1c3.1 3.1 8.2 3.1 11.3 0s3.1-8.2 0-11.3L320.5 407.6z" />
            </svg>
          );
        }

        return null;
      })}
    </div>
  );
}
