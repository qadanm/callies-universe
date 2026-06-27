/**
 * Decoration-only confetti burst. pointer-events:none; renders nothing under reduce-motion.
 */
export interface ConfettiProps {
  count?: number;
  active?: boolean;
  style?: React.CSSProperties;
}
export function Confetti(props: ConfettiProps): JSX.Element | null;
