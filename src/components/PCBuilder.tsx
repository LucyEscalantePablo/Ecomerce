import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  LayoutGrid, 
  MemoryStick as Memory, 
  Monitor, 
  HardDrive, 
  Check, 
  ChevronRight, 
  Info, 
  ShieldCheck, 
  Truck, 
  Save, 
  Plus,
  ArrowRight,
  Sparkles,
  Search,
  ChevronDown,
  X,
  Zap,
  Box,
  ShoppingCart,
  Share2,
  BarChart3,
  Heart,
  Filter,
  SlidersHorizontal,
  RotateCcw,
  List,
  Grid
} from 'lucide-react';

interface PCBuilderProps {
  onNavigate: (view: 'home' | 'catalog' | 'login' | 'register' | 'pc-builder') => void;
  initialStep?: number;
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

const steps = [
  { id: 'cpu', name: 'Procesadores', description: 'El corazón de tu equipo. Elige la potencia que necesitas para tus tareas y juegos.', icon: <Cpu className="w-5 h-5" /> },
  { id: 'motherboard', name: 'Placas Base', description: 'La base de todo. Asegúrate de que tenga todas las conexiones que requieres.', icon: <LayoutGrid className="w-5 h-5" /> },
  { id: 'ram', name: 'Memorias RAM', description: 'Velocidad y multitarea. Elige la capacidad ideal para un rendimiento fluido.', icon: <Memory className="w-5 h-5" /> },
  { id: 'gpu', name: 'Tarjetas de Video', description: 'Impulsa tu rendimiento con las últimas arquitecturas de gráficos. Filtrado inteligente para tu setup ideal.', icon: <Monitor className="w-5 h-5" /> },
  { id: 'storage', name: 'Almacenamiento', description: 'Espacio y velocidad. SSDs NVMe para cargas instantáneas.', icon: <HardDrive className="w-5 h-5" /> },
  { id: 'psu', name: 'Fuentes de Poder', description: 'Energía estable y eficiente para proteger tus componentes.', icon: <Zap className="w-5 h-5" /> },
  { id: 'case', name: 'Cases / Gabinetes', description: 'Estética y flujo de aire. El hogar de tu nueva build.', icon: <Box className="w-5 h-5" /> },
];

const categoryData: Record<string, any[]> = {
  cpu: [
    { id: 101, name: 'Intel Core i9-14900K', specs: '24 Núcleos / 32 Hilos • 6.0GHz', tags: ['LGA 1700', '125W TDP'], price: 2499.00, image: 'https://picsum.photos/seed/i9/300/300', badge: 'RECOMENDADO', brand: 'Intel', socket: 'LGA 1700', cores: '24', tdp: '125W', stock: 'EN STOCK' },
    { id: 102, name: 'AMD Ryzen 7 7800X3D', specs: '8 Núcleos / 16 Hilos • 3D Cache', tags: ['AM5', '120W TDP'], price: 1850.00, image: 'https://picsum.photos/seed/r7/300/300', brand: 'AMD', socket: 'AM5', cores: '8', tdp: '120W', stock: 'EN STOCK' },
    { id: 103, name: 'Intel Core i7-14700K', specs: '20 Núcleos / 28 Hilos • 5.6GHz', tags: ['LGA 1700', '125W TDP'], price: 1720.00, image: 'https://picsum.photos/seed/i7/300/300', brand: 'Intel', socket: 'LGA 1700', cores: '20', tdp: '125W', stock: 'EN STOCK' },
    { id: 104, name: 'AMD Ryzen 5 7600', specs: '6 Núcleos / 12 Hilos • Zen 4', tags: ['AM5', '65W TDP'], price: 940.00, image: 'https://picsum.photos/seed/r5/300/300', brand: 'AMD', socket: 'AM5', cores: '6', tdp: '65W', stock: 'EN STOCK' },
  ],
  motherboard: [
    { id: 201, name: 'ROG STRIX Z790-E GAMING WIFI II', specs: 'ATX • DDR5 • PCIe 5.0 • 18+1 Fases', tags: ['WIFI 7', '5x M.2 Slots'], price: 1890.00, image: 'https://picsum.photos/seed/mb1/300/300', badge: 'RECOMENDADO', stock: 'EN STOCK' },
    { id: 202, name: 'MSI MPG Z790 EDGE WIFI', specs: 'ATX • DDR5 • White Design • 16+1+1 Fases', tags: ['WIFI 6E', 'PCIe 5.0'], price: 1450.00, image: 'https://picsum.photos/seed/mb2/300/300', stock: 'EN STOCK' },
    { id: 203, name: 'TUF GAMING B760-PLUS WIFI', specs: 'ATX • DDR5 • Durabilidad Militar', tags: ['WIFI 6', 'Aura Sync'], price: 890.00, image: 'https://picsum.photos/seed/mb3/300/300', stock: 'EN STOCK' },
    { id: 204, name: 'PRIME Z790-P WIFI-CSM', specs: 'ATX • DDR5 • Enfocada en Productividad', tags: ['WIFI 6', 'Thunderbolt 4'], price: 1120.00, image: 'https://picsum.photos/seed/mb4/300/300', stock: 'EN STOCK' },
  ],
  ram: [
    { id: 301, name: 'Corsair Vengeance RGB 32GB (2x16GB)', specs: 'DDR5 6000MHz • CL30 • iCUE', tags: ['RGB', 'Intel XMP'], price: 580.00, image: 'https://picsum.photos/seed/ram1/300/300', badge: 'RECOMENDADO', type: 'DDR5', capacity: '32GB', stock: 'EN STOCK' },
    { id: 302, name: 'G.Skill Trident Z5 RGB 32GB', specs: 'DDR5 6400MHz • CL32 • High Performance', tags: ['RGB', 'AMD EXPO'], price: 620.00, image: 'https://picsum.photos/seed/ram2/300/300', type: 'DDR5', capacity: '32GB', stock: 'EN STOCK' },
  ],
  gpu: [
    { id: 401, name: 'ASUS ROG Strix RTX 4080 Super', specs: '16GB GDDR6X • Triple Fan • DLSS 3.5', tags: ['Ray Tracing', '4K Gaming'], price: 4890.00, oldPrice: '5,299', image: 'https://picsum.photos/seed/gpu1/300/300', badge: 'POPULAR', vram: '16GB', series: 'RTX 40 Series', stock: 'EN STOCK', brand: 'ASUS ROG Strix' },
    { id: 402, name: 'MSI RTX 4070 Ti Super Ventus', specs: '16GB GDDR6X • Dual Fan • Eficiente', tags: ['DLSS 3', '1440p Pro'], price: 3450.00, oldPrice: '3,800', image: 'https://picsum.photos/seed/gpu2/300/300', vram: '16GB', series: 'RTX 40 Series', stock: 'EN STOCK', brand: 'MSI Gaming X Slim' },
    { id: 403, name: 'GeForce RTX 4090 OC Edition 24GB', specs: '24GB GDDR6X • Extreme Performance', tags: ['4K Ultra', 'Ray Tracing'], price: 8499.00, oldPrice: '9,200', image: 'https://picsum.photos/seed/gpu3/300/300', badge: 'NUEVO', vram: '24GB', series: 'RTX 40 Series', stock: 'EN STOCK', brand: 'ASUS ROG Strix' },
    { id: 404, name: 'Radeon RX 7900 XTX 24GB', specs: '24GB GDDR6 • RDNA 3', tags: ['AMD', 'High VRAM'], price: 4790.00, image: 'https://picsum.photos/seed/gpu4/300/300', vram: '24GB', series: 'RX 7000 Series', stock: 'EN STOCK', brand: 'Sapphire Pulse' },
    { id: 405, name: 'GeForce RTX 4060 Ti Twin Edge', specs: '8GB GDDR6 • Compact', tags: ['1080p', 'Efficient'], price: 1950.00, image: 'https://picsum.photos/seed/gpu5/300/300', vram: '8GB', series: 'RTX 40 Series', stock: 'AGOTADO', brand: 'Zotac Gaming' },
    { id: 406, name: 'GeForce RTX 4070 Ti 12GB GDDR6X', specs: '12GB GDDR6X • Windforce Cooling', tags: ['1440p', 'Ray Tracing'], price: 3850.00, image: 'https://picsum.photos/seed/gpu6/300/300', badge: 'ULTIMAS UNIDADES', vram: '12GB', series: 'RTX 40 Series', stock: 'EN STOCK', brand: 'Gigabyte Windforce' },
    { id: 407, name: 'GeForce RTX 4060 8GB GDDR6', specs: '8GB GDDR6 • Compact Design', tags: ['1080p', 'Entry Level'], price: 1450.00, image: 'https://picsum.photos/seed/gpu7/300/300', vram: '8GB', series: 'RTX 40 Series', stock: 'EN STOCK', brand: 'EVGA XC Black' },
  ],
  storage: [
    { id: 501, name: 'Samsung 990 Pro 2TB', specs: 'NVMe M.2 PCIe 4.0 • 7450MB/s', tags: ['Gen 4', 'Heatsink'], price: 780.00, image: 'https://picsum.photos/seed/ssd1/300/300', badge: 'RECOMENDADO', type: 'SSD', interface: 'NVMe', stock: 'EN STOCK' },
    { id: 502, name: 'Crucial P3 Plus 1TB', specs: 'NVMe M.2 PCIe 4.0 • 5000MB/s', tags: ['Gen 4', 'Budget'], price: 320.00, image: 'https://picsum.photos/seed/ssd2/300/300', type: 'SSD', interface: 'NVMe', stock: 'EN STOCK' },
  ],
  psu: [
    { id: 601, name: 'Corsair RM850x 850W', specs: '80 Plus Gold • Full Modular • Silent', tags: ['Gold', 'Modular'], price: 590.00, image: 'https://picsum.photos/seed/psu1/300/300', badge: 'RECOMENDADO', stock: 'EN STOCK' },
    { id: 602, name: 'EVGA SuperNOVA 750 G6', specs: '80 Plus Gold • Compact Design', tags: ['Gold', 'Modular'], price: 480.00, image: 'https://picsum.photos/seed/psu2/300/300', stock: 'EN STOCK' },
  ],
  case: [
    { id: 701, name: 'Lian Li PC-O11 Dynamic', specs: 'Mid Tower • Dual Chamber • Tempered Glass', tags: ['E-ATX', 'Watercooling'], price: 720.00, image: 'https://picsum.photos/seed/case1/300/300', badge: 'RECOMENDADO', stock: 'EN STOCK' },
    { id: 702, name: 'NZXT H7 Flow', specs: 'Mid Tower • High Airflow • Minimalist', tags: ['ATX', 'Mesh'], price: 540.00, image: 'https://picsum.photos/seed/case2/300/300', stock: 'EN STOCK' },
  ],
};

const filterDefinitions: Record<string, any[]> = {
  cpu: [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['Intel', 'AMD'] },
    { id: 'socket', label: 'Socket', type: 'checkbox', options: ['LGA 1700', 'AM5', 'AM4'] },
    { id: 'cores', label: 'Núcleos', type: 'checkbox', options: ['6', '8', '12', '16', '20', '24'] },
    { id: 'frequency', label: 'Frecuencia', type: 'checkbox', options: ['4.0GHz+', '5.0GHz+', '6.0GHz+'] },
    { id: 'tdp', label: 'TDP', type: 'checkbox', options: ['65W', '105W', '120W', '125W'] },
  ],
  gpu: [
    { id: 'brand', label: 'Marca', type: 'checkbox', options: ['ASUS', 'MSI', 'Gigabyte', 'EVGA', 'Sapphire'] },
    { id: 'series', label: 'SERIE', type: 'checkbox', options: ['RTX 40 Series', 'RTX 30 Series', 'RX 7000 Series'] },
    { id: 'vram', label: 'VRAM (GB)', type: 'checkbox', options: ['8GB', '12GB', '16GB', '24GB'] },
    { id: 'bus', label: 'Ancho de Bus', type: 'checkbox', options: ['128-bit', '192-bit', '256-bit', '384-bit'] },
    { id: 'tdp', label: 'CONSUMO (TDP)', type: 'select', options: ['Cualquier consumo', 'Bajo (<200W)', 'Medio (200-300W)', 'Alto (>300W)'] },
  ],
  ram: [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['DDR4', 'DDR5'] },
    { id: 'capacity', label: 'Capacidad', type: 'checkbox', options: ['16GB', '32GB', '64GB'] },
    { id: 'speed', label: 'Velocidad', type: 'checkbox', options: ['3200MHz', '3600MHz', '5200MHz', '6000MHz', '6400MHz'] },
    { id: 'latency', label: 'Latencia', type: 'checkbox', options: ['CL16', 'CL18', 'CL30', 'CL32'] },
  ],
  storage: [
    { id: 'type', label: 'Tipo', type: 'checkbox', options: ['SSD', 'HDD'] },
    { id: 'interface', label: 'Interface', type: 'checkbox', options: ['NVMe', 'SATA'] },
    { id: 'capacity', label: 'Capacidad', type: 'checkbox', options: ['500GB', '1TB', '2TB', '4TB'] },
  ],
};

export default function PCBuilder({ onNavigate, initialStep, onProductClick, onAddToCart }: PCBuilderProps) {
  const [currentStep, setCurrentStep] = useState(initialStep ?? 0);
  const [selections, setSelections] = useState<Record<string, any>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Record<string, any>>({});
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [showFilters, setShowFilters] = useState(true);

  useEffect(() => {
    // Reset filters when step changes to avoid filtering out products with different properties
    setActiveFilters({});
    setPriceRange([0, 10000]);
  }, [currentStep]);

  useEffect(() => {
    if (initialStep !== undefined && initialStep >= 0 && initialStep < steps.length) {
      setCurrentStep(initialStep);
      setIsFinished(false);
    }
  }, [initialStep]);

  const currentStepId = steps[currentStep].id;
  const currentProducts = (categoryData[currentStepId] || []).filter(product => {
    // Basic filtering logic
    for (const [key, value] of Object.entries(activeFilters)) {
      if (Array.isArray(value) && value.length > 0) {
        const productValue = product[key];
        if (productValue === undefined || productValue === null) return false;
        
        const val = String(productValue).toLowerCase();
        const exists = value.some(opt => {
          const option = String(opt).toLowerCase();
          return val === option || val.includes(option) || option.includes(val);
        });
        if (!exists) return false;
      }
    }
    if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
    return true;
  });
  const selectedProduct = selections[currentStepId];

  const toggleFilter = (filterId: string, option: string) => {
    setActiveFilters(prev => {
      const current = prev[filterId] || [];
      const exists = current.some((o: string) => o.toLowerCase() === option.toLowerCase());
      
      const next = exists
        ? current.filter((o: string) => o.toLowerCase() !== option.toLowerCase())
        : [...current, option];
      return { ...prev, [filterId]: next };
    });
  };

  const clearFilters = () => {
    setActiveFilters({});
    setPriceRange([0, 10000]);
  };

  const handleSelectProduct = (product: any) => {
    const isDeselecting = selections[currentStepId]?.id === product.id;
    setSelections(prev => ({
      ...prev,
      [currentStepId]: isDeselecting ? null : product
    }));

    // If selecting (not deselecting), move to next step automatically after a short delay
    if (!isDeselecting) {
      setTimeout(() => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(prev => prev + 1);
        } else {
          setIsFinished(true);
        }
      }, 800);
    }
  };

  const canAdvance = !!selectedProduct;

  const handleNextStep = () => {
    if (canAdvance) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setIsFinished(true);
      }
    }
  };

  const handleStepClick = (index: number) => {
    // Solo permitir ir a pasos anteriores o al siguiente si el actual está seleccionado
    if (index < currentStep) {
      setCurrentStep(index);
    } else if (index === currentStep + 1 && canAdvance) {
      setCurrentStep(index);
    }
  };

  const handleAddAllToCart = () => {
    Object.values(selections).forEach(product => {
      if (product) {
        onAddToCart?.(product);
      }
    });
  };

  const totalAmount = Object.values(selections).reduce((acc, item: any) => acc + (item?.price || 0), 0);

  if (isFinished) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white py-12 px-4 md:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                <ShieldCheck className="w-3.5 h-3.5" /> ¡TODO COMPATIBLE!
              </div>
              <span className="text-slate-500 text-xs font-medium">Configuración Finalizada • 7 de 7 componentes</span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter mb-4">Tu PC Gamer está Lista</h1>
            <p className="text-slate-400 text-lg max-w-2xl leading-relaxed">
              Hemos verificado cada componente. Esta configuración ofrece un rendimiento excepcional en resolución 1440p y 4K.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-12">
            {/* Left Column - Component List */}
            <div className="space-y-6">
              <h2 className="text-xl font-black tracking-tight mb-6">Resumen de Componentes</h2>
              <div className="space-y-4 bg-[#151921]/50 rounded-3xl p-2 border border-white/5">
                {steps.map((step) => {
                  const item = selections[step.id];
                  return (
                    <div key={step.id} className="flex items-center gap-6 p-4 rounded-2xl hover:bg-white/5 transition-colors group">
                      <div className="w-16 h-16 bg-[#0B0E14] rounded-xl flex items-center justify-center p-2 shrink-0 border border-white/5">
                        <img 
                          src={item?.image || 'https://picsum.photos/seed/placeholder/100/100'} 
                          alt={item?.name}
                          className="w-full h-full object-contain"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{step.name}</p>
                        <h3 className="text-base font-bold text-white truncate mb-0.5">{item?.name}</h3>
                        <p className="text-xs text-slate-500 truncate">{item?.specs}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-lg font-black text-white">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format((item?.price || 0) as number)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column - Performance & Total */}
            <div className="space-y-8">
              {/* Assistant Box */}
              <div className="bg-primary/10 rounded-3xl p-8 border border-primary/20 relative overflow-hidden">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center text-primary">
                    <Sparkles className="w-6 h-6" />
                  </div>
                  <h3 className="text-primary text-sm font-black uppercase tracking-widest">Lis: Tu Asistente Experta</h3>
                </div>
                <p className="text-slate-300 text-sm leading-relaxed italic">
                  "¡Increíble elección! Has armado una verdadera bestia. Todos los componentes son 100% compatibles y están optimizados para trabajar en conjunto. ¡Disfruta de tu nueva build!"
                </p>
              </div>

              {/* Performance Chart */}
              <div className="bg-[#151921] rounded-3xl p-8 border border-white/5">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Rendimiento Estimado (1440p Ultra)</h3>
                  <BarChart3 className="w-5 h-5 text-primary" />
                </div>
                <div className="space-y-6">
                  {[
                    { name: 'Cyberpunk 2077', fps: 95, color: 'bg-primary' },
                    { name: 'Call of Duty: Warzone', fps: 185, color: 'bg-primary' },
                    { name: 'Valorant', fps: 450, color: 'bg-primary', suffix: '+' },
                    { name: 'Spider-Man 2', fps: 110, color: 'bg-primary' },
                    { name: 'Elden Ring', fps: 120, color: 'bg-primary' },
                  ].map((game) => (
                    <div key={game.name} className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span className="text-slate-400">{game.name}</span>
                        <span className="text-primary">{game.fps}{game.suffix || ''} FPS</span>
                      </div>
                      <div className="w-full bg-slate-800/50 h-1.5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min((game.fps / 450) * 100, 100)}%` }}
                          transition={{ duration: 1, delay: 0.5 }}
                          className={`${game.color} h-full rounded-full`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Investment Total */}
              <div className="bg-[#151921] rounded-3xl p-8 border border-white/5 space-y-8">
                <div className="text-center space-y-2">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">INVERSIÓN TOTAL</p>
                  <h2 className="text-4xl font-black text-primary tracking-tighter">
                    S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(totalAmount as number)}
                  </h2>
                  <p className="text-[10px] text-slate-500">Incluye IGV y armado profesional bonificado</p>
                </div>

                <div className="space-y-3">
                  <button 
                    onClick={handleAddAllToCart}
                    className="w-full py-5 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/30 group"
                  >
                    <ShoppingCart className="w-6 h-6 group-hover:scale-110 transition-transform" />
                    Agregar todo al carrito
                  </button>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/5">
                      <Save className="w-4 h-4" /> Guardar
                    </button>
                    <button className="py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-xs flex items-center justify-center gap-2 transition-all border border-white/5">
                      <Share2 className="w-4 h-4" /> Compartir
                    </button>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Garantía Extendida</p>
                      <p className="text-[9px] text-slate-500">3 años de garantía en todos los componentes y soporte técnico Lis 24/7.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <Truck className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Envío Express Gratis</p>
                      <p className="text-[9px] text-slate-500">Recíbelo en Lima Metropolitana en 48 horas, armado y testeado.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-white py-8">
      <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_320px] gap-8">
        
        {/* Left Sidebar - Configuración & Filtros */}
        <aside className="space-y-6">
          {/* Steps Navigation */}
          <div className="bg-[#151921] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-black uppercase tracking-widest text-slate-400">Configuración</h2>
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden p-2 bg-primary/10 text-primary rounded-lg"
              >
                <Filter className="w-4 h-4" />
              </button>
            </div>
            
            <div className="w-full bg-slate-800 h-1 rounded-full mb-6 overflow-hidden">
              <div 
                className="bg-primary h-full transition-all duration-500" 
                style={{ width: `${((currentStep + 1) / 7) * 100}%` }}
              />
            </div>

            <nav className="space-y-1.5">
              {steps.map((step, index) => {
                const isCompleted = !!selections[step.id];
                const isActive = currentStep === index;
                const isLocked = index > currentStep && !selections[steps[index-1]?.id];

                return (
                  <button
                    key={step.id}
                    disabled={isLocked}
                    onClick={() => handleStepClick(index)}
                    className={`w-full flex items-center gap-3 p-2.5 rounded-xl transition-all text-xs font-bold group ${
                      isActive 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : isLocked 
                          ? 'opacity-40 cursor-not-allowed' 
                          : 'text-slate-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className={`${isActive ? 'text-white' : isCompleted ? 'text-emerald-400' : 'text-slate-500'}`}>
                      {isCompleted && !isActive ? <Check className="w-4 h-4" /> : step.icon}
                    </div>
                    <span className="flex-1 text-left">{step.name}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Advanced Filters Sidebar */}
          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-[#151921] rounded-2xl border border-white/5 overflow-hidden"
              >
                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <SlidersHorizontal className="w-4 h-4 text-primary" />
                    <h3 className="text-xs font-black uppercase tracking-widest">Filtros Avanzados</h3>
                  </div>
                  <button 
                    onClick={clearFilters}
                    className="text-[10px] font-black text-primary uppercase hover:underline flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Limpiar
                  </button>
                </div>

                <div className="p-6 space-y-8 max-h-[600px] overflow-y-auto custom-scrollbar">
                  {/* Category Specific Filters */}
                  {filterDefinitions[currentStepId]?.map((filter) => (
                    <div key={filter.id} className="space-y-4">
                      <div className="flex items-center gap-2 text-blue-500">
                        <div className="w-4 h-4 rounded-sm border-2 border-current flex items-center justify-center">
                          <div className="w-1.5 h-1.5 bg-current rounded-full" />
                        </div>
                        <h4 className="text-[10px] font-black uppercase tracking-widest">{filter.label}</h4>
                      </div>
                      
                      {filter.type === 'checkbox' && (
                        <div className="grid grid-cols-2 gap-2">
                          {filter.options.map((option: string) => (
                            <button
                              key={option}
                              onClick={() => toggleFilter(filter.id, option)}
                              className={`flex items-center justify-between p-2.5 rounded-xl border text-[10px] font-bold transition-all ${
                                activeFilters[filter.id]?.includes(option)
                                  ? 'bg-primary/10 border-primary text-primary'
                                  : 'bg-slate-900/40 border-white/5 text-slate-400 hover:border-white/20'
                              }`}
                            >
                              <span>{option}</span>
                              {activeFilters[filter.id]?.includes(option) && <Check className="w-3 h-3" />}
                            </button>
                          ))}
                        </div>
                      )}

                      {filter.type === 'select' && (
                        <div className="relative">
                          <select className="w-full bg-[#1a1f26] border border-white/10 rounded-xl px-4 py-2.5 text-[10px] font-bold appearance-none pr-10 focus:ring-1 focus:ring-primary/40 outline-none cursor-pointer text-white">
                            {filter.options.map((opt: string) => (
                              <option key={opt} value={opt} className="bg-[#151921] text-white">{opt}</option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Price Range Filter */}
                  <div className="space-y-6">
                    <div className="flex items-center gap-2 text-blue-500">
                      <div className="w-4 h-4 rounded-sm border-2 border-current flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-current rounded-full" />
                      </div>
                      <h4 className="text-[10px] font-black uppercase tracking-widest">PRECIO (S/)</h4>
                    </div>
                    <div className="px-2 space-y-4">
                      <div className="relative h-6 flex items-center">
                        <input 
                          type="range" 
                          min="0" 
                          max="10000" 
                          step="50"
                          value={priceRange[0]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val <= priceRange[1]) {
                              setPriceRange([val, priceRange[1]]);
                            }
                          }}
                          className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer accent-primary z-20 pointer-events-auto"
                        />
                        <input 
                          type="range" 
                          min="0" 
                          max="10000" 
                          step="50"
                          value={priceRange[1]}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            if (val >= priceRange[0]) {
                              setPriceRange([priceRange[0], val]);
                            }
                          }}
                          className="absolute w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-primary z-10"
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        <span>S/ {priceRange[0]}</span>
                        <span>S/ {priceRange[1]}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Promo Banner */}
                <div className="p-6 bg-primary/10 border-t border-white/5">
                  <div className="bg-primary rounded-2xl p-4 relative overflow-hidden group cursor-pointer">
                    <div className="absolute -right-4 -bottom-4 opacity-20 group-hover:scale-110 transition-transform">
                      <Truck className="w-20 h-20 text-white" />
                    </div>
                    <p className="text-[8px] font-black text-white/70 uppercase tracking-widest mb-1">OFERTA DE TEMPORADA</p>
                    <h4 className="text-xs font-black text-white mb-3 leading-tight">Envío gratis en {steps[currentStep].name} gama alta</h4>
                    <button className="bg-white text-primary text-[8px] font-black px-3 py-1.5 rounded-lg uppercase tracking-widest hover:bg-white/90 transition-colors">
                      VER DETALLES
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </aside>

        {/* Main Content Area */}
        <main className="space-y-8">
          {/* Header Section */}
          <div className="space-y-4">
            <h1 className="text-4xl font-black tracking-tighter text-white">{steps[currentStep].name}</h1>
            <p className="text-slate-400 text-sm max-w-2xl leading-relaxed">
              {(steps[currentStep] as any).description}
            </p>
          </div>

          {/* Controls Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#151921]/50 p-4 rounded-2xl border border-white/5">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Ordenar por:</span>
                <div className="relative">
                  <select className="bg-transparent text-xs font-bold appearance-none pr-8 focus:outline-none cursor-pointer text-white">
                    <option className="bg-[#151921] text-white">Relevancia</option>
                    <option className="bg-[#151921] text-white">Precio: Menor a Mayor</option>
                    <option className="bg-[#151921] text-white">Precio: Mayor a Menor</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Mostrar:</span>
                <div className="relative">
                  <select className="bg-transparent text-xs font-bold appearance-none pr-8 focus:outline-none cursor-pointer text-white">
                    <option className="bg-[#151921] text-white">24 por página</option>
                    <option className="bg-[#151921] text-white">48 por página</option>
                    <option className="bg-[#151921] text-white">96 por página</option>
                  </select>
                  <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
                <Grid className="w-5 h-5" />
              </button>
              <button className="w-10 h-10 bg-white/5 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-colors">
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`relative bg-[#151921] rounded-3xl border transition-all group cursor-pointer overflow-hidden flex flex-col ${
                    selectedProduct?.id === product.id 
                      ? 'border-primary ring-1 ring-primary/50 shadow-2xl shadow-primary/10' 
                      : 'border-white/5 hover:border-white/20'
                  }`}
                  onClick={() => handleSelectProduct(product)}
                >
                  {/* Badges & Actions */}
                  <div className="absolute top-4 left-4 right-4 z-10 flex items-start justify-between">
                    <div className="flex flex-col gap-1.5">
                      {product.badge && (
                        <span className="bg-primary text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest shadow-lg shadow-primary/20">
                          {product.badge}
                        </span>
                      )}
                      {product.stock && (
                        <span className={`text-[8px] font-black px-2 py-1 rounded uppercase tracking-widest ${
                          product.stock === 'EN STOCK' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-slate-800 text-slate-500'
                        }`}>
                          {product.stock}
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddToCart?.(product);
                        }}
                        className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/40 hover:text-emerald-500 transition-colors"
                        title="Añadir al carrito"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          onProductClick?.(product);
                        }}
                        className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/40 hover:text-primary transition-colors"
                        title="Ver detalles"
                      >
                        <Info className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 bg-black/40 backdrop-blur-sm rounded-full flex items-center justify-center text-white/40 hover:text-rose-500 transition-colors"
                      >
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  <div className="relative aspect-square bg-[#0B0E14] overflow-hidden flex items-center justify-center">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    {selectedProduct?.id === product.id && (
                      <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[2px]">
                        <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40">
                          <Check className="w-7 h-7 text-white" />
                        </div>
                      </div>
                    )}
                    {product.stock === 'AGOTADO' && (
                      <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em] border border-white/20 px-4 py-2 rounded-lg">AGOTADO</span>
                      </div>
                    )}
                  </div>

                  <div className="p-5 space-y-4 flex-1 flex flex-col">
                    <div className="space-y-1">
                      <p className="text-[10px] font-medium text-slate-500 uppercase tracking-tight">{product.brand || 'Premium'}</p>
                      <h3 className="font-bold text-white text-sm leading-snug group-hover:text-primary transition-colors line-clamp-2">{product.name}</h3>
                    </div>

                    <div className="flex flex-wrap gap-1.5">
                      {product.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-slate-800/50 rounded text-[8px] font-bold text-slate-400 uppercase">
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-end justify-between pt-2">
                      <div className="space-y-1">
                        {product.oldPrice && <p className="text-[10px] text-slate-500 line-through">S/ {product.oldPrice}</p>}
                        <p className="text-blue-500 font-black text-xl tracking-tighter">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(product.price)}</p>
                      </div>
                      <button 
                        disabled={product.stock === 'AGOTADO'}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectProduct(product);
                        }}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          selectedProduct?.id === product.id
                            ? 'bg-primary text-white shadow-lg shadow-primary/20'
                            : 'text-slate-500 hover:text-white hover:bg-white/5'
                        } ${product.stock === 'AGOTADO' ? 'opacity-20 cursor-not-allowed' : ''}`}
                      >
                        {selectedProduct?.id === product.id ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-6 h-6 stroke-[1.5]" />}
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-4 bg-[#151921]/30 rounded-3xl border border-dashed border-white/10">
                <div className="w-16 h-16 bg-slate-800/50 rounded-2xl flex items-center justify-center text-slate-500">
                  <Search className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">No se encontraron productos</h3>
                  <p className="text-slate-500 text-sm max-w-xs mx-auto">Intenta ajustar los filtros o el rango de precio para ver más opciones.</p>
                </div>
                <button 
                  onClick={clearFilters}
                  className="px-6 py-2 bg-primary/10 text-primary rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/20 transition-all"
                >
                  Limpiar Filtros
                </button>
              </div>
            )}

            {/* "Ver más modelos" Card */}
            </div>

          {/* Pagination */}
          <div className="flex items-center justify-center gap-2 pt-12">
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5 rotate-180" />
            </button>
            {[1, 2, 3, '...', 10].map((page, i) => (
              <button 
                key={i}
                className={`w-10 h-10 rounded-xl text-xs font-bold transition-all ${
                  page === 1 ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'bg-white/5 text-slate-400 hover:bg-white/10'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </main>

        {/* Right Sidebar - Resumen de Build */}
        <aside className="space-y-6">
          <div className="bg-[#151921] rounded-2xl p-6 border border-white/5 sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">Resumen de Build</h2>
              <div className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded text-[8px] font-black text-emerald-500 uppercase">
                <ShieldCheck className="w-3 h-3" /> Compatible
              </div>
            </div>

            <div className="space-y-6 mb-8">
              <div>
                <div className="flex justify-between text-[10px] font-bold mb-2">
                  <span className="text-slate-500 uppercase tracking-wider">Estimado TDP:</span>
                  <span className="text-white">310W / 850W</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[35%]" />
                </div>
              </div>

              <div className="space-y-3">
                {steps.map(step => (
                  <SummaryItem 
                    key={step.id}
                    icon={step.icon} 
                    label={step.name} 
                    value={selections[step.id] ? selections[step.id].name : `Pendiente de selección...`} 
                    price={selections[step.id] ? `S/ ${new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(selections[step.id].price as number)}` : null}
                    active={!!selections[step.id]}
                    onRemove={() => {
                      setSelections(prev => {
                        const newSelections = { ...prev };
                        delete newSelections[step.id];
                        return newSelections;
                      });
                    }}
                  />
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/5 space-y-4">
              <div className="flex items-end justify-between">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Subtotal:</span>
                <span className="text-2xl font-black text-primary tracking-tighter">
                  S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(totalAmount as number)}
                </span>
              </div>

              <button 
                disabled={!canAdvance}
                onClick={handleNextStep}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg group ${
                  canAdvance 
                    ? 'bg-primary hover:bg-primary/90 text-white shadow-primary/30' 
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                {currentStep === steps.length - 1 ? 'Finalizar Build' : 'Siguiente Paso'}
                <ArrowRight className={`w-5 h-5 ${canAdvance ? 'group-hover:translate-x-1' : ''} transition-transform`} />
              </button>

              <button className="w-full py-3 bg-transparent hover:bg-white/5 text-slate-400 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border border-white/5">
                Guardar Borrador
              </button>
            </div>

            {/* Delivery Info */}
            <div className="mt-8 pt-6 border-t border-white/5">
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center text-primary shrink-0">
                  <Truck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest mb-1">Entrega Estimada</h4>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Completa tu ensamble hoy y recibe todo armado y testeado en 48h (Lima Metropolitana).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* Floating Chat Bubble */}
      <div className="fixed bottom-8 right-8 z-50">
        <button className="w-14 h-14 bg-primary rounded-full flex items-center justify-center shadow-2xl shadow-primary/40 hover:scale-110 transition-transform relative group">
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-400 border-4 border-[#0B0E14] rounded-full flex items-center justify-center text-[10px] font-black text-white">
            1
          </div>
          <div className="w-8 h-8 text-white">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              <circle cx="9" cy="9" r="1" fill="currentColor" />
              <circle cx="15" cy="9" r="1" fill="currentColor" />
            </svg>
          </div>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-4 top-1/2 -translate-y-1/2 bg-[#151921] border border-white/10 px-4 py-2 rounded-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            <p className="text-xs font-bold text-white">¿Necesitas ayuda con tu build?</p>
          </div>
        </button>
      </div>
    </div>
  );
}

function SummaryItem({ icon, label, value, price, active = false, onRemove }: any) {
  return (
    <div className={`flex items-center gap-4 p-3 rounded-xl border transition-all relative group/item ${
      active ? 'bg-primary/5 border-primary/20' : 'bg-slate-900/40 border-white/5'
    }`}>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
        active ? 'bg-primary text-white' : 'bg-slate-800 text-slate-500'
      }`}>
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[8px] font-black text-primary uppercase tracking-widest mb-0.5">{label}</p>
        <h4 className={`text-[10px] font-bold truncate ${active ? 'text-white' : 'text-slate-600 italic'}`}>
          {value}
        </h4>
        {price && <p className="text-[10px] font-black text-slate-400 mt-0.5">{price}</p>}
      </div>
      {active && onRemove && (
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className="absolute top-2 right-2 opacity-0 group-hover/item:opacity-100 transition-opacity p-1 hover:bg-white/10 rounded"
        >
          <X className="w-3 h-3 text-slate-500" />
        </button>
      )}
    </div>
  );
}
