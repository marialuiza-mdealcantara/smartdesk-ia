import React from 'react';
import { 
  Menu, 
  RotateCw, 
  PlusCircle, 
  Radio, 
  Database,
  Calendar,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import type { NavTab } from './Sidebar';
import type { PeriodFilter } from '../types/ticket';

interface HeaderProps {
  currentTab: NavTab;
  period: PeriodFilter;
  lastUpdated: Date | null;
  refreshing: boolean;
  onRefresh: () => void;
  onOpenMobileMenu: () => void;
  onOpenNewTicket: () => void;
  onOpenSettings: () => void;
  hasConnectionError: boolean;
  isConfigured: boolean;
  realtimeConnected: boolean;
}

const TAB_TITLES: Record<NavTab, { title: string; desc: string }> = {
  overview: {
    title: 'Visão Geral',
    desc: 'Indicadores operacionais consolidados e triagem automatizada com IA.',
  },
  tickets: {
    title: 'Central de Chamados',
    desc: 'Listagem completa, filtros detalhados e consulta individual dos registros.',
  },
  analytics: {
    title: 'Indicadores e Análises',
    desc: 'Comportamento por categorias, equipes sugeridas e tendências temporais.',
  },
};

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  lastUpdated,
  refreshing,
  onRefresh,
  onOpenMobileMenu,
  onOpenNewTicket,
  onOpenSettings,
  hasConnectionError,
  isConfigured,
  realtimeConnected,
}) => {
  const tabInfo = TAB_TITLES[currentTab];

  // Format today's date in pt-BR
  const todayFormatted = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(new Date());

  return (
    <header className="bg-white border-b border-slate-200/80 sticky top-0 z-30 shadow-xs">
      <div className="px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Left: Mobile hamburger + Titles */}
        <div className="flex items-center gap-3">
          <button
            onClick={onOpenMobileMenu}
            className="p-2 -ml-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Abrir menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight font-['Plus_Jakarta_Sans']">
                {tabInfo.title}
              </h1>
              {realtimeConnected && (
                <span 
                  title="Supabase Realtime ativo: atualizações instantâneas do n8n"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200"
                >
                  <Radio className="w-2.5 h-2.5 animate-pulse text-emerald-500" />
                  Realtime
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 mt-0.5 max-w-xl">
              {tabInfo.desc}
            </p>
          </div>
        </div>

        {/* Right: Actions, Date, Status */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Current Date */}
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-slate-600 text-xs border border-slate-200/60 font-medium">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className="capitalize">{todayFormatted}</span>
          </div>

          {/* Connection Status Pill */}
          <button
            onClick={onOpenSettings}
            title={
              !isConfigured
                ? 'Supabase não configurado. Clique para adicionar credenciais.'
                : hasConnectionError
                ? 'Erro de conexão ou RLS. Clique para ver detalhes e SQL de correção.'
                : 'Conectado ao Supabase (public.chamados)'
            }
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
              !isConfigured
                ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100'
                : hasConnectionError
                ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            {!isConfigured ? (
              <>
                <Database className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden xs:inline">Configurar</span> Supabase
              </>
            ) : hasConnectionError ? (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                <span>Erro Conexão</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Supabase Conectado</span>
              </>
            )}
          </button>

          {/* Manual Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={refreshing}
            title={lastUpdated ? `Última atualização: ${lastUpdated.toLocaleTimeString('pt-BR')}` : 'Atualizar dados'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 active:bg-slate-100 text-slate-700 text-xs font-medium transition-all shadow-2xs disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 text-slate-500 ${refreshing ? 'animate-spin text-brand-600' : ''}`} />
            <span className="hidden sm:inline">Atualizar</span>
          </button>

          {/* Open New Ticket Button -> connects to n8n */}
          <button
            onClick={onOpenNewTicket}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-brand-600 hover:bg-brand-700 active:bg-brand-800 text-white text-xs font-semibold shadow-sm shadow-brand-600/20 transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Abrir novo chamado</span>
          </button>
        </div>
      </div>
    </header>
  );
};
