type QueryValue = string | number | boolean | null | undefined;

export function buildQueryString(params: Record<string, QueryValue>): string {
  const entries: string[] = [];

  for (const [key, value] of Object.entries(params)) {
    if (value === null || value === undefined || value === "") {
      continue;
    }
    entries.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`);
  }

  return entries.length > 0 ? `?${entries.join("&")}` : "";
}
