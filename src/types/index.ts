export type Service = {
  id: string;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
  created_at: string;
};

export type Appointment = {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  service_id: string;
  appointment_date: string; // YYYY-MM-DD format
  start_time: string; // HH:mm:ss format
  end_time: string; // HH:mm:ss format
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string | null;
  created_at: string;
};

export type BusinessHours = {
  id: string;
  weekday: number; // 0 = Sunday, 1 = Monday, etc.
  is_open: boolean;
  start_time: string | null; // HH:mm:ss
  end_time: string | null; // HH:mm:ss
};

export type BlockedDate = {
  id: string;
  blocked_date: string; // YYYY-MM-DD
  reason: string | null;
  created_at: string;
};

export type ClinicSettings = {
  id: string;
  clinic_name: string;
  clinic_email: string;
  clinic_phone: string;
  clinic_address: string;
  slot_interval_minutes: number;
  booking_notice_hours: number;
  created_at: string;
};

// Normalized slot structure as requested
export type AvailableSlot = {
  start: Date;
  end: Date;
  label: string;
};
