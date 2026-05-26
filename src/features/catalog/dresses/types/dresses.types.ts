export type DressItem = {
  id: number;
  code: string;
  name: string;
  category: string;
  branch: string;
  status: "ready" | "reserved" | "maintenance";
};
