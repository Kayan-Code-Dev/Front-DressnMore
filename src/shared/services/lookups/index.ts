import { resolveService } from "@/config/feature-flags";
import * as mock from "./lookups.mock.service";
import * as api from "./lookups.api.service";

const service = resolveService("lookups", mock, api);

export const fetchLookups = service.fetchLookups;

export type { LookupOption, LookupsData } from "./lookups.types";
