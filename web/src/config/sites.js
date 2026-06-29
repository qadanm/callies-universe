// Site registry — ONE Astro codebase, many sites (the network hub + each app), the
// same pattern as the apps' VITE_SUBJECT. `SITE=<id> astro build` selects which one
// builds; each deploys to its own domain. Every site reuses `core` (Callie, the
// comedian avatars, the brand tokens), so the web matches the apps + the videos.

export const SITES = {
  // ---- The studio / network hub ----
  network: {
    id: "network",
    kind: "network",
    name: "Callie's Universe",
    url: "https://calliesuniverse.com",
    tagline: "A universe of original AI comedians who roast your world.",
    blurb:
      "Callie's Universe is a comedy studio. One cast of original characters, one cat who reacts to everything, and a growing lineup of “Roast My ___” apps that turn whatever you submit into a short, sharable roast.",
    // Cosmic violet + gold — the ident palette.
    accent: {
      "accent-700": "#5B21B6", "accent-600": "#7C3AED", "accent-500": "#8B5CF6",
      "accent-bright": "#A78BFA", "accent-bright-2": "#C4B5FD",
      "accent-warm": "#DDD6FE", "accent-warm-2": "#EDE9FE", "accent-soft": "#F5F3FF",
    },
    emoji: "✦",
  },

  // ---- The shows (apps) ----
  roastmyride: {
    id: "roastmyride",
    kind: "app",
    name: "Roast My Ride",
    url: "https://roastmyride.com",
    tagline: "Your car. Roasted by a comedian. In a video.",
    blurb:
      "Snap your car, tell us exactly what it is, and two comedians tear into it on a tiny podcast — then you get a vertical video built to share.",
    emoji: "🚗",
    subjectNoun: "car",
    appStoreUrl: "#", // set when live
    status: "live",
    // Ember ramp (matches the app's accent).
    accent: {
      "accent-700": "#9E2709", "accent-600": "#C7340F", "accent-500": "#E5481B",
      "accent-bright": "#FF6A1A", "accent-bright-2": "#FF8330",
      "accent-warm": "#FF9D4D", "accent-warm-2": "#FFB877", "accent-soft": "#FFF3E2",
    },
  },
};

/** The shows shown on the hub (and as cross-links). Order = display order. */
export const SHOWS = [
  { id: "roastmyride", name: "Roast My Ride", emoji: "🚗", url: "https://roastmyride.com", tagline: "Your car, roasted.", status: "live" },
  { id: "roasttexts", name: "Roast My Texts", emoji: "💬", url: "#", tagline: "Your group chat, roasted.", status: "soon" },
  { id: "roastfit", name: "Roast My Fit", emoji: "👕", url: "#", tagline: "Your outfit, roasted.", status: "soon" },
  { id: "roastroom", name: "Roast My Room", emoji: "🛋️", url: "#", tagline: "Your room, roasted.", status: "soon" },
  { id: "roastprofile", name: "Roast My Profile", emoji: "👤", url: "#", tagline: "Your dating profile, roasted.", status: "soon" },
];

export const activeSite = SITES[process.env.SITE || "network"];

export const LEGAL_ENTITY = "Callie's Universe";
