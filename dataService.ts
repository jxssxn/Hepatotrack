
import { Patient, Consultation } from '../types';
import { MOCK_PATIENTS, INITIAL_CONSULTATIONS } from '../constants';

const PATIENTS_KEY = 'hepatotrack_patients';
const CONSULTATIONS_KEY = 'hepatotrack_consultations';

export const getPatients = (): Patient[] => {
  const stored = localStorage.getItem(PATIENTS_KEY);
  if (!stored) {
    // Initialize with mock data
    localStorage.setItem(PATIENTS_KEY, JSON.stringify(MOCK_PATIENTS));
    return [...MOCK_PATIENTS]; // Return writable copy
  }
  return JSON.parse(stored);
};

export const savePatient = (patient: Patient): void => {
  const patients = getPatients();
  patients.push(patient);
  localStorage.setItem(PATIENTS_KEY, JSON.stringify(patients));
};

export const getConsultations = (patientId: string): Consultation[] => {
  const stored = localStorage.getItem(CONSULTATIONS_KEY);
  let allConsultations: Consultation[] = [];
  
  if (!stored) {
    allConsultations = [...INITIAL_CONSULTATIONS]; // Return writable copy
    localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(allConsultations));
  } else {
    allConsultations = JSON.parse(stored);
  }

  return allConsultations
    .filter(c => c.patientId === patientId)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};

export const saveConsultation = (consultation: Consultation): void => {
  const stored = localStorage.getItem(CONSULTATIONS_KEY);
  const consultations = stored ? JSON.parse(stored) : [...INITIAL_CONSULTATIONS];
  consultations.push(consultation);
  localStorage.setItem(CONSULTATIONS_KEY, JSON.stringify(consultations));
};

export const exportDatabaseToCSV = (): void => {
  const patients = getPatients();
  // Get raw all consultations to avoid filtering by patient one by one inefficiently
  const storedCons = localStorage.getItem(CONSULTATIONS_KEY);
  const allConsultations: Consultation[] = storedCons ? JSON.parse(storedCons) : [...INITIAL_CONSULTATIONS];

  // Define headers
  const headers = [
    'PatientID', 'MRN', 'Nombre', 'Apellido', 'Genero', 'FechaNacimiento', 'Diagnostico',
    'ConsultaID', 'FechaConsulta', 'Peso(kg)', 'Altura(cm)', 'IMC', 'Grasa(%)', 'MasaMuscular(kg)',
    'AST', 'ALT', 'GGT', 'Plaquetas', 'FIB-4', 'BilirrubinaT',
    'Rigidez(kPa)', 'CAP(dB/m)', 'Notas'
  ];

  const rows: string[] = [];
  rows.push(headers.join(','));

  patients.forEach(p => {
    const pConsults = allConsultations.filter(c => c.patientId === p.id);
    
    if (pConsults.length === 0) {
      // Patient with no consultations
      const row = [
        p.id, p.mrn, p.firstName, p.lastName, p.gender, p.dateOfBirth, p.diagnosis,
        '', '', '', '', '', '', '',
        '', '', '', '', '', '',
        '', '', ''
      ];
      rows.push(row.map(val => `"${val || ''}"`).join(','));
    } else {
      // Patient with consultations
      pConsults.forEach(c => {
        const row = [
          p.id, p.mrn, p.firstName, p.lastName, p.gender, p.dateOfBirth, p.diagnosis,
          c.id, c.date, c.weight, c.height, c.bmi, c.fatPercentage, c.muscleMass,
          c.ast, c.alt, c.ggt, c.platelets, c.fib4, c.bilirubinTotal,
          c.stiffness, c.cap, c.notes
        ];
        rows.push(row.map(val => `"${val !== undefined && val !== null ? val : ''}"`).join(','));
      });
    }
  });

  // Create BOM for Excel to read UTF-8 correctly
  const csvContent = '\uFEFF' + rows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `HepatoTrack_Export_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
