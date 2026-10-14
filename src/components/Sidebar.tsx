import React from 'react';
import { 
  LayoutDashboard, 
  Ticket, 
  BarChart3, 
  Sparkles, 
  Database,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export type NavTab = 'overview' | 'tickets' | 'analytics';

interface SidebarProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  ticketCount?: number;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenSettings: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  ticketCount = 0,
  isOpenMobile,
  onCloseMobile,
  onOpenSettings,
}) => {
  const navItems = [
    {
      id: 'overview' as NavTab,
      label: 'Visão Geral',
      icon: LayoutDashboard,
      description: 'Métricas e gráficos operacionais',
    },
    {
      id: 'tickets' as NavTab,
      label: 'Chamados',
      icon: Ticket,
      description: 'Listagem e triagem detalhada',
      badge: ticketCount > 0 ? ticketCount : undefined,
    },
    {
      id: 'analytics' as NavTab,
      label: 'Indicadores e Análises',
      icon: BarChart3,
      description: 'Distribuição e inteligência de dados',
    },
  ];

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      <aside className={`
        fixed top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Header */}
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center shadow-lg shadow-brand-500/20 text-white font-bold text-lg">
              SD
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white font-['Plus_Jakarta_Sans']">
                  SmartDesk
                </span>
                <span className="text-xs font-semibold px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  AI
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">Gestão de Chamados</p>
            </div>
          </div>

          {/* AI Banner */}
          <div className="mt-4 p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Sparkles className="w-3.5 h-3.5" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-slate-200 truncate">Triagem com IA</p>
              <p className="text-[11px] text-slate-400 truncate">n8n Cloud + Google Gemini</p>
            </div>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-1 px-3 py-5 space-y-1 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold tracking-wider text-slate-400 uppercase">
            Menu Principal
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-all group text-left ${
                  isActive
                    ? 'bg-brand-600 text-white shadow-md shadow-brand-600/30 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-colors ${
                  isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                }`} />
                <div className="flex-1 truncate">
                  <div className="flex items-center justify-between">
                    <span>{item.label}</span>
                    {item.badge !== undefined && (
                      <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                        isActive 
                          ? 'bg-white/20 text-white' 
                          : 'bg-slate-800 text-slate-300 border border-slate-700'
                      }`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-white/80 shrink-0" />}
              </button>
            );
          })}
        </nav>

        {/* Footer info & Settings */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <button
            onClick={onOpenSettings}
            className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800/80 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-slate-400" />
              <span>Conexão Supabase</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
          
          <div className="px-3 pt-2 text-[11px] text-slate-400 text-center">
            SmartDesk AI v1.0.0
          </div>
        </div>
      </aside>
    </>
  );
};
