export type CustomerItem = {
  id: number;
  name: string;
  phone: string;
  city: string;
  status: "active" | "vip" | "inactive";
  joined_at: string;
};

export type CustomerFilterParams = {
  id?: number;
  source?: string;
  status?: string;
  date_of_birth_from?: string;
  date_of_birth_to?: string;
};
