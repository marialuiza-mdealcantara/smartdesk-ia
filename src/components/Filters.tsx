import React from 'react';
import { 
  Search, 
  X, 
  RotateCcw,
  SlidersHorizontal,
  Calendar
} from 'lucide-react';
import type { TicketFilters, PeriodFilter } from '../types/ticket';

interface FiltersProps {
  filters: TicketFilters;
  onUpdateFilter: <K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => void;
  onResetFilters: () => void;
  availableStatuses: string[];
  totalResults: number;
}

const CATEGORIES = ['Suporte técnico', 'Acesso', 'Serviços', 'Dúvidas', 'Outros'];
const PRIORITIES = ['Baixa', 'Média', 'Alta', 'Crítica'];
const TEAMS = ['TI', 'Infraestrutura', 'Atendimento', 'Operações'];

export const Filters: React.FC<FiltersProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  availableStatuses,
  totalResults,
}) => {
  // Count how many filters are active beyond default
  const activeCount = [
    filters.period !== '30d',
    filters.categoria !== 'all',
    filters.prioridade !== 'all',
    filters.equipe_sugerida !== 'all',
    filters.status !== 'all',
    Boolean(filters.search.trim()),
  ].filter(Boolean).length;

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs space-y-3">
      {/* Top row: Search + Period Buttons */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onUpdateFilter('search', e.target.value)}
            placeholder="Buscar por título, descrição, resumo da IA ou ID..."
            className="w-full pl-9 pr-9 py-2 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 transition-all"
          />
          {filters.search && (
            <button
              onClick={() => onUpdateFilter('search', '')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded"
              title="Limpar busca"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Period Selector Tabs */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg shrink-0 overflow-x-auto">
          <Calendar className="w-3.5 h-3.5 text-slate-400 ml-2 mr-1 hidden sm:inline shrink-0" />
          {(
            [
              { id: '7d', label: '7 dias' },
              { id: '30d', label: '30 dias' },
              { id: '90d', label: '90 dias' },
              { id: 'all', label: 'Todo o período' },
            ] as { id: PeriodFilter; label: string }[]
          ).map((p) => {
            const isSelected = filters.period === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onUpdateFilter('period', p.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-white text-slate-900 shadow-xs font-semibold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom row: Dropdown selects + Clear button */}
      <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2.5 text-xs">
        <div className="flex items-center gap-1 text-slate-500 font-medium mr-1">
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filtros:</span>
        </div>

        {/* Categoria */}
        <select
          value={filters.categoria}
          onChange={(e) => onUpdateFilter('categoria', e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
        >
          <option value="all">Todas as Categorias</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
          <option value="Não classificado">Não classificado</option>
        </select>

        {/* Prioridade */}
        <select
          value={filters.prioridade}
          onChange={(e) => onUpdateFilter('prioridade', e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
        >
          <option value="all">Todas as Prioridades</option>
          {PRIORITIES.map((prio) => (
            <option key={prio} value={prio}>
              {prio}
            </option>
          ))}
          <option value="Não classificado">Não classificado</option>
        </select>

        {/* Equipe Sugerida */}
        <select
          value={filters.equipe_sugerida}
          onChange={(e) => onUpdateFilter('equipe_sugerida', e.target.value)}
          className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
        >
          <option value="all">Todas as Equipes (IA)</option>
          {TEAMS.map((team) => (
            <option key={team} value={team}>
              {team}
            </option>
          ))}
          <option value="Não classificado">Não classificado</option>
        </select>

        {/* Status */}
        {availableStatuses.length > 0 && (
          <select
            value={filters.status}
            onChange={(e) => onUpdateFilter('status', e.target.value)}
            className="px-2.5 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-colors"
          >
            <option value="all">Todos os Status</option>
            {availableStatuses.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </select>
        )}

        {/* Clear Filters Button (shown when active) */}
        {activeCount > 0 && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 px-2.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-lg border border-rose-200/60 transition-colors ml-auto"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Limpar filtros ({activeCount})</span>
          </button>
        )}

        {/* Results summary counter */}
        <div className="text-[11px] text-slate-500 ml-auto hidden sm:block">
          Mostrando <strong className="text-slate-800">{totalResults}</strong> chamado(s)
        </div>
      </div>
    </div>
  );
};
