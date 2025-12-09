
import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Consultation } from '../types';

interface Fib4ChartProps {
  consultations: Consultation[];
}

const Fib4Chart: React.FC<Fib4ChartProps> = ({ consultations }) => {
  if (consultations.length === 0) {
    return <div className="h-64 flex items-center justify-center bg-slate-50 text-slate-400 rounded-lg">Sin datos para mostrar</div>;
  }

  // Filter out data points where fib4 might not exist for old records, or map to 0
  const data = consultations.map(c => ({
    date: new Date(c.date).toLocaleDateString('es-MX', { month: 'short', day: 'numeric', year: '2-digit' }),
    fullDate: c.date,
    fib4: c.fib4 || 0
  }));

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
      <h4 className="text-sm font-semibold text-slate-700 mb-4">Evolución de FIB-4 Score</h4>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 30, left: -10, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickMargin={10} />
            <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 'auto']} />
            <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ fontSize: '12px' }}
                labelStyle={{ color: '#64748b', marginBottom: '4px', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '10px' }} />
            
            {/* Clinical Reference Lines for FIB-4 */}
            <ReferenceLine y={1.45} label={{ value: 'Bajo Riesgo (<1.45)', position: 'insideBottomRight', fill: '#10b981', fontSize: 10 }} stroke="#10b981" strokeDasharray="3 3" />
            <ReferenceLine y={3.25} label={{ value: 'Alto Riesgo (>3.25)', position: 'insideTopRight', fill: '#ef4444', fontSize: 10 }} stroke="#ef4444" strokeDasharray="3 3" />
            
            <Line 
              type="monotone" 
              dataKey="fib4" 
              name="FIB-4"
              stroke="#6366f1" 
              strokeWidth={2}
              dot={{ r: 4, strokeWidth: 2 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Fib4Chart;
