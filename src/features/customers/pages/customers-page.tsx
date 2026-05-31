import { useCallback, useEffect, useMemo, useState } from "react";
import type { FormEvent } from "react";
import { SearchFiltersBar } from "@/shared/components/filters/search-filters-bar";
import { DataTable, type DataTableColumn } from "@/shared/components/data-table/data-table";
import { Pagination } from "@/shared/components/data-table/pagination";
import { Button } from "@/shared/ui/button";
import { Dialog } from "@/shared/ui/dialog";
import { FormField } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Select } from "@/shared/ui/select";
import { isModuleLive } from "@/config/feature-flags";
import { listCustomersMock } from "@/features/customers/services/customers.mock.service";
import { createCustomer, listCustomers } from "@/features/customers/services/customers.api.service";
import type { CustomerItem } from "@/features/customers/types/customers.types";

function fetchCustomerData(searchTerm: string, currentPage: number) {
  if (isModuleLive("customers")) {
    return listCustomers({ search: searchTerm, page: currentPage, per_page: 15 });
  }
  return listCustomersMock(searchTerm);
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString();
}

export function CustomersPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState<CustomerItem[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [reloadKey, setReloadKey] = useState(0);
  const [createOpen, setCreateOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");

  const loadRows = useCallback(() => {
    setLoading(true);
    fetchCustomerData(search, page)
      .then((response) => {
        setRows(response.data);
        const meta = response.meta as { last_page?: number } | null | undefined;
        setTotalPages(meta?.last_page ?? 1);
        setError(null);
      })
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Failed to load customers");
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

  const resetForm = () => {
    setName("");
    setPhone("");
    setEmail("");
    setStatus("active");
    setFormError(null);
  };

  const handleCreate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isModuleLive("customers")) return;

    setSaving(true);
    setFormError(null);

    try {
      await createCustomer({
        name: name.trim(),
        phone: phone.trim() || null,
        email: email.trim() || null,
        status,
      });
      setCreateOpen(false);
      resetForm();
      setReloadKey((value) => value + 1);
    } catch (err: unknown) {
      setFormError(err instanceof Error ? err.message : "Failed to create customer");
    } finally {
      setSaving(false);
    }
  };

  const columns = useMemo<DataTableColumn<CustomerItem>[]>(
    () => [
      { key: "name", title: "Customer" },
      { key: "phone", title: "Phone", render: (item) => item.phone ?? "—" },
      { key: "email", title: "Email", render: (item) => item.email ?? "—" },
      {
        key: "status",
        title: "Status",
        render: (item) => <span className={`pill pill-${item.status}`}>{item.status}</span>,
      },
      {
        key: "created_at",
        title: "Created",
        render: (item) => formatDate(item.created_at),
      },
    ],
    []
  );

  return (
    <section>
      <div className="page-title">
        <h2>Customers</h2>
      </div>

      <SearchFiltersBar
        search={search}
        onSearchChange={handleSearchChange}
        searchPlaceholder="Search customers"
        rightSlot={
          <>
            <Button variant="secondary" disabled>
              Filters (TODO)
            </Button>
            <Button
              disabled={!isModuleLive("customers")}
              onClick={() => {
                resetForm();
                setCreateOpen(true);
              }}
            >
              Create customer
            </Button>
          </>
        }
      />

      {error ? <p className="form-error">{error}</p> : null}

      <DataTable
        columns={columns}
        rows={rows}
        loading={loading}
        emptyTitle="No customers"
        emptyDescription="Try changing the search term."
        rowKey={(row) => String(row.id)}
      />

      {!loading && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onPageChange={handlePageChange} />
      ) : null}

      <Dialog
        open={createOpen}
        title="Create customer"
        onClose={() => {
          if (!saving) setCreateOpen(false);
        }}
        footer={
          <>
            <Button variant="secondary" disabled={saving} onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" form="create-customer-form" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      >
        <form id="create-customer-form" onSubmit={handleCreate}>
          <FormField htmlFor="customer-name" label="Name">
            <Input
              id="customer-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
            />
          </FormField>

          <FormField htmlFor="customer-phone" label="Phone">
            <Input
              id="customer-phone"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
            />
          </FormField>

          <FormField htmlFor="customer-email" label="Email">
            <Input
              id="customer-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </FormField>

          <FormField htmlFor="customer-status" label="Status">
            <Select
              id="customer-status"
              value={status}
              onChange={(event) => setStatus(event.target.value as "active" | "inactive")}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Select>
          </FormField>

          {formError ? <p className="form-error">{formError}</p> : null}
        </form>
      </Dialog>
    </section>
  );
}
