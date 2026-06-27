/**
 * Collectible sticker-ish credit bundle tile for the paywall.
 */
export interface CreditTileProps {
  credits: number;
  price: string;
  /** Optional per-roast unit price line. */
  perRoast?: string;
  best?: boolean;
  selected?: boolean;
  onSelect?: () => void;
  style?: React.CSSProperties;
}
export function CreditTile(props: CreditTileProps): JSX.Element;
