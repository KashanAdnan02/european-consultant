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

export type ServiceUpdate = Partial<ServiceInsert>;

export type AppointmentPriceRow = {
  id: number;
  amount: number;
  currency: string;
  description: string;
  updated_at: string;
};

export type AppointmentPriceUpdate = Partial<
  Omit<AppointmentPriceRow, "id" | "updated_at">
>;

export type AdminRow = {
  user_id: string;
  email: string;
  created_at: string;
};

export type Database = {
  public: {
    Tables: {
      services: {
        Row: ServiceRow;
        Insert: ServiceInsert;
        Update: ServiceUpdate;
        Relationships: [];
      };
      appointment_price: {
        Row: AppointmentPriceRow;
        Insert: AppointmentPriceRow;
        Update: AppointmentPriceUpdate;
        Relationships: [];
      };
      admins: {
        Row: AdminRow;
        Insert: Omit<AdminRow, "created_at">;
        Update: Partial<AdminRow>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
