export type CustomerItem = {
  id: number;
  name: string;
  phone: string;
  city: string;
  status: "active" | "vip" | "inactive";
  joined_at: string;
};
