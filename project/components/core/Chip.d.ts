/**
 * Sticker-like tap pill for fast multi-select context chips.
 */
export interface ChipProps {
  /** Selected = filled ember with a pop and a clear ✕ affordance. */
  selected?: boolean;
  /** Optional leading glyph/sticker. */
  emoji?: React.ReactNode;
  children?: React.ReactNode;
  /** Called with the next selected value. */
  onToggle?: (next: boolean) => void;
  style?: React.CSSProperties;
}
export function Chip(props: ChipProps): JSX.Element;
