import { useEffect, useRef } from 'react';
import { NivelAgrupado } from '../../types';
import { useHighlight } from '../../contexts/HighlightContext';
import NivelTable from './NivelTable';

interface NivelCardProps {
  nivelAgrupado: NivelAgrupado;
}

const NivelCard = ({ nivelAgrupado }: NivelCardProps) => {
  const { highlightState } = useHighlight();
  const cardRef = useRef<HTMLDivElement>(null);

  const isDestacado = highlightState.nivelDestacado === nivelAgrupado.codigo_completo;

  // Scroll automático quando o nível é destacado
  useEffect(() => {
    if (isDestacado && highlightState.scrollToNivel && cardRef.current) {
      setTimeout(() => {
        cardRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }, 100);
    }
  }, [isDestacado, highlightState.scrollToNivel]);

  return (
    <div
      ref={cardRef}
      id={`nivel-${nivelAgrupado.codigo_completo}`}
      className={`bg-white rounded-lg shadow-md overflow-hidden transition-all duration-500 ${
        isDestacado
          ? 'ring-4 ring-green-500 shadow-2xl transform scale-[1.01]'
          : 'hover:shadow-lg'
      }`}
    >
      {/* Header do Card */}
      <div
        className={`px-6 py-4 transition-colors duration-300 ${
          isDestacado
            ? 'bg-gradient-to-r from-green-600 to-blue-600'
            : 'bg-gradient-to-r from-gray-700 to-gray-800'
        }`}
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              {isDestacado && <span className="animate-bounce">⭐</span>}
              NÍVEL {nivelAgrupado.codigo_completo}
              {isDestacado && highlightState.servidorData && (
                <span className="text-sm font-normal ml-2">
                  ({highlightState.servidorData.nome})
                </span>
              )}
            </h3>
            <p className="text-sm text-gray-200 mt-1">
              {nivelAgrupado.categoria} • Código {nivelAgrupado.codigo}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-200">
              {nivelAgrupado.niveis.length} posições
            </p>
          </div>
        </div>
      </div>

      {/* Tabela Pivot */}
      <div className="p-4 bg-gray-50">
        <NivelTable
          niveis={nivelAgrupado.niveis}
          codigoCompleto={nivelAgrupado.codigo_completo}
        />
      </div>
    </div>
  );
};

export default NivelCard;
