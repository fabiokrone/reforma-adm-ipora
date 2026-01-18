import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';

interface NivelAgrupado {
  codigo: string;
  codigo_completo: string;
  categoria: string;
  niveis: Array<{
    grau: string;
    referencia: string;
    salario: number;
  }>;
}

interface TodosOsNiveisProps {
  niveisAgrupados: NivelAgrupado[];
}

const TodosOsNiveis = ({ niveisAgrupados }: TodosOsNiveisProps) => {
  const [expandidos, setExpandidos] = useState<Set<string>>(new Set());

  const toggleExpansao = (codigo: string) => {
    const novos = new Set(expandidos);
    if (novos.has(codigo)) {
      novos.delete(codigo);
    } else {
      novos.add(codigo);
    }
    setExpandidos(novos);
  };

  const getGrausReferencias = (niveis: NivelAgrupado['niveis']) => {
    const graus = [...new Set(niveis.map(n => n.grau))];
    const refs = [...new Set(niveis.map(n => n.referencia))];
    const map = new Map<string, number>();
    niveis.forEach(n => map.set(`${n.grau}-${n.referencia}`, n.salario));

    // Ordenação inteligente de graus (suporta romanos E numéricos)
    graus.sort((a, b) => {
      const grauRomano: Record<string, number> = {
        'I': 1, 'II': 2, 'III': 3, 'IV': 4, 'V': 5,
        'VI': 6, 'VII': 7, 'VIII': 8, 'IX': 9, 'X': 10
      };

      if (grauRomano[a] && grauRomano[b]) {
        return grauRomano[a] - grauRomano[b];
      }

      const numA = parseInt(a);
      const numB = parseInt(b);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }

      if (!isNaN(numA) && grauRomano[b]) return -1;
      if (grauRomano[a] && !isNaN(numB)) return 1;

      return a.localeCompare(b);
    });

    // Ordenação de referências (A-Z, depois A1, A2, etc)
    refs.sort((a, b) => {
      if (a.length === 1 && b.length === 1) return a.localeCompare(b);
      if (a.length === 1 && b.length > 1) return -1;
      if (a.length > 1 && b.length === 1) return 1;

      const letraA = a.charAt(0);
      const letraB = b.charAt(0);
      if (letraA !== letraB) return letraA.localeCompare(letraB);

      const numA = parseInt(a.substring(1)) || 0;
      const numB = parseInt(b.substring(1)) || 0;
      return numA - numB;
    });

    return { graus, refs, map };
  };

  return (
    <div className="space-y-4">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          📋 <strong>Visualização Completa:</strong> {niveisAgrupados.length} tabelas salariais.
          Clique para expandir/recolher cada nível.
        </p>
      </div>

      {niveisAgrupados.map((grupo) => {
        const isExpandido = expandidos.has(grupo.codigo_completo);
        const { graus, refs, map } = getGrausReferencias(grupo.niveis);

        return (
          <div
            key={grupo.codigo_completo}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
          >
            {/* Header clicável */}
            <button
              onClick={() => toggleExpansao(grupo.codigo_completo)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">
                    {grupo.codigo}
                  </span>
                </div>
                <div className="text-left">
                  <h4 className="text-lg font-bold text-gray-900">
                    NÍVEL {grupo.codigo_completo}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {grupo.categoria} • {grupo.niveis.length} posições ({graus.length} graus × {refs.length} refs)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-500 font-medium">
                  {isExpandido ? 'Recolher' : 'Expandir'}
                </span>
                {isExpandido ? (
                  <ChevronUp className="w-5 h-5 text-gray-600" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-600" />
                )}
              </div>
            </button>

            {/* Conteúdo expandível */}
            {isExpandido && (
              <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm border-collapse">
                    <thead>
                      <tr className="bg-gray-200 border-b-2 border-gray-400">
                        <th className="py-2 px-3 text-center font-bold text-gray-900 sticky left-0 bg-gray-200 z-10">
                          GRAU / REF
                        </th>
                        {refs.map(ref => (
                          <th
                            key={ref}
                            className="py-2 px-3 text-center font-bold text-gray-900 min-w-[100px]"
                          >
                            {ref}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="font-mono text-xs">
                      {graus.map((grau, idx) => (
                        <tr
                          key={grau}
                          className={`hover:bg-blue-50 transition-colors border-b border-gray-200 ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                          }`}
                        >
                          <td className="py-2 px-3 font-bold text-gray-800 text-center bg-gray-100 sticky left-0 z-10 border-r border-gray-300">
                            {grau}
                          </td>
                          {refs.map(ref => {
                            const val = map.get(`${grau}-${ref}`);
                            return (
                              <td
                                key={`${grau}-${ref}`}
                                className="py-2 px-3 text-right text-gray-700 border-r border-gray-200 tabular-nums"
                              >
                                {val ? formatCurrency(val) : '-'}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default TodosOsNiveis;
