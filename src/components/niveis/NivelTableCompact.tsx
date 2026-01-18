import { formatCurrency } from '../../lib/formatters';
import { useHighlight } from '../../contexts/HighlightContext';

interface NivelAgrupado {
  codigo_completo: string;
  codigo: string;
  categoria: string;
  niveis: Array<{
    id: number;
    codigo: string;
    codigo_completo: string;
    grau: string;
    referencia: string;
    salario: number;
  }>;
}

interface NivelTableCompactProps {
  nivelAgrupado: NivelAgrupado;
}

const NivelTableCompact = ({ nivelAgrupado }: NivelTableCompactProps) => {
  const { highlightState } = useHighlight();

  // Extrair e ordenar graus e referências
  const graus = [...new Set(nivelAgrupado.niveis.map((n) => n.grau))];
  const referencias = [...new Set(nivelAgrupado.niveis.map((n) => n.referencia))];

  // Ordenação inteligente de graus (suporta romanos E numéricos)
  graus.sort((a, b) => {
    const grauRomano: Record<string, number> = {
      'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
      'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
    };

    // Se ambos são romanos
    if (grauRomano[a] && grauRomano[b]) {
      return grauRomano[a] - grauRomano[b];
    }

    // Se ambos são numéricos (ex: "1", "2", "10")
    const numA = parseInt(a);
    const numB = parseInt(b);
    if (!isNaN(numA) && !isNaN(numB)) {
      return numA - numB;
    }

    // Se A é numérico e B é romano (numéricos vêm primeiro)
    if (!isNaN(numA) && grauRomano[b]) return -1;

    // Se A é romano e B é numérico
    if (grauRomano[a] && !isNaN(numB)) return 1;

    // Fallback: ordem alfabética
    return a.localeCompare(b);
  });

  // Ordenação de referências (A-Z, depois A1, A2, etc)
  referencias.sort((a, b) => {
    // Se ambos são letras simples (A, B, C...)
    if (a.length === 1 && b.length === 1) {
      return a.localeCompare(b);
    }

    // Se A é simples e B composto (simples vem primeiro)
    if (a.length === 1 && b.length > 1) return -1;

    // Se A é composto e B simples
    if (a.length > 1 && b.length === 1) return 1;

    // Ambos compostos: comparar letra base primeiro, depois número
    const letraA = a.charAt(0);
    const letraB = b.charAt(0);

    if (letraA !== letraB) {
      return letraA.localeCompare(letraB);
    }

    // Mesma letra: comparar número
    const numA = parseInt(a.substring(1)) || 0;
    const numB = parseInt(b.substring(1)) || 0;
    return numA - numB;
  });

  // Criar matriz pivot GRAU × REFERÊNCIA
  const matriz: Record<string, Record<string, number | null>> = {};
  graus.forEach((grau) => {
    matriz[grau] = {};
    referencias.forEach((ref) => {
      const nivel = nivelAgrupado.niveis.find(
        (n) => n.grau === grau && n.referencia === ref
      );
      matriz[grau][ref] = nivel ? nivel.salario : null;
    });
  });

  // Verificar se célula está destacada
  const isCellHighlighted = (grau: string, ref: string): boolean => {
    return (
      highlightState.nivelDestacado === nivelAgrupado.codigo_completo &&
      highlightState.grauDestacado === grau &&
      highlightState.referenciaDestacada === ref
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white font-mono">
              NÍVEL {nivelAgrupado.codigo_completo}
            </h3>
            <p className="text-sm text-gray-300 font-mono mt-1">
              {nivelAgrupado.categoria} • Código {nivelAgrupado.codigo}
            </p>
          </div>
          <div className="text-right text-gray-300 font-mono text-sm">
            {nivelAgrupado.niveis.length} posições
          </div>
        </div>
      </div>

      {/* Tabela Pivot Compacta */}
      <div className="overflow-x-auto bg-gray-50">
        <table className="w-full border-collapse font-mono text-sm">
          <thead>
            <tr className="bg-gray-200 border-b-2 border-gray-400">
              <th className="px-3 py-2 text-left font-bold text-gray-900 border-r-2 border-gray-400">
                GRAU \ REF
              </th>
              {referencias.map((ref) => (
                <th
                  key={ref}
                  className="px-3 py-2 text-center font-bold text-gray-900 border-r border-gray-300"
                >
                  {ref}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {graus.map((grau) => (
              <tr key={grau} className="border-b border-gray-300 hover:bg-gray-100">
                <td className="px-3 py-2 font-bold text-gray-900 bg-gray-100 border-r-2 border-gray-400">
                  {grau}
                </td>
                {referencias.map((ref) => {
                  const salario = matriz[grau][ref];
                  const isHighlighted = isCellHighlighted(grau, ref);

                  return (
                    <td
                      key={ref}
                      className={`px-3 py-2 text-right border-r border-gray-200 tabular-nums transition-colors duration-200 ${
                        isHighlighted
                          ? 'bg-yellow-300 font-bold text-gray-900 ring-2 ring-yellow-500'
                          : salario
                          ? 'text-gray-800'
                          : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {salario ? (
                        <div className="flex items-center justify-end gap-2">
                          {isHighlighted && (
                            <span className="text-xs bg-yellow-500 text-gray-900 px-1.5 py-0.5 rounded font-bold">
                              ⭐ AQUI
                            </span>
                          )}
                          <span>{formatCurrency(salario)}</span>
                        </div>
                      ) : (
                        <span className="text-xs">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer com legenda */}
      {highlightState.servidorData && highlightState.nivelDestacado === nivelAgrupado.codigo_completo && (
        <div className="bg-yellow-50 border-t-2 border-yellow-300 px-6 py-3">
          <div className="flex items-center gap-2 text-sm font-mono">
            <span className="text-yellow-700 font-bold">⭐</span>
            <span className="font-bold text-gray-900">
              {highlightState.servidorData.nome}
            </span>
            <span className="text-gray-600">está nesta posição</span>
            <span className="text-gray-600">
              • Salário: {formatCurrency(highlightState.servidorData.salario)}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default NivelTableCompact;
