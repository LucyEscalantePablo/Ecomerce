import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShoppingCart, 
  Heart, 
  Cpu, 
  Monitor, 
  HardDrive, 
  Layers, 
  MessageSquare,
  Star,
  Share2
} from 'lucide-react';

interface ProductDetailProps {
  product: any;
  onBack: () => void;
  onToggleWishlist: (id: number) => void;
  isWishlisted: boolean;
  onAddToCart?: (product: any) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onToggleWishlist, isWishlisted, onAddToCart }) => {
  const [activeImage, setActiveImage] = useState(product.image_url || product.image);

  // Sync active image when product changes
  React.useEffect(() => {
    setActiveImage(product.image_url || product.image);
  }, [product.image_url, product.image]);

  // Mocking some data if missing
  const model = product.model || `GA402XY-${product.id}`;
  const sku = product.sku || `TM-${49000 + product.id}`;
  const description = product.description || `La ${product.name} es una de las más potentes del mundo. Con componentes de última generación, diseñada para creadores y gamers que no aceptan compromisos.`;
  const stockUnits = product.stock || 0;

  // Keys to exclude from the specs table (they are shown elsewhere)
  const EXCLUDED_SPEC_KEYS = ['description', 'name', 'image', 'image_url', 'stock', 'price', 'sku', 'id'];

  // Parse specs robustly: handles both {key: value} objects and [{key, value}] arrays
  const specEntries: { label: string; value: string }[] = (() => {
    let raw = product.specs;
    if (!raw) return [];

    // Log internally for safety
    console.log("Raw specs in ProductDetail:", raw);

    let parsed = raw;
    if (typeof raw === 'string') {
      try {
        parsed = JSON.parse(raw);
      } catch (e) {
        return [{ label: 'Especificación', value: raw }];
      }
    }

    // If it's an Array of {key, value} objects (from admin modal state mapped)
    if (Array.isArray(parsed)) {
      if (parsed.length > 0 && parsed[0].key !== undefined) {
        return parsed
          .filter((s: any) => s.key && !EXCLUDED_SPEC_KEYS.includes(s.key.toLowerCase()))
          .map((s: any) => ({ label: s.key, value: String(s.value || '') }));
      }
      // If it's an array of strings like ["Audio: Codec...", "Socket: AM4"]
      if (parsed.length > 0 && typeof parsed[0] === 'string') {
        return parsed.map((s: string, i: number) => ({ label: `Espec ${i+1}`, value: s }));
      }
      // If it's an array of arrays like [["Audio", "Codec..."]]
      if (parsed.length > 0 && Array.isArray(parsed[0])) {
        return parsed.map((s: any[]) => ({ label: String(s[0]), value: String(s[1] || '') }));
      }
      return [];
    }

    // If it's a Plain object {key: value} (from Supabase JSONB map)
    if (typeof parsed === 'object' && parsed !== null) {
      const entries = Object.entries(parsed)
        .filter(([key]) => !EXCLUDED_SPEC_KEYS.includes(key.toLowerCase()))
        .map(([key, val]) => ({ label: key, value: String(val) }));
      
      if (entries.length > 0) return entries;
    }

    // Last fallback: string representation of whatever it is
    return [{ label: 'Detalles', value: typeof parsed === 'object' ? JSON.stringify(parsed) : String(parsed) }];
  })();
  
  const getSpecValue = (keywords: string[]) => {
    // Check in product.specs object first
    const entry = specEntries.find(s => keywords.some(k => s.label.toLowerCase().includes(k.toLowerCase())));
    if (entry) return entry.value;
    
    // Check directly on product object (in case it was flattened)
    for (const key of Object.keys(product)) {
      if (keywords.some(k => key.toLowerCase() === k.toLowerCase())) {
        return String(product[key]);
      }
    }
    
    // Partial match on direct properties
    for (const key of Object.keys(product)) {
      if (keywords.some(k => key.toLowerCase().includes(k.toLowerCase()))) {
        if (typeof product[key] === 'string' || typeof product[key] === 'number') {
          if (EXCLUDED_SPEC_KEYS.some(ex => key.toLowerCase().includes(ex))) continue;
          return String(product[key]);
        }
      }
    }
    return null;
  };

  // Assign an icon to a spec based on its label keywords
  const getSpecIcon = (label: string) => {
    const l = label.toLowerCase();
    if (l.includes('procesador') || l.includes('cpu') || l.includes('socket') || l.includes('núcleos') || l.includes('nucleos')) return Cpu;
    if (l.includes('gráfico') || l.includes('gpu') || l.includes('video') || l.includes('chipset') || l.includes('vram')) return Monitor;
    if (l.includes('memoria') || l.includes('ram') || l.includes('memory')) return Layers;
    if (l.includes('almacen') || l.includes('disco') || l.includes('ssd') || l.includes('hdd') || l.includes('storage') || l.includes('capacidad')) return HardDrive;
    return Layers; // default
  };

  const techSpecs = specEntries.length > 0 ? specEntries : [
    { label: 'Pantalla', value: '14" QHD+ (2560 x 1600) 165Hz, 3ms, ROG Nebula Display' },
    { label: 'Sistema Operativo', value: 'Windows 11 Pro' },
    { label: 'Batería', value: '76WHrs, 4S1P, 4 celdas Li-ion' },
    { label: 'Conectividad', value: 'Wi-Fi 6E (802.11ax), Bluetooth 5.3' },
    { label: 'Puertos', value: '1x HDMI 2.1, 2x USB 3.2 Gen 2 Tipo-A, 1x USB 4 Tipo-C' },
    { label: 'Peso', value: '1.72 Kg (3.79 lbs)' },
  ];

  const galleryImages = [product.image, ...((product.images || []).filter((img: string) => img !== product.image))].slice(0, 4);

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12 pt-8"
    >
      {/* Back Button */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors group"
      >
        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
        <span className="text-sm font-bold uppercase tracking-widest">Volver al catálogo</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Left Column: Images */}
        <div className="space-y-6">
          <div className="bg-[#151921] rounded-3xl overflow-hidden border border-white/5 flex items-center justify-center aspect-video">
            <img 
              src={activeImage} 
              alt={product.name}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
          </div>
          <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
            {galleryImages.map((img: string, i: number) => (
              <div 
                key={i} 
                onClick={() => setActiveImage(img)}
                className={`bg-[#151921] rounded-2xl overflow-hidden border aspect-square flex items-center justify-center cursor-pointer transition-all ${
                  activeImage === img ? 'border-primary shadow-lg shadow-primary/20' : 'border-white/5 hover:border-white/20'
                }`}
              >
                <img 
                  src={img} 
                  alt={`${product.name} view ${i}`}
                  className={`w-full h-full object-cover transition-opacity ${
                    activeImage === img ? 'opacity-100' : 'opacity-50 hover:opacity-100'
                  }`}
                  referrerPolicy="no-referrer"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Info */}
        <div className="space-y-8">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="bg-primary/20 text-primary text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                {product.badge || 'NUEVO MODELO 2024'}
              </span>
              <div className="flex items-center gap-1 text-amber-500">
                {[1, 2, 3, 4, 5].map((s) => <Star key={s} className="w-3 h-3 fill-current" />)}
              </div>
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter leading-none">
              {product.name}
            </h2>
            <p className="text-slate-500 text-sm font-medium">
              Marca: <span className="text-primary font-black uppercase tracking-widest">{product.brand || 'Premium'}</span> | Modelo: <span className="text-slate-300">{model}</span> | SKU: <span className="text-slate-300">{sku}</span>
            </p>
          </div>

          <div className="flex items-center justify-between py-6 border-y border-white/5">
            <div className="space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Precio de oferta</p>
              <p className="text-4xl font-black text-blue-500 tracking-tighter">
                S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(product.price)}
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Disponibilidad</p>
              <div className="flex items-center justify-end gap-2 text-emerald-500 font-bold">
                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span>En stock: {stockUnits} unidades</span>
              </div>
            </div>
          </div>

          <p className="text-slate-400 leading-relaxed">
            {description}
          </p>

          <div className="flex gap-4">
            <button 
              onClick={() => onAddToCart?.(product)}
              className="flex-1 bg-primary hover:bg-primary/80 text-white h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20"
            >
              <ShoppingCart className="w-6 h-6" />
              Añadir al carrito
            </button>
            <div className="flex gap-2">
              <button 
                onClick={() => onToggleWishlist(product.id)}
                className={`w-16 h-16 rounded-2xl border flex items-center justify-center transition-all ${
                  isWishlisted ? 'bg-rose-500 border-rose-500 text-white' : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
                }`}
              >
                <Heart className={`w-6 h-6 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
              <button 
                className="w-16 h-16 rounded-2xl border bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20 flex items-center justify-center transition-all"
                title="Compartir"
              >
                <Share2 className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* AI Assistant Banner */}
          <div className="bg-blue-500/5 rounded-2xl p-6 border border-blue-500/10 flex items-start gap-4">
            <div className="w-10 h-10 bg-blue-500/20 rounded-xl flex items-center justify-center text-blue-500 shrink-0">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">PREGÚNTALE A LISI - ASISTENTE IA</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                ¿Tienes dudas sobre la compatibilidad o rendimiento de este equipo? Estoy aquí para ayudarte.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Technical Specs Table */}
      <div className="space-y-8 pt-12 border-t border-white/5">
        <div className="flex items-center gap-3 text-white">
          <Layers className="w-6 h-6 text-primary" />
          <h3 className="text-2xl font-black tracking-tighter uppercase">Especificaciones Técnicas</h3>
        </div>
        
        <div className="bg-[#151921] rounded-3xl overflow-hidden border border-white/5">
          {techSpecs.map((spec, i) => (
            <div key={i} className={`grid grid-cols-[250px_1fr] p-6 ${i !== techSpecs.length - 1 ? 'border-b border-white/5' : ''} hover:bg-white/5 transition-colors`}>
              <span className="text-xs font-black text-slate-500 uppercase tracking-widest">{spec.label}</span>
              <span className="text-xs font-bold text-white">{spec.value}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetail;
