import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { ExecutiveDashboard } from './pages/ExecutiveDashboard';
import { ClientIntelligence } from './pages/ClientIntelligence';
import { MyPractice } from './pages/MyPractice';
import { BusinessGoals } from './pages/BusinessGoals';
import { HealthInterventions } from './pages/HealthInterventions';
import { Settings } from './pages/Settings';

function App() {
  const [activePage, setActivePage] = useState('morning');
  const [selectedClientId, setSelectedClientId] = useState<string | null>(null);

  const handleClientSelect = (clientId: string) => {
    setSelectedClientId(clientId);
    setActivePage('clients');
  };

  const handleBackToClients = () => {
    setSelectedClientId(null);
  };

  const renderPage = () => {
    switch (activePage) {
      case 'morning':
        return <ExecutiveDashboard onClientSelect={handleClientSelect} />;
      case 'goals':
        return <BusinessGoals />;
      case 'clients':
        return (
          <ClientIntelligence
            selectedClientId={selectedClientId}
            onBack={handleBackToClients}
          />
        );
      case 'interventions':
        return <HealthInterventions />;
      case 'practice':
        return <MyPractice />;
      case 'settings':
        return <Settings />;
      default:
        return <ExecutiveDashboard onClientSelect={handleClientSelect} />;
    }
  };

  return (
    <div className="flex h-screen" style={{ background: '#FEFAF5' }}>
      <Sidebar activePage={activePage} onPageChange={setActivePage} />
      <main className="flex-1 ml-64 overflow-auto">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
