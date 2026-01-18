// Tipos para as tabelas do Supabase

export interface Servidor {
  id: number;
  nome: string;
  cargo: string;
  nivel_codigo: string;
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
