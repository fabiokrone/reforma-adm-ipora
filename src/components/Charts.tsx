import {
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  Treemap,
} from 'recharts';
import { Servidor, Nivel } from '../types';
import { formatCurrency } from '../lib/formatters';

interface ChartsProps {
  servidores: Servidor[];
  niveis: Nivel[];
}

// PALETA SEMÂNTICA - Cores que contam histórias
const DESIGN_SYSTEM = {
  // Cores primárias por função
  categoria: {
    'Segurança': { fill: '#3b82f6', stroke: '#2563eb' },
    'Serviços Operacionais': { fill: '#f59e0b', stroke: '#d97706' },
    'Saúde': { fill: '#ef4444', stroke: '#dc2626' },
    'Técnico': { fill: '#8b5cf6', stroke: '#7c3aed' },
    'Técnico Especializado': { fill: '#6366f1', stroke: '#4f46e5' },
    'Administrativo': { fill: '#10b981', stroke: '#059669' },
    'Superior': { fill: '#ec4899', stroke: '#db2777' },
    'Atividades': { fill: '#06b6d4', stroke: '#0891b2' },
    'Cargo em Comissão': { fill: '#f97316', stroke: '#ea580c' },
    'Outros': { fill: '#6b7280', stroke: '#4b5563' },
  },

  // Grid minimalista
  grid: {
    stroke: '#f3f4f6',
    strokeDasharray: '3 3',
  },
};

// Array de cores para gráficos variados
const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316',
  '#6366f1', '#06b6d4', '#84cc16', '#a855f7'
];

// Função para obter categoria
const getCategoriaNivel = (nivelCodigo: string): string => {
  if (nivelCodigo.startsWith('SEG')) return 'Segurança';
  if (nivelCodigo.startsWith('SOP')) return 'Serviços Operacionais';
  if (nivelCodigo.startsWith('SAU')) return 'Saúde';
  if (nivelCodigo.startsWith('TEC')) return 'Técnico';
  if (nivelCodigo.startsWith('TEP')) return 'Técnico Especializado';
  if (nivelCodigo.startsWith('ADM')) return 'Administrativo';
  if (nivelCodigo.startsWith('SUP')) return 'Superior';
  if (nivelCodigo.startsWith('ACT')) return 'Atividades';
  if (nivelCodigo.startsWith('CC')) return 'Cargo em Comissão';
  return 'Outros';
};

// Componente customizado para Treemap
const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, index, name, value } = props;

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
      {/* Só mostra texto se o bloco for grande */}
      {width > 60 && height > 40 && name && value && (
        <>
          <text
            x={x + width / 2}
            y={y + height / 2 - 8}
            textAnchor="middle"
            fill="#fff"
            fontSize={12}
            fontWeight="bold"
            style={{ textShadow: '0px 1px 2px rgba(0,0,0,0.3)' }}
          >
            {name.split(' ')[0]}...
          </text>
          <text
            x={x + width / 2}
            y={y + height / 2 + 12}
            textAnchor="middle"
            fill="rgba(255,255,255,0.9)"
            fontSize={10}
          >
            {formatCurrency(value).replace(',00', '')}
          </text>
        </>
      )}
    </g>
  );
};

// Tooltip Customizado Premium (Glassmorphism)
const PremiumTooltip = ({ active, payload, label, tipo = 'default' }: any) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;

  // Treemap tem estrutura diferente: { name, size }
  const isTreemap = tipo === 'massa';
  const nome = isTreemap ? data.name : (data.cargo || data.categoria || data.nome || label);
  const valor = isTreemap ? data.size : (data.massa || data.salario || data.quantidade || payload[0].value);

  return (
    <div className="bg-white/95 backdrop-blur-sm p-4 rounded-xl shadow-2xl border border-gray-200 min-w-[200px]">
      {/* Header com indicador colorido */}
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-3 h-3 rounded-full"
          style={{ backgroundColor: payload[0].color || payload[0].fill }}
        />
        <p className="font-bold text-gray-900 text-sm">
          {nome}
        </p>
      </div>

      {/* Valores */}
      <div className="space-y-1">
        {tipo === 'quantidade' && (
          <>
            <p className="text-2xl font-bold text-gray-900">
              {data.quantidade || payload[0].value}
            </p>
            {data.percentual && (
              <p className="text-sm text-gray-600">
                {data.percentual}% do total
              </p>
            )}
          </>
        )}

        {tipo === 'massa' && (
          <>
            <p className="text-xl font-bold text-gray-900">
              {formatCurrency(valor)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Impacto na folha</p>
          </>
        )}

        {tipo === 'default' && (
          <p className="text-lg font-semibold text-gray-900">
            {payload[0].value}
          </p>
        )}
      </div>
    </div>
  );
};

// Componente Gauge de Ocupação
const OccupancyGauge = ({ totalNiveis, ocupados }: { totalNiveis: number, ocupados: number }) => {
  const vagos = totalNiveis - ocupados;
  const percentual = Math.round((ocupados / totalNiveis) * 100);

  // Cor dinâmica baseada em ocupação
  const getColor = (percent: number) => {
    if (percent > 95) return '#ef4444'; // Vermelho (Crítico)
    if (percent > 80) return '#f59e0b'; // Laranja (Atenção)
    return '#3b82f6'; // Azul (Normal)
  };

  const activeColor = getColor(percentual);

  const data = [
    { name: 'Ocupados', value: ocupados, fill: activeColor },
    { name: 'Vagos', value: vagos, fill: '#e5e7eb' },
  ];

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center relative overflow-hidden">
      <h3 className="text-lg font-bold text-gray-800 self-start mb-2">
        📊 Taxa de Ocupação
      </h3>
      <p className="text-sm text-gray-500 self-start mb-4">
        Utilização da tabela salarial
      </p>

      <div className="w-full h-[180px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="100%"
              startAngle={180}
              endAngle={0}
              innerRadius={80}
              outerRadius={110}
              paddingAngle={0}
              dataKey="value"
              stroke="none"
              cornerRadius={10}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white/95 backdrop-blur shadow-xl p-3 rounded-lg border border-gray-100">
                      <p className="font-bold text-gray-800">{payload[0].name}</p>
                      <p className="text-sm" style={{ color: payload[0].payload.fill }}>
                        {payload[0].value} níveis
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Texto Centralizado */}
        <div className="absolute bottom-0 left-0 right-0 text-center pb-4">
          <p className="text-4xl font-extrabold text-gray-900">{percentual}%</p>
          <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mt-1">
            {ocupados} / {totalNiveis} Ocupados
          </p>
        </div>
      </div>

      {/* Badge de Status */}
      <div className="mt-2">
        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
          percentual > 90 ? 'bg-red-100 text-red-700' : 'bg-blue-50 text-blue-700'
        }`}>
          {percentual > 90 ? 'Lotação Crítica' : 'Capacidade Saudável'}
        </span>
      </div>
    </div>
  );
};

const Charts = ({ servidores, niveis }: ChartsProps) => {
  // Função para extrair código base (remove grau e referência)
  const extractCodigoBase = (nivelCodigoLimpo: string): string => {
    if (!nivelCodigoLimpo) return '';
    // Remove -GRAU-REFERENCIA do final
    // Ex: "20-III-G" → "20"
    // Ex: "20-B-I-A" → "20-B"
    return nivelCodigoLimpo.replace(/-(I{1,3}V?)-[A-I]$/, '');
  };

  // 1. DONUT CHART - Distribuição por Categoria
  const distribuicaoPorCategoria = servidores.reduce((acc, servidor) => {
    const categoria = getCategoriaNivel(servidor.nivel_codigo);
    acc[categoria] = (acc[categoria] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataDonut = Object.entries(distribuicaoPorCategoria)
    .map(([categoria, quantidade]) => ({
      categoria,
      quantidade,
      percentual: ((quantidade / servidores.length) * 100).toFixed(1),
      fill: DESIGN_SYSTEM.categoria[categoria as keyof typeof DESIGN_SYSTEM.categoria]?.fill || '#6b7280',
    }))
    .sort((a, b) => b.quantidade - a.quantidade);

  // GAUGE - Ocupação de Níveis (calculado dinamicamente)
  const codigosTabela = new Set(niveis.map(n => n.codigo));
  const codigosUsados = new Set(
    servidores
      .map(s => extractCodigoBase(s.nivel_codigo_limpo))
      .filter(Boolean)
  );

  const totalNiveis = codigosTabela.size;
  const niveisOcupados = codigosUsados.size;

  // 3. AREA CHART - Distribuição Salarial Fluida
  const faixasSalariais = [
    { faixa: '< R$ 2k', min: 0, max: 2000 },
    { faixa: 'R$ 2k - 3k', min: 2000, max: 3000 },
    { faixa: 'R$ 3k - 4k', min: 3000, max: 4000 },
    { faixa: 'R$ 4k - 5k', min: 4000, max: 5000 },
    { faixa: 'R$ 5k - 7k', min: 5000, max: 7000 },
    { faixa: 'R$ 7k - 10k', min: 7000, max: 10000 },
    { faixa: '> R$ 10k', min: 10000, max: Infinity },
  ];

  const dataFaixasSalariais = faixasSalariais.map((faixa) => ({
    faixa: faixa.faixa,
    quantidade: servidores.filter(
      (s) => s.salario >= faixa.min && s.salario < faixa.max
    ).length,
  }));

  // 4. TREEMAP - Massa Salarial por Cargo (Top 15)
  const dataMassa = Object.entries(
    servidores.reduce((acc, servidor) => {
      acc[servidor.cargo] = (acc[servidor.cargo] || 0) + servidor.salario;
      return acc;
    }, {} as Record<string, number>)
  )
    .map(([name, size]) => ({ name, size }))
    .sort((a, b) => b.size - a.size)
    .slice(0, 15);

  return (
    <div className="space-y-6">
      {/* Row 1: Visão Organizacional - Gauge + Donut */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Gauge de Ocupação de Níveis */}
        <OccupancyGauge totalNiveis={totalNiveis} ocupados={niveisOcupados} />

        {/* Donut de Categorias (2 colunas no lg) */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 relative lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              📊 Servidores por Categoria
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Composição do quadro de {servidores.length} servidores
            </p>
          </div>

          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={dataDonut}
                dataKey="quantidade"
                nameKey="categoria"
                cx="50%"
                cy="50%"
                innerRadius={80}
                outerRadius={120}
                paddingAngle={2}
                cornerRadius={4}
              >
                {dataDonut.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={(props) => <PremiumTooltip {...props} tipo="quantidade" />} />
              <Legend
                verticalAlign="bottom"
                height={36}
                formatter={(value, entry: any) => (
                  <span className="text-sm text-gray-700">
                    {value} ({entry.payload.percentual}%)
                  </span>
                )}
              />
            </PieChart>
          </ResponsiveContainer>

          {/* Total no centro do donut */}
          <div className="absolute top-[45%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
            <p className="text-3xl font-bold text-gray-900">{servidores.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
        </div>
      </div>

      {/* Row 2: Distribuição e Impacto */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Area Chart - Curva de Distribuição Salarial */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              💰 Curva de Distribuição Salarial
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Concentração de servidores por faixa
            </p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={dataFaixasSalariais}>
                <defs>
                  <linearGradient id="colorSalario" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <CartesianGrid {...DESIGN_SYSTEM.grid} horizontal={true} vertical={false} />
                <XAxis
                  dataKey="faixa"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 11 }}
                  angle={-45}
                  textAnchor="end"
                  height={80}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6b7280', fontSize: 12 }}
                />
                <Tooltip content={(props) => <PremiumTooltip {...props} tipo="quantidade" />} />
                <Area
                  type="monotone"
                  dataKey="quantidade"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorSalario)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Treemap - Mapa da Massa Salarial */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-gray-800">
              💵 Mapa da Massa Salarial
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Tamanho do bloco = custo do cargo na folha
            </p>
          </div>

          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <Treemap
                data={dataMassa}
                dataKey="size"
                aspectRatio={4/3}
                stroke="#fff"
                content={<CustomTreemapContent />}
              >
                <Tooltip content={(props) => <PremiumTooltip {...props} tipo="massa" />} />
              </Treemap>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;
