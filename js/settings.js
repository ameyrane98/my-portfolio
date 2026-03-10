// Fetches and caches portfolio settings from the API.
// ES module cache ensures only one network request even with multiple importers.
let cache = null;

export async function getSettings() {
  if (cache) return cache;
  try {
    const res = await fetch('/api/admin/settings');
    cache = await res.json();
  } catch {
    cache = {};
  }
  return cache;
}
