import { useState, useMemo, useEffect } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, MousePointer2, ChevronDown, ChevronUp } from 'lucide-react';
import { Servidor } from '../types';
import { formatCurrency } from '../lib/formatters';
import { useHighlight } from '../contexts/HighlightContext';
import { parseNivelCodigo } from '../lib/nivelParser';

interface ServidoresTableProps {
  servidores: Servidor[];
  filtroCargoExterno?: string;
}

type SortField = 'nome' | 'cargo' | 'nivel_codigo' | 'salario';
type SortDirection = 'asc' | 'desc';

const ITEMS_INICIAIS = 5;
const ITEMS_POR_PAGINA = 10;

const ServidoresTable = ({ servidores, filtroCargoExterno = '' }: ServidoresTableProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [cargoFilter, setCargoFilter] = useState<string>('');
  const [itemsVisiveis, setItemsVisiveis] = useState(ITEMS_INICIAIS);
  const { setHighlight, highlightState } = useHighlight();

  // Resetar paginação quando filtros mudarem
  useEffect(() => {
    setItemsVisiveis(ITEMS_INICIAIS);
  }, [searchTerm, cargoFilter]);

  // Aplicar filtro externo vindo da TabelaCargosNiveis
  useEffect(() => {
    if (filtroCargoExterno) {
      setCargoFilter(filtroCargoExterno);
      // Scroll suave para a tabela
      setTimeout(() => {
        document.getElementById('tabela-servidores')?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    } else if (filtroCargoExterno === '') {
      setCargoFilter('');
    }
  }, [filtroCargoExterno]);

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

    // Resetar paginação quando mudar filtros
    if (resultado.length < itemsVisiveis) {
      setItemsVisiveis(ITEMS_INICIAIS);
    }

    return resultado;
  }, [servidores, searchTerm, cargoFilter, sortField, sortDirection]);

  // Servidores paginados (apenas os visíveis)
  const servidoresPaginados = useMemo(() => {
    return servidoresFiltrados.slice(0, itemsVisiveis);
  }, [servidoresFiltrados, itemsVisiveis]);

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

  const handleServidorClick = (servidor: Servidor) => {
    console.log('👆 Servidor clicado:', servidor.nome, '|', servidor.nivel_codigo);

    // Usar nivel_codigo_limpo que já está no formato correto: "58-III-A"
    const parts = servidor.nivel_codigo_limpo.split('-');

    if (parts.length !== 3) {
      console.error('❌ Formato inválido de nivel_codigo_limpo:', servidor.nivel_codigo_limpo);
      return;
    }

    const nivelBase = parts[0];      // "58"
    const grau = parts[1];           // "III"
    const referencia = parts[2];     // "A"

    console.log('📤 Passando para highlight:', { nivelBase, grau, referencia });

    setHighlight(
      nivelBase,
      grau,
      referencia,
      {
        nome: servidor.nome,
        cargo: servidor.cargo,
        salario: servidor.salario,
      }
    );
  };

  return (
    <div id="tabela-servidores" className="bg-white rounded-lg shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Lista Completa de Servidores ({servidoresFiltrados.length} de {servidores.length})
        </h3>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <MousePointer2 className="w-4 h-4" />
          <span>Clique para ver na tabela salarial</span>
        </div>
      </div>

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
            {servidoresPaginados.map((servidor) => {
              const isSelected = highlightState.servidorSelecionado === servidor.nome;
              return (
                <tr
                  key={servidor.id}
                  onClick={() => handleServidorClick(servidor)}
                  className={`border-b border-gray-200 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-green-50 hover:bg-green-100 ring-2 ring-green-500'
                      : 'hover:bg-blue-50 hover:shadow-md'
                  }`}
                >
                  <td className="p-3 text-gray-900 flex items-center gap-2">
                    {isSelected && <span className="text-green-600">👉</span>}
                    {servidor.nome}
                  </td>
                  <td className="p-3 text-gray-700">{servidor.cargo}</td>
                  <td className="p-3">
                    <span
                      className={`inline-block px-2 py-1 rounded text-sm font-medium ${
                        isSelected
                          ? 'bg-green-600 text-white'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {servidor.nivel_codigo}
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold text-gray-900">
                    {formatCurrency(servidor.salario)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {servidoresFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum servidor encontrado com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Paginação */}
      {servidoresFiltrados.length > 0 && (
        <div className="mt-6 space-y-4">
          {/* Contador */}
          <div className="text-center text-sm text-gray-600">
            Mostrando <span className="font-bold text-gray-900">{servidoresPaginados.length}</span> de{' '}
            <span className="font-bold text-gray-900">{servidoresFiltrados.length}</span> servidores
          </div>

          {/* Botões */}
          <div className="flex justify-center gap-4">
            {itemsVisiveis < servidoresFiltrados.length && (
              <button
                onClick={() => setItemsVisiveis(prev => Math.min(prev + ITEMS_POR_PAGINA, servidoresFiltrados.length))}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md hover:shadow-lg"
              >
                <ChevronDown className="w-5 h-5" />
                Mostrar mais {Math.min(ITEMS_POR_PAGINA, servidoresFiltrados.length - itemsVisiveis)} servidores
              </button>
            )}

            {itemsVisiveis > ITEMS_POR_PAGINA && (
              <button
                onClick={() => setItemsVisiveis(ITEMS_POR_PAGINA)}
                className="flex items-center gap-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
              >
                <ChevronUp className="w-5 h-5" />
                Recolher
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServidoresTable;
