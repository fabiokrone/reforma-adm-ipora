import { useState, useEffect } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Servidor, Nivel, KPIData, TabView } from '../types';
import { HighlightProvider } from '../contexts/HighlightContext';
import TabsNavigation from './tabs/TabsNavigation';
import ViewAntes from './views/ViewAntes';
import ViewDepois from './views/ViewDepois';

const Dashboard = () => {
  const [servidores, setServidores] = useState<Servidor[]>([]);
  const [niveis, setNiveis] = useState<Nivel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [kpiData, setKpiData] = useState<KPIData | null>(null);
  const [activeTab, setActiveTab] = useState<TabView>('antes');

  useEffect(() => {
    fetchData();
  }, []);

  /**
   * Busca TODOS os registros de uma tabela com paginação
   */
  const fetchAllRecords = async (tableName: string) => {
    const BATCH_SIZE = 1000;
    let allData: any[] = [];
    let offset = 0;
    let hasMore = true;

    while (hasMore) {
      const { data, error } = await supabase
        .from(tableName)
        .select('*')
        .range(offset, offset + BATCH_SIZE - 1);

      if (error) {
        console.error(`Erro ao buscar ${tableName}:`, error);
        throw error;
      }

      if (data && data.length > 0) {
        allData = [...allData, ...data];
        offset += BATCH_SIZE;

        // Se retornou menos que BATCH_SIZE, acabou
        if (data.length < BATCH_SIZE) {
          hasMore = false;
        }
      } else {
        hasMore = false;
      }
    }

    return allData;
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar TODOS os servidores com paginação
      const servidoresData = await fetchAllRecords('rf_servidores');

      // Buscar TODOS os níveis com paginação
      const niveisData = await fetchAllRecords('rf_niveis');

      if (!servidoresData || !niveisData) {
        throw new Error('Dados não encontrados');
      }

      setServidores(servidoresData);
      setNiveis(niveisData);

      // Calcular KPIs
      const totalServidores = servidoresData.length;
      const massaSalarial = servidoresData.reduce((sum, s) => sum + s.salario, 0);
      const salarioMedio = massaSalarial / totalServidores;
      const salarios = servidoresData.map((s) => s.salario);
      const menorSalario = Math.min(...salarios);
      const maiorSalario = Math.max(...salarios);
      const niveisUnicos = new Set(servidoresData.map((s) => s.nivel_codigo)).size;

      setKpiData({
        totalServidores,
        massaSalarial,
        salarioMedio,
        totalNiveis: niveisUnicos,
        menorSalario,
        maiorSalario,
      });
    } catch (err: any) {
      console.error('Erro ao buscar dados:', err);
      setError(err.message || 'Erro ao carregar os dados. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-700">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full">
          <div className="flex items-center gap-3 text-red-600 mb-4">
            <AlertCircle className="w-8 h-8" />
            <h2 className="text-xl font-bold">Erro ao Carregar Dados</h2>
          </div>
          <p className="text-gray-700 mb-4">{error}</p>
          <button
            onClick={fetchData}
            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <HighlightProvider>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <header className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Dashboard Iporã do Oeste/SC
            </h1>
            <p className="text-lg text-gray-600">
              Plano de Cargos e Salários - Reforma Administrativa
            </p>
            <div className="mt-4 inline-block bg-white px-6 py-2 rounded-full shadow-md">
              <span className="text-sm font-semibold text-blue-600">
                Dados de {servidores.length} servidores municipais
              </span>
            </div>
          </header>

          {/* Tabs Navigation */}
          <TabsNavigation activeTab={activeTab} onTabChange={setActiveTab} />

          {/* Content Views */}
          {activeTab === 'antes' && kpiData && (
            <ViewAntes servidores={servidores} niveis={niveis} kpiData={kpiData} />
          )}

          {activeTab === 'depois' && <ViewDepois />}

          {/* Footer */}
          <footer className="mt-12 text-center text-gray-600 text-sm">
            <p>
              Dashboard desenvolvido para análise do plano de cargos e salários
              da reforma administrativa.
            </p>
            <p className="mt-2">Prefeitura Municipal de Iporã do Oeste - SC</p>
          </footer>
        </div>
      </div>
    </HighlightProvider>
  );
};

export default Dashboard;
