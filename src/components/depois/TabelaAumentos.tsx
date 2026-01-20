import { useState, useMemo } from 'react';
import { Search, ChevronLeft, ChevronRight, TrendingUp, ArrowRight } from 'lucide-react';
import { ServidorHistorico } from '../../types';
import { formatCurrency } from '../../lib/formatters';

interface TabelaAumentosProps {
  servidores: ServidorHistorico[];
}

const ITEMS_PER_PAGE = 10;

const TabelaAumentos = ({ servidores }: TabelaAumentosProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar apenas servidores com aumento ou irredutibilidade
  const servidoresComAumento = useMemo(() => {
    return servidores
      .filter(s => s.tipo_mudanca === 'AUMENTO' || s.tipo_mudanca === 'IRREDUTIBILIDADE')
      .sort((a, b) => b.diferenca - a.diferenca); // Ordenar por diferença (maior primeiro)
  }, [servidores]);

  // Aplicar busca
  const servidoresFiltrados = useMemo(() => {
    if (!searchTerm) return servidoresComAumento;

    const lower = searchTerm.toLowerCase();
    return servidoresComAumento.filter(s =>
      s.nome.toLowerCase().includes(lower) ||
      s.cargo.toLowerCase().includes(lower)
    );
  }, [servidoresComAumento, searchTerm]);

  // Paginação
  const totalPages = Math.ceil(servidoresFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = servidoresFiltrados.slice(startIndex, endIndex);

  // Reset página quando busca muda
  useMemo(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalAumento = servidoresComAumento.reduce((sum, s) => sum + s.diferenca, 0);
  const totalIrredutibilidade = servidoresComAumento.filter(s => s.tipo_mudanca === 'IRREDUTIBILIDADE').length;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Servidores com Aumento
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {servidoresComAumento.length} servidores receberam aumento ou irredutibilidade
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-500">Impacto Total</p>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalAumento)}</p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">
              {servidoresComAumento.length - totalIrredutibilidade} Aumentos
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-600">
              {totalIrredutibilidade} Irredutibilidade
            </span>
          </div>
        </div>

        {/* Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar por nome ou cargo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Nome</th>
              <th className="text-left p-3 text-sm font-semibold text-gray-700">Cargo</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-700">Nível</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-700">Salário Antes</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-700">Salário Depois</th>
              <th className="text-right p-3 text-sm font-semibold text-gray-700">Diferença</th>
              <th className="text-center p-3 text-sm font-semibold text-gray-700">%</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((servidor) => {
              const isIrredutibilidade = servidor.tipo_mudanca === 'IRREDUTIBILIDADE';
              const bgColor = isIrredutibilidade ? 'bg-yellow-50' : 'bg-green-50';
              const borderColor = isIrredutibilidade ? 'border-l-yellow-500' : 'border-l-green-500';

              return (
                <tr
                  key={servidor.id}
                  className={`border-b border-gray-100 hover:${bgColor} transition-colors border-l-4 ${borderColor}`}
                >
                  <td className="p-3 text-sm font-medium text-gray-900">{servidor.nome}</td>
                  <td className="p-3 text-sm text-gray-600">{servidor.cargo}</td>
                  <td className="p-3 text-center">
                    <div className="flex items-center justify-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded font-bold">
                        {servidor.codigo_base}
                      </span>
                      <ArrowRight className="w-3 h-3 text-gray-400" />
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded font-bold">
                        {servidor.codigo_base_novo || servidor.codigo_base}
                      </span>
                    </div>
                  </td>
                  <td className="p-3 text-right text-sm font-mono text-gray-600">
                    {formatCurrency(servidor.salario)}
                  </td>
                  <td className="p-3 text-right text-sm font-mono font-semibold text-gray-900">
                    {formatCurrency(servidor.salario_novo || servidor.salario)}
                  </td>
                  <td className="p-3 text-right text-sm font-mono font-bold text-green-600">
                    +{formatCurrency(servidor.diferenca)}
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-bold ${
                      isIrredutibilidade ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                    }`}>
                      +{servidor.percentual.toFixed(1)}%
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {currentItems.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum servidor encontrado com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Paginação */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            Mostrando {startIndex + 1} a {Math.min(endIndex, servidoresFiltrados.length)} de {servidoresFiltrados.length}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-sm text-gray-700">
              Página {currentPage} de {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TabelaAumentos;
