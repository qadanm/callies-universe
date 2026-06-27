/**
 * The signature output frame — the still/video card that IS the social content.
 * @startingPoint section="Share" subtitle="The signature 9:16 roast share card" viewport="430x640"
 */
export interface RoastSegment { text: string; punch?: boolean; }
export interface ShareCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The roast text, or segments where {punch:true} gets the highlight. */
  roast: string | RoastSegment[];
  /** A <Mascot/> node used as the bottom-right tag. */
  mascot?: React.ReactNode;
  roasterName?: string;
  spice?: "mild" | "savage";
  width?: number;
  watermark?: string;
}
export function ShareCard(props: ShareCardProps): JSX.Element;
