import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Consultation } from '../types';

interface EvolutionChartProps {
  consultations: Consultation[];
  metricKey: keyof Consultation | (keyof Consultation)[];
  title: string;
  colors: string[];
}

const EvolutionChart: React.FC<EvolutionChartProps> = ({ consultations, metricKey, title, colors }) => {
  if (consultations.length === 0) {
    return <div className="h-64 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg">Sin datos para mostrar</div>;
  }

  const data = consultations.map(c => ({
    date: new Date(c.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: '2-digit' }),
    fullDate: c.date,
    ...c
  }));

  const keys = Array.isArray(metricKey) ? metricKey : [metricKey];

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-700 mb-4">{title}</h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} />
            <YAxis stroke="#94a3b8" fontSize={12} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            {keys.map((k, i) => (
               <Line 
                key={String(k)}
                type="monotone" 
                dataKey={k as string} 
                stroke={colors[i % colors.length]} 
                strokeWidth={2}
                dot={{ r: 4, strokeWidth: 2 }}
                activeDot={{ r: 6 }}
                name={k === 'stiffness' ? 'Rigidez (kPa)' : k === 'cap' ? 'CAP (dB/m)' : k === 'alt' ? 'ALT' : k === 'ast' ? 'AST' : k === 'bmi' ? 'IMC' : String(k)}
              />
            ))}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default EvolutionChart;