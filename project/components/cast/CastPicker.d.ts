/**
 * CastPicker — reusable character-tile / cast-picker for Callie's Universe.
 * Featured roaster + tap-to-switch grid; reads the cast from Roaster.roster
 * so it auto-extends. The host wraps it with its own header (Callie) + CTA.
 *
 * @startingPoint section="Brand" subtitle="The cast / character picker" viewport="430x640"
 */
export interface CastPickerProps {
  /** Roaster id to start on. */
  initialId?: string;
  /** Called with the full roster entry whenever the selection changes. */
  onChange?: (roaster: { id: string; name: string; tag: string; register: string; spice: string; phrase: string }) => void;
  style?: React.CSSProperties;
}
export function CastPicker(props: CastPickerProps): JSX.Element;
