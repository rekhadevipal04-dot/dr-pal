export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'patient';
  avatar?: string;
  bloodGroup?: string;
  allergies?: string;
  medicalNotes?: string;
  createdAt: string;
}

export interface Appointment {
  id: string;
  patientId?: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  service: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  doctorNotes?: string;
  estimatedCost: number;
  paid: boolean;
  createdAt: string;
}

export interface PrescriptionItem {
  medicine: string;
  dosage: string;
  duration: string;
}

export interface DentalRecord {
  id: string;
  patientId: string;
  patientName: string;
  procedure: string;
  toothNumbers: string[];
  diagnosis: string;
  date: string;
  doctorName: string;
  prescriptions: PrescriptionItem[];
  cost: number;
  notes?: string;
}

export interface ToothCondition {
  number: number;
  status: 'healthy' | 'cavity' | 'treated' | 'crown' | 'implant' | 'missing';
  notes?: string;
}

export interface DentalService {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  category: string;
  badge?: string;
  icon: string;
}

export interface ClinicStats {
  totalPatients: number;
  totalAppointments: number;
  pendingAppointments: number;
  confirmedAppointments: number;
  completedAppointments: number;
  totalRevenue: number;
  serviceCounts: Record<string, number>;
  recentAppointments: Appointment[];
}
