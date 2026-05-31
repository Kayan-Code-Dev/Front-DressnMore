import { sidebarLabels } from "@/components/app/sidebar/constants";
import type { SidebarLabel } from "@/components/app/sidebar/constants";

export type RouteInfo = { title: string; parent?: string };

function collectRoutes(
  items: SidebarLabel[],
  parentLabel?: string
): Record<string, RouteInfo> {
  const out: Record<string, RouteInfo> = {};
  for (const item of items) {
    if (item.path) {
      out[item.path] = {
        title: item.label,
        parent: parentLabel,
      };
    }
    if (item.subItems?.length) {
      const nextParent = item.path ? item.label : parentLabel;
      Object.assign(out, collectRoutes(item.subItems, nextParent));
    }
  }
  return out;
}

export const routeTitles = collectRoutes(sidebarLabels);

export function getRouteInfo(pathname: string): RouteInfo {
  if (routeTitles[pathname]) return routeTitles[pathname];
  const sorted = Object.entries(routeTitles).sort(([a], [b]) => b.length - a.length);
  for (const [key, val] of sorted) {
    if (pathname.startsWith(key + "/")) return val;
  }
  return { title: "الصفحة" };
}
