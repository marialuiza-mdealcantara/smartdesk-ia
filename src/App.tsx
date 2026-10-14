import { useState } from 'react';
import { Sidebar, type NavTab } from './components/Sidebar';
import { Header } from './components/Header';
import { OverviewView } from './views/OverviewView';
import { TicketsView } from './views/TicketsView';
import { AnalyticsView } from './views/AnalyticsView';
import { TicketDetailsModal } from './components/TicketDetailsModal';
import { ConnectionModal } from './components/ConnectionModal';
import { N8nModal } from './components/N8nModal';
import { useTickets } from './hooks/useTickets';
import { getAppConfig } from './lib/supabase';
import type { Chamado } from './types/ticket';
import { AlertCircle, Key, RefreshCw } from 'lucide-react';

export function App() {
  const [currentTab, setCurrentTab] = useState<NavTab>('overview');
  const [selectedTicket, setSelectedTicket] = useState<Chamado | null>(null);
  const [isConnectionModalOpen, setIsConnectionModalOpen] = useState(false);
  const [isN8nModalOpen, setIsN8nModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const {
    allTickets,
    filteredTickets,
    loading,
    refreshing,
    error,
    hasRlsIssue,
    lastUpdated,
    realtimeConnected,
    filters,
    updateFilter,
    resetFilters,
    metrics,
    categoryChartData,
    priorityChartData,
    teamChartData,
    timeEvolutionChartData,
    availableStatuses,
    refresh,
    reload,
  } = useTickets();

  const appConfig = getAppConfig();

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        ticketCount={allTickets.length}
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        onOpenSettings={() => setIsConnectionModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          currentTab={currentTab}
          period={filters.period}
          lastUpdated={lastUpdated}
          refreshing={refreshing}
          onRefresh={refresh}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenNewTicket={() => setIsN8nModalOpen(true)}
          hasConnectionError={Boolean(error)}
          isConfigured={appConfig.isConfigured}
          realtimeConnected={realtimeConnected}
        />

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          {/* Missing Configuration Banner */}
          {!appConfig.isConfigured && (
            <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 border border-amber-200 flex items-center justify-center shrink-0">
                  <Key className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-amber-900 font-['Plus_Jakarta_Sans']">
                    Credenciais do Supabase Não Configuradas
                  </h4>
                  <p className="text-xs text-amber-800/90 mt-0.5 leading-relaxed">
                    Para visualizar os chamados reais de <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">public.chamados</code>, configure a URL e a Anon Key pública no arquivo <code className="font-mono bg-amber-100 px-1 py-0.5 rounded">.env</code> ou adicione diretamente pelo botão ao lado.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsConnectionModalOpen(true)}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors shrink-0"
              >
                Configurar Supabase Agora
              </button>
            </div>
          )}

          {/* Connection or RLS Error Banner */}
          {error && appConfig.isConfigured && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-rose-500/10 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-rose-900 font-['Plus_Jakarta_Sans']">
                    {hasRlsIssue ? 'Atenção: Permissão Negada (Row Level Security)' : 'Erro ao Carregar Dados do Supabase'}
                  </h4>
                  <p className="text-xs text-rose-800 mt-0.5 leading-relaxed">
                    {error}
                  </p>
                  {hasRlsIssue && (
                    <p className="text-[11px] text-rose-700 mt-1">
                      💡 O RLS está bloqueando a leitura anônima. Clique em "Ver Solução RLS" para obter o SQL de permissão sem desativar a segurança.
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={reload}
                  className="px-3 py-2 bg-white border border-rose-200 text-rose-700 hover:bg-rose-100/60 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Tentar Novamente</span>
                </button>
                <button
                  onClick={() => setIsConnectionModalOpen(true)}
                  className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                >
                  {hasRlsIssue ? 'Ver Solução RLS' : 'Revisar Conexão'}
                </button>
              </div>
            </div>
          )}

          {/* Views */}
          {currentTab === 'overview' && (
            <OverviewView
              metrics={metrics}
              filters={filters}
              onUpdateFilter={updateFilter}
              onResetFilters={resetFilters}
              availableStatuses={availableStatuses}
              filteredTickets={filteredTickets}
              loading={loading}
              categoryChartData={categoryChartData}
              priorityChartData={priorityChartData}
              teamChartData={teamChartData}
              timeEvolutionChartData={timeEvolutionChartData}
              onSelectTicket={setSelectedTicket}
              onNavigateToTickets={() => setCurrentTab('tickets')}
              onOpenNewTicket={() => setIsN8nModalOpen(true)}
            />
          )}

          {currentTab === 'tickets' && (
            <TicketsView
              filters={filters}
              onUpdateFilter={updateFilter}
              onResetFilters={resetFilters}
              availableStatuses={availableStatuses}
              filteredTickets={filteredTickets}
              totalTicketsCount={allTickets.length}
              loading={loading}
              onSelectTicket={setSelectedTicket}
              onOpenNewTicket={() => setIsN8nModalOpen(true)}
            />
          )}

          {currentTab === 'analytics' && (
            <AnalyticsView
              filters={filters}
              onUpdateFilter={updateFilter}
              onResetFilters={resetFilters}
              availableStatuses={availableStatuses}
              filteredTickets={filteredTickets}
              loading={loading}
              categoryChartData={categoryChartData}
              priorityChartData={priorityChartData}
              teamChartData={teamChartData}
              timeEvolutionChartData={timeEvolutionChartData}
            />
          )}
        </main>
      </div>

      {/* Ticket Details Modal */}
      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
      />

      {/* Supabase Connection & Settings Modal */}
      <ConnectionModal
        isOpen={isConnectionModalOpen}
        onClose={() => setIsConnectionModalOpen(false)}
        onConfigSaved={() => reload()}
      />

      {/* n8n Form Info Modal */}
      <N8nModal
        isOpen={isN8nModalOpen}
        onClose={() => setIsN8nModalOpen(false)}
        onOpenSettings={() => setIsConnectionModalOpen(true)}
      />
    </div>
  );
}

export default App;
