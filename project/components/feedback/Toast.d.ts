/**
 * Compact bouncy status toast.
 */
export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  tone?: "ink" | "success" | "danger" | "flame";
  icon?: React.ReactNode;
  children?: React.ReactNode;
}
export function Toast(props: ToastProps): JSX.Element;
