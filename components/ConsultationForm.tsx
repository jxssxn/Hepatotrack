
import React, { useState, useEffect } from 'react';
import { X, Scale, Activity, Waves } from 'lucide-react';
import { Consultation } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ConsultationFormProps {
  patientId: string;
  patientDateOfBirth: string;
  onClose: () => void;
  onSave: (consultation: Consultation) => void;
}

const ConsultationForm: React.FC<ConsultationFormProps> = ({ patientId, patientDateOfBirth, onClose, onSave }) => {
  const [activeSection, setActiveSection] = useState<'general' | 'labs' | 'fibro'>('general');
  const [formData, setFormData] = useState<Partial<Consultation>>({
    date: new Date().toISOString().split('T')[0],
    weight: 0,
    height: 0,
    bmi: 0,
    ast: 0,
    alt: 0,
    platelets: 0,
    stiffness: 0,
    cap: 0,
    fib4: 0,
  });

  const calculateAge = (dob: string, consultDate: string) => {
    const birthDate = new Date(dob);
    const date = new Date(consultDate);
    let age = date.getFullYear() - birthDate.getFullYear();
    const m = date.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && date.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
  };

  const handleChange = (field: keyof Consultation, value: string | number) => {
    let newVal = value;
    if (typeof value === 'string' && field !== 'date' && field !== 'notes') {
        newVal = parseFloat(value) || 0;
    }

    setFormData(prev => {
      const updated = { ...prev, [field]: newVal };

      // Auto calc BMI
      if ((field === 'weight' || field === 'height') && updated.weight && updated.height) {
        const hMeters = updated.height as number / 100;
        updated.bmi = parseFloat((updated.weight as number / (hMeters * hMeters)).toFixed(1));
      }

      // Auto calc FIB-4
      // Formula: (Age * AST) / (Platelets * sqrt(ALT))
      if (field === 'ast' || field === 'alt' || field === 'platelets' || field === 'date') {
        const age = calculateAge(patientDateOfBirth, updated.date as string);
        if (updated.ast && updated.alt && updated.platelets && age > 0) {
            const fib4Val = (age * (updated.ast as number)) / ((updated.platelets as number) * Math.sqrt(updated.alt as number));
            updated.fib4 = parseFloat(fib4Val.toFixed(2));
        } else {
            updated.fib4 = 0;
        }
      }

      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.weight || !formData.stiffness) {
      alert("Peso y Rigidez (kPa) son campos obligatorios para el seguimiento básico.");
      return;
    }

    const newConsultation: Consultation = {
      id: uuidv4(),
      patientId,
      ...(formData as Consultation) // Casting since we enforce basic fields validation or defaults
    };
    onSave(newConsultation);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <h3 className="text-lg font-semibold text-slate-800">Registrar Consulta / Seguimiento</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 shrink-0">
          <button
            onClick={() => setActiveSection('general')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${activeSection === 'general' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Scale size={16} className="mr-2" /> Antropometría
          </button>
          <button
            onClick={() => setActiveSection('labs')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${activeSection === 'labs' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Activity size={16} className="mr-2" /> Laboratorio
          </button>
          <button
            onClick={() => setActiveSection('fibro')}
            className={`flex-1 py-3 text-sm font-medium flex items-center justify-center ${activeSection === 'fibro' ? 'text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50' : 'text-slate-500 hover:text-slate-700'}`}
          >
            <Waves size={16} className="mr-2" /> Elastografía
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1">
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Consulta</label>
            <input 
              type="date" 
              required
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.date}
              onChange={e => handleChange('date', e.target.value)}
            />
          </div>

          {activeSection === 'general' && (
            <div className="grid grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Peso (kg)</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.weight || ''} onChange={e => handleChange('weight', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Altura (cm)</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.height || ''} onChange={e => handleChange('height', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">IMC (Calc)</label>
                <input type="number" disabled className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-slate-500" value={formData.bmi || ''} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">% Grasa Corporal</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.fatPercentage || ''} onChange={e => handleChange('fatPercentage', e.target.value)} />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Masa Muscular (kg)</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.muscleMass || ''} onChange={e => handleChange('muscleMass', e.target.value)} />
              </div>
            </div>
          )}

          {activeSection === 'labs' && (
             <div className="grid grid-cols-2 gap-4 animate-fadeIn">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">AST (U/L)</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.ast || ''} onChange={e => handleChange('ast', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">ALT (U/L)</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.alt || ''} onChange={e => handleChange('alt', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Plaquetas (10³/µL)</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.platelets || ''} onChange={e => handleChange('platelets', e.target.value)} />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">GGT (U/L)</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.ggt || ''} onChange={e => handleChange('ggt', e.target.value)} />
              </div>
               <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bilirrubina T. (mg/dL)</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.bilirubinTotal || ''} onChange={e => handleChange('bilirubinTotal', e.target.value)} />
              </div>
              
              {/* FIB-4 Auto-calc Display */}
              <div className="col-span-2 mt-2">
                <div className="bg-indigo-50 border border-indigo-100 p-3 rounded-md flex items-center justify-between">
                    <div>
                        <span className="block text-xs text-indigo-800 font-bold uppercase">FIB-4 Score (Calc)</span>
                        <span className="text-xs text-indigo-600">(Edad × AST) / (Plaquetas × √ALT)</span>
                    </div>
                    <div className="text-2xl font-bold text-indigo-700">
                        {formData.fib4 || '0.00'}
                    </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === 'fibro' && (
             <div className="grid grid-cols-2 gap-4 animate-fadeIn">
              <div className="col-span-2 p-3 bg-blue-50 border border-blue-100 rounded-md mb-2">
                  <p className="text-xs text-blue-800">Ingrese valores de FibroScan / Elastografía de Transición.</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Rigidez (kPa)</label>
                <input type="number" step="0.1" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.stiffness || ''} onChange={e => handleChange('stiffness', e.target.value)} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">CAP (dB/m)</label>
                <input type="number" className="w-full px-3 py-2 border border-slate-300 rounded-md" value={formData.cap || ''} onChange={e => handleChange('cap', e.target.value)} />
              </div>
            </div>
          )}
          
          <div className="mt-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notas Clínicas</label>
            <textarea 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                rows={3}
                value={formData.notes || ''}
                onChange={e => handleChange('notes', e.target.value)}
            />
          </div>
        </form>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end space-x-3 shrink-0">
          <button 
            type="button" 
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
          >
            Cancelar
          </button>
          <button 
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 shadow-sm"
          >
            Guardar Consulta
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConsultationForm;
