import React from 'react';
import { MetricCard } from '../components/MetricCard';
import { Filters } from '../components/Filters';
import { CategoryChart } from '../components/Charts/CategoryChart';
import { PriorityChart } from '../components/Charts/PriorityChart';
import { TeamChart } from '../components/Charts/TeamChart';
import { TimeEvolutionChart } from '../components/Charts/TimeEvolutionChart';
import { TicketsTable } from '../components/TicketsTable';
import type { Chamado, MetricCardData, TicketFilters, ChartCategoryData, ChartPriorityData, ChartTeamData, ChartTimeData } from '../types/ticket';
import { ArrowRight, Ticket as TicketIcon } from 'lucide-react';

interface OverviewViewProps {
  metrics: MetricCardData[];
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
  onSelectTicket: (ticket: Chamado) => void;
  onNavigateToTickets: () => void;
  onOpenNewTicket: () => void;
}

export const OverviewView: React.FC<OverviewViewProps> = ({
  metrics,
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
  onSelectTicket,
  onNavigateToTickets,
  onOpenNewTicket,
}) => {
  return (
    <div className="space-y-6">
      {/* 1. Global Filters */}
      <Filters
        filters={filters}
        onUpdateFilter={onUpdateFilter}
        onResetFilters={onResetFilters}
        availableStatuses={availableStatuses}
        totalResults={filteredTickets.length}
      />

      {/* 2. Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} data={metric} loading={loading} />
        ))}
      </div>

      {/* 3. Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <CategoryChart data={categoryChartData} loading={loading} />
        <PriorityChart data={priorityChartData} loading={loading} />
        <TeamChart data={teamChartData} loading={loading} />
        <TimeEvolutionChart
          data={timeEvolutionChartData}
          period={filters.period}
          loading={loading}
        />
      </div>

      {/* 4. Recent Tickets Table Preview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TicketIcon className="w-4 h-4 text-brand-600" />
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">
              Chamados Recentes no Período
            </h3>
          </div>
          <button
            onClick={onNavigateToTickets}
            className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 hover:underline transition-all"
          >
            <span>Ver todos os {filteredTickets.length} chamados</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <TicketsTable
          tickets={filteredTickets.slice(0, 5)}
          loading={loading}
          onSelectTicket={onSelectTicket}
          onOpenNewTicket={onOpenNewTicket}
        />
      </div>
    </div>
  );
};
