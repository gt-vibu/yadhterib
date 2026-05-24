import React, { useState } from "react";
import { Settings, X, Copy, Check, Upload, RefreshCw, Sparkles, HelpCircle, Link as LinkIcon, Info } from "lucide-react";
import { BirthdayState, DEFAULT_STATE } from "../types";
import { playSparkle, playKeyTap } from "../utils/audio";
import { compressStateToDelta } from "../utils/compression";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../lib/firebase";

// Compress base64 images to high quality and good size for server storage
const compressImageBase64 = (base64Url: string, maxDim = 1000, quality = 0.85): Promise<string> => {
  return new Promise((resolve) => {
    if (!base64Url.startsWith("data:image/")) {
      resolve(base64Url);
      return;
    }
    const img = new Image();
    img.src = base64Url;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      } else {
        resolve(base64Url);
      }
    };
    img.onerror = () => {
      resolve(base64Url);
    };
  });
};

interface SettingsPanelProps {
  state: BirthdayState;
  onChange: (newState: BirthdayState) => void;
  onReset: () => void;
}

export default function SettingsPanel({ state, onChange, onReset }: SettingsPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "photos" | "dialogues">("general");
  const [sharedLink, setSharedLink] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Handle single field change
  const handleChange = (key: keyof BirthdayState, value: any) => {
    playKeyTap();
    setSharedLink(""); // Invalidate previously generated link on edits
    onChange({
      ...state,
      [key]: value
    });
  };

  // Convert uploaded image to Base64 & apply high-quality compression
  const handlePhotoUpload = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSharedLink(""); // Reset stale link
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        playSparkle();
        try {
          const rawBase64 = event.target.result as string;
          // Apply maximum-clarity HD compression
          const compressedUrl = await compressImageBase64(rawBase64, 1000, 0.85);
          const updatedPhotos = [...state.customPhotos];
          updatedPhotos[index] = {
            ...updatedPhotos[index],
            url: compressedUrl
          };
          onChange({
            ...state,
            customPhotos: updatedPhotos
          });
        } catch (err) {
          console.error("Could not compress photo:", err);
          // Fallback to original
          const updatedPhotos = [...state.customPhotos];
          updatedPhotos[index] = {
            ...updatedPhotos[index],
            url: event.target.result as string
          };
          onChange({
            ...state,
            customPhotos: updatedPhotos
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Handle photo URL or caption changes
  const handlePhotoChange = (index: number, field: "url" | "caption", value: string) => {
    setSharedLink(""); // Reset stale link
    const updatedPhotos = [...state.customPhotos];
    updatedPhotos[index] = {
      ...updatedPhotos[index],
      [field]: value
    };
    onChange({
      ...state,
      customPhotos: updatedPhotos
    });
  };

  // Helper to calculate current link metadata & length
  const getLinkLengthDetails = () => {
    try {
      const shareUrl = sharedLink || `${window.location.origin}${window.location.pathname}`;
      const sizeBytes = shareUrl.length;

      let status = "Needs Saving (Click 'Generate Link' below) ⚡";
      let colorClass = "text-amber-700 bg-amber-500/10 border-amber-500/30";
      let desc = "Click the button below to upload your customize settings to the server for a clean single-line link with crystal-clear photos!";

      if (sharedLink) {
        status = "Perfect (Single-line Cloud Link) 🚀";
        colorClass = "text-emerald-700 bg-emerald-500/10 border-emerald-500/30";
        desc = "Extremely short cloud link! Fully compatible with WhatsApp and all message apps, and contains high quality photos.";
      }
      return { length: sizeBytes, status, colorClass, desc, shareUrl };
    } catch (err) {
      return { 
        length: 0, 
        status: "Unknown", 
        colorClass: "text-neutral-600 bg-neutral-100 border-neutral-200", 
        desc: "Could not evaluate length detail", 
        shareUrl: "" 
      };
    }
  };

  // Generate shareable link via cloud server ID
  const handleGenerateLink = async () => {
    playSparkle();
    setIsSaving(true);
    try {
      // 1. Generate a clean random 6-character short ID
      const alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let shortId = "";
      for (let i = 0; i < 6; i++) {
        shortId += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
      }

      // 2. Save directly to our unified Cloud Firestore
      const docRef = doc(db, "birthday_configs", shortId);
      await setDoc(docRef, state);
      console.log("Successfully saved birthday experience to Cloud Firestore with ID:", shortId);

      // 3. For complete redundancy, we also sync with the local container filesystem
      try {
        await fetch("/api/config/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...state, id: shortId })
        });
      } catch (nestedErr) {
        console.warn("Express backend sync bypassed, proceeding with master Firestore state:", nestedErr);
      }

      // 4. Update local state with the newly minted URL
      const shortUrl = `${window.location.origin}${window.location.pathname}#id=${shortId}`;
      setSharedLink(shortUrl);
      navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);

    } catch (err) {
      console.error("Could not write config to central Cloud database, trying Express container fallback:", err);
      
      // Fallback: Express-only write
      try {
        const res = await fetch("/api/config/save", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(state)
        });
        if (res.ok) {
          const data = await res.json();
          if (data && data.id) {
            const shortUrl = `${window.location.origin}${window.location.pathname}#id=${data.id}`;
            setSharedLink(shortUrl);
            navigator.clipboard.writeText(shortUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 3000);
            return;
          }
        }
      } catch (backendErr) {
        console.error("Express fallback failed too:", backendErr);
      }

      // Sub-fallback: Local URL Hash
      try {
        const delta = compressStateToDelta(state);
        const serialized = JSON.stringify(delta);
        const encoded = btoa(encodeURIComponent(serialized));
        const hashLink = `${window.location.origin}${window.location.pathname}#code=${encoded}`;
        setSharedLink(hashLink);
        navigator.clipboard.writeText(hashLink);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } catch (fallbackError) {
        alert("Could not generate sharing link. Please verify internet connectivity.");
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      {/* Floating Sparkly Launcher Button */}
      <button
        id="settings-toggle-btn"
        onClick={() => { setIsOpen(true); playSparkle(); }}
        className="fixed top-4 right-4 z-50 p-3 bg-white/90 backdrop-blur border border-pink-100 rounded-full shadow-lg text-pink-500 hover:text-pink-600 transition-all hover:scale-110 flex items-center justify-center gap-1.5 cursor-pointer"
        title="Customize This Birthday Adventure!"
      >
        <Settings className="w-5 h-5 animate-spin-slow" />
        <span className="font-cute font-medium text-xs hidden sm:inline text-pink-500">Customize</span>
      </button>

      {/* Slide-out Sidebar Panel */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-neutral-900/30 backdrop-blur-xs transition-opacity"
            onClick={() => setIsOpen(false)}
          />

          {/* Settings Canvas */}
          <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col z-10 border-l border-pink-50/60 overflow-hidden">
            
            {/* Header */}
            <div className="p-4 border-b border-pink-50 flex items-center justify-between bg-gradient-to-r from-pastel-pink-soft to-pastel-blue-soft">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-pink-500 fill-pink-100" />
                <h3 className="font-cute font-semibold text-lg text-neutral-800">Customizer Panel</h3>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-neutral-600 hover:bg-neutral-100 rounded-full cursor-pointer transition-colors"
                id="close-settings-btn"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Helper Tips */}
            <div className="px-4 py-2.5 bg-neutral-50 border-b border-neutral-100 text-[11px] text-neutral-500 flex items-start gap-1.5 font-sans leading-relaxed">
              <HelpCircle className="w-3.5 h-3.5 text-pink-400 shrink-0 mt-0.5" />
              <p>
                Configure the story below! To generate a shareable link that works everywhere, we recommend pasting <strong>public image URLs</strong> (e.g. from postimg.cc, imgur, or unsplash) so the link does not exceed size limits.
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-100 text-xs font-cute">
              {(["general", "photos", "dialogues"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => { playKeyTap(); setActiveTab(tab); }}
                  className={`flex-1 py-3 text-center transition-colors font-medium cursor-pointer ${
                    activeTab === tab
                      ? "border-b-2 border-pink-500 text-pink-500 font-semibold"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 font-sans text-sm">
              
              {activeTab === "general" && (
                <div className="space-y-4">
                  {/* Recipient Name */}
                  <div>
                    <label className="block text-xs font-cute font-semibold text-neutral-600 mb-1">
                      👑 Birthday Person Name
                    </label>
                    <input
                      type="text"
                      value={state.recipientName}
                      onChange={(e) => handleChange("recipientName", e.target.value)}
                      placeholder="e.g. Bhoomika"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-pink-400 focus:ring-1 focus:ring-pink-300 font-cute text-sm"
                    />
                  </div>

                  {/* Age */}
                  <div>
                    <label className="block text-xs font-cute font-semibold text-neutral-600 mb-1">
                      🎂 Celebration Age (Number of Cake Cuts)
                    </label>
                    <input
                      type="number"
                      value={state.age}
                      onChange={(e) => handleChange("age", parseInt(e.target.value) || 21)}
                      min="1"
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-pink-400 focus:ring-1 focus:ring-pink-300 font-mono text-sm"
                    />
                  </div>

                  {/* Unlock Code */}
                  <div>
                    <label className="block text-xs font-cute font-semibold text-neutral-600 mb-1">
                      🔒 Keypad Unlock Code (Default: 2005)
                    </label>
                    <input
                      type="text"
                      maxLength={6}
                      value={state.passcode}
                      onChange={(e) => handleChange("passcode", e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-pink-400 focus:ring-1 focus:ring-pink-300 font-mono tracking-widest text-sm"
                    />
                  </div>

                  {/* Music URL */}
                  <div>
                    <label className="block text-xs font-cute font-semibold text-neutral-600 mb-1">
                      🎵 Background Music MP3 URL (e.g. Piano, Lofi etc)
                    </label>
                    <input
                      type="url"
                      value={state.bgMusicUrl}
                      onChange={(e) => handleChange("bgMusicUrl", e.target.value)}
                      placeholder="https://..."
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-pink-400 focus:ring-1 focus:ring-pink-300 text-xs"
                    />
                  </div>
                </div>
              )}

              {activeTab === "photos" && (
                <div className="space-y-4">
                  <span className="text-xs font-cute text-neutral-500 block mb-2 font-medium">
                    Upload photos (JPEG/PNG) or paste public web image links.
                  </span>

                  {state.customPhotos.map((photo, index) => (
                    <div key={photo.id} className="p-3 border border-pink-50 rounded-2xl bg-pastel-pink-soft/20 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-cute font-bold text-pink-500">
                          Photo Frame #{index + 1}
                        </span>
                        
                        {/* File upload trigger */}
                        <label className="flex items-center gap-1 cursor-pointer text-[11px] text-pink-600 hover:text-pink-700 bg-white border border-pink-100 px-2.5 py-1 rounded-full shadow-xs">
                          <Upload className="w-3 h-3" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handlePhotoUpload(index, e)}
                            className="hidden"
                          />
                        </label>
                      </div>

                      {/* Display thumbnail / input info */}
                      <div className="flex gap-3">
                        {photo.url && (
                          <img
                            src={photo.url}
                            alt="thumbnail"
                            referrerPolicy="no-referrer"
                            className="w-14 h-14 object-cover rounded-lg border border-pink-100 shrink-0 shadow-xs"
                          />
                        )}
                        <input
                          type="url"
                          placeholder="Paste Direct Image URL"
                          value={photo.url.startsWith("data:") ? "(Uploaded local file)" : photo.url}
                          onChange={(e) => {
                            if (!e.target.value.startsWith("(Uploaded")) {
                              handlePhotoChange(index, "url", e.target.value);
                            }
                          }}
                          className="flex-1 px-3 py-1.5 border border-neutral-200 rounded-lg text-xs focus:outline-hidden focus:border-pink-400"
                        />
                      </div>

                      {/* Caption Input */}
                      <div>
                        <span className="text-[10px] uppercase tracking-wider text-neutral-400 block mb-1">
                          Slide Message (Typewriter text)
                        </span>
                        <textarea
                          rows={2}
                          value={photo.caption}
                          onChange={(e) => handlePhotoChange(index, "caption", e.target.value)}
                          placeholder="Write something gorgeous..."
                          className="w-full px-3 py-1.5 border border-neutral-200 rounded-lg text-xs focus:outline-hidden focus:border-pink-400"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === "dialogues" && (
                <div className="space-y-4">
                  {/* Final Wish Title */}
                  <div>
                    <label className="block text-xs font-cute font-semibold text-neutral-600 mb-1">
                      Final Celebration Screen Title
                    </label>
                    <input
                      type="text"
                      value={state.finalWishTitle}
                      onChange={(e) => handleChange("finalWishTitle", e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-pink-400 text-sm"
                    />
                  </div>

                  {/* Final Wish Message */}
                  <div>
                    <label className="block text-xs font-cute font-semibold text-neutral-600 mb-1">
                      Final Long Birthday Wish Letter
                    </label>
                    <textarea
                      rows={6}
                      value={state.finalWishText}
                      onChange={(e) => handleChange("finalWishText", e.target.value)}
                      className="w-full px-3 py-2 border border-neutral-200 rounded-xl focus:outline-hidden focus:border-pink-400 text-xs leading-relaxed"
                    />
                  </div>
                </div>
              )}

            </div>

            {/* Footer and Generation Trigger */}
            <div className="p-4 border-t border-neutral-100 bg-neutral-50 space-y-3">
              
              {/* Link Size Status Badge */}
              {(() => {
                const meta = getLinkLengthDetails();
                return (
                  <div className="space-y-3">
                    <div className={`p-3 rounded-xl border text-[11px] font-sans flex flex-col gap-1 transition-all ${meta.colorClass}`}>
                      <div className="flex items-center justify-between font-bold text-xs uppercase tracking-tight">
                        <span className="flex items-center gap-1 text-[11px]">
                          <LinkIcon className="w-3.5 h-3.5" />
                          <span>Shareable Link Size:</span>
                        </span>
                        <span>{meta.status}</span>
                      </div>
                      <p className="leading-relaxed font-normal mt-0.5 opacity-90">{meta.desc}</p>
                      {sharedLink && (
                        <div className="flex justify-between text-[10px] text-neutral-500 font-mono mt-1 border-t border-neutral-200/40 pt-1">
                          <span>Url Characters:</span>
                          <span className="font-bold">{meta.length.toLocaleString()} chars</span>
                        </div>
                      )}
                    </div>

                    {/* Single-Line Link Display & Easy Copy Input Box */}
                    <div className="flex flex-col gap-1.5 bg-white p-3 rounded-xl border border-neutral-200 shadow-xs">
                      <div className="flex items-center gap-1 text-neutral-600">
                        <Info className="w-3.5 h-3.5 text-pink-500" />
                        <span className="text-[10px] font-bold uppercase tracking-wider font-sans">Single-Line Shareable Link:</span>
                      </div>
                      
                      <div className="flex items-center gap-1.5">
                        <input
                          type="text"
                          readOnly
                          value={sharedLink || ""}
                          placeholder="Click 'Generate Short Link' below... ✨"
                          onClick={(e) => {
                            if (sharedLink) {
                              const input = e.target as HTMLInputElement;
                              input.select();
                            }
                          }}
                          className="flex-1 px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-lg text-xs font-mono text-neutral-700 select-all hover:border-neutral-300 focus:outline-hidden whitespace-nowrap overflow-x-auto"
                        />
                        {sharedLink && (
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(sharedLink);
                              setCopied(true);
                              setTimeout(() => setCopied(false), 3000);
                              playSparkle();
                            }}
                            className="p-2 py-2.5 bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 text-neutral-700 rounded-lg transition-transform active:scale-95 shrink-0 flex items-center justify-center gap-1 font-cute font-bold text-xs cursor-pointer min-w-16"
                            title="Copy to Clipboard"
                          >
                            {copied ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5 text-neutral-500" />
                            )}
                            <span>{copied ? "Copied!" : "Copy"}</span>
                          </button>
                        )}
                      </div>
                      <p className="text-[9px] text-neutral-400 italic">
                        💡 Each time you edit anything, click the button below to secure a fresh, single-line high-quality share link!
                      </p>
                    </div>
                  </div>
                );
              })()}

              <button
                onClick={handleGenerateLink}
                disabled={isSaving}
                className={`w-full py-3 text-white rounded-xl font-cute font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer text-sm ${
                  isSaving 
                    ? "bg-neutral-300 text-neutral-500 cursor-not-allowed" 
                    : "bg-gradient-to-r from-pink-400 to-pink-500 hover:from-pink-500 hover:to-pink-600"
                }`}
                id="generate-link-btn"
              >
                {isSaving ? (
                  <>
                    <RefreshCw className="w-5 h-5 animate-spin" />
                    <span>Saving customized experience to server...</span>
                  </>
                ) : copied ? (
                  <>
                    <Check className="w-5 h-5 text-white animate-bounce" />
                    <span>Copied customized Link! 🎉</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-white fill-white/20 animate-pulse" />
                    <span>Generate Sparkly Short Link! ✨</span>
                  </>
                )}
              </button>

              <button
                onClick={() => {
                  if (confirm("Reset everything to standard Bhoomika preset? 💖")) {
                    onReset();
                    playSparkle();
                  }
                }}
                className="w-full py-2 bg-white text-neutral-500 hover:text-neutral-700 hover:bg-neutral-100 border border-neutral-200 rounded-xl font-cute font-medium text-xs transition-colors cursor-pointer flex items-center justify-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reset to Classic Bhoomika Preset</span>
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
}
