/**
 * Rounded glossy card. Clean interior bones; optional corner sticker skin.
 * @startingPoint section="Core" subtitle="Glossy card with optional corner sticker" viewport="700x240"
 */
export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Decoration node pinned to a corner (the skin layer). */
  sticker?: React.ReactNode;
  stickerCorner?: "tl" | "tr" | "bl" | "br";
  /** Interior padding (CSS value or token). */
  pad?: string;
  children?: React.ReactNode;
}
export function Card(props: CardProps): JSX.Element;
