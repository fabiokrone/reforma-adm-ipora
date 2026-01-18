import { NivelParsed, Nivel, NivelAgrupado } from '../types';

/**
 * Parse do nivel_codigo do servidor
 * Exemplo: "TEC59A-III-G" → { codigo: "59A", codigo_completo: "TEC59A", grau: "III", referencia: "G" }
 */
export const parseNivelCodigo = (nivelCodigo: string): NivelParsed | null => {
  const parts = nivelCodigo.split('-');

  if (parts.length !== 3) {
    return null;
  }

  const codigo_completo = parts[0];
  const grau = parts[1];
  const referencia = parts[2];

  // Extrair apenas o código numérico/alfanumérico (remover prefixo como TEC, SEG, etc.)
  const codigoMatch = codigo_completo.match(/[0-9]+[A-Z]?$/);
  const codigo = codigoMatch ? codigoMatch[0] : codigo_completo;

  return {
    codigo,
    codigo_completo,
    grau,
    referencia,
  };
};

/**
 * Obtém a categoria do nível baseado no prefixo
 */
export const getCategoria = (codigoCompleto: string): string => {
  if (codigoCompleto.startsWith('SEG')) return 'Segurança';
  if (codigoCompleto.startsWith('SOP')) return 'Serviços Operacionais';
  if (codigoCompleto.startsWith('SAU')) return 'Saúde';
  if (codigoCompleto.startsWith('TEC')) return 'Técnico';
  if (codigoCompleto.startsWith('TEP')) return 'Técnico Especializado';
  if (codigoCompleto.startsWith('ADM')) return 'Administrativo';
  if (codigoCompleto.startsWith('SUP')) return 'Superior';
  return 'Outros';
};

/**
 * Agrupa níveis por CODIGO (não codigo_completo)
 */
export const agruparNiveis = (niveis: Nivel[]): NivelAgrupado[] => {
  const grupos = new Map<string, Nivel[]>();

  niveis.forEach((nivel) => {
    const key = nivel.codigo; // ← MUDANÇA AQUI: usar 'codigo' ao invés de 'codigo_completo'
    if (!grupos.has(key)) {
      grupos.set(key, []);
    }
    grupos.get(key)!.push(nivel);
  });

  const resultado: NivelAgrupado[] = [];

  grupos.forEach((niveisGrupo, codigo) => {
    // Pegar o primeiro registro para extrair categoria
    const primeiroNivel = niveisGrupo[0];
    
    // Determinar codigo_completo:
    // Se tem prefixo (SEG, TEC, etc), usar. Senão, usar apenas o código
    let codigoCompleto = codigo;
    if (primeiroNivel.codigo_completo && primeiroNivel.codigo_completo !== codigo) {
      // Extrair prefixo do primeiro registro
      const match = primeiroNivel.codigo_completo.match(/^([A-Z]+)/);
      if (match) {
        codigoCompleto = match[1] + codigo;
      }
    }

    resultado.push({
      codigo: codigo,
      codigo_completo: codigoCompleto, // Ex: "SEG16" ou só "16"
      categoria: getCategoria(codigoCompleto),
      niveis: niveisGrupo.sort((a, b) => {
        // Ordenar por grau e depois por referência
        const grauOrder = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };
        const grauA = grauOrder[a.grau as keyof typeof grauOrder] || 0;
        const grauB = grauOrder[b.grau as keyof typeof grauOrder] || 0;

        if (grauA !== grauB) return grauA - grauB;
        return a.referencia.localeCompare(b.referencia);
      }),
    });
  });

  // Ordenar por categoria e depois por código
  return resultado.sort((a, b) => {
    if (a.categoria !== b.categoria) {
      return a.categoria.localeCompare(b.categoria);
    }
    // Ordenação numérica do código
    const numA = parseInt(a.codigo.replace(/\D/g, '')) || 0;
    const numB = parseInt(b.codigo.replace(/\D/g, '')) || 0;
    return numA - numB;
  });
};