import { useMemo } from 'react';
import { Nivel } from '../../types';
import { formatCurrency } from '../../lib/formatters';
import { useHighlight } from '../../contexts/HighlightContext';

interface NivelTableProps {
  niveis: Nivel[];
  codigoCompleto: string;
}

const NivelTable = ({ niveis, codigoCompleto }: NivelTableProps) => {
  const { highlightState } = useHighlight();

  // Criar estrutura pivot: GRAU (linhas) × REFERÊNCIA (colunas)
  const { graus, referencias, pivotData } = useMemo(() => {
    const grausSet = new Set<string>();
    const referenciasSet = new Set<string>();
    const dataMap = new Map<string, number>();

    niveis.forEach((nivel) => {
      grausSet.add(nivel.grau);
      referenciasSet.add(nivel.referencia);
      const key = `${nivel.grau}-${nivel.referencia}`;
      dataMap.set(key, nivel.salario);
    });

    // Ordenar graus: I, II, III, IV
    const grauOrder = { 'I': 1, 'II': 2, 'III': 3, 'IV': 4 };
    const grausArray = Array.from(grausSet).sort(
      (a, b) => (grauOrder[a as keyof typeof grauOrder] || 0) - (grauOrder[b as keyof typeof grauOrder] || 0)
    );

    // Ordenar referências: A, B, C, etc.
    const referenciasArray = Array.from(referenciasSet).sort((a, b) => a.localeCompare(b));

    return {
      graus: grausArray,
      referencias: referenciasArray,
      pivotData: dataMap,
    };
  }, [niveis]);

  const isHighlighted = (grau: string, referencia: string): boolean => {
    return (
      highlightState.nivelDestacado === codigoCompleto &&
      highlightState.grauDestacado === grau &&
      highlightState.referenciaDestacada === referencia
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse min-w-[600px] text-sm">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2 text-center font-bold text-gray-700 sticky left-0 z-20 bg-gray-200">
              GRAU / REF
            </th>
            {referencias.map((ref) => (
              <th
                key={ref}
                className="border border-gray-300 p-2 text-center font-bold text-gray-700 min-w-[90px]"
              >
                {ref}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {graus.map((grau, grauIndex) => (
            <tr key={grau} className={grauIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="border border-gray-300 p-2 font-bold text-center bg-gray-100 sticky left-0 z-10 text-gray-700">
                {grau}
              </td>
              {referencias.map((ref) => {
                const key = `${grau}-${ref}`;
                const salario = pivotData.get(key);
                const highlighted = isHighlighted(grau, ref);

                return (
                  <td
                    key={key}
                    className={`border border-gray-300 p-2 text-center text-xs font-medium transition-all duration-300 ${
                      highlighted
                        ? 'bg-gradient-to-br from-green-400 to-blue-500 text-white font-bold ring-4 ring-green-500 scale-110 shadow-2xl animate-pulse relative'
                        : 'hover:bg-blue-100 hover:scale-105'
                    }`}
                  >
                    {salario ? (
                      <div className="relative">
                        {formatCurrency(salario)}
                        {highlighted && (
                          <>
                            <div className="absolute -top-1 -right-1">
                              <span className="text-yellow-300 text-lg animate-pulse">⭐</span>
                            </div>
                            <div className="text-[10px] mt-0.5 font-bold">AQUI</div>
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      {/* Legenda de destaque */}
      {highlightState.nivelDestacado === codigoCompleto && highlightState.servidorData && (
        <div className="mt-4 p-4 bg-gradient-to-r from-green-50 to-blue-50 border-l-4 border-green-500 rounded">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <p className="font-bold text-gray-900">
                {highlightState.servidorData.nome}
              </p>
              <p className="text-sm text-gray-600">
                {highlightState.servidorData.cargo} • {highlightState.grauDestacado}-{highlightState.referenciaDestacada} • {formatCurrency(highlightState.servidorData.salario)}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NivelTable;
