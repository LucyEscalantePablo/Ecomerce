import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutGrid, 
  Box, 
  ShoppingCart, 
  Users, 
  Image as ImageIcon, 
  Tag, 
  ChevronRight, 
  ArrowLeft,
  Search,
  Plus,
  Filter,
  MoreVertical,
  Download,
  Upload,
  Edit2,
  Trash2,
  Eye,
  TrendingUp,
  TrendingDown,
  MousePointer2,
  ShoppingBag,
  AlertCircle,
  Cpu,
  Save,
  X,
  ChevronLeft,
  Settings,
  Ban,
  Megaphone,
  Star,
  Brain,
  Sparkles,
  Handshake,
  CheckCircle2,
  XCircle
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

interface AdminDashboardViewProps {
  onNavigate: (view: any) => void;
  resellerRequests: any[];
  onApproveReseller: (id: string, status: 'Aprobado' | 'Rechazado') => void;
  tenants?: any[];
  isSuperAdmin?: boolean;
}

const salesData = [
  { name: 'LUN', value: 12000 },
  { name: 'MAR', value: 18000 },
  { name: 'MIE', value: 32000 },
  { name: 'JUE', value: 28000 },
  { name: 'VIE', value: 45000 },
  { name: 'SAB', value: 62000 },
  { name: 'DOM', value: 58000 },
];

export default function AdminDashboardView({ 
  onNavigate, 
  resellerRequests, 
  onApproveReseller,
  tenants = [],
  isSuperAdmin = false
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [orderFilter, setOrderFilter] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedReseller, setSelectedReseller] = useState<any | null>(null);

  const [bannersData, setBannersData] = useState([
    { id: '#B-2024-001', title: 'Cyber Week 2023', subtitle: 'Hasta 50% de descuento', img: 'https://picsum.photos/seed/banner1/800/400', active: true, description: 'Impulsa tu productividad con la nueva generación de estaciones de trabajo potenciadas por Inteligencia Artificial. Ofertas exclusivas de temporada.', redirectUrl: 'https://techmarket.smart/', expiryDate: '2024-12-31', priority: 8, clicks: 12450, ctr: 4.2 },
    { id: '#B-2024-002', title: 'Nuevos iPhone 15', subtitle: 'Ya disponibles en tienda', img: 'https://picsum.photos/seed/banner2/800/400', active: true, description: 'Descubre la potencia del nuevo iPhone 15 Pro con acabado en titanio.', redirectUrl: 'https://techmarket.smart/iphone', expiryDate: '2024-11-30', priority: 10, clicks: 8900, ctr: 5.1 },
    { id: '#B-2024-003', title: 'Accesorios Gaming', subtitle: 'Equípate como un pro', img: 'https://picsum.photos/seed/banner3/800/400', active: false, description: 'Los mejores periféricos para llevar tu juego al siguiente nivel.', redirectUrl: 'https://techmarket.smart/gaming', expiryDate: '2024-10-15', priority: 5, clicks: 3200, ctr: 2.8 },
  ]);

  const toggleBannerStatus = (id: string) => {
    setBannersData(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const ordersData = [
    { id: '#TM-8492', client: 'Carlos Rodríguez', city: 'Lima, Perú', date: '24 Oct 2023', time: '14:20 PM', total: 'S/ 1,250.00', status: 'Procesando', color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { id: '#TM-8491', client: 'María Fernández', city: 'Arequipa, Perú', date: '24 Oct 2023', time: '11:05 AM', total: 'S/ 480.50', status: 'Enviado', color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { id: '#TM-8490', client: 'Jorge Quispe', city: 'Cusco, Perú', date: '23 Oct 2023', time: '09:45 AM', total: 'S/ 2,100.00', status: 'Completado', color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { id: '#TM-8489', client: 'Lucía Escalante', city: 'Ayacucho, Perú', date: '22 Oct 2023', time: '16:30 PM', total: 'S/ 3,500.00', status: 'Cancelado', color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { id: '#TM-8488', client: 'Pedro Castillo', city: 'Chota, Perú', date: '22 Oct 2023', time: '10:15 AM', total: 'S/ 150.00', status: 'Procesando', color: 'text-amber-500', bg: 'bg-amber-500/10' },
  ];

  const filteredOrders = orderFilter === 'Todas' 
    ? ordersData 
    : ordersData.filter(order => order.status === orderFilter);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5" /> },
    { id: 'products', label: 'Productos', icon: <Box className="w-5 h-5" /> },
    { id: 'orders', label: 'Órdenes', icon: <ShoppingCart className="w-5 h-5" /> },
    { id: 'clients', label: 'Clientes', icon: <Users className="w-5 h-5" /> },
    { id: 'banners', label: 'Banners', icon: <ImageIcon className="w-5 h-5" /> },
    { id: 'offers', label: 'Ofertas', icon: <Tag className="w-5 h-5" /> },
    { id: 'resellers', label: 'Revendedores', icon: <Handshake className="w-5 h-5" /> },
  ];

  if (isSuperAdmin) {
    menuItems.push({ id: 'tenants', label: 'Tenants (SaaS)', icon: <Users className="w-5 h-5" /> });
  }

  const [resellersData, setResellersData] = useState(resellerRequests);

  const handleResellerAction = (id: string, newStatus: 'Aprobado' | 'Rechazado') => {
    onApproveReseller(id, newStatus);
    setResellersData(prev => prev.map(req => req.id === id ? { ...req, status: newStatus } : req));
  };

  const renderDashboard = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white uppercase tracking-tight">Dashboard de Analytics</h2>
          <p className="text-slate-500 text-sm">Visualización inteligente de rendimiento en tiempo real.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ventas Totales', value: 'S/ 45,280', trend: '+12.5%', icon: <ShoppingBag className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Tasa de Conversión', value: '3.8%', trend: '+0.4%', icon: <MousePointer2 className="w-5 h-5" />, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Carritos Abandonados', value: '32%', trend: '-2.1%', icon: <ShoppingBag className="w-5 h-5" />, color: 'text-rose-500', bg: 'bg-rose-500/10' },
          { label: 'Sesiones Activas', value: '1,240', trend: '+15%', icon: <Users className="w-5 h-5" />, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center text-white`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-black px-2 py-1 rounded-lg bg-white/5 ${stat.color}`}>
                {stat.trend}
              </span>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
              <h4 className="text-2xl font-black text-white tracking-tighter">{stat.value}</h4>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-lg font-black text-white uppercase tracking-tight">Histórico de Ventas Semanales</h3>
            <p className="text-slate-500 text-xs">Visualización dinámica de ingresos por día</p>
          </div>
          <div className="flex bg-black/40 p-1 rounded-xl">
            <button className="px-4 py-2 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors">7 Días</button>
            <button className="px-4 py-2 text-[10px] font-black text-white bg-primary/20 rounded-lg uppercase tracking-widest">30 Días</button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f5af0" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0f5af0" stopOpacity={0}/>
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
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0B0E14', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
              />
              <Area 
                type="monotone" 
                dataKey="value" 
                stroke="#0f5af0" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorValue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Eye className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Productos Más Vistos</h3>
            </div>
            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Exportar CSV</button>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Laptop Pro X15 Ultra', id: 'PC-45091', sku: 'TM-LP-01', views: '8,450', trend: '+12%', price: 'S/ 4,299.00' },
              { name: 'SmartPhone Z Flip Fold', id: 'PH-11234', sku: 'TM-PH-04', views: '5,892', trend: 'MANTENIENDO', price: 'S/ 3,150.00' },
              { name: 'Audífonos Studio Max', id: 'AU-09223', sku: 'TM-AU-12', views: '3,210', trend: '-5%', price: 'S/ 899.00' },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-white/2 hover:bg-white/5 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-black/40 p-2">
                    <img src={`https://picsum.photos/seed/${i + 200}/100/100`} alt="" className="w-full h-full object-contain opacity-50 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">{p.name}</h4>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{p.id} | SKU: {p.sku}</p>
                    <p className="text-xs font-black text-emerald-500 mt-1">{p.price}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-black text-white tracking-tighter">{p.views}</p>
                  <p className={`text-[8px] font-black uppercase tracking-widest ${p.trend.startsWith('+') ? 'text-emerald-500' : p.trend === 'MANTENIENDO' ? 'text-slate-500' : 'text-rose-500'}`}>
                    {p.trend} VISTAS
                  </p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-white transition-colors border-t border-white/5">
            Ver Catálogo Completo (420)
          </button>
        </div>

        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-rose-500" />
              <h3 className="text-lg font-black text-white uppercase tracking-tight">Búsquedas Sin Resultado</h3>
            </div>
            <span className="text-[10px] font-black bg-rose-500/10 text-rose-500 px-3 py-1 rounded-lg uppercase tracking-widest">Requiere Atención</span>
          </div>
          <div className="space-y-4">
            {[
              { term: '"Drone Sumergible RX-7"', count: 142, suggestion: 'Evaluar importación o productos similares' },
              { term: '"Monitor Curvo 49 OLED"', count: 98, suggestion: 'Reposición inmediata, posible error de tag' },
              { term: '"Teclado Mecánico Pink"', count: 64, suggestion: 'Crear nueva categoría "Gaming Aesthetic"' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl border border-dashed border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black text-slate-700">0{i + 1}</span>
                    <h4 className="text-sm font-black text-white italic">{s.term}</h4>
                  </div>
                  <div className="bg-black/40 px-3 py-2 rounded-xl text-center min-w-[80px]">
                    <p className="text-lg font-black text-white leading-none">{s.count}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">veces</p>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[8px] font-black text-primary uppercase tracking-widest mt-0.5">Sugerencia:</span>
                  <p className="text-[10px] font-bold text-slate-400">{s.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-4 bg-primary/10 text-primary rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/20 transition-all flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Optimizar búsquedas con IA Lisi
          </button>
        </div>
      </div>

      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-blue-500/20">
        <div className="flex items-center gap-8 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-white shrink-0">
            <Cpu className="w-8 h-8" />
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Recomendaciones Estratégicas de Lisi</h3>
              <span className="bg-white/20 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">IA Activa</span>
            </div>
            <p className="text-blue-100 text-sm max-w-2xl">
              Basado en el análisis de <span className="font-black">1,450 búsquedas fallidas</span> esta semana, te sugiero crear la categoría "Drones Profesionales" y reponer stock de "Laptops Pro X15". La demanda proyectada es un <span className="text-emerald-300 font-black">+24%</span> para el próximo Cyber Day.
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button className="px-6 py-3 bg-white text-blue-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-50 transition-all">Ejecutar Acciones</button>
            <button className="px-6 py-3 bg-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/20 transition-all">Ver Detalles</button>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
      </div>
    </div>
  );

  const renderInventory = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Inventario</h2>
          <p className="text-slate-500 text-sm mt-2">Administra tus productos, stock y visibilidad del catálogo.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
            <Upload className="w-4 h-4" /> Importar CSV
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Exportar
          </button>
          <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30">
            <Plus className="w-4 h-4" /> Añadir Producto
          </button>
        </div>
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar por SKU, nombre o categoría..."
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <select className="bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none min-w-[200px]">
            <option>Todas las Categorías</option>
            <option>Laptops</option>
            <option>Celulares</option>
            <option>Accesorios</option>
          </select>
          <select className="bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none min-w-[150px]">
            <option>Estado: Todos</option>
            <option>En Stock</option>
            <option>Bajo Stock</option>
            <option>Agotado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">IMG</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">NOMBRE DEL PRODUCTO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CATEGORÍA</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">PRECIO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">STOCK</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">VISIBLE</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 1, sku: 'PROD-001', name: 'MacBook Air M2', cat: 'LAPTOPS', price: 'S/ 4,500.00', stock: 85, visible: true },
                { id: 2, sku: 'PROD-002', name: 'iPhone 15 Pro Max Titanium', cat: 'CELULARES', price: 'S/ 5,200.00', stock: 40, visible: true },
                { id: 3, sku: 'PROD-003', name: 'Galaxy Watch 6 Pro', cat: 'ACCESORIOS', price: 'S/ 1,200.00', stock: 15, visible: false },
              ].map((p) => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="w-12 h-12 rounded-xl bg-black/40 p-2">
                      <img src={`https://picsum.photos/seed/${p.id + 300}/100/100`} alt="" className="w-full h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-500">{p.sku}</td>
                  <td className="px-6 py-6 text-sm font-bold text-white">{p.name}</td>
                  <td className="px-6 py-6">
                    <span className="text-[10px] font-black bg-blue-500 text-white px-3 py-1 rounded-lg uppercase tracking-widest">
                      {p.cat}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-white">{p.price}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden min-w-[80px]">
                        <div 
                          className={`h-full rounded-full ${p.stock < 20 ? 'bg-rose-500' : p.stock < 50 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                          style={{ width: `${Math.min(p.stock, 100)}%` }} 
                        />
                      </div>
                      <span className="text-xs font-bold text-white">{p.stock}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <button className={`w-12 h-6 rounded-full transition-all relative ${p.visible ? 'bg-primary' : 'bg-slate-800'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${p.visible ? 'left-7' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => setEditingProduct(p)}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
                      >
                        <Edit2 className="w-3 h-3" /> Editar
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all">
                        <Trash2 className="w-3 h-3" /> Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <p className="text-xs font-bold text-slate-500">Mostrando 3 de 128 productos</p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white disabled:opacity-50" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditProduct = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
            <span>Productos</span> <ChevronRight className="w-3 h-3" /> <span className="text-white">Editar Producto</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Editar Producto</h2>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-bold">ID: {editingProduct?.sku} • Actualiza la información y especificaciones técnicas.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setEditingProduct(null)}
            className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
          >
            Cancelar
          </button>
          <button className="px-10 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
            <Save className="w-4 h-4" /> Guardar Cambios
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <AlertCircle className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Información General</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2 space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  defaultValue={editingProduct?.name + " (2023)"}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">SKU</label>
                <input 
                  type="text" 
                  defaultValue="LAP-MAC-M2-001"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
                  <option>Laptops</option>
                  <option>Celulares</option>
                  <option>Accesorios</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Precio (S/)</label>
                <input 
                  type="text" 
                  defaultValue="4,899.00"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stock Actual</label>
                <input 
                  type="number" 
                  defaultValue="15"
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>
          </section>

          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Especificaciones Técnicas</h3>
              </div>
              <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline flex items-center gap-1">
                <Plus className="w-3 h-3" /> Añadir Campo
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                { label: 'Procesador', value: 'Chip Apple M2' },
                { label: 'Memoria', value: '8GB RAM' },
                { label: 'Almacenamiento', value: '256GB SSD' },
                { label: 'Pantalla', value: 'Liquid Retina 13.6"' },
              ].map((spec, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-1 space-y-2">
                    <input 
                      type="text" 
                      defaultValue={spec.label}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <div className="flex-[2] space-y-2">
                    <input 
                      type="text" 
                      defaultValue={spec.value}
                      className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                    />
                  </div>
                  <button className="mt-8 p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <ImageIcon className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Gestión de Imágenes</h3>
            </div>
            <div className="space-y-4">
              <div className="aspect-square bg-black/40 rounded-2xl border-2 border-dashed border-white/10 relative overflow-hidden group">
                <img src="https://picsum.photos/seed/macbook/600/600" alt="" className="w-full h-full object-contain" />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest">Principal</span>
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <button className="p-3 bg-white text-black rounded-xl hover:bg-slate-200 transition-all"><Edit2 className="w-5 h-5" /></button>
                  <button className="p-3 bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition-all"><Trash2 className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="aspect-square bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                  <img src="https://picsum.photos/seed/mac2/200/200" alt="" className="w-full h-full object-cover" />
                </div>
                <div className="aspect-square bg-black/40 rounded-xl border border-white/10 overflow-hidden">
                  <img src="https://picsum.photos/seed/mac3/200/200" alt="" className="w-full h-full object-cover" />
                </div>
                <button className="aspect-square bg-white/5 border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-white hover:border-white/20 transition-all">
                  <Upload className="w-5 h-5" />
                  <span className="text-[8px] font-black uppercase tracking-widest">Subir</span>
                </button>
              </div>
              <div className="p-6 border-2 border-dashed border-white/5 rounded-2xl text-center">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center justify-center gap-2">
                  <Upload className="w-3 h-3" /> Arrastrar nuevas fotos aquí
                </p>
              </div>
            </div>
          </section>

          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Publicación</h3>
            <div className="flex items-center justify-between p-4 bg-white/2 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-white">Visibilidad</p>
                <p className="text-[10px] text-slate-500">Mostrar en el catálogo</p>
              </div>
              <button className="w-12 h-6 rounded-full bg-primary relative">
                <div className="absolute top-1 left-7 w-4 h-4 bg-white rounded-full" />
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Órdenes</h2>
          <p className="text-slate-500 text-sm mt-2">Control centralizado y tracking de pedidos en tiempo real.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 flex items-center gap-2">
            <Plus className="w-4 h-4" /> Nueva Orden
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Exportar
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Hoy', value: '124', trend: '+12%', color: 'text-emerald-500' },
          { label: 'Pendientes', value: '38', trend: '-4%', color: 'text-amber-500' },
          { label: 'Ingresos (S/)', value: 'S/ 12,400', trend: '+8%', color: 'text-emerald-500' },
          { label: 'Entregas Hoy', value: '82', trend: '98% ok', color: 'text-blue-500' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-2">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h4 className="text-2xl font-black text-white tracking-tighter">{stat.value}</h4>
              <span className={`text-[10px] font-bold ${stat.color}`}>{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex bg-black/40 p-1 rounded-xl">
            {['Todas', 'Procesando', 'Enviado', 'Completado', 'Cancelado'].map((tab) => (
              <button 
                key={tab}
                onClick={() => setOrderFilter(tab)}
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${
                  tab === orderFilter ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 flex items-center gap-2 text-slate-400">
              <LayoutGrid className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Oct 2023</span>
            </div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-colors">
              <Filter className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ID PEDIDO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CLIENTE</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">FECHA</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">MONTO TOTAL</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ESTADO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-6 text-sm font-black text-primary italic">{order.id}</td>
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-white/10">
                        <img src={`https://i.pravatar.cc/150?u=${order.client}`} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">{order.client}</p>
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{order.city}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <p className="text-sm font-bold text-white">{order.date}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">{order.time}</p>
                  </td>
                  <td className="px-6 py-6 text-sm font-black text-white">{order.total}</td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${order.bg} ${order.color}`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${order.color.replace('text', 'bg')}`} />
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <p className="text-xs font-bold text-slate-500">Mostrando {filteredOrders.length} de {ordersData.length} resultados</p>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {[1, 2, 3, '...', 248].map((page, i) => (
                <button 
                  key={i}
                  onClick={() => typeof page === 'number' && setCurrentPage(page)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${
                    page === currentPage ? 'bg-primary text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
            <button 
              onClick={() => setCurrentPage(prev => prev + 1)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Clientes</h2>
          <p className="text-slate-500 text-sm mt-2">Base de datos de usuarios y segmentación de clientes.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Exportar Lista
          </button>
        </div>
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
          <input 
            type="text" 
            placeholder="Buscar por nombre, email o ID..."
            className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CLIENTE</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">EMAIL</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">PEDIDOS</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">TOTAL GASTADO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">ESTADO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Ana Belén', email: 'ana.belen@email.com', orders: 12, spent: 'S/ 4,250.00', status: 'Activo' },
                { name: 'Roberto Gómez', email: 'roberto.g@email.com', orders: 5, spent: 'S/ 1,120.00', status: 'Inactivo' },
                { name: 'Lucía Méndez', email: 'lucia.m@email.com', orders: 28, spent: 'S/ 12,800.00', status: 'VIP' },
              ].map((c, i) => (
                <tr key={i} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-black text-xs">
                        {c.name.charAt(0)}
                      </div>
                      <span className="text-sm font-bold text-white">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-500">{c.email}</td>
                  <td className="px-6 py-6 text-sm font-bold text-white">{c.orders}</td>
                  <td className="px-6 py-6 text-sm font-black text-white">{c.spent}</td>
                  <td className="px-6 py-6">
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${
                      c.status === 'VIP' ? 'bg-amber-500/10 text-amber-500' : 
                      c.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-500' : 
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-6 py-6 text-right">
                    <button className="p-2 text-slate-600 hover:text-white transition-colors">
                      <MoreVertical className="w-5 h-5" />
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

  const renderBanners = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Banners</h2>
          <p className="text-slate-500 text-sm mt-2">Personaliza el carrusel principal y anuncios de la tienda.</p>
        </div>
        <button className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30">
          <Plus className="w-4 h-4" /> Nuevo Banner
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {bannersData.map((b, i) => (
          <div key={i} className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden group">
            <div className="aspect-video relative overflow-hidden">
              <img src={b.img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent p-8 flex flex-col justify-end">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">{b.title}</h3>
                <p className="text-slate-300 text-sm">{b.subtitle}</p>
              </div>
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${b.active ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-400'}`}>
                  {b.active ? 'Activo' : 'Pausado'}
                </span>
              </div>
            </div>
            <div className="p-6 flex items-center justify-between bg-white/2">
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => setEditingBanner(b)}
                  className="p-2 text-slate-400 hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
              <button 
                onClick={() => toggleBannerStatus(b.id)}
                className={`text-[10px] font-black uppercase tracking-widest ${b.active ? 'text-rose-500' : 'text-emerald-500'}`}
              >
                {b.active ? 'Desactivar' : 'Activar'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderOffers = () => (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Ofertas</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Administra promociones activas y campañas de cupones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30">
            <Plus className="w-4 h-4" /> Crear Nueva Oferta
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all">
            <Ban className="w-4 h-4" /> Detener Campaña
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ofertas Activas', value: '12', badge: 'En curso', badgeColor: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Cupones Redimidos', value: '458', badge: '+15% mes', badgeColor: 'text-primary bg-primary/10' },
          { label: 'Ahorro Total (S/)', value: 'S/ 4,250', badge: 'Octubre', badgeColor: 'text-slate-400 bg-white/5' },
          { label: 'Conversión', value: '24.5%', badge: 'Alta', badgeColor: 'text-emerald-500 bg-emerald-500/10' },
        ].map((stat, i) => (
          <div key={i} className="bg-[#151921] border border-white/5 rounded-3xl p-6 space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-black text-white tracking-tighter">{stat.value}</h3>
              <span className={`px-2 py-1 rounded-lg text-[8px] font-black uppercase tracking-widest ${stat.badgeColor}`}>
                {stat.badge}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* AI Assistant Banner */}
      <div className="bg-gradient-to-r from-primary/20 to-transparent border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-3xl rounded-full -mr-32 -mt-32"></div>
        <div className="flex items-center gap-6 relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30 group-hover:scale-110 transition-transform">
            <Brain className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight">Asistente Lisi: Recuperación de Carritos</h4>
            <p className="text-slate-400 text-sm mt-1 max-w-xl">Lisi ha identificado 45 carritos abandonados. ¿Quieres generar cupones personalizados del 10% para estos usuarios?</p>
          </div>
        </div>
        <button className="relative z-10 px-8 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 whitespace-nowrap">
          Generar Cupones
        </button>
      </div>

      {/* Campaigns Table */}
      <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Campañas de Ofertas</h3>
          <button className="p-2 text-slate-500 hover:text-white transition-colors">
            <Filter className="w-5 h-5" />
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-6 text-left">Nombre de Oferta</th>
                <th className="px-8 py-6 text-left">Descuento (%)</th>
                <th className="px-8 py-6 text-left">Código</th>
                <th className="px-8 py-6 text-left">Vigencia</th>
                <th className="px-8 py-6 text-left">Uso Actual</th>
                <th className="px-8 py-6 text-right">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Black Tech Friday', icon: <Megaphone className="w-4 h-4 text-primary" />, discount: '25%', code: 'BLACK25', validity: '24 Nov - 30 Nov', subValidity: 'Expira en 5 días', usage: 750, total: 1000, status: 'Activo' },
                { name: 'Bienvenida Smart', icon: <Star className="w-4 h-4 text-amber-500" />, discount: '10%', code: 'TECH10', validity: 'Indefinido', subValidity: 'Solo nuevos usuarios', usage: 1240, total: 5000, status: 'Activo' },
              ].map((campaign, i) => (
                <tr key={i} className="group hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                        {campaign.icon}
                      </div>
                      <span className="text-sm font-black text-white uppercase tracking-tight">{campaign.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-sm font-black text-primary">{campaign.discount}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="bg-black/20 border border-white/10 rounded-lg px-4 py-2 inline-block">
                      <span className="text-xs font-black text-slate-300 font-mono tracking-wider">{campaign.code}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-white">{campaign.validity}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{campaign.subValidity}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="w-48 space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>{campaign.usage.toLocaleString()} / {campaign.total.toLocaleString()} usos</span>
                      </div>
                      <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full" 
                          style={{ width: `${(campaign.usage / campaign.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {campaign.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Precios expresados en Soles (S/)</p>
          <div className="flex items-center gap-2">
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              <button className="w-8 h-8 rounded-lg bg-primary text-white text-[10px] font-black transition-all">1</button>
              <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-white/5 hover:text-white text-[10px] font-black transition-all">2</button>
            </div>
            <button className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderEditBanner = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">
            <span>Banners</span> <ChevronRight className="w-3 h-3" /> <span className="text-white">Editar Banner</span>
          </div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Editar Banner</h2>
          <p className="text-slate-500 text-sm mt-2 uppercase tracking-widest font-bold">ID del Banner: {editingBanner?.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Edit2 className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Contenido del Banner</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Título del Banner</label>
                <input 
                  type="text" 
                  defaultValue={editingBanner?.title}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
                <textarea 
                  rows={4}
                  defaultValue={editingBanner?.description}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                />
              </div>
              <div className="space-y-4">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Imagen del Banner</label>
                <div className="aspect-[21/9] bg-black/40 rounded-2xl border-2 border-dashed border-white/10 relative overflow-hidden group flex flex-col items-center justify-center gap-4 cursor-pointer hover:border-primary/50 transition-all">
                  <img src={editingBanner?.img} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
                  <div className="relative z-10 flex flex-col items-center gap-2">
                    <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/30">
                      <Upload className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-black text-white">Haga clic para cargar o arrastre su imagen aquí</p>
                    <p className="text-[10px] font-bold text-slate-500">Soportado: JPG, PNG, WEBP (Recomendado 1920x820px)</p>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-lg border border-white/10">
                    <p className="text-[8px] font-black text-white uppercase tracking-widest">Actual</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold text-slate-600 flex items-center gap-2">
                  <AlertCircle className="w-3 h-3" /> Tamaño máximo permitido: 2MB. La imagen se optimizará automáticamente para la web.
                </p>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Configuración</h3>
            </div>
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado</label>
                <select className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none">
                  <option selected={editingBanner?.active}>Activo</option>
                  <option selected={!editingBanner?.active}>Pausado</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">URL de Redirección</label>
                <div className="relative">
                  <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    defaultValue={editingBanner?.redirectUrl}
                    className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fecha de Expiración</label>
                <input 
                  type="date" 
                  defaultValue={editingBanner?.expiryDate}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Prioridad de Visualización</label>
                  <span className="text-sm font-black text-white">{editingBanner?.priority}</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  defaultValue={editingBanner?.priority}
                  className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[8px] font-black text-slate-600 uppercase tracking-widest">
                  <span>Baja</span>
                  <span>Media</span>
                  <span>Alta</span>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-black/20 border border-white/5 rounded-3xl p-8 space-y-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Rendimiento Actual</h4>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-2xl font-black text-white tracking-tighter">{editingBanner?.clicks.toLocaleString()}</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">Clics totales</p>
              </div>
              <div>
                <p className="text-2xl font-black text-white tracking-tighter">{editingBanner?.ctr}%</p>
                <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest">CTR Promedio</p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
        <button 
          onClick={() => setEditingBanner(null)}
          className="px-12 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Cancelar
        </button>
        <button className="px-16 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30">
          Guardar Cambios
        </button>
      </div>
    </div>
  );

  const renderResellers = () => (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Solicitudes de Revendedor</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Gestiona las solicitudes de alta para el portal B2B.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> Exportar Lista
          </button>
        </div>
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden">
        <div className="p-8 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input 
                type="text" 
                placeholder="Buscar por empresa o RUC..."
                className="bg-black/20 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary/40 w-64"
              />
            </div>
            <select className="bg-black/20 border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-widest outline-none">
              <option>Todos los Estados</option>
              <option>Pendiente</option>
              <option>Aprobado</option>
              <option>Rechazado</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                <th className="px-8 py-6 text-left">Empresa / RUC</th>
                <th className="px-8 py-6 text-left">Plan</th>
                <th className="px-8 py-6 text-left">Contacto</th>
                <th className="px-8 py-6 text-left">Experiencia</th>
                <th className="px-8 py-6 text-left">Fecha</th>
                <th className="px-8 py-6 text-left">Estado</th>
                <th className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {resellersData.map((req) => (
                <tr key={req.id} className="group hover:bg-white/2 transition-colors">
                  <td className="px-8 py-6">
                    <div className="space-y-1">
                      <p className="text-sm font-black text-white uppercase tracking-tight">{req.company}</p>
                      <p className="text-[10px] font-bold text-slate-500">{req.ruc}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      req.plan === 'enterprise' ? 'bg-amber-500/10 text-amber-500' :
                      req.plan === 'professional' ? 'bg-primary/10 text-primary' :
                      'bg-slate-500/10 text-slate-500'
                    }`}>
                      {req.plan}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-300">{req.email}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{req.experience}</span>
                  </td>
                  <td className="px-8 py-6">
                    <p className="text-xs font-bold text-slate-400">{req.date}</p>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      req.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-500' :
                      req.status === 'Rechazado' ? 'bg-rose-500/10 text-rose-500' :
                      'bg-amber-500/10 text-amber-500'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {req.status === 'Pendiente' && (
                        <>
                          <button 
                            onClick={() => handleResellerAction(req.id, 'Aprobado')}
                            className="p-2 bg-emerald-500/10 text-emerald-500 rounded-lg hover:bg-emerald-500 hover:text-white transition-all"
                            title="Aprobar"
                          >
                            <CheckCircle2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleResellerAction(req.id, 'Rechazado')}
                            className="p-2 bg-rose-500/10 text-rose-500 rounded-lg hover:bg-rose-500 hover:text-white transition-all"
                            title="Rechazar"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      <button 
                        onClick={() => setSelectedReseller(req)}
                        className="p-2 text-slate-500 hover:text-white transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderResellerDetails = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => setSelectedReseller(null)}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">Detalle de Solicitud</h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">ID: {selectedReseller.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Información de la Empresa</h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Razón Social</p>
                <p className="text-lg font-bold text-white">{selectedReseller.company}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">RUC / DNI</p>
                <p className="text-lg font-bold text-white">{selectedReseller.ruc}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Email Comercial</p>
                <p className="text-lg font-bold text-white">{selectedReseller.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Teléfono</p>
                <p className="text-lg font-bold text-white">{selectedReseller.phone || 'No proporcionado'}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subdominio Solicitado</p>
                <p className="text-lg font-bold text-primary">{selectedReseller.subdomain || 'Auto-generado'}.techmarket.com</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Años de Experiencia</p>
                <p className="text-lg font-bold text-white">{selectedReseller.experience}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan Seleccionado</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                    selectedReseller.plan === 'enterprise' ? 'bg-amber-500/10 text-amber-500' :
                    selectedReseller.plan === 'professional' ? 'bg-primary/10 text-primary' :
                    'bg-slate-500/10 text-slate-500'
                  }`}>
                    {selectedReseller.plan}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {selectedReseller.plan === 'starter' ? 'S/ 99/mes' : 
                     selectedReseller.plan === 'professional' ? 'S/ 249/mes' : 
                     'S/ 599/mes'}
                  </span>
                </div>
              </div>
              <div className="md:col-span-2 space-y-1">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Dirección Fiscal</p>
                <p className="text-lg font-bold text-white">{selectedReseller.address}</p>
              </div>
            </div>
          </section>

          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Categorías de Interés</h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {selectedReseller.categories.map((cat: any, i: number) => (
                <div key={i} className="flex items-center gap-2 px-4 py-2 bg-black/40 border border-white/10 rounded-xl">
                  <span className="text-xs font-bold text-slate-300">
                    {typeof cat === 'string' ? cat : cat.label}
                  </span>
                  {typeof cat === 'object' && cat.quantity && (
                    <span className="px-2 py-0.5 bg-primary/20 text-primary text-[10px] font-black rounded-lg">
                      {cat.quantity}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Settings className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Estado de Solicitud</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-black/20 border border-white/5 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Estado Actual:</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                  selectedReseller.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-500' :
                  selectedReseller.status === 'Rechazado' ? 'bg-rose-500/10 text-rose-500' :
                  'bg-amber-500/10 text-amber-500'
                }`}>
                  {selectedReseller.status}
                </span>
              </div>

              {selectedReseller.status === 'Pendiente' && (
                <div className="grid grid-cols-2 gap-4">
                  <button 
                    onClick={() => {
                      handleResellerAction(selectedReseller.id, 'Aprobado');
                      setSelectedReseller(null);
                    }}
                    className="py-4 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" /> Aprobar
                  </button>
                  <button 
                    onClick={() => {
                      handleResellerAction(selectedReseller.id, 'Rechazado');
                      setSelectedReseller(null);
                    }}
                    className="py-4 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-600 transition-all flex items-center justify-center gap-2"
                  >
                    <XCircle className="w-4 h-4" /> Rechazar
                  </button>
                </div>
              )}

              <div className="pt-6 border-t border-white/5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Historial de Actividad</p>
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="w-1 h-1 rounded-full bg-primary mt-1.5 shrink-0" />
                    <div>
                      <p className="text-xs font-bold text-white">Solicitud recibida</p>
                      <p className="text-[10px] text-slate-500">{selectedReseller.date}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );

  const renderTenants = () => (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Tenants (SaaS)</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Administra tus clientes corporativos y sus suscripciones.</p>
        </div>
        <button className="px-8 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 flex items-center gap-3">
          <Plus className="w-4 h-4" /> Nuevo Tenant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Tenants</p>
          <p className="text-3xl font-black text-white tracking-tighter">{tenants.length}</p>
        </div>
        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ingresos Mensuales (Suscripciones)</p>
          <p className="text-3xl font-black text-white tracking-tighter">S/ {(tenants.length * 200).toLocaleString()}</p>
        </div>
        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-4">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisiones Acumuladas</p>
          <p className="text-3xl font-black text-emerald-500 tracking-tighter">S/ {tenants.reduce((acc: number, t: any) => acc + (t.sales * t.commissionRate), 0).toLocaleString()}</p>
        </div>
      </div>

      <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Empresa / Subdominio</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Categorías</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Ventas</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisión (3%)</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Estado</th>
                <th className="px-8 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {tenants.map((tenant: any) => (
                <tr key={tenant.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <p className="text-sm font-black text-white uppercase tracking-tight">{tenant.name}</p>
                    <p className="text-[10px] font-bold text-primary lowercase tracking-tight">{tenant.subdomain}.techmarket.com</p>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-1">
                      {tenant.approvedCategories.map((cat: any, i: number) => (
                        <span key={i} className="px-2 py-0.5 bg-white/5 text-[8px] font-black text-slate-400 uppercase tracking-widest rounded flex items-center gap-1">
                          {typeof cat === 'string' ? cat : cat.label}
                          {typeof cat === 'object' && cat.quantity && (
                            <span className="text-primary">({cat.quantity})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm font-bold text-white">S/ {tenant.sales.toLocaleString()}</td>
                  <td className="px-8 py-6 text-sm font-black text-emerald-500">S/ {(tenant.sales * tenant.commissionRate).toLocaleString()}</td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                      tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                    }`}>
                      {tenant.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-rose-500 transition-all">
                        <Ban className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (editingProduct) return renderEditProduct();
    if (editingBanner) return renderEditBanner();
    if (selectedReseller) return renderResellerDetails();

    switch (activeTab) {
      case 'dashboard':
        return renderDashboard();
      case 'products':
        return renderInventory();
      case 'orders':
        return renderOrders();
      case 'clients':
        return renderClients();
      case 'banners':
        return renderBanners();
      case 'offers':
        return renderOffers();
      case 'resellers':
        return renderResellers();
      case 'tenants':
        return renderTenants();
      default:
        return (
          <div className="py-20 text-center space-y-4 bg-[#151921]/50 rounded-3xl border border-dashed border-white/10">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto text-slate-600">
              <LayoutGrid className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Sección en Desarrollo</h3>
            <p className="text-slate-500 max-w-xs mx-auto text-sm">Estamos trabajando para traerte las mejores herramientas de gestión.</p>
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
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Panel de Control</h1>
          <p className="text-slate-500 text-sm mt-2">Bienvenido, Administrador. Gestiona tu tienda TechMarket.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id);
                setEditingProduct(null);
                setEditingBanner(null);
                setSelectedReseller(null);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                activeTab === item.id && !editingProduct && !editingBanner && !selectedReseller
                  ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
              }`}
            >
              <div className={`transition-transform group-hover:scale-110 ${activeTab === item.id && !editingProduct && !editingBanner && !selectedReseller ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {activeTab === item.id && !editingProduct && !editingBanner && !selectedReseller && (
                <motion.div 
                  layoutId="activeAdminTab"
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
              key={editingProduct ? 'edit-prod' : editingBanner ? 'edit-banner' : selectedReseller ? 'reseller-detail' : activeTab}
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
