import React from 'react';
import { 
  X, 
  Sparkles, 
  Calendar, 
  Tag, 
  Users, 
  HelpCircle,
  FileText,
  Copy,
  Check
} from 'lucide-react';
import type { Chamado } from '../types/ticket';
import { formatDateTime, UNCLASSIFIED } from '../utils/metrics';

interface TicketDetailsModalProps {
  ticket: Chamado | null;
  onClose: () => void;
}

export const TicketDetailsModal: React.FC<TicketDetailsModalProps> = ({ ticket, onClose }) => {
  const [copied, setCopied] = React.useState(false);

  if (!ticket) return null;

  const priority = ticket.prioridade?.trim() || UNCLASSIFIED;
  const category = ticket.categoria?.trim() || UNCLASSIFIED;
  const team = ticket.equipe_sugerida?.trim() || UNCLASSIFIED;
  const status = ticket.status?.trim() || 'Pendente';

  const copyId = () => {
    navigator.clipboard.writeText(String(ticket.id));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPriorityStyle = (p: string) => {
    switch (p.toLowerCase()) {
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-start justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-200/80 text-slate-700 flex items-center gap-1">
                #{ticket.id}
                <button 
                  onClick={copyId} 
                  className="hover:text-brand-600 transition-colors ml-0.5" 
                  title="Copiar ID completo"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                </button>
              </span>
              <span className={`px-2.5 py-0.5 rounded-md border text-xs ${getPriorityStyle(priority)}`}>
                {priority}
              </span>
              <span className="px-2.5 py-0.5 rounded-md border border-slate-200 bg-white text-slate-700 text-xs font-medium">
                {status}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-2 tracking-tight font-['Plus_Jakarta_Sans']">
              {ticket.titulo || 'Sem título fornecido'}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Metadata Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase">
                <Calendar className="w-3 h-3" />
                <span>Criação</span>
              </div>
              <p className="mt-1 font-semibold text-slate-800 text-xs truncate">
                {formatDateTime(ticket.created_at)}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase">
                <Tag className="w-3 h-3" />
                <span>Categoria</span>
              </div>
              <p className="mt-1 font-semibold text-slate-800 text-xs truncate">
                {category}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase">
                <Users className="w-3 h-3 text-indigo-500" />
                <span>Equipe Sugerida</span>
              </div>
              <p className="mt-1 font-semibold text-indigo-700 text-xs truncate">
                {team}
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 uppercase">
                <HelpCircle className="w-3 h-3" />
                <span>Solicitação</span>
              </div>
              <p className="mt-1 font-semibold text-slate-800 text-xs truncate">
                {ticket.tipo_solicitacao || 'Não especificado'}
              </p>
            </div>
          </div>

          {/* AI Summary Highlight Box */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-50/70 to-brand-50/50 border border-indigo-100/80">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded-md bg-indigo-600 text-white flex items-center justify-center">
                <Sparkles className="w-3 h-3" />
              </div>
              <span className="text-xs font-bold text-indigo-900 uppercase tracking-wider">
                Resumo e Análise da IA (Gemini)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {ticket.resumo || 'Nenhum resumo gerado ou disponível para este chamado.'}
            </p>
            <div className="mt-2.5 pt-2 border-t border-indigo-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Triagem realizada automaticamente via n8n Cloud</span>
              <span className="font-medium text-indigo-700">Equipe Recomendada: {team}</span>
            </div>
          </div>

          {/* Full Description */}
          <div>
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Descrição Completa do Chamado</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 whitespace-pre-wrap leading-relaxed max-h-56 overflow-y-auto font-mono text-[13px]">
              {ticket.descricao || 'Nenhuma descrição fornecida no chamado.'}
            </div>
          </div>

          {/* Operational Clarification Note */}
          <div className="text-[11px] text-slate-600 bg-slate-100/60 rounded-lg p-3 border border-slate-200/50">
            ℹ️ <strong>Registro de Auditoria:</strong> Os campos de categoria, prioridade e resumo foram preenchidos pelo fluxo inteligente do n8n com o modelo Google Gemini antes de serem gravados na tabela <code className="font-mono text-slate-800 bg-slate-200/60 px-1 rounded">public.chamados</code>.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-lg transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
