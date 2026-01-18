import { Construction, AlertCircle, TrendingUp, Users, FileText } from 'lucide-react';

const PlaceholderDepois = () => {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="max-w-5xl mx-auto text-center py-16">
        <div className="inline-block p-6 bg-blue-100 rounded-full mb-6 animate-bounce">
          <Construction className="w-16 h-16 text-blue-600" />
        </div>
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Cenário Pós-Reforma
        </h2>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
          Esta seção apresentará a nova estrutura de cargos e salários após a aprovação
          da reforma administrativa municipal. A visualização completa estará disponível
          em breve.
        </p>
      </div>

      {/* Preview Cards - O que estará disponível */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Card 1: Níveis Extintos */}
        <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-14 h-14 bg-red-200 rounded-full mb-4 mx-auto">
            <span className="text-3xl">❌</span>
          </div>
          <h3 className="text-xl font-bold text-red-900 mb-3 text-center">
            Níveis Extintos
          </h3>
          <p className="text-red-800 text-sm leading-relaxed text-center">
            Tabelas salariais que serão descontinuadas e não receberão novos servidores
          </p>
        </div>

        {/* Card 2: Níveis Novos */}
        <div className="bg-gradient-to-br from-green-50 to-green-100 border-2 border-green-300 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-14 h-14 bg-green-200 rounded-full mb-4 mx-auto">
            <span className="text-3xl">✨</span>
          </div>
          <h3 className="text-xl font-bold text-green-900 mb-3 text-center">
            Níveis Novos
          </h3>
          <p className="text-green-800 text-sm leading-relaxed text-center">
            Novas estruturas salariais criadas para melhor organização e progressão
          </p>
        </div>

        {/* Card 3: Mudanças */}
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
          <div className="flex items-center justify-center w-14 h-14 bg-blue-200 rounded-full mb-4 mx-auto">
            <span className="text-3xl">🔄</span>
          </div>
          <h3 className="text-xl font-bold text-blue-900 mb-3 text-center">
            Transições
          </h3>
          <p className="text-blue-800 text-sm leading-relaxed text-center">
            Servidores que migrarão para novos níveis com a implementação da reforma
          </p>
        </div>
      </div>

      {/* Funcionalidades Futuras */}
      <div className="bg-white rounded-xl shadow-xl p-8 max-w-5xl mx-auto border border-gray-200">
        <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-gray-200">
          <div className="p-2 bg-blue-100 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900">
            Recursos Disponíveis na Visualização Completa
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Feature 1 */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Nova Estrutura</p>
              <p className="text-gray-600 text-sm">
                Tabelas salariais reorganizadas com progressão clara
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">✓</span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Comparativo ANTES × DEPOIS</p>
              <p className="text-gray-600 text-sm">
                Análise lado a lado das mudanças salariais
              </p>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Impacto Financeiro</p>
              <p className="text-gray-600 text-sm">
                Projeções de custos e economia com a nova estrutura
              </p>
            </div>
          </div>

          {/* Feature 4 */}
          <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
              <Users className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="font-semibold text-gray-900 mb-1">Mudanças por Servidor</p>
              <p className="text-gray-600 text-sm">
                Detalhamento individual de transições e progressões
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Informativo */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-600 rounded-lg p-6 max-w-5xl mx-auto shadow-md">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0 p-2 bg-blue-100 rounded-full">
            <AlertCircle className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <p className="font-semibold text-blue-900 mb-2 text-lg">Nota Importante</p>
            <p className="text-blue-800 text-sm leading-relaxed">
              Esta funcionalidade será ativada automaticamente após a aprovação da
              reforma administrativa. O sistema está preparado para processar e
              apresentar as mudanças assim que os novos dados forem inseridos no banco
              de dados. Nenhuma ação manual será necessária para a transição.
            </p>
          </div>
        </div>
      </div>

      {/* Status Footer */}
      <div className="max-w-5xl mx-auto text-center py-8">
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-yellow-50 border-2 border-yellow-300 rounded-full">
          <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
          <span className="text-yellow-900 font-semibold text-sm">
            Aguardando aprovação da reforma administrativa
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlaceholderDepois;
