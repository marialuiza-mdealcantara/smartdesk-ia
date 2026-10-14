import { createClient, type SupabaseClient } from '@supabase/supabase-js';

// Configuration storage keys
const STORAGE_URL_KEY = 'smartdesk_supabase_url';
const STORAGE_KEY_KEY = 'smartdesk_supabase_anon_key';
const STORAGE_N8N_KEY = 'smartdesk_n8n_form_url';

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  n8nFormUrl: string;
  isConfigured: boolean;
  source: 'env' | 'localStorage' | 'none';
}

export function getAppConfig(): SupabaseConfig {
  const envUrl = import.meta.env.VITE_SUPABASE_URL?.trim();
  const envKey = import.meta.env.VITE_SUPABASE_ANON_KEY?.trim();
  const envN8n = import.meta.env.VITE_N8N_FORM_URL?.trim();

  const localUrl = localStorage.getItem(STORAGE_URL_KEY)?.trim();
  const localKey = localStorage.getItem(STORAGE_KEY_KEY)?.trim();
  const localN8n = localStorage.getItem(STORAGE_N8N_KEY)?.trim();

  const url = envUrl || localUrl || '';
  const anonKey = envKey || localKey || '';
  const n8nFormUrl = envN8n || localN8n || '';

  const isConfigured = Boolean(url && anonKey);
  const source = envUrl && envKey ? 'env' : localUrl && localKey ? 'localStorage' : 'none';

  return { url, anonKey, n8nFormUrl, isConfigured, source };
}

export function saveLocalConfig(url: string, anonKey: string, n8nFormUrl?: string) {
  if (url) localStorage.setItem(STORAGE_URL_KEY, url.trim());
  else localStorage.removeItem(STORAGE_URL_KEY);

  if (anonKey) localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  else localStorage.removeItem(STORAGE_KEY_KEY);

  if (n8nFormUrl) localStorage.setItem(STORAGE_N8N_KEY, n8nFormUrl.trim());
  else localStorage.removeItem(STORAGE_N8N_KEY);

  // Reset cached client
  cachedClient = null;
}

export function clearLocalConfig() {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  localStorage.removeItem(STORAGE_N8N_KEY);
  cachedClient = null;
}

let cachedClient: SupabaseClient | null = null;
let lastClientKey: string = '';

export function getSupabaseClient(): SupabaseClient | null {
  const config = getAppConfig();
  if (!config.isConfigured) {
    return null;
  }

  const clientKey = `${config.url}|${config.anonKey}`;
  if (!cachedClient || lastClientKey !== clientKey) {
    // Security check: Never accept service_role key
    if (config.anonKey.includes('service_role') || config.anonKey.startsWith('sb_secret')) {
      console.error('ALERTA DE SEGURANÇA: Chaves administrativas (service_role) não são permitidas no frontend.');
      throw new Error('Chave administrativa (service_role) detectada. Use exclusivamente a anon/publishable key pública.');
    }

    cachedClient = createClient(config.url, config.anonKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
    lastClientKey = clientKey;
  }

  return cachedClient;
}

export interface ConnectionTestResult {
  ok: boolean;
  message: string;
  statusCode?: number;
  errorDetail?: string;
  rowCount?: number;
  hasRlsIssue?: boolean;
}

export async function testSupabaseConnection(): Promise<ConnectionTestResult> {
  const config = getAppConfig();
  if (!config.isConfigured) {
    return {
      ok: false,
      message: 'Credenciais do Supabase não configuradas.',
      errorDetail: 'Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY no arquivo .env ou configure nas preferências da aplicação.',
    };
  }

  try {
    const client = getSupabaseClient();
    if (!client) {
      return { ok: false, message: 'Falha ao inicializar cliente Supabase.' };
    }

    // Try reading one record from public.chamados to test access and RLS
    const { data, error, count } = await client
      .from('chamados')
      .select('id', { count: 'exact', head: false })
      .limit(1);

    if (error) {
      // Check if it's an RLS issue or permission denied
      const isRls = error.code === '42501' || error.message?.toLowerCase().includes('permission denied') || error.message?.toLowerCase().includes('row-level security');
      return {
        ok: false,
        message: isRls ? 'Acesso negado pela política RLS (Row Level Security).' : `Erro ao consultar a tabela 'chamados': ${error.message}`,
        errorDetail: error.details || error.hint || error.message,
        hasRlsIssue: isRls,
      };
    }

    return {
      ok: true,
      message: 'Conexão com o Supabase estabelecida com sucesso!',
      rowCount: count ?? (data ? data.length : 0),
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return {
      ok: false,
      message: 'Falha ao conectar ao Supabase.',
      errorDetail: errorMsg,
    };
  }
}
