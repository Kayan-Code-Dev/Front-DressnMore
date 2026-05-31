import { useMemo } from "react";
import { useSession } from "@/shared/lib/auth/session.store";
import { isModuleLive, type ModuleName } from "@/config/feature-flags";
import { resolveModuleForPath } from "@/config/plan-modules";
import type { SidebarLabel } from "./constants";

export function useSidebarPermissions(): string[] {
  return useSession((s) => s.permissions);
}

function normalizePermissions(value: unknown): string[] {
  if (value == null) return [];
  if (Array.isArray(value)) {
    return value
      .map((p) => (typeof p === "string" ? p : (p as { name?: string })?.name))
      .filter((p): p is string => typeof p === "string" && p.length > 0);
  }
  return [];
}

function isItemVisibleByPlan(item: SidebarLabel): boolean {
  const module = resolveModuleForPath(item.path);
  if (!module) {
    return true;
  }

  return isModuleLive(module as ModuleName);
}

function filterRecursive(
  labels: SidebarLabel[],
  userPermissions: Set<string>
): SidebarLabel[] {
  return labels.reduce((filteredList, item) => {
    if (!isItemVisibleByPlan(item)) {
      return filteredList;
    }

    let filteredSubItems: SidebarLabel[] | undefined = undefined;
    if (item.subItems && item.subItems.length > 0) {
      filteredSubItems = filterRecursive(item.subItems, userPermissions);
    }

    const hasVisibleChildren = filteredSubItems && filteredSubItems.length > 0;

    const hasAccessByPermissions =
      item.permissions && item.permissions.length > 0
        ? item.permissions.some((p) => userPermissions.has(p))
        : false;
    const hasAccessByPermission = item.permission
      ? userPermissions.has(item.permission)
      : false;
    const isPublic =
      item.permission == null &&
      (item.permissions == null || item.permissions === undefined);

    const keep =
      isPublic ||
      hasAccessByPermissions ||
      hasAccessByPermission ||
      hasVisibleChildren;

    if (keep) {
      filteredList.push({
        ...item,
        subItems: filteredSubItems,
      });
    }

    return filteredList;
  }, [] as SidebarLabel[]);
}

export function filterSidebarByPermissions(
  allSidebarLabels: SidebarLabel[],
  userPermissions: string[] | unknown
): SidebarLabel[] {
  const list = normalizePermissions(userPermissions);
  const permissionsSet = new Set(list);
  return filterRecursive(allSidebarLabels, permissionsSet);
}

function useSidebarLabel(labels: SidebarLabel[], myPermissions: string[] | unknown) {
  return useMemo(() => {
    return filterSidebarByPermissions(labels, myPermissions ?? []);
  }, [labels, myPermissions]);
}

export default useSidebarLabel;
