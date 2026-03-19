import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  MemoryStick as Memory, 
  Search, 
  ShoppingCart, 
  User, 
  Bolt, 
  ChevronDown, 
  Cpu, 
  Monitor, 
  LayoutGrid,
  HardDrive,
  Zap,
  Box,
  Wind,
  Laptop,
  Keyboard,
  Mouse,
  Headphones,
  Video,
  Mic,
  Armchair,
  Square,
  Activity,
  Maximize2,
  Layers,
  Router,
  Network,
  Wifi,
  Usb,
  Sun,
  Moon,
  Camera,
  Gamepad2,
  Cast,
  Image,
  Cable,
  PlugZap,
  BatteryMedium,
  Repeat,
  Heart,
  Sparkles,
  Bell,
  ClipboardCheck,
  ShoppingBasket,
  ChevronRight,
  Settings,
  LogOut,
  ShieldAlert,
  Handshake
} from 'lucide-react';

interface NavbarProps {
  onNavigate: (view: any, step?: number, category?: string) => void;
  currentView: string;
  currentCategory?: string;
  isLoggedIn?: boolean;
  isAdmin?: boolean;
  isReseller?: boolean;
  onLogout?: () => void;
  wishlistCount?: number;
  cartItemCount?: number;
  onSearch?: (query: string) => void;
  searchQuery?: string;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
}

export default function Navbar({ 
  onNavigate, 
  currentView, 
  currentCategory, 
  isLoggedIn, 
  isAdmin, 
  isReseller, 
  onLogout, 
  wishlistCount = 0, 
  cartItemCount = 0,
  onSearch,
  searchQuery: externalSearchQuery = '',
  theme,
  onToggleTheme
}: NavbarProps) {
  const [activeMenu, setActiveMenu] = useState<'components' | 'laptops' | 'peripherals' | 'monitors' | 'networking' | 'streaming' | 'accessories' | null>(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState(externalSearchQuery);

  // Sync with external search query
  React.useEffect(() => {
    setSearchQuery(externalSearchQuery);
  }, [externalSearchQuery]);

  const toggleMenu = (menu: 'components' | 'laptops' | 'peripherals' | 'monitors' | 'networking' | 'streaming' | 'accessories') => {
    setActiveMenu(activeMenu === menu ? null : menu);
    setShowNotifications(false);
    setShowProfileMenu(false);
  };

  const handleMegaMenuClick = (view: 'home' | 'catalog' | 'login' | 'register' | 'pc-builder', step?: number, category?: string) => {
    setActiveMenu(null);
    onNavigate(view, step, category);
  };

  const isComponentActive = currentView === 'catalog' && (!currentCategory || ['cpu', 'gpu', 'motherboard', 'ram', 'storage', 'psu', 'case'].includes(currentCategory));
  const isLaptopActive = currentView === 'catalog' && currentCategory && ['laptop-gaming', 'laptop-pro', 'laptop-student', 'pc-prebuilt', 'pc-aio'].includes(currentCategory);
  const isPeripheralActive = currentView === 'catalog' && currentCategory && ['keyboard', 'mouse', 'headset', 'webcam', 'mic', 'mousepad', 'chair'].includes(currentCategory);
  const isMonitorActive = currentView === 'catalog' && currentCategory && ['monitor-use', 'monitor-res', 'monitor-hz', 'monitor-panel'].includes(currentCategory);
  const isNetworkingActive = currentView === 'catalog' && currentCategory && ['router', 'switch', 'nic', 'hub'].includes(currentCategory);
  const isStreamingActive = currentView === 'catalog' && currentCategory && ['lighting', 'greenscreen', 'capture', 'streamdeck', 'camera'].includes(currentCategory);
  const isAccessoryActive = currentView === 'catalog' && currentCategory && ['cable-video', 'cable-usb', 'adapter', 'ups'].includes(currentCategory);

  return (
    <header className="sticky top-0 z-[1000] bg-[var(--bg-color)] border-b border-white/5 transition-colors duration-300">
      {/* Global Backdrop for Menus */}
      {(activeMenu || showNotifications || showProfileMenu) && (
        <div 
          className="fixed inset-0 z-[100] bg-black/40" 
          onClick={() => {
            setActiveMenu(null);
            setShowNotifications(false);
            setShowProfileMenu(false);
          }}
        />
      )}

      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 relative z-[120]">
        <div className="flex items-center justify-between h-20 gap-8">
          {/* Logo */}
          <div 
            className="flex items-center gap-3 shrink-0 cursor-pointer"
            onClick={() => {
              setActiveMenu(null);
              onNavigate('home');
            }}
          >
            <div className="bg-gradient-to-br from-blue-600 to-cyan-500 p-2 rounded-xl shadow-lg shadow-blue-500/20">
              <Memory className="text-white w-6 h-6" />
            </div>
            <h1 className="text-xl font-black tracking-tighter text-[var(--text-color)] uppercase flex items-center gap-1">
              TechMarket <span className="text-blue-500">Smart</span>
            </h1>
          </div>

          {/* Search */}
          <div className="flex-1 max-w-md hidden md:block">
            <form 
              onSubmit={(e) => {
                e.preventDefault();
                setActiveMenu(null);
                onSearch?.(searchQuery);
              }}
              className="relative"
            >
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input 
                className="block w-full pl-9 pr-3 py-2 border-none rounded-lg bg-[var(--card-bg)] text-[var(--text-color)] placeholder-slate-500 focus:ring-1 focus:ring-primary/40 text-xs transition-all" 
                placeholder="Buscar por nombre, marca, SKU o especificaciones..." 
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
              />
            </form>
          </div>

          {/* Nav Links - Empty or for other links */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6 h-full">
            <button 
              onClick={() => {
                setActiveMenu(null);
                onNavigate('pc-builder');
              }}
              className={`text-[10px] font-black transition-all flex items-center gap-2 px-4 py-2 rounded-xl uppercase tracking-widest group ${
                currentView === 'pc-builder' 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : 'text-slate-300 hover:text-primary hover:bg-white/5'
              }`}
            >
              <Sparkles className={`w-4 h-4 ${currentView === 'pc-builder' ? 'animate-pulse' : 'group-hover:animate-bounce'}`} />
              PC BUILDER IA
            </button>
          </nav>

            {/* Actions */}
          <div className="flex items-center gap-2 lg:gap-4 shrink-0 relative z-[200]">
            <div className="hidden md:flex items-center gap-1 pr-4 border-r border-white/10">
              {/* Theme Toggle */}
              <button 
                onClick={onToggleTheme}
                className="p-2 transition-all rounded-xl text-slate-400 hover:text-primary hover:bg-white/5 group"
                title={theme === 'dark' ? 'Modo Claro' : 'Modo Oscuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                ) : (
                  <Moon className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                )}
              </button>

              <button 
                onClick={() => {
                  setActiveMenu(null);
                  onNavigate('comparator');
                }}
                className={`p-2 transition-colors group relative rounded-xl ${
                  currentView === 'comparator' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'
                }`} 
                title="Comparar"
              >
                <Activity className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
              </button>
              <button 
                onClick={() => {
                  setActiveMenu(null);
                  if (!isLoggedIn) {
                    onNavigate('login');
                  } else {
                    onNavigate('wishlist');
                  }
                }}
                className={`p-2 transition-colors group relative rounded-xl ${
                  currentView === 'wishlist' ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'
                }`} 
                title="Deseos"
              >
                <Heart className={`w-4.5 h-4.5 group-hover:scale-110 transition-transform ${currentView === 'wishlist' ? 'fill-current' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[8px] text-white font-black border border-slate-900">
                    {wishlistCount}
                  </span>
                )}
              </button>
              <div className="relative z-[100]">
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      onNavigate('login');
                    } else {
                      setShowNotifications(!showNotifications);
                      setShowProfileMenu(false);
                      setActiveMenu(null);
                    }
                  }}
                  className={`p-2 transition-colors group relative rounded-xl ${showNotifications ? 'bg-primary/10 text-primary' : 'text-slate-400 hover:text-primary'}`} 
                  title="Notificaciones"
                >
                  <Bell className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                  <span className="absolute top-1.5 right-1.5 flex h-2 w-2 items-center justify-center rounded-full bg-rose-500 shadow-lg shadow-rose-500/40"></span>
                </button>

                {showNotifications && isLoggedIn && (
                  <div 
                    className="absolute top-full right-0 mt-2 w-64 border border-[var(--border-color)] rounded-2xl shadow-2xl z-[110] overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-color)', opacity: 1 }}
                  >
                    <div className="p-4 border-b border-[var(--border-color)] flex items-center justify-between" style={{ backgroundColor: 'var(--bg-color)' }}>
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-primary" />
                        <span className="text-sm font-black text-[var(--text-color)] uppercase tracking-tight">Mis Alertas</span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    </div>
                    <div className="p-2">
                      <button 
                        onClick={() => {
                          onNavigate('wishlist');
                          setShowNotifications(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-all">
                          <Heart className="w-4 h-4 fill-current" />
                        </div>
                        <span className="text-sm font-bold text-slate-300 group-hover:text-primary transition-colors">Productos favoritos</span>
                      </button>
                      <button 
                        onClick={() => {
                          onNavigate('stock-restock');
                          setShowNotifications(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                          <ClipboardCheck className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Reposición de stock</span>
                      </button>
                      <button 
                        onClick={() => {
                          onNavigate('cart-recovery');
                          setShowNotifications(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 group-hover:bg-primary group-hover:text-white transition-all">
                          <ShoppingBasket className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white transition-colors">Recuperación carrito</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 lg:gap-4">
              <button 
                onClick={() => {
                  setActiveMenu(null);
                  onNavigate('checkout');
                }}
                className="p-2 text-slate-400 hover:text-white relative transition-all hover:bg-white/5 rounded-xl group"
              >
                <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartItemCount > 0 && (
                  <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] text-white font-black shadow-lg shadow-primary/40 border-2 border-slate-900">
                    {cartItemCount}
                  </span>
                )}
              </button>
              
              <div className="relative z-[100]">
                <button 
                  onClick={() => {
                    if (!isLoggedIn) {
                      onNavigate('login');
                    } else {
                      setShowProfileMenu(!showProfileMenu);
                      setShowNotifications(false);
                      setActiveMenu(null);
                    }
                  }}
                  className={`p-2 transition-all rounded-xl group flex items-center gap-2 ${
                    showProfileMenu ? 'bg-primary text-white' : 'text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-colors ${
                    showProfileMenu ? 'border-white bg-white/20' : 'border-slate-700 bg-slate-800 group-hover:border-primary'
                  }`}>
                    <User className="w-4 h-4" />
                  </div>
                  {isLoggedIn && <ChevronDown className={`w-3 h-3 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />}
                </button>

                {showProfileMenu && isLoggedIn && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="absolute top-full right-0 mt-2 w-56 border border-[var(--border-color)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,1)] z-[120] overflow-hidden"
                    style={{ backgroundColor: 'var(--bg-color)', backdropFilter: 'none' }}
                  >
                    <div className="p-4 border-b border-[var(--border-color)]" style={{ backgroundColor: 'var(--bg-color)' }}>
                      <p className="text-xs font-black text-slate-500 uppercase tracking-widest mb-1">Usuario</p>
                      <p className="text-sm font-bold text-[var(--text-color)] truncate">{isAdmin ? 'Administrador' : 'Juan Pérez'}</p>
                    </div>
                    
                    <div className="p-2">
                      {!isReseller && !isAdmin && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('reseller-request');
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors group text-left"
                        >
                          <Handshake className="w-4 h-4" />
                          <span className="text-sm font-bold">Solicitud de Socio</span>
                        </button>
                      )}

                      {isAdmin && (
                        <>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('admin-dashboard');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-primary/10 hover:text-primary transition-colors group text-left"
                          >
                            <ShieldAlert className="w-4 h-4" />
                            <span className="text-sm font-bold">Panel de Control</span>
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              onNavigate('super-admin');
                              setShowProfileMenu(false);
                            }}
                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-500/10 hover:text-indigo-500 transition-colors group text-left"
                          >
                            <LayoutGrid className="w-4 h-4" />
                            <span className="text-sm font-bold">Super Admin (SaaS)</span>
                          </button>
                        </>
                      )}

                      {isReseller && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            onNavigate('reseller-dashboard');
                            setShowProfileMenu(false);
                          }}
                          className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-emerald-500/10 hover:text-emerald-500 transition-colors group text-left"
                        >
                          <LayoutGrid className="w-4 h-4" />
                          <span className="text-sm font-bold">Portal Reseller</span>
                        </button>
                      )}
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onNavigate('settings');
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group text-left"
                      >
                        <Settings className="w-4 h-4 text-slate-500 group-hover:text-white" />
                        <span className="text-sm font-bold text-slate-400 group-hover:text-white">Configuración</span>
                      </button>
                      
                      <div className="h-px bg-white/5 my-2" />
                      
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onLogout?.();
                          setShowProfileMenu(false);
                        }}
                        className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-rose-500/10 text-rose-500 transition-colors group text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span className="text-sm font-bold uppercase tracking-widest">Salir</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sub Nav */}
      <div className="glass-effect border-t border-white/5 lg:overflow-visible relative z-[110]">
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 h-12 flex items-center justify-between lg:overflow-visible">
          <div className="flex items-center gap-8 overflow-x-auto lg:overflow-visible no-scrollbar whitespace-nowrap h-full">
            {/* Componentes Menu */}
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onClick={() => toggleMenu('components')}
            >
              <div 
                className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                  isComponentActive || activeMenu === 'components' ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                COMPONENTES
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'components' ? 'rotate-180' : ''}`} />
              </div>

              {/* Mega Menu Componentes */}
              {activeMenu === 'components' && (
                <div className="absolute top-full left-0 w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <MegaMenuItem 
                        icon={<Cpu className="w-5 h-5" />} 
                        title="Procesadores (CPUs)" 
                        desc="Intel Core, AMD Ryzen" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'cpu')}
                      />
                      <MegaMenuItem 
                        icon={<Monitor className="w-5 h-5" />} 
                        title="Tarjetas de Video (GPUs)" 
                        desc="NVIDIA GeForce, AMD Radeon" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'gpu')}
                      />
                      <MegaMenuItem 
                        icon={<LayoutGrid className="w-5 h-5" />} 
                        title="Placas Base (Motherboards)" 
                        desc="Z790, X670, B650" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'motherboard')}
                      />
                      <MegaMenuItem 
                        icon={<Memory className="w-5 h-5" />} 
                        title="Memoria RAM" 
                        desc="DDR5, DDR4 Performance" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'ram')}
                      />
                      <MegaMenuItem 
                        icon={<HardDrive className="w-5 h-5" />} 
                        title="Almacenamiento" 
                        desc="SSD NVMe M.2, HDD" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'storage')}
                      />
                      <MegaMenuItem 
                        icon={<Zap className="w-5 h-5" />} 
                        title="Fuentes de Poder (PSU)" 
                        desc="80 Plus Gold, Platinum" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'psu')}
                      />
                      <MegaMenuItem 
                        icon={<Box className="w-5 h-5" />} 
                        title="Gabinetes" 
                        desc="Mid-Tower, Full-Tower" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'case')}
                      />
                      <MegaMenuItem icon={<Wind className="w-5 h-5" />} title="Refrigeración" desc="Líquida AIO, Aire" />
                    </div>
                  </div>
              )}
            </div>

            {/* Laptops y Computadoras Menu */}
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onClick={() => toggleMenu('laptops')}
            >
              <div 
                className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                  isLaptopActive || activeMenu === 'laptops' ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                LAPTOPS Y COMPUTADORAS
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'laptops' ? 'rotate-180' : ''}`} />
              </div>

              {/* Mega Menu Laptops */}
              {activeMenu === 'laptops' && (
                <div className="absolute top-full left-0 w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <MegaMenuItem 
                        icon={<Laptop className="w-5 h-5" />} 
                        title="Laptops Gaming" 
                        desc="Entry / Mid / High-end" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'laptop-gaming')}
                      />
                      <MegaMenuItem 
                        icon={<Laptop className="w-5 h-5" />} 
                        title="Laptops Profesionales" 
                        desc="Diseño / Programación / Ultrabooks" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'laptop-pro')}
                      />
                      <MegaMenuItem 
                        icon={<Laptop className="w-5 h-5" />} 
                        title="Laptops Estudiantiles" 
                        desc="Para tareas y estudio diario" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'laptop-student')}
                      />
                      <MegaMenuItem 
                        icon={<Monitor className="w-5 h-5" />} 
                        title="PCs Pre-armadas" 
                        desc="Gaming / Workstation / Office" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'pc-prebuilt')}
                      />
                      <MegaMenuItem 
                        icon={<Monitor className="w-5 h-5" />} 
                        title="All-in-One PCs" 
                        desc="Todo en uno para el hogar y oficina" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'pc-aio')}
                      />
                    </div>
                  </div>
              )}
            </div>

            {/* Periféricos Menu */}
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onClick={() => toggleMenu('peripherals')}
            >
              <a 
                className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                  isPeripheralActive || activeMenu === 'peripherals' ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                PERIFÉRICOS
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'peripherals' ? 'rotate-180' : ''}`} />
              </a>

              {/* Mega Menu Periféricos */}
              {activeMenu === 'peripherals' && (
                <div className="absolute top-full left-0 w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <MegaMenuItem 
                        icon={<Keyboard className="w-5 h-5" />} 
                        title="Teclados" 
                        desc="Mecánicos / Membrana / Wireless" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'keyboard')}
                      />
                      <MegaMenuItem 
                        icon={<Mouse className="w-5 h-5" />} 
                        title="Mouse" 
                        desc="Gaming / Productividad / Wireless" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'mouse')}
                      />
                      <MegaMenuItem 
                        icon={<Headphones className="w-5 h-5" />} 
                        title="Headsets / Audífonos" 
                        desc="Gaming / Productividad" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'headset')}
                      />
                      <MegaMenuItem 
                        icon={<Video className="w-5 h-5" />} 
                        title="Webcams" 
                        desc="1080p / 2K / 4K" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'webcam')}
                      />
                      <MegaMenuItem 
                        icon={<Mic className="w-5 h-5" />} 
                        title="Micrófonos" 
                        desc="USB / XLR" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'mic')}
                      />
                      <MegaMenuItem 
                        icon={<Square className="w-5 h-5" />} 
                        title="Alfombrillas" 
                        desc="Speed / Control / RGB" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'mousepad')}
                      />
                      <MegaMenuItem 
                        icon={<Armchair className="w-5 h-5" />} 
                        title="Sillas y Escritorios" 
                        desc="Ergonómicas / Gaming / Pro" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'chair')}
                      />
                    </div>
                  </div>
              )}
            </div>

            {/* Monitores Menu */}
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onClick={() => toggleMenu('monitors')}
            >
              <a 
                className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                  isMonitorActive || activeMenu === 'monitors' ? 'text-primary' : 'text-slate-300 hover:text-primary'
                }`}
              >
                MONITORES
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'monitors' ? 'rotate-180' : ''}`} />
              </a>

              {/* Mega Menu Monitores */}
              {activeMenu === 'monitors' && (
                <div className="absolute top-full left-0 w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                  <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                      <MegaMenuItem 
                        icon={<Monitor className="w-5 h-5" />} 
                        title="Por Uso" 
                        desc="Gaming / Productividad / Diseño" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'monitor-use')}
                      />
                      <MegaMenuItem 
                        icon={<Maximize2 className="w-5 h-5" />} 
                        title="Por Resolución" 
                        desc="1080p / 1440p / 4K / Ultrawide" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'monitor-res')}
                      />
                      <MegaMenuItem 
                        icon={<Zap className="w-5 h-5" />} 
                        title="Por Refresh Rate" 
                        desc="60 / 144 / 165 / 240 / 360Hz" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'monitor-hz')}
                      />
                      <MegaMenuItem 
                        icon={<Layers className="w-5 h-5" />} 
                        title="Por Panel" 
                        desc="TN / IPS / VA / OLED" 
                        onClick={() => handleMegaMenuClick('catalog', undefined, 'monitor-panel')}
                      />
                    </div>
                  </div>
              )}
            </div>

            {/* Networking Menu */}
            <div 
              className="relative h-full flex items-center group cursor-pointer"
              onClick={() => toggleMenu('networking')}
            >
            <a 
              className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                isNetworkingActive || activeMenu === 'networking' ? 'text-primary' : 'text-slate-300 hover:text-primary'
              }`}
            >
              NETWORKING
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'networking' ? 'rotate-180' : ''}`} />
            </a>

            {/* Mega Menu Networking */}
            {activeMenu === 'networking' && (
              <div className="absolute top-full right-0 w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <MegaMenuItem 
                      icon={<Router className="w-5 h-5" />} 
                      title="Routers" 
                      desc="Gaming / Mesh / Wi-Fi 6-7" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'router')}
                    />
                    <MegaMenuItem 
                      icon={<Network className="w-5 h-5" />} 
                      title="Switches y Cables Ethernet" 
                      desc="Cat6, Cat7, Cat8 Performance" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'switch')}
                    />
                    <MegaMenuItem 
                      icon={<Wifi className="w-5 h-5" />} 
                      title="Tarjetas de red" 
                      desc="Wi-Fi PCIe / USB" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'nic')}
                    />
                    <MegaMenuItem 
                      icon={<Usb className="w-5 h-5" />} 
                      title="Adaptadores USB-C" 
                      desc="Hubs, Ethernet Adapters" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'hub')}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Streaming Menu */}
          <div 
            className="relative h-full flex items-center group cursor-pointer"
            onClick={() => toggleMenu('streaming')}
          >
            <a 
              className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                isStreamingActive || activeMenu === 'streaming' ? 'text-primary' : 'text-slate-300 hover:text-primary'
              }`}
            >
              STREAMING
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'streaming' ? 'rotate-180' : ''}`} />
            </a>

            {/* Mega Menu Streaming */}
            {activeMenu === 'streaming' && (
              <div className="absolute top-full right-0 w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <MegaMenuItem 
                      icon={<Sun className="w-5 h-5" />} 
                      title="Luces LED / Ring lights" 
                      desc="Iluminación Pro / RGB" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'lighting')}
                    />
                    <MegaMenuItem 
                      icon={<Image className="w-5 h-5" />} 
                      title="Green screens" 
                      desc="Chromakey / Portátiles" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'greenscreen')}
                    />
                    <MegaMenuItem 
                      icon={<Cast className="w-5 h-5" />} 
                      title="Capturadoras de video" 
                      desc="4K60 Pro / USB 3.0" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'capture')}
                    />
                    <MegaMenuItem 
                      icon={<Gamepad2 className="w-5 h-5" />} 
                      title="Stream decks" 
                      desc="Controladores de Atajos / LCD" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'streamdeck')}
                    />
                    <MegaMenuItem 
                      icon={<Camera className="w-5 h-5" />} 
                      title="Cámaras DSLR" 
                      desc="Sony Alpha / Canon EOS / Mirrorless" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'camera')}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Accesorios Menu */}
          <div 
            className="relative h-full flex items-center group cursor-pointer"
            onClick={() => toggleMenu('accessories')}
          >
            <a 
              className={`text-[10px] font-black transition-colors flex items-center gap-1 h-full uppercase tracking-widest ${
                isAccessoryActive || activeMenu === 'accessories' ? 'text-primary' : 'text-slate-300 hover:text-primary'
              }`}
            >
              ACCESORIOS
              <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeMenu === 'accessories' ? 'rotate-180' : ''}`} />
            </a>

            {/* Mega Menu Accesorios */}
            {activeMenu === 'accessories' && (
              <div className="absolute top-full left-0 lg:right-0 lg:left-auto w-[95vw] lg:w-[700px] mt-0 pt-0 z-[200]" onClick={(e) => e.stopPropagation()}>
                <div className="mega-menu-glass rounded-b-2xl shadow-2xl overflow-hidden p-6 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                    <MegaMenuItem 
                      icon={<Cable className="w-5 h-5" />} 
                      title="Cables HDMI / DisplayPort" 
                      desc="4K / 8K / Alta Velocidad" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'cable-video')}
                    />
                    <MegaMenuItem 
                      icon={<Usb className="w-5 h-5" />} 
                      title="Cables USB" 
                      desc="Tipo A / C / Micro / Lightning" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'cable-usb')}
                    />
                    <MegaMenuItem 
                      icon={<Repeat className="w-5 h-5" />} 
                      title="Adaptadores" 
                      desc="Video / Datos / Audio" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'adapter')}
                    />
                    <MegaMenuItem 
                      icon={<PlugZap className="w-5 h-5" />} 
                      title="Regletas y UPS" 
                      desc="Protección Eléctrica / Respaldo" 
                      onClick={() => handleMegaMenuClick('catalog', undefined, 'ups')}
                    />
                  </div>
                </div>
              )}
          </div>

          </div>
          
          <div className="flex items-center gap-4 shrink-0 h-full ml-auto relative z-[10]">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setActiveMenu(null);
                onNavigate('reseller-request');
              }}
              className="hidden sm:flex items-center gap-2 text-[10px] font-black text-slate-400 hover:text-white uppercase tracking-widest transition-colors px-4 h-full border-x border-white/5 cursor-pointer relative z-[70]"
            >
              Portal B2B
            </button>
            <span className="h-6 w-px bg-slate-700 hidden sm:block"></span>
            <button 
              onClick={() => {
                setActiveMenu(null);
                onNavigate('catalog', undefined, 'offers');
              }}
              className="flex items-center gap-2 px-5 py-2 bg-primary hover:bg-primary/90 text-white rounded-xl text-[10px] font-black transition-all shadow-lg shadow-primary/30 uppercase tracking-widest group hover:scale-105 active:scale-95" 
            >
              <Bolt className="w-4 h-4 animate-pulse" /> 
              <span>OFERTAS TOP</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

function MegaMenuItem({ icon, title, desc, onClick }: { icon: React.ReactNode, title: string, desc: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors group/item text-left"
    >
      <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-primary group-hover/item:bg-primary group-hover/item:text-white transition-all">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold text-xs">{title}</h4>
        <p className="text-slate-500 text-[10px]">{desc}</p>
      </div>
    </button>
  );
}
