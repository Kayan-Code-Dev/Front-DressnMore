import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { Dialog } from "@/shared/ui/dialog";
import { Button } from "@/shared/ui/button";
import { FormField } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { isModuleLive } from "@/config/feature-flags";
import type { BranchItem } from "@/features/branches/types/branches.types";
import { listBranchesMock } from "@/features/branches/services/branches.mock.service";
import {
  createBranch,
  deleteBranch,
  listBranches,
  updateBranch,
} from "@/features/branches/services/branches.api.service";

function fetchBranchData(searchTerm: string, currentPage: number) {
  if (isModuleLive("branches")) {
    return listBranches({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listBranchesMock(searchTerm);
}

function formatVat(item: BranchItem): string {
  if (!item.vat_enabled) return "—";
  if (item.vat_value != null) return `${item.vat_value}%`;
  return "Enabled";
}

type BranchFormState = {
  branch_code: string;
  name: string;
  phone: string;
  address: string;
  inventory_name: string;
  currency: string;
  status: "active" | "inactive";
};

const emptyForm = (): BranchFormState => ({
  branch_code: "",
  name: "",
  phone: "",
  address: "",
  inventory_name: "",
  currency: "",
  status: "active",
});

export function BranchesPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<BranchItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [dialog, setDialog] = useState<null | "create" | "edit" | "delete">(null);
  const [selected, setSelected] = useState<BranchItem | null>(null);
  const [form, setForm] = useState<BranchFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchBranchData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load branches");
        setRows([]);
      })
      .finally(() => setLoading(false));
  }, [search, page]);

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  const handlePageChange = (nextPage: number) => {
    setPage(nextPage);
  };

  useEffect(() => {
    loadRows();
  }, [loadRows, reloadKey]);

  const openCreate = () => {
    setForm(emptyForm());
    setFormError(null);
    setSelected(null);
    setDialog("create");
  };

  const openEdit = (item: BranchItem) => {
    setSelected(item);
    setForm({
      branch_code: item.branch_code ?? "",
      name: item.name,
      phone: item.phone ?? "",
      address: item.address ?? "",
      inventory_name: item.inventory_name ?? "",
      currency: item.currency ?? "",
      status: item.status,
    });
    setFormError(null);
    setDialog("edit");
  };

  const openDelete = (item: BranchItem) => {
    setSelected(item);
    setFormError(null);
    setDialog("delete");
  };

  const closeDialog = () => {
    if (saving) return;
    setDialog(null);
    setSelected(null);
    setFormError(null);
  };

  const toPayload = () => ({
    branch_code: form.branch_code.trim() || null,
    name: form.name.trim(),
    phone: form.phone.trim() || null,
    address: form.address.trim() || null,
    inventory_name: form.inventory_name.trim() || null,
    currency: form.currency.trim() || null,
    status: form.status,
  });

  const handleSave = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isModuleLive("branches")) return;

    setSaving(true);
    setFormError(null);

    try {
      if (dialog === "create") {
        await createBranch(toPayload());
      } else if (dialog === "edit" && selected) {
        await updateBranch(selected.id, toPayload());
      }
      closeDialog();
      setReloadKey((value) => value + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to save branch");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!isModuleLive("branches") || !selected) return;

    setSaving(true);
    setFormError(null);

    try {
      await deleteBranch(selected.id);
      closeDialog();
      setReloadKey((value) => value + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to delete branch");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<DataTableColumn<BranchItem>[]>(
    () => [
      { key: "branch_code", title: "Branch Code" },
      { key: "name", title: "Name" },
      { key: "phone", title: "Phone", render: (item) => item.phone ?? "—" },
      { key: "address", title: "Address", render: (item) => item.address ?? "—" },
      { key: "inventory_name", title: "Inventory", render: (item) => item.inventory_name ?? "—" },
      { key: "currency", title: "Currency", render: (item) => item.currency ?? "—" },
      { key: "vat", title: "VAT", render: (item) => formatVat(item) },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      {
        key: "actions",
        title: "Actions",
        render: (item) => (
          <div className="row-actions">
            <Button variant="secondary" disabled={!isModuleLive("branches")} onClick={() => openEdit(item)}>
              Edit
            </Button>
            <Button variant="secondary" disabled={!isModuleLive("branches")} onClick={() => openDelete(item)}>
              Delete
            </Button>
          </div>
        ),
      },
    ],
    []
  );

  const formFields = (
    <>
      <FormField htmlFor="branch-code" label="Branch code">
        <Input
          id="branch-code"
          value={form.branch_code}
          onChange={(event) => setForm((prev) => ({ ...prev, branch_code: event.target.value }))}
        />
      </FormField>

      <FormField htmlFor="branch-name" label="Name">
        <Input
          id="branch-name"
          value={form.name}
          onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
          required
        />
      </FormField>

      <FormField htmlFor="branch-phone" label="Phone">
        <Input
          id="branch-phone"
          value={form.phone}
          onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
        />
      </FormField>

      <FormField htmlFor="branch-address" label="Address">
        <Input
          id="branch-address"
          value={form.address}
          onChange={(event) => setForm((prev) => ({ ...prev, address: event.target.value }))}
        />
      </FormField>

      <FormField htmlFor="branch-inventory" label="Inventory name">
        <Input
          id="branch-inventory"
          value={form.inventory_name}
          onChange={(event) => setForm((prev) => ({ ...prev, inventory_name: event.target.value }))}
        />
      </FormField>

      <FormField htmlFor="branch-currency" label="Currency">
        <Input
          id="branch-currency"
          value={form.currency}
          onChange={(event) => setForm((prev) => ({ ...prev, currency: event.target.value }))}
        />
      </FormField>

      <FormField htmlFor="branch-status" label="Status">
        <Select
          id="branch-status"
          value={form.status}
          onChange={(event) =>
            setForm((prev) => ({ ...prev, status: event.target.value as "active" | "inactive" }))
          }
        >
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </FormField>
    </>
  );

  return (
    <section>
      <div className="page-title">
        <h2>Branches</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search branches"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Filters (TODO)
            </Button>
            <Button disabled={!isModuleLive("branches")} onClick={openCreate}>
              Create Branch
            </Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No branches"
        emptyDescription="No branch matches current search."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}

      <Dialog
        open={dialog === "create" || dialog === "edit"}
        title={dialog === "edit" ? "Edit branch" : "Create branch"}
        onClose={closeDialog}
        footer={
          <>
            <Button variant="secondary" disabled={saving} onClick={closeDialog}>
              Cancel
            </Button>
            <Button type="submit" form="branch-form" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form id="branch-form" onSubmit={handleSave}>
          {formFields}
          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      </Dialog>

      <Dialog
        open={dialog === "delete"}
        title="Delete branch"
        onClose={closeDialog}
        footer={
          <>
            <Button variant="secondary" disabled={saving} onClick={closeDialog}>
              Cancel
            </Button>
            <Button disabled={saving} onClick={handleDelete}>
              {saving ? "Deleting..." : "Delete"}
            </Button>
          </>
        }
      >
        <p>
          Delete branch <strong>{selected?.name}</strong>? This action cannot be undone.
        </p>
        {formError ? <p className="form-error">{formError}</p> : null}
      </Dialog>
    </section>
  );
}
