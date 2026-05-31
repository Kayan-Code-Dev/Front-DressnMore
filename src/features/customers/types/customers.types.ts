export type CustomerItem = {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  city_id: number | null;
  status: "active" | "inactive";
  created_at: string;
};

export type CustomerFilterParams = {
  id?: number;
  source?: string;
  status?: string;
  date_of_birth_from?: string;
  date_of_birth_to?: string;
};

export type CustomerPayload = {
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  city_id?: number | null;
  status?: "active" | "inactive";
  notes?: string | null;
};
