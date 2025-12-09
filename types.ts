
export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'M' | 'F' | 'Other';
  diagnosis: string;
  createdAt: string;
}

export interface Consultation {
  id: string;
  patientId: string;
  date: string;
  notes?: string;
  
  // Anthropometry & Body Comp
  weight: number; // kg
  height: number; // cm
  bmi: number;
  muscleMass?: number; // kg
  fatPercentage?: number; // %
  visceralFat?: number; // level

  // Labs (Liver Profile)
  ast: number; // U/L
  alt: number; // U/L
  ggt?: number; // U/L
  bilirubinTotal?: number; // mg/dL
  albumin?: number; // g/dL
  platelets: number; // 10^3/uL
  inr?: number;
  fib4?: number; // Calculated Score

  // Elastography (FibroScan)
  stiffness: number; // kPa
  cap?: number; // dB/m (Steatosis)
  iqr?: number; // %
}

export type MedicalCategory = 'general' | 'labs' | 'elastography';

export interface ChartDataPoint {
  date: string;
  [key: string]: number | string;
}
