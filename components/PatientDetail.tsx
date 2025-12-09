
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, FileText, BrainCircuit, AlertCircle } from 'lucide-react';
import { Patient, Consultation } from '../types';
import { getConsultations, saveConsultation } from '../services/dataService';
import { analyzePatientEvolution } from '../services/geminiService';
import ConsultationForm from './ConsultationForm';
import EvolutionChart from './EvolutionChart';
import BMIChart from './BMIChart';
import Fib4Chart from './Fib4Chart';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack }) => {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<string | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    setConsultations(getConsultations(patient.id));
  }, [patient.id]);

  const handleSaveConsultation = (newCons: Consultation) => {
    saveConsultation(newCons);
    setConsultations(getConsultations(patient.id));
  };

  const handleAiAnalysis = async () => {
    if (consultations.length < 2) {
        alert("Se necesitan al menos 2 consultas para analizar la evolución.");
        return;
    }
    setLoadingAi(true);
    setAiAnalysis(null);
    try {
        const result = await analyzePatientEvolution(patient, consultations);
        setAiAnalysis(result);
    } catch(e) {
        setAiAnalysis("Error al generar análisis.");
    } finally {
        setLoadingAi(false);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{patient.firstName} {patient.lastName}</h1>
            <div className="flex items-center text-sm text-slate-500 space-x-4">
              <span>{patient.mrn}</span>
              <span>•</span>
              <span>{new Date().getFullYear() - new Date(patient.dateOfBirth).getFullYear()} años</span>
              <span>•</span>
              <span className="text-emerald-600 font-medium">{patient.diagnosis}</span>
            </div>
          </div>
        </div>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="flex items-center justify-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
        >
          <Plus size={18} className="mr-2" /> Nueva Consulta
        </button>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Charts */}
        <div className="lg:col-span-2 space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <EvolutionChart 
                consultations={consultations} 
                metricKey={['stiffness', 'cap']} 
                title="Evolución de Fibrosis (kPa) y Esteatosis (CAP)"
                colors={['#ef4444', '#f59e0b']}
             />
             <EvolutionChart 
                consultations={consultations} 
                metricKey={['alt', 'ast']} 
                title="Función Hepática (U/L)"
                colors={['#3b82f6', '#8b5cf6']}
             />
             <Fib4Chart consultations={consultations} />
             <EvolutionChart 
                consultations={consultations} 
                metricKey="weight" 
                title="Tendencia de Peso (kg)"
                colors={['#10b981']}
             />
             <BMIChart consultations={consultations} />
           </div>

           {/* AI Analysis Section */}
           <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl border border-indigo-100 p-6">
              <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                      <BrainCircuit className="text-indigo-600" size={24} />
                      <h3 className="text-lg font-semibold text-indigo-900">Análisis Evolutivo IA</h3>
                  </div>
                  <button 
                    onClick={handleAiAnalysis}
                    disabled={loadingAi || consultations.length < 2}
                    className="text-xs px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-md hover:bg-indigo-100 disabled:opacity-50"
                  >
                    {loadingAi ? 'Analizando...' : 'Generar Análisis'}
                  </button>
              </div>
              
              {aiAnalysis ? (
                  <div className="prose prose-sm text-indigo-900 max-w-none bg-white/60 p-4 rounded-lg">
                      <p className="whitespace-pre-line leading-relaxed">{aiAnalysis}</p>
                  </div>
              ) : (
                  <div className="text-center py-6 text-indigo-400 text-sm">
                      {consultations.length < 2 
                        ? "Se requieren mínimo 2 consultas para generar una curva evolutiva." 
                        : "Haz clic en 'Generar Análisis' para obtener un resumen clínico basado en IA."}
                  </div>
              )}
           </div>
        </div>

        {/* Right Col: History List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex flex-col h-[800px]">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 flex items-center">
              <FileText size={18} className="mr-2 text-slate-400" /> Historial Clínico
            </h3>
            <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-full">{consultations.length} registros</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {consultations.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">No hay consultas registradas.</div>
            ) : (
                [...consultations].reverse().map((cons) => (
                    <div key={cons.id} className="relative pl-4 border-l-2 border-slate-200 hover:border-emerald-400 transition-colors pb-4 last:pb-0">
                        <div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-slate-300 ring-4 ring-white"></div>
                        <div className="text-sm text-slate-500 mb-1">{new Date(cons.date).toLocaleDateString('es-MX', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</div>
                        <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 space-y-2">
                             <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Peso</span>
                                    <div className="font-medium text-slate-700">{cons.weight} kg</div>
                                </div>
                                <div>
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">Fibrosis</span>
                                    <div className="font-medium text-slate-700">{cons.stiffness} kPa</div>
                                </div>
                             </div>
                             {cons.fib4 !== undefined && (
                                <div className="mt-1 pt-1 border-t border-slate-200 flex justify-between items-center">
                                    <span className="text-xs text-slate-400 uppercase tracking-wider">FIB-4</span>
                                    <div className={`font-bold text-xs px-2 py-0.5 rounded-full ${
                                        cons.fib4 < 1.45 ? 'bg-green-100 text-green-700' :
                                        cons.fib4 > 3.25 ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {cons.fib4}
                                    </div>
                                </div>
                             )}
                             {cons.notes && (
                                 <p className="text-xs text-slate-600 italic border-t border-slate-200 pt-2 mt-2">
                                     "{cons.notes}"
                                 </p>
                             )}
                        </div>
                    </div>
                ))
            )}
          </div>
        </div>
      </div>

      {isFormOpen && (
        <ConsultationForm 
            patientId={patient.id}
            patientDateOfBirth={patient.dateOfBirth}
            onClose={() => setIsFormOpen(false)}
            onSave={handleSaveConsultation}
        />
      )}
    </div>
  );
};

export default PatientDetail;
