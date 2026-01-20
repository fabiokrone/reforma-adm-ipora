// Tipos para as tabelas do Supabase

export interface Servidor {
  id: number;
  nome: string;
  cargo: string;
  regime: string;
  nivel_codigo: string;
  nivel_codigo_limpo: string;
  salario: number;
  nivel_id: number;
}

export interface Nivel {
  id: number;
  codigo: string;
  codigo_completo: string;
  grau: string;
  referencia: string;
  salario: number;
}

// Tipos auxiliares para os componentes
export interface KPIData {
  totalServidores: number;
  massaSalarial: number;
  salarioMedio: number;
  totalNiveis: number;
  menorSalario: number;
  maiorSalario: number;
}

export interface FaixaSalarial {
  faixa: string;
  quantidade: number;
  range: string;
}

export interface CargoDistribuicao {
  cargo: string;
  quantidade: number;
  massaSalarial: number;
}

export interface NivelDistribuicao {
  nivel: string;
  quantidade: number;
}

export interface ServidorTopSalario {
  nome: string;
  cargo: string;
  salario: number;
}

// Tipos para o sistema de grid de níveis
export interface NivelParsed {
  codigo: string;
  codigo_completo: string;
  grau: string;
  referencia: string;
}

export interface NivelAgrupado {
  codigo: string;
  codigo_completo: string;
  categoria: string;
  niveis: Nivel[];
}

export type TabView = 'antes' | 'depois';

// Tipos para comparação ANTES × DEPOIS (preparação futura)
export interface ComparacaoNivel {
  codigo_completo: string;
  status: 'mantido' | 'extinto' | 'novo';
  antes?: Nivel;
  depois?: Nivel;
}

export interface MudancaServidor {
  servidor: Servidor;
  nivel_antes: string;
  nivel_depois: string;
  grau_antes: string;
  grau_depois: string;
  ref_antes: string;
  ref_depois: string;
  salario_antes: number;
  salario_depois: number;
  variacao: number;
  variacao_percentual: number;
}

// Dados do histórico (rf_servidores_historico)
export interface ServidorHistorico {
  id: string;
  servidor_id: string;
  versao: number;
  nome: string;
  cargo: string;
  regime: string;
  nivel_codigo: string;
  nivel_codigo_limpo: string;
  codigo_base: string;
  grau: string;
  referencia: string;
  salario: number;
  codigo_base_novo: string | null;
  salario_novo: number | null;
  diferenca: number;
  percentual: number;
  tipo_mudanca: 'AUMENTO' | 'IRREDUTIBILIDADE' | 'MANTÉM' | 'SEM MUDANÇA';
}

// Novos cargos e ampliações (rf_novos_cargos)
export interface NovoCargo {
  id: string;
  tipo: 'NOVO CARGO' | 'AMPLIAÇÃO';
  cargo: string;
  codigo_cargo: string;
  nivel: string;
  vagas_antes: number;
  vagas_depois: number;
  salario_inicial: number;
  custo_mensal: number;
  custo_anual: number;
  observacoes: string;
}

// Cargos em extinção (rf_cargos_extincao)
export interface CargoExtincao {
  id: string;
  cargo: string;
  codigo_cargo: string;
  nivel: string;
  qtd_ocupantes: number;
  salario_inicial: number;
  motivo_extincao: string;
  observacoes: string;
}

// Snapshot de níveis (rf_niveis_snapshot)
export interface NivelSnapshot {
  id: string;
  versao: number;
  descricao: string;
  codigo: string;
  qtd_servidores: number;
  massa_salarial: number;
  salario_minimo: number;
  salario_maximo: number;
  status: string;
}

// KPIs comparativos
export interface KPIComparativo {
  servidoresAntes: number;
  servidoresDepois: number;
  massaAntes: number;
  massaDepois: number;
  diferencaMassa: number;
  percentualAumento: number;
  servidoresComAumento: number;
  niveisAntes: number;
  niveisDepois: number;
}

// Projeção LRF
export interface ProjecaoLRF {
  ano: number;
  meses: number;
  salarioBase: number;
  decimoTerceiro: number;
  tercoFerias: number;
  total: number;
}
