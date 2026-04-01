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
  XCircle,
  Zap
} from 'lucide-react';
import { ProductAdminModal, FilterAdminModal } from './AdminModals';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { supabase } from '../lib/supabase';
import { categoryData } from './CatalogView';
import { uploadFile } from '../lib/adminUtils';
import { CATEGORIES_DATA, GLOBAL_OFFERS } from '../data/adminConstants';

interface AdminDashboardViewProps {
  onNavigate: (view: any) => void;
  resellerRequests: any[];
  onApproveReseller: (id: string, status: 'Aprobado' | 'Rechazado') => void;
  tenants?: any[];
  isSuperAdmin?: boolean;
  onUpdateTenant?: (id: string, updates: any) => void;
  onDeleteTenant?: (id: string) => void;
  onToggleTenantStatus?: (id: string) => void;
  initialState?: { tab: string, data?: any } | null;
  onClearInitialState?: () => void;
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
  isSuperAdmin = false,
  onUpdateTenant,
  onDeleteTenant,
  onToggleTenantStatus,
  initialState = null,
  onClearInitialState
}: AdminDashboardViewProps) {
  const [activeTab, setActiveTab] = useState(initialState?.tab || 'dashboard');
  
  const [dashboardDays, setDashboardDays] = useState(40);
  const [offersPage, setOffersPage] = useState(1);
  const itemsPerPage = 5;

  const salesData7 = [
    { name: 'LUN', value: 12000 },
    { name: 'MAR', value: 18000 },
    { name: 'MIE', value: 32000 },
    { name: 'JUE', value: 28000 },
    { name: 'VIE', value: 45000 },
    { name: 'SAB', value: 62000 },
    { name: 'DOM', value: 58000 },
  ];

  const salesData40 = [
    { name: 'Sem 1', value: 120000 },
    { name: 'Sem 2', value: 180000 },
    { name: 'Sem 3', value: 320000 },
    { name: 'Sem 4', value: 280000 },
    { name: 'Sem 5', value: 350000 },
    { name: 'Sem 6', value: 410000 },
  ];

  const currentSalesData = dashboardDays === 7 ? salesData7 : salesData40;
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState({
    sku: '',
    name: '',
    brand: '',
    cat: 'COMPONENTES',
    subCat: 'Procesadores (CPUs)',
    price: '',
    stock: 0,
    visible: true,
    image_url: '',
    images: [] as string[],
    specs: [] as { key: string; value: string }[]
  });
  const [inventorySearch, setInventorySearch] = useState('');
  const [inventoryCategory, setInventoryCategory] = useState('Todas las Categorías');
  const [inventorySubCategory, setInventorySubCategory] = useState('Todas las Subcategorías');
  const [inventoryStatus, setInventoryStatus] = useState('Estado: Todos');
  const [editingOffer, setEditingOffer] = useState<any | null>(null);
  const [editingBanner, setEditingBanner] = useState<any | null>(null);
  const [editingTenant, setEditingTenant] = useState<any | null>(null);
  const [orderFilter, setOrderFilter] = useState('Todas');
  const [currentPage, setCurrentPage] = useState(1);
  const [resellersData, setResellersData] = useState(resellerRequests);
  const [offersData, setOffersData] = useState(GLOBAL_OFFERS);

  const [selectedReseller, setSelectedReseller] = useState<any | null>(null);
  const [adminFilters, setAdminFilters] = useState<any[]>([]);

  const dynamicOffers = React.useMemo(() => offersData.map(o => {
    if (!o.startDate) return o;
    const startDateTime = new Date(`${o.startDate}T${o.startTime}`);
    const endDateTime = new Date(`${o.endDate}T${o.endTime}`);
    const now = new Date();

    let computedStatus = 'Programado';
    if (now >= startDateTime && now <= endDateTime) computedStatus = 'Activo';
    else if (now > endDateTime) computedStatus = 'Finalizado';

    return {
      ...o,
      status: computedStatus,
      icon: o.icon || <Tag className="w-4 h-4 text-primary" />,
      subValidity: computedStatus === 'Activo' ? 'Promoción en curso' : computedStatus === 'Programado' ? 'Próximamente' : 'Expirada',
    };
  }), [offersData]);

  const activeOffers = dynamicOffers.filter(o => o.status === 'Activo');
  const activeOffersCount = activeOffers.length;

  // Handle initial state updates (e.g. from Catalog)
  React.useEffect(() => {
    if (initialState) {
      setActiveTab(initialState.tab);
      if (initialState.tab === 'products') {
        if (initialState.data?.action === 'add') {
          setIsAddingProduct(true);
        } else if (initialState.data) {
          setEditingProduct(initialState.data);
        }
      }
      onClearInitialState?.();
    }
  }, [initialState]);

  const [productsData, setProductsData] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  React.useEffect(() => {
    fetchProducts();
    fetchFilters();
    checkStorage();
  }, []);

  const fetchFilters = async () => {
    const { data, error } = await supabase
      .from('category_filters')
      .select('*')
      .order('display_order', { ascending: true });
    if (data) setAdminFilters(data);
  };

  const checkStorage = async () => {
    try {
      const { data, error } = await supabase.storage.getBucket('products');
      if (error) {
        console.warn('Storage bucket "products" not found or inaccessible:', error.message);
        // No alert here to avoid annoying the user on every load if they are just browsing, 
        // but it will be checked again during upload.
      }
    } catch (err) {
      console.error('Error checking storage:', err);
    }
  };

  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    if (data) {
      setProductsData(data.map(p => ({
        id: p.id,
        sku: p.sku || 'N/A',
        name: p.name,
        brand: p.brand || '',
        cat: p.category_key,
        subCat: p.sub_category,
        price: p.price,
        old_price: p.old_price,
        badge: p.badge,
        stock: p.stock,
        visible: p.visible,
        image_url: p.image_url,
        images: p.images || [],
        description: p.description || (p.specs && typeof p.specs === 'object' && !Array.isArray(p.specs) ? p.specs.description : '') || '',
        specs: p.specs ? Object.entries(p.specs)
          .filter(([key]) => key !== 'description')
          .map(([key, value]) => ({ key, value: String(value) })) : []
      })));
    }
  };

  const handleAddSpec = (isEditing: boolean) => {
    const setter = isEditing ? setEditingProduct : setNewProduct;
    setter((prev: any) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', value: string, isEditing: boolean) => {
    const setter = isEditing ? setEditingProduct : setNewProduct;
    setter((prev: any) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const handleRemoveSpec = (index: number, isEditing: boolean) => {
    const setter = isEditing ? setEditingProduct : setNewProduct;
    setter((prev: any) => ({
      ...prev,
      specs: prev.specs.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleUploadImage = async (file: File, target: 'main' | 'additional') => {
    if (file) {
      const url = await uploadFile(file, setIsUploading);
      if (url) {
        if (target === 'main') {
          setEditingProduct((prev: any) => ({ ...prev, image_url: url }));
        } else {
          setEditingProduct((prev: any) => ({
            ...prev,
            images: [...(prev.images || []), url]
          }));
        }
      }
    }
  };

  const handleMigrateCatalog = async () => {
    if (!window.confirm("¿Seguro que deseas migrar los datos estáticos a Supabase? (Puede demorar unos segundos)")) return;

    // Convertir el JSON estático en registros para Supabase
    let allProducts: any[] = [];
    Object.entries(categoryData).forEach(([key, items]) => {
      // Ignorar categorías que son "filtros" virtuales agregando duplicados
      if (['laptop', 'monitor', 'peripherals'].includes(key)) return;

      items.forEach((item: any) => {
        // Evitar duplicados por ID
        if (!allProducts.some(p => p.sku === `SKU-${item.id}`)) {
          const { id, name, price, oldPrice, stock, visible, image, images, brand, badge, cat, subCat, tags, ...specs } = item;
          allProducts.push({
            sku: `SKU-${id}`,
            name: name,
            category_key: key,
            sub_category: subCat || '',
            price: typeof price === 'number' ? price : 0,
            old_price: typeof oldPrice === 'number' ? oldPrice : null,
            stock: stock === 'EN STOCK' ? 50 : (typeof stock === 'number' ? stock : 0),
            visible: visible !== false,
            brand: brand || 'Genérico',
            badge: badge || null,
            image_url: image || '',
            images: images || [],
            tags: tags || [],
            specs: specs || {}
          });
        }
      });
    });

    const { error } = await supabase.from('products').upsert(allProducts, { onConflict: 'sku' });
    if (error) {
      alert(`Error al migrar: ${error.message}`);
    } else {
      alert(`¡Migración completada exitosamente! Se actualizaron ${allProducts.length} productos con las nuevas imágenes.`);
      fetchProducts();
    }
  };

  const filteredProducts = productsData.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      p.cat.toLowerCase().includes(inventorySearch.toLowerCase()) ||
      (p.subCat && p.subCat.toLowerCase().includes(inventorySearch.toLowerCase()));

    const matchesCategory = inventoryCategory === 'Todas las Categorías' || p.cat === inventoryCategory;

    const matchesSubCategory = inventorySubCategory === 'Todas las Subcategorías' || p.subCat === inventorySubCategory;

    const matchesStatus = inventoryStatus === 'Estado: Todos' ||
      (inventoryStatus === 'En Stock' && p.stock >= 50) ||
      (inventoryStatus === 'Bajo Stock' && p.stock > 0 && p.stock < 50) ||
      (inventoryStatus === 'Agotado' && p.stock === 0);

    return matchesSearch && matchesCategory && matchesSubCategory && matchesStatus;
  });

  const handleExportCSV = () => {
    const headers = ['ID', 'SKU', 'Nombre', 'Categoría', 'Subcategoría', 'Precio', 'Stock', 'Visible'];
    const csvContent = [
      headers.join(','),
      ...productsData.map(p => [p.id, p.sku, `"${p.name}"`, p.cat, p.subCat, `"${p.price}"`, p.stock, p.visible].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'inventario_techmarket.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split('\n');
        const newProducts = lines.slice(1).filter(line => line.trim()).map((line, index) => {
          const [sku, name, cat, subCat, price, stock] = line.split(',');
          return {
            id: productsData.length + index + 1,
            sku: sku || `IMPORT-${Date.now()}-${index}`,
            name: name || 'Producto Importado',
            cat: cat || 'COMPONENTES',
            subCat: subCat || 'Procesadores',
            price: price || 'S/ 0.00',
            stock: parseInt(stock) || 0,
            image: 'https://picsum.photos/seed/import/400/400',
            visible: true
          };
        });

        setProductsData([...productsData, ...newProducts]);
        alert(`${newProducts.length} productos importados con éxito.`);
      };
      reader.readAsText(file);
    }
  };

  const [bannersData, setBannersData] = useState([
    { 
      id: '#B-2024-001', 
      title: 'Crea tu PC Ideal con IA', 
      subtitle: 'Banner Principal - Portada', 
      img: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1920&h=1080', 
      active: true, 
      description: 'Banner principal de la sección Hero. Promociona el constructor de PC inteligente y la compatibilidad de componentes.', 
      redirectUrl: 'home', 
      expiryDate: '2025-12-31', 
      priority: 10, 
      clicks: 45200, 
      ctr: 8.5 
    },
    { 
      id: '#B-2024-002', 
      title: 'Laptops Gaming PRO', 
      subtitle: 'Nueva Generación RTX 40', 
      img: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?auto=format&fit=crop&q=80&w=1920&h=1080', 
      active: true, 
      description: 'Descubre la potencia portátil con las últimas GPUs Ada Lovelace. Perfectas para streaming y competitivo.', 
      redirectUrl: 'catalog/laptop', 
      expiryDate: '2024-12-31', 
      priority: 8, 
      clicks: 12450, 
      ctr: 4.2 
    },
    { 
      id: '#B-2024-003', 
      title: 'Hardware de Elite', 
      subtitle: 'Componentes de Alto Rendimiento', 
      img: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=1920&h=1080', 
      active: true, 
      description: 'Renueva tu setup con las mejores placas, procesadores y tarjetas de video del mercado con garantía total.', 
      redirectUrl: 'catalog/gpu', 
      expiryDate: '2025-06-30', 
      priority: 7, 
      clicks: 8900, 
      ctr: 5.1 
    },
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
            <button
              onClick={() => setDashboardDays(7)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${dashboardDays === 7 ? 'text-white bg-primary/20' : 'text-slate-500 hover:text-white'
                }`}
            >
              7 Días
            </button>
            <button
              onClick={() => setDashboardDays(40)}
              className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-lg ${dashboardDays === 40 ? 'text-white bg-primary/20' : 'text-slate-500 hover:text-white'
                }`}
            >
              40 Días
            </button>
          </div>
        </div>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={currentSalesData}>
              <defs>
                <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0f5af0" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0f5af0" stopOpacity={0} />
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
          <button
            onClick={handleMigrateCatalog}
            className="flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-emerald-500/20 transition-all"
          >
            <Upload className="w-4 h-4" /> Sync a Supabase
          </button>
          <button
            onClick={() => setIsAddingProduct(true)}
            className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30"
          >
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
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              className="w-full bg-black/20 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          <select
            value={inventoryCategory}
            onChange={(e) => {
              setInventoryCategory(e.target.value);
              setInventorySubCategory('Todas las Subcategorías');
            }}
            className="bg-[#1a1f26] border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none min-w-[200px]"
          >
            <option value="Todas las Categorías" className="bg-[#151921] text-white">Todas las Categorías</option>
            {Object.keys(CATEGORIES_DATA).map(cat => (
              <option key={cat} value={cat} className="bg-[#151921] text-white">{cat}</option>
            ))}
          </select>
          {inventoryCategory !== 'Todas las Categorías' && (
            <select
              value={inventorySubCategory}
              onChange={(e) => setInventorySubCategory(e.target.value)}
              className="bg-[#1a1f26] border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none min-w-[200px]"
            >
              <option value="Todas las Subcategorías" className="bg-[#151921] text-white">Todas las Subcategorías</option>
              {CATEGORIES_DATA[inventoryCategory as keyof typeof CATEGORIES_DATA].map(sub => (
                <option key={sub} value={sub} className="bg-[#151921] text-white">{sub}</option>
              ))}
            </select>
          )}
          <select
            value={inventoryStatus}
            onChange={(e) => setInventoryStatus(e.target.value)}
            className="bg-[#1a1f26] border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none min-w-[150px]"
          >
            <option value="Estado: Todos" className="bg-[#151921] text-white">Estado: Todos</option>
            <option value="En Stock" className="bg-[#151921] text-white">En Stock</option>
            <option value="Bajo Stock" className="bg-[#151921] text-white">Bajo Stock</option>
            <option value="Agotado" className="bg-[#151921] text-white">Agotado</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">IMG</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">MARCA</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">NOMBRE DEL PRODUCTO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">CATEGORÍA / SUBCATEGORÍA</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">PRECIO</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">STOCK</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest">VISIBLE</th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-500 uppercase tracking-widest text-right">ACCIONES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-white/2 transition-colors group">
                  <td className="px-6 py-6">
                    <div className="w-12 h-12 rounded-xl bg-black/40 p-2">
                      <img src={`https://picsum.photos/seed/${p.id + 300}/100/100`} alt="" className="w-full h-full object-contain" />
                    </div>
                  </td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-500">{p.sku}</td>
                  <td className="px-6 py-6 text-xs font-bold text-slate-400 uppercase">{p.brand || '---'}</td>
                  <td className="px-6 py-6 text-sm font-bold text-white">{p.name}</td>
                  <td className="px-6 py-6">
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black bg-blue-500/20 text-blue-400 px-3 py-1 rounded-lg uppercase tracking-widest w-fit">
                        {p.cat}
                      </span>
                      {p.subCat && (
                        <span className="text-[9px] font-bold text-slate-400 px-3 py-0.5 rounded-md border border-white/5 w-fit">
                          {p.subCat}
                        </span>
                      )}
                      {p.badge && (
                        <div className="flex items-center gap-1.5 mt-1">
                          <span className="text-[8px] font-black bg-primary text-white px-2 py-0.5 rounded uppercase tracking-widest flex items-center gap-1">
                            <Zap className="w-2 h-2 fill-white" /> OFERTA
                          </span>
                          <span className="text-[8px] font-black bg-blue-500 text-white px-2 py-0.5 rounded uppercase tracking-widest">
                            -{p.badge}
                          </span>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-6 font-bold">
                    {p.old_price ? (
                      <div className="space-y-0.5">
                        <p className="text-[10px] text-slate-500 line-through">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(p.old_price))}</p>
                        <p className="text-sm font-black text-blue-400">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(p.price))}</p>
                      </div>
                    ) : (
                      <span className="text-sm font-black text-white">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(Number(p.price))}</span>
                    )}
                  </td>
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
                    <button
                      onClick={async () => {
                        const { error } = await supabase
                          .from('products')
                          .update({ visible: !p.visible })
                          .eq('id', p.id);
                        
                        if (error) {
                          alert(`Error al actualizar visibilidad: ${error.message}`);
                        } else {
                          fetchProducts();
                        }
                      }}
                      className={`w-12 h-6 rounded-full transition-all relative ${p.visible ? 'bg-primary' : 'bg-slate-800'}`}
                    >
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
                      <button
                        onClick={async () => {
                          if (window.confirm('¿Estás seguro de eliminar este producto?')) {
                            const { error } = await supabase
                              .from('products')
                              .delete()
                              .eq('id', p.id);
                            
                            if (error) {
                              alert(`Error al eliminar: ${error.message}`);
                            } else {
                              fetchProducts();
                            }
                          }
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-rose-700 transition-all"
                      >
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
          <p className="text-xs font-bold text-slate-500">Mostrando {filteredProducts.length} de {productsData.length} productos</p>
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
                className={`px-6 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${tab === orderFilter ? 'bg-primary text-white' : 'text-slate-500 hover:text-white'
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
              {filteredOrders.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage).map((order) => (
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
          <p className="text-xs font-bold text-slate-500">Mostrando {Math.min(itemsPerPage, filteredOrders.length - (currentPage - 1) * itemsPerPage)} de {filteredOrders.length} resultados</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(filteredOrders.length / itemsPerPage) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${i + 1 === currentPage ? 'bg-primary text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredOrders.length / itemsPerPage), prev + 1))}
              disabled={currentPage === Math.ceil(filteredOrders.length / itemsPerPage)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white disabled:opacity-50"
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
                    <span className={`text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest ${c.status === 'VIP' ? 'bg-amber-500/10 text-amber-500' :
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

  const renderOffers = () => {
    return (
      <div className="space-y-8">
        {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black text-white uppercase tracking-tighter">Gestión de Ofertas</h2>
          <p className="text-slate-500 text-sm mt-2 font-bold uppercase tracking-widest">Administra promociones activas y campañas de cupones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setEditingOffer({ 
              name: '', discount: '', code: '', 
              startDate: new Date().toISOString().split('T')[0], 
              startTime: '00:00',
              endDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
              endTime: '23:59',
              usage: 0, total: 100, status: 'Programado', icon: <Tag className="w-4 h-4 text-primary" />,
              _originalCode: null
            })}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30"
          >
            <Plus className="w-4 h-4" /> Crear Nueva Oferta
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ofertas Activas', value: activeOffersCount.toString(), badge: 'En curso', badgeColor: 'text-emerald-500 bg-emerald-500/10' },
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
                <th className="px-8 py-6 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {dynamicOffers.slice((offersPage - 1) * itemsPerPage, offersPage * itemsPerPage).map((campaign, i) => (
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
                        ></div
                      ></div>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${
                      campaign.status === 'Activo' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-slate-500/10 text-slate-500'
                    }`}>
                      {campaign.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <div className="flex justify-end items-center gap-3">
                      {campaign.status !== 'Finalizado' && (
                        <button
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de que deseas detener esta campaña de inmediato?')) {
                              const pastTime = new Date(Date.now() - 60000); // 1 minuto en el pasado
                              const stoppedOffer = {
                                ...campaign,
                                endDate: pastTime.toISOString().split('T')[0],
                                endTime: pastTime.toTimeString().substring(0, 5)
                              };
                              setOffersData(prev => prev.map(o => o.code === campaign.code ? stoppedOffer : o));
                            }
                          }}
                          className="p-2 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-lg transition-colors"
                          title="Detener Campaña"
                        >
                          <Ban className="w-4 h-4" />
                        </button>
                      )}
                      <button
                        onClick={() => setEditingOffer({ ...campaign, _originalCode: campaign.code })}
                        className="p-2 text-slate-400 hover:text-white transition-colors cursor-pointer"
                        title="Editar"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-8 border-t border-white/5 flex items-center justify-between">
          <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Mostrando {Math.min(itemsPerPage, dynamicOffers.length - (offersPage - 1) * itemsPerPage)} de {dynamicOffers.length} ofertas</p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOffersPage(prev => Math.max(1, prev - 1))}
              disabled={offersPage === 1}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.ceil(dynamicOffers.length / itemsPerPage) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setOffersPage(i + 1)}
                  className={`w-8 h-8 rounded-lg text-[10px] font-black transition-all ${i + 1 === offersPage ? 'bg-primary text-white' : 'text-slate-500 hover:bg-white/5 hover:text-white'
                    }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setOffersPage(prev => Math.min(Math.ceil(dynamicOffers.length / itemsPerPage), prev + 1))}
              disabled={offersPage === Math.ceil(dynamicOffers.length / itemsPerPage)}
              className="p-2 bg-white/5 border border-white/10 rounded-lg text-slate-500 hover:text-white disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

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
                <select
                  value={editingBanner?.active ? 'Activo' : 'Pausado'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, active: e.target.value === 'Activo' })}
                  className="w-full bg-[#1a1f26] border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                >
                  <option value="Activo" className="bg-[#151921] text-white">Activo</option>
                  <option value="Pausado" className="bg-[#151921] text-white">Pausado</option>
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
                  value={editingBanner?.priority}
                  onChange={(e) => setEditingBanner({ ...editingBanner, priority: parseInt(e.target.value) })}
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
            <select className="bg-[#1a1f26] border border-white/10 rounded-xl px-4 py-2 text-[10px] font-black text-white uppercase tracking-widest outline-none">
              <option className="bg-[#151921] text-white">Todos los Estados</option>
              <option className="bg-[#151921] text-white">Pendiente</option>
              <option className="bg-[#151921] text-white">Aprobado</option>
              <option className="bg-[#151921] text-white">Rechazado</option>
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
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${req.plan === 'enterprise' ? 'bg-amber-500/10 text-amber-500' :
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
                    <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${req.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-500' :
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

  const renderEditOffer = () => (
    <div className="space-y-8">
      <div className="flex items-center gap-4">
        <button
          onClick={() => setEditingOffer(null)}
          className="p-2 bg-white/5 border border-white/10 rounded-xl text-slate-400 hover:text-white transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-3xl font-black text-white uppercase tracking-tighter">
            {editingOffer?.name ? 'Editar Oferta' : 'Lanzar Nueva Oferta'}
          </h2>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">
            Configura los detalles de la promoción
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                <Tag className="w-5 h-5" />
              </div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Detalles de la Campaña</h3>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de la Campaña</label>
                <input
                  type="text"
                  value={editingOffer?.name}
                  onChange={e => setEditingOffer({...editingOffer, name: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: Black Friday"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Código de Cupón</label>
                <input
                  type="text"
                  value={editingOffer?.code}
                  onChange={e => setEditingOffer({...editingOffer, code: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all uppercase"
                  placeholder="Ej: BF2024"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descuento (%)</label>
                <input
                  type="text"
                  value={editingOffer?.discount}
                  onChange={e => setEditingOffer({...editingOffer, discount: e.target.value})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: 20%"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Límite de Usos</label>
                <input
                  type="number"
                  value={editingOffer?.total}
                  onChange={e => setEditingOffer({...editingOffer, total: parseInt(e.target.value)})}
                  className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: 1000"
                />
              </div>
              <div className="space-y-4 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Inicio de Vigencia</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={editingOffer?.startDate || ''}
                        onChange={e => setEditingOffer({...editingOffer, startDate: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      <input
                        type="time"
                        value={editingOffer?.startTime || ''}
                        onChange={e => setEditingOffer({...editingOffer, startTime: e.target.value})}
                        className="w-[120px] bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Fin de Vigencia</label>
                    <div className="flex gap-2">
                      <input
                        type="date"
                        value={editingOffer?.endDate || ''}
                        onChange={e => setEditingOffer({...editingOffer, endDate: e.target.value})}
                        className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                      <input
                        type="time"
                        value={editingOffer?.endTime || ''}
                        onChange={e => setEditingOffer({...editingOffer, endTime: e.target.value})}
                        className="w-[120px] bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          <section className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight mb-4">Estado</h3>
            <div className="space-y-4">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Estado de Campaña</label>
              <div className="w-full bg-[#1a1f26] border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-primary appearance-none cursor-not-allowed">
                El estado se evalúa automáticamente al guardar según la hora y fecha actual vs el periodo de vigencia definido.
              </div>
            </div>
          </section>

          <section className="bg-black/20 border border-white/5 rounded-3xl p-8 space-y-6">
            <h4 className="text-[10px] font-black text-primary uppercase tracking-widest">Estadísticas</h4>
            <div className="space-y-2">
              <p className="text-3xl font-black text-white tracking-tighter">{editingOffer?.usage || 0}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cupones Redimidos</p>
            </div>
          </section>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4 pt-8 border-t border-white/5">
        <button
          onClick={() => setEditingOffer(null)}
          className="px-8 py-4 bg-white/5 border border-white/10 rounded-xl text-xs font-black text-white uppercase tracking-widest hover:bg-white/10 transition-all"
        >
          Cancelar
        </button>
        <button 
          onClick={() => {
            const startDateStr = editingOffer.startDate || new Date().toISOString().split('T')[0];
            const startTimeStr = editingOffer.startTime || '00:00';
            const endDateStr = editingOffer.endDate || new Date(Date.now() + 86400000).toISOString().split('T')[0];
            const endTimeStr = editingOffer.endTime || '23:59';
            
            const startDateTime = new Date(`${startDateStr}T${startTimeStr}`);
            const endDateTime = new Date(`${endDateStr}T${endTimeStr}`);
            const now = new Date();

            let computedStatus = 'Programado';
            if (now >= startDateTime && now <= endDateTime) {
              computedStatus = 'Activo';
            } else if (now > endDateTime) {
              computedStatus = 'Finalizado';
            }

            const formatter = new Intl.DateTimeFormat('es', { day: '2-digit', month: 'short' });
            const validityStr = `${formatter.format(startDateTime)} - ${formatter.format(endDateTime)}`;

            const finalOffer = {
              ...editingOffer,
              startDate: startDateStr,
              startTime: startTimeStr,
              endDate: endDateStr,
              endTime: endTimeStr,
              validity: validityStr,
              subValidity: computedStatus === 'Activo' ? 'Promoción en curso' : computedStatus === 'Programado' ? 'Próximamente' : 'Expirada',
              status: computedStatus
            };

            if (editingOffer._originalCode) {
              // Update existing offer
              setOffersData(prev => prev.map(o => o.code === editingOffer._originalCode ? finalOffer : o));
            } else {
              // It's a brand new offer
              setOffersData([...offersData, finalOffer]);
            }
            setEditingOffer(null);
          }}
          className="px-12 py-4 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30"
        >
          Guardar Oferta
        </button>
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
                  <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedReseller.plan === 'enterprise' ? 'bg-amber-500/10 text-amber-500' :
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
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${selectedReseller.status === 'Aprobado' ? 'bg-emerald-500/10 text-emerald-500' :
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
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${tenant.status === 'active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                      {tenant.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setEditingTenant(tenant)}
                        className="p-2 hover:bg-white/5 rounded-lg text-slate-400 hover:text-white transition-all"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onToggleTenantStatus?.(tenant.id)}
                        className={`p-2 hover:bg-white/5 rounded-lg transition-all ${tenant.status === 'active' ? 'text-slate-400 hover:text-rose-500' : 'text-rose-500 hover:text-emerald-500'
                          }`}
                        title={tenant.status === 'active' ? 'Suspender' : 'Activar'}
                      >
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

  const renderEditTenant = () => {
    if (!editingTenant) return null;

    return (
      <div className="space-y-8">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setEditingTenant(null)}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest"
          >
            <ArrowLeft className="w-4 h-4" /> Volver a Tenants
          </button>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                onUpdateTenant?.(editingTenant.id, editingTenant);
                setEditingTenant(null);
              }}
              className="flex items-center gap-2 px-8 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30"
            >
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Información de la Empresa</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Nombre de Empresa</label>
                  <input
                    type="text"
                    value={editingTenant.name}
                    onChange={(e) => setEditingTenant({ ...editingTenant, name: e.target.value })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subdominio</label>
                  <div className="flex items-center">
                    <span className="bg-black/40 border border-r-0 border-white/10 rounded-l-xl px-4 py-3 text-slate-500 font-bold">https://</span>
                    <input
                      type="text"
                      value={editingTenant.subdomain}
                      onChange={(e) => setEditingTenant({ ...editingTenant, subdomain: e.target.value })}
                      className="flex-1 bg-black/20 border border-white/10 rounded-r-xl px-4 py-3 text-white font-bold focus:border-primary transition-colors outline-none"
                    />
                    <span className="bg-black/40 border border-l-0 border-white/10 rounded-r-xl px-4 py-3 text-slate-500 font-bold">.techmarket.com</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisión (%)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingTenant.commissionRate * 100}
                    onChange={(e) => setEditingTenant({ ...editingTenant, commissionRate: parseFloat(e.target.value) / 100 })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-primary transition-colors outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Costo de Suscripción (S/)</label>
                  <input
                    type="number"
                    value={editingTenant.subscriptionFee}
                    onChange={(e) => setEditingTenant({ ...editingTenant, subscriptionFee: parseFloat(e.target.value) })}
                    className="w-full bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white font-bold focus:border-primary transition-colors outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-6">
              <h3 className="text-xl font-black text-white uppercase tracking-tight">Estado y Ventas</h3>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white/2 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${editingTenant.status === 'active' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                    <span className="text-sm font-bold text-white uppercase tracking-tight">
                      {editingTenant.status === 'active' ? 'Activo' : 'Suspendido'}
                    </span>
                  </div>
                  <button
                    onClick={() => setEditingTenant({ ...editingTenant, status: editingTenant.status === 'active' ? 'suspended' : 'active' })}
                    className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                  >
                    Cambiar
                  </button>
                </div>

                <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ventas Totales</p>
                  <p className="text-2xl font-black text-white tracking-tighter">S/ {editingTenant.sales.toLocaleString()}</p>
                </div>

                <div className="p-4 bg-white/2 rounded-2xl border border-white/5 space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Comisión Generada</p>
                  <p className="text-2xl font-black text-emerald-500 tracking-tighter">S/ {(editingTenant.sales * editingTenant.commissionRate).toLocaleString()}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/5">
                <button
                  onClick={() => {
                    if (window.confirm('¿Estás seguro de que deseas eliminar este tenant? Esta acción no se puede deshacer.')) {
                      onDeleteTenant?.(editingTenant.id);
                      setEditingTenant(null);
                    }
                  }}
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-rose-500/10 border border-rose-500/20 text-rose-500 rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-500/20 transition-all"
                >
                  <Trash2 className="w-4 h-4" /> Eliminar Tenant
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };


  const renderContent = () => {
    if (editingOffer) return renderEditOffer();
    if (editingBanner) return renderEditBanner();
    if (editingTenant) return renderEditTenant();
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
                setIsAddingProduct(false);
                setEditingBanner(null);
                setEditingOffer(null);
                setSelectedReseller(null);
              }}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all group relative overflow-hidden ${
                activeTab === item.id && !editingProduct && !editingBanner && !editingOffer && !selectedReseller
                  ? 'bg-primary text-white shadow-lg shadow-primary/20'
                  : 'text-slate-400 hover:bg-white/5 hover:text-white'
                }`}
            >
              <div className={`transition-transform group-hover:scale-110 ${activeTab === item.id && !editingProduct && !editingBanner && !editingOffer && !selectedReseller ? 'text-white' : 'text-slate-500 group-hover:text-primary'}`}>
                {item.icon}
              </div>
              <span className="font-bold text-sm tracking-tight">{item.label}</span>
              {activeTab === item.id && !editingProduct && !editingBanner && !editingOffer && !selectedReseller && (
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

      {/* Unified Administration Modals */}
      <ProductAdminModal 
        product={editingProduct}
        isOpen={!!editingProduct || isAddingProduct}
        onClose={() => { setEditingProduct(null); setIsAddingProduct(false); }}
        onSave={fetchProducts}
        activeOffers={activeOffers}
      />
    </div>
  );
}
