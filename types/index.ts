export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  salonName: string;
  address: string;
}

export interface Appointment {
  id: string;
  clientName: string;
  clientPhone: string;
  service: string;
  date: string;
  time: string;
  price: number;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface MonthlyStats {
  month: string;
  totalAppointments: number;
  revenue: number;
}
