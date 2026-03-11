# ERP SaaS Sorveteria & Açougue - TODO

## Funcionalidades Obrigatórias

### 1. Autenticação e Controle de Acesso
- [x] Sistema de autenticação com OAuth do Manus
- [x] Controle de acesso multi-usuário
- [x] Gerenciamento de perfis de usuário (admin/user)
- [x] Logout e sessão segura

### 2. Gestão de Produtos
- [x] Página de listagem de produtos
- [x] Tabela de produtos no banco de dados
- [x] Sistema de categorias de produtos
- [x] Campos: SKU, código de barras, preço de custo, preço de venda
- [x] Controle de estoque com estoque mínimo
- [x] Ativação/desativação de produtos
- [ ] Formulário de criação/edição
- [ ] Importação em lote via CSV/Excel

### 3. Módulo de Vendas
- [x] Página de vendas com histórico
- [x] Tabela de vendas no banco de dados
- [ ] Carrinho de compras
- [ ] Sistema de desconto
- [ ] Múltiplos métodos de pagamento (dinheiro, cartão crédito/débito, PIX, boleto)
- [ ] Cancelamento de vendas
- [ ] Integração com estoque (redução automática)

### 4. Gestão de Clientes (CRM)
- [x] Página de clientes
- [x] Tabela de clientes no banco de dados
- [x] Campos: nome, email, telefone, endereço, notas
- [ ] Formulário de criação/edição
- [ ] Histórico de compras por cliente
- [ ] Busca e filtros

### 5. Controle de Caixa
- [x] Página de caixa com transações
- [x] Tabela de transações no banco de dados
- [x] Registro de transações (entrada/saída)
- [x] Categorização de transações
- [x] Múltiplos métodos de pagamento
- [x] Resumo de caixa (entradas, saídas, saldo)
- [ ] Histórico por período
- [ ] Relatório de fluxo de caixa

### 6. Sistema de Alertas de Estoque
- [x] Tabela de alertas no banco de dados
- [ ] Alertas de estoque baixo
- [ ] Notificações automáticas
- [x] Configuração de estoque mínimo por produto
- [ ] Histórico de alertas

### 7. Relatórios Financeiros e de Produtos
- [x] Página de relatórios
- [x] Gráficos interativos (vendas, receita, lucro)
- [ ] Relatório de vendas (período, cliente, produto)
- [ ] Relatório de estoque
- [ ] Relatório financeiro (receita, despesa, lucro)
- [ ] Exportação de relatórios (PDF, Excel)

### 8. Dashboard Administrativo
- [x] Sidebar navigation elegante
- [x] Visão geral do negócio (KPIs)
- [x] Widgets de resumo (vendas, estoque, clientes, alertas)
- [x] Gráficos de performance (vendas, distribuição de pagamentos)
- [x] Menu de navegação intuitivo

### 9. Importação em Lote
- [ ] Upload de arquivo CSV/Excel
- [ ] Validação de dados
- [ ] Importação de produtos
- [ ] Feedback de sucesso/erro

### 10. Sistema de Backup
- [x] Página de backup
- [x] Tabela de backups no banco de dados
- [ ] Backup automático dos dados
- [ ] Backup manual sob demanda
- [ ] Histórico de backups
- [ ] Download de backups
- [ ] Restauração de dados

## Design e Interface

### Estilo Visual
- [x] Paleta de cores profissional (azul profissional, branco, acentos)
- [x] Tipografia refinada e elegante
- [x] Espaçamento generoso
- [x] Sombras suaves
- [x] Transições fluidas
- [ ] Responsividade mobile completa

### Componentes UI
- [x] DashboardLayout com sidebar
- [x] Tabelas elegantes
- [ ] Tabelas com paginação
- [ ] Formulários elegantes
- [ ] Modais e diálogos
- [x] Notificações (toast)
- [x] Loading states

## Infraestrutura e Testes

- [ ] Esquema de banco de dados completo
- [ ] Migrations SQL
- [ ] Testes unitários (Vitest)
- [ ] Testes de integração
- [ ] Tratamento de erros robusto
- [ ] Validação de dados

## Publicação

- [ ] Checkpoint final
- [ ] Publicação do projeto
- [ ] Documentação de uso
