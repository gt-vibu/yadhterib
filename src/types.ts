export interface BirthdayPhoto {
  id: string;
  url: string;
  caption: string;
}

export interface BirthdayState {
  recipientName: string;
  passcode: string;
  age: number;
  bgMusicUrl: string;
  finalWishText: string;
  finalWishTitle: string;
  customPhotos: BirthdayPhoto[];
}

export const DEFAULT_PHOTOS: BirthdayPhoto[] = [
  {
    id: "1",
    url: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=80",
    caption: "The world became a brighter place the day you were born! ✨"
  },
  {
    id: "2",
    url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=600&auto=format&fit=crop&q=80",
    caption: "Laughter, sweet reminders, and your beautiful presence are the best gifts to us all! 🎈"
  },
  {
    id: "3",
    url: "https://images.unsplash.com/photo-1464349113703-490146890905?w=600&auto=format&fit=crop&q=80",
    caption: "To all the dreams waiting to blossom in your beautiful 21st year! 🌟"
  },
  {
    id: "4",
    url: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=600&auto=format&fit=crop&q=80",
    caption: "Hope you find happiness in the tiniest moments, and warmth in every step you take. 🌸"
  }
];

export const DEFAULT_STATE: BirthdayState = {
  recipientName: "Bhoomika",
  passcode: "2005",
  age: 21,
  bgMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3", // high quality instrumental piano loop fallback
  finalWishTitle: "Happy Birthday Bhoomika! 🎂✨",
  finalWishText: "Hi Bhoomika! On this very special day, we wish you a sky full of stardust, endless laughter, and a path paved with happiness, success, and beautiful melodies. Have the most magical 21st birthday ever! Keep shining like the brilliant star you are! 🌟",
  customPhotos: DEFAULT_PHOTOS
};
