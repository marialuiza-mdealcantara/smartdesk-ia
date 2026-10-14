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
import type { ChartCategoryData } from '../../types/ticket';
import { FolderTree } from 'lucide-react';

interface CategoryChartProps {
  data: ChartCategoryData[];
  loading?: boolean;
}

const CATEGORY_COLORS = [
  '#2563eb', // Blue (Suporte técnico)
  '#0d9488', // Teal (Acesso)
  '#8b5cf6', // Violet (Serviços)
  '#f59e0b', // Amber (Dúvidas)
  '#64748b', // Slate (Outros)
  '#94a3b8', // Gray (Não classificado)
];

export const CategoryChart: React.FC<CategoryChartProps> = ({ data, loading }) => {
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
            <FolderTree className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Chamados por Categoria
            </h3>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Classificação atribuída automaticamente pelo Gemini
          </p>
        </div>
      </div>

      {!hasData ? (
        <div className="h-56 flex flex-col items-center justify-center text-slate-400 text-xs text-center border border-dashed border-slate-200 rounded-lg p-4">
          <FolderTree className="w-8 h-8 text-slate-300 mb-2 stroke-1" />
          <span>Sem registros de chamados no filtro selecionado</span>
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
                      const item = payload[0].payload as ChartCategoryData;
                      return (
                        <div className="bg-slate-900 text-white text-xs rounded-lg p-2.5 shadow-xl border border-slate-700">
                          <p className="font-semibold text-slate-100">{item.name}</p>
                          <div className="flex items-center justify-between gap-4 mt-1 text-slate-300">
                            <span>Quantidade:</span>
                            <span className="font-bold text-white">{item.count}</span>
                          </div>
                          <div className="flex items-center justify-between gap-4 text-slate-300">
                            <span>Participação:</span>
                            <span className="font-bold text-brand-400">{item.percentage}%</span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="count" radius={[0, 4, 4, 0]}>
                  {data.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Pills */}
          <div className="mt-3 pt-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-3 gap-2">
            {data.map((cat, i) => (
              <div key={cat.name} className="flex items-center justify-between p-1.5 rounded-md bg-slate-50 text-[11px]">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: CATEGORY_COLORS[i % CATEGORY_COLORS.length] }}
                  />
                  <span className="text-slate-600 truncate">{cat.name}</span>
                </div>
                <span className="font-semibold text-slate-900 ml-1 shrink-0">
                  {cat.count} <span className="text-[10px] text-slate-600 font-normal">({cat.percentage}%)</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
