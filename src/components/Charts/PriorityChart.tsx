import React from 'react';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip 
} from 'recharts';
import type { ChartPriorityData } from '../../types/ticket';
import { AlertTriangle, AlertCircle } from 'lucide-react';

interface PriorityChartProps {
  data: ChartPriorityData[];
  loading?: boolean;
}

export const PriorityChart: React.FC<PriorityChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse h-80 flex flex-col justify-between">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
        <div className="h-48 bg-slate-100 rounded-full w-48 mx-auto"></div>
      </div>
    );
  }

  const hasData = data && data.length > 0 && data.some((d) => d.count > 0);
  const criticalItem = data.find((d) => d.name.toLowerCase() === 'crítica' || d.name.toLowerCase() === 'critica');
  const criticalCount = criticalItem?.count || 0;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Chamados por Prioridade
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Severidade avaliada pelo Gemini na triagem
          </p>
        </div>

        {/* Visual Callout for Critical Tickets */}
        {criticalCount > 0 && (
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600 animate-pulse" />
            <span>{criticalCount} Crítico(s)</span>
          </div>
        )}
      </div>

      {!hasData ? (
        <div className="h-56 flex flex-col items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-lg p-4">
          <AlertTriangle className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
          <span>Sem registros no filtro selecionado</span>
        </div>
      ) : (
        <div>
          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.color}
                      stroke={entry.name === 'Crítica' ? '#b91c1c' : '#ffffff'}
                      strokeWidth={entry.name === 'Crítica' ? 2 : 1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as ChartPriorityData;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl border border-slate-700">
                          <div className="flex items-center gap-1.5 font-semibold text-slate-100">
                            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span>Prioridade {item.name}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 mt-1 text-slate-300">
                            <span>Quantidade:</span>
                            <span className="font-bold text-white">{item.count}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Percentual:</span>
                            <span className="font-bold text-slate-200">{item.percentage}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Badges Legend */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
            {data.map((prio) => (
              <div 
                key={prio.name} 
                className={`flex items-center justify-between p-1.5 rounded-md text-[11px] ${
                  prio.name === 'Crítica' && prio.count > 0 
                    ? 'bg-rose-50/80 border border-rose-200/60' 
                    : 'bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: prio.color }}
                  />
                  <span className={`truncate ${prio.name === 'Crítica' ? 'font-semibold text-rose-900' : 'text-slate-700'}`}>
                    {prio.name}
                  </span>
                </div>
                <span className="font-bold text-slate-900 ml-1 shrink-0">
                  {prio.count} <span className="text-[10px] text-slate-600 font-normal">({prio.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
