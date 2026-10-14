# SmartDesk AI — Central Inteligente de Triagem e Gestão de Chamados com IA

Projeto de automação inteligente de processos, integração de serviços em nuvem, inteligência artificial generativa aplicada e visualização operacional de dados de suporte.

---

## 📋 1. Apresentação e Objetivo

O **SmartDesk AI** é uma solução completa que integra captura de demandas, classificação semântica com inteligência artificial, persistência estruturada em banco de dados e apresentação analítica em tempo real.

O objetivo do projeto é demonstrar, na prática, como conectar ferramentas de automação no-code/low-code (**n8n Cloud**), modelos fundacionais de linguagem (**Google Gemini**) e bancos de dados relacionais gerenciados (**Supabase**) para eliminar tarefas operacionais repetitivas de triagem, reduzindo o tempo de resposta e direcionando chamados com precisão.

---

## 🎯 2. Problema que o Projeto Resolve

Em centrais de atendimento e suporte técnico convencionais, o processo de triagem inicial costuma ser manual e suscetível a gargalos:

- **Classificação inconsistente:** chamados idênticos recebem categorias ou níveis de prioridade divergentes de acordo com a pessoa que realiza a triagem manual.
- **Atraso no encaminhamento:** chamados críticos (quedas de sistema, indisponibilidade total) ficam na mesma fila que dúvidas simples de usuários.
- **Falta de visibilidade consolidada:** dificuldade em identificar tendências recorrentes de incidentes ou gargalos operacionais sem esforço manual de relatórios.

O SmartDesk AI soluciona esse cenário automatizando a triagem no momento exato em que o chamado é enviado, validando os dados e disponibilizando indicadores imediatos para tomada de decisão.

---

## ⚡ 3. Principais Funcionalidades

- **Abertura e Captura Automatizada:** Formulário de produção no n8n Cloud para submissão direta do usuário com validação de campos.
- **Triagem Cognitiva com IA:** Inferência contextual pelo Google Gemini que interpreta o texto livre e define:
  - **Categoria:** *Suporte técnico*, *Acesso*, *Serviços*, *Dúvidas* ou *Outros*.
  - **Prioridade:** *Baixa*, *Média*, *Alta* ou *Crítica*.
  - **Resumo Executivo:** Síntese concisa do problema para rápida leitura dos analistas.
  - **Equipe Recomendada:** Sugestão preditiva de roteamento operacional (*TI*, *Infraestrutura*, *Atendimento* ou *Operações*).
- **Validação Estruturada:** Workflow no n8n que valida o schema da resposta da IA antes da gravação no banco.
- **Persistência Segura no Supabase:** Gravação dos dados tratados na tabela `public.chamados` protegida com Row Level Security (RLS).
- **Atualização em Tempo Real (Supabase Realtime):** Novos chamados processados pelo n8n aparecem instantaneamente no dashboard sem recarregar a página.
- **Painel Analítico Completo:**
  - Métricas consolidadas com cálculo de variação versus período anterior.
  - Gráficos de distribuição por categoria, severidade e equipe sugerida.
  - Curva de evolução temporal agrupada por dia ou mês.
  - Tabela com filtros combinados (período, categoria, prioridade, equipe e status) e busca textual por palavras-chave.
  - Modal de auditoria detalhada com descrição original e justificativa da IA.

---

## 🏗️ 4. Arquitetura e Fluxo dos Dados

O ecossistema opera de ponta a ponta sem dependências circulares:

```
┌─────────────────┐
│     Usuário     │
└────────┬────────┘
         │ (1) Preenche formulário
         ▼
┌────────────────────────────────────────────────────────┐
│                      n8n Cloud                         │
│  ┌──────────────────┐      ┌────────────────────────┐  │
│  │ n8n Form Trigger │ ───▶ │ Montagem do Prompt     │  │
│  └──────────────────┘      └───────────┬────────────┘  │
└────────────────────────────────────────┼───────────────┘
                                         │ (2) Envia payload
                                         ▼
                             ┌───────────────────────┐
                             │     Google Gemini     │
                             │ (Triagem & Inferência)│
                             └───────────┬───────────┘
                                         │ (3) Retorno estruturado (JSON)
                                         ▼
┌────────────────────────────────────────────────────────┐
│                      n8n Cloud                         │
│  ┌──────────────────┐      ┌────────────────────────┐  │
│  │ Validação Schema │ ───▶ │ Supabase Node (Insert) │  │
│  └──────────────────┘      └───────────┬────────────┘  │
└────────────────────────────────────────┼───────────────┘
                                         │ (4) Gravação persistida
                                         ▼
                             ┌───────────────────────┐
                             │       Supabase        │
                             │   (public.chamados)   │
                             │   [RLS Habilitado]    │
                             └───────────┬───────────┘
                                         │ (5) Consulta & Realtime
                                         ▼
                             ┌───────────────────────┐
                             │     SmartDesk AI      │
                             │ (Dashboard & Gestão)  │
                             └───────────────────────┘
```

---

## 🛠️ 5. Tecnologias e Ferramentas Utilizadas

### Principais (Automação, IA e Dados)

- **n8n Cloud:** Orquestrador do fluxo de ponta a ponta. Gerencia a captura pelo formulário web, formata os prompts com variáveis dinâmicas, se comunica via API com o Gemini, sanitiza a resposta e persiste os dados no Supabase.
- **Google Gemini:** Modelo de IA generativa configurado para extração e classificação semântica com saída estritamente estruturada.
- **Supabase (PostgreSQL Gerenciado):** Camada de persistência relacional com suporte a Row Level Security (RLS) e mensageria Realtime via WebSockets.
- **Antigravity:** Ferramenta de inteligência artificial aplicada utilizada para auxiliar na concepção, estruturação, geração dos componentes de interface e integração com o cliente Supabase.

### Tecnologias da Interface Web

A interface web foi desenvolvida com auxílio do **Antigravity** para acelerar a entrega do dashboard analítico sobre a base do Supabase, utilizando:

- **React 19 com TypeScript:** Componentização declarativa e tipagem estrita de contratos de dados.
- **Vite:** Ferramenta de build moderna e de alta performance.
- **Tailwind CSS:** Estilização utilitária com paleta neutra e cores semânticas para prioridades operacionais.
- **Recharts:** Renderização de gráficos vetoriais responsivos (barras, rosca e áreas temporais).
- **Lucide React:** Biblioteca consistente de ícones de interface.
- **Supabase JS Client (`@supabase/supabase-js`):** Consultas diretas ao PostgREST e subscrição de canais Realtime.

---

## 🗄️ 6. Organização do Workflow e Estrutura dos Dados

### Estrutura da Tabela `public.chamados`

O schema do Supabase foi desenhado para armazenar tanto os dados brutos informados pelo solicitante quanto os atributos enriquecidos pela IA:

| Coluna | Tipo | Origem | Descrição |
|:---|:---|:---|:---|
| `id` | `int8` / `uuid` | Supabase | Identificador exclusivo do chamado |
| `created_at` | `timestamptz` | Supabase | Data e hora exata da abertura |
| `titulo` | `text` | Formulário n8n | Título informado pelo solicitante |
| `descricao` | `text` | Formulário n8n | Detalhamento do problema ou solicitação |
| `tipo_solicitacao`| `text` | Formulário n8n | Tipo indicado pelo usuário no envio |
| `categoria` | `text` | Google Gemini | Categoria atribuída (*Suporte técnico*, *Acesso*, *Serviços*, *Dúvidas*, *Outros*) |
| `prioridade` | `text` | Google Gemini | Severidade inferida (*Baixa*, *Média*, *Alta*, *Crítica*) |
| `resumo` | `text` | Google Gemini | Resumo executivo sintetizado em 1 a 2 frases |
| `equipe_sugerida` | `text` | Google Gemini | Time recomendado (*TI*, *Infraestrutura*, *Atendimento*, *Operações*) |
| `status` | `text` | n8n / Workflow | Situação do chamado (ex: *Triado*, *Pendente*, *Em andamento*) |

---

## 🔒 7. Segurança, RLS e Proteção de Credenciais

Para publicação e uso seguro em ambiente web, foram adotados princípios rigorosos de segurança:

1. **Proteção de Segredos e `.gitignore`:**
   - O arquivo `.env` com as chaves reais está explicitamente adicionado ao `.gitignore` e **nunca** é versionado no repositório Git.
   - É disponibilizado apenas o template [`.env.example`](.env.example) contendo as variáveis necessárias sem valores sensíveis.
2. **Uso Exclusivo da Chave Pública (`anon`):**
   - O frontend utiliza única e exclusivamente a chave pública anônima (`publishable key`).
   - A chave administrativa `service_role` **nunca** é exposta no código-fonte nem enviada ao navegador do cliente.
3. **Row Level Security (RLS) no Supabase:**
   - A segurança a nível de linha permanece ativa na tabela `public.chamados`.
   - Para permitir a visualização pelo dashboard, aplica-se uma política restrita de leitura (`SELECT`) para a role `anon`:

```sql
create policy "Permitir leitura de chamados anon"
on public.chamados
for select
to anon
using (true);
```

> **Aviso de Integridade:** Escrita, atualização e deleção não são permitidas publicamente pela role `anon`, sendo gerenciadas exclusivamente pelo n8n via credenciais autenticadas.

---

## ⚙️ 8. Configuração Local e Variáveis de Ambiente

### Pré-requisitos
- Node.js (versão 20.x ou superior)
- npm

### 1. Clonar o repositório
```bash
git clone https://github.com/SEU_USUARIO/smartdesk-ai.git
cd smartdesk-ai
```

### 2. Configurar as variáveis de ambiente
Crie um arquivo `.env` na raiz do projeto a partir do exemplo:

```bash
cp .env.example .env
```

Preencha com os dados do seu projeto:

```env
# URL do projeto no Supabase (Project Settings > API)
VITE_SUPABASE_URL=https://seu-projeto.supabase.co

# Anon Public Key (Publishable Key) do Supabase
VITE_SUPABASE_ANON_KEY=sb_publishable_...

# URL de produção do formulário de abertura de chamados no n8n Cloud
VITE_N8N_FORM_URL=https://seu-workspace.app.n8n.cloud/form/...
```

---

## 🚀 9. Instruções de Execução

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Executar em modo de desenvolvimento:**
   ```bash
   npm run dev
   ```
   Acesse a aplicação no navegador em: `http://localhost:5173/`

3. **Gerar build de produção:**
   ```bash
   npm run build
   ```

---

## 📊 10. Regras de Negócio e Indicadores Operacionais

O dashboard calcula seus indicadores exclusivamente a partir dos registros reais do Supabase:

- **Total de Chamados:** Volume registrado no período selecionado (7 dias, 30 dias, 90 dias ou histórico completo), acompanhado de cálculo comparativo com o período imediatamente anterior.
- **Chamados de Alta Prioridade:** Soma os chamados com severidade "Alta" e "Crítica" com distinção clara das regras operacionais e badge visual para incidentes críticos.
- **Categoria Mais Frequente:** Identifica a categoria predominante, tratando explicitamente empates caso ocorram.
- **Equipe Mais Sugerida:** Exibe a equipe indicada pela IA, explicitando em toda a interface que se trata de uma recomendação preditiva da triagem e não necessariamente da equipe de resolução final.
- **Dados Ausentes ou Legados:** Campos vazios ou não classificados são transparentemente rotulados como `Não classificado`.

---

## 🔮 11. Limitações Conhecidas e Próximos Passos

### Limitações da Versão Atual
- A tabela `public.chamados` armazena o status atual de leitura, mas não registra histórico completo de timestamps de resolução (`resolved_at`, `closed_at`). Por esse motivo, indicadores de SLA cumprido e tempo médio de resolução (MTTR) foram conscientemente omitidos para evitar métricas imprecisas ou simuladas.
- A alteração de status pelo frontend não está habilitada, preservando a autorização de escrita exclusivamente para automações autenticadas.

### Melhorias Futuras
- **Autenticação de Analistas:** Adição de login via Supabase Auth para permitir que operadores alterem o status do chamado (ex: *Em atendimento*, *Resolvido*).
- **Métricas de SLA:** Expansão do schema no Supabase para registrar timestamps de primeira resposta e resolução final.
- **Feedback Loop da IA:** Mecanismo para o operador aprovar ou corrigir a classificação da IA, enviando feedback para refinamento contínuo dos prompts no n8n.
- **Notificações Operacionais:** Envio de alertas automáticos via Slack/Discord pelo n8n quando um chamado de prioridade `Crítica` for identificado pelo Gemini.

---

## 📄 Licença

Este projeto está sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
