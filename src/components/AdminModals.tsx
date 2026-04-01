import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Save, Trash2, Plus, Upload, 
  Image as ImageIcon, AlertCircle, Settings,
  ChevronRight, Edit2
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { CATEGORIES_DATA } from '../data/adminConstants';
import { uploadFile } from '../lib/adminUtils';

interface ProductModalProps {
  product: any;
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  defaultCat?: string;
  defaultSubCat?: string;
  activeOffers?: any[];
}

const normalizeSubCat = (sc: string, mainCat?: string) => {
    if (mainCat === 'MONITORES' || mainCat?.toLowerCase() === 'monitor' || mainCat?.toLowerCase().includes('monitor-')) return 'Monitores';
    if (!sc) return sc;
    const s = String(sc).trim();
    if (s === 'Mousepads') return 'Alfombrillas';
    if (s === 'Sillas Gamer' || s === 'Sillas y Escritorios') return 'Sillas / gamer';
    if (s.startsWith('Monitores ')) return 'Monitores';
    if (s === 'Routers WiFi') return 'Routers';
    return sc;
};

export const ProductAdminModal = ({ 
  product: initialProduct, 
  isOpen, 
  onClose, 
  onSave,
  defaultCat,
  defaultSubCat,
  activeOffers
}: ProductModalProps) => {
  const [editingProduct, setEditingProduct] = useState<any>(() => {
    if (!initialProduct) return {
      name: '',
      sku: '',
      brand: '',
      cat: defaultCat || 'COMPONENTES',
      subCat: normalizeSubCat(defaultSubCat || 'Procesadores (CPUs)', defaultCat || 'COMPONENTES'),
      price: '',
      stock: 0,
      visible: true,
      image_url: '',
      images: [],
      specs: [],
      description: '',
      badge: '',
      oldPrice: ''
    };

    const specsData = initialProduct.specs || {};
    let specsArray: any[] = [];
    let parsedSpecs = typeof specsData === 'string' ? {} : specsData;
    
    if (typeof specsData === 'string') {
      try { parsedSpecs = JSON.parse(specsData); } catch (e) { console.error(e); }
    }
    
    if (Array.isArray(parsedSpecs)) {
      specsArray = parsedSpecs;
    } else if (parsedSpecs && typeof parsedSpecs === 'object') {
      // Si ya tiene el formato [{key, value}], usarlo directamente
      const isAlreadyArrayFormat = Object.values(parsedSpecs).every(v => typeof v === 'object' && v !== null && 'key' in v);
      if (isAlreadyArrayFormat) {
          specsArray = Object.values(parsedSpecs);
      } else {
          specsArray = Object.entries(parsedSpecs)
            .filter(([key]) => key !== 'description')
            .map(([key, value]) => ({ key, value: String(value) }));
      }
    }

    const normalizeCat = (cat: string) => {
        if (cat === 'laptop') return 'LAPTOPS Y COMPUTADORAS';
        if (cat === 'cpu' || cat === 'gpu' || cat === 'motherboard' || cat === 'ram' || cat === 'storage') return 'COMPONENTES';
        return cat;
    };
    
    const initialCat = normalizeCat(initialProduct.category_key || initialProduct.cat || defaultCat || 'COMPONENTES');

    return {
      ...initialProduct,
      cat: initialCat,
      subCat: normalizeSubCat(initialProduct.sub_category || initialProduct.subCat || defaultSubCat || 'Procesadores (CPUs)', initialCat),
      image_url: initialProduct.image_url || initialProduct.image || '',
      images: Array.isArray(initialProduct.images) ? initialProduct.images : [],
      specs: specsArray,
      description: initialProduct.description || '',
      badge: initialProduct.badge || '',
      oldPrice: initialProduct.old_price || initialProduct.oldPrice || ''
    };
  });

  const [isUploading, setIsUploading] = useState(false);
  const [skuError, setSkuError] = useState('');
  const [isCheckingSku, setIsCheckingSku] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  // Sync state when initialProduct changes or modal opens
  React.useEffect(() => {
    if (isOpen) {
      setIsUploading(false);
      if (initialProduct) {
        const specsData = initialProduct.specs || {};
        let specsArray: any[] = [];
        let parsedSpecs = typeof specsData === 'string' ? {} : specsData;
        
        if (typeof specsData === 'string') {
          try { parsedSpecs = JSON.parse(specsData); } catch (e) { console.error(e); }
        }
        
        if (Array.isArray(parsedSpecs)) {
          specsArray = parsedSpecs;
        } else if (parsedSpecs && typeof parsedSpecs === 'object') {
          // Robust checking for array format inside object
          const isAlreadyArrayFormat = Object.values(parsedSpecs).every(v => typeof v === 'object' && v !== null && 'key' in v);
          if (isAlreadyArrayFormat) {
              specsArray = Object.values(parsedSpecs);
          } else {
              specsArray = Object.entries(parsedSpecs)
                .filter(([key]) => key !== 'description')
                .map(([key, value]) => ({ key, value: String(value) }));
          }
        }

        const normalizeCat = (cat: string) => {
            const lowCat = cat?.toLowerCase();
            if (lowCat === 'laptop' || lowCat === 'pc-prebuilt' || lowCat === 'pc-aio' || lowCat?.includes('laptop-')) return 'LAPTOPS Y COMPUTADORAS';
            if (lowCat === 'cpu' || lowCat === 'gpu' || lowCat === 'motherboard' || lowCat === 'ram' || lowCat === 'storage' || lowCat === 'psu' || lowCat === 'case' || lowCat === 'cooling') return 'COMPONENTES';
            if (lowCat === 'keyboard' || lowCat === 'mouse' || lowCat === 'headset' || lowCat === 'webcam' || lowCat === 'mic' || lowCat === 'mousepad' || lowCat === 'chair' || lowCat === 'peripherals') return 'PERIFÉRICOS';
            if (lowCat === 'monitor' || lowCat?.includes('monitor-')) return 'MONITORES';
            if (lowCat === 'networking' || lowCat === 'router' || lowCat === 'switch' || lowCat === 'hub' || lowCat === 'nic') return 'NETWORKING';
            if (lowCat === 'streaming' || lowCat === 'lighting' || lowCat === 'greenscreen' || lowCat === 'capture') return 'STREAMING';
            if (lowCat === 'accessories' || lowCat?.includes('cable-') || lowCat === 'ups' || lowCat === 'adapter') return 'ACCESORIOS';
            return cat;
        };

        const initialCat = normalizeCat(initialProduct.category_key || initialProduct.cat || defaultCat || 'COMPONENTES');

        setEditingProduct({
          ...initialProduct,
          cat: initialCat,
          subCat: normalizeSubCat(initialProduct.sub_category || initialProduct.subCat || defaultSubCat || 'Procesadores (CPUs)', initialCat),
          image_url: initialProduct.image_url || initialProduct.image || '',
          images: Array.isArray(initialProduct.images) ? initialProduct.images : [],
          specs: specsArray,
          description: initialProduct.description || '',
          badge: initialProduct.badge || '',
          oldPrice: initialProduct.old_price || initialProduct.oldPrice || ''
        });
      } else {
        setEditingProduct({
          name: '',
          sku: '',
          brand: '',
          cat: defaultCat || 'COMPONENTES',
          subCat: normalizeSubCat(defaultSubCat || 'Procesadores (CPUs)', defaultCat || 'COMPONENTES'),
          price: '',
          stock: 0,
          visible: true,
          image_url: '',
          images: [],
          specs: [],
          description: '',
          badge: '',
          oldPrice: ''
        });
      }
      setSkuError('');
    }
  }, [isOpen, initialProduct]);

  // Real-time SKU duplicate check
  React.useEffect(() => {
    const checkSku = async () => {
      const sku = editingProduct.sku?.trim();
      if (!sku || !isOpen) {
        setSkuError('');
        return;
      }

      // If editing existing product and SKU hasn't changed, ignore
      if (initialProduct && sku === initialProduct.sku) {
        setSkuError('');
        return;
      }

      setIsCheckingSku(true);
      const { data } = await supabase
        .from('products')
        .select('sku')
        .eq('sku', sku)
        .maybeSingle();

      if (data) {
        setSkuError('Este SKU ya está registrado por otro producto');
      } else {
        setSkuError('');
      }
      setIsCheckingSku(false);
    };

    const timer = setTimeout(checkSku, 600);
    return () => clearTimeout(timer);
  }, [editingProduct.sku, initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    setEditingProduct((prev: any) => ({
      ...prev,
      specs: [...prev.specs, { key: '', value: '' }]
    }));
  };

  const handleUpdateSpec = (index: number, field: 'key' | 'value', value: string) => {
    setEditingProduct((prev: any) => {
      const newSpecs = [...prev.specs];
      newSpecs[index] = { ...newSpecs[index], [field]: value };
      return { ...prev, specs: newSpecs };
    });
  };

  const handleRemoveSpec = (index: number) => {
    setEditingProduct((prev: any) => ({
      ...prev,
      specs: prev.specs.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSave = async () => {
    if (!editingProduct.sku || editingProduct.sku.trim() === '') {
      alert('Error: El SKU es obligatorio.');
      return;
    }
    if (skuError) {
      alert('Error: ' + (skuError || 'El SKU no es válido o ya existe'));
      return;
    }
    if (editingProduct.stock < 0) {
      alert('Error: El stock no puede ser negativo.');
      return;
    }

    // Validate if ID is a valid UUID
    const isUuid = (id: any) => {
      if (!id || typeof id !== 'string') return false;
      return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
    };

    const isNew = !editingProduct.id || !isUuid(editingProduct.id);

    const productData = {
      sku: editingProduct.sku,
      name: editingProduct.name,
      brand: editingProduct.brand,
      category_key: editingProduct.cat,
      sub_category: editingProduct.subCat,
      price: typeof editingProduct.price === 'string' ? parseFloat(editingProduct.price.replace(/[^\d.]/g, '')) || 0 : Number(editingProduct.price) || 0,
      old_price: typeof editingProduct.oldPrice === 'string' && editingProduct.oldPrice !== '' ? parseFloat(editingProduct.oldPrice.replace(/[^\d.]/g, '')) || null : Number(editingProduct.oldPrice) || null,
      stock: Math.max(0, parseInt(String(editingProduct.stock)) || 0),
      visible: !!editingProduct.visible,
      image_url: editingProduct.image_url,
      images: editingProduct.images,
      description: editingProduct.description,
      badge: editingProduct.badge || null,
      specs: Object.fromEntries(
        editingProduct.specs
          .filter((s: any) => s.key && s.key.trim() !== '' && s.key.toLowerCase() !== 'description')
          .map((s: any) => [s.key.trim(), s.value])
      )
    };

    try {
      const { error } = isNew 
        ? await supabase.from('products').insert([productData])
        : await supabase.from('products').update(productData).eq('id', editingProduct.id);

      if (error) {
        if (error.code === '23505') {
          setSkuError('Este SKU ya está registrado');
          setNotification('Error: Ya existe un producto con este SKU.');
        } else {
          setNotification(`Error al guardar: ${error.message}`);
        }
        setTimeout(() => setNotification(null), 3000);
        return;
      }

      setNotification('Se guardó correctamente');
      setTimeout(() => {
        setNotification(null);
        onSave();
        onClose();
      }, 1500);
    } catch (err: any) {
      setNotification('Error inesperado: ' + err.message);
      setTimeout(() => setNotification(null), 3000);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {notification && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-12 left-1/2 -translate-x-1/2 z-[1000] bg-emerald-500 text-white px-8 py-4 rounded-2xl font-black shadow-2xl shadow-emerald-500/20 uppercase tracking-widest text-[10px] flex items-center gap-3 border border-emerald-400/50 pointer-events-none"
          >
            <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_white]" />
            {notification}
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-5xl max-h-[90vh] bg-[#0B0E14] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
            <div>
              <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
                {editingProduct.id ? 'Editar Producto' : 'Nuevo Producto'}
              </h2>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                {editingProduct.id ? `ID: ${editingProduct.sku}` : 'Crea una nueva oferta para el catálogo'}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white transition-all"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Información General</h3>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre</label>
                      <input 
                        type="text"
                        value={editingProduct.name}
                        onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Marca</label>
                      <input 
                        type="text"
                        value={editingProduct.brand}
                        onChange={(e) => setEditingProduct({...editingProduct, brand: e.target.value})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">SKU</label>
                        {isCheckingSku && <div className="w-2 h-2 border border-primary/40 border-t-primary rounded-full animate-spin" />}
                      </div>
                      <input 
                        type="text"
                        placeholder="Ej: LAP-001"
                        value={editingProduct.sku}
                        onChange={(e) => setEditingProduct({...editingProduct, sku: e.target.value.toUpperCase()})}
                        className={`w-full bg-black/40 border ${skuError ? 'border-rose-500/50' : 'border-white/10'} rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all`}
                      />
                      {skuError && (
                        <div className="flex items-center gap-1.5 ml-1 text-rose-500">
                          <AlertCircle className="w-3 h-3" />
                          <span className="text-[9px] font-black uppercase tracking-widest">{skuError}</span>
                        </div>
                      )}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Categoría</label>
                      <select 
                        value={editingProduct.cat}
                        onChange={(e) => {
                          const cat = e.target.value as keyof typeof CATEGORIES_DATA;
                          setEditingProduct({
                            ...editingProduct,
                            cat,
                            subCat: CATEGORIES_DATA[cat] ? CATEGORIES_DATA[cat][0] : editingProduct.subCat
                          });
                        }}
                        className="w-full bg-[#1a1f26] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        {Object.keys(CATEGORIES_DATA).map(cat => (
                          <option key={cat} value={cat} className="bg-[#151921]">{cat}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Subcategoría</label>
                      <select 
                        value={editingProduct.subCat}
                        onChange={(e) => setEditingProduct({...editingProduct, subCat: e.target.value})}
                        className="w-full bg-[#1a1f26] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                          {CATEGORIES_DATA[editingProduct.cat as keyof typeof CATEGORIES_DATA]?.map(sub => (
                            <option key={sub} value={sub} className="bg-[#151921]">{sub}</option>
                          ))}
                          {(!CATEGORIES_DATA[editingProduct.cat as keyof typeof CATEGORIES_DATA] || 
                            !CATEGORIES_DATA[editingProduct.cat as keyof typeof CATEGORIES_DATA].includes(editingProduct.subCat)) && (
                            <option value={editingProduct.subCat} className="bg-[#151921]">{editingProduct.subCat}</option>
                          )}
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Oferta Activa</label>
                      <select 
                        value={editingProduct.badge || ''}
                        onChange={(e) => {
                          const badgeStr = e.target.value;
                          let newPrice = editingProduct.price;
                          let currentOldPrice = editingProduct.oldPrice;

                          // If we have an existing oldPrice or price, calculate
                          if (badgeStr && badgeStr.includes('%')) {
                            const discountNum = parseInt(badgeStr.replace('%', ''));
                            // If no old price, make current price the old price
                            if (!currentOldPrice && editingProduct.price) {
                              currentOldPrice = editingProduct.price;
                            }

                            if (!isNaN(discountNum) && currentOldPrice) {
                              const oldP = Number(String(currentOldPrice).replace(/[^\d.]/g, ''));
                              const calculatedPrice = oldP - (oldP * discountNum / 100);
                              newPrice = calculatedPrice.toString();
                            }
                          } else if (!badgeStr && currentOldPrice) {
                            // Si se quita la oferta, restaurar precio original
                            newPrice = currentOldPrice;
                            currentOldPrice = '';
                          }

                          setEditingProduct({
                            ...editingProduct, 
                            badge: badgeStr, 
                            price: newPrice,
                            oldPrice: currentOldPrice
                          });
                        }}
                        className="w-full bg-[#1a1f26] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                      >
                        <option value="" className="bg-[#151921]">Ninguna (Sin descuento)</option>
                        {activeOffers?.map(o => (
                          <option key={o.code} value={o.discount} className="bg-[#151921]">{o.name} - {o.discount}</option>
                        ))}
                      </select>
                    </div>

                    {editingProduct.badge ? (
                      <>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Precio Original (Antes) S/</label>
                          <input 
                            type="text"
                            value={String(editingProduct.oldPrice || '').replace(/[^\d.]/g, '')}
                            onChange={(e) => setEditingProduct({...editingProduct, oldPrice: e.target.value})}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-slate-400 outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                            placeholder="Ej: 150.00"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-black text-primary/80 uppercase tracking-widest ml-1">Precio Final (Después) S/</label>
                          <input 
                            type="text"
                            value={String(editingProduct.price).replace(/[^\d.]/g, '')}
                            onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                            className="w-full bg-primary/10 border border-primary/30 rounded-2xl px-6 py-4 text-sm font-black text-white outline-none focus:ring-2 focus:ring-primary/80 transition-all"
                          />
                        </div>
                      </>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Precio (S/)</label>
                        <input 
                          type="text"
                          value={String(editingProduct.price).replace(/[^\d.]/g, '')}
                          onChange={(e) => setEditingProduct({...editingProduct, price: e.target.value})}
                          className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                        />
                      </div>
                    )}
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Stock (Solo números positivos)</label>
                      <input 
                        type="number"
                        min="0"
                        step="1"
                        value={editingProduct.stock}
                        onChange={(e) => setEditingProduct({...editingProduct, stock: parseInt(e.target.value) || 0})}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                      />
                    </div>
                    <div className="md:col-span-2 space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Descripción</label>
                      <textarea 
                        value={editingProduct.description}
                        onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                        rows={4}
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all custom-scrollbar resize-none"
                        placeholder="Escribe una descripción atractiva para el producto..."
                      />
                    </div>
                  </div>
                </section>

                <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <Settings className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-black text-white uppercase tracking-tight">Especificaciones Técnicas</h3>
                    </div>
                    <button 
                      onClick={handleAddSpec}
                      className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all flex items-center gap-2 text-[10px] font-black uppercase tracking-widest"
                    >
                      <Plus className="w-4 h-4" /> Añadir
                    </button>
                  </div>
                  
                  <div className="space-y-4">
                    {editingProduct.specs.map((spec: any, idx: number) => (
                      <div key={idx} className="flex gap-4 items-start">
                        <input 
                          type="text"
                          placeholder="Propiedad"
                          value={spec.key}
                          onChange={(e) => handleUpdateSpec(idx, 'key', e.target.value)}
                          className="flex-1 bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <input 
                          type="text"
                          placeholder="Valor"
                          value={spec.value}
                          onChange={(e) => handleUpdateSpec(idx, 'value', e.target.value)}
                          className="flex-[2] bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-white outline-none focus:ring-2 focus:ring-primary/50"
                        />
                        <button 
                          onClick={() => handleRemoveSpec(idx)}
                          className="p-3 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </section>
              </div>

              <div className="space-y-8">
                <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tight">Imágenes</h3>
                  </div>

                  <div className="space-y-8">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Principal</label>
                      <div 
                        onClick={() => !isUploading && document.getElementById('modal-main-image')?.click()}
                        className="aspect-square bg-black/40 rounded-3xl border-2 border-dashed border-white/10 relative group overflow-hidden cursor-pointer hover:border-primary/50 transition-all"
                      >
                        {editingProduct.image_url ? (
                          <>
                            <img src={editingProduct.image_url} alt="" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <Edit2 className="w-6 h-6 text-white" />
                            </div>
                          </>
                        ) : (
                          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
                            <Upload className="w-8 h-8 text-slate-600" />
                            <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Subir</span>
                          </div>
                        )}
                        {isUploading && (
                          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                            <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                          </div>
                        )}
                      </div>
                      <input 
                        id="modal-main-image"
                        type="file"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const url = await uploadFile(file, setIsUploading);
                            if (url) setEditingProduct({...editingProduct, image_url: url});
                          }
                        }}
                      />
                    </div>

                    <div className="space-y-4 border-t border-white/5 pt-6">
                      <div className="flex items-center justify-between ml-1">
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Galería (Otros ángulos)</label>
                        <span className="text-[8px] font-bold text-slate-600">{(editingProduct.images || []).length} / 8</span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {(editingProduct.images || []).map((img: string, idx: number) => (
                          <div key={idx} className="aspect-square bg-black/40 rounded-2xl border border-white/10 relative group overflow-hidden">
                            <img src={img} alt="" className="w-full h-full object-contain" />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button 
                                onClick={() => {
                                  const newImages = editingProduct.images.filter((_: any, i: number) => i !== idx);
                                  setEditingProduct({...editingProduct, images: newImages});
                                }}
                                className="p-2 bg-rose-500 text-white rounded-xl hover:scale-110 transition-all shadow-lg"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                        
                        {(editingProduct.images || []).length < 8 && (
                          <button 
                            type="button"
                            disabled={isUploading}
                            onClick={() => document.getElementById('modal-gallery-upload')?.click()}
                            className="aspect-square bg-white/[0.02] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all text-slate-600 hover:text-primary group"
                          >
                            <Plus className="w-6 h-6 group-hover:scale-110 transition-transform" />
                            <span className="text-[8px] font-black uppercase tracking-widest">Añadir</span>
                          </button>
                        )}
                        
                        <input 
                          id="modal-gallery-upload"
                          type="file"
                          multiple
                          className="hidden"
                          onChange={async (e) => {
                            const files = Array.from(e.target.files || []) as File[];
                            for (const file of files) {
                              const url = await uploadFile(file, setIsUploading);
                              if (url) {
                                setEditingProduct((prev: any) => {
                                  const currentImages = Array.isArray(prev.images) ? prev.images : [];
                                  return {
                                    ...prev,
                                    images: [...currentImages, url]
                                  };
                                });
                              }
                            }
                            e.target.value = '';
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </section>

                <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 space-y-6">
                  <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Publicación</h3>
                  <div className="flex items-center justify-between p-4 bg-white/2 rounded-2xl">
                    <span className="text-sm font-bold text-white">Visible</span>
                    <button
                      onClick={() => setEditingProduct({ ...editingProduct, visible: !editingProduct.visible })}
                      className={`w-12 h-6 rounded-full transition-all relative ${editingProduct.visible ? 'bg-primary' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${editingProduct.visible ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </section>
              </div>
            </div>
          </div>

          <div className="p-8 border-t border-white/5 flex items-center justify-end gap-4 bg-white/[0.02]">
            <button 
              onClick={onClose}
              className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-widest hover:bg-white/5 rounded-2xl transition-all"
            >
              Cerrar
            </button>
            <button 
              onClick={handleSave}
              className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-xl shadow-primary/30 flex items-center gap-2"
            >
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export const FilterAdminModal = ({ isOpen, onClose, categoryKey, initialFilter, defaultFilters, onSave }: any) => {
  const [filters, setFilters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingOptionIdx, setEditingOptionIdx] = useState<{filterIdx: number, optIdx: number} | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const fetchFilters = React.useCallback(async () => {
    if (!categoryKey) return;
    setIsLoading(true);
    const { data } = await supabase
      .from('category_filters')
      .select('*')
      .eq('category_key', categoryKey)
      .order('display_order', { ascending: true });
    
    // De-duplicate the results from database to prevent UI repetition
    const uniqueFilters: any[] = [];
    const seenIds = new Set();

    if (data && data.length > 0) {
      data.forEach(f => {
        const fId = f.filter_id || String(f.id);
        if (!seenIds.has(fId)) {
          seenIds.add(fId);
          
          let options = Array.isArray(f.options) ? f.options : [];
          
          uniqueFilters.push({
            ...f,
            options: options
          });
        }
      });

      // CRITICAL: Check for common filters in defaultFilters that might be missing from the DB
      if (defaultFilters) {
        defaultFilters.forEach((df: any) => {
          const dfId = df.filter_id || String(df.id);
          if (!seenIds.has(dfId)) {
            seenIds.add(dfId);
            uniqueFilters.push(df); // Add the missing filter (e.g., 'brand' for webcams)
          }
        });
      }

      setFilters(uniqueFilters);
    } else if (defaultFilters && defaultFilters.length > 0) {
      // If DB is empty, use the provided defaults
      defaultFilters.forEach((f: any) => {
        const fId = f.id;
        if (!seenIds.has(fId)) {
          seenIds.add(fId);
          uniqueFilters.push({
            filter_id: f.id,
            label: f.label,
            type: f.type,
            options: Array.isArray(f.options) ? f.options : []
          });
        }
      });
      setFilters(uniqueFilters);
    }
    setIsLoading(false);
  }, [categoryKey, defaultFilters]);

  React.useEffect(() => {
    if (!isOpen) return;
    if (initialFilter) {
      setFilters([{
        ...initialFilter,
        options: Array.isArray(initialFilter.options) ? initialFilter.options : []
      }]);
      setIsLoading(false);
    } else {
      fetchFilters();
    }
  }, [isOpen, initialFilter, fetchFilters]);

  if (!isOpen) return null;

  const handleAddFilter = () => {
    setFilters([...filters, {
      category_key: categoryKey,
      label: '',
      type: 'checkbox',
      options: [],
      display_order: filters.length
    }]);
  };

  const handleUpdateFilter = (idx: number, updates: any) => {
    const newFilters = [...filters];
    newFilters[idx] = { ...newFilters[idx], ...updates };
    setFilters(newFilters);
  };

  const handleRemoveFilter = (filterIdx: number) => {
    setFilters(filters.filter((_, i) => i !== filterIdx));
  };

  const handleAddOption = (filterIdx: number) => {
    const newFilters = [...filters];
    const currentOptions = Array.isArray(newFilters[filterIdx].options) ? newFilters[filterIdx].options : [];
    newFilters[filterIdx].options = [...currentOptions, 'Nueva Opción'];
    setFilters(newFilters);
    setEditingOptionIdx({ filterIdx, optIdx: newFilters[filterIdx].options.length - 1 });
  };

  const handleRemoveOption = (filterIdx: number, optIdx: number) => {
    const newFilters = [...filters];
    newFilters[filterIdx].options = newFilters[filterIdx].options.filter((_: any, i: number) => i !== optIdx);
    setFilters(newFilters);
  };

  const handleUpdateOption = (filterIdx: number, optIdx: number, value: string) => {
    const newFilters = [...filters];
    newFilters[filterIdx].options[optIdx] = value;
    setFilters(newFilters);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // 1. Delete all existing filters for this category to ensure removed ones don't stay in DB
      await supabase
        .from('category_filters')
        .delete()
        .eq('category_key', categoryKey);

      // 2. Prepare all filters to be inserted
      const filtersToSave = filters.map((filter, idx) => ({
        category_key: categoryKey,
        filter_id: filter.filter_id || filter.id || filter.label.toLowerCase().trim().replace(/\s+/g, '_'),
        label: filter.label,
        type: filter.type,
        options: filter.options,
        display_order: idx
      }));

      // 3. Insert the new clean set
      if (filtersToSave.length > 0) {
        const { error } = await supabase
          .from('category_filters')
          .insert(filtersToSave);
        if (error) throw error;
      }

      onSave();
      onClose();
    } catch (error: any) {
      console.error('Error saving filters:', error);
      alert(`Error al guardar filtros: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl max-h-[85vh] bg-[#0F1219] border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col"
        >
          <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
            <div>
              <h2 className="text-xl font-black text-white uppercase tracking-tight">Gestionar Filtros</h2>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1">{categoryKey}</p>
            </div>
            <button onClick={onClose} className="p-3 hover:bg-white/5 rounded-2xl text-slate-500 hover:text-white">
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
            {filters.map((f, i) => (
              <div key={i} className="space-y-6 relative group/filter bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                <button 
                  onClick={() => handleRemoveFilter(i)}
                  className="absolute top-6 right-6 p-2 bg-rose-500/10 text-rose-500 rounded-xl hover:bg-rose-500 hover:text-white transition-all opacity-0 group-hover/filter:opacity-100"
                  title="Eliminar filtro completo"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
                <div className="space-y-2 pr-12">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Etiqueta del Filtro (Ej: Color, Marca, Tipo...)</label>
                  <input 
                    type="text"
                    value={f.label}
                    onChange={(e) => handleUpdateFilter(i, { label: e.target.value })}
                    className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Opciones Disponibles</label>
                  <div className="space-y-3">
                    {f.options.map((opt: string, optIdx: number) => (
                      <div key={optIdx} className="flex items-center justify-between p-4 bg-[#1A1F26] rounded-2xl border border-white/[0.03] group hover:border-white/10 transition-all">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-5 h-5 rounded-lg border border-white/10 flex items-center justify-center shrink-0">
                            <div className="w-2 h-2 rounded-sm bg-primary/20" />
                          </div>
                          {editingOptionIdx?.filterIdx === i && editingOptionIdx?.optIdx === optIdx ? (
                            <input 
                              autoFocus
                              value={opt}
                              onChange={(e) => handleUpdateOption(i, optIdx, e.target.value)}
                              onBlur={() => setEditingOptionIdx(null)}
                              onKeyDown={(e) => e.key === 'Enter' && setEditingOptionIdx(null)}
                              className="bg-transparent border-none p-0 text-sm font-bold text-white outline-none w-full"
                            />
                          ) : (
                            <span className="text-sm font-bold text-white">{opt}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-4">
                          <button onClick={() => setEditingOptionIdx({ filterIdx: i, optIdx })} className="text-[10px] font-black text-blue-500 uppercase tracking-widest">editar</button>
                          <button onClick={() => handleRemoveOption(i, optIdx)} className="p-1 text-rose-500"><X className="w-5 h-5 stroke-[3]" /></button>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => handleAddOption(i)} className="w-full py-4 bg-black/40 border border-white/5 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-white/5 hover:text-white transition-all">Agregar</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-8 border-t border-white/5 bg-white/[0.01] flex justify-end gap-4">
            <button disabled={isSaving} onClick={onClose} className="px-8 py-4 text-[10px] font-black text-white uppercase tracking-widest disabled:opacity-50">Cerrar</button>
            <button disabled={isSaving} onClick={handleSave} className="px-10 py-4 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest disabled:opacity-50 shadow-xl shadow-primary/30 flex items-center gap-2">
              {isSaving ? 'Guardando...' : 'Guardar Filtros'}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
