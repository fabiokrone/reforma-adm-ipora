import { useMemo } from 'react';
import { ResponsiveContainer, Treemap, Tooltip } from 'recharts';
import { Users, BoxSelect } from 'lucide-react';
import { Servidor, Nivel } from '../../types';

interface NiveisAnalysisProps {
  servidores: Servidor[];
  niveis: Nivel[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#06b6d4'];

// --- FUNÇÕES AUXILIARES ---

const extractCodigoBase = (nivelCodigoLimpo: string): string => {
  if (!nivelCodigoLimpo) return '';
  // Remove -GRAU-REFERENCIA do final
  // Ex: "20-III-G" → "20"
  // Ex: "20-B-I-A" → "20-B"
  return nivelCodigoLimpo.replace(/-(I{1,3}V?)-[A-I]$/, '');
};

// --- TOOLTIPS CUSTOMIZADOS ---

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white/95 backdrop-blur-md p-4 rounded-xl shadow-2xl border border-gray-100 max-w-[250px] z-50">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-gray-800 text-lg">Nível {data.name}</span>
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-bold">
            {data.value} servidores
          </span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-gray-500 font-semibold uppercase border-b pb-1 mb-1">
            Cargos neste nível:
          </p>
          {data.cargos?.map((cargo: string, idx: number) => (
            <p key={idx} className="text-xs text-gray-600 truncate">• {cargo}</p>
          ))}
        </div>
      </div>
    );
  }
  return null;
};

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, index, name, value } = props;
  const isLarge = width > 50 && height > 50;

  return (
    <g>
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        style={{
          fill: COLORS[index % COLORS.length],
          stroke: '#fff',
          strokeWidth: 2,
          opacity: 0.9,
        }}
        rx={6}
        ry={6}
      />
      {isLarge ? (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={14}
            fontWeight="bold"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
          >
            {name}
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.9)"
            fontSize={11}
          >
            {value} pessoas
          </text>
        </>
      ) : (
        width > 20 && height > 20 && (
          <text x={x + width/2} y={y + height/2 + 4} textAnchor="middle" fill="#fff" fontSize={10}>
            {name}
          </text>
        )
      )}
    </g>
  );
};

// --- COMPONENTE PRINCIPAL ---

const NiveisAnalysis = ({ servidores, niveis }: NiveisAnalysisProps) => {

  // Processar dados (memoizado para performance)
  const dadosProcessados = useMemo(() => {
    // 1. Extrair códigos únicos da tabela de níveis
    const codigosTabela = new Set(niveis.map(n => n.codigo));

    // 2. Processar servidores: agrupar por código base + cargo
    const servidoresPorCodigo = new Map<string, { qtd: number; cargos: Map<string, number> }>();

    servidores.forEach(servidor => {
      const codigoBase = extractCodigoBase(servidor.nivel_codigo_limpo);
      if (!codigoBase) return;

      if (!servidoresPorCodigo.has(codigoBase)) {
        servidoresPorCodigo.set(codigoBase, { qtd: 0, cargos: new Map() });
      }

      const nivel = servidoresPorCodigo.get(codigoBase)!;
      nivel.qtd++;
      nivel.cargos.set(servidor.cargo, (nivel.cargos.get(servidor.cargo) || 0) + 1);
    });

    // 3. Preparar dados de níveis ocupados
    const ocupados = Array.from(servidoresPorCodigo.entries()).map(([codigo, data]) => {
      const cargosFormatados = Array.from(data.cargos.entries())
        .map(([cargo, qtd]) => `${cargo} (${qtd})`)
        .sort();

      return {
        codigo,
        qtd: data.qtd,
        cargos: cargosFormatados,
      };
    });

    // 4. Identificar códigos vagos
    const codigosUsados = new Set(servidoresPorCodigo.keys());
    const vagos = Array.from(codigosTabela)
      .filter(codigo => !codigosUsados.has(codigo))
      .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

    // 5. Preparar todos os níveis para o grid (ordenados)
    const allLevels = [
      ...vagos.map(code => ({ code, type: 'vago' as const })),
      ...ocupados.map(item => ({
        code: item.codigo,
        type: 'ocupado' as const,
        qtd: item.qtd,
        cargos: item.cargos
      }))
    ].sort((a, b) => a.code.localeCompare(b.code, undefined, { numeric: true }));

    // 6. Preparar dados para Treemap (ordenado por quantidade)
    const treemapData = ocupados
      .map(item => ({
        name: item.codigo,
        value: item.qtd,
        cargos: item.cargos
      }))
      .sort((a, b) => b.value - a.value);

    // 7. Estatísticas
    const maiorNivel = ocupados.reduce((max, item) =>
      item.qtd > max.qtd ? item : max
    , { codigo: '', qtd: 0 });

    const niveisComUmServidor = ocupados.filter(item => item.qtd === 1).length;

    return {
      codigosTabela,
      ocupados,
      vagos,
      allLevels,
      treemapData,
      stats: {
        totalNiveis: codigosTabela.size,
        niveisOcupados: ocupados.length,
        niveisVagos: vagos.length,
        percentualOcupacao: Math.round((ocupados.length / codigosTabela.size) * 100),
        maiorNivel,
        niveisComUmServidor,
      }
    };
  }, [servidores, niveis]);

  const { allLevels, treemapData, stats } = dadosProcessados;

  return (
    <div className="space-y-8">

      {/* HEADER COM ESTATÍSTICAS */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-2xl font-bold mb-2">📊 Estrutura de Carreira</h2>
          <p className="text-blue-100 max-w-2xl">
            A tabela possui <span className="font-bold text-white">{stats.niveisVagos} níveis ociosos ({100 - stats.percentualOcupacao}%)</span>.
            A maior concentração está no Nível {stats.maiorNivel.codigo} com {stats.maiorNivel.qtd} servidores.
          </p>
        </div>
        <div className="flex gap-8 mt-6 relative z-10">
          <div>
            <p className="text-blue-200 text-xs uppercase font-bold">Maior Nível</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              Nível {stats.maiorNivel.codigo} <Users size={18} className="text-blue-300"/>
            </p>
            <p className="text-sm text-blue-100">{stats.maiorNivel.qtd} servidores</p>
          </div>
          <div>
            <p className="text-blue-200 text-xs uppercase font-bold">Níveis Críticos</p>
            <p className="text-2xl font-bold flex items-center gap-2">
              {stats.niveisComUmServidor} Níveis <BoxSelect size={18} className="text-blue-300"/>
            </p>
            <p className="text-sm text-blue-100">com apenas 1 servidor</p>
          </div>
        </div>
        <BoxSelect className="absolute -bottom-4 -right-4 text-white opacity-10" size={150} />
      </div>

      {/* MATRIX GRID - MAPA COMPLETO */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <BoxSelect size={20} className="text-blue-500"/>
              Mapa Completo da Tabela ({stats.totalNiveis} Níveis)
            </h3>
            <p className="text-sm text-gray-500">
              Visualização de todos os "slots" disponíveis. Blocos coloridos indicam níveis ativos.
            </p>
          </div>
          <div className="flex gap-3 text-sm">
            <span className="flex items-center gap-1 text-gray-500">
              <div className="w-3 h-3 border border-gray-300 rounded bg-gray-50"></div> Vago
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <div className="w-3 h-3 bg-blue-100 border border-blue-300 rounded"></div> Pouca gente
            </span>
            <span className="flex items-center gap-1 text-gray-500">
              <div className="w-3 h-3 bg-blue-600 rounded"></div> Lotado
            </span>
          </div>
        </div>

        {/* GRID SYSTEM */}
        <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
          {allLevels.map((level) => {
            const isOccupied = level.type === 'ocupado';
            const intensity = isOccupied ? Math.min((level.qtd || 0) / 10, 1) : 0;

            return (
              <div
                key={level.code}
                className={`
                  relative group aspect-square rounded-lg border flex flex-col items-center justify-center transition-all duration-200 cursor-default
                  ${isOccupied
                    ? 'bg-blue-50 border-blue-200 hover:ring-2 hover:ring-blue-400 shadow-sm'
                    : 'bg-gray-50/50 border-gray-100 border-dashed text-gray-300'
                  }
                `}
                style={{
                  backgroundColor: isOccupied ? `rgba(59, 130, 246, ${0.1 + (intensity * 0.9)})` : undefined,
                  color: isOccupied && intensity > 0.5 ? 'white' : undefined,
                  borderColor: isOccupied && intensity > 0.5 ? 'transparent' : undefined
                }}
              >
                <span className={`text-xs font-bold ${!isOccupied ? 'font-normal' : ''}`}>
                  {level.code}
                </span>

                {/* Tooltip Hover */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block w-48 z-20">
                  <div className="bg-gray-900 text-white text-xs rounded-lg py-2 px-3 shadow-xl">
                    <p className="font-bold border-b border-gray-700 pb-1 mb-1">
                      Nível {level.code} {isOccupied ? `(${level.qtd})` : '(Vago)'}
                    </p>
                    {isOccupied && level.cargos?.map((c, i) => (
                      <div key={i} className="text-gray-300 truncate text-[10px]">{c}</div>
                    ))}
                    {!isOccupied && <span className="text-gray-500 italic">Sem servidores</span>}
                  </div>
                  <div className="w-2 h-2 bg-gray-900 rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* TREEMAP - DENSIDADE POPULACIONAL */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <div className="mb-4">
          <h3 className="text-lg font-bold text-gray-900">📦 Distribuição Volumétrica</h3>
          <p className="text-sm text-gray-500">
            O tamanho do bloco representa a quantidade de servidores no nível.
          </p>
        </div>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <Treemap
              data={treemapData}
              dataKey="value"
              aspectRatio={4 / 3}
              stroke="#fff"
              content={<CustomTreemapContent />}
            >
              <Tooltip content={<CustomTooltip />} />
            </Treemap>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default NiveisAnalysis;
