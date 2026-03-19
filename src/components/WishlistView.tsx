import React from 'react';
import { motion } from 'motion/react';
import { Heart, ShoppingCart, Trash2, ArrowLeft, Search, Bell } from 'lucide-react';
import { categoryData } from './CatalogView';

interface WishlistViewProps {
  wishlist: number[];
  onToggleWishlist: (id: number) => void;
  onProductClick: (product: any) => void;
  onNavigate: (view: any) => void;
}

export default function WishlistView({ wishlist, onToggleWishlist, onProductClick, onNavigate }: WishlistViewProps) {
  const allProducts = Object.values(categoryData).flat();
  const wishlistedProducts = allProducts.filter(p => wishlist.includes(p.id));

  return (
    <div className="py-12 min-h-[60vh]">
      <div className="flex items-center justify-between mb-12">
        <div>
          <button 
            onClick={() => onNavigate('home')}
            className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-4"
          >
            <ArrowLeft className="w-4 h-4" /> Volver al Inicio
          </button>
          <h1 className="text-4xl font-black tracking-tighter text-white uppercase">Mi Lista de Deseos</h1>
          <p className="text-slate-500 text-sm mt-2">Tienes {wishlistedProducts.length} productos guardados</p>
        </div>
      </div>

      {wishlistedProducts.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {wishlistedProducts.map((product) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-[#151921] rounded-2xl p-3 border border-white/5 hover:border-primary/50 transition-all group relative flex flex-col"
            >
              <div 
                className="relative aspect-square bg-[#0B0E14] rounded-xl mb-3 overflow-hidden flex items-center justify-center cursor-pointer"
                onClick={() => onProductClick(product)}
              >
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleWishlist(product.id);
                  }}
                  className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center shadow-lg shadow-rose-500/40 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar de la lista"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-2 flex-1 flex flex-col">
                <div className="space-y-0.5">
                  <p className="text-[8px] font-medium text-slate-500 uppercase tracking-tight">{product.brand || 'Premium'}</p>
                  <h3 
                    className="font-bold text-white text-[11px] leading-tight group-hover:text-primary transition-colors line-clamp-2 cursor-pointer"
                    onClick={() => onProductClick(product)}
                  >
                    {product.name}
                  </h3>
                </div>

                <div className="flex items-end justify-between pt-1 mt-auto">
                  <div className="space-y-0">
                    {product.oldPrice && <p className="text-[8px] text-slate-500 line-through">S/ {product.oldPrice}</p>}
                    <p className="text-blue-500 font-black text-sm tracking-tighter">S/ {new Intl.NumberFormat('en-US', { minimumFractionDigits: 2 }).format(product.price)}</p>
                  </div>
                  <button className="w-8 h-8 rounded-lg bg-white/5 text-slate-500 hover:text-white hover:bg-primary hover:shadow-lg hover:shadow-primary/20 flex items-center justify-center transition-all">
                    <ShoppingCart className="w-4 h-4 stroke-[1.5]" />
                  </button>
                </div>
                
                <button className="w-full py-1.5 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-1.5 border border-white/5">
                  <Bell className="w-2.5 h-2.5" /> Alerta
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 space-y-6 bg-[#151921]/50 rounded-3xl border border-dashed border-white/10">
          <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
            <Heart className="w-10 h-10 text-slate-600" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white">Tu lista está vacía</h3>
            <p className="text-slate-500 max-w-xs mx-auto">¡Explora nuestro catálogo y guarda los componentes que más te gusten!</p>
          </div>
          <button 
            onClick={() => onNavigate('catalog')}
            className="px-8 py-3 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
          >
            Explorar Catálogo
          </button>
        </div>
      )}
    </div>
  );
}
