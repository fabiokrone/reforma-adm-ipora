import { TrendingDown, Users, Info, DollarSign } from 'lucide-react';
import { CargoExtincao as CargoExtincaoType } from '../../types';
import { formatCurrency } from '../../lib/formatters';

interface CargosExtincaoProps {
  cargos: CargoExtincaoType[];
}

const CargosExtincao = ({ cargos }: CargosExtincaoProps) => {
  const calcularEconomia = (cargo: CargoExtincaoType) => {
    const economiaMensal = cargo.qtd_ocupantes * cargo.salario_inicial;
    const economiaAnual = economiaMensal * 13.33;
    return { economiaMensal, economiaAnual };
  };

  const totais = {
    totalCargos: cargos.length,
    totalVagas: cargos.reduce((sum, c) => sum + c.qtd_ocupantes, 0),
    economiaMensal: cargos.reduce((sum, c) => sum + (c.qtd_ocupantes * c.salario_inicial), 0),
    economiaAnual: 0,
  };
  totais.economiaAnual = totais.economiaMensal * 13.33;

  return (
    <div className="bg-white rounded-2xl shadow-sm border-2 border-teal-200 p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <TrendingDown className="w-6 h-6 text-teal-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">
              Cargos em Extinção
            </h3>
            <p className="text-sm text-gray-600">
              {totais.totalCargos} cargos marcados para extinção gradual • {totais.totalVagas} vagas ocupadas
            </p>
          </div>
        </div>

        {/* Alerta Informativo */}
        <div className="bg-teal-50 border-l-4 border-teal-500 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <Info className="w-5 h-5 text-teal-600 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-teal-900 text-sm mb-1">
                Economia Gradual
              </h4>
              <p className="text-sm text-teal-800">
                Estes cargos não terão novos concursos. A economia será realizada gradualmente
                conforme os ocupantes se aposentarem ou deixarem o cargo. Os valores apresentados
                representam a economia potencial total quando todos os cargos estiverem extintos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabela de Cargos em Extinção */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-teal-50 border-b-2 border-teal-200">
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Código</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Cargo</th>
              <th className="text-center p-4 text-sm font-semibold text-gray-700">Nível</th>
              <th className="text-center p-4 text-sm font-semibold text-gray-700">Vagas</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-700">Salário Inicial</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-700 bg-teal-100">
                Economia Mensal
              </th>
              <th className="text-right p-4 text-sm font-semibold text-gray-700 bg-teal-100">
                Economia Anual
              </th>
            </tr>
          </thead>
          <tbody>
            {cargos.map((cargo) => {
              const { economiaMensal, economiaAnual } = calcularEconomia(cargo);
              return (
                <tr
                  key={cargo.id}
                  className="border-b border-gray-100 hover:bg-teal-50/50 transition-colors"
                >
                  <td className="p-4">
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded font-mono text-sm font-bold">
                      {cargo.codigo_cargo}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-gray-900">{cargo.cargo}</div>
                    {cargo.motivo_extincao && (
                      <div className="text-xs text-gray-500 mt-1">
                        {cargo.motivo_extincao}
                      </div>
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm font-bold">
                      {cargo.nivel}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="w-4 h-4 text-gray-400" />
                      <span className="font-bold text-gray-900">{cargo.qtd_ocupantes}</span>
                    </div>
                  </td>
                  <td className="p-4 text-right font-mono text-sm text-gray-700">
                    {formatCurrency(cargo.salario_inicial)}
                  </td>
                  <td className="p-4 text-right font-mono text-base font-bold text-teal-700 bg-teal-50">
                    -{formatCurrency(economiaMensal)}
                  </td>
                  <td className="p-4 text-right font-mono text-base font-bold text-teal-700 bg-teal-50">
                    -{formatCurrency(economiaAnual)}
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="bg-teal-100 border-t-2 border-teal-300">
              <td colSpan={5} className="p-4 text-right font-bold text-gray-900">
                ECONOMIA TOTAL ({totais.totalCargos} cargos • {totais.totalVagas} vagas)
              </td>
              <td className="p-4 text-right font-mono text-lg font-bold text-teal-900 bg-teal-200">
                -{formatCurrency(totais.economiaMensal)}
              </td>
              <td className="p-4 text-right font-mono text-lg font-bold text-teal-900 bg-teal-200">
                -{formatCurrency(totais.economiaAnual)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Cards de Totalizadores */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-teal-600" />
            <div className="text-xs font-semibold text-teal-700">Cargos em Extinção</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totais.totalCargos}</div>
        </div>

        <div className="bg-gradient-to-br from-teal-50 to-green-50 rounded-xl p-4 border border-teal-200">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-4 h-4 text-teal-600" />
            <div className="text-xs font-semibold text-teal-700">Vagas Ocupadas</div>
          </div>
          <div className="text-2xl font-bold text-gray-900">{totais.totalVagas}</div>
        </div>

        <div className="bg-gradient-to-br from-teal-100 to-green-100 rounded-xl p-4 border-2 border-teal-300">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-teal-700" />
            <div className="text-xs font-semibold text-teal-800">Economia Mensal</div>
          </div>
          <div className="text-xl font-bold text-teal-900">
            -{formatCurrency(totais.economiaMensal)}
          </div>
        </div>

        <div className="bg-gradient-to-br from-teal-100 to-green-100 rounded-xl p-4 border-2 border-teal-300">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-teal-700" />
            <div className="text-xs font-semibold text-teal-800">Economia Anual</div>
          </div>
          <div className="text-xl font-bold text-teal-900">
            -{formatCurrency(totais.economiaAnual)}
          </div>
        </div>
      </div>

      {/* Observações */}
      {cargos.some(c => c.observacoes) && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <h4 className="text-sm font-bold text-gray-900 mb-3">Observações Adicionais</h4>
          <div className="space-y-2">
            {cargos.filter(c => c.observacoes).map((cargo) => (
              <div key={cargo.id} className="text-sm">
                <span className="font-semibold text-gray-700">{cargo.cargo}:</span>{' '}
                <span className="text-gray-600">{cargo.observacoes}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CargosExtincao;
