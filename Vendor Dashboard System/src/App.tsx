import React, { useState } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ProductCatalog } from './components/ProductCatalog';
import { OrderManagement } from './components/OrderManagement';
import { ReturnManagement } from './components/ReturnManagement';
import { BillingCalculator } from './components/BillingCalculator';
import { Support } from './components/Support';
import { CartSidebar } from './components/CartSidebar';
import { Toaster } from './components/ui/sonner';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [language, setLanguage] = useState('en'); // 'en' or 'hi'
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard language={language} />;
      case 'products':
        return <ProductCatalog language={language} cartItems={cartItems} setCartItems={setCartItems} />;
      case 'orders':
        return <OrderManagement language={language} />;
      case 'returns':
        return <ReturnManagement language={language} />;
      case 'billing':
        return <BillingCalculator language={language} />;
      case 'support':
        return <Support language={language} />;
      default:
        return <Dashboard language={language} />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header 
        language={language} 
        setLanguage={setLanguage} 
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
      />
      <div className="flex">
        <Sidebar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
          language={language} 
        />
        <main className="flex-1 p-6">
          {renderContent()}
        </main>
        <CartSidebar 
          cartItems={cartItems}
          setCartItems={setCartItems}
          isOpen={isCartOpen}
          setIsOpen={setIsCartOpen}
          language={language}
        />
      </div>
      <Toaster />
    </div>
  );
}