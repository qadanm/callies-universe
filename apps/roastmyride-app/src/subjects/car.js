// Subject config — the per-app parameterization layer.
// Every "Roast My ___" app is the same shell with a different config object.
// This file contains the CAR config (the reference subject). Other subjects live
// in siblings (texts.js, fit.js, room.js, profile.js).

export default {
  id: "car",
  appName: "RoastMyRide",
  handle: "roastmyride",
  // --- What the user uploads ---
  upload: {
    label: "Drop a pic of your ride",
    subcopy: "The more of your ride I can see, the harder I cook.",
    cta: "Roast my car",
    alt: "Your car",
    replace: "Tap to replace",
    add: "Tap to add photo",
    addSub: "Camera or library",
    emoji: "📸",
  },
  // --- Callie / mascot copy ---
  mascot: {
    home: "Callie's standing by. Drop a car and watch it cook.",
  },
  // --- AI behavior (displayed to user, not the raw prompt) ---
  brain: {
    safety: "The jokes are about the CAR, never the driver, owner, or any person. PG-13. Clever, never cruel.",
    subjectNoun: "your ride",
    researching: "ride",
  },
  // --- Context chip buckets (subject-specific) ---
  chips: {
    buckets: [
      {
        group: "Heat",
        items: [
          ["gentle", "😌 Gentle"],
          ["medium", "🌶 Medium"],
          ["brutal", "🔥 Brutal"],
        ],
      },
      {
        group: "Fair game",
        items: [
          ["thecar", "🚗 The car"],
          ["mytaste", "🎨 My taste"],
          ["themods", "🔧 The mods"],
          ["howidrive", "🏁 How I drive"],
          ["pricetag", "💸 Price tag"],
        ],
      },
      {
        group: "Vibe",
        items: [
          ["deadpan", "😐 Deadpan"],
          ["hype", "📣 Hype"],
          ["brainrot", "🧠 Brainrot"],
          ["battle", "🥊 Roast battle"],
        ],
      },
    ],
  },
  // --- UI theming ---
  theme: {
    emoji: "🚗",
    stickerTag: "🚗 the ride",
  },
  // --- Monetization ---
  monetization: {
    creditLabel: "roasts",
    defaultCredits: 3,
  },
  // --- Cooking steps ---
  cooking: {
    steps: (name) => [
      `${name} is researching your ride…`,
      "Writing tonight's set…",
      "Working out the punchlines…",
      "Warming up the crowd…",
    ],
  },
  // --- Grade display ---
  grade: {
    edgeLabel: "on-the-car",
  },
  // --- Onboarding ---
  onboarding: {
    body: "You bring the car, the app brings the roast — and I'll be right here losing it in the corner. Clever, never cruel.",
    cta: "Roast my car 🔥",
  },
  // --- Celebrate ---
  celebrate: {
    cta: "Book another set",
  },
  // --- Reveal ---
  reveal: {
    heading: "The full set",
  },
  aso: {
    appName: "Roast My Ride",
    subtitle: "Your car. Roasted by a comedian. In a video.",
    keywords: ["roast", "car", "funny", "AI comedy", "car roast", "roast my ride"],
  },
};
