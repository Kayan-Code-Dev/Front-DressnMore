type TenantLike = {
  slug?: string;
};

export function readTenantSlug(tenant: unknown, workspace: string | null): string | null {
  if (tenant && typeof tenant === "object" && "slug" in tenant) {
    const slug = (tenant as TenantLike).slug;
    if (typeof slug === "string" && slug.length > 0) {
      return slug;
    }
  }

  if (workspace && workspace.trim().length > 0) {
    return workspace.trim();
  }

  return null;
}
