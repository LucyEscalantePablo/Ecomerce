import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomeView from './components/HomeView';
import CatalogView from './components/CatalogView';
import LoginView from './components/LoginView';
import RegisterView from './components/RegisterView';
import LisiChat from './components/LisiChat';

import PCBuilder from './components/PCBuilder';
import ProductDetail from './components/ProductDetail';
import CheckoutView from './components/CheckoutView';
import WishlistView from './components/WishlistView';
import StockRestockView from './components/StockRestockView';
import CartRecoveryView from './components/CartRecoveryView';
import SettingsView from './components/SettingsView';
import AdminDashboardView from './components/AdminDashboardView';
import ResellerRequestView from './components/ResellerRequestView';
import ProductComparatorView from './components/ProductComparatorView';
import ResellerDashboardView from './components/ResellerDashboardView';

interface Tenant {
  id: string;
  name: string;
  subdomain: string;
  approvedCategories: string[];
  subscriptionFee: number;
  commissionRate: number;
  status: 'active' | 'suspended';
  sales: number;
}

type View = 'home' | 'catalog' | 'login' | 'register' | 'pc-builder' | 'checkout' | 'wishlist' | 'stock-restock' | 'cart-recovery' | 'settings' | 'admin-dashboard' | 'reseller-request' | 'comparator' | 'reseller-dashboard' | 'super-admin';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [builderStep, setBuilderStep] = useState<number | undefined>(undefined);
  const [catalogCategory, setCatalogCategory] = useState<string | undefined>(undefined);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isReseller, setIsReseller] = useState(false);
  const [resellerCategories, setResellerCategories] = useState<string[]>([]);
  const [currentTenant, setCurrentTenant] = useState<Tenant | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<any[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
    } else {
      root.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentView, selectedProduct]);

  const addToCart = (product: any) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => 
          item.id === product.id ? { ...item, quantity: (item.quantity || 1) + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        const newQty = Math.max(1, (item.quantity || 1) + delta);
        return { ...item, quantity: newQty };
      }
      return item;
    }));
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const [tenants, setTenants] = useState<Tenant[]>([
    {
      id: 'T-001',
      name: 'PC Solutions SAC',
      subdomain: 'pcsolutions',
      approvedCategories: ['Componentes PC', 'Electrónica de Consumo'],
      subscriptionFee: 200,
      commissionRate: 0.03,
      status: 'active',
      sales: 15420.50
    }
  ]);
  const [resellerRequests, setResellerRequests] = useState<any[]>([
    { 
      id: 'REQ-001', 
      company: 'Tech Solutions SAC', 
      ruc: '20601234567', 
      email: 'ventas@techsolutions.pe', 
      experience: '3 a 5 años', 
      status: 'Pendiente', 
      date: '2024-03-08',
      address: 'Av. Javier Prado Este 1234, San Isidro, Lima',
      categories: ['Componentes PC', 'Networking y Servidores'],
      plan: 'professional'
    }
  ]);

  const handleResellerRequest = (request: any) => {
    setResellerRequests(prev => [...prev, { 
      ...request, 
      id: `REQ-00${prev.length + 1}`, 
      status: 'Pendiente', 
      date: new Date().toISOString().split('T')[0] 
    }]);
  };

  const handleApproveReseller = (id: string, status: 'Aprobado' | 'Rechazado') => {
    setResellerRequests(prev => prev.map(req => {
      if (req.id === id) {
        if (status === 'Aprobado') {
          setIsReseller(true);
          setResellerCategories(req.categories);
          
          // Plan details mapping
          const planDetails: Record<string, { fee: number, rate: number }> = {
            'starter': { fee: 99, rate: 0.05 },
            'professional': { fee: 249, rate: 0.03 },
            'enterprise': { fee: 599, rate: 0.015 }
          };

          const selectedPlan = planDetails[req.plan] || planDetails['professional'];

          // Create a new tenant for this approved reseller
          const newTenant: Tenant = {
            id: `T-00${tenants.length + 1}`,
            name: req.company,
            subdomain: req.subdomain || req.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''),
            approvedCategories: req.categories,
            subscriptionFee: selectedPlan.fee,
            commissionRate: selectedPlan.rate,
            status: 'active',
            sales: 0
          };
          setTenants(prevTenants => [...prevTenants, newTenant]);
          setCurrentTenant(newTenant);
        }
        return { ...req, status };
      }
      return req;
    }));
  };

  const handleUpdateTenant = (id: string, updates: Partial<Tenant>) => {
    setTenants(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const handleToggleTenantStatus = (id: string) => {
    setTenants(prev => prev.map(t => 
      t.id === id ? { ...t, status: t.status === 'active' ? 'suspended' : 'active' } : t
    ));
  };

  const handleDeleteTenant = (id: string) => {
    setTenants(prev => prev.filter(t => t.id !== id));
  };

  const toggleWishlist = (id: number) => {
    if (!isLoggedIn) {
      setCurrentView('login');
      return;
    }
    setWishlist(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleNavigate = (view: View, step?: number, category?: string) => {
    setCurrentView(view);
    setSelectedProduct(null);
    setSearchQuery(''); // Clear search when navigating
    if (view === 'pc-builder') {
      setBuilderStep(step);
      setCatalogCategory(undefined);
    } else if (view === 'catalog') {
      setCatalogCategory(category);
      setBuilderStep(undefined);
    } else {
      setBuilderStep(undefined);
      setCatalogCategory(undefined);
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() !== '') {
      setCurrentView('catalog');
      setCatalogCategory(undefined); // Reset category for global search
    }
  };

  const renderView = () => {
    if (selectedProduct) {
      return (
        <ProductDetail 
          product={selectedProduct} 
          onBack={() => setSelectedProduct(null)}
          onToggleWishlist={toggleWishlist}
          isWishlisted={wishlist.includes(selectedProduct.id)}
          onAddToCart={addToCart}
        />
      );
    }

    switch (currentView) {
      case 'home':
        return <HomeView onNavigate={handleNavigate} onProductClick={setSelectedProduct} onAddToCart={addToCart} />;
      case 'catalog':
        return <CatalogView category={catalogCategory} onProductClick={setSelectedProduct} wishlist={wishlist} onToggleWishlist={toggleWishlist} isLoggedIn={isLoggedIn} isReseller={isReseller} resellerCategories={resellerCategories} searchQuery={searchQuery} onClearSearch={() => setSearchQuery('')} onAddToCart={addToCart} />;
      case 'pc-builder':
        return <PCBuilder onNavigate={handleNavigate} initialStep={builderStep} onProductClick={setSelectedProduct} onAddToCart={addToCart} />;
      case 'login':
        return <LoginView onNavigate={handleNavigate} onLogin={(admin = false) => {
          setIsLoggedIn(true);
          setIsAdmin(admin);
          setCurrentView('home');
        }} />;
      case 'register':
        return <RegisterView onNavigate={handleNavigate} onRegister={() => {
          setIsLoggedIn(true);
          setIsAdmin(false);
          setCurrentView('home');
        }} />;
      case 'checkout':
        return (
          <CheckoutView 
            onNavigate={handleNavigate} 
            cart={cart}
            updateQuantity={updateCartQuantity}
            removeFromCart={removeFromCart}
          />
        );
      case 'wishlist':
        return <WishlistView wishlist={wishlist} onToggleWishlist={toggleWishlist} onProductClick={setSelectedProduct} onNavigate={handleNavigate} />;
      case 'stock-restock':
        return <StockRestockView onNavigate={handleNavigate} />;
      case 'cart-recovery':
        return <CartRecoveryView onNavigate={handleNavigate} />;
      case 'settings':
        return <SettingsView onNavigate={handleNavigate} />;
      case 'admin-dashboard':
        return (
          <AdminDashboardView 
            onNavigate={handleNavigate} 
            resellerRequests={resellerRequests} 
            onApproveReseller={handleApproveReseller}
            onUpdateTenant={handleUpdateTenant}
            onToggleTenantStatus={handleToggleTenantStatus}
            onDeleteTenant={handleDeleteTenant}
          />
        );
      case 'reseller-request':
        return <ResellerRequestView onNavigate={handleNavigate} onSubmitRequest={handleResellerRequest} />;
      case 'reseller-dashboard':
        return <ResellerDashboardView onNavigate={handleNavigate} approvedCategories={resellerCategories} tenantInfo={currentTenant} />;
      case 'super-admin':
        return (
          <AdminDashboardView 
            onNavigate={handleNavigate} 
            resellerRequests={resellerRequests} 
            onApproveReseller={handleApproveReseller} 
            tenants={tenants} 
            isSuperAdmin={true}
            onUpdateTenant={handleUpdateTenant}
            onToggleTenantStatus={handleToggleTenantStatus}
            onDeleteTenant={handleDeleteTenant}
          />
        );
      case 'comparator':
        return <ProductComparatorView onNavigate={handleNavigate} />;
      default:
        return <HomeView onNavigate={handleNavigate} onProductClick={setSelectedProduct} onAddToCart={addToCart} />;
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-background-light text-text-light' : 'bg-background-dark text-text-dark'}`}>
      <Navbar 
        onNavigate={handleNavigate} 
        currentView={currentView} 
        currentCategory={catalogCategory}
        isLoggedIn={isLoggedIn}
        isAdmin={isAdmin}
        isReseller={isReseller}
        onLogout={() => {
          setIsLoggedIn(false);
          setIsAdmin(false);
          setIsReseller(false);
          setResellerCategories([]);
          setCurrentView('home');
        }}
        wishlistCount={wishlist.length}
        cartItemCount={cart.reduce((sum, item) => sum + (item.quantity || 1), 0)}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
      
      <main className="flex-1 max-w-full mx-auto px-4 sm:px-6 lg:px-12 w-full">
        {renderView()}
      </main>

      <Footer onNavigate={handleNavigate} />
      <LisiChat />
    </div>
  );
}
