import { getSupabaseClient } from '../lib/supabase';
import type { Chamado } from '../types/ticket';

export interface FetchTicketsResult {
  data: Chamado[];
  error: string | null;
  hasRlsIssue?: boolean;
}

export async function fetchAllTickets(): Promise<FetchTicketsResult> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      data: [],
      error: 'Credenciais do Supabase não configuradas.',
    };
  }

  try {
    const { data, error } = await supabase
      .from('chamados')
      .select('id, created_at, titulo, descricao, tipo_solicitacao, categoria, prioridade, resumo, equipe_sugerida, status')
      .order('created_at', { ascending: false });

    if (error) {
      const isRls = error.code === '42501' || 
        error.message?.toLowerCase().includes('permission denied') || 
        error.message?.toLowerCase().includes('row-level security');
      
      return {
        data: [],
        error: isRls
          ? 'Permissão negada (RLS). A tabela chamados possui Row Level Security ativo e necessita de uma política de SELECT para o perfil público/anon.'
          : error.message,
        hasRlsIssue: isRls,
      };
    }

    return {
      data: (data || []) as Chamado[],
      error: null,
    };
  } catch (err: unknown) {
    return {
      data: [],
      error: err instanceof Error ? err.message : 'Falha desconhecida ao buscar chamados',
    };
  }
}

export async function fetchTicketById(id: string | number): Promise<{ data: Chamado | null; error: string | null }> {
  const supabase = getSupabaseClient();
  if (!supabase) {
    return { data: null, error: 'Credenciais do Supabase não configuradas.' };
  }

  try {
    const { data, error } = await supabase
      .from('chamados')
      .select('id, created_at, titulo, descricao, tipo_solicitacao, categoria, prioridade, resumo, equipe_sugerida, status')
      .eq('id', id)
      .single();

    if (error) {
      return { data: null, error: error.message };
    }

    return { data: data as Chamado, error: null };
  } catch (err: unknown) {
    return { data: null, error: err instanceof Error ? err.message : 'Erro ao buscar detalhes do chamado' };
  }
}
