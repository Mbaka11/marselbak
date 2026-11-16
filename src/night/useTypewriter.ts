import { useEffect, useRef, useState } from "react";

/** Types `name` once, then cycles through `lines` (write, pause, delete, next).
 *  `onDelete` fires on every deleted character. Static when `still`. */
export function useTypewriter(name: string, lines: string[], still: boolean, onDelete: () => void) {
  const [nameOut, setNameOut] = useState(still ? name : "");
  const [bioOut, setBioOut] = useState(still ? lines[0] : "");
  const key = lines.join("|");
  const cb = useRef(onDelete);
  cb.current = onDelete;

  useEffect(() => {
    if (still) { setNameOut(name); setBioOut(lines[0]); return; }
    let dead = false;
    let timer = 0;
    const wait = (ms: number) => new Promise<void>((r) => { timer = window.setTimeout(r, ms); });
    (async () => {
      setBioOut("");
      for (let i = 1; i <= name.length && !dead; i++) { setNameOut(name.slice(0, i)); await wait(90); }
      await wait(350);
      let idx = 0;
      while (!dead) {
        const s = lines[idx % lines.length];
        for (let i = 1; i <= s.length && !dead; i++) { setBioOut(s.slice(0, i)); await wait(60); }
        await wait(1700);
        for (let i = s.length - 1; i >= 0 && !dead; i--) { setBioOut(s.slice(0, i)); cb.current(); await wait(28); }
        await wait(350);
        idx++;
      }
    })();
    return () => { dead = true; clearTimeout(timer); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [name, key, still]);

  return { nameOut, bioOut };
}
