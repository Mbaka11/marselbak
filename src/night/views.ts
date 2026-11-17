// Profile views counter: /api/views (Netlify Function).
// A visit is counted once per browser session (POST), reloads only read (GET).
// Returns null on any failure so the UI can hide the counter.
export async function fetchViews(signal?: AbortSignal): Promise<number | null> {
  let counted = false;
  try {
    counted = sessionStorage.getItem("views-counted") === "1";
  } catch {
    /* storage blocked: count every time */
  }
  try {
    const res = await fetch("/api/views", { method: counted ? "GET" : "POST", signal });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("json")) return null;
    const data = await res.json();
    if (typeof data?.count !== "number") return null;
    try {
      sessionStorage.setItem("views-counted", "1");
    } catch {
      /* ignore */
    }
    return data.count;
  } catch {
    return null;
  }
}
