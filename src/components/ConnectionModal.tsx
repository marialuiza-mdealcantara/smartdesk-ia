import React, { useState, useEffect } from 'react';
import { 
  X, 
  Database, 
  Key, 
  Globe, 
  CheckCircle2, 
  AlertCircle, 
  ShieldCheck, 
  Terminal, 
  Copy, 
  Check,
  RefreshCw,
  ExternalLink
} from 'lucide-react';
import { getAppConfig, saveLocalConfig, testSupabaseConnection, type ConnectionTestResult } from '../lib/supabase';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigSaved: () => void;
}

export const ConnectionModal: React.FC<ConnectionModalProps> = ({
  isOpen,
  onClose,
  onConfigSaved,
}) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [n8nUrl, setN8nUrl] = useState('');
  const [testResult, setTestResult] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [source, setSource] = useState<'env' | 'localStorage' | 'none'>('none');

  useEffect(() => {
    if (isOpen) {
      const cfg = getAppConfig();
      setUrl(cfg.url);
      setAnonKey(cfg.anonKey);
      setN8nUrl(cfg.n8nFormUrl);
      setSource(cfg.source);
      if (cfg.isConfigured) {
        runTest();
      } else {
        setTestResult(null);
      }
    }
  }, [isOpen]);

  const runTest = async () => {
    setTesting(true);
    const result = await testSupabaseConnection();
    setTestResult(result);
    setTesting(false);
  };

  const handleSave = () => {
    // Security check: service_role
    if (anonKey.includes('service_role') || anonKey.startsWith('sb_secret')) {
      alert('ATENÇÃO DE SEGURANÇA: Nunca utilize chaves de administração (service_role ou secret) no frontend da aplicação. Utilize exclusivamente a chave pública anon (publishable key).');
      return;
    }

    saveLocalConfig(url, anonKey, n8nUrl);
    runTest();
    onConfigSaved();
  };

  const sqlPolicy = `-- Política segura de leitura no Supabase SQL Editor:
create policy "Permitir leitura de chamados anon" 
on public.chamados 
for select 
to anon 
using (true);`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlPolicy);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Configuração da Conexão Supabase
              </h2>
              <p className="text-xs text-slate-500">
                Integração direta com o projeto existente e a tabela <code className="font-mono text-brand-700 bg-brand-50 px-1 py-0.2 rounded">public.chamados</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Security Notice & Source */}
          <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-start justify-between gap-3">
            <div className="flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-brand-600 shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong className="text-slate-800">Segurança do Frontend:</strong> As consultas utilizam exclusivamente a chave pública (<code className="font-mono bg-slate-200/80 px-1 rounded text-slate-700">anon key</code>). O Row Level Security (RLS) permanece habilitado no banco.
              </div>
            </div>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-200 text-slate-700 shrink-0">
              Origem: {source === 'env' ? '.env' : source === 'localStorage' ? 'Navegador' : 'Não definida'}
            </span>
          </div>

          {/* Form Fields */}
          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL do Supabase (VITE_SUPABASE_URL)
              </label>
              <div className="relative">
                <Globe className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="https://xyzproject.supabase.co"
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Anon Key Pública (VITE_SUPABASE_ANON_KEY)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={anonKey}
                  onChange={(e) => setAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                URL do Formulário n8n (VITE_N8N_FORM_URL)
              </label>
              <div className="relative">
                <ExternalLink className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={n8nUrl}
                  onChange={(e) => setN8nUrl(e.target.value)}
                  placeholder="https://seu-workspace.app.n8n.cloud/form/..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                URL do formulário de abertura de chamados já implementado no n8n Cloud.
              </p>
            </div>
          </div>

          {/* Connection Test Result */}
          {testResult && (
            <div className={`p-4 rounded-xl border text-xs ${
              testResult.ok 
                ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900' 
                : 'bg-rose-50/80 border-rose-200 text-rose-900'
            }`}>
              <div className="flex items-center gap-2 font-bold mb-1">
                {testResult.ok ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600" />
                )}
                <span>{testResult.message}</span>
              </div>
              {testResult.errorDetail && (
                <p className="text-[11px] text-rose-700 font-mono mt-1">
                  Detalhe: {testResult.errorDetail}
                </p>
              )}
              {testResult.ok && testResult.rowCount !== undefined && (
                <p className="text-[11px] text-emerald-700 mt-1">
                  Registros encontrados em <code>public.chamados</code>: <strong>{testResult.rowCount}</strong>
                </p>
              )}
            </div>
          )}

          {/* RLS Guidance Section */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span>Política de Leitura RLS no Supabase</span>
              </div>
              <button
                onClick={copySql}
                className="flex items-center gap-1 px-2 py-1 bg-white border border-slate-200 rounded text-[11px] font-medium text-slate-700 hover:bg-slate-100 transition-colors"
              >
                {copiedSql ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSql ? 'Copiado!' : 'Copiar SQL'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">
              Caso as consultas retornem vazias devido ao RLS ativo, execute este comando no <em>SQL Editor</em> do Supabase para permitir leitura segura pelo perfil público/anon:
            </p>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-emerald-400 font-mono text-[11px] overflow-x-auto">
              {sqlPolicy}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            type="button"
            onClick={runTest}
            disabled={testing || !url || !anonKey}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${testing ? 'animate-spin' : ''}`} />
            <span>Testar Conexão</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
            >
              Fechar
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
            >
              Salvar Credenciais
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
