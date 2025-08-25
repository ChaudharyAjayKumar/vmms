import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from './ui/sheet';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface CartSidebarProps {
  cartItems: any[];
  setCartItems: (items: any[]) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  language: string;
}

export function CartSidebar({ cartItems, setCartItems, isOpen, setIsOpen, language }: CartSidebarProps) {
  const translations = {
    en: {
      cart: 'Shopping Cart',
      emptyCart: 'Your cart is empty',
      startShopping: 'Start Shopping',
      quantity: 'Qty',
      remove: 'Remove',
      subtotal: 'Subtotal',
      total: 'Total',
      checkout: 'Proceed to Checkout',
      items: 'items'
    },
    hi: {
      cart: 'शॉपिंग कार्ट',
      emptyCart: 'आपका कार्ट खाली है',
      startShopping: 'खरीदारी शुरू करें',
      quantity: 'मात्रा',
      remove: 'हटाएं',
      subtotal: 'उप-योग',
      total: 'कुल',
      checkout: 'चेकआउट पर जाएं',
      items: 'आइटम'
    }
  };

  const t = translations[language];

  const updateQuantity = (id: number, priceMode: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(id, priceMode);
      return;
    }
    
    setCartItems(cartItems.map(item => 
      item.id === id && item.priceMode === priceMode
        ? { ...item, quantity: newQuantity }
        : item
    ));
  };

  const removeItem = (id: number, priceMode: string) => {
    setCartItems(cartItems.filter(item => !(item.id === id && item.priceMode === priceMode)));
    toast.success('Item removed from cart');
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    toast.success('Proceeding to checkout...');
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent side="right" className="w-full sm:w-96">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            {t.cart}
            {cartItems.length > 0 && (
              <Badge variant="secondary">
                {cartItems.length} {t.items}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground mb-4">{t.emptyCart}</p>
              <Button onClick={() => setIsOpen(false)}>
                {t.startShopping}
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {cartItems.map((item, index) => (
                  <div key={`${item.id}-${item.priceMode}-${index}`} className="flex items-center space-x-3 p-3 border rounded-lg">
                    <div className="w-16 h-16 flex-shrink-0">
                      <ImageWithFallback
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">{item.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {item.priceMode === 'unit' ? 'Unit' : 'Box'}
                        </Badge>
                        <span className="text-sm font-medium">₹{item.price}</span>
                      </div>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.priceMode, item.quantity - 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>
                          <span className="text-sm font-medium w-8 text-center">{item.quantity}</span>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.priceMode, item.quantity + 1)}
                            className="h-6 w-6 p-0"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>
                        
                        <Button 
                          size="sm" 
                          variant="ghost"
                          onClick={() => removeItem(item.id, item.priceMode)}
                          className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Cart Summary */}
              <div className="border-t pt-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{t.subtotal}:</span>
                  <span className="font-semibold">₹{calculateSubtotal()}</span>
                </div>
                
                <div className="flex justify-between items-center text-lg">
                  <span className="font-semibold">{t.total}:</span>
                  <span className="font-bold">₹{calculateSubtotal()}</span>
                </div>
                
                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleCheckout}
                >
                  {t.checkout}
                </Button>
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}