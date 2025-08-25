import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Badge } from './ui/badge';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { Search, Plus, Package } from 'lucide-react';
import { toast } from 'sonner@2.0.3';
import exampleImage from 'figma:asset/ca98b44ac45e7036ce759b10f3c3787831ed0ca1.png';

interface ProductCatalogProps {
  language: string;
  cartItems: any[];
  setCartItems: (items: any[]) => void;
}

export function ProductCatalog({ language, cartItems, setCartItems }: ProductCatalogProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceMode, setPriceMode] = useState('unit'); // 'unit' or 'box'

  const translations = {
    en: {
      title: 'Product Catalog',
      search: 'Search products...',
      category: 'Category',
      allCategories: 'All Categories',
      spices: 'Spices',
      grains: 'Grains',
      oils: 'Oils',
      snacks: 'Snacks',
      unitPrice: 'Unit Price',
      boxPrice: 'Box Price',
      addToCart: 'Add to Cart',
      inStock: 'In Stock',
      outOfStock: 'Out of Stock',
      itemAdded: 'Item added to cart'
    },
    hi: {
      title: 'उत्पाद सूची',
      search: 'उत्पाद खोजें...',
      category: 'श्रेणी',
      allCategories: 'सभी श्रेणियां',
      spices: 'मसाले',
      grains: 'अनाज',
      oils: 'तेल',
      snacks: 'नाश्ता',
      unitPrice: 'इकाई मूल्य',
      boxPrice: 'बॉक्स मूल्य',
      addToCart: 'कार्ट में जोड़ें',
      inStock: 'स्टॉक में',
      outOfStock: 'स्टॉक में नहीं',
      itemAdded: 'आइटम कार्ट में जोड़ा गया'
    }
  };

  const t = translations[language];

  const products = [
    { id: 1, name: 'Tata Salt', category: 'spices', unitPrice: 25, boxPrice: 600, stock: 50, image: exampleImage },
    { id: 2, name: 'Basmati Rice', category: 'grains', unitPrice: 180, boxPrice: 4320, stock: 30, image: exampleImage },
    { id: 3, name: 'Mustard Oil', category: 'oils', unitPrice: 120, boxPrice: 2400, stock: 25, image: exampleImage },
    { id: 4, name: 'Turmeric Powder', category: 'spices', unitPrice: 45, boxPrice: 900, stock: 40, image: exampleImage },
    { id: 5, name: 'Red Chili Powder', category: 'spices', unitPrice: 60, boxPrice: 1440, stock: 35, image: exampleImage },
    { id: 6, name: 'Wheat Flour', category: 'grains', unitPrice: 85, boxPrice: 2040, stock: 20, image: exampleImage },
    { id: 7, name: 'Coconut Oil', category: 'oils', unitPrice: 200, boxPrice: 4800, stock: 15, image: exampleImage },
    { id: 8, name: 'Biscuits', category: 'snacks', unitPrice: 30, boxPrice: 720, stock: 0, image: exampleImage }
  ];

  const categories = [
    { value: 'all', label: t.allCategories },
    { value: 'spices', label: t.spices },
    { value: 'grains', label: t.grains },
    { value: 'oils', label: t.oils },
    { value: 'snacks', label: t.snacks }
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (product: any) => {
    const existingItem = cartItems.find(item => item.id === product.id && item.priceMode === priceMode);
    
    if (existingItem) {
      setCartItems(cartItems.map(item => 
        item.id === product.id && item.priceMode === priceMode
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      const newItem = {
        ...product,
        quantity: 1,
        priceMode,
        price: priceMode === 'unit' ? product.unitPrice : product.boxPrice
      };
      setCartItems([...cartItems, newItem]);
    }
    
    toast.success(t.itemAdded);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>{t.title}</h2>
        <div className="flex space-x-2">
          <Button 
            variant={priceMode === 'unit' ? 'default' : 'outline'}
            onClick={() => setPriceMode('unit')}
          >
            {t.unitPrice}
          </Button>
          <Button 
            variant={priceMode === 'box' ? 'default' : 'outline'}
            onClick={() => setPriceMode('box')}
          >
            {t.boxPrice}
          </Button>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder={t.category} />
          </SelectTrigger>
          <SelectContent>
            {categories.map(category => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredProducts.map(product => (
          <Card key={product.id} className="overflow-hidden">
            <div className="aspect-square relative">
              <ImageWithFallback
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                  <Badge variant="destructive">{t.outOfStock}</Badge>
                </div>
              )}
            </div>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">{product.name}</CardTitle>
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="capitalize">
                  {t[product.category]}
                </Badge>
                <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                  {product.stock > 0 ? t.inStock : t.outOfStock}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">
                    ₹{priceMode === 'unit' ? product.unitPrice : product.boxPrice}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {priceMode === 'unit' ? 'per unit' : 'per box'}
                  </p>
                </div>
                <Button 
                  size="sm" 
                  onClick={() => addToCart(product)}
                  disabled={product.stock === 0}
                >
                  <Plus className="w-4 h-4 mr-1" />
                  {t.addToCart}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="text-center py-12">
          <Package className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
          <p className="text-muted-foreground">No products found</p>
        </div>
      )}
    </div>
  );
}