import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { categoryData } from './CatalogView';
import { 
  LayoutGrid, 
  Box, 
  ShoppingCart, 
  TrendingUp, 
  ArrowLeft,
  Search,
  Filter,
  Eye,
  ShoppingBag,
  AlertCircle,
  Settings,
  Package,
  History,
  CreditCard,
  FileText
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

interface ResellerDashboardViewProps {
  onNavigate: (view: any) => void;
  approvedCategories: any[];
  tenantInfo: any;
}

const salesData = [
  { name: 'LUN', value: 5000 },
  { name: 'MAR', value: 8000 },
  { name: 'MIE', value: 12000 },
  { name: 'JUE', value: 10000 },
  { name: 'VIE', value: 15000 },
  { name: 'SAB', value: 22000 },
  { name: 'DOM', value: 18000 },
];

export default function ResellerDashboardView({ onNavigate, approvedCategories, tenantInfo }: ResellerDashboardViewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas las Categorías');

  const categoryMap: Record<string, string> = {
    'cpu': 'Componentes PC',
    'gpu': 'Componentes PC',
    'motherboard': 'Componentes PC',
    'ram': 'Componentes PC',
    'storage': 'Componentes PC',
    'psu': 'Componentes PC',
    'case': 'Componentes PC',
    'cooling': 'Componentes PC',
    'networking': 'Networking y Servidores',
    'router': 'Networking y Servidores',
    'switch': 'Networking y Servidores',
    'nic': 'Networking y Servidores',
    'hub': 'Networking y Servidores',
    'laptop': 'Electrónica de Consumo',
    'laptop-gaming': 'Electrónica de Consumo',
    'laptop-pro': 'Electrónica de Consumo',
    'laptop-student': 'Electrónica de Consumo',
    'pc-prebuilt': 'Electrónica de Consumo',
    'pc-aio': 'Electrónica de Consumo',
    'monitor': 'Electrónica de Consumo',
    'peripherals': 'Electrónica de Consumo',
    'streaming': 'Electrónica de Consumo',
    'mobile': 'Dispositivos Móviles'
  };

  const authorizedProducts = useMemo(() => {
    const allProducts = Object.entries(categoryData).flatMap(([key, products]) => 
      products.map(p => ({ ...p, categoryKey: key, categoryLabel: categoryMap[key] }))
    );

    return allProducts.filter(product => {
      const isAuthorized = approvedCategories.some(cat => 
        (typeof cat === 'string' ? cat : cat.label) === product.categoryLabel
      );
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           product.brand.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas las Categorías' || product.categoryLabel === selectedCategory;
      
      return isAuthorized && matchesSearch && matchesCategory;
    });
  }, [approvedCategories, searchQuery, selectedCategory]);

  const menuItems = [
    { id: 'dashboard', label: 'Resumen', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'inventory', label: 'Mi Inventario', icon: <Box className="w-5 h-5" /> },
    { id: 'orders', label: 'Mis Pedidos', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'billing', label: 'Facturación', icon: <FileText className="w-5 h-5" /> },
    { id: 'settings', label: 'Configuración', icon: <Settings className="w-5 h-5" /> },
  ];

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Resumen de Cuenta</h2>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Panel exclusivo para socios revendedores.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ventas del Mes', value: 'S/ 12,450.00', trend: '+12.5%', icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-500' },
          { label: 'Pedidos Activos', value: '8', trend: '2 nuevos', icon: <ShoppingCart className="w-5 h-5" />, color: 'text-blue-500' },
          { label: 'Crédito Disponible', value: 'S/ 5,000.00', trend: 'Límite S/ 10k', icon: <CreditCard className="w-5 h-5" />, color: 'text-amber-500' },
          { label: 'Categorías Aprobadas', value: approvedCategories.length.toString(), trend: 'Ver lista', icon: <Package className="w-5 h-5" />, color: 'text-purple-500' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-slate-500'}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-2xl font-black text-white tracking-tighter">{stat.value}</p>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Rendimiento de Ventas</h3>
            <select className="bg-[#1a1f26] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none">
              <option className="bg-[#151921] text-white">Últimos 7 días</option>
              <option className="bg-[#151921] text-white">Último mes</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={salesData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00FF00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#00FF00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0B0E14', 
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    fontSize: '12px',
                    fontWeight: '900'
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#00FF00" 
                  strokeWidth={4}
                  fillOpacity={1} 
                  fill="url(#colorSales)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Categorías Autorizadas</h3>
          <div className="space-y-4">
            {approvedCategories.map((cat, i) => {
              const label = typeof cat === 'string' ? cat : cat.label;
              const quantity = typeof cat === 'object' ? cat.quantity : null;
              
              return (
                <div key={i} className="flex items-center gap-4 p-4 bg-black/20 border border-white/5 rounded-2xl group hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{label}</p>
                    <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Acceso Completo</p>
                  </div>
                  {quantity && (
                    <div className="text-right">
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Cupo</p>
                      <p className="text-sm font-black text-primary">{quantity}</p>
                    </div>
                  )}
                </div>
              );
            })}
            {approvedCategories.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <AlertCircle className="w-12 h-12 text-slate-700 mx-auto" />
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">No tienes categorías aprobadas aún.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Mi Inventario Autorizado</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Productos disponibles para tu nivel de revendedor.</p>
        </div>
        <button 
          onClick={() => onNavigate('catalog')}
          className="px-8 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30"
        >
          Ir al Catálogo
        </button>
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar productos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary/40 w-64"
              />
            </div>
            <select 
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[#1a1f26] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none"
            >
              <option className="bg-[#151921] text-white">Todas las Categorías</option>
              {approvedCategories.map(cat => {
                const label = typeof cat === 'string' ? cat : cat.label;
                return <option key={label} value={label} className="bg-[#151921] text-white">{label}</option>;
              })}
            </select>
          </div>
          <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {authorizedProducts.length} Productos Encontrados
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-8">
          {authorizedProducts.map((product) => (
            <div key={product.id} className="bg-black/20 border border-white/5 rounded-2xl p-4 space-y-4 group hover:border-primary/30 transition-all">
              <div className="aspect-square rounded-xl bg-white/5 overflow-hidden relative">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500 text-white text-[8px] font-black uppercase tracking-widest rounded">
                  {product.stock}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.categoryLabel}</p>
                <h4 className="text-sm font-black text-white uppercase tracking-tight line-clamp-1">{product.name}</h4>
                <div className="flex items-center justify-between mt-4">
                  <div>
                    <p className="text-[8px] font-black text-slate-500 uppercase tracking-widest">Precio Distribuidor</p>
                    <p className="text-lg font-black text-white tracking-tighter">S/ {product.price.toLocaleString()}</p>
                  </div>
                  <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-primary transition-all">
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
          {authorizedProducts.length === 0 && (
            <div className="col-span-full py-20 text-center space-y-4">
              <Package className="w-16 h-16 text-slate-700 mx-auto" />
              <p className="text-slate-500 font-bold uppercase tracking-widest">No se encontraron productos en esta selección.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderBilling = () => {
    const subscription = tenantInfo?.subscriptionFee || 200;
    const commissionRate = tenantInfo?.commissionRate || 0.03;
    const totalSales = tenantInfo?.sales || 12450;
    const totalCommission = totalSales * commissionRate;
    const totalToPay = subscription + totalCommission;

    return (
      <div className="space-y-8">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Facturación y Comisiones</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Resumen de cargos mensuales y comisiones por ventas.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Suscripción Mensual</p>
            <p className="text-3xl font-black text-white tracking-tighter">S/ {subscription.toFixed(2)}</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest">Plan Reseller Gold</p>
            </div>
          </div>
          <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisiones ({(commissionRate * 100).toFixed(1)}%)</p>
            <p className="text-3xl font-black text-white tracking-tighter">S/ {totalCommission.toFixed(2)}</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sobre S/ {totalSales.toLocaleString()} en ventas</p>
            </div>
          </div>
          <div className="bg-primary/10 border border-primary/20 rounded-3xl p-8 space-y-4">
            <p className="text-[10px] font-black text-primary uppercase tracking-widest">Total a Pagar Mes</p>
            <p className="text-3xl font-black text-white tracking-tighter">S/ {totalToPay.toFixed(2)}</p>
            <div className="pt-4 border-t border-white/5">
              <p className="text-[10px] font-bold text-white uppercase tracking-widest">Vence en 5 días</p>
            </div>
          </div>
        </div>

        <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-8 border-b border-white/5">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Historial de Facturas</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Factura</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Periodo</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Monto</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                  <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {[
                  { id: 'INV-2024-002', period: 'Febrero 2024', amount: 540.20, status: 'Pagado' },
                  { id: 'INV-2024-001', period: 'Enero 2024', amount: 480.50, status: 'Pagado' },
                ].map((inv) => (
                  <tr key={inv.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-8 py-6 text-sm font-bold text-white">{inv.id}</td>
                    <td className="px-8 py-6 text-sm text-slate-400">{inv.period}</td>
                    <td className="px-8 py-6 text-sm font-black text-white">S/ {inv.amount.toFixed(2)}</td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest rounded-full">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <button className="text-primary hover:text-white transition-colors">
                        <FileText className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'inventory':
        return renderInventory();
      case 'billing':
        return renderBilling();
      default:
        return (
          <div className="py-20 text-center space-y-4 bg-[#151921]/50 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
              <History className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Sección en Desarrollo</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">Estamos preparando tus herramientas de gestión de pedidos y facturación.</p>
          </div>
        );
    }
  };

  return (
    <div className="py-12 min-h-[80vh]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Sitio
          </button>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Portal Reseller</h1>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Bienvenido, Socio Estratégico. Gestiona tu negocio B2B.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                activeTab === item.id 
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`transition-transform group-hover:scale-110 ${activeTab === item.id ? 'text-white' : 'text-slate-500 group-hover:text-emerald-500'}`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {activeTab === item.id && (
                <motion.div 
                  layoutId="activeResellerTab"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-white"
                />
              )}
            </button>
          ))}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
