// RoastMyRide — generate a sample render spec (inputProps) for the Remotion
// "stage" composition, straight from the offline brain. This is the same shape
// the app's Save flow will build at runtime (result + photos → spec), so it
// doubles as a fixture for the render CLI.
//
// Usage: node scripts/sample-spec.mjs [roasterId] [outFile]
import { writeFileSync } from "node:fs";
import { offlineBrain } from "@callies-universe/brain";
import { toStandupSet } from "../src/standup.js";

const roasterId = process.argv[2] || "mama";
const outFile = process.argv[3] || "spec.json";
const car = { label: "2006 Chrysler PT Cruiser" };

const result = offlineBrain({ carPhoto: { present: true }, car, roasterId, config: { offline: true } });
const su = toStandupSet(result);

const spec = {
  comedianId: result.roasterId,
  performerName: result.roasterName,
  bit: su.bit,
  reaction: result.reaction,
  carLabel: car.label,
  engineLabel: result.engine === "offline" ? "offline" : undefined,
  beats: su.beats,
  carPhoto: null, // a dataUrl at runtime; placeholder slot when null
  profile: null,
};

writeFileSync(outFile, JSON.stringify(spec, null, 2));
console.log(`wrote ${outFile} — ${result.roasterName}, ${su.beats.length} beats, bit "${su.bit}"`);
