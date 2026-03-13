import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Activity, Share2, Download, ShoppingCart, CheckCircle2, Lightbulb, ArrowLeft, BarChart3, Cpu, Zap, Plus, X, Search } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: string;
  image: string;
  category: string;
  specs: {
    vram: string;
    architecture: string;
    tdp: string;
    rayTracing: string;
  };
  performance: {
    cyberpunk: number;
    fortnite: number;
  };
  badge?: string;
}

const allAvailableProducts: Product[] = [
  {
    id: 1,
    name: "NVIDIA RTX 4080 Super",
    price: "4,599",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400",
    category: "HIGH-END PERFORMANCE",
    specs: { vram: "16GB GDDR6X", architecture: "Ada Lovelace", tdp: "320W", rayTracing: "80 (Gen 3)" },
    performance: { cyberpunk: 78, fortnite: 115 }
  },
  {
    id: 2,
    name: "AMD Radeon RX 7900 XTX",
    price: "4,299",
    image: "https://images.unsplash.com/photo-1591488320449-011701bb6704?auto=format&fit=crop&q=80&w=400&h=400",
    category: "RDNA 3 FLAGSHIP",
    badge: "MEJOR VALOR",
    specs: { vram: "24GB GDDR6", architecture: "RDNA 3.0", tdp: "355W", rayTracing: "96 (Gen 2)" },
    performance: { cyberpunk: 82, fortnite: 121 }
  },
  {
    id: 3,
    name: "NVIDIA RTX 4070 Ti Super",
    price: "3,450",
    image: "https://images.unsplash.com/photo-1555617766-c94804975da3?auto=format&fit=crop&q=80&w=400&h=400",
    category: "EFFICIENT POWER",
    specs: { vram: "16GB GDDR6X", architecture: "Ada Lovelace", tdp: "285W", rayTracing: "66 (Gen 3)" },
    performance: { cyberpunk: 61, fortnite: 94 }
  },
  {
    id: 4,
    name: "NVIDIA RTX 4090",
    price: "8,200",
    image: "https://images.unsplash.com/photo-1660481434479-3bc6d8a3ef3b?auto=format&fit=crop&q=80&w=400&h=400",
    category: "ULTIMATE PERFORMANCE",
    specs: { vram: "24GB GDDR6X", architecture: "Ada Lovelace", tdp: "450W", rayTracing: "128 (Gen 3)" },
    performance: { cyberpunk: 112, fortnite: 165 }
  },
  {
    id: 5,
    name: "AMD Radeon RX 7800 XT",
    price: "2,150",
    image: "https://images.unsplash.com/photo-1591489378430-ef2f4c626b35?auto=format&fit=crop&q=80&w=400&h=400",
    category: "MID-RANGE KING",
    specs: { vram: "16GB GDDR6", architecture: "RDNA 3.0", tdp: "263W", rayTracing: "60 (Gen 2)" },
    performance: { cyberpunk: 48, fortnite: 82 }
  },
  {
    id: 6,
    name: "NVIDIA RTX 4060 Ti",
    price: "1,750",
    image: "https://images.unsplash.com/photo-1610051709121-184340077491?auto=format&fit=crop&q=80&w=400&h=400",
    category: "ENTRY PERFORMANCE",
    specs: { vram: "8GB GDDR6", architecture: "Ada Lovelace", tdp: "160W", rayTracing: "34 (Gen 3)" },
    performance: { cyberpunk: 35, fortnite: 68 }
  }
];

interface ProductComparatorViewProps {
  onNavigate: (view: any) => void;
}

export default function ProductComparatorView({ onNavigate }: ProductComparatorViewProps) {
  const [selectedProducts, setSelectedProducts] = useState<Product[]>(allAvailableProducts.slice(0, 3));
  const [showSelector, setShowSelector] = useState<number | null>(null); // Index of slot being filled
  const [searchQuery, setSearchQuery] = useState('');

  const removeProduct = (id: number) => {
    setSelectedProducts(prev => prev.filter(p => p.id !== id));
  };

  const addProduct = (product: Product, slotIndex: number) => {
    const newSelected = [...selectedProducts];
    if (slotIndex < selectedProducts.length) {
      newSelected[slotIndex] = product;
    } else {
      newSelected.push(product);
    }
    setSelectedProducts(newSelected);
    setShowSelector(null);
    setSearchQuery('');
  };

  const filteredAvailable = allAvailableProducts.filter(p => 
    !selectedProducts.find(sp => sp.id === p.id) &&
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="py-12 space-y-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </button>
          <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Comparador Inteligente de GPUs</h1>
          <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">Selecciona hasta 3 productos para analizar su rendimiento y especificaciones.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Share2 className="w-4 h-4" /> Compartir
          </button>
          <button className="flex items-center gap-2 px-6 py-3 bg-white/5 border border-white/10 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-white/10 transition-all">
            <Download className="w-4 h-4" /> PDF
          </button>
        </div>
      </div>

      {/* Product Selection Slots */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[0, 1, 2].map((index) => {
          const product = selectedProducts[index];
          return (
            <div key={index} className="relative group">
              {product ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative bg-[#151921] border ${product.badge ? 'border-primary/50 ring-1 ring-primary/20' : 'border-white/5'} rounded-3xl p-6 space-y-6 overflow-hidden h-full flex flex-col`}
                >
                  <button 
                    onClick={() => removeProduct(product.id)}
                    className="absolute top-4 right-4 p-2 bg-slate-800/80 text-white rounded-xl z-20 hover:bg-rose-500 transition-colors shadow-lg border border-white/10"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-primary text-white text-[10px] font-black px-3 py-1 rounded-lg uppercase tracking-widest shadow-lg shadow-primary/30 z-10">
                      {product.badge}
                    </div>
                  )}
                  <div className="aspect-video rounded-2xl overflow-hidden bg-black/40">
                    <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="space-y-1 flex-1">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</p>
                    <h3 className="text-xl font-black text-white tracking-tight">{product.name}</h3>
                    <p className="text-2xl font-black text-white">S/ {product.price}</p>
                  </div>
                  <button 
                    onClick={() => setShowSelector(index)}
                    className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-white hover:bg-white/10 transition-all"
                  >
                    Cambiar Producto
                  </button>
                </motion.div>
              ) : (
                <button 
                  onClick={() => setShowSelector(index)}
                  className="w-full h-full min-h-[300px] bg-[#151921]/50 border-2 border-dashed border-white/10 rounded-3xl flex flex-col items-center justify-center gap-4 hover:border-primary/50 hover:bg-primary/5 transition-all group"
                >
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center text-slate-500 group-hover:text-primary group-hover:scale-110 transition-all">
                    <Plus className="w-8 h-8" />
                  </div>
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest group-hover:text-white">Añadir Producto</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Selector Modal */}
      <AnimatePresence>
        {showSelector !== null && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSelector(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-2xl bg-[#0B0E14] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-xl font-black text-white uppercase tracking-tight">Seleccionar GPU</h3>
                <button onClick={() => setShowSelector(null)} className="p-2 text-slate-500 hover:text-white transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 border-b border-white/5">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    autoFocus
                    type="text"
                    placeholder="Buscar por nombre o modelo..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  />
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar">
                {filteredAvailable.length > 0 ? (
                  filteredAvailable.map((product) => (
                    <button 
                      key={product.id}
                      onClick={() => addProduct(product, showSelector)}
                      className="w-full flex items-center gap-6 p-4 rounded-2xl bg-white/2 border border-white/5 hover:bg-white/5 hover:border-primary/30 transition-all group text-left"
                    >
                      <div className="w-20 h-20 rounded-xl overflow-hidden bg-black/40 shrink-0">
                        <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">{product.category}</p>
                        <h4 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{product.name}</h4>
                        <p className="text-sm font-black text-slate-400">S/ {product.price}</p>
                      </div>
                      <Plus className="w-6 h-6 text-slate-600 group-hover:text-primary transition-colors" />
                    </button>
                  ))
                ) : (
                  <div className="py-12 text-center space-y-4">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto text-slate-600">
                      <Search className="w-8 h-8" />
                    </div>
                    <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">No se encontraron productos disponibles</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {selectedProducts.length > 0 && (
        <>
          {/* Technical Specs Table */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <BarChart3 className="w-6 h-6 text-primary" /> Especificaciones Técnicas
            </h3>
            <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-x-auto no-scrollbar">
              <table className="w-full text-left border-collapse min-w-[600px]">
                <thead>
                  <tr className="text-[10px] font-black text-slate-500 uppercase tracking-widest border-b border-white/5">
                    <th className="px-8 py-6">Característica</th>
                    {selectedProducts.map(p => <th key={p.id} className="px-8 py-6">{p.name}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">VRAM</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className={`px-8 py-6 text-sm font-bold ${p.specs.vram.includes('24GB') ? 'text-primary' : 'text-white'}`}>
                        {p.specs.vram}
                      </td>
                    ))}
                  </tr>
                  <tr className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Arquitectura</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="px-8 py-6 text-sm font-bold text-white">
                        {p.specs.architecture}
                      </td>
                    ))}
                  </tr>
                  <tr className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">TDP (W)</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className={`px-8 py-6 text-sm font-bold ${parseInt(p.specs.tdp) < 300 ? 'text-emerald-500' : 'text-white'}`}>
                        {p.specs.tdp}
                      </td>
                    ))}
                  </tr>
                  <tr className="group hover:bg-white/2 transition-colors">
                    <td className="px-8 py-6 text-xs font-black text-slate-500 uppercase tracking-widest">Ray Tracing Cores</td>
                    {selectedProducts.map(p => (
                      <td key={p.id} className="px-8 py-6 text-sm font-bold text-white">
                        {p.specs.rayTracing}
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Gaming Performance */}
          <div className="space-y-6">
            <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
              <Zap className="w-6 h-6 text-primary" /> Rendimiento en Juegos (FPS)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <PerformanceCard title="Cyberpunk 2077" subtitle="4K Ultra / RT Off" products={selectedProducts} gameKey="cyberpunk" />
              <PerformanceCard title="Fortnite" subtitle="4K Epic / Nanite On" products={selectedProducts} gameKey="fortnite" />
            </div>
          </div>

          {/* AI Verdict */}
          <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative z-10 flex flex-col md:flex-row gap-8 items-start">
              <div className="shrink-0 flex flex-col items-start gap-4">
                <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-xl shadow-primary/30">
                  <Activity className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.2em]">Powered by</p>
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">Claude 3.5 Sonnet</p>
                </div>
              </div>
              <div className="space-y-6 flex-1">
                <h3 className="text-2xl font-black text-primary uppercase tracking-tight">Veredicto IA: Análisis Comparativo</h3>
                <p className="text-slate-300 leading-relaxed text-sm">
                  Tras analizar los {selectedProducts.length} productos seleccionados, nuestro algoritmo determina que la mejor opción depende de tus prioridades específicas.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" /> Líder en Rendimiento
                    </p>
                    <p className="text-[10px] font-bold text-slate-400">
                      {selectedProducts.sort((a, b) => b.performance.cyberpunk - a.performance.cyberpunk)[0].name} domina en potencia bruta.
                    </p>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" /> Recomendación IA
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 leading-relaxed">
                      Para un equilibrio perfecto, sugerimos el modelo con mejor eficiencia energética y soporte de drivers a largo plazo.
                    </p>
                  </div>
                </div>
                <button className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-sm font-black transition-all transform hover:scale-105 shadow-xl shadow-primary/30 uppercase tracking-widest">
                  Comprar Mejor Opción <ShoppingCart className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function PerformanceCard({ title, subtitle, products, gameKey }: { title: string, subtitle: string, products: Product[], gameKey: 'cyberpunk' | 'fortnite' }) {
  const maxFps = Math.max(...products.map(p => p.performance[gameKey]), 1);

  return (
    <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-lg font-black text-white uppercase tracking-tight">{title}</h4>
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{subtitle}</p>
        </div>
      </div>
      <div className="space-y-6">
        {products.map((product) => (
          <div key={product.id} className="space-y-2">
            <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest">
              <span className="text-slate-400">{product.name}</span>
              <span className="text-white">{product.performance[gameKey]} FPS</span>
            </div>
            <div className="h-2 bg-black/40 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${(product.performance[gameKey] / maxFps) * 100}%` }}
                className={`h-full rounded-full ${product.performance[gameKey] === maxFps ? 'bg-primary' : 'bg-slate-700'}`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
