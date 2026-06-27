/**
 * Bouncy bottom sheet / modal. Clean content; mascot may host the header.
 * @startingPoint section="Feedback" subtitle="Bouncy bottom sheet with mascot header" viewport="430x520"
 */
export interface SheetProps {
  open?: boolean;
  title?: string;
  /** Optional node (e.g. <Mascot/>) that hosts the header above the sheet. */
  header?: React.ReactNode;
  onClose?: () => void;
  /** Usually a <Button block> pinned to the bottom. */
  primaryAction?: React.ReactNode;
  children?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Sheet(props: SheetProps): JSX.Element;
