import { useEffect, useState, type ReactNode } from "react";

// Click to open. On open, the content is "written" as markdown, a deploy line
// flashes, then the real rendered content pops in.
type Phase = "closed" | "typing" | "deploy" | "done";

export default function Collapsible({
  header,
  markdown,
  children,
  deployLabel = "deploy",
}: {
  header: ReactNode;
  markdown: string;
  children: ReactNode;
  deployLabel?: string;
}) {
  const [phase, setPhase] = useState<Phase>("closed");
  const [typed, setTyped] = useState(0);
  const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const open = phase !== "closed";

  useEffect(() => {
    if (phase !== "typing") return;
    // Whole typing step takes at most ~1.2 s, however long the text is.
    const step = Math.max(1, Math.ceil(markdown.length / 70));
    const id = window.setInterval(() => {
      setTyped((t) => {
        const next = Math.min(markdown.length, t + step);
        if (next >= markdown.length) {
          window.clearInterval(id);
          window.setTimeout(() => setPhase("deploy"), 150);
        }
        return next;
      });
    }, 17);
    return () => window.clearInterval(id);
  }, [phase, markdown]);

  useEffect(() => {
    if (phase !== "deploy") return;
    const id = window.setTimeout(() => setPhase("done"), 650);
    return () => window.clearTimeout(id);
  }, [phase]);

  const toggle = () => {
    if (open) {
      setPhase("closed");
      return;
    }
    setTyped(0);
    setPhase(reduce ? "done" : "typing");
  };

  return (
    <div className={"acc" + (open ? " open" : "")}>
      <button className="acc-head" onClick={toggle} aria-expanded={open}>
        <div className="acc-title">{header}</div>
        <span className="chev" aria-hidden>
          ›
        </span>
      </button>
      {open && (
        <div className="acc-body">
          {phase === "typing" && (
            <pre className="md">
              {markdown.slice(0, typed)}
              <span className="caret" />
            </pre>
          )}
          {phase === "deploy" && (
            <pre className="md">
              {markdown}
              {"\n"}
              <span className="deploy">▶ {deployLabel}</span>
            </pre>
          )}
          {phase === "done" && <div className="reveal">{children}</div>}
        </div>
      )}
    </div>
  );
}
