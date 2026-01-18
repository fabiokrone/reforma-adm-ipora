# Dashboard Iporã do Oeste - Antes da Reforma Administrativa

Dashboard interativo para visualização da situação atual dos servidores municipais de Iporã do Oeste/SC, antes da implementação da reforma administrativa.

## 📊 Sobre o Projeto

Este projeto apresenta uma análise completa e visual dos 213 servidores municipais e suas respectivas tabelas salariais. O dashboard oferece métricas, gráficos interativos e tabelas detalhadas para auxiliar gestores municipais na tomada de decisões.

## ✨ Funcionalidades

### KPIs Principais
- Total de servidores (213)
- Massa salarial total
- Salário médio
- Total de níveis salariais únicos
- Menor e maior salário

### Gráficos Interativos
1. **Distribuição de Servidores por Nível** - Barras horizontais mostrando os 15 níveis mais comuns
2. **Distribuição por Cargo** - Gráfico de pizza com os 10 cargos mais frequentes
3. **Faixas Salariais** - Histograma com distribuição por faixas (< 2k, 2-3k, 3-4k, etc.)
4. **Distribuição Grau × Referência** - Análise da estrutura de níveis
5. **Top 10 Maiores Salários** - Ranking dos maiores salários com identificação
6. **Massa Salarial por Cargo** - Top 10 cargos por custo total

### Tabelas Interativas
- **Lista Completa de Servidores**
  - Busca por nome
  - Filtro por cargo
  - Ordenação por qualquer coluna (nome, cargo, nível, salário)
  - Formatação em real brasileiro (R$)

- **Tabela de Níveis Salariais**
  - Formato pivot: GRAU (linhas) × REFERÊNCIA (colunas)
  - Código de cores por faixa salarial
  - Visualização completa da estrutura de cargos

## 🎯 Funcionalidades Especiais

### Sistema de Navegação ANTES/DEPOIS
Interface com abas navegáveis que permitem alternar entre:
- **ANTES**: Visualização completa da situação atual (213 servidores, KPIs, gráficos, tabelas)
- **DEPOIS**: Placeholder preparado para dados da nova estrutura pós-reforma

### Sistema Interativo de Destaque de Posição
**Como funciona:**
1. Clique em qualquer servidor na tabela de servidores
2. O sistema automaticamente:
   - Faz scroll até a tabela salarial correspondente
   - Destaca o grid do nível do servidor com borda colorida e animação
   - Marca a célula exata (GRAU × REFERÊNCIA) onde o servidor está posicionado
   - Exibe badge com informações do servidor selecionado

**Recursos visuais:**
- Célula destacada com gradiente verde/azul e ícone ⭐
- Animação de pulse suave na célula selecionada
- Breadcrumb mostrando: Servidor → Nível-Grau-Referência
- Botão "Limpar Destaque" para resetar a visualização
- Linha do servidor selecionado destacada em verde

### Grid Completo de Tabelas Salariais
Visualização organizada de TODAS as tabelas salariais:
- Agrupamento por categoria (Segurança, Saúde, Técnico, etc.)
- Sistema de accordion expansível/colapsável por categoria
- Cada nível exibido em formato pivot profissional
- Cores diferentes por faixa salarial para facilitar leitura
- Ícones temáticos por categoria (🛡️ Segurança, ⚕️ Saúde, etc.)

## 🚀 Tecnologias Utilizadas

- **React 18** - Biblioteca para construção da interface
- **TypeScript** - Tipagem estática para maior segurança
- **Vite** - Build tool moderna e rápida
- **Tailwind CSS** - Framework CSS utilitário para estilização
- **Recharts** - Biblioteca de gráficos responsivos
- **Supabase** - Backend as a Service para banco de dados
- **Lucide React** - Biblioteca de ícones modernos
- **React Context API** - Gerenciamento de estado global para sistema de destaque

## 📁 Estrutura do Projeto

```
pagina-web/
├── src/
│   ├── components/
│   │   ├── Dashboard.tsx        # Componente principal
│   │   ├── KPICards.tsx         # Cards de métricas
│   │   ├── Charts.tsx           # Todos os 6 gráficos
│   │   ├── ServidoresTable.tsx  # Tabela de servidores (com click)
│   │   ├── NiveisTable.tsx      # Tabela pivot simples
│   │   ├── tabs/
│   │   │   └── TabsNavigation.tsx  # Navegação ANTES/DEPOIS
│   │   ├── views/
│   │   │   ├── ViewAntes.tsx    # View da situação atual
│   │   │   └── ViewDepois.tsx   # View placeholder futuro
│   │   └── niveis/
│   │       ├── NiveisGrid.tsx   # Container de grids de níveis
│   │       ├── NivelCard.tsx    # Card de nível individual
│   │       └── NivelTable.tsx   # Tabela pivot com destaque
│   ├── contexts/
│   │   └── HighlightContext.tsx # Context API para destaque
│   ├── lib/
│   │   ├── supabase.ts          # Configuração do Supabase
│   │   ├── formatters.ts        # Funções de formatação
│   │   └── nivelParser.ts       # Parser de nivel_codigo
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   ├── App.tsx                  # Componente raiz
│   ├── main.tsx                 # Ponto de entrada
│   └── index.css                # Estilos globais + Tailwind
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── README.md
```

## 🔧 Instalação e Configuração

### Pré-requisitos
- Node.js 16+ instalado
- npm ou yarn instalado

### Passo 1: Instalar Dependências

```bash
npm install
```

Ou usando yarn:

```bash
yarn
```

### Passo 2: Configurar Supabase

As credenciais do Supabase já estão configuradas no arquivo `src/lib/supabase.ts`:

```typescript
SUPABASE_URL = "https://srezxddkcwkiblxerknr.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

**Estrutura do Banco de Dados:**

**Tabela: `rf_servidores`**
- `id` - ID único do servidor
- `nome` - Nome completo
- `cargo` - Cargo do servidor
- `nivel_codigo` - Código do nível salarial
- `salario` - Salário atual
- `nivel_id` - ID do nível (FK)

**Tabela: `rf_niveis`**
- `id` - ID único do nível
- `codigo` - Código curto do nível
- `codigo_completo` - Código completo
- `grau` - Grau do nível
- `referencia` - Referência do nível
- `salario` - Salário base do nível

## 🏃 Como Executar

### Modo Desenvolvimento

```bash
npm run dev
```

Ou:

```bash
yarn dev
```

O aplicativo estará disponível em `http://localhost:5173`

### Build para Produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`

### Preview da Build

```bash
npm run preview
```

## 🎨 Paleta de Cores

O projeto utiliza uma paleta institucional com tons de azul e verde:

- **Primary (Azul):** `#3b82f6` - `#1e3a8a`
- **Secondary (Verde):** `#22c55e` - `#14532d`
- **Accent Colors:** Laranja, Roxo, Rosa, Vermelho (para gráficos)

## 📱 Responsividade

O dashboard foi otimizado para:
- **Desktop:** Experiência completa (recomendado)
- **Tablet:** Layout adaptado
- **Mobile:** Visualização básica

## 🔒 Segurança

- As credenciais do Supabase utilizam a chave pública (`anon key`)
- Row Level Security (RLS) deve ser configurado no Supabase
- Recomenda-se usar variáveis de ambiente para produção

## 📈 Performance

- Componentes otimizados com `useMemo` e `useState`
- Carregamento assíncrono de dados
- Renderização condicional para estados de loading/error
- Gráficos com animações suaves

## 🐛 Tratamento de Erros

O dashboard possui tratamento robusto de erros:
- Loading states enquanto carrega dados
- Mensagens de erro amigáveis
- Botão para tentar novamente em caso de falha
- Console logs para debug

## 🤝 Contribuindo

Este é um projeto interno da Prefeitura Municipal de Iporã do Oeste/SC.

## 📄 Licença

Uso restrito à Prefeitura Municipal de Iporã do Oeste - SC.

## 👨‍💻 Desenvolvido com

- ❤️ Dedicação
- ☕ Café
- 🎵 Música
- 🚀 Tecnologias modernas

---

**Prefeitura Municipal de Iporã do Oeste - SC**
*Dashboard para análise da situação atual antes da reforma administrativa*
