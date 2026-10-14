import type { Chamado, PeriodFilter, TicketFilters, MetricCardData, ChartCategoryData, ChartPriorityData, ChartTeamData, ChartTimeData } from '../types/ticket';

export const UNCLASSIFIED = 'Não classificado';

// Priority colors following user guidelines
export const PRIORITY_COLORS: Record<string, string> = {
  'Baixa': '#10b981',    // Emerald
  'Média': '#f59e0b',    // Amber
  'Alta': '#f97316',     // Orange
  'Crítica': '#ef4444',  // Rose / Red (Destacado)
  'Não classificado': '#94a3b8',
};

// Filter tickets by the active filter set
export function filterTickets(tickets: Chamado[], filters: TicketFilters): Chamado[] {
  const now = new Date().getTime();

  return tickets.filter((t) => {
    // 1. Period filter
    if (filters.period !== 'all') {
      const ticketTime = new Date(t.created_at).getTime();
      const days = filters.period === '7d' ? 7 : filters.period === '30d' ? 30 : 90;
      const cutoffTime = now - days * 24 * 60 * 60 * 1000;
      if (ticketTime < cutoffTime) return false;
    }

    // 2. Category filter
    if (filters.categoria !== 'all') {
      const cat = t.categoria?.trim() || UNCLASSIFIED;
      if (cat !== filters.categoria) return false;
    }

    // 3. Priority filter
    if (filters.prioridade !== 'all') {
      const prio = t.prioridade?.trim() || UNCLASSIFIED;
      if (prio !== filters.prioridade) return false;
    }

    // 4. Suggested Team filter
    if (filters.equipe_sugerida !== 'all') {
      const team = t.equipe_sugerida?.trim() || UNCLASSIFIED;
      if (team !== filters.equipe_sugerida) return false;
    }

    // 5. Status filter
    if (filters.status !== 'all') {
      const st = t.status?.trim() || UNCLASSIFIED;
      if (st !== filters.status) return false;
    }

    // 6. Search filter (title, description, summary)
    if (filters.search && filters.search.trim() !== '') {
      const q = filters.search.toLowerCase().trim();
      const title = (t.titulo || '').toLowerCase();
      const desc = (t.descricao || '').toLowerCase();
      const res = (t.resumo || '').toLowerCase();
      const id = String(t.id).toLowerCase();
      if (!title.includes(q) && !desc.includes(q) && !res.includes(q) && !id.includes(q)) {
        return false;
      }
    }

    return true;
  });
}

// Get tickets from previous period for honest trend comparison
export function getPreviousPeriodTickets(tickets: Chamado[], period: PeriodFilter): Chamado[] {
  if (period === 'all') return [];

  const now = new Date().getTime();
  const days = period === '7d' ? 7 : period === '30d' ? 30 : 90;
  const periodDuration = days * 24 * 60 * 60 * 1000;

  const currentCutoff = now - periodDuration;
  const previousCutoff = now - (periodDuration * 2);

  return tickets.filter((t) => {
    const time = new Date(t.created_at).getTime();
    return time >= previousCutoff && time < currentCutoff;
  });
}

// Format date to Brazilian locale
export function formatDateTime(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

export function formatDateShort(isoString?: string | null): string {
  if (!isoString) return '—';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
    }).format(date);
  } catch {
    return isoString;
  }
}

// Calculate the 4 main metrics cards
export function calculateOverviewMetrics(
  currentTickets: Chamado[],
  allTicketsCount: number,
  period: PeriodFilter,
  previousTickets: Chamado[]
): MetricCardData[] {
  const currentCount = currentTickets.length;
  const previousCount = previousTickets.length;

  // 1. Total de chamados
  let totalTrend: MetricCardData['trend'] | undefined = undefined;
  if (period !== 'all' && (previousCount > 0 || currentCount > 0)) {
    const diff = currentCount - previousCount;
    const diffPct = previousCount > 0 ? Math.round((diff / previousCount) * 100) : 100;
    totalTrend = {
      diff,
      text: previousCount > 0 ? `${diff >= 0 ? '+' : ''}${diffPct}% vs. período anterior` : 'Sem registros no período anterior',
      isPositive: diff <= 0, // In support, fewer tickets might be positive, but here it's neutral/contextual
    };
  }

  // 2. Chamados de alta prioridade (Alta + Crítica)
  const highAndCriticalTickets = currentTickets.filter((t) => {
    const p = t.prioridade?.trim().toLowerCase();
    return p === 'alta' || p === 'crítica' || p === 'critica';
  });
  const criticalOnly = currentTickets.filter((t) => {
    const p = t.prioridade?.trim().toLowerCase();
    return p === 'crítica' || p === 'critica';
  }).length;
  const highOnly = currentTickets.filter((t) => t.prioridade?.trim().toLowerCase() === 'alta').length;

  const prevHighAndCritical = previousTickets.filter((t) => {
    const p = t.prioridade?.trim().toLowerCase();
    return p === 'alta' || p === 'crítica' || p === 'critica';
  }).length;

  let highTrend: MetricCardData['trend'] | undefined = undefined;
  if (period !== 'all' && (prevHighAndCritical > 0 || highAndCriticalTickets.length > 0)) {
    const diff = highAndCriticalTickets.length - prevHighAndCritical;
    highTrend = {
      diff,
      text: `${diff >= 0 ? '+' : ''}${diff} vs. período anterior`,
      isPositive: diff <= 0,
    };
  }

  // 3. Categoria mais frequente (com tratamento de empate)
  const categoryCounts = new Map<string, number>();
  for (const t of currentTickets) {
    const cat = t.categoria?.trim() || UNCLASSIFIED;
    categoryCounts.set(cat, (categoryCounts.get(cat) || 0) + 1);
  }

  let topCategory = 'Nenhuma';
  let topCategorySubtitle = 'Sem chamados no período';
  if (categoryCounts.size > 0) {
    const maxCatCount = Math.max(...categoryCounts.values());
    const topCats = Array.from(categoryCounts.entries())
      .filter(([_, count]) => count === maxCatCount)
      .map(([name]) => name);

    if (topCats.length === 1) {
      topCategory = topCats[0];
      const pct = currentCount > 0 ? Math.round((maxCatCount / currentCount) * 100) : 0;
      topCategorySubtitle = `${maxCatCount} chamados (${pct}% do total)`;
    } else {
      topCategory = `${topCats.slice(0, 2).join(' e ')}${topCats.length > 2 ? '...' : ''}`;
      topCategorySubtitle = `Empate: ${maxCatCount} chamados cada (${topCats.length} categorias)`;
    }
  }

  // 4. Equipe mais sugerida (IA, com tratamento de empate)
  const teamCounts = new Map<string, number>();
  for (const t of currentTickets) {
    const team = t.equipe_sugerida?.trim() || UNCLASSIFIED;
    teamCounts.set(team, (teamCounts.get(team) || 0) + 1);
  }

  let topTeam = 'Nenhuma';
  let topTeamSubtitle = 'Sem chamados no período';
  if (teamCounts.size > 0) {
    const maxTeamCount = Math.max(...teamCounts.values());
    const topTeams = Array.from(teamCounts.entries())
      .filter(([_, count]) => count === maxTeamCount)
      .map(([name]) => name);

    if (topTeams.length === 1) {
      topTeam = topTeams[0];
      const pct = currentCount > 0 ? Math.round((maxTeamCount / currentCount) * 100) : 0;
      topTeamSubtitle = `Sugerida pela IA (${maxTeamCount} chamados, ${pct}%)`;
    } else {
      topTeam = `${topTeams.slice(0, 2).join(' e ')}${topTeams.length > 2 ? '...' : ''}`;
      topTeamSubtitle = `Empate da IA: ${maxTeamCount} chamados cada`;
    }
  }

  const periodLabel = period === '7d' ? 'nos últimos 7 dias' : period === '30d' ? 'nos últimos 30 dias' : period === '90d' ? 'nos últimos 90 dias' : 'em todo o período';

  return [
    {
      title: 'Total de Chamados',
      value: currentCount,
      subtitle: `${periodLabel} (Base total: ${allTicketsCount})`,
      trend: totalTrend,
      tooltip: 'Contagem de chamados registrados respeitando os filtros e período selecionados.',
      badge: period === 'all' ? 'Geral' : period.toUpperCase(),
      iconName: 'Ticket',
    },
    {
      title: 'Alta e Crítica Prioridade',
      value: highAndCriticalTickets.length,
      subtitle: `${criticalOnly} Crítica(s) + ${highOnly} Alta(s)`,
      trend: highTrend,
      tooltip: 'Soma dos chamados com prioridade Alta e Crítica. Ambas demandam atenção imediata.',
      badge: criticalOnly > 0 ? `${criticalOnly} Crítico(s)` : undefined,
      iconName: 'AlertTriangle',
    },
    {
      title: 'Categoria Mais Frequente',
      value: topCategory,
      subtitle: topCategorySubtitle,
      tooltip: 'Categoria com maior volume de chamados classificados pela IA no período.',
      iconName: 'FolderTree',
    },
    {
      title: 'Equipe Mais Sugerida',
      value: topTeam,
      subtitle: topTeamSubtitle,
      tooltip: 'Equipe recomendada pela IA para atendimento no n8n. Não representa resolução definitiva.',
      badge: 'IA Gemini',
      iconName: 'Users',
    },
  ];
}

// Prepare category chart data
export function getCategoryChartData(tickets: Chamado[]): ChartCategoryData[] {
  const standardCategories = ['Suporte técnico', 'Acesso', 'Serviços', 'Dúvidas', 'Outros'];
  const counts: Record<string, number> = {};

  for (const cat of standardCategories) {
    counts[cat] = 0;
  }

  for (const t of tickets) {
    const raw = t.categoria?.trim() || UNCLASSIFIED;
    // Map case insensitive or match standard
    const matched = standardCategories.find((c) => c.toLowerCase() === raw.toLowerCase());
    const finalKey = matched || raw;
    counts[finalKey] = (counts[finalKey] || 0) + 1;
  }

  const total = tickets.length;
  return Object.entries(counts)
    .filter(([_, count]) => count > 0 || total === 0)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// Prepare priority chart data
export function getPriorityChartData(tickets: Chamado[]): ChartPriorityData[] {
  const priorities = ['Baixa', 'Média', 'Alta', 'Crítica'];
  const counts: Record<string, number> = {
    'Baixa': 0,
    'Média': 0,
    'Alta': 0,
    'Crítica': 0,
  };

  let unclassifiedCount = 0;
  for (const t of tickets) {
    const p = t.prioridade?.trim();
    if (p && priorities.some((item) => item.toLowerCase() === p.toLowerCase())) {
      const match = priorities.find((item) => item.toLowerCase() === p.toLowerCase())!;
      counts[match]++;
    } else {
      unclassifiedCount++;
    }
  }

  const total = tickets.length;
  const result: ChartPriorityData[] = priorities.map((prio) => ({
    name: prio,
    count: counts[prio],
    percentage: total > 0 ? Math.round((counts[prio] / total) * 100) : 0,
    color: PRIORITY_COLORS[prio] || '#64748b',
  }));

  if (unclassifiedCount > 0) {
    result.push({
      name: UNCLASSIFIED,
      count: unclassifiedCount,
      percentage: total > 0 ? Math.round((unclassifiedCount / total) * 100) : 0,
      color: PRIORITY_COLORS[UNCLASSIFIED],
    });
  }

  return result;
}

// Prepare team chart data
export function getTeamChartData(tickets: Chamado[]): ChartTeamData[] {
  const standardTeams = ['TI', 'Infraestrutura', 'Atendimento', 'Operações'];
  const counts: Record<string, number> = {};

  for (const team of standardTeams) {
    counts[team] = 0;
  }

  for (const t of tickets) {
    const raw = t.equipe_sugerida?.trim() || UNCLASSIFIED;
    const matched = standardTeams.find((s) => s.toLowerCase() === raw.toLowerCase());
    const finalKey = matched || raw;
    counts[finalKey] = (counts[finalKey] || 0) + 1;
  }

  const total = tickets.length;
  return Object.entries(counts)
    .filter(([_, count]) => count > 0 || total === 0)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
    }))
    .sort((a, b) => b.count - a.count);
}

// Prepare time evolution chart data
export function getTimeEvolutionChartData(tickets: Chamado[], period: PeriodFilter): ChartTimeData[] {
  if (tickets.length === 0) return [];

  // Group by day for periods <= 30d, or month if > 30d / all
  const useMonthlyGrouping = period === '90d' || period === 'all';
  const groupMap = new Map<string, { label: string; count: number; criticaCount: number; altaCount: number }>();

  // Sort chronological for time graph
  const sorted = [...tickets].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  );

  for (const t of sorted) {
    const date = new Date(t.created_at);
    if (isNaN(date.getTime())) continue;

    let key: string;
    let label: string;

    if (useMonthlyGrouping) {
      // YYYY-MM
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      key = `${year}-${month}`;
      label = new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit' }).format(date);
    } else {
      // YYYY-MM-DD
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      key = `${year}-${month}-${day}`;
      label = `${day}/${month}`;
    }

    if (!groupMap.has(key)) {
      groupMap.set(key, { label, count: 0, criticaCount: 0, altaCount: 0 });
    }

    const entry = groupMap.get(key)!;
    entry.count++;

    const prio = (t.prioridade || '').trim().toLowerCase();
    if (prio === 'crítica' || prio === 'critica') {
      entry.criticaCount++;
    } else if (prio === 'alta') {
      entry.altaCount++;
    }
  }

  return Array.from(groupMap.entries()).map(([rawDate, data]) => ({
    date: data.label,
    rawDate,
    count: data.count,
    criticaCount: data.criticaCount,
    altaCount: data.altaCount,
  }));
}
