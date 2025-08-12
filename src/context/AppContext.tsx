import React, { createContext, useContext, useState, ReactNode } from 'react';

interface AppContextType {
  showPricing: boolean;
  setShowPricing: (show: boolean) => void;
  activeLayer: string;
  setActiveLayer: (layer: string) => void;
  isDarkMode: boolean;
  setIsDarkMode: (dark: boolean) => void;
  isAuthenticated: boolean;
  setIsAuthenticated: (auth: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [showPricing, setShowPricing] = useState(false);
  const [activeLayer, setActiveLayer] = useState('marketplace');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check for existing session on app load
    return localStorage.getItem('agentbridge_session') === 'authenticated';
  });

  return (
    <AppContext.Provider value={{
      showPricing,
      setShowPricing,
      activeLayer,
      setActiveLayer,
      isDarkMode,
      setIsDarkMode,
      isAuthenticated,
      setIsAuthenticated
    }}>
      {children}
    </AppContext.Provider>
  );
};