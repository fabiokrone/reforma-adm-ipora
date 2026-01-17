import { Users, DollarSign, TrendingUp, Hash, ArrowDown, ArrowUp } from 'lucide-react';
import { KPIData } from '../types';
import { formatCurrency, formatNumber } from '../lib/formatters';

interface KPICardsProps {
  data: KPIData;
}

const KPICards = ({ data }: KPICardsProps) => {
  const cards = [
    {
      title: 'Total de Servidores',
      value: formatNumber(data.totalServidores),
      icon: Users,
      color: 'bg-blue-500',
      bgLight: 'bg-blue-50',
    },
    {
      title: 'Massa Salarial Total',
      value: formatCurrency(data.massaSalarial),
      icon: DollarSign,
      color: 'bg-green-500',
      bgLight: 'bg-green-50',
    },
    {
      title: 'Salário Médio',
      value: formatCurrency(data.salarioMedio),
      icon: TrendingUp,
      color: 'bg-purple-500',
      bgLight: 'bg-purple-50',
    },
    {
      title: 'Total de Níveis',
      value: formatNumber(data.totalNiveis),
      icon: Hash,
      color: 'bg-orange-500',
      bgLight: 'bg-orange-50',
    },
    {
      title: 'Menor Salário',
      value: formatCurrency(data.menorSalario),
      icon: ArrowDown,
      color: 'bg-red-500',
      bgLight: 'bg-red-50',
    },
    {
      title: 'Maior Salário',
      value: formatCurrency(data.maiorSalario),
      icon: ArrowUp,
      color: 'bg-emerald-500',
      bgLight: 'bg-emerald-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-300"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  {card.title}
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  {card.value}
                </p>
              </div>
              <div className={`${card.bgLight} p-3 rounded-full`}>
                <Icon className={`w-8 h-8 ${card.color.replace('bg-', 'text-')}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default KPICards;
