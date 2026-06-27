/**
 * Clean high-contrast text input with obvious focus + error states.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  /** Error message — also flips border to danger and sets aria-invalid. */
  error?: string;
  iconLeft?: React.ReactNode;
}
export function Input(props: InputProps): JSX.Element;
