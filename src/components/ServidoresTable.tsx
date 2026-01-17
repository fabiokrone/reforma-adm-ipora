import { useState, useMemo } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { Servidor } from '../types';
import { formatCurrency } from '../lib/formatters';

interface ServidoresTableProps {
  servidores: Servidor[];
}

type SortField = 'nome' | 'cargo' | 'nivel_codigo' | 'salario';
type SortDirection = 'asc' | 'desc';

const ServidoresTable = ({ servidores }: ServidoresTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [cargoFilter, setCargoFilter] = useState<string>('');

  // Obter lista única de cargos para o filtro
  const cargosUnicos = useMemo(() => {
    const cargos = [...new Set(servidores.map((s) => s.cargo))];
    return cargos.sort();
  }, [servidores]);

  // Filtrar e ordenar servidores
  const servidoresFiltrados = useMemo(() => {
    let resultado = [...servidores];

    // Aplicar busca por nome
    if (searchTerm) {
      resultado = resultado.filter((s) =>
        s.nome.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Aplicar filtro por cargo
    if (cargoFilter) {
      resultado = resultado.filter((s) => s.cargo === cargoFilter);
    }

    // Aplicar ordenação
    resultado.sort((a, b) => {
      let compareA = a[sortField];
      let compareB = b[sortField];

      if (sortField === 'nome' || sortField === 'cargo' || sortField === 'nivel_codigo') {
        compareA = (compareA as string).toLowerCase();
        compareB = (compareB as string).toLowerCase();
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }, [servidores, searchTerm, cargoFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-4 h-4 ml-1 inline" />;
    return sortDirection === 'asc' ? (
      <ArrowUp className="w-4 h-4 ml-1 inline" />
    ) : (
      <ArrowDown className="w-4 h-4 ml-1 inline" />
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Lista Completa de Servidores ({servidoresFiltrados.length} de {servidores.length})
      </h3>

      {/* Filtros */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Busca por nome */}
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Buscar por nome..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Filtro por cargo */}
        <div className="md:w-64">
          <select
            value={cargoFilter}
            onChange={(e) => setCargoFilter(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Todos os cargos</option>
            {cargosUnicos.map((cargo) => (
              <option key={cargo} value={cargo}>
                {cargo}
              </option>
            ))}
          </select>
        </div>

        {/* Botão limpar filtros */}
        {(searchTerm || cargoFilter) && (
          <button
            onClick={() => {
              setSearchTerm('');
              setCargoFilter('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Limpar Filtros
          </button>
        )}
      </div>

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th
                className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('nome')}
              >
                Nome
                <SortIcon field="nome" />
              </th>
              <th
                className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('cargo')}
              >
                Cargo
                <SortIcon field="cargo" />
              </th>
              <th
                className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('nivel_codigo')}
              >
                Nível
                <SortIcon field="nivel_codigo" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('salario')}
              >
                Salário
                <SortIcon field="salario" />
              </th>
            </tr>
          </thead>
          <tbody>
            {servidoresFiltrados.map((servidor) => (
              <tr
                key={servidor.id}
                className="border-b border-gray-200 hover:bg-gray-50 transition-colors"
              >
                <td className="p-3 text-gray-900">{servidor.nome}</td>
                <td className="p-3 text-gray-700">{servidor.cargo}</td>
                <td className="p-3">
                  <span className="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm font-medium">
                    {servidor.nivel_codigo}
                  </span>
                </td>
                <td className="p-3 text-right font-semibold text-gray-900">
                  {formatCurrency(servidor.salario)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {servidoresFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum servidor encontrado com os filtros aplicados.
          </div>
        )}
      </div>
    </div>
  );
};

export default ServidoresTable;
