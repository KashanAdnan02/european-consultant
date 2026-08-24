export type ServiceRow = {
  id: string;
  country: string;
  slug: string;
  title: string;
  flag: string;
  text: string;
  type: string;
  jobs: string;
  salary: string;
  accommodation: string;
  medical_insurance: string;
  document_requirements: string;
  process_time: string;
  cost: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type ServiceInsert = Omit<
  ServiceRow,
  "id" | "created_at" | "updated_at"
>;

export type AppointmentPriceRow = {
  id: number;
  amount: number;
  currency: string;
  description: string;
  updated_at: string;
};

export type AppointmentServiceRow = {
  id: string;
  name: string;
  flag_image: string;
  description: string;
  sort_order: number;
  is_published: boolean;
  created_at: string;
  updated_at: string;
};

export type AppointmentServiceInsert = Omit<
  AppointmentServiceRow,
  "id" | "created_at" | "updated_at"
>;

export type AdminSession = {
  userId: string;
  email: string;
  isAdmin: boolean;
};
