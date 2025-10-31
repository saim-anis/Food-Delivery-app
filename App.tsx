
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { generateMenu } from './services/geminiService';
import type { FoodItem, CartItem } from './types';
import Header from './components/Header';
import MenuItem from './components/MenuItem';
import Cart from './components/Cart';
import LoadingSpinner from './components/LoadingSpinner';
import Hero from './components/Hero';

const App: React.FC = () => {
  const [menu, setMenu] = useState<FoodItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // State for search and filtering
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortOption, setSortOption] = useState<string>('default');

  const fetchMenu = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const generatedMenuItems = await generateMenu();
      const fullMenu = generatedMenuItems.map((item, index) => ({
        ...item,
        id: index + 1,
        image: `https://picsum.photos/seed/${item.name.replace(/\s/g, '')}/400/300`,
      }));
      setMenu(fullMenu);
    } catch (err) {
      console.error("Failed to generate menu:", err);
      setError("Sorry, we couldn't load the menu. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddToCart = useCallback((itemToAdd: FoodItem) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === itemToAdd.id);
      if (existingItem) {
        return prevCart.map((item) =>
          item.id === itemToAdd.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { ...itemToAdd, quantity: 1 }];
    });
  }, []);

  const handleRemoveFromCart = useCallback((itemId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  }, []);

  const handleUpdateQuantity = useCallback((itemId: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      handleRemoveFromCart(itemId);
    } else {
      setCart((prevCart) =>
        prevCart.map((item) =>
          item.id === itemId ? { ...item, quantity: newQuantity } : item
        )
      );
    }
  }, [handleRemoveFromCart]);

  const handleClearCart = useCallback(() => {
    setCart([]);
  }, []);

  // Get all unique categories for the filter dropdown
  const categories = useMemo(() => {
    if (menu.length === 0) return [];
    const allCategories = menu.map(item => item.category);
    return Array.from(new Set(allCategories));
  }, [menu]);
  
  // Derived state for the displayed menu based on filters and sorting
  const displayedMenuByCategory = useMemo(() => {
    let items = [...menu];

    // 1. Filter by category
    if (selectedCategory !== 'All') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // 2. Filter by search term (case-insensitive on name and description)
    if (searchTerm.trim()) {
      const lowercasedSearchTerm = searchTerm.toLowerCase().trim();
      items = items.filter(item =>
        item.name.toLowerCase().includes(lowercasedSearchTerm) ||
        item.description.toLowerCase().includes(lowercasedSearchTerm)
      );
    }

    // 3. Sort
    items.sort((a, b) => {
      switch (sortOption) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0; // Keep original order if default
      }
    });
    
    // 4. Group for display
    return items.reduce((acc, item) => {
      (acc[item.category] = acc[item.category] || []).push(item);
      return acc;
    }, {} as Record<string, FoodItem[]>);

  }, [menu, searchTerm, selectedCategory, sortOption]);

  const displayedCategories = useMemo(() => Object.keys(displayedMenuByCategory), [displayedMenuByCategory]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
      <Header cartCount={cart.reduce((sum, item) => sum + item.quantity, 0)} />
      <Hero />
      <main id="menu-section" className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 lg:gap-8">
          <div className="lg:col-span-2">
             <div className="flex flex-col md:flex-row gap-4 mb-6 items-center bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="relative w-full md:flex-grow">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </span>
                <input
                  id="search"
                  type="text"
                  placeholder="Search for dishes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-orange-500 focus:border-orange-500 transition-shadow duration-200"
                  aria-label="Search for dishes"
                />
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label htmlFor="category-filter" className="font-semibold text-gray-700 whitespace-nowrap">Filter by:</label>
                <select
                  id="category-filter"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow duration-200"
                  aria-label="Filter by category"
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 w-full md:w-auto">
                <label htmlFor="sort-by" className="font-semibold text-gray-700 whitespace-nowrap">Sort by:</label>
                <select
                  id="sort-by"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  className="border rounded-lg p-2 focus:ring-orange-500 focus:border-orange-500 transition-shadow duration-200"
                  aria-label="Sort by"
                >
                  <option value="default">Default</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="name-asc">Name: A-Z</option>
                  <option value="name-desc">Name: Z-A</option>
                </select>
              </div>
            </div>
            
            {isLoading && <LoadingSpinner />}
            {error && <div className="text-center text-red-500 bg-red-100 p-4 rounded-lg">{error}</div>}
            {!isLoading && !error && (
              <>
                {displayedCategories.length > 0 ? (
                  <div className="space-y-12">
                    {displayedCategories.map((category) => (
                      <section key={category}>
                        <h2 className="text-2xl font-semibold mb-4 text-orange-600 border-b-2 border-orange-200 pb-2">{category}</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {displayedMenuByCategory[category].map((item) => (
                            <MenuItem key={item.id} item={item} onAddToCart={handleAddToCart} />
                          ))}
                        </div>
                      </section>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">No dishes found</h3>
                    <p className="mt-1 text-sm text-gray-500">Try adjusting your search or filters.</p>
                  </div>
                )}
              </>
            )}
          </div>
          <div className="mt-8 lg:mt-0 lg:col-span-1">
             <div className="sticky top-24">
                <Cart 
                  items={cart} 
                  onRemove={handleRemoveFromCart} 
                  onUpdateQuantity={handleUpdateQuantity}
                  onClear={handleClearCart}
                />
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
