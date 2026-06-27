/**
 * Small status / count pill in a semantic or sticker tone.
 */
export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  tone?: "ember" | "flame" | "success" | "info" | "cool" | "pink" | "ink";
  children?: React.ReactNode;
}
export function Badge(props: BadgeProps): JSX.Element;
