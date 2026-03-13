import React from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, ArrowLeft, Clock, Trash2, Tag, Percent } from 'lucide-react';

interface CartRecoveryViewProps {
  onNavigate: (view: any) => void;
}

export default function CartRecoveryView({ onNavigate }: CartRecoveryViewProps) {
  const savedBuild = {
    name: "Gaming Ultra 2024",
    savedAt: "Hace 2 días",
    items: [
      { id: 101, name: "Intel Core i9-14900K", price: 2450, category: "PROCESADOR", stock: "En stock" },
      { id: 402, name: "NVIDIA RTX 4080 Super", price: 5499, category: "TARJETA GRÁFICA", stock: "Últimas unidades" },
      { id: 301, name: "Corsair Vengeance 32GB DDR5", price: 680, category: "MEMORIA RAM", stock: "En stock" }
    ]
  };

  const subtotal = savedBuild.items.reduce((acc, item) => acc + item.price, 0);
  const discountPercent = 15;
  const discountAmount = subtotal * (discountPercent / 100);
  const total = subtotal - discountAmount;

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </button>
        
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl p-8 relative overflow-hidden shadow-2xl shadow-blue-500/20">
          <div className="flex items-center gap-8 relative z-10">
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-2">
                <span className="bg-white text-blue-600 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wider">Asistente Lisi</span>
              </div>
              <h2 className="text-4xl font-black text-white leading-tight tracking-tighter italic">
                ¡No dejes tu PC a medias!
              </h2>
              <p className="text-blue-100 text-sm max-w-md">
                Hola Juan, he analizado tu configuración y todo es 100% compatible. Termina tu compra ahora y disfruta de un descuento especial por ser tú.
              </p>
              <div className="flex items-center gap-3 pt-2">
                <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
                  <span className="text-white/60 text-[10px] font-bold uppercase tracking-widest">Cupón de recuperación:</span>
                  <span className="text-white font-black text-xl tracking-widest">LISI15</span>
                </div>
              </div>
            </div>
            <div className="w-48 h-48 rounded-3xl overflow-hidden border-4 border-white/20 shrink-0 rotate-3 shadow-2xl">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=400&h=400" alt="Lisi" className="w-full h-full object-cover" />
            </div>
          </div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-3xl rounded-full -mr-48 -mt-48"></div>
          <div className="absolute bottom-4 right-4 flex items-center gap-2 text-white/40 text-[10px] font-bold uppercase tracking-widest">
            <Clock className="w-3 h-3" /> Expira en 23:54:12
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-black text-white uppercase tracking-tighter">Recuperación de Carrito</h1>
          <p className="text-slate-500 text-sm">Tu configuración guardada está lista para ser finalizada.</p>
        </div>

        <div className="bg-[#151921] border border-white/5 rounded-3xl overflow-hidden">
          <div className="p-6 border-bottom border-white/5 flex items-center justify-between bg-white/2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold">Build en Progreso: {savedBuild.name}</h3>
                <p className="text-slate-500 text-[10px] uppercase tracking-widest font-bold">Guardado {savedBuild.savedAt}</p>
              </div>
            </div>
            <button className="flex items-center gap-2 text-rose-500 hover:text-rose-400 transition-colors text-[10px] font-bold uppercase tracking-widest">
              <Trash2 className="w-4 h-4" /> Vaciar Carrito
            </button>
          </div>

          <div className="p-6 space-y-6">
            {savedBuild.items.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-[#0B0E14] rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img 
                      src={`https://picsum.photos/seed/${item.id}/200/200`} 
                      alt={item.name} 
                      className="w-full h-full object-cover opacity-50 group-hover:opacity-100 transition-opacity" 
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">{item.category}</p>
                    <h4 className="text-white font-bold group-hover:text-primary transition-colors">{item.name}</h4>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-lg tracking-tighter">S/ {item.price.toLocaleString()}.00</p>
                  <p className="text-emerald-500 text-[10px] font-bold uppercase tracking-widest">{item.stock}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 bg-white/2 border-t border-white/5 space-y-4">
            <div className="flex justify-between text-slate-400 text-sm font-bold uppercase tracking-widest">
              <span>Subtotal</span>
              <span>S/ {subtotal.toLocaleString()}.00</span>
            </div>
            <div className="flex justify-between text-emerald-500 text-sm font-bold uppercase tracking-widest">
              <span className="flex items-center gap-2"><Tag className="w-4 h-4" /> Descuento Lisi (15%)</span>
              <span>- S/ {discountAmount.toLocaleString()}.35</span>
            </div>
            <div className="pt-4 border-t border-white/5 flex items-end justify-between">
              <div>
                <p className="text-white font-black text-4xl tracking-tighter">S/ {total.toLocaleString()}.65</p>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">IGV Incluido</p>
              </div>
              <button className="px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 flex items-center gap-3 scale-110">
                <ShoppingCart className="w-5 h-5" /> Finalizar mi compra ahora
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
