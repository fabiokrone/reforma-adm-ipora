import { useState, useEffect, useMemo } from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import {
  fetchServidoresHistorico,
  fetchNovosCargos,
  fetchCargosExtincao,
  fetchSnapshots
} from '../../lib/dataDepois';
import { ServidorHistorico, NovoCargo, CargoExtincao, NivelSnapshot, KPIComparativo as KPIComparativoType } from '../../types';
import KPIComparativo from '../depois/KPIComparativo';
import TabelaAumentos from '../depois/TabelaAumentos';
import NovosCargosCards from '../depois/NovosCargosCards';
import CargosExtincao from '../depois/CargosExtincao';
import ProjecaoLRF from '../depois/ProjecaoLRF';

const ViewDepois = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [historico, setHistorico] = useState<ServidorHistorico[]>([]);
  const [novosCargos, setNovosCargos] = useState<NovoCargo[]>([]);
  const [extincao, setExtincao] = useState<CargoExtincao[]>([]);
  const [snapshots, setSnapshots] = useState<{ antes: NivelSnapshot[], depois: NivelSnapshot[] }>({ antes: [], depois: [] });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [hist, novos, ext, snaps] = await Promise.all([
        fetchServidoresHistorico(),
        fetchNovosCargos(),
        fetchCargosExtincao(),
        fetchSnapshots()
      ]);
      setHistorico(hist);
      setNovosCargos(novos);
      setExtincao(ext);
      setSnapshots(snaps);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Calcular totalizadores
  const kpiData: KPIComparativoType = useMemo(() => {
    const massaAntes = snapshots.antes.reduce((sum, s) => sum + s.massa_salarial, 0);
    const massaDepois = snapshots.depois.reduce((sum, s) => sum + s.massa_salarial, 0);
    const servidoresAntes = snapshots.antes.reduce((sum, s) => sum + s.qtd_servidores, 0);
    const servidoresDepois = snapshots.depois.reduce((sum, s) => sum + s.qtd_servidores, 0);
    const diferencaMassa = massaDepois - massaAntes;
    const percentualAumento = massaAntes > 0 ? (diferencaMassa / massaAntes) * 100 : 0;
    const servidoresComAumento = historico.filter(s =>
      s.tipo_mudanca === 'AUMENTO' || s.tipo_mudanca === 'IRREDUTIBILIDADE'
    ).length;
    const niveisAntes = snapshots.antes.length;
    const niveisDepois = snapshots.depois.length;

    return {
      servidoresAntes,
      servidoresDepois,
      massaAntes,
      massaDepois,
      diferencaMassa,
      percentualAumento,
      servidoresComAumento,
      niveisAntes,
      niveisDepois,
    };
  }, [snapshots, historico]);

  // Calcular impactos para ProjecaoLRF
  const impactos = useMemo(() => {
    // Mudanças de nível (reajustes)
    const impactoMensalMudancas = historico
      .filter(s => s.tipo_mudanca === 'AUMENTO' || s.tipo_mudanca === 'IRREDUTIBILIDADE')
      .reduce((sum, s) => sum + s.diferenca, 0);

    // Separar novos cargos por tipo
    const ampliacoes = novosCargos.filter(c => c.tipo === 'AMPLIAÇÃO');
    const novosEfetivos = novosCargos.filter(c => c.tipo === 'NOVO CARGO' && c.nivel !== 'CC-9');
    const novosCC = novosCargos.filter(c => c.tipo === 'NOVO CARGO' && c.nivel === 'CC-9');

    const impactoMensalAmpliacoes = ampliacoes.reduce((sum, c) => sum + c.custo_mensal, 0);
    const impactoMensalNovosEfetivos = novosEfetivos.reduce((sum, c) => sum + c.custo_mensal, 0);
    const impactoMensalNovosCC = novosCC.reduce((sum, c) => sum + c.custo_mensal, 0);

    // Economia das extinções
    const economiaExtincoes = extincao.reduce((sum, c) => sum + (c.qtd_ocupantes * c.salario_inicial), 0);

    return {
      impactoMensalMudancas,
      impactoMensalAmpliacoes,
      impactoMensalNovosEfetivos,
      impactoMensalNovosCC,
      economiaExtincoes,
    };
  }, [historico, novosCargos, extincao]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Carregando dados da reforma...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Erro ao carregar dados</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadData}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-8">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-white">
        <h2 className="text-3xl font-bold mb-2">Cenário DEPOIS da Reforma</h2>
        <p className="text-blue-100">
          Análise detalhada do impacto da reforma administrativa nos cargos, salários e projeções fiscais
        </p>
      </div>

      {/* KPIs Comparativos */}
      <KPIComparativo data={kpiData} />

      {/* Tabela de Aumentos */}
      <TabelaAumentos servidores={historico} />

      {/* Novos Cargos e Ampliações */}
      {novosCargos.length > 0 && (
        <NovosCargosCards novosCargos={novosCargos} />
      )}

      {/* Cargos em Extinção */}
      {extincao.length > 0 && (
        <CargosExtincao cargos={extincao} />
      )}

      {/* Projeção LRF (3 anos) */}
      <ProjecaoLRF
        impactoMudancas={impactos.impactoMensalMudancas}
        impactoAmpliacoes={impactos.impactoMensalAmpliacoes}
        impactoNovosEfetivos={impactos.impactoMensalNovosEfetivos}
        impactoNovosCC={impactos.impactoMensalNovosCC}
        economiaExtincoes={impactos.economiaExtincoes}
      />
    </div>
  );
};

export default ViewDepois;
