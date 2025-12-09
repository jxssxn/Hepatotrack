import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Patient } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface PatientFormProps {
  onClose: () => void;
  onSave: (patient: Patient) => void;
}

const PatientForm: React.FC<PatientFormProps> = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    mrn: '',
    dateOfBirth: '',
    gender: 'M',
    diagnosis: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newPatient: Patient = {
      id: uuidv4(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      mrn: formData.mrn,
      dateOfBirth: formData.dateOfBirth,
      gender: formData.gender as 'M' | 'F' | 'Other',
      diagnosis: formData.diagnosis,
      createdAt: new Date().toISOString(),
    };
    onSave(newPatient);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-800">Registrar Nuevo Paciente</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
              <input 
                required
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.firstName}
                onChange={e => setFormData({...formData, firstName: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Apellidos</label>
              <input 
                required
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.lastName}
                onChange={e => setFormData({...formData, lastName: e.target.value})}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. Expediente (MRN)</label>
              <input 
                required
                type="text" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.mrn}
                onChange={e => setFormData({...formData, mrn: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Fecha de Nacimiento</label>
              <input 
                required
                type="date" 
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
                value={formData.dateOfBirth}
                onChange={e => setFormData({...formData, dateOfBirth: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Género</label>
            <select 
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.gender}
              onChange={e => setFormData({...formData, gender: e.target.value})}
            >
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
              <option value="Other">Otro</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Diagnóstico Principal</label>
            <input 
              required
              type="text" 
              placeholder="Ej. Esteatohepatitis, Cirrosis, Hepatitis B..."
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={formData.diagnosis}
              onChange={e => setFormData({...formData, diagnosis: e.target.value})}
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-md hover:bg-slate-50"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-md hover:bg-emerald-700 shadow-sm"
            >
              Guardar Paciente
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PatientForm;