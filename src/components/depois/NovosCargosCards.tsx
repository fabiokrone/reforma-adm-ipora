import { useMemo } from 'react';
import { Plus, TrendingUp, Users, DollarSign, Info } from 'lucide-react';
import { NovoCargo } from '../../types';
import { formatCurrency } from '../../lib/formatters';

interface NovosCargosCardsProps {
  novosCargos: NovoCargo[];
}

const NovosCargosCards = ({ novosCargos }: NovosCargosCardsProps) => {
  // Separar por tipo e categoria
  const { ampliacoes, novosEfetivos, novosCC } = useMemo(() => {
    const ampliacoes = novosCargos.filter(c => c.tipo === 'AMPLIAÇÃO');
    const novosEfetivos = novosCargos.filter(c => c.tipo === 'NOVO CARGO' && c.nivel !== 'CC-9');
    const novosCC = novosCargos.filter(c => c.tipo === 'NOVO CARGO' && c.nivel === 'CC-9');
    return { ampliacoes, novosEfetivos, novosCC };
  }, [novosCargos]);

  // Totalizadores
  const totaisAmpliacoes = useMemo(() => ({
    vagasNovas: ampliacoes.reduce((sum, c) => sum + (c.vagas_depois - c.vagas_antes), 0),
    custoMensal: ampliacoes.reduce((sum, c) => sum + c.custo_mensal, 0),
    custoAnual: ampliacoes.reduce((sum, c) => sum + c.custo_anual, 0),
  }), [ampliacoes]);

  const totaisNovosEfetivos = useMemo(() => ({
    vagasNovas: novosEfetivos.reduce((sum, c) => sum + c.vagas_depois, 0),
    custoMensal: novosEfetivos.reduce((sum, c) => sum + c.custo_mensal, 0),
    custoAnual: novosEfetivos.reduce((sum, c) => sum + c.custo_anual, 0),
  }), [novosEfetivos]);

  const totaisNovosCC = useMemo(() => ({
    vagasNovas: novosCC.reduce((sum, c) => sum + c.vagas_depois, 0),
    custoMensal: novosCC.reduce((sum, c) => sum + c.custo_mensal, 0),
    custoAnual: novosCC.reduce((sum, c) => sum + c.custo_anual, 0),
  }), [novosCC]);

  const CardCargo = ({ cargo }: { cargo: NovoCargo }) => {
    const isNovo = cargo.tipo === 'NOVO CARGO';
    const vagasNovas = isNovo ? cargo.vagas_depois : (cargo.vagas_depois - cargo.vagas_antes);
    const bgColor = isNovo ? 'bg-gradient-to-br from-blue-50 to-indigo-50' : 'bg-gradient-to-br from-green-50 to-emerald-50';
    const iconColor = isNovo ? 'text-blue-600' : 'text-green-600';
    const badgeColor = isNovo ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700';

    return (
      <div className={`${bgColor} rounded-xl p-5 border-2 ${isNovo ? 'border-blue-200' : 'border-green-200'} hover:shadow-md transition-shadow`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-bold text-gray-900 text-base mb-1">{cargo.cargo}</h4>
            <div className="flex items-center gap-2 text-xs text-gray-600">
              <span className="px-2 py-1 bg-white rounded font-mono font-bold">
                {cargo.nivel}
              </span>
              <span className="text-gray-400">•</span>
              <span>{cargo.codigo_cargo}</span>
            </div>
          </div>
          <div className={`w-10 h-10 ${isNovo ? 'bg-blue-100' : 'bg-green-100'} rounded-lg flex items-center justify-center`}>
            {isNovo ? (
              <Plus className={`w-5 h-5 ${iconColor}`} />
            ) : (
              <TrendingUp className={`w-5 h-5 ${iconColor}`} />
            )}
          </div>
        </div>

        {/* Vagas */}
        <div className="mb-3">
          <div className="flex items-center gap-2 text-sm">
            <Users className="w-4 h-4 text-gray-500" />
            <span className="text-gray-600">
              {isNovo ? (
                <>
                  <span className="font-bold text-gray-900">{cargo.vagas_depois}</span> vagas novas
                </>
              ) : (
                <>
                  <span className="text-gray-500">{cargo.vagas_antes}</span>
                  <span className="mx-1">→</span>
                  <span className="font-bold text-gray-900">{cargo.vagas_depois}</span>
                  <span className={`ml-2 px-2 py-0.5 ${badgeColor} rounded-full text-xs font-bold`}>
                    +{vagasNovas}
                  </span>
                </>
              )}
            </span>
          </div>
        </div>

        {/* Salário Inicial */}
        <div className="mb-3 pb-3 border-b border-gray-200">
          <div className="text-xs text-gray-500 mb-1">Salário Inicial</div>
          <div className="text-lg font-bold text-gray-900">
            {formatCurrency(cargo.salario_inicial)}
          </div>
        </div>

        {/* Custos */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <div className="text-xs text-gray-500 mb-1">Custo Mensal</div>
            <div className="text-sm font-bold text-gray-900">
              {formatCurrency(cargo.custo_mensal)}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Custo Anual</div>
            <div className="text-sm font-bold text-gray-900">
              {formatCurrency(cargo.custo_anual)}
            </div>
          </div>
        </div>

        {/* Observações */}
        {cargo.observacoes && (
          <div className="mt-3 pt-3 border-t border-gray-200">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
              <p className="text-xs text-gray-600">{cargo.observacoes}</p>
            </div>
          </div>
        )}
      </div>
    );
  };

  const Totalizador = ({ titulo, dados, cor }: { titulo: string, dados: typeof totaisAmpliacoes, cor: string }) => (
    <div className={`bg-gradient-to-r ${cor} rounded-xl p-5 border-2 border-white shadow-sm`}>
      <h4 className="text-sm font-bold text-white mb-3">{titulo}</h4>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <div className="text-xs text-white/80 mb-1">Vagas Novas</div>
          <div className="text-2xl font-bold text-white">{dados.vagasNovas}</div>
        </div>
        <div>
          <div className="text-xs text-white/80 mb-1">Custo Mensal</div>
          <div className="text-lg font-bold text-white">{formatCurrency(dados.custoMensal)}</div>
        </div>
        <div>
          <div className="text-xs text-white/80 mb-1">Custo Anual</div>
          <div className="text-lg font-bold text-white">{formatCurrency(dados.custoAnual)}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* AMPLIAÇÕES */}
      {ampliacoes.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-green-600" />
              Ampliações de Cargos Existentes
            </h3>
            <p className="text-sm text-gray-500">
              Cargos que receberam novas vagas na reforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {ampliacoes.map((cargo) => (
              <CardCargo key={cargo.id} cargo={cargo} />
            ))}
          </div>

          <Totalizador
            titulo="TOTAL - AMPLIAÇÕES"
            dados={totaisAmpliacoes}
            cor="from-green-500 to-emerald-600"
          />
        </div>
      )}

      {/* NOVOS CARGOS EFETIVOS */}
      {novosEfetivos.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Novos Cargos Efetivos
            </h3>
            <p className="text-sm text-gray-500">
              Cargos efetivos criados pela reforma administrativa
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {novosEfetivos.map((cargo) => (
              <CardCargo key={cargo.id} cargo={cargo} />
            ))}
          </div>

          <Totalizador
            titulo="TOTAL - NOVOS CARGOS EFETIVOS"
            dados={totaisNovosEfetivos}
            cor="from-blue-500 to-indigo-600"
          />
        </div>
      )}

      {/* NOVOS CARGOS COMISSIONADOS (CC-9) */}
      {novosCC.length > 0 && (
        <div>
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-2">
              <Plus className="w-5 h-5 text-purple-600" />
              Novos Cargos Comissionados
            </h3>
            <p className="text-sm text-gray-500">
              Cargos em comissão (CC-9) criados pela reforma
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            {novosCC.map((cargo) => (
              <CardCargo key={cargo.id} cargo={cargo} />
            ))}
          </div>

          <Totalizador
            titulo="TOTAL - NOVOS CARGOS COMISSIONADOS"
            dados={totaisNovosCC}
            cor="from-purple-500 to-pink-600"
          />
        </div>
      )}

      {/* Totalizador Geral */}
      {(ampliacoes.length > 0 || novosEfetivos.length > 0 || novosCC.length > 0) && (
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-6 border-2 border-white shadow-lg">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-bold text-white flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              IMPACTO TOTAL - AMPLIAÇÕES E NOVOS CARGOS
            </h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2">Total de Vagas Novas</div>
              <div className="text-3xl font-bold text-white">
                {totaisAmpliacoes.vagasNovas + totaisNovosEfetivos.vagasNovas + totaisNovosCC.vagasNovas}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2">Impacto Mensal Total</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totaisAmpliacoes.custoMensal + totaisNovosEfetivos.custoMensal + totaisNovosCC.custoMensal)}
              </div>
            </div>
            <div className="bg-white/10 rounded-lg p-4">
              <div className="text-sm text-white/80 mb-2">Impacto Anual Total</div>
              <div className="text-2xl font-bold text-white">
                {formatCurrency(totaisAmpliacoes.custoAnual + totaisNovosEfetivos.custoAnual + totaisNovosCC.custoAnual)}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovosCargosCards;
