import React from 'react';
import { 
  X, 
  ExternalLink, 
  Workflow, 
  Settings, 
  AlertCircle 
} from 'lucide-react';
import { getAppConfig } from '../lib/supabase';

interface N8nModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}

export const N8nModal: React.FC<N8nModalProps> = ({
  isOpen,
  onClose,
  onOpenSettings,
}) => {
  if (!isOpen) return null;

  const config = getAppConfig();
  const hasUrl = Boolean(config.n8nFormUrl && config.n8nFormUrl.trim());

  const handleOpenForm = () => {
    if (hasUrl) {
      window.open(config.n8nFormUrl, '_blank', 'noopener,noreferrer');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
      >
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200 flex items-center justify-center">
              <Workflow className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-['Plus_Jakarta_Sans']">
                Abertura de Chamado (n8n Cloud)
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs sm:text-sm">
          {hasUrl ? (
            <div className="space-y-3">
              <p className="text-slate-600 leading-relaxed">
                Você será redirecionado para o formulário oficial de triagem inteligente no n8n Cloud. Ao enviar, o workflow executará a análise com o modelo <strong>Google Gemini</strong> e registrará o chamado diretamente no Supabase.
              </p>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 font-mono text-[11px] text-slate-700 truncate">
                {config.n8nFormUrl}
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="text-xs text-amber-800 leading-relaxed">
                  <strong>URL do Formulário não configurada:</strong>
                  <br />
                  O botão direciona para o formulário de produção já existente no n8n Cloud. Para ativá-lo, defina a variável <code className="font-mono bg-amber-100/80 px-1 rounded">VITE_N8N_FORM_URL</code> no arquivo <code className="font-mono bg-amber-100/80 px-1 rounded">.env</code> ou configure nas opções da aplicação.
                </div>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                Conforme as regras do projeto, o formulário de abertura não é recriado nesta interface, garantindo a integração fiel com a automação existente no n8n.
              </p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-lg transition-colors font-medium"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Configurar URL</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            {hasUrl && (
              <button
                onClick={handleOpenForm}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-brand-600 hover:bg-brand-700 rounded-lg shadow-sm transition-colors"
              >
                <span>Acessar Formulário n8n</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
