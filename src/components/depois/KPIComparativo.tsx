import { TrendingUp, Users, Target, DollarSign } from 'lucide-react';
import { KPIComparativo as KPIComparativoType } from '../../types';
import { formatCurrency } from '../../lib/formatters';

interface KPIComparativoProps {
  data: KPIComparativoType;
}

const KPIComparativo = ({ data }: KPIComparativoProps) => {
  const {
    servidoresAntes,
    servidoresDepois,
    massaAntes,
    massaDepois,
    diferencaMassa,
    percentualAumento,
    servidoresComAumento,
    niveisAntes,
    niveisDepois,
  } = data;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1: Massa Salarial */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
            <DollarSign className="w-6 h-6 text-green-600" />
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">
            +{percentualAumento.toFixed(1)}%
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Massa Salarial</h3>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500">Antes:</span>
            <span className="text-sm font-medium text-gray-700">
              {formatCurrency(massaAntes)}
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500">Depois:</span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(massaDepois)}
            </span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">Diferença: </span>
          <span className="text-sm font-bold text-green-600">
            +{formatCurrency(diferencaMassa)}
          </span>
        </div>
      </div>

      {/* Card 2: Servidores com Aumento */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-6 h-6 text-blue-600" />
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
            {((servidoresComAumento / servidoresAntes) * 100).toFixed(0)}%
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Servidores com Aumento</h3>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-gray-900">{servidoresComAumento}</span>
            <span className="text-sm text-gray-500">de {servidoresAntes}</span>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            servidores tiveram aumento ou irredutibilidade aplicada
          </p>
        </div>
      </div>

      {/* Card 3: Níveis Ocupados - Consolidação */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
            <Target className="w-6 h-6 text-purple-600" />
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-purple-50 text-purple-700 rounded-full">
            {niveisDepois < niveisAntes ? 'Consolidado' : 'Expandido'}
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Níveis Ocupados</h3>
        <div className="space-y-1">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500">Antes:</span>
            <span className="text-sm font-medium text-gray-700">{niveisAntes}</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-gray-500">Depois:</span>
            <span className="text-lg font-bold text-gray-900">{niveisDepois}</span>
          </div>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <span className="text-xs text-gray-500">
            {niveisDepois < niveisAntes ? 'Redução de ' : 'Aumento de '}
          </span>
          <span className="text-sm font-bold text-purple-600">
            {Math.abs(niveisDepois - niveisAntes)} níveis
          </span>
        </div>
      </div>

      {/* Card 4: Impacto Mensal Total */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
            <Users className="w-6 h-6 text-orange-600" />
          </div>
          <span className="text-xs font-bold px-2 py-1 bg-orange-50 text-orange-700 rounded-full">
            Mensal
          </span>
        </div>
        <h3 className="text-sm font-semibold text-gray-600 mb-2">Impacto Mensal</h3>
        <div className="space-y-1">
          <div className="text-2xl font-bold text-gray-900">
            {formatCurrency(diferencaMassa)}
          </div>
          <p className="text-xs text-gray-500 mt-2">
            Incluindo mudanças de nível, ampliações e novos cargos
          </p>
        </div>
        <div className="mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500">Total Depois:</span>
            <span className="font-bold text-gray-700">{servidoresDepois} servidores</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIComparativo;
