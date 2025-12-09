export const MOCK_PATIENTS = [
  {
    id: 'p1',
    mrn: 'HEP-2023-001',
    firstName: 'Carlos',
    lastName: 'Mendez',
    dateOfBirth: '1975-04-12',
    gender: 'M',
    diagnosis: 'NASH (Esteatohepatitis No Alcohólica)',
    createdAt: '2023-01-15T10:00:00Z',
  },
  {
    id: 'p2',
    mrn: 'HEP-2023-045',
    firstName: 'Maria',
    lastName: 'Gonzalez',
    dateOfBirth: '1982-08-23',
    gender: 'F',
    diagnosis: 'Hepatitis C Crónica',
    createdAt: '2023-03-10T09:30:00Z',
  }
] as const;

export const INITIAL_CONSULTATIONS = [
  {
    id: 'c1',
    patientId: 'p1',
    date: '2023-01-15',
    weight: 92,
    height: 175,
    bmi: 30.0,
    muscleMass: 38,
    fatPercentage: 32,
    ast: 85,
    alt: 110,
    platelets: 180,
    stiffness: 12.5,
    cap: 310,
    notes: 'Primera consulta. Paciente con sobrepeso y enzimas elevadas.'
  },
  {
    id: 'c2',
    patientId: 'p1',
    date: '2023-06-20',
    weight: 88,
    height: 175,
    bmi: 28.7,
    muscleMass: 38.5,
    fatPercentage: 30,
    ast: 60,
    alt: 75,
    platelets: 185,
    stiffness: 10.2,
    cap: 290,
    notes: 'Mejoría tras cambios en dieta.'
  },
  {
    id: 'c3',
    patientId: 'p1',
    date: '2023-12-05',
    weight: 85,
    height: 175,
    bmi: 27.7,
    muscleMass: 39,
    fatPercentage: 28,
    ast: 45,
    alt: 50,
    platelets: 190,
    stiffness: 8.5,
    cap: 260,
    notes: 'Respuesta sostenida. Fibrosis en descenso.'
  }
] as const;