import { useState, useEffect, useMemo } from 'react';
import { Search, ChevronDown, User } from 'lucide-react';
import { Nivel } from '../../types';
import { useHighlight } from '../../contexts/HighlightContext';
import NivelTableCompact from './NivelTableCompact';
import TodosOsNiveis from './TodosOsNiveis';

interface CompactSalaryViewerProps {
  niveis: Nivel[];
}

interface NivelAgrupado {
  codigo_completo: string;
  codigo: string;
  categoria: string;
  niveis: Nivel[];
}

const CompactSalaryViewer = ({ niveis }: CompactSalaryViewerProps) => {
  const [nivelSelecionado, setNivelSelecionado] = useState<string>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [modoVisualizacao, setModoVisualizacao] = useState<'individual' | 'todos'>('individual');
  const { highlightState } = useHighlight();

  // Agrupar níveis por código (sem prefixo, como vem do banco)
  const niveisAgrupados = useMemo(() => {
    const grupos: Record<string, NivelAgrupado> = {};

    niveis.forEach((nivel) => {
      // O codigo no banco rf_niveis já vem sem prefixo: "58", "20-B", "43"
      const codigo = nivel.codigo;

      if (!grupos[codigo]) {
        grupos[codigo] = {
          codigo: nivel.codigo,
          codigo_completo: nivel.codigo, // No banco não tem prefixo!
          categoria: 'Outros',
          niveis: [],
        };
      }
      grupos[codigo].niveis.push(nivel);
    });

    // Processar cada grupo
    Object.values(grupos).forEach((grupo) => {
      // Ordenar células dentro do grupo
      grupo.niveis.sort((a, b) => {
        const grauOrder: Record<string, number> = {
          'I': 1, 'II': 2, 'III': 3, 'IV': 4
        };

        const grauA = grauOrder[a.grau] || parseInt(a.grau) || 999;
        const grauB = grauOrder[b.grau] || parseInt(b.grau) || 999;

        if (grauA !== grauB) return grauA - grauB;
        return a.referencia.localeCompare(b.referencia);
      });
    });

    // Ordenar grupos por código numérico
    return Object.values(grupos).sort((a, b) => {
      const numA = parseInt(a.codigo.replace(/\D/g, '')) || 0;
      const numB = parseInt(b.codigo.replace(/\D/g, '')) || 0;
      return numA - numB;
    });
  }, [niveis]);

  // Auto-seleção quando servidor é clicado
  useEffect(() => {
    if (highlightState.nivelDestacado) {
      // Match direto por código (sem prefixo)
      const matchExato = niveisAgrupados.find(
        n => n.codigo === highlightState.nivelDestacado
      );

      if (matchExato) {
        setNivelSelecionado(matchExato.codigo);

        // Scroll automático após 100ms
        setTimeout(() => {
          document.getElementById('compact-salary-viewer')?.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
          });
        }, 100);
      }
    }
  }, [highlightState.nivelDestacado, niveisAgrupados]);

  // Filtrar níveis para busca
  const niveisFiltrados = useMemo(() => {
    if (!searchTerm) return niveisAgrupados;

    const lower = searchTerm.toLowerCase();
    return niveisAgrupados.filter(
      (grupo) =>
        grupo.codigo_completo.toLowerCase().includes(lower) ||
        grupo.codigo.toLowerCase().includes(lower) ||
        grupo.categoria.toLowerCase().includes(lower)
    );
  }, [niveisAgrupados, searchTerm]);

  const nivelAtual = niveisAgrupados.find((n) => n.codigo_completo === nivelSelecionado);

  return (
    <div id="compact-salary-viewer" className="space-y-6">
      {/* Header com controles */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900">
            Tabelas Salariais Detalhadas
          </h3>

          {/* Toggle de visualização */}
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setModoVisualizacao('individual')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                modoVisualizacao === 'individual'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Individual
            </button>
            <button
              onClick={() => setModoVisualizacao('todos')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                modoVisualizacao === 'todos'
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              📋 Todos os Níveis
            </button>
          </div>
        </div>

        {/* Breadcrumb quando servidor selecionado (apenas no modo individual) */}
        {highlightState.servidorData && modoVisualizacao === 'individual' && (
          <div className="mb-4 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center gap-2 text-sm">
              <User className="w-4 h-4 text-green-600" />
              <span className="font-semibold text-green-900">
                {highlightState.servidorData.nome}
              </span>
              <span className="text-green-700">
                • {highlightState.servidorData.cargo}
              </span>
              <span className="text-green-700">
                • Nível {highlightState.nivelDestacado}
              </span>
            </div>
          </div>
        )}

        {/* Controles de seleção (apenas no modo individual) */}
        {modoVisualizacao === 'individual' && (
          <>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Busca */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar nível..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Dropdown Select */}
              <div className="md:w-96">
                <div className="relative">
                  <select
                    value={nivelSelecionado}
                    onChange={(e) => setNivelSelecionado(e.target.value)}
                    className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white cursor-pointer"
                  >
                    <option value="">Selecione um nível...</option>
                    {niveisFiltrados.map((grupo) => (
                      <option key={grupo.codigo_completo} value={grupo.codigo_completo}>
                        {grupo.codigo_completo} • {grupo.categoria} ({grupo.niveis.length} posições)
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="mt-3 text-sm text-gray-600">
              Mostrando {niveisFiltrados.length} de {niveisAgrupados.length} níveis disponíveis
            </div>
          </>
        )}
      </div>

      {/* Renderização condicional por modo */}
      {modoVisualizacao === 'individual' ? (
        // Modo Individual: Tabela única
        nivelAtual ? (
          <NivelTableCompact nivelAgrupado={nivelAtual} />
        ) : (
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
            <div className="text-6xl mb-4">📊</div>
            <h4 className="text-lg font-semibold text-gray-700 mb-2">
              Nenhum nível selecionado
            </h4>
            <p className="text-gray-600 text-sm max-w-md mx-auto">
              Selecione um nível no dropdown acima ou clique em um servidor na lista para
              visualizar a tabela salarial detalhada.
            </p>
          </div>
        )
      ) : (
        // Modo Todos os Níveis: Accordion compacto
        <TodosOsNiveis niveisAgrupados={niveisAgrupados} />
      )}
    </div>
  );
};

export default CompactSalaryViewer;