import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Cell
} from 'recharts';
import type { ChartTeamData } from '../../types/ticket';
import { Users, Sparkles } from 'lucide-react';

interface TeamChartProps {
  data: ChartTeamData[];
  loading?: boolean;
}

const TEAM_COLORS: Record<string, string> = {
  'TI': '#3b82f6',
  'Infraestrutura': '#6366f1',
  'Atendimento': '#06b6d4',
  'Operações': '#8b5cf6',
  'Não classificado': '#94a3b8',
};

export const TeamChart: React.FC<TeamChartProps> = ({ data, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse h-80 flex flex-col justify-between">
        <div className="h-5 bg-slate-200 rounded w-48"></div>
        <div className="h-48 bg-slate-100 rounded w-full"></div>
      </div>
    );
  }

  const hasData = data && data.length > 0 && data.some((d) => d.count > 0);

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Chamados por Equipe Sugerida
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Distribuição proposta pelo modelo IA (Gemini) no n8n
          </p>
        </div>

        <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 text-[11px] font-medium shrink-0">
          <Sparkles className="w-3 h-3 text-indigo-500" />
          <span>Sugestão IA</span>
        </div>
      </div>

      {!hasData ? (
        <div className="h-56 flex flex-col items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-lg p-4">
          <Users className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
          <span>Sem registros no filtro selecionado</span>
        </div>
      ) : (
        <div>
          <div className="h-52 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis type="number" tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <YAxis
                  dataKey="name"
                  type="category"
                  width={110}
                  tick={{ fontSize: 11, fill: '#334155' }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const item = payload[0].payload as ChartTeamData;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl border border-slate-700">
                          <p className="font-semibold text-slate-100">{item.name}</p>
                          <div className="flex items-center justify-between gap-4 mt-1 text-slate-300">
                            <span>Quantidade:</span>
                            <span className="font-bold text-white">{item.count}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Percentual:</span>
                            <span className="font-bold text-indigo-400">{item.percentage}%</span>
                          </div>
                          <div className="mt-1.5 pt-1.5 border-t border-slate-800 text-[10px] text-slate-400 italic">
                            *Equipe recomendada pela IA, não necessariamente quem finalizou.
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.map((entry) => (
                    <Cell
                      key={`team-${entry.name}`}
                      fill={TEAM_COLORS[entry.name] || '#64748b'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown cards */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
            {data.map((team) => (
              <div key={team.name} className="p-2 rounded-md bg-slate-50 text-[11px] border border-slate-100">
                <div className="flex items-center gap-1.5">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: TEAM_COLORS[team.name] || '#64748b' }}
                  />
                  <span className="text-slate-700 font-medium truncate">{team.name}</span>
                </div>
                <div className="mt-1 flex items-baseline justify-between">
                  <span className="text-sm font-bold text-slate-900">{team.count}</span>
                  <span className="text-[10px] text-slate-600">{team.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI Disclaimer note */}
      <div className="mt-3 text-[11px] text-slate-500 bg-slate-50/60 rounded p-2 border border-slate-200/40">
        💡 <strong>Nota Operacional:</strong> Os valores acima indicam a equipe de roteamento sugerida pela IA após análise do texto e não substituem o apontamento definitivo da equipe executora.
      </div>
    </div>
  );
};
