import React, { useState } from 'react';
import { 
  Eye, 
  ChevronLeft, 
  ChevronRight, 
  Calendar, 
  Sparkles,
  Inbox,
  AlertCircle
} from 'lucide-react';
import type { Chamado } from '../types/ticket';
import { formatDateTime, UNCLASSIFIED } from '../utils/metrics';

interface TicketsTableProps {
  tickets: Chamado[];
  loading?: boolean;
  onSelectTicket: (ticket: Chamado) => void;
  onOpenNewTicket?: () => void;
}

export const TicketsTable: React.FC<TicketsTableProps> = ({
  tickets,
  loading,
  onSelectTicket,
  onOpenNewTicket,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Pagination calculation
  const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize));
  const validPage = Math.min(currentPage, totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const pageTickets = tickets.slice(startIndex, startIndex + pageSize);

  // Semantic styles for priorities
  const getPriorityBadge = (prioridade?: string | null) => {
    const p = (prioridade || '').trim().toLowerCase();
    switch (p) {
      case 'crítica':
      case 'critica':
        return 'bg-rose-100 text-rose-800 border-rose-300 font-bold';
      case 'alta':
        return 'bg-orange-100 text-orange-800 border-orange-200 font-semibold';
      case 'média':
      case 'media':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'baixa':
        return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  // Status badges
  const getStatusBadge = (status?: string | null) => {
    const s = (status || '').trim().toLowerCase();
    if (s.includes('resolv') || s.includes('fechad') || s.includes('conclu')) {
      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    }
    if (s.includes('andamento') || s.includes('progresso') || s.includes('analise')) {
      return 'bg-blue-50 text-blue-700 border-blue-200';
    }
    if (s.includes('aberto') || s.includes('novo') || s.includes('pendente')) {
      return 'bg-amber-50 text-amber-700 border-amber-200';
    }
    return 'bg-slate-100 text-slate-700 border-slate-200';
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs animate-pulse space-y-4">
        <div className="h-6 bg-slate-200 rounded w-48"></div>
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-12 bg-slate-100 rounded-lg w-full"></div>
          ))}
        </div>
      </div>
    );
  }

  if (tickets.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-slate-200/80 p-12 shadow-xs text-center">
        <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center mb-4">
          <Inbox className="w-8 h-8 stroke-1" />
        </div>
        <h3 className="text-base font-bold text-slate-800 font-['Plus_Jakarta_Sans']">
          Nenhum chamado encontrado
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1.5 leading-relaxed">
          Não há registros correspondentes aos filtros aplicados ou ainda não foram abertos chamados no Supabase.
        </p>
        {onOpenNewTicket && (
          <div className="mt-5">
            <button
              onClick={onOpenNewTicket}
              className="px-4 py-2 bg-brand-600 hover:bg-brand-700 text-white rounded-lg text-xs font-semibold shadow-sm transition-colors"
            >
              Abrir chamado pelo formulário n8n
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* Table Header */}
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 tracking-tight">
            Chamados Registrados
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Consumindo diretamente a tabela <code className="text-brand-700 bg-brand-50 px-1 py-0.5 rounded font-mono text-[11px]">public.chamados</code>
          </p>
        </div>
        <div className="text-xs text-slate-500 font-medium">
          Total: <strong className="text-slate-800">{tickets.length}</strong> chamado(s)
        </div>
      </div>

      {/* Table Body */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Data / Hora</th>
              <th className="py-3 px-4">Título</th>
              <th className="py-3 px-4">Categoria</th>
              <th className="py-3 px-4">Prioridade</th>
              <th className="py-3 px-4">Equipe Sugerida (IA)</th>
              <th className="py-3 px-4">Status</th>
              <th className="py-3 px-4 text-right">Ação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {pageTickets.map((ticket) => {
              const priority = ticket.prioridade?.trim() || UNCLASSIFIED;
              const category = ticket.categoria?.trim() || UNCLASSIFIED;
              const team = ticket.equipe_sugerida?.trim() || UNCLASSIFIED;
              const status = ticket.status?.trim() || 'Pendente';

              return (
                <tr 
                  key={ticket.id} 
                  className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                  onClick={() => onSelectTicket(ticket)}
                >
                  {/* ID */}
                  <td className="py-3 px-4 font-mono font-medium text-slate-500">
                    #{String(ticket.id).slice(-6)}
                  </td>

                  {/* Created At */}
                  <td className="py-3 px-4 text-slate-600 whitespace-nowrap">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDateTime(ticket.created_at)}</span>
                    </div>
                  </td>

                  {/* Title */}
                  <td className="py-3 px-4 max-w-xs sm:max-w-md">
                    <div className="font-semibold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-1">
                      {ticket.titulo || 'Sem título informado'}
                    </div>
                    {ticket.resumo && (
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-indigo-500 shrink-0" />
                        <span>{ticket.resumo}</span>
                      </div>
                    )}
                  </td>

                  {/* Category */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200/60 font-medium">
                      {category}
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] inline-flex items-center gap-1 ${getPriorityBadge(priority)}`}>
                      {(priority.toLowerCase() === 'crítica' || priority.toLowerCase() === 'critica') && (
                        <AlertCircle className="w-3 h-3 text-rose-600" />
                      )}
                      {priority}
                    </span>
                  </td>

                  {/* Suggested Team */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <div className="flex items-center gap-1 text-slate-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                      <span>{team}</span>
                    </div>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className={`px-2 py-0.5 rounded-md border text-[11px] font-medium ${getStatusBadge(status)}`}>
                      {status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectTicket(ticket);
                      }}
                      className="p-1.5 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-colors"
                      title="Ver detalhes do chamado"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div>
            Página <strong className="text-slate-800">{validPage}</strong> de{' '}
            <strong className="text-slate-800">{totalPages}</strong>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={validPage <= 1}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              title="Página anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={validPage >= totalPages}
              className="p-1.5 rounded-md border border-slate-200 hover:bg-slate-50 disabled:opacity-40 disabled:hover:bg-transparent"
              title="Próxima página"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
