import React from 'react';
import { motion } from 'motion/react';
import { Rocket, Cpu, Laptop, Mouse, Monitor, Router, Video, Headphones, ShoppingCart, ArrowRight, Sparkles, LayoutGrid } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (view: 'home' | 'catalog' | 'login' | 'register' | 'pc-builder', step?: number, category?: string) => void;
  onProductClick?: (product: any) => void;
  onAddToCart?: (product: any) => void;
}

export default function HomeView({ onNavigate, onProductClick, onAddToCart }: HomeViewProps) {
  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="relative rounded-2xl overflow-hidden min-h-[500px] flex items-center group">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&q=80&w=1920&h=1080')` 
          }}
        />
        <div className="absolute inset-0 theme-gradient" />
        <div className="relative z-10 px-8 lg:px-16 max-w-2xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-primary text-xs font-bold tracking-widest uppercase">
            <Sparkles className="w-4 h-4" /> Tecnología AI Avanzada
          </div>
          <h2 className="text-5xl lg:text-7xl font-black text-[var(--text-color)] leading-tight tracking-tighter">
            Crea tu PC Ideal con <span className="text-primary italic block lg:inline">Inteligencia Artificial</span>
          </h2>
          <p className="text-[var(--text-color)] opacity-80 text-lg leading-relaxed">
            Nuestro algoritmo analiza miles de componentes para garantizar la máxima compatibilidad y rendimiento según tu presupuesto.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('pc-builder', 0)}
              className="flex items-center gap-3 px-8 py-4 bg-primary hover:bg-primary/90 text-white rounded-xl text-lg font-bold transition-all transform hover:-translate-y-1 shadow-xl shadow-primary/30"
            >
              <Rocket className="w-6 h-6" />
              PC BUILDER IA
            </button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Explora Categorías
          </h3>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          <CategoryCard icon={<LayoutGrid />} title="Componentes" onClick={() => onNavigate('catalog', undefined, 'gpu')} />
          <CategoryCard icon={<Laptop />} title="Laptops" onClick={() => onNavigate('catalog', undefined, 'laptop')} />
          <CategoryCard icon={<Mouse />} title="Periféricos" onClick={() => onNavigate('catalog', undefined, 'peripherals')} />
          <CategoryCard icon={<Monitor />} title="Monitores" onClick={() => onNavigate('catalog', undefined, 'monitor')} />
          <CategoryCard icon={<Router />} title="Networking" onClick={() => onNavigate('catalog', undefined, 'networking')} />
          <CategoryCard icon={<Video />} title="Streaming" onClick={() => onNavigate('catalog', undefined, 'streaming')} />
          <CategoryCard icon={<Headphones />} title="Accesorios" onClick={() => onNavigate('catalog', undefined, 'accessories')} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span className="w-1.5 h-6 bg-primary rounded-full"></span>
            Componentes Destacados
          </h3>
          <a className="text-primary text-xs font-bold hover:underline flex items-center gap-1 uppercase tracking-wider" href="#">
            Ver todos <ArrowRight className="w-3 h-3" />
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard 
            image="https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600" 
            category="Laptops" 
            title="Apple MacBook Pro 14 • M3 Max • 36GB RAM" 
            price="12,499" 
            badge="Premium"
            badgeColor="bg-amber-500"
            onAddToCart={() => onAddToCart?.({ 
              id: 803, 
              brand: "Apple",
              name: "MacBook Pro 14 • M3 Max • 36GB RAM", 
              price: 12499, 
              image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600",
              tags: ["M3 Max", "36GB RAM", "Liquid Retina XDR"] 
            })}
            onClick={() => onProductClick?.({ 
              id: 803, 
              brand: "Apple",
              name: "MacBook Pro 14 • M3 Max • 36GB RAM", 
              price: 12499, 
              image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600",
              images: [
                "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&q=80&w=800&h=600",
                "https://picsum.photos/seed/mac1/800/600",
                "https://images.unsplash.com/photo-1541807084-5c52b6b3adef?auto=format&fit=crop&q=80&w=800&h=600",
                "https://picsum.photos/seed/mac2/800/600"
              ],
              tags: ["M3 Max", "36GB RAM", "Liquid Retina XDR"] 
            })}
          />
          <ProductCard 
            image="https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400" 
            category="Tarjetas de Video" 
            title="NVIDIA GeForce RTX 4080 Founders Edition 16GB" 
            price="4,899" 
            oldPrice="5,200"
            badge="Envío Gratis"
            onAddToCart={() => onAddToCart?.({ id: 402, name: "NVIDIA GeForce RTX 4080 Founders Edition 16GB", price: 4899, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400", tags: ["RTX 40 Series", "16GB VRAM"] })}
            onClick={() => onProductClick?.({ id: 402, name: "NVIDIA GeForce RTX 4080 Founders Edition 16GB", price: 4899, image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&q=80&w=400&h=400", tags: ["RTX 40 Series", "16GB VRAM"] })}
          />
          <ProductCard 
            image="https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400" 
            category="Procesadores" 
            title="AMD Ryzen 9 7950X - 16 Core 32 Thread 4.5GHz" 
            price="2,450" 
            badge="Nuevo"
            badgeColor="bg-emerald-500"
            onAddToCart={() => onAddToCart?.({ id: 106, name: "AMD Ryzen 9 7950X - 16 Core 32 Thread 4.5GHz", price: 2450, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400", tags: ["AM5", "16 Cores"] })}
            onClick={() => onProductClick?.({ id: 106, name: "AMD Ryzen 9 7950X - 16 Core 32 Thread 4.5GHz", price: 2450, image: "https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&q=80&w=400&h=400", tags: ["AM5", "16 Cores"] })}
          />
          <ProductCard 
            image="https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400" 
            category="Monitores" 
            title={'Samsung Odyssey G9 49" QLED Curved 240Hz'} 
            price="5,199" 
            oldPrice="6,200"
            badge="-15%"
            badgeColor="bg-red-500"
            onAddToCart={() => onAddToCart?.({ id: 1001, name: 'Samsung Odyssey G9 49" QLED Curved 240Hz', price: 5199, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400", tags: ["240Hz", "QLED"] })}
            onClick={() => onProductClick?.({ id: 1001, name: 'Samsung Odyssey G9 49" QLED Curved 240Hz', price: 5199, image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&q=80&w=400&h=400", tags: ["240Hz", "QLED"] })}
          />
          <ProductCard 
            image="https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400" 
            category="Placas Madre" 
            title="ASUS ROG Strix Z790-E Gaming WiFi II DDR5" 
            price="1,850" 
            onAddToCart={() => onAddToCart?.({ id: 201, name: "ASUS ROG Strix Z790-E Gaming WiFi II DDR5", price: 1850, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400", tags: ["Z790", "DDR5"] })}
            onClick={() => onProductClick?.({ id: 201, name: "ASUS ROG Strix Z790-E Gaming WiFi II DDR5", price: 1850, image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=400&h=400", tags: ["Z790", "DDR5"] })}
          />
        </div>
      </section>
    </div>
  );
}

function CategoryCard({ icon, title, onClick }: { icon: React.ReactNode, title: string, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="group flex flex-col items-start p-4 theme-card hover:border-primary/50 transition-all hover:shadow-lg w-full"
    >
      <div className="w-12 h-12 mb-3 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
      </div>
      <span className="text-[10px] font-bold text-left text-slate-400 group-hover:text-[var(--text-color)] transition-colors">{title}</span>
    </button>
  );
}

function ProductCard({ image, category, title, price, oldPrice, badge, badgeColor = "bg-primary", onClick, onAddToCart }: any) {
  return (
    <div 
      onClick={onClick}
      className="theme-card hover:border-primary/50 transition-all group cursor-pointer overflow-hidden flex flex-col"
    >
      <div className="relative aspect-square bg-slate-800/10 overflow-hidden">
        <img alt={title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" src={image} referrerPolicy="no-referrer" />
        {badge && <span className={`absolute top-2 left-2 px-2 py-1 ${badgeColor} text-white text-[8px] font-bold rounded uppercase tracking-tighter`}>{badge}</span>}
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <p className="text-[10px] text-slate-500 mb-1 uppercase tracking-wider">{category}</p>
        <h4 className="font-bold text-sm mb-4 line-clamp-2 text-[var(--text-color)] leading-tight h-10">{title}</h4>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-primary text-xl font-black">S/ {price}</p>
            {oldPrice && <p className="text-[10px] text-slate-600 line-through">S/ {oldPrice}</p>}
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onAddToCart?.();
            }}
            className="w-8 h-8 rounded-full bg-[var(--card-bg)] flex items-center justify-center hover:bg-primary hover:text-white transition-all text-slate-400 border border-[var(--border-color)]"
          >
            <ShoppingCart className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
