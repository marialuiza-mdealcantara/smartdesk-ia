# SmartDesk AI — Dashboard Inteligente de Gestão de Chamados

Uma central moderna, inteligente e responsiva para visualização, acompanhamento e análise analítica de chamados de suporte técnico e operacional, integrada em tempo real ao Supabase e alimentada por um fluxo de automação no n8n Cloud com o modelo de inteligência artificial Google Gemini.

---

## 📌 1. Visão Geral do Fluxo Operacional

O ecossistema completo opera de ponta a ponta sem duplicações:

```
[ Usuário ]
    │
    ▼
[ Formulário n8n Cloud ] ──▶ [ Validação & Prompt Gemini ]
                                       │
                                       ▼
                       [ Triagem Inteligente ]
                       • Categoria
                       • Prioridade (Baixa, Média, Alta, Crítica)
                       • Resumo Executivo
                       • Equipe Sugerida (TI, Infra, Atendimento, Operações)
                                       │
                                       ▼
                       [ Supabase (public.chamados) ]
                                       │
                                       ▼
                    [ SmartDesk AI (React + Supabase JS) ]
                    • Dashboard Operacional
                    • Indicadores & Comparações
                    • Gráficos & Tendências
                    • Tabela com Busca & Detalhes
```

> **Aviso de Integridade:** O SmartDesk AI é a interface de visualização analítica desse pipeline. A automação no n8n Cloud é preservada e não é recriada na aplicação. O botão **"Abrir novo chamado"** encaminha para a URL oficial configurada em `VITE_N8N_FORM_URL`.

---

## 🚀 2. Stack Tecnológica

- **Frontend:** React 19 + TypeScript
- **Build Tool:** Vite
- **Estilização:** Tailwind CSS (paleta profissional neutra e cores semânticas para prioridades)
- **Gráficos:** Recharts (barras horizontais, rosca com destaque visual para chamados críticos, áreas temporais)
- **Ícones:** Lucide React
- **Banco de Dados & Realtime:** Supabase JavaScript Client (`@supabase/supabase-js`)
- **Tipagem Estrita:** TypeScript com verificação de nulos e valores não classificados.

---

## 🔒 3. Segurança e Configuração do Supabase (RLS)

A aplicação consome a tabela `public.chamados`, que possui o seguinte schema:

- `id`: identificador único do chamado.
- `created_at`: data e hora de registro.
- `titulo`: título informado pelo solicitante.
- `descricao`: descrição textual detalhada do problema.
- `tipo_solicitacao`: tipo informado no formulário n8n.
- `categoria`: categoria classificada pela IA (*Suporte técnico*, *Acesso*, *Serviços*, *Dúvidas*, *Outros*).
- `prioridade`: severidade avaliada pela IA (*Baixa*, *Média*, *Alta*, *Crítica*).
- `resumo`: síntese contextual gerada pelo Gemini.
- `equipe_sugerida`: direcionamento recomendado pela IA (*TI*, *Infraestrutura*, *Atendimento*, *Operações*).
- `status`: status atual do chamado.

### Princípios de Segurança Mandatórios
1. **Nunca use a `service_role`:** O frontend utiliza única e exclusivamente a chave pública anônima (`anon key`).
2. **Row Level Security (RLS) Ativo:** O RLS não deve ser desabilitado.

### Política de Leitura Recomendada no Supabase
Para que a role `anon` possa consultar os chamados sem comprometer a escrita ou a segurança de outras tabelas, execute o seguinte comando no **SQL Editor** do Supabase:

```sql
-- Criar política que autoriza leitura para visitantes / clientes públicos
create policy "Permitir leitura de chamados anon"
on public.chamados
for select
to anon
using (true);
```

---

## ⚙️ 4. Variáveis de Ambiente

Crie o arquivo `.env` na raiz do projeto (ou copie de `.env.example`):

```bash
# URL do projeto no Supabase
VITE_SUPABASE_URL=https://seu-projeto.supabase.co

# Anon Public Key do Supabase (Project Settings > API)
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# URL de produção do formulário de abertura de chamados no n8n Cloud
VITE_N8N_FORM_URL=https://seu-workspace.app.n8n.cloud/form/...
```

> **Dica de Usabilidade:** Você também pode informar ou testar essas credenciais diretamente pela interface da aplicação através do modal **"Conexão Supabase"** no cabeçalho ou no rodapé da barra lateral.

---

## 🛠️ 5. Como Executar a Aplicação

### Pré-requisitos
- Node.js (v20.x ou superior)
- npm

### Passo a passo

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse no navegador: `http://localhost:5173/`

3. **Compilar para produção:**
   ```bash
   npm run build
   ```

---

## 📊 6. Regras de Negócio e Indicadores Implementados

- **Total de Chamados:** Volume exato no período selecionado (7 dias, 30 dias, 90 dias ou histórico completo), acompanhado de cálculo percentual comparativo com o período imediatamente anterior.
- **Alta e Crítica Prioridade:** Soma os chamados de severidade "Alta" e "Crítica" com distinção clara das regras operacionais e badge pulsante para casos críticos.
- **Categoria Mais Frequente:** Calcula a categoria com maior volume de chamados no período, tratando explicitamente eventuais empates.
- **Equipe Mais Sugerida:** Identifica a equipe com maior número de indicações pela IA, destacando em todos os componentes que se trata de uma **recomendação preditiva da IA** e não necessariamente da equipe de resolução final.
- **Supabase Realtime:** Quando conectado, escuta eventos da tabela `public.chamados` e atualiza instantaneamente a interface assim que novos registros chegam do n8n.
- **Tratamento de Dados Incompletos:** Registros antigos ou campos ausentes são rotulados transparentemente como `Não classificado`.
