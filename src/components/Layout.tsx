import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import Footer from './Footer';
import PricingModal from './PricingModal';
import { useApp } from '../context/AppContext';

const Layout: React.FC = () => {
  const { showPricing } = useApp();

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
      <Footer />
      {showPricing && <PricingModal />}
    </div>
  );
};

export default Layout;