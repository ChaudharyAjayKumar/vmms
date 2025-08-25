import React from 'react';
import { Button } from './ui/button';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  RotateCcw, 
  Calculator, 
  HelpCircle,
  Truck
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  language: string;
}

export function Sidebar({ activeTab, setActiveTab, language }: SidebarProps) {
  const translations = {
    en: {
      dashboard: 'Dashboard',
      products: 'Products',
      orders: 'Orders',
      returns: 'Returns',
      billing: 'Billing',
      support: 'Support'
    },
    hi: {
      dashboard: 'डैशबोर्ड',
      products: 'उत्पाद',
      orders: 'ऑर्डर',
      returns: 'रिटर्न',
      billing: 'बिलिंग',
      support: 'सहायता'
    }
  };

  const t = translations[language];

  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: t.dashboard },
    { id: 'products', icon: Package, label: t.products },
    { id: 'orders', icon: ShoppingBag, label: t.orders },
    { id: 'returns', icon: RotateCcw, label: t.returns },
    { id: 'billing', icon: Calculator, label: t.billing },
    { id: 'support', icon: HelpCircle, label: t.support }
  ];

  return (
    <aside className="w-64 bg-white border-r border-border p-4">
      <nav className="space-y-2">
        {menuItems.map((item) => (
          <Button
            key={item.id}
            variant={activeTab === item.id ? "default" : "ghost"}
            className="w-full justify-start"
            onClick={() => setActiveTab(item.id)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.label}
          </Button>
        ))}
      </nav>
    </aside>
  );
}