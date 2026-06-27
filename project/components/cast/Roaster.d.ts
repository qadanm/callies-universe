/**
 * Roaster — the voice-cast avatars. Eight named, backstoried comedic personas
 * who deliver the roast (the cast performs; Callie only reacts). Each is a
 * unique kawaii bust; swappable PLACEHOLDER art keyed to `id`.
 *
 * Roster metadata (name / tag / register / spice / phrase / ring color) is on
 * the static `Roaster.roster` array — use it to build cast tiles.
 *
 * @startingPoint section="Brand" subtitle="The 8-roaster voice cast" viewport="700x320"
 */
export interface RoasterProps {
  /** Which cast member. */
  id?: "reginald" | "tony" | "abuomar" | "mama" | "mateo" | "jeanluc" | "priya" | "kenji";
  size?: number;
  /** Draw the character's signature background ring (for picker tiles). */
  ring?: boolean;
  style?: React.CSSProperties;
}
export function Roaster(props: RoasterProps): JSX.Element;
