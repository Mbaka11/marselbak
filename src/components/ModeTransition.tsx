import "./modeTransition.css";

export type ModeFx = "toNight" | "toDay";

/** Full-screen light overlay played while the mode swaps underneath (the swap happens near its midpoint). */
export const FX_SWAP_MS = 400;
export const FX_TOTAL_MS = 1050;

export default function ModeTransition({ fx }: { fx: ModeFx | null }) {
  if (!fx) return null;
  return <div className={`mfx mfx-${fx}`} aria-hidden="true" />;
}
