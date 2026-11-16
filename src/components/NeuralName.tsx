import { useMemo } from "react";

// Name that "fires" letter by letter like a neural network activating:
// a small network sits behind the text and lights up left to right in sync.
function rng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296;
    return s / 4294967296;
  };
}

export default function NeuralName({ text }: { text: string }) {
  const net = useMemo(() => {
    const r = rng(7);
    const n = 16;
    const nodes = Array.from({ length: n }, (_, i) => ({
      x: (i / (n - 1)) * 100,
      y: 8 + r() * 84,
      d: 300 + (i / (n - 1)) * text.length * 70,
    }));
    const edges: { a: number; b: number; d: number }[] = [];
    nodes.forEach((_, i) => {
      for (const j of [i + 1, i + 2]) if (j < n && r() > 0.25) edges.push({ a: i, b: j, d: nodes[i].d });
    });
    return { nodes, edges };
  }, [text]);

  return (
    <div className="neural" aria-label={text}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
        {net.edges.map((e, i) => (
          <line
            key={i}
            x1={net.nodes[e.a].x}
            y1={net.nodes[e.a].y}
            x2={net.nodes[e.b].x}
            y2={net.nodes[e.b].y}
            style={{ ["--d" as string]: e.d }}
            vectorEffect="non-scaling-stroke"
          />
        ))}
        {net.nodes.map((n, i) => (
          <circle key={i} cx={n.x} cy={n.y} r="2.5" style={{ ["--d" as string]: n.d }} />
        ))}
      </svg>
      <h1 aria-hidden>
        {text.split("").map((c, i) => (
          <span key={i} className={c === " " ? "ch sp" : "ch"} style={{ ["--i" as string]: i }}>
            {c === " " ? " " : c}
          </span>
        ))}
      </h1>
    </div>
  );
}
