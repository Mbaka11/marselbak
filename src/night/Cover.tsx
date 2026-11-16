// Procedural cover: gradient seeded from the title + initials.
function hash(s: string) {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

export default function Cover({ seed, label }: { seed: string; label: string }) {
  const h = hash(seed);
  const h1 = h % 360;
  const h2 = (h1 + 40 + ((h >> 8) % 120)) % 360;
  const ang = (h >> 4) % 360;
  const initials = label.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]).join("").toUpperCase();
  return (
    <div
      className="nt-cover"
      style={{
        background: `radial-gradient(circle at ${20 + (h % 60)}% ${15 + ((h >> 6) % 60)}%, hsl(${h2} 80% 62% / .9), transparent 60%), linear-gradient(${ang}deg, hsl(${h1} 65% 28%), hsl(${h2} 70% 14%))`,
      }}
    >
      <span>{initials}</span>
    </div>
  );
}
