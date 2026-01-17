# 📂 Estrutura Completa do Projeto

```
pagina-web/
│
├── 📄 index.html                    # HTML principal
├── 📄 package.json                  # Dependências e scripts
├── 📄 README.md                     # Documentação completa
├── 📄 QUICKSTART.md                 # Guia rápido de início
├── 📄 ESTRUTURA.md                  # Este arquivo
│
├── ⚙️ Configurações
│   ├── tsconfig.json                # Config TypeScript
│   ├── tsconfig.node.json           # Config TypeScript Node
│   ├── vite.config.ts               # Config Vite
│   ├── tailwind.config.js           # Config Tailwind CSS
│   ├── postcss.config.js            # Config PostCSS
│   ├── .eslintrc.cjs                # Config ESLint
│   └── .gitignore                   # Arquivos ignorados no Git
│
└── 📁 src/
    ├── 📄 main.tsx                  # Ponto de entrada da aplicação
    ├── 📄 App.tsx                   # Componente raiz
    ├── 📄 index.css                 # Estilos globais + Tailwind
    ├── 📄 vite-env.d.ts             # Tipos do Vite
    │
    ├── 📁 components/               # Componentes React
    │   ├── Dashboard.tsx            # ⭐ Componente principal (integra tudo)
    │   ├── KPICards.tsx             # 6 Cards de métricas (KPIs)
    │   ├── Charts.tsx               # 6 Gráficos interativos
    │   ├── ServidoresTable.tsx      # Tabela de 213 servidores
    │   └── NiveisTable.tsx          # Tabela pivot de níveis
    │
    ├── 📁 lib/                      # Utilitários
    │   ├── supabase.ts              # Cliente Supabase configurado
    │   └── formatters.ts            # Formatação de moeda e números
    │
    └── 📁 types/                    # Tipos TypeScript
        └── index.ts                 # Interfaces (Servidor, Nivel, KPIData, etc.)
```

## 🎯 Componentes Principais

### Dashboard.tsx
- Componente principal que orquestra toda a aplicação
- Faz fetch dos dados do Supabase
- Calcula KPIs
- Gerencia estados de loading e erro
- Renderiza todos os subcomponentes

### KPICards.tsx
Exibe 6 cards de métricas:
1. Total de Servidores
2. Massa Salarial Total
3. Salário Médio
4. Total de Níveis
5. Menor Salário
6. Maior Salário

### Charts.tsx
Renderiza 6 gráficos:
1. Distribuição por Nível (barras horizontais)
2. Distribuição por Cargo (pizza)
3. Faixas Salariais (histograma)
4. Grau × Referência (barras)
5. Top 10 Maiores Salários (barras horizontais)
6. Massa Salarial por Cargo (barras)

### ServidoresTable.tsx
Tabela interativa com:
- Busca por nome
- Filtro por cargo
- Ordenação por coluna
- 213 servidores listados

### NiveisTable.tsx
Tabela pivot com:
- Linhas: GRAU
- Colunas: REFERÊNCIA
- Cores por faixa salarial
- Todos os níveis da estrutura

## 🔗 Fluxo de Dados

```
Supabase (rf_servidores + rf_niveis)
        ↓
Dashboard.tsx (fetch + processamento)
        ↓
    ┌───┴───┬────────┬─────────┐
    ↓       ↓        ↓         ↓
KPICards  Charts  Servidores  Níveis
                   Table      Table
```

## 📊 Estrutura de Dados

### Servidor (rf_servidores)
```typescript
{
  id: number
  nome: string
  cargo: string
  nivel_codigo: string
  salario: number
  nivel_id: number
}
```

### Nível (rf_niveis)
```typescript
{
  id: number
  codigo: string
  codigo_completo: string
  grau: string
  referencia: string
  salario: number
}
```

## 🎨 Stack Visual

- **Layout:** Tailwind CSS (utility-first)
- **Gráficos:** Recharts (biblioteca React)
- **Ícones:** Lucide React
- **Cores:** Paleta azul/verde institucional
- **Responsividade:** Grid system do Tailwind

## 🚀 Próximos Passos

1. Instalar dependências: `npm install`
2. Rodar projeto: `npm run dev`
3. Acessar: `http://localhost:5173`
4. Explorar o dashboard!

---

**Total de arquivos criados:** 21 arquivos
**Linhas de código:** ~1.500+ linhas
**Componentes React:** 5 componentes principais
**Gráficos:** 6 visualizações diferentes
**Tabelas interativas:** 2 tabelas completas
