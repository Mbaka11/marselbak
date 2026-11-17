import { getStore } from "@netlify/blobs";

// Profile views counter. POST = count one visit, GET = read only. Stored in Netlify Blobs.
// Not atomic: two simultaneous visits can lose one count, which is fine here.
export default async (req) => {
  const store = getStore("counters");
  const current = Number(await store.get("views")) || 0;
  let count = current;
  if (req.method === "POST") {
    count = current + 1;
    await store.set("views", String(count));
  } else if (req.method !== "GET") {
    return new Response("Method not allowed", { status: 405 });
  }
  return new Response(JSON.stringify({ count }), {
    headers: { "content-type": "application/json", "cache-control": "no-store" },
  });
};

export const config = { path: "/api/views" };
