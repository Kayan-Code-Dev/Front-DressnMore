export const includeRoute = (
  pathname: string,
  path: string | undefined,
  level: number,
  hasSubItems?: boolean
): boolean => {
  if (!path) return false;
  if (path === "/" && pathname === "/") return true;
  if (pathname === path) return !hasSubItems;

  if (pathname.startsWith(path + "/")) {
    if (level >= 2) return false;
    const pathnameArr = pathname.split("/");
    const pathArr = path.split("/");
    for (let i = 0; i <= level && i < pathArr.length && i < pathnameArr.length; i++) {
      if (pathArr[i] !== pathnameArr[i]) return false;
    }
    return true;
  }

  return false;
};

export const hasActiveChild = (
  pathname: string,
  item: { path: string; level: number; subItems?: Array<{ path: string; level: number; subItems?: unknown[] }> }
): boolean => {
  if (!item.subItems || item.subItems.length === 0) return false;

  return item.subItems.some((subItem) => {
    if (includeRoute(pathname, subItem.path, subItem.level)) return true;
    if (subItem.subItems) {
      return hasActiveChild(pathname, subItem as Parameters<typeof hasActiveChild>[1]);
    }
    return false;
  });
};
