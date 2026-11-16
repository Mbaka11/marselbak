// Profile views counter. Expects POST /api/views -> { count: number }.
// Returns null on any failure so the UI can hide the counter.
export async function fetchViews(signal?: AbortSignal): Promise<number | null> {
  try {
    const res = await fetch("/api/views", { method: "POST", signal });
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("json")) return null;
    const data = await res.json();
    return typeof data?.count === "number" ? data.count : null;
  } catch {
    return null;
  }
}
