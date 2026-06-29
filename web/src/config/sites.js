// Site registry: ONE Astro codebase, many sites (the network hub + each app), the
// same pattern as the apps' VITE_SUBJECT. `SITE=<id> astro build` selects which one
// builds; each deploys to its own domain. Every site reuses `core` (Callie, the
// comedian avatars, the brand tokens), so the web matches the apps + the videos.

const ramp = (a) => ({
  "accent-700": a[0], "accent-600": a[1], "accent-500": a[2], "accent-bright": a[3],
  "accent-bright-2": a[4], "accent-warm": a[5], "accent-warm-2": a[6], "accent-soft": a[7],
});

export const SITES = {
  // ---- The studio / network hub ----
  network: {
    id: "network", kind: "network",
    name: "Callie's Universe", url: "https://calliesuniverse.com",
    tagline: "A universe of original AI comedians who roast your world.",
    blurb:
      "Callie's Universe is a comedy studio. One cast of original characters, one cat who reacts to everything, and a growing lineup of “Roast My ___” apps that turn whatever you submit into a short, sharable roast.",
    accent: ramp(["#5B21B6", "#7C3AED", "#8B5CF6", "#A78BFA", "#C4B5FD", "#DDD6FE", "#EDE9FE", "#F5F3FF"]),
    emoji: "✦",
    subjectNoun: "whatever you submit", mediaNoun: "upload",
  },

  // ---- The shows (apps) ----
  roastmyride: {
    id: "roastmyride", kind: "app", name: "Roast My Ride", url: "https://roastmyride.com",
    tagline: "Your car. Roasted by a comedian. In a video.",
    blurb: "Snap your car, tell us exactly what it is, and two comedians tear into it on a tiny podcast. Then you get a vertical video built to share.",
    emoji: "🚗", subjectNoun: "car", mediaNoun: "photo", status: "live", appStoreUrl: "#",
    steps: [
      { emoji: "📸", h: "Snap your car", p: "Drop a photo and confirm the exact make and model so the roast lands." },
      { emoji: "🎙️", h: "The comics cook", p: "Two comedians tear into your ride on a tiny podcast, with Callie reacting." },
      { emoji: "📲", h: "Share the reel", p: "Get a vertical, captioned video built to post." },
    ],
    accent: ramp(["#9E2709", "#C7340F", "#E5481B", "#FF6A1A", "#FF8330", "#FF9D4D", "#FFB877", "#FFF3E2"]),
  },

  roasttexts: {
    id: "roasttexts", kind: "app", name: "Roast My Texts", url: "https://roastmytexts.com",
    tagline: "Your group chat. Roasted by a comedian. In a video.",
    blurb: "Screenshot a conversation and two comedians break down every dry reply, double-text, and left-on-read like a tiny podcast. Then you get a video to send back to the chat.",
    emoji: "💬", subjectNoun: "chat", mediaNoun: "screenshot", status: "soon",
    steps: [
      { emoji: "📷", h: "Screenshot the chat", p: "Upload a conversation. We read the thread, never the person." },
      { emoji: "🎙️", h: "The comics read it", p: "Two comedians roast the dynamics: the dry replies, the games, the silence." },
      { emoji: "📲", h: "Send it back", p: "Get a video to drop right back in the group chat." },
    ],
    accent: ramp(["#1E40AF", "#2563EB", "#3B82F6", "#60A5FA", "#93C5FD", "#BFDBFE", "#DBEAFE", "#EFF6FF"]),
  },

  roastfit: {
    id: "roastfit", kind: "app", name: "Roast My Fit", url: "https://roastmyfit.com",
    tagline: "Your outfit. Roasted by a comedian. In a video.",
    blurb: "Snap your fit and two comedians judge every choice (the clashing, the trying-too-hard, the one piece that ruins it) on a tiny podcast, then hand you a video.",
    emoji: "👕", subjectNoun: "fit", mediaNoun: "photo", status: "soon",
    steps: [
      { emoji: "📸", h: "Snap your fit", p: "Mirror selfie, OOTD, whatever. Drop the look." },
      { emoji: "🎙️", h: "The comics judge", p: "Two comedians roast the outfit (the fit, never your body)." },
      { emoji: "📲", h: "Post the verdict", p: "Get a vertical video for the feed." },
    ],
    accent: ramp(["#9D174D", "#CC2069", "#EC4899", "#F472B6", "#F9A8D4", "#FBCFE8", "#FCE7F3", "#FDF2F8"]),
  },

  roastroom: {
    id: "roastroom", kind: "app", name: "Roast My Room", url: "https://roastmyroom.com",
    tagline: "Your room. Roasted by a comedian. In a video.",
    blurb: "Snap your room and two comedians clock the mess, the decor, and that one poster on a tiny podcast, then you get a video to share.",
    emoji: "🛋️", subjectNoun: "room", mediaNoun: "photo", status: "soon",
    steps: [
      { emoji: "📸", h: "Snap your room", p: "One photo of the space. The messier the better." },
      { emoji: "🎙️", h: "The comics clock it", p: "Two comedians roast the decor, the clutter, the choices." },
      { emoji: "📲", h: "Share the tour", p: "Get a vertical video roast of the room." },
    ],
    accent: ramp(["#166534", "#15803D", "#22C55E", "#4ADE80", "#86EFAC", "#BBF7D0", "#DCFCE7", "#F0FDF4"]),
  },

  roastprofile: {
    id: "roastprofile", kind: "app", name: "Roast My Profile", url: "https://roastmyprofile.com",
    tagline: "Your dating profile. Roasted by a comedian. In a video.",
    blurb: "Screenshot your dating profile and two comedians roast the bio, the prompts, and the photo choices (never your looks) on a tiny podcast, then hand you a video (and, honestly, some notes).",
    emoji: "👤", subjectNoun: "profile", mediaNoun: "screenshot", status: "soon",
    steps: [
      { emoji: "📷", h: "Screenshot your profile", p: "Bio, prompts, pics. The whole thing." },
      { emoji: "🎙️", h: "The comics review", p: "Two comedians roast the choices (the clichés, the prompts), never you." },
      { emoji: "📲", h: "Fix it, or post it", p: "Get a video and some surprisingly useful notes." },
    ],
    accent: ramp(["#9F1239", "#D11641", "#F43F5E", "#FB7185", "#FDA4AF", "#FECDD3", "#FFE4E6", "#FFF1F2"]),
  },
};

/** The shows shown on the hub (and as cross-links). Order = display order. */
export const SHOWS = Object.values(SITES)
  .filter((s) => s.kind === "app")
  .map((s) => ({ id: s.id, name: s.name, emoji: s.emoji, url: s.url, tagline: s.tagline.replace(/\. .*/, ""), status: s.status }));

export const activeSite = SITES[process.env.SITE || "network"];

export const LEGAL_ENTITY = "Callie's Universe";
