import { useCallback, useEffect, useRef, useState } from "react";
import { tracks, trackUrl } from "./tracks";

/** Audio engine: one HTMLAudioElement + Web Audio AnalyserNode.
 *  Bass energy (0..1) is written to the CSS variable --nt-beat on `beatTarget`. */
export function useAudio(beatTarget: React.RefObject<HTMLElement | null>) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ctxRef = useRef<AudioContext | null>(null);
  const anRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef(0);
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.8);
  const indexRef = useRef(0);
  indexRef.current = index;

  const stopLoop = () => { cancelAnimationFrame(rafRef.current); rafRef.current = 0; };

  const startLoop = useCallback(() => {
    stopLoop();
    const an = anRef.current;
    if (!an) return;
    const data = new Uint8Array(an.frequencyBinCount);
    let smooth = 0;
    const tick = () => {
      an.getByteFrequencyData(data);
      // bass: first ~8 bins (~0-170 Hz at 44.1k / fft 512)
      let s = 0;
      for (let i = 0; i < 8; i++) s += data[i];
      const v = s / 8 / 255;
      smooth = v > smooth ? v : smooth * 0.88 + v * 0.12;
      beatTarget.current?.style.setProperty("--nt-beat", smooth.toFixed(3));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
  }, [beatTarget]);

  // Create the audio element once.
  useEffect(() => {
    const a = new Audio();
    a.preload = "metadata";
    a.src = trackUrl(tracks[0]);
    a.volume = 0.8;
    audioRef.current = a;
    const onTime = () => setTime(a.currentTime);
    const onMeta = () => setDuration(a.duration || 0);
    const onPlay = () => { setPlaying(true); startLoop(); };
    const onPause = () => {
      setPlaying(false);
      stopLoop();
      beatTarget.current?.style.setProperty("--nt-beat", "0");
    };
    const onEnd = () => setIndex((i) => (i + 1) % tracks.length);
    a.addEventListener("timeupdate", onTime);
    a.addEventListener("loadedmetadata", onMeta);
    a.addEventListener("durationchange", onMeta);
    a.addEventListener("play", onPlay);
    a.addEventListener("pause", onPause);
    a.addEventListener("ended", onEnd);
    return () => {
      stopLoop();
      a.pause();
      a.removeAttribute("src");
      a.load();
      a.removeEventListener("timeupdate", onTime);
      a.removeEventListener("loadedmetadata", onMeta);
      a.removeEventListener("durationchange", onMeta);
      a.removeEventListener("play", onPlay);
      a.removeEventListener("pause", onPause);
      a.removeEventListener("ended", onEnd);
      ctxRef.current?.close().catch(() => {});
      ctxRef.current = null;
      anRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change track (keeps playing if it was playing).
  const first = useRef(true);
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    if (first.current) { first.current = false; return; }
    const wasPlaying = !a.paused || a.ended;
    a.src = trackUrl(tracks[index]);
    setTime(0);
    if (wasPlaying) a.play().catch(() => {});
  }, [index]);

  const ensureGraph = () => {
    const a = audioRef.current!;
    if (!ctxRef.current) {
      try {
        const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const src = ctx.createMediaElementSource(a);
        const an = ctx.createAnalyser();
        an.fftSize = 512;
        an.smoothingTimeConstant = 0.7;
        src.connect(an);
        an.connect(ctx.destination);
        ctxRef.current = ctx;
        anRef.current = an;
      } catch { /* analyser unavailable: audio still plays */ }
    }
    ctxRef.current?.resume().catch(() => {});
  };

  const toggle = () => {
    const a = audioRef.current!;
    if (a.paused) { ensureGraph(); a.play().catch(() => {}); } else a.pause();
  };
  const next = () => setIndex((i) => (i + 1) % tracks.length);
  const prev = () => {
    const a = audioRef.current!;
    if (a.currentTime > 3) { a.currentTime = 0; return; }
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
  };
  const seek = (s: number) => { const a = audioRef.current!; a.currentTime = s; setTime(s); };
  const setVolume = (v: number) => { audioRef.current!.volume = v; setVolumeState(v); };

  return { index, playing, time, duration, volume, toggle, next, prev, seek, setVolume };
}
