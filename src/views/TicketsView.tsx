import type { Chamado, TicketFilters } from '../types/ticket';
import { Filters } from '../components/Filters';
import { TicketsTable } from '../components/TicketsTable';

interface TicketsViewProps {
  filters: TicketFilters;
  onUpdateFilter: <K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => void;
  onResetFilters: () => void;
  availableStatuses: string[];
  filteredTickets: Chamado[];
  totalTicketsCount: number;
  loading: boolean;
  onSelectTicket: (ticket: Chamado) => void;
  onOpenNewTicket: () => void;
}

export const TicketsView: React.FC<TicketsViewProps> = ({
  filters,
  onUpdateFilter,
  onResetFilters,
  availableStatuses,
  filteredTickets,
  totalTicketsCount,
  loading,
  onSelectTicket,
  onOpenNewTicket,
}) => {
  return (
    <div className="space-y-6">
      {/* Filters with count badge */}
      <div className="space-y-2">
        <Filters
          filters={filters}
          onUpdateFilter={onUpdateFilter}
          onResetFilters={onResetFilters}
          availableStatuses={availableStatuses}
          totalResults={filteredTickets.length}
        />
        <div className="text-[11px] text-slate-500 flex items-center justify-between px-1">
          <span>Filtrando <strong>{filteredTickets.length}</strong> de <strong>{totalTicketsCount}</strong> chamados registrados</span>
          <span>Ordenado por data decrescente (mais recentes primeiro)</span>
        </div>
      </div>

      {/* Main Table */}
      <TicketsTable
        tickets={filteredTickets}
        loading={loading}
        onSelectTicket={onSelectTicket}
        onOpenNewTicket={onOpenNewTicket}
      />
    </div>
  );
};
