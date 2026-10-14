import type { Chamado, TicketFilters, ChartCategoryData, ChartPriorityData, ChartTeamData, ChartTimeData } from '../types/ticket';
import { Filters } from '../components/Filters';
import { CategoryChart } from '../components/Charts/CategoryChart';
import { PriorityChart } from '../components/Charts/PriorityChart';
import { TeamChart } from '../components/Charts/TeamChart';
import { TimeEvolutionChart } from '../components/Charts/TimeEvolutionChart';
import { BrainCircuit, Info } from 'lucide-react';

interface AnalyticsViewProps {
  filters: TicketFilters;
  onUpdateFilter: <K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => void;
  onResetFilters: () => void;
  availableStatuses: string[];
  filteredTickets: Chamado[];
  loading: boolean;
  categoryChartData: ChartCategoryData[];
  priorityChartData: ChartPriorityData[];
  teamChartData: ChartTeamData[];
  timeEvolutionChartData: ChartTimeData[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  availableStatuses,
  filteredTickets,
  loading,
  categoryChartData,
  priorityChartData,
  teamChartData,
  timeEvolutionChartData,
}) => {
  // Priority breakdown
  const criticalCount = filteredTickets.filter(
    (t) => (t.prioridade || '').trim().toLowerCase() === 'crítica' || (t.prioridade || '').trim().toLowerCase() === 'critica'
  ).length;

  const highCount = filteredTickets.filter(
    (t) => (t.prioridade || '').trim().toLowerCase() === 'alta'
  ).length;

  const mediumCount = filteredTickets.filter(
    (t) => (t.prioridade || '').trim().toLowerCase() === 'média' || (t.prioridade || '').trim().toLowerCase() === 'media'
  ).length;

  const lowCount = filteredTickets.filter(
    (t) => (t.prioridade || '').trim().toLowerCase() === 'baixa'
  ).length;

  const unclassifiedPriority = filteredTickets.filter(
    (t) => !t.prioridade || !['baixa', 'média', 'media', 'alta', 'crítica', 'critica'].includes(t.prioridade.trim().toLowerCase())
  ).length;

  // AI Classification rate
  const classifiedCount = filteredTickets.filter((t) => t.categoria && t.prioridade && t.equipe_sugerida).length;
  const classificationRate = filteredTickets.length > 0 
    ? Math.round((classifiedCount / filteredTickets.length) * 100) 
    : 100;

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Filters
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onResetFilters={onResetFilters}
        availableStatuses={availableStatuses}
        totalResults={filteredTickets.length}
      />

      {/* AI Insights & Quality Overview Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-md border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shrink-0">
              <BrainCircuit className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold tracking-tight font-['Plus_Jakarta_Sans']">
                  Qualidade da Triagem Automatizada (Gemini + n8n)
                </h3>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {classificationRate}% Completude
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Cada registro passa por inferência contextual no n8n Cloud via Google Gemini antes de ser gravado em <code className="font-mono text-indigo-300 bg-white/10 px-1 py-0.5 rounded">public.chamados</code>. A IA extrai categoria, severidade, resumo e equipe sugerida.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white/5 border border-white/10 px-4 py-3 rounded-xl shrink-0">
            <div>
              <div className="text-[11px] text-slate-400">Total Analisado</div>
              <div className="text-xl font-extrabold text-white">{filteredTickets.length}</div>
            </div>
            <div className="h-8 w-px bg-white/10"></div>
            <div>
              <div className="text-[11px] text-slate-400">Com Triagem Completa</div>
              <div className="text-xl font-extrabold text-indigo-300">{classifiedCount}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-dive Priority Matrix Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Crítica */}
        <div className="bg-white rounded-xl border border-rose-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-800 uppercase tracking-wider">Crítica</span>
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
          </div>
          <div className="text-2xl font-extrabold text-rose-900 mt-2 font-['Plus_Jakarta_Sans']">
            {criticalCount}
          </div>
          <p className="text-xs text-rose-700/80 mt-1">
            Impacto operacional severo. Exige atuação imediata.
          </p>
        </div>

        {/* Alta */}
        <div className="bg-white rounded-xl border border-orange-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Alta</span>
            <span className="w-2.5 h-2.5 rounded-full bg-orange-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-orange-900 mt-2 font-['Plus_Jakarta_Sans']">
            {highCount}
          </div>
          <p className="text-xs text-orange-700/80 mt-1">
            Degradação relevante sem interrupção total.
          </p>
        </div>

        {/* Média */}
        <div className="bg-white rounded-xl border border-amber-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Média</span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-amber-900 mt-2 font-['Plus_Jakarta_Sans']">
            {mediumCount}
          </div>
          <p className="text-xs text-amber-700/80 mt-1">
            Operação normal com impacto pontual ou moderado.
          </p>
        </div>

        {/* Baixa */}
        <div className="bg-white rounded-xl border border-emerald-200/80 p-4 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">Baixa</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          </div>
          <div className="text-2xl font-extrabold text-emerald-900 mt-2 font-['Plus_Jakarta_Sans']">
            {lowCount}
          </div>
          <p className="text-xs text-emerald-700/80 mt-1">
            Dúvidas, requisições padrão ou melhorias rotineiras.
          </p>
        </div>

        {/* Não classificado (quando houver) */}
        {unclassifiedPriority > 0 && (
          <div className="bg-white rounded-xl border border-slate-200/80 p-4 shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Não Classificado</span>
              <span className="w-2.5 h-2.5 rounded-full bg-slate-400"></span>
            </div>
            <div className="text-2xl font-extrabold text-slate-800 mt-2 font-['Plus_Jakarta_Sans']">
              {unclassifiedPriority}
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Registros sem prioridade inferida pela IA.
            </p>
          </div>
        )}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategoryChart data={categoryChartData} loading={loading} />
        <PriorityChart data={priorityChartData} loading={loading} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <TeamChart data={teamChartData} loading={loading} />
        <TimeEvolutionChart
          data={timeEvolutionChartData}
          period={filters.period}
          loading={loading}
        />
      </div>

      {/* Analytical Notes */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs">
        <h4 className="text-sm font-bold text-slate-900 mb-2 font-['Plus_Jakarta_Sans'] flex items-center gap-2">
          <Info className="w-4 h-4 text-brand-600" />
          <span>Considerações sobre Regras de Negócio e Indicadores</span>
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 leading-relaxed mt-3">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-800 block mb-1">Diferenciação de Prioridade Alta vs. Crítica:</strong>
            Os chamados classificados como Crítica recebem destaque visual dedicado e não são mesclados com Alta nas distribuições nominais. No card de topo, somam-se ambas exclusivamente para destacar o volume sob maior exigência operacional.
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <strong className="text-slate-800 block mb-1">Equipe Sugerida pela IA:</strong>
            Representa a recomendação de roteamento do Gemini no n8n. Não pressupõe conclusão técnica pela mesma equipe, funcionando como assistente inteligente de despacho operacional.
          </div>
        </div>
      </div>
    </div>
  );
};
