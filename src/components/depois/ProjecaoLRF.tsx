import { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Calculator, TrendingUp, AlertCircle } from 'lucide-react';
import { formatCurrency } from '../../lib/formatters';

interface ProjecaoLRFProps {
  impactoMudancas: number;      // Reajustes dos 93 servidores
  impactoAmpliacoes: number;    // Ampliações de vagas
  impactoNovosEfetivos: number; // Novos cargos efetivos
  impactoNovosCC: number;       // Novos CC-9
  economiaExtincoes: number;    // Economia (valor POSITIVO)
}

interface ProjecaoAno {
  ano: number;
  meses: number;
  mudancas: number;
  ampliacoes: number;
  novosEfetivos: number;
  novosCC: number;
  subtotalCustos: number;
  extincoes: number;
  impactoLiquido: number;
}

const ProjecaoLRF = ({
  impactoMudancas,
  impactoAmpliacoes,
  impactoNovosEfetivos,
  impactoNovosCC,
  economiaExtincoes,
}: ProjecaoLRFProps) => {
  // Impacto líquido mensal
  const impactoMensalCustos = impactoMudancas + impactoAmpliacoes + impactoNovosEfetivos + impactoNovosCC;
  const impactoMensalLiquido = impactoMensalCustos - economiaExtincoes;

  // Calcular projeção anual com 13º e 1/3 férias
  const calcularAno = (mensal: number, meses: number): number => {
    const salarioBase = mensal * meses;
    const decimoTerceiro = mensal * (meses / 12);
    const tercoFerias = (mensal * (meses / 12)) / 3;
    return salarioBase + decimoTerceiro + tercoFerias;
  };

  // Projeções para 3 anos
  const projecoes: ProjecaoAno[] = useMemo(() => {
    const anos = [
      { ano: 2026, meses: 11 }, // Fev-Dez
      { ano: 2027, meses: 12 },
      { ano: 2028, meses: 12 },
    ];

    return anos.map(({ ano, meses }) => ({
      ano,
      meses,
      mudancas: calcularAno(impactoMudancas, meses),
      ampliacoes: calcularAno(impactoAmpliacoes, meses),
      novosEfetivos: calcularAno(impactoNovosEfetivos, meses),
      novosCC: calcularAno(impactoNovosCC, meses),
      subtotalCustos: calcularAno(impactoMensalCustos, meses),
      extincoes: calcularAno(economiaExtincoes, meses),
      impactoLiquido: calcularAno(impactoMensalLiquido, meses),
    }));
  }, [impactoMudancas, impactoAmpliacoes, impactoNovosEfetivos, impactoNovosCC, impactoMensalCustos, economiaExtincoes, impactoMensalLiquido]);

  const totalGeral = projecoes.reduce((sum, p) => sum + p.impactoLiquido, 0);

  // Dados para o gráfico (stacked bar chart)
  const dadosGrafico = projecoes.map(p => ({
    ano: p.ano.toString(),
    'Mudanças': p.mudancas,
    'Ampliações': p.ampliacoes,
    'Novos Efetivos': p.novosEfetivos,
    'Novos CC-9': p.novosCC,
    'Economia': -p.extincoes, // Negativo para mostrar abaixo do eixo
  }));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
            <Calculator className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-2xl font-bold">Projeção LRF (3 anos)</h3>
            <p className="text-purple-100 text-sm">
              Impacto financeiro completo da reforma administrativa
            </p>
          </div>
        </div>

        {/* Detalhamento do Impacto Mensal */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 bg-white/10 rounded-xl p-4">
          <div>
            <div className="text-xs text-purple-200 mb-1">Mudanças de Nível</div>
            <div className="text-base font-bold">{formatCurrency(impactoMudancas)}</div>
          </div>
          <div>
            <div className="text-xs text-purple-200 mb-1">Ampliações</div>
            <div className="text-base font-bold">{formatCurrency(impactoAmpliacoes)}</div>
          </div>
          <div>
            <div className="text-xs text-purple-200 mb-1">Novos Efetivos</div>
            <div className="text-base font-bold">{formatCurrency(impactoNovosEfetivos)}</div>
          </div>
          <div>
            <div className="text-xs text-purple-200 mb-1">Novos CC-9</div>
            <div className="text-base font-bold">{formatCurrency(impactoNovosCC)}</div>
          </div>
          <div>
            <div className="text-xs text-purple-200 mb-1">Economia Extinções</div>
            <div className="text-base font-bold text-green-300">-{formatCurrency(economiaExtincoes)}</div>
          </div>
          <div className="border-l-2 border-white/30 pl-4">
            <div className="text-xs text-purple-200 mb-1">Impacto Mensal Líquido</div>
            <div className="text-lg font-bold">{formatCurrency(impactoMensalLiquido)}</div>
          </div>
        </div>
      </div>

      {/* Alerta LRF */}
      <div className="bg-blue-50 border-l-4 border-blue-500 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 text-sm mb-1">
              Nota sobre Lei de Responsabilidade Fiscal
            </h4>
            <p className="text-sm text-blue-800">
              Esta projeção considera o impacto completo da reforma nos 3 primeiros anos,
              incluindo custos (mudanças de nível, ampliações e novos cargos) e economias (extinção gradual de cargos).
              Os cálculos incluem salários base, 13º salário proporcional e terço constitucional de férias.
              O ano de 2026 considera 11 meses (fevereiro a dezembro).
            </p>
          </div>
        </div>
      </div>

      {/* Tabela de Projeção Completa */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <h4 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Detalhamento Anual - Todos os Componentes
          </h4>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b-2 border-gray-200">
                <th className="text-left p-4 text-sm font-semibold text-gray-700 sticky left-0 bg-gray-50">
                  Componente
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700">Mensal</th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700 bg-blue-50">
                  2026<br/><span className="text-xs font-normal">(11 meses)</span>
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700 bg-blue-50">
                  2027<br/><span className="text-xs font-normal">(12 meses)</span>
                </th>
                <th className="text-right p-4 text-sm font-semibold text-gray-700 bg-blue-50">
                  2028<br/><span className="text-xs font-normal">(12 meses)</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {/* Mudanças de Nível */}
              <tr className="border-b border-gray-100 hover:bg-orange-50/50">
                <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white">
                  Mudanças de Nível
                </td>
                <td className="p-4 text-right font-mono text-sm text-orange-700">
                  +{formatCurrency(impactoMudancas)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-orange-700 bg-blue-50">
                  +{formatCurrency(projecoes[0].mudancas)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-orange-700 bg-blue-50">
                  +{formatCurrency(projecoes[1].mudancas)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-orange-700 bg-blue-50">
                  +{formatCurrency(projecoes[2].mudancas)}
                </td>
              </tr>

              {/* Ampliações */}
              <tr className="border-b border-gray-100 hover:bg-green-50/50">
                <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white">
                  Ampliações de Vagas
                </td>
                <td className="p-4 text-right font-mono text-sm text-green-700">
                  +{formatCurrency(impactoAmpliacoes)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-green-700 bg-blue-50">
                  +{formatCurrency(projecoes[0].ampliacoes)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-green-700 bg-blue-50">
                  +{formatCurrency(projecoes[1].ampliacoes)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-green-700 bg-blue-50">
                  +{formatCurrency(projecoes[2].ampliacoes)}
                </td>
              </tr>

              {/* Novos Efetivos */}
              <tr className="border-b border-gray-100 hover:bg-blue-50/50">
                <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white">
                  Novos Cargos Efetivos
                </td>
                <td className="p-4 text-right font-mono text-sm text-blue-700">
                  +{formatCurrency(impactoNovosEfetivos)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-blue-700 bg-blue-50">
                  +{formatCurrency(projecoes[0].novosEfetivos)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-blue-700 bg-blue-50">
                  +{formatCurrency(projecoes[1].novosEfetivos)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-blue-700 bg-blue-50">
                  +{formatCurrency(projecoes[2].novosEfetivos)}
                </td>
              </tr>

              {/* Novos CC-9 */}
              <tr className="border-b border-gray-100 hover:bg-purple-50/50">
                <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white">
                  Novos Cargos CC-9
                </td>
                <td className="p-4 text-right font-mono text-sm text-purple-700">
                  +{formatCurrency(impactoNovosCC)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-purple-700 bg-blue-50">
                  +{formatCurrency(projecoes[0].novosCC)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-purple-700 bg-blue-50">
                  +{formatCurrency(projecoes[1].novosCC)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-purple-700 bg-blue-50">
                  +{formatCurrency(projecoes[2].novosCC)}
                </td>
              </tr>

              {/* Subtotal Custos */}
              <tr className="bg-red-50 border-b-2 border-red-200 font-semibold">
                <td className="p-4 text-gray-900 sticky left-0 bg-red-50">
                  SUBTOTAL CUSTOS
                </td>
                <td className="p-4 text-right font-mono text-base text-red-700">
                  +{formatCurrency(impactoMensalCustos)}
                </td>
                <td className="p-4 text-right font-mono text-base text-red-700 bg-red-100">
                  +{formatCurrency(projecoes[0].subtotalCustos)}
                </td>
                <td className="p-4 text-right font-mono text-base text-red-700 bg-red-100">
                  +{formatCurrency(projecoes[1].subtotalCustos)}
                </td>
                <td className="p-4 text-right font-mono text-base text-red-700 bg-red-100">
                  +{formatCurrency(projecoes[2].subtotalCustos)}
                </td>
              </tr>

              {/* Extinções (Economia) */}
              <tr className="border-b-2 border-gray-300 hover:bg-teal-50/50">
                <td className="p-4 font-medium text-gray-900 sticky left-0 bg-white">
                  Extinções (Economia)
                </td>
                <td className="p-4 text-right font-mono text-sm text-teal-700 font-bold">
                  -{formatCurrency(economiaExtincoes)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-teal-700 font-bold bg-blue-50">
                  -{formatCurrency(projecoes[0].extincoes)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-teal-700 font-bold bg-blue-50">
                  -{formatCurrency(projecoes[1].extincoes)}
                </td>
                <td className="p-4 text-right font-mono text-sm text-teal-700 font-bold bg-blue-50">
                  -{formatCurrency(projecoes[2].extincoes)}
                </td>
              </tr>

              {/* Impacto Líquido */}
              <tr className="bg-indigo-100 border-t-2 border-indigo-300 font-bold">
                <td className="p-4 text-indigo-900 sticky left-0 bg-indigo-100 text-lg">
                  IMPACTO LÍQUIDO
                </td>
                <td className="p-4 text-right font-mono text-lg text-indigo-900">
                  {formatCurrency(impactoMensalLiquido)}
                </td>
                <td className="p-4 text-right font-mono text-lg text-indigo-900 bg-indigo-200">
                  {formatCurrency(projecoes[0].impactoLiquido)}
                </td>
                <td className="p-4 text-right font-mono text-lg text-indigo-900 bg-indigo-200">
                  {formatCurrency(projecoes[1].impactoLiquido)}
                </td>
                <td className="p-4 text-right font-mono text-lg text-indigo-900 bg-indigo-200">
                  {formatCurrency(projecoes[2].impactoLiquido)}
                </td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="bg-purple-200 border-t-4 border-purple-400">
                <td colSpan={4} className="p-4 text-right font-bold text-purple-900 text-lg sticky left-0 bg-purple-200">
                  TOTAL GERAL (3 anos)
                </td>
                <td className="p-4 text-right font-mono text-2xl font-bold text-purple-900 bg-purple-300">
                  {formatCurrency(totalGeral)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Gráfico de Composição */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h4 className="text-lg font-bold text-gray-900 mb-6">Composição do Impacto Anual</h4>
        <div className="h-[500px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosGrafico}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="ano"
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis
                tickFormatter={(value) => {
                  const absValue = Math.abs(value);
                  return `${value < 0 ? '-' : ''}R$ ${(absValue / 1000).toFixed(0)}k`;
                }}
                tick={{ fill: '#6b7280', fontSize: 12 }}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(Math.abs(value))}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(4px)',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '12px',
                }}
              />
              <Legend
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <ReferenceLine y={0} stroke="#000" strokeWidth={2} />

              {/* Barras de custos (empilhadas acima) */}
              <Bar dataKey="Mudanças" stackId="custos" fill="#f97316" />
              <Bar dataKey="Ampliações" stackId="custos" fill="#10b981" />
              <Bar dataKey="Novos Efetivos" stackId="custos" fill="#3b82f6" />
              <Bar dataKey="Novos CC-9" stackId="custos" fill="#a855f7" radius={[8, 8, 0, 0]} />

              {/* Barra de economia (abaixo do eixo) */}
              <Bar dataKey="Economia" fill="#14b8a6" radius={[0, 0, 8, 8]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default ProjecaoLRF;
