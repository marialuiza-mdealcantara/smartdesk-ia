import { useState, useEffect, useCallback, useMemo } from 'react';
import type { Chamado, TicketFilters } from '../types/ticket';
import { fetchAllTickets } from '../services/tickets';
import { getSupabaseClient, getAppConfig } from '../lib/supabase';
import {
  filterTickets,
  getPreviousPeriodTickets,
  calculateOverviewMetrics,
  getCategoryChartData,
  getPriorityChartData,
  getTeamChartData,
  getTimeEvolutionChartData,
} from '../utils/metrics';

export const DEFAULT_FILTERS: TicketFilters = {
  period: '30d',
  categoria: 'all',
  prioridade: 'all',
  equipe_sugerida: 'all',
  status: 'all',
  search: '',
};

export function useTickets() {
  const [tickets, setTickets] = useState<Chamado[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasRlsIssue, setHasRlsIssue] = useState<boolean>(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [realtimeConnected, setRealtimeConnected] = useState(false);
  const [filters, setFilters] = useState<TicketFilters>(DEFAULT_FILTERS);

  const loadData = useCallback(async (isManualRefresh = false) => {
    if (isManualRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    const { data, error: fetchError, hasRlsIssue: rls } = await fetchAllTickets();

    if (fetchError) {
      setError(fetchError);
      setHasRlsIssue(!!rls);
      setTickets([]);
    } else {
      setError(null);
      setHasRlsIssue(false);
      setTickets(data);
      setLastUpdated(new Date());
    }

    setLoading(false);
    setRefreshing(false);
  }, []);

  // Initial load
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Set up Supabase Realtime subscription to reflect changes from n8n instantly
  useEffect(() => {
    const supabase = getSupabaseClient();
    const config = getAppConfig();

    if (!supabase || !config.isConfigured) {
      setRealtimeConnected(false);
      return;
    }

    try {
      const channel = supabase
        .channel('realtime:chamados')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'chamados' },
          () => {
            // Re-fetch data automatically on insert/update/delete from n8n
            loadData(true);
          }
        )
        .subscribe((status) => {
          if (status === 'SUBSCRIBED') {
            setRealtimeConnected(true);
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
            setRealtimeConnected(false);
          }
        });

      return () => {
        supabase.removeChannel(channel);
      };
    } catch (e) {
      console.warn('Realtime subscription not available:', e);
      setRealtimeConnected(false);
    }
  }, [loadData]);

  // Dynamic filter resetting
  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  const updateFilter = useCallback(<K extends keyof TicketFilters>(key: K, value: TicketFilters[K]) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Filtered dataset
  const filteredTickets = useMemo(() => {
    return filterTickets(tickets, filters);
  }, [tickets, filters]);

  // Previous period for metrics
  const previousTickets = useMemo(() => {
    return getPreviousPeriodTickets(tickets, filters.period);
  }, [tickets, filters.period]);

  // Metric Cards
  const metrics = useMemo(() => {
    return calculateOverviewMetrics(filteredTickets, tickets.length, filters.period, previousTickets);
  }, [filteredTickets, tickets.length, filters.period, previousTickets]);

  // Charts
  const categoryChartData = useMemo(() => {
    return getCategoryChartData(filteredTickets);
  }, [filteredTickets]);

  const priorityChartData = useMemo(() => {
    return getPriorityChartData(filteredTickets);
  }, [filteredTickets]);

  const teamChartData = useMemo(() => {
    return getTeamChartData(filteredTickets);
  }, [filteredTickets]);

  const timeEvolutionChartData = useMemo(() => {
    return getTimeEvolutionChartData(filteredTickets, filters.period);
  }, [filteredTickets, filters.period]);

  // Unique status values present in the database (for accurate status filter options)
  const availableStatuses = useMemo(() => {
    const set = new Set<string>();
    tickets.forEach((t) => {
      if (t.status && t.status.trim()) {
        set.add(t.status.trim());
      }
    });
    return Array.from(set).sort();
  }, [tickets]);

  return {
    allTickets: tickets,
    filteredTickets,
    loading,
    refreshing,
    error,
    hasRlsIssue,
    lastUpdated,
    realtimeConnected,
    filters,
    setFilters,
    updateFilter,
    resetFilters,
    metrics,
    categoryChartData,
    priorityChartData,
    teamChartData,
    timeEvolutionChartData,
    availableStatuses,
    refresh: () => loadData(true),
    reload: () => loadData(false),
  };
}
