// Shows a logo image when we have one, otherwise a monogram badge.
export default function Logo({ src, name, size = 36 }: { src?: string; name: string; size?: number }) {
  const style = { width: size, height: size, fontSize: size * 0.42 };
  if (src) return <img className="logo" src={src} alt={name} style={style} />;
  const initials = name
    .split(/[\s/–-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join("");
  return (
    <span className="logo mono" style={style} aria-label={name}>
      {initials}
    </span>
  );
}
