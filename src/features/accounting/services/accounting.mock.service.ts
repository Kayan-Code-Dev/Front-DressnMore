import type { ApiSuccess } from "@/shared/types/api";
import type { AccountingSummary, LedgerEntry, TreasuryEntry } from "@/features/accounting/types/accounting.types";
import {
  accountingLedgerFixture,
  accountingSummaryFixture,
  treasuryEntriesFixture,
} from "@/features/accounting/mocks/accounting.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function getAccountingSummaryMock(): Promise<ApiSuccess<AccountingSummary>> {
  await delay(180);
  return {
    success: true,
    message: "Success",
    data: accountingSummaryFixture,
    meta: null,
  };
}

export async function listLedgerMock(search = ""): Promise<ApiSuccess<LedgerEntry[]>> {
  await delay(200);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? accountingLedgerFixture.filter((item) =>
        `${item.reference} ${item.description} ${item.type}`.toLowerCase().includes(normalized)
      )
    : accountingLedgerFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: {
      total: data.length,
    },
  };
}

export async function listTreasuryEntriesMock(search = ""): Promise<ApiSuccess<TreasuryEntry[]>> {
  await delay(210);
  const normalized = search.trim().toLowerCase();
  const data = normalized
    ? treasuryEntriesFixture.filter((item) =>
        `${item.entry_number} ${item.account} ${item.description} ${item.created_by}`
          .toLowerCase()
          .includes(normalized)
      )
    : treasuryEntriesFixture;

  return {
    success: true,
    message: "Success",
    data,
    meta: { total: data.length },
  };
}
