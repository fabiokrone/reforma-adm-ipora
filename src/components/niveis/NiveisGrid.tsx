import { useMemo, useState } from 'react';
import { Nivel } from '../../types';
import { agruparNiveis } from '../../lib/nivelParser';
import { useHighlight } from '../../contexts/HighlightContext';
import NivelCard from './NivelCard';
import { ChevronDown, ChevronUp, X } from 'lucide-react';

interface NiveisGridProps {
  niveis: Nivel[];
}

const NiveisGrid = ({ niveis }: NiveisGridProps) => {
  const { highlightState, clearHighlight } = useHighlight();
  const [categoriasExpandidas, setCategoriasExpandidas] = useState<Set<string>>(new Set());

  const niveisAgrupados = useMemo(() => agruparNiveis(niveis), [niveis]);

  // Agrupar por categoria
  const porCategoria = useMemo(() => {
    const grupos = new Map<string, typeof niveisAgrupados>();

    niveisAgrupados.forEach((nivel) => {
      if (!grupos.has(nivel.categoria)) {
        grupos.set(nivel.categoria, []);
      }
      grupos.get(nivel.categoria)!.push(nivel);
    });

    return Array.from(grupos.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [niveisAgrupados]);

  const toggleCategoria = (categoria: string) => {
    const novasExpandidas = new Set(categoriasExpandidas);
    if (novasExpandidas.has(categoria)) {
      novasExpandidas.delete(categoria);
    } else {
      novasExpandidas.add(categoria);
    }
    setCategoriasExpandidas(novasExpandidas);
  };

  // Expandir automaticamente a categoria do nível destacado
  useMemo(() => {
    if (highlightState.nivelDestacado) {
      const nivelEncontrado = niveisAgrupados.find(
        (n) => n.codigo_completo === highlightState.nivelDestacado
      );
      if (nivelEncontrado && !categoriasExpandidas.has(nivelEncontrado.categoria)) {
        setCategoriasExpandidas(new Set([...categoriasExpandidas, nivelEncontrado.categoria]));
      }
    }
  }, [highlightState.nivelDestacado, niveisAgrupados, categoriasExpandidas]);

  const getCategoriaColor = (categoria: string): string => {
    const cores: Record<string, string> = {
      'Segurança': 'blue',
      'Serviços Operacionais': 'orange',
      'Saúde': 'red',
      'Técnico': 'purple',
      'Técnico Especializado': 'indigo',
      'Administrativo': 'green',
      'Superior': 'pink',
      'Outros': 'gray',
    };
    return cores[categoria] || 'gray';
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb / Barra de Info */}
      {highlightState.servidorSelecionado && (
        <div className="bg-gradient-to-r from-blue-600 to-green-600 text-white p-4 rounded-lg shadow-lg flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-sm opacity-90">Visualizando posição de:</p>
              <p className="font-bold text-lg">
                {highlightState.servidorSelecionado} → {highlightState.nivelDestacado}-
                {highlightState.grauDestacado}-{highlightState.referenciaDestacada}
              </p>
            </div>
          </div>
          <button
            onClick={clearHighlight}
            className="bg-white/20 hover:bg-white/30 p-2 rounded-full transition-colors"
            title="Limpar Destaque"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Introdução */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-3">
          📋 Tabelas Salariais Completas
        </h2>
        <p className="text-gray-600">
          Todas as {niveisAgrupados.length} tabelas salariais organizadas por categoria.
          Clique em um servidor na lista acima para ver sua posição exata na tabela.
        </p>
      </div>

      {/* Accordion por Categoria */}
      {porCategoria.map(([categoria, niveis]) => {
        const cor = getCategoriaColor(categoria);
        const expandido = categoriasExpandidas.has(categoria);

        return (
          <div key={categoria} className="bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header da Categoria */}
            <button
              onClick={() => toggleCategoria(categoria)}
              className={`w-full px-6 py-4 flex items-center justify-between bg-${cor}-50 hover:bg-${cor}-100 transition-colors`}
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">
                  {categoria === 'Segurança' && '🛡️'}
                  {categoria === 'Serviços Operacionais' && '🔧'}
                  {categoria === 'Saúde' && '⚕️'}
                  {categoria === 'Técnico' && '💼'}
                  {categoria === 'Técnico Especializado' && '🎓'}
                  {categoria === 'Administrativo' && '📁'}
                  {categoria === 'Superior' && '👔'}
                  {categoria === 'Outros' && '📌'}
                </span>
                <div className="text-left">
                  <h3 className="text-lg font-bold text-gray-900">{categoria}</h3>
                  <p className="text-sm text-gray-600">{niveis.length} tabelas salariais</p>
                </div>
              </div>
              {expandido ? (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              )}
            </button>

            {/* Conteúdo da Categoria */}
            {expandido && (
              <div className="p-6 space-y-6 bg-gray-50">
                {niveis.map((nivelAgrupado) => (
                  <NivelCard key={nivelAgrupado.codigo_completo} nivelAgrupado={nivelAgrupado} />
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default NiveisGrid;
