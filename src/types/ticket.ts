export type Priority = 'Baixa' | 'Média' | 'Alta' | 'Crítica' | string;

export type Category = 
  | 'Suporte técnico' 
  | 'Acesso' 
  | 'Serviços' 
  | 'Dúvidas' 
  | 'Outros' 
  | string;

export type SuggestedTeam = 
  | 'TI' 
  | 'Infraestrutura' 
  | 'Atendimento' 
  | 'Operações' 
  | string;

export interface Chamado {
  id: string | number;
  created_at: string;
  titulo: string;
  descricao: string;
  tipo_solicitacao?: string | null;
  categoria?: Category | null;
  prioridade?: Priority | null;
  resumo?: string | null;
  equipe_sugerida?: SuggestedTeam | null;
  status?: string | null;
}

export type PeriodFilter = '7d' | '30d' | '90d' | 'all';

export interface TicketFilters {
  period: PeriodFilter;
  categoria: string;
  prioridade: string;
  equipe_sugerida: string;
  status: string;
  search: string;
}

export interface MetricCardData {
  title: string;
  value: string | number;
  subtitle: string;
  trend?: {
    diff: number;
    text: string;
    isPositive: boolean | null;
  };
  tooltip?: string;
  badge?: string;
  iconName: string;
}

export interface ChartCategoryData {
  name: string;
  count: number;
  percentage: number;
}

export interface ChartPriorityData {
  name: string;
  count: number;
  percentage: number;
  color: string;
}

export interface ChartTeamData {
  name: string;
  count: number;
  percentage: number;
}

export interface ChartTimeData {
  date: string;
  rawDate: string;
  count: number;
  criticaCount: number;
  altaCount: number;
}
