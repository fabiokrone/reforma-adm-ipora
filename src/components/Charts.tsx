import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Servidor, Nivel } from '../types';
import { formatCurrency } from '../lib/formatters';

interface ChartsProps {
  servidores: Servidor[];
  niveis: Nivel[];
}

const COLORS = [
  '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#ec4899', '#14b8a6', '#f97316', '#06b6d4', '#84cc16'
];

const Charts = ({ servidores, niveis }: ChartsProps) => {
  // 1. Distribuição de Servidores por Nível
  const distribuicaoPorNivel = servidores.reduce((acc, servidor) => {
    const nivel = servidor.nivel_codigo;
    acc[nivel] = (acc[nivel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataDistribuicaoNivel = Object.entries(distribuicaoPorNivel)
    .map(([nivel, quantidade]) => ({ nivel, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 15);

  // 2. Distribuição por Cargo (Top 10)
  const distribuicaoPorCargo = servidores.reduce((acc, servidor) => {
    const cargo = servidor.cargo;
    acc[cargo] = (acc[cargo] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const dataDistribuicaoCargo = Object.entries(distribuicaoPorCargo)
    .map(([cargo, quantidade]) => ({ cargo, quantidade }))
    .sort((a, b) => b.quantidade - a.quantidade)
    .slice(0, 10);

  // 3. Faixas Salariais
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

  // 4. Distribuição GRAU × REFERÊNCIA (dados agregados)
  const distribuicaoGrauRef = niveis.reduce((acc, nivel) => {
    const key = `${nivel.grau}-${nivel.referencia}`;
    if (!acc[key]) {
      acc[key] = { grau: nivel.grau, referencia: nivel.referencia, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {} as Record<string, { grau: string; referencia: string; count: number }>);

  const dataGrauRef = Object.values(distribuicaoGrauRef)
    .sort((a, b) => b.count - a.count)
    .slice(0, 20);

  // 5. Top 10 Maiores Salários
  const topSalarios = [...servidores]
    .sort((a, b) => b.salario - a.salario)
    .slice(0, 10)
    .map((s) => ({
      nome: s.nome.length > 25 ? s.nome.substring(0, 25) + '...' : s.nome,
      salario: s.salario,
    }));

  // 6. Massa Salarial por Cargo (Top 10)
  const massaPorCargo = servidores.reduce((acc, servidor) => {
    const cargo = servidor.cargo;
    acc[cargo] = (acc[cargo] || 0) + servidor.salario;
    return acc;
  }, {} as Record<string, number>);

  const dataMassaCargo = Object.entries(massaPorCargo)
    .map(([cargo, massa]) => ({ cargo, massa }))
    .sort((a, b) => b.massa - a.massa)
    .slice(0, 10);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded shadow-lg">
          <p className="font-semibold text-gray-900">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.name.includes('Salário') || entry.name.includes('Massa')
                ? formatCurrency(entry.value)
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-8">
      {/* Row 1: Distribuição por Nível e Cargo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 1: Distribuição por Nível */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Distribuição de Servidores por Nível (Top 15)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataDistribuicaoNivel} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis type="category" dataKey="nivel" width={80} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade" fill="#3b82f6" name="Quantidade" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 2: Distribuição por Cargo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Distribuição por Cargo (Top 10)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={dataDistribuicaoCargo}
                dataKey="quantidade"
                nameKey="cargo"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={(entry) => `${entry.cargo}: ${entry.quantidade}`}
              >
                {dataDistribuicaoCargo.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 2: Faixas Salariais e Grau × Referência */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 3: Faixas Salariais */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Distribuição por Faixas Salariais
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataFaixasSalariais}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="faixa" angle={-45} textAnchor="end" height={100} />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantidade" fill="#10b981" name="Servidores" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 4: Distribuição Grau × Referência */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Distribuição Grau × Referência (Top 20)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataGrauRef}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="grau"
                label={{ value: 'Grau', position: 'insideBottom', offset: -5 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="count" fill="#f59e0b" name="Quantidade de Níveis" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Row 3: Top Salários e Massa por Cargo */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico 5: Top 10 Maiores Salários */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Top 10 Maiores Salários
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={topSalarios} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(value) => formatCurrency(value)} />
              <YAxis type="category" dataKey="nome" width={150} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="salario" fill="#8b5cf6" name="Salário" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Gráfico 6: Massa Salarial por Cargo */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-bold text-gray-900 mb-4">
            Massa Salarial por Cargo (Top 10)
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={dataMassaCargo}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="cargo"
                angle={-45}
                textAnchor="end"
                height={120}
                interval={0}
              />
              <YAxis tickFormatter={(value) => formatCurrency(value)} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="massa" fill="#ec4899" name="Massa Salarial" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Charts;
