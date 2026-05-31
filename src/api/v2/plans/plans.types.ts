export type TPublicPlan = {
  id: number;
  title: string;
  description: string | null;
  days: number;
  price: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type TPaginationLink = {
  url: string | null;
  label: string;
  page: number | null;
  active: boolean;
};

export type TOrderPlanRequest = {
  name: string;
  email: string;
  phone: string;
  plan_id: number;
};

export type TPlansPaginatedResponse = {
  current_page: number;
  data: TPublicPlan[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  links: TPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
};
