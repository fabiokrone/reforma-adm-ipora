import { useMemo, useState } from 'react';
import { Search, ArrowUpDown, ArrowUp, ArrowDown, Users, DollarSign } from 'lucide-react';
import { Servidor, Nivel } from '../../types';
import { formatCurrency } from '../../lib/formatters';

interface TabelaCargosNiveisProps {
  servidores: Servidor[];
  niveis: Nivel[];
  onCargoClick?: (cargo: string) => void;
}

type SortField = 'cargo' | 'nivel_inicial' | 'quantidade' | 'salario_min' | 'salario_max';
type SortDirection = 'asc' | 'desc';

interface CargoInfo {
  cargo: string;
  nivel_inicial: string;
  grau_ref_mais_comum: string;
  quantidade: number;
  salario_min: number;
  salario_max: number;
  salario_medio: number;
}

const TabelaCargosNiveis = ({ servidores, niveis, onCargoClick }: TabelaCargosNiveisProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState<SortField>('cargo');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [cargoSelecionado, setCargoSelecionado] = useState<string | null>(null);

  // Processar dados dos cargos
  const dadosCargos = useMemo(() => {
    const cargosMap = new Map<string, {
      servidores: Servidor[];
      niveisCount: Map<string, number>;
    }>();

    // Agrupar servidores por cargo
    servidores.forEach((servidor) => {
      if (!cargosMap.has(servidor.cargo)) {
        cargosMap.set(servidor.cargo, {
          servidores: [],
          niveisCount: new Map(),
        });
      }

      const cargoData = cargosMap.get(servidor.cargo)!;
      cargoData.servidores.push(servidor);

      // Contar níveis (pegar apenas base, sem grau/ref)
      const nivelBase = servidor.nivel_codigo.split('-')[0];
      cargoData.niveisCount.set(
        nivelBase,
        (cargoData.niveisCount.get(nivelBase) || 0) + 1
      );
    });

    // Transformar em array de CargoInfo
    const resultado: CargoInfo[] = [];

    cargosMap.forEach((data, cargo) => {
      // Encontrar nível mais comum (moda)
      let nivelMaisComum = '';
      let maxCount = 0;
      data.niveisCount.forEach((count, nivel) => {
        if (count > maxCount) {
          maxCount = count;
          nivelMaisComum = nivel;
        }
      });

      // Encontrar grau/ref mais comum no nível mais comum
      const servidoresNoNivelMaisComum = data.servidores.filter(
        s => s.nivel_codigo.startsWith(nivelMaisComum)
      );

      const grauRefCount = new Map<string, number>();
      servidoresNoNivelMaisComum.forEach(s => {
        const parts = s.nivel_codigo.split('-');
        if (parts.length >= 3) {
          const grauRef = `${parts[1]}-${parts[2]}`;
          grauRefCount.set(grauRef, (grauRefCount.get(grauRef) || 0) + 1);
        }
      });

      let grauRefMaisComum = '';
      let maxGrauRefCount = 0;
      grauRefCount.forEach((count, grauRef) => {
        if (count > maxGrauRefCount) {
          maxGrauRefCount = count;
          grauRefMaisComum = grauRef;
        }
      });

      // Encontrar TODOS os níveis correspondentes na tabela rf_niveis
      const niveisDoGrupo = niveis.filter(n =>
        // Pegar código base sem grau/ref: "TEC59" → "59"
        n.codigo === nivelMaisComum.replace(/^[A-Z]+/, '')
      );

      let salario_min: number;
      let salario_max: number;

      if (niveisDoGrupo.length > 0) {
        // Usar faixa completa da tabela rf_niveis
        const salariosTabela = niveisDoGrupo.map(n => n.salario);
        salario_min = Math.min(...salariosTabela);
        salario_max = Math.max(...salariosTabela);
      } else {
        // Fallback: usar salários dos servidores
        const salariosServidores = data.servidores.map(s => s.salario);
        salario_min = Math.min(...salariosServidores);
        salario_max = Math.max(...salariosServidores);
      }

      const salarios = data.servidores.map(s => s.salario);

      resultado.push({
        cargo,
        nivel_inicial: nivelMaisComum,
        grau_ref_mais_comum: grauRefMaisComum,
        quantidade: data.servidores.length,
        salario_min,
        salario_max,
        salario_medio: salarios.reduce((a, b) => a + b, 0) / salarios.length,
      });
    });

    return resultado;
  }, [servidores, niveis]);

  // Filtrar e ordenar
  const dadosFiltrados = useMemo(() => {
    let resultado = [...dadosCargos];

    // Busca
    if (searchTerm) {
      const lower = searchTerm.toLowerCase();
      resultado = resultado.filter(c =>
        c.cargo.toLowerCase().includes(lower) ||
        c.nivel_inicial.toLowerCase().includes(lower)
      );
    }

    // Ordenação
    resultado.sort((a, b) => {
      let compareA = a[sortField];
      let compareB = b[sortField];

      if (sortField === 'cargo' || sortField === 'nivel_inicial') {
        compareA = (compareA as string).toLowerCase();
        compareB = (compareB as string).toLowerCase();
      }

      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1;
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return resultado;
  }, [dadosCargos, searchTerm, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleCargoClick = (cargo: string) => {
    setCargoSelecionado(cargo);
    if (onCargoClick) {
      onCargoClick(cargo);
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
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900">
            📋 Cargos e Níveis Iniciais
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Panorama dos {dadosCargos.length} cargos municipais com níveis mais comuns
          </p>
        </div>

        {/* Stats rápidos */}
        <div className="flex gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{dadosCargos.length}</div>
            <div className="text-xs text-gray-600">Cargos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{servidores.length}</div>
            <div className="text-xs text-gray-600">Servidores</div>
          </div>
        </div>
      </div>

      {/* Busca */}
      <div className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Buscar cargo ou nível..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Info */}
      {cargoSelecionado && (
        <div className="mb-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded flex items-center justify-between">
          <span className="text-sm text-blue-800">
            <strong>Filtro ativo:</strong> Mostrando apenas servidores do cargo "{cargoSelecionado}"
          </span>
          <button
            onClick={() => {
              setCargoSelecionado(null);
              if (onCargoClick) onCargoClick('');
            }}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Limpar filtro
          </button>
        </div>
      )}

      {/* Tabela */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b-2 border-gray-200">
              <th
                className="text-left p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('cargo')}
              >
                Cargo
                <SortIcon field="cargo" />
              </th>
              <th
                className="text-center p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('nivel_inicial')}
              >
                Nível Inicial
                <SortIcon field="nivel_inicial" />
              </th>
              <th
                className="text-center p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('quantidade')}
              >
                <Users className="w-4 h-4 inline mb-1" /> Servidores
                <SortIcon field="quantidade" />
              </th>
              <th
                className="text-right p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                onClick={() => handleSort('salario_min')}
              >
                <DollarSign className="w-4 h-4 inline mb-1" /> Faixa Salarial
                <SortIcon field="salario_min" />
              </th>
            </tr>
          </thead>
          <tbody>
            {dadosFiltrados.map((cargo) => {
              const isSelected = cargoSelecionado === cargo.cargo;

              return (
                <tr
                  key={cargo.cargo}
                  onClick={() => handleCargoClick(cargo.cargo)}
                  className={`border-b border-gray-200 cursor-pointer transition-all duration-200 ${
                    isSelected
                      ? 'bg-blue-50 hover:bg-blue-100 ring-2 ring-blue-500'
                      : 'hover:bg-gray-50 hover:shadow-md'
                  }`}
                >
                  {/* Cargo */}
                  <td className="p-3 text-gray-900 font-medium">
                    {isSelected && <span className="mr-2">👉</span>}
                    {cargo.cargo}
                  </td>

                  {/* Nível Inicial */}
                  <td className="p-3 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span
                        className={`inline-block px-3 py-1 rounded text-sm font-bold ${
                          isSelected
                            ? 'bg-blue-600 text-white'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {cargo.nivel_inicial}
                      </span>
                      {cargo.grau_ref_mais_comum && (
                        <span className="text-xs text-gray-500">
                          Comum: {cargo.grau_ref_mais_comum}
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Quantidade */}
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm font-semibold text-gray-700">
                      <Users className="w-3 h-3" />
                      {cargo.quantidade}
                    </span>
                  </td>

                  {/* Faixa Salarial */}
                  <td className="p-3 text-right font-mono text-sm">
                    <div className="text-gray-700">
                      {formatCurrency(cargo.salario_min)}
                    </div>
                    <div className="text-gray-400 text-xs">até</div>
                    <div className="text-gray-900 font-semibold">
                      {formatCurrency(cargo.salario_max)}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {dadosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum cargo encontrado com os filtros aplicados.
          </div>
        )}
      </div>

      {/* Footer info */}
      <div className="mt-4 text-xs text-gray-500 flex justify-between items-center border-t pt-3">
        <span>
          💡 <strong>Dica:</strong> Clique em um cargo para filtrar os servidores abaixo
        </span>
        <span>
          Mostrando {dadosFiltrados.length} de {dadosCargos.length} cargos
        </span>
      </div>
    </div>
  );
};

export default TabelaCargosNiveis;
