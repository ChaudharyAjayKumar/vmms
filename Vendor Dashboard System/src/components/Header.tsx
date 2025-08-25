import React from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';
import { Bell, ShoppingCart, User, Globe, Mic, Calculator } from 'lucide-react';

interface HeaderProps {
  language: string;
  setLanguage: (lang: string) => void;
  cartItems: any[];
  setIsCartOpen: (open: boolean) => void;
}

export function Header({ language, setLanguage, cartItems, setIsCartOpen }: HeaderProps) {
  const translations = {
    en: {
      title: 'Vendor Dashboard',
      announcements: 'Announcements',
      profile: 'Profile',
      logout: 'Logout',
      editProfile: 'Edit Profile',
      voiceMode: 'Voice Mode',
      calculator: 'Calculator'
    },
    hi: {
      title: 'विक्रेता डैशबोर्ड',
      announcements: 'घोषणाएं',
      profile: 'प्रोफ़ाइल',
      logout: 'लॉग आउट',
      editProfile: 'प्रोफ़ाइल संपादित करें',
      voiceMode: 'वॉयस मोड',
      calculator: 'कैलकुलेटर'
    }
  };

  const t = translations[language];

  return (
    <header className="bg-white border-b border-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-semibold">{t.title}</h1>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            <Bell className="w-3 h-3 mr-1" />
            {t.announcements}
          </Badge>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Voice Mode Toggle */}
          <Button variant="outline" size="sm">
            <Mic className="w-4 h-4 mr-2" />
            {t.voiceMode}
          </Button>
          
          {/* Calculator */}
          <Button variant="outline" size="sm">
            <Calculator className="w-4 h-4 mr-2" />
            {t.calculator}
          </Button>
          
          {/* Language Toggle */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
          >
            <Globe className="w-4 h-4 mr-2" />
            {language === 'en' ? 'हिं' : 'EN'}
          </Button>
          
          {/* Cart */}
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsCartOpen(true)}
            className="relative"
          >
            <ShoppingCart className="w-4 h-4" />
            {cartItems.length > 0 && (
              <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                {cartItems.length}
              </Badge>
            )}
          </Button>
          
          {/* User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <User className="w-4 h-4 mr-2" />
                {t.profile}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>{t.editProfile}</DropdownMenuItem>
              <DropdownMenuItem>{t.logout}</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}