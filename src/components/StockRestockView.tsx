import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, ArrowLeft, Clock, Zap, ExternalLink } from 'lucide-react';

interface StockRestockViewProps {
  onNavigate: (view: any) => void;
}

export default function StockRestockView({ onNavigate }: StockRestockViewProps) {
  const restockedProducts = [
    {
      id: 407,
      name: "NVIDIA GeForce RTX 4070 Super 12GB",
      price: 3249,
      image: "/images/products/gpu.png",
      time: "Vuelto hoy",
      stock: "¡Solo quedan 2!",
      status: "STOCK DISPONIBLE"
    },
    {
      id: 102,
      name: "Procesador AMD Ryzen 7 7800X3D",
      price: 1850,
      image: "/images/products/cpu.png",
      time: "Hace 1 hora",
      stock: "15+ unidades disponibles",
      status: "STOCK DISPONIBLE"
    },
    {
      id: 301,
      name: "Memoria RAM Corsair Vengeance 32GB DDR5",
      price: 480,
      image: "/images/products/cpu.png",
      time: "Estimado: 2 días",
      stock: "En camino al almacén",
      status: "PRÓXIMAMENTE",
      isComingSoon: true
    }
  ];

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        
        <div className="bg-gradient-to-r from-blue-600/20 to-indigo-600/20 border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
          <div className="flex items-center gap-6 relative z-10">
            <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-primary/30 shrink-0">
              <img src="/images/products/peripherals.png" alt="Lisi" className="w-full h-full object-cover" />
            </div>
            <div className="space-y-2">
              <span className="bg-primary text-white text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Asistente Lisi</span>
              <h2 className="text-2xl font-black text-white leading-tight">
                El stock vuela rápido. <span className="text-primary">He reservado prioridad</span> para ti en estos componentes.
              </h2>
              <p className="text-slate-400 text-sm">Estos productos de tu lista de seguimiento acaban de ser repuestos.</p>
            </div>
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/10 blur-3xl rounded-full -mr-32 -mt-32"></div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Reposición de Stock</h1>
          <p className="text-slate-500 text-sm">Monitoreo en tiempo real</p>
        </div>

        <div className="space-y-4">
          {restockedProducts.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#151921] border border-white/5 rounded-2xl p-6 flex items-center gap-6 group hover:border-primary/30 transition-all"
            >
              <div className="w-24 h-24 bg-[#0B0E14] rounded-xl overflow-hidden shrink-0">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              </div>
              
              <div className="flex-1 space-y-2">
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${product.isComingSoon ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                    {product.status}
                  </span>
                  <span className="text-slate-500 text-[10px] flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {product.time}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-primary transition-colors">{product.name}</h3>
                <div className="flex items-center gap-4">
                  <p className="text-blue-500 font-black text-2xl tracking-tighter">S/ {product.price.toLocaleString()}</p>
                  <span className={`text-[10px] font-bold flex items-center gap-1 ${product.isComingSoon ? 'text-slate-500' : 'text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-full'}`}>
                    {!product.isComingSoon && <Zap className="w-3 h-3 fill-current" />}
                    {product.stock}
                  </span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                {product.isComingSoon ? (
                  <>
                    <button className="px-6 py-2 bg-slate-800 text-slate-400 rounded-xl text-xs font-black uppercase tracking-widest cursor-not-allowed">Agotado</button>
                    <button className="px-6 py-2 bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-amber-500 hover:text-white transition-all">Notificarme</button>
                  </>
                ) : (
                  <>
                    <button className="px-6 py-3 bg-primary text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 flex items-center gap-2">
                      <ShoppingBag className="w-4 h-4" /> Comprar Ahora
                    </button>
                    <button className="text-slate-500 hover:text-white text-[10px] font-bold uppercase tracking-widest text-center transition-colors">Ver detalles</button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
