// services/brain — SUBJECT REGISTRY.
//
// The engine is subject-agnostic. It learns which subject it's roasting from
// `input.subject` (threaded by the app) and dispatches to the matching pack for
// grounding, offline sets, and prompt framing. Unknown / missing → car (the
// reference subject), so every existing caller and test keeps working unchanged.
//
// Adding a subject = add a pack file + register it here. The orchestrator,
// writer, grader, and offline path never change.

import { carPack } from "./car.js";
import { textsPack } from "./texts.js";
import { outfitPack } from "./outfit.js";
import { roomPack } from "./room.js";
import { profilePack } from "./profile.js";

const PACKS = {
  car: carPack,
  texts: textsPack,
  outfit: outfitPack,
  room: roomPack,
  profile: profilePack,
};

/** Resolve a subject id to its pack. Defaults to car. */
export function resolveSubjectPack(id) {
  return PACKS[id] || carPack;
}
