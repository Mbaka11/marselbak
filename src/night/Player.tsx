import { useEffect, useRef } from "react";
import { useSettings } from "../settings";
import Cover from "./Cover";
import { CloseIcon, NextIcon, PauseIcon, PlayIcon, PrevIcon, VolumeIcon } from "./icons";
import { t } from "./strings";
import { tracks } from "./tracks";
import type { useAudio } from "./useAudio";

type Audio = ReturnType<typeof useAudio>;

const fmt = (s: number) => {
  if (!isFinite(s)) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

export default function Player({ audio, onClose }: { audio: Audio; onClose: () => void }) {
  const { lang } = useSettings();
  const track = tracks[audio.index];
  const closeRef = useRef<HTMLButtonElement>(null);
  const prevFocus = useRef<Element | null>(null);

  useEffect(() => {
    prevFocus.current = document.activeElement;
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      (prevFocus.current as HTMLElement | null)?.focus?.();
    };
  }, [onClose]);

  return (
    <div className="nt-overlay" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="nt-player" role="dialog" aria-modal="true" aria-label={t.music[lang]}>
        <button ref={closeRef} className="nt-icon-btn nt-close" onClick={onClose} aria-label={t.closePlayer[lang]}>
          <CloseIcon />
        </button>

        <div className="nt-art">
          <svg className="nt-ring" viewBox="0 0 100 100" aria-hidden="true" preserveAspectRatio="none">
            <rect className="nt-ring-base" x="1" y="1" width="98" height="98" rx="9" pathLength="100" />
            <rect className={"nt-ring-run" + (audio.playing ? " is-on" : "")} x="1" y="1" width="98" height="98" rx="9" pathLength="100" />
          </svg>
          <Cover seed={track.file} label={track.title} />
        </div>

        <div className="nt-meta" aria-live="polite">
          <div className="nt-title">{track.title}</div>
          <div className="nt-artist">{track.artist}</div>
        </div>

        <div className="nt-progress">
          <span>{fmt(audio.time)}</span>
          <input
            type="range" min={0} max={audio.duration || 0} step={0.1} value={audio.time}
            onChange={(e) => audio.seek(Number(e.target.value))}
            aria-label={t.seek[lang]}
            style={{ ["--p" as string]: `${audio.duration ? (audio.time / audio.duration) * 100 : 0}%` }}
          />
          <span>{fmt(audio.duration)}</span>
        </div>

        <div className="nt-controls">
          <button className="nt-icon-btn" onClick={audio.prev} aria-label={t.prev[lang]}><PrevIcon /></button>
          <button className="nt-icon-btn nt-play" onClick={audio.toggle} aria-label={audio.playing ? t.pause[lang] : t.play[lang]}>
            {audio.playing ? <PauseIcon /> : <PlayIcon />}
          </button>
          <button className="nt-icon-btn" onClick={audio.next} aria-label={t.next[lang]}><NextIcon /></button>
        </div>

        <div className="nt-volume">
          <VolumeIcon />
          <input
            type="range" min={0} max={1} step={0.01} value={audio.volume}
            onChange={(e) => audio.setVolume(Number(e.target.value))}
            aria-label={t.volume[lang]}
            style={{ ["--p" as string]: `${audio.volume * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
