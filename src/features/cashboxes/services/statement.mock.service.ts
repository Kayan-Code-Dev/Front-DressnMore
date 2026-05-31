import type { ApiSuccess } from "@/shared/types/api";
import type {
  BranchSummary,
  LedgerEntry,
  StatementFilterParams,
  StatementSummary,
} from "@/features/cashboxes/types/statement.types";
import {
  branchSummariesFixture,
  filterLedgerEntries,
  ledgerEntriesFixture,
  computeStatementSummary,
} from "@/features/cashboxes/mocks/statement.mock";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function listLedgerEntriesMock(
  params: StatementFilterParams = {},
): Promise<ApiSuccess<LedgerEntry[]>> {
  await delay(240);
  const data = filterLedgerEntries(ledgerEntriesFixture, params);
  return { success: true, message: "Success", data, meta: { total: data.length } };
}

export async function getStatementSummaryMock(
  params: StatementFilterParams = {},
): Promise<ApiSuccess<StatementSummary>> {
  await delay(160);
  const entries = filterLedgerEntries(ledgerEntriesFixture, params);
  return { success: true, message: "Success", data: computeStatementSummary(entries) };
}

export async function getBranchSummariesMock(): Promise<ApiSuccess<BranchSummary[]>> {
  await delay(140);
  return { success: true, message: "Success", data: branchSummariesFixture };
}
