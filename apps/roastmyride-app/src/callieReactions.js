// RoastMyRide — app-specific Callie reactions [ROASTMYRIDE-NEW: data only].
//
// Callie's ART and her BRAIN (idle-cycling, tips, the <CallieHost> behavior) are
// all CORE [CORE-REUSED] — this app commissions no new art. All RoastMyRide adds
// is DATA: which of Callie's nine core states she shows at this app's moments,
// referenced BY NAME. The two-performer rule holds — the cast voices the roast,
// Callie only reacts.
//
// Core states (the only allowed values): idle · curious · cooking · delighted ·
// savage · comfort · celebrating · empty · error.

/** Roast spice → Callie's reaction at the reveal. */
export const ROAST_REACTION = {
  mild: "delighted",
  medium: "savage",
  savage: "savage",
};

/** Transient flow events → Callie's reaction. */
export const EVENT_REACTION = {
  photoAdded: "delighted", // a photo was attached
  shared: "celebrating", // the roast was posted
  bought: "celebrating", // credits purchased
};

/**
 * Per-screen ambient context fed to the core <CallieHost context="…"> (which
 * already carries the matching idle pool + tips in core's CALLIE_SCRIPT). Listed
 * here so this app's screen→context choices live in one auditable place.
 */
export const SCREEN_CONTEXT = {
  onboarding: "onboarding",
  home: "home",
  chips: "cast",
  cast: "cast",
  cooking: "cooking",
  reveal: "reveal",
  celebrate: "celebrate",
  credits: "paywall",
  settings: "settings",
};
