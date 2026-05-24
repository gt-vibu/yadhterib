import { BirthdayState, DEFAULT_STATE, DEFAULT_PHOTOS } from "../types";

export interface CompressedDelta {
  n?: string;
  p?: string;
  a?: number;
  m?: string;
  wt?: string;
  w?: string;
  ph?: { i: string; u?: string; c?: string }[];
}

/**
 * Compresses the state by only saving non-default values and using short single-letter keys
 */
export function compressStateToDelta(state: BirthdayState): CompressedDelta {
  const delta: CompressedDelta = {};

  if (state.recipientName !== DEFAULT_STATE.recipientName) {
    delta.n = state.recipientName;
  }
  if (state.passcode !== DEFAULT_STATE.passcode) {
    delta.p = state.passcode;
  }
  if (state.age !== DEFAULT_STATE.age) {
    delta.a = state.age;
  }
  if (state.bgMusicUrl !== DEFAULT_STATE.bgMusicUrl) {
    delta.m = state.bgMusicUrl;
  }
  if (state.finalWishTitle !== DEFAULT_STATE.finalWishTitle) {
    delta.wt = state.finalWishTitle;
  }
  if (state.finalWishText !== DEFAULT_STATE.finalWishText) {
    delta.w = state.finalWishText;
  }

  // Check photos differences
  const modifiedPhotos: { i: string; u?: string; c?: string }[] = [];
  state.customPhotos.forEach((photo) => {
    const defaultPhoto = DEFAULT_PHOTOS.find((p) => p.id === photo.id);
    if (!defaultPhoto) {
      // It's a custom photo - only take the caption, never take the custom image URL/address
      modifiedPhotos.push({
        i: photo.id,
        c: photo.caption
      });
    } else {
      const isCapDiff = photo.caption !== defaultPhoto.caption;
      if (isCapDiff) {
        const item: { i: string; u?: string; c?: string } = { i: photo.id };
        item.c = photo.caption;
        modifiedPhotos.push(item);
      }
    }
  });

  if (modifiedPhotos.length > 0) {
    delta.ph = modifiedPhotos;
  }

  return delta;
}

/**
 * Decompresses the delta back into a full BirthdayState, safe-merging with DEFAULT_STATE
 */
export function decompressDeltaToState(delta: any): BirthdayState {
  if (!delta || typeof delta !== "object") {
    return { ...DEFAULT_STATE };
  }

  // If this is in the old full-state format (checking for recipientName instead of compressed delta keys)
  if ("recipientName" in delta) {
    return {
      ...DEFAULT_STATE,
      ...delta,
      customPhotos: Array.isArray(delta.customPhotos) ? delta.customPhotos : DEFAULT_STATE.customPhotos
    };
  }

  const cpPhotos = DEFAULT_PHOTOS.map((p) => ({ ...p }));
  if (Array.isArray(delta.ph)) {
    delta.ph.forEach((item: any) => {
      const match = cpPhotos.find((p) => p.id === item.i);
      if (match) {
        if (item.u !== undefined) match.url = item.u;
        if (item.c !== undefined) match.caption = item.c;
      } else {
        // Fallback safety if photo not found
        cpPhotos.push({
          id: item.i || String(Date.now() + Math.random()),
          url: item.u || "",
          caption: item.c || ""
        });
      }
    });
  }

  return {
    recipientName: delta.n !== undefined ? delta.n : DEFAULT_STATE.recipientName,
    passcode: delta.p !== undefined ? delta.p : DEFAULT_STATE.passcode,
    age: delta.a !== undefined ? Number(delta.a) : DEFAULT_STATE.age,
    bgMusicUrl: delta.m !== undefined ? delta.m : DEFAULT_STATE.bgMusicUrl,
    finalWishTitle: delta.wt !== undefined ? delta.wt : DEFAULT_STATE.finalWishTitle,
    finalWishText: delta.w !== undefined ? delta.w : DEFAULT_STATE.finalWishText,
    customPhotos: cpPhotos
  };
}
