import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import LoginSplash from './components/LoginSplash';
import Layout from './components/Layout';
import Marketplace from './pages/Marketplace';
import Workshop from './pages/Workshop';
import Brain from './pages/Brain';
import Wiring from './pages/Wiring';
import CCTV from './pages/CCTV';
import Launchpad from './pages/Launchpad';
import Documentation from './pages/Documentation';
import AgenticMindset from './pages/AgenticMindset';
import { AppProvider } from './context/AppContext';
import { useApp } from './context/AppContext';

function AppContent() {
  const { isDarkMode, isAuthenticated, setIsAuthenticated } = useApp();
  
  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('agentbridge_session');
    localStorage.removeItem('agentbridge_user');
    setIsAuthenticated(false);
  };

  // Show login splash if not authenticated
  if (!isAuthenticated) {
    return <LoginSplash onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-surface dark:bg-primary transition-colors">
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Marketplace />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="workshop" element={<Workshop />} />
            <Route path="brain" element={<Brain />} />
            <Route path="wiring" element={<Wiring />} />
            <Route path="cctv" element={<CCTV />} />
            <Route path="launchpad" element={<Launchpad />} />
            <Route path="docs" element={<Documentation />} />
            <Route path="agentic-mindset" element={<AgenticMindset />} />
          </Route>
        </Routes>
      </AnimatePresence>
    </div>
  );
}

function App() {
  return (
    <AppProvider>
      <Router>
        <AppContent />
      </Router>
    </AppProvider>
  );
}

export default App;