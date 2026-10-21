const LARGE =
  "https://api.kontakt.az/media/catalog/product/cache/716efda7398dc1b7904df86297088a96/";

/** Swap Kontakt's 450px cache file for the 1216px product photo. */
export function hiResImage(url: string): string {
  if (!url || !url.includes("/catalog/product/cache/")) return url;
  const rel = url.split("/catalog/product/")[1];
  if (!rel) return url;
  const noCache = rel.replace(/^cache\/[a-f0-9]+\//, "");
  const bare = noCache.replace(/-[a-f0-9]{8}(\.[a-z0-9]+)$/i, "$1");
  const slash = bare.lastIndexOf("/");
  const dir = bare.slice(0, slash + 1);
  const stem = bare.slice(slash + 1).replace(/\.[a-z0-9]+$/i, "");
  if (!stem) return url;
  return `${LARGE}${dir}${stem}.png`;
}
