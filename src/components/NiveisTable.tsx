import { useMemo } from 'react';
import { Nivel } from '../types';
import { formatCurrency } from '../lib/formatters';

interface NiveisTableProps {
  niveis: Nivel[];
}

const NiveisTable = ({ niveis }: NiveisTableProps) => {
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

    const grausArray = Array.from(grausSet).sort((a, b) => {
      // Ordenar graus (considerando formato numérico ou alfabético)
      const numA = parseInt(a.replace(/\D/g, ''));
      const numB = parseInt(b.replace(/\D/g, ''));
      if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
      return a.localeCompare(b);
    });

    const referenciasArray = Array.from(referenciasSet).sort((a, b) => {
      // Ordenar referências (A, B, C, etc.)
      return a.localeCompare(b);
    });

    return {
      graus: grausArray,
      referencias: referenciasArray,
      pivotData: dataMap,
    };
  }, [niveis]);

  const getCellColor = (salario: number | undefined) => {
    if (!salario) return 'bg-gray-50';
    if (salario < 2000) return 'bg-green-50';
    if (salario < 4000) return 'bg-blue-50';
    if (salario < 6000) return 'bg-yellow-50';
    if (salario < 8000) return 'bg-orange-50';
    return 'bg-red-50';
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Tabela de Níveis Salariais (Grau × Referência)
      </h3>

      <div className="mb-4 flex items-center gap-4 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-50 border border-gray-200"></div>
          <span>{'< R$ 2k'}</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-50 border border-gray-200"></div>
          <span>R$ 2k - 4k</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-yellow-50 border border-gray-200"></div>
          <span>R$ 4k - 6k</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-orange-50 border border-gray-200"></div>
          <span>R$ 6k - 8k</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-50 border border-gray-200"></div>
          <span>{'> R$ 8k'}</span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 p-2 text-center font-bold sticky left-0 bg-gray-100 z-10">
                GRAU / REF
              </th>
              {referencias.map((ref) => (
                <th
                  key={ref}
                  className="border border-gray-300 p-2 text-center font-bold min-w-[100px]"
                >
                  {ref}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {graus.map((grau) => (
              <tr key={grau} className="hover:bg-gray-50">
                <td className="border border-gray-300 p-2 font-bold text-center bg-gray-50 sticky left-0 z-10">
                  {grau}
                </td>
                {referencias.map((ref) => {
                  const key = `${grau}-${ref}`;
                  const salario = pivotData.get(key);
                  return (
                    <td
                      key={`${grau}-${ref}`}
                      className={`border border-gray-300 p-2 text-center text-sm ${getCellColor(
                        salario
                      )}`}
                    >
                      {salario ? formatCurrency(salario) : '-'}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          <strong>Total de Níveis:</strong> {niveis.length} |{' '}
          <strong>Graus Únicos:</strong> {graus.length} |{' '}
          <strong>Referências Únicas:</strong> {referencias.length}
        </p>
      </div>
    </div>
  );
};

export default NiveisTable;
