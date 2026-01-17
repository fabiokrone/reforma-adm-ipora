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
