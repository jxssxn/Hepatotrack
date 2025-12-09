import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import { Patient } from './types';
import { getPatients, savePatient, exportDatabaseToCSV, getConsultations } from './services/dataService';
import PatientForm from './components/PatientForm';
import PatientDetail from './components/PatientDetail';
import { Plus, Search, ChevronRight, Download, Database, FileSpreadsheet } from 'lucide-react';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'patients' | 'research'>('patients');
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [isPatientFormOpen, setIsPatientFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats for research tab
  const [stats, setStats] = useState({ totalPatients: 0, totalConsultations: 0 });

  useEffect(() => {
    const loadedPatients = getPatients();
    setPatients(loadedPatients);

    // Calc simple stats
    let consultCount = 0;
    loadedPatients.forEach(p => {
        consultCount += getConsultations(p.id).length;
    });
    setStats({
        totalPatients: loadedPatients.length,
        totalConsultations: consultCount
    });
  }, [activeTab]); // Refresh when tab changes

  const handleSavePatient = (newPatient: Patient) => {
    savePatient(newPatient);
    setPatients(getPatients());
  };

  const filteredPatients = patients.filter(p => 
    p.lastName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.mrn.includes(searchTerm)
  );

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {selectedPatient ? (
        <PatientDetail 
            patient={selectedPatient} 
            onBack={() => setSelectedPatient(null)} 
        />
      ) : activeTab === 'patients' ? (
        <div className="space-y-6 animate-fadeIn">
          {/* Dashboard Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Pacientes</h1>
              <p className="text-slate-500 text-sm mt-1">Gestión y seguimiento de cohortes hepatológicas.</p>
            </div>
            <button 
              onClick={() => setIsPatientFormOpen(true)}
              className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
            >
              <Plus size={18} className="mr-2" /> Nuevo Paciente
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, apellido o expediente..."
              className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 shadow-sm"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Patient List */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 border-b border-slate-200 font-medium text-slate-700">
                  <tr>
                    <th className="px-6 py-4">Paciente / MRN</th>
                    <th className="px-6 py-4">Diagnóstico</th>
                    <th className="px-6 py-4">Género</th>
                    <th className="px-6 py-4">Registro</th>
                    <th className="px-6 py-4 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredPatients.length > 0 ? (
                    filteredPatients.map((patient) => (
                      <tr 
                        key={patient.id} 
                        className="hover:bg-slate-50 transition-colors cursor-pointer group"
                        onClick={() => setSelectedPatient(patient)}
                      >
                        <td className="px-6 py-4">
                          <div className="font-semibold text-slate-900">{patient.firstName} {patient.lastName}</div>
                          <div className="text-xs text-slate-400">{patient.mrn}</div>
                        </td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                            {patient.diagnosis}
                          </span>
                        </td>
                         <td className="px-6 py-4">
                          {patient.gender === 'M' ? 'Masculino' : patient.gender === 'F' ? 'Femenino' : 'Otro'}
                        </td>
                        <td className="px-6 py-4 text-slate-400">
                          {new Date(patient.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <ChevronRight className="inline-block text-slate-300 group-hover:text-emerald-500" size={20} />
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                            No se encontraron pacientes.
                        </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* Research Tab */
        <div className="space-y-6 animate-fadeIn">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Módulo de Investigación</h1>
              <p className="text-slate-500 text-sm mt-1">Exportación de datos y estadísticas generales de la cohorte.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Stats Cards */}
                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Database size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Total Pacientes</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalPatients}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                        <FileSpreadsheet size={24} />
                    </div>
                    <div>
                        <p className="text-sm text-slate-500">Registros de Consulta</p>
                        <p className="text-2xl font-bold text-slate-800">{stats.totalConsultations}</p>
                    </div>
                </div>

                {/* Export Card */}
                <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 p-6 rounded-xl border border-emerald-600 shadow-md text-white flex flex-col justify-between">
                    <div>
                        <h3 className="text-lg font-bold flex items-center">
                            <Download className="mr-2" size={20} /> Exportar Datos
                        </h3>
                        <p className="text-emerald-100 text-sm mt-2 mb-4">
                            Descarga la base de datos completa en formato CSV compatible con Excel, SPSS y R.
                        </p>
                    </div>
                    <button 
                        onClick={exportDatabaseToCSV}
                        className="w-full py-2 bg-white text-emerald-700 font-semibold rounded-lg hover:bg-emerald-50 transition-colors shadow-sm"
                    >
                        Descargar .CSV
                    </button>
                </div>
            </div>

            {/* Info Section */}
            <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                <h3 className="font-semibold text-slate-800 mb-2">Estructura de Exportación</h3>
                <p className="text-sm text-slate-600 mb-4">
                    El archivo CSV generado contiene una fila por cada consulta médica realizada. Si un paciente no tiene consultas, aparecerá una sola fila con sus datos demográficos y campos médicos vacíos.
                </p>
                <div className="text-xs font-mono bg-slate-100 p-3 rounded text-slate-500 overflow-x-auto">
                    PatientID, MRN, Nombre, Apellido, Genero, FechaNacimiento, Diagnostico, ConsultaID, FechaConsulta, Peso, IMC, AST, ALT, Plaquetas, Rigidez...
                </div>
            </div>
        </div>
      )}

      {isPatientFormOpen && (
        <PatientForm 
            onClose={() => setIsPatientFormOpen(false)} 
            onSave={handleSavePatient} 
        />
      )}
    </Layout>
  );
};

export default App;