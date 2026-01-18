import { TabView } from '../../types';

interface TabsNavigationProps {
  activeTab: TabView;
  onTabChange: (tab: TabView) => void;
}

const TabsNavigation = ({ activeTab, onTabChange }: TabsNavigationProps) => {
  return (
    <div className="bg-white rounded-lg shadow-md mb-6 overflow-hidden">
      <div className="flex border-b border-gray-200">
        <button
          onClick={() => onTabChange('antes')}
          className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-300 ${
            activeTab === 'antes'
              ? 'bg-blue-600 text-white border-b-4 border-blue-800'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className="mr-2">📊</span>
          ANTES
        </button>
        <button
          onClick={() => onTabChange('depois')}
          className={`flex-1 px-6 py-4 text-lg font-semibold transition-all duration-300 ${
            activeTab === 'depois'
              ? 'bg-green-600 text-white border-b-4 border-green-800'
              : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
          }`}
        >
          <span className="mr-2">🔄</span>
          DEPOIS
        </button>
      </div>
    </div>
  );
};

export default TabsNavigation;
