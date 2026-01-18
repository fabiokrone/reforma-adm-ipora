import { useState } from 'react';
import { Servidor, Nivel, KPIData } from '../../types';
import KPICards from '../KPICards';
import Charts from '../Charts';
import NiveisAnalysis from '../niveis/NiveisAnalysis';
import ServidoresTable from '../ServidoresTable';
import CompactSalaryViewer from '../niveis/CompactSalaryViewer';
import TabelaCargosNiveis from '../cargos/TabelaCargosNiveis';

interface ViewAntesProps {
  servidores: Servidor[];
  niveis: Nivel[];
  kpiData: KPIData;
}

const ViewAntes = ({ servidores, niveis, kpiData }: ViewAntesProps) => {
  const [filtroCargoAtivo, setFiltroCargoAtivo] = useState('');

  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <KPICards data={kpiData} />

      {/* Charts */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Análises e Gráficos
        </h2>
        <Charts servidores={servidores} niveis={niveis} />
      </div>

      {/* Análise da Estrutura de Níveis */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Análise da Estrutura de Níveis
        </h2>
        <NiveisAnalysis servidores={servidores} niveis={niveis} />
      </div>

      {/* Tabela de Cargos e Níveis Iniciais */}
      <div>
        <TabelaCargosNiveis
          servidores={servidores}
          niveis={niveis}
          onCargoClick={setFiltroCargoAtivo}
        />
      </div>

      {/* Tabela de Servidores */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Lista de Servidores
        </h2>
        <p className="text-gray-600 mb-4">
          Clique em um servidor para ver sua posição exata na tabela salarial abaixo.
        </p>
        <ServidoresTable
          servidores={servidores}
          filtroCargoExterno={filtroCargoAtivo}
        />
      </div>

      {/* Visualizador Compacto de Níveis Salariais */}
      <div>
        <CompactSalaryViewer niveis={niveis} />
      </div>
    </div>
  );
};

export default ViewAntes;
