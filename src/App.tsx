import React, { useState, useEffect, useRef } from "react";
import { Volume2, VolumeX, RefreshCw, HelpCircle, Sparkles, Wand2 } from "lucide-react";
import SparkleOverlay from "./components/SparkleOverlay";
import SettingsPanel from "./components/SettingsPanel";
import PasscodeScreen from "./components/PasscodeScreen";
import LoadingPage from "./components/LoadingPage";
import IntroScreen from "./components/IntroScreen";
import SurprisePrepScreen from "./components/SurprisePrepScreen";
import GiftSelection from "./components/GiftSelection";
import FirstGiftAnimatic from "./components/FirstGiftAnimatic";
import ThirdGiftStreetFood from "./components/ThirdGiftStreetFood";
import MiddleGiftDoor from "./components/MiddleGiftDoor";
import MagicalTunnel from "./components/MagicalTunnel";
import CakeTeleportation from "./components/CakeTeleportation";
import FinalScene from "./components/FinalScene";
import { BirthdayState, DEFAULT_STATE } from "./types";
import { playSparkle, playKeyTap } from "./utils/audio";
import { decompressDeltaToState } from "./utils/compression";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./lib/firebase";

type MoviePhase =
  | "PASSCODE"
  | "LOADING"
  | "INTRO"
  | "SURPRISE_PREP"
  | "GIFT_SELECTION"
  | "GIFT_1_ANIMATIC"
  | "GIFT_3_STREET_FOOD"
  | "GIFT_2_DOOR"
  | "MAGICAL_TUNNEL"
  | "CAKE_TELEPORTATION"
  | "FINAL_SCENE";

export default function App() {
  const [state, setState] = useState<BirthdayState>(DEFAULT_STATE);
  const [phase, setPhase] = useState<MoviePhase>("PASSCODE");
  const [completedGifts, setCompletedGifts] = useState({
    gift1: false,
    gift2: false,
    gift3: false
  });
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load custom state payload from URL hash if code coordinate or cloud ID exists
  useEffect(() => {
    const handleHashLoad = async () => {
      try {
        const hash = window.location.hash;
        if (hash.startsWith("#id=")) {
          const configId = hash.substring(4);
          if (configId) {
            let parsedConfig = null;
            // 1. First, try reading directly from our unified centralized Cloud Firestore database
            try {
              const docRef = doc(db, "birthday_configs", configId);
              const docSnap = await getDoc(docRef);
              if (docSnap.exists()) {
                parsedConfig = docSnap.data();
                console.log("Successfully retrieved birthday configuration from direct public Cloud Firestore! ✨");
              }
            } catch (fireError) {
              console.warn("Could not load from Firestore database, using local server fallback:", fireError);
            }

            // 2. Secondary container-filesystem fallback if Firestore is not reachable
            if (!parsedConfig) {
              const res = await fetch(`/api/config/${configId}`);
              if (res.ok) {
                parsedConfig = await res.json();
              }
            }

            if (parsedConfig) {
              setState(parsedConfig as BirthdayState);
              // Auto update document title for custom name
              document.title = `${parsedConfig.recipientName}'s Birthday Surprises ✨`;
            } else {
              console.error("Failed to retrieve customized experience from both Firestore and local server storage for ID:", configId);
            }
          }
        } else if (hash.startsWith("#code=")) {
          const base64Data = hash.substring(6);
          const decodedString = decodeURIComponent(atob(base64Data));
          const parsedConfig = JSON.parse(decodedString);
          if (parsedConfig) {
            const fullState = decompressDeltaToState(parsedConfig);
            setState(fullState);
            // Auto update document title for custom name
            document.title = `${fullState.recipientName}'s Birthday Surprises ✨`;
          }
        } else {
          document.title = "Bhoomika's Cinematic Birthday Surprise 🎂";
        }
      } catch (err) {
        console.warn("Could not deserialize URL hash data:", err);
      }
    };

    handleHashLoad();
    window.addEventListener("hashchange", handleHashLoad);
    return () => window.removeEventListener("hashchange", handleHashLoad);
  }, []);

  // Control background music play upon page interaction
  useEffect(() => {
    if (!audioRef.current) return;
    
    // Attempt play when state audio url changes or phase transitions
    audioRef.current.src = state.bgMusicUrl;
    audioRef.current.loop = true;
    audioRef.current.volume = 0.35;

    if (!isMuted) {
      audioRef.current.play().catch((err) => {
        console.log("Autoplay prevented by browser, waiting for key interaction:", err);
      });
    }
  }, [state.bgMusicUrl, phase]);

  // Handle mute control
  const toggleMute = () => {
    playKeyTap();
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.play().catch(() => {});
        audioRef.current.muted = false;
        setIsMuted(false);
      } else {
        audioRef.current.muted = true;
        setIsMuted(true);
      }
    }
  };

  // Reset helper
  const handleResetState = () => {
    setState(DEFAULT_STATE);
    setPhase("PASSCODE");
    setCompletedGifts({ gift1: false, gift2: false, gift3: false });
    window.location.hash = "";
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden font-sans select-none pb-8">
      
      {/* Background continuous atmospheric particles/stars */}
      <SparkleOverlay />

      {/* Hidden high fidelity HTML5 Audio Loop Player */}
      <audio ref={audioRef} />

      {/* Settings / Customizer floating sidebar control */}
      <SettingsPanel
        state={state}
        onChange={(newState) => {
          setState(newState);
          document.title = `${newState.recipientName}'s Birthday Surprises ✨`;
        }}
        onReset={handleResetState}
      />

      {/* Main interactive cinematic router screens */}
      <main className="flex-1 w-full flex items-center justify-center relative z-10 p-2 sm:p-4">
        {phase === "PASSCODE" && (
          <PasscodeScreen
            state={state}
            onSuccess={() => {
              // Playing background audio will succeed here because user interacted with keypad!
              if (audioRef.current && !isMuted) {
                audioRef.current.play().catch(() => {});
              }
              setPhase("LOADING");
            }}
          />
        )}

        {phase === "LOADING" && (
          <LoadingPage
            onContinue={() => {
              setPhase("INTRO");
            }}
          />
        )}

        {phase === "INTRO" && (
          <IntroScreen
            recipientName={state.recipientName}
            onNext={() => {
              setPhase("SURPRISE_PREP");
            }}
          />
        )}

        {phase === "SURPRISE_PREP" && (
          <SurprisePrepScreen
            recipientName={state.recipientName}
            onYes={() => {
              setPhase("GIFT_SELECTION");
            }}
          />
        )}

        {phase === "GIFT_SELECTION" && (
          <GiftSelection
            completedGifts={completedGifts}
            onSelectGift={(num) => {
              if (num === 1) {
                setPhase("GIFT_1_ANIMATIC");
              } else if (num === 3) {
                setPhase("GIFT_3_STREET_FOOD");
              } else if (num === 2) {
                setPhase("GIFT_2_DOOR");
              }
            }}
          />
        )}

        {phase === "GIFT_1_ANIMATIC" && (
          <FirstGiftAnimatic
            state={state}
            onComplete={() => {
              setCompletedGifts((prev) => ({ ...prev, gift1: true }));
              setPhase("GIFT_SELECTION");
            }}
          />
        )}

        {phase === "GIFT_3_STREET_FOOD" && (
          <ThirdGiftStreetFood
            recipientName={state.recipientName}
            onComplete={() => {
              setCompletedGifts((prev) => ({ ...prev, gift3: true }));
              setPhase("GIFT_SELECTION");
            }}
          />
        )}

        {phase === "GIFT_2_DOOR" && (
          <MiddleGiftDoor
            onDoorOpened={() => {
              setCompletedGifts((prev) => ({ ...prev, gift2: true }));
              setPhase("MAGICAL_TUNNEL");
            }}
          />
        )}

        {phase === "MAGICAL_TUNNEL" && (
          <MagicalTunnel
            state={state}
            onComplete={() => {
              setPhase("CAKE_TELEPORTATION");
            }}
          />
        )}

        {phase === "CAKE_TELEPORTATION" && (
          <CakeTeleportation
            targetAge={state.age}
            recipientName={state.recipientName}
            onCelebrationFinish={() => {
              setPhase("FINAL_SCENE");
            }}
          />
        )}

        {phase === "FINAL_SCENE" && (
          <FinalScene
            state={state}
            onRestart={() => {
              setPhase("PASSCODE");
              setCompletedGifts({ gift1: false, gift2: false, gift3: false });
            }}
          />
        )}
      </main>

      {/* Floating Audio controls inside page margins (Strictly no Hearts/Couple Indicators) */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-pink-50 shadow-md">
        <button
          onClick={toggleMute}
          className="text-pink-500 hover:text-pink-600 transition-colors p-1 cursor-pointer"
          title={isMuted ? "Unmute Soundtrack" : "Mute Soundtrack"}
        >
          {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
        </button>
        <span className="text-[10px] uppercase font-bold text-neutral-400 font-cute hidden xs:inline">
          {isMuted ? "Music Muted" : "Magic Audio on"}
        </span>
      </div>

    </div>
  );
}
