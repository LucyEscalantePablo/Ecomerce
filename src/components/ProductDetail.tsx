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
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onToggleWishlist, isWishlisted }) => {
  const [activeImage, setActiveImage] = useState(product.image);

  // Mocking some data if missing
  const model = product.model || `GA402XY-${product.id}`;
  const sku = product.sku || `TM-${49000 + product.id}`;
  const description = product.description || `La ${product.name} es una de las más potentes del mundo. Con componentes de última generación, diseñada para creadores y gamers que no aceptan compromisos.`;
  const stockUnits = product.stockUnits || 5;
  
  const specs = [
    { icon: Cpu, label: 'PROCESADOR', value: product.specs?.split('•')[0] || 'AMD Ryzen 9 7940HS' },
    { icon: Monitor, label: 'GRÁFICOS', value: product.tags?.find((t: string) => t.includes('RTX') || t.includes('RX')) || 'RTX 4090 16GB VRAM' },
    { icon: Layers, label: 'MEMORIA RAM', value: product.capacity || '32GB DDR5 4800MHz' },
    { icon: HardDrive, label: 'ALMACENAMIENTO', value: product.interface || '1TB SSD NVMe Gen4' },
  ];

  const techSpecs = [
    { label: 'Pantalla', value: '14" QHD+ (2560 x 1600) 165Hz, 3ms, ROG Nebula Display' },
    { label: 'Sistema Operativo', value: 'Windows 11 Pro' },
    { label: 'Batería', value: '76WHrs, 4S1P, 4 celdas Li-ion' },
    { label: 'Conectividad', value: 'Wi-Fi 6E (802.11ax), Bluetooth 5.3' },
    { label: 'Puertos', value: '1x HDMI 2.1, 2x USB 3.2 Gen 2 Tipo-A, 1x USB 4 Tipo-C' },
    { label: 'Peso', value: '1.72 Kg (3.79 lbs)' },
  ];

  const galleryImages = product.images || [product.image, product.image, product.image, product.image];

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-12"
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
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.slice(0, 4).map((img: string, i: number) => (
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
              Modelo: <span className="text-slate-300">{model}</span> | SKU: <span className="text-slate-300">{sku}</span>
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
            <button className="flex-1 bg-primary hover:bg-primary/80 text-white h-16 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-3 transition-all shadow-xl shadow-primary/20">
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

          {/* Key Specs Grid */}
          <div className="grid grid-cols-2 gap-4">
            {specs.map((spec, i) => (
              <div key={i} className="bg-[#151921] rounded-2xl p-4 border border-white/5 flex items-start gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <spec.icon className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">{spec.label}</p>
                  <p className="text-xs font-bold text-white leading-tight">{spec.value}</p>
                </div>
              </div>
            ))}
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
