import React from 'react';
import { 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip 
} from 'recharts';
import type { ChartTimeData, PeriodFilter } from '../../types/ticket';
import { LineChart, Calendar } from 'lucide-react';

interface TimeEvolutionChartProps {
  data: ChartTimeData[];
  period: PeriodFilter;
  loading?: boolean;
}

export const TimeEvolutionChart: React.FC<TimeEvolutionChartProps> = ({
  data,
  period,
  loading,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse h-80 flex flex-col justify-between">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
        <div className="h-48 bg-slate-100 rounded w-full"></div>
      </div>
    );
  }

  const hasData = data && data.length > 0;
  const isMonthly = period === '90d' || period === 'all';

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <LineChart className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Evolução Temporal dos Chamados
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Volume de abertura agrupado por {isMonthly ? 'mês' : 'dia'} no período selecionado
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <div className="flex items-center gap-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-brand-500" />
            <span>Total</span>
          </div>
          <div className="flex items-center gap-1 text-slate-600">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
            <span>Críticos/Altos</span>
          </div>
        </div>
      </div>

      {!hasData ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-lg p-4">
          <Calendar className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
          <span>Sem registros temporais para exibir no filtro selecionado</span>
        </div>
      ) : (
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 10, right: 20, left: -10, bottom: 0 }}
            >
              <defs>
                <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0}/>
                </linearGradient>
                <linearGradient id="colorCritica" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0.0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                axisLine={{ stroke: '#e2e8f0' }}
                tickLine={false}
              />
              <YAxis 
                tick={{ fontSize: 11, fill: '#64748b' }} 
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const item = payload[0].payload as ChartTimeData;
                    return (
                      <div className="bg-slate-900 text-white text-xs rounded-lg p-3 shadow-xl border border-slate-700">
                        <p className="font-semibold text-slate-200 border-b border-slate-800 pb-1.5 mb-1.5">
                          Período: {label}
                        </p>
                        <div className="flex items-center justify-between gap-4 text-slate-300">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-brand-500" />
                            Total de chamados:
                          </span>
                          <span className="font-bold text-white">{item.count}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-300 mt-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-rose-500" />
                            Prioridade Crítica:
                          </span>
                          <span className="font-bold text-rose-400">{item.criticaCount}</span>
                        </div>
                        <div className="flex items-center justify-between gap-4 text-slate-300 mt-1">
                          <span className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-amber-500" />
                            Prioridade Alta:
                          </span>
                          <span className="font-bold text-amber-400">{item.altaCount}</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="count"
                name="Total"
                stroke="#3b82f6"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorTotal)"
              />
              <Area
                type="monotone"
                dataKey="criticaCount"
                name="Críticos"
                stroke="#ef4444"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCritica)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
