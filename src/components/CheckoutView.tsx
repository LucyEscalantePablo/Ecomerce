import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Mail, 
  User,
  ShieldCheck,
  RefreshCcw,
  Tag,
  Wallet,
  Building2
} from 'lucide-react';

interface CheckoutViewProps {
  onNavigate: (view: any) => void;
  cart: any[];
  updateQuantity: (id: number, quantity: number) => void;
  removeFromCart: (id: number) => void;
}

export default function CheckoutView({ onNavigate, cart, updateQuantity, removeFromCart }: CheckoutViewProps) {
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'yape' | 'mercado'>('card');
  
  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    district: 'Lima',
    phone: '',
    cardNumber: '',
    expiry: '',
    cvv: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'El nombre es obligatorio';
    if (!formData.email.trim() || !/^\S+@\S+\.\S+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.address.trim()) newErrors.address = 'La dirección es obligatoria';
    if (!formData.phone.trim()) newErrors.phone = 'El teléfono es obligatorio';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    if (paymentMethod === 'card') {
      if (!formData.cardNumber.trim()) newErrors.cardNumber = 'Número de tarjeta obligatorio';
      if (!formData.expiry.trim()) newErrors.expiry = 'Expiración obligatoria';
      if (!formData.cvv.trim()) newErrors.cvv = 'CVV obligatorio';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1) {
      if (validateStep1()) setStep(2);
    } else if (step === 2) {
      if (validateStep2()) setStep(3);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 0;
  const total = subtotal + shipping;

  return (
    <div className="py-12 space-y-12">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-4xl font-black text-white tracking-tight">Finalizar Compra</h2>
        <p className="text-slate-400 font-medium">Complete su información para procesar el pedido de forma segura.</p>
      </div>

      {/* Stepper */}
      <div className="flex items-center justify-center max-w-3xl mx-auto relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/5 -translate-y-1/2 z-0" />
        <div 
          className="absolute top-1/2 left-0 h-0.5 bg-primary -translate-y-1/2 z-0 transition-all duration-500" 
          style={{ width: `${((step - 1) / 2) * 100}%` }}
        />
        <div className="relative z-10 flex justify-between w-full">
          {[
            { id: 1, label: '1. ENVÍO' },
            { id: 2, label: '2. PAGO' },
            { id: 3, label: '3. CONFIRMACIÓN' }
          ].map((s) => (
            <button 
              key={s.id} 
              disabled={s.id > step}
              onClick={() => setStep(s.id)}
              className={`flex flex-col items-center gap-3 group outline-none transition-all ${s.id > step ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div className={`px-6 py-2 rounded-full text-[10px] font-black tracking-widest transition-all ${
                step === s.id 
                  ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                  : step > s.id 
                    ? 'bg-emerald-500 text-white' 
                    : 'bg-slate-800 text-slate-500'
              }`}>
                {s.label}
              </div>
              {step === s.id && (
                <motion.div 
                  layoutId="activeStep"
                  className="h-1 w-full bg-primary rounded-full mt-1"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left Column: Forms */}
        <div className="lg:col-span-2 space-y-12">
          {step === 1 && (
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Truck className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Información de Envío</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre Completo</label>
                  <div className="relative group">
                    <User className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.fullName ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`} />
                    <input 
                      type="text" 
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="Ej. Juan Pérez"
                      className={`w-full bg-white/5 border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.fullName ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.fullName}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo Electrónico</label>
                  <div className="relative group">
                    <Mail className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.email ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="juan@ejemplo.com"
                      className={`w-full bg-white/5 border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.email ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                    />
                  </div>
                  {errors.email && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.email}</p>}
                </div>
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dirección de Entrega</label>
                  <div className="relative group">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.address ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`} />
                    <input 
                      type="text" 
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Calle, número, departamento"
                      className={`w-full bg-white/5 border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.address ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                    />
                  </div>
                  {errors.address && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.address}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Ciudad / Distrito</label>
                  <select 
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    className="w-full bg-[#1a1f26] border border-white/10 rounded-2xl px-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all appearance-none"
                  >
                    <option value="Lima" className="bg-[#151921] text-white">Lima</option>
                    <option value="Arequipa" className="bg-[#151921] text-white">Arequipa</option>
                    <option value="Trujillo" className="bg-[#151921] text-white">Trujillo</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Teléfono de Contacto</label>
                  <div className="relative group">
                    <Phone className={`absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors ${errors.phone ? 'text-rose-500' : 'text-slate-500 group-focus-within:text-primary'}`} />
                    <input 
                      type="tel" 
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+51 999 999 999"
                      className={`w-full bg-white/5 border rounded-2xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.phone ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                    />
                  </div>
                  {errors.phone && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.phone}</p>}
                </div>
              </div>

              <button 
                onClick={handleNext}
                className="w-full py-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
              >
                Continuar al Pago <ChevronRight className="w-5 h-5" />
              </button>
            </motion.section>
          )}

          {step === 2 && (
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <CreditCard className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Método de Pago</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { id: 'card', label: 'Tarjeta', desc: 'Crédito/Débito', icon: <CreditCard className="w-6 h-6" /> },
                  { id: 'yape', label: 'Yape / Plin', desc: 'Pago móvil rápido', icon: <Wallet className="w-6 h-6" /> },
                  { id: 'mercado', label: 'Mercado Pago', desc: 'E-wallet', icon: <Building2 className="w-6 h-6" /> }
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id as any)}
                    className={`p-6 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 text-center group ${
                      paymentMethod === method.id 
                        ? 'border-primary bg-primary/5' 
                        : 'border-white/5 bg-white/5 hover:border-white/10'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                      paymentMethod === method.id ? 'bg-primary text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'
                    }`}>
                      {method.icon}
                    </div>
                    <div>
                      <p className="text-sm font-black text-white uppercase tracking-widest">{method.label}</p>
                      <p className="text-[10px] font-bold text-slate-500">{method.desc}</p>
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod === 'card' && (
                <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número de Tarjeta</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={formData.cardNumber}
                        onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                        placeholder="0000 0000 0000 0000"
                        className={`w-full bg-slate-900/50 border rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.cardNumber ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                      />
                    </div>
                    {errors.cardNumber && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.cardNumber}</p>}
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Expiración</label>
                      <input 
                        type="text" 
                        value={formData.expiry}
                        onChange={(e) => handleInputChange('expiry', e.target.value)}
                        placeholder="MM/YY"
                        className={`w-full bg-slate-900/50 border rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.expiry ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                      />
                      {errors.expiry && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.expiry}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">CVV</label>
                      <input 
                        type="password" 
                        value={formData.cvv}
                        onChange={(e) => handleInputChange('cvv', e.target.value)}
                        placeholder="***"
                        className={`w-full bg-slate-900/50 border rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 transition-all ${errors.cvv ? 'border-rose-500 focus:ring-rose-500/50' : 'border-white/10 focus:ring-primary/50'}`}
                      />
                      {errors.cvv && <p className="text-[10px] text-rose-500 font-bold ml-1">{errors.cvv}</p>}
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-4">
                <button 
                  onClick={() => setStep(1)}
                  className="flex-1 py-6 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
                >
                  Atrás
                </button>
                <button 
                  onClick={handleNext}
                  className="flex-[2] py-6 bg-primary hover:bg-primary/90 text-white rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl shadow-primary/40 transition-all active:scale-[0.98]"
                >
                  Pagar S/ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })} Ahora
                </button>
              </div>
            </motion.section>
          )}

          {step === 3 && (
            <motion.section 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white/5 border border-white/5 rounded-3xl p-12 text-center space-y-8"
            >
              <div className="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <div className="space-y-2">
                <h3 className="text-3xl font-black text-white uppercase tracking-tighter">¡Pedido Confirmado!</h3>
                <p className="text-slate-400 max-w-md mx-auto">Gracias por tu compra, {formData.fullName.split(' ')[0]}. Hemos enviado los detalles de tu pedido a {formData.email}.</p>
              </div>
              <div className="bg-slate-900/50 rounded-2xl p-6 inline-block">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Número de Pedido</p>
                <p className="text-xl font-black text-white tracking-widest">#TM-849201</p>
              </div>
              <div className="pt-4">
                <button 
                  onClick={() => onNavigate('home')}
                  className="px-12 py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20"
                >
                  Volver a la Tienda
                </button>
              </div>
            </motion.section>
          )}
          
          <div className="flex items-center justify-center gap-2 text-slate-500 text-[10px] font-bold uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4" />
            Transacción encriptada con SSL de 256 bits
          </div>
        </div>

        {/* Right Column: Summary */}
        <div className="space-y-8">
          <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8 sticky top-32">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Resumen de Compra</h3>
            
            <div className="space-y-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 group">
                    <div className="w-20 h-20 rounded-2xl bg-black/40 overflow-hidden shrink-0">
                      <img 
                        src={item.image} 
                        alt={item.name} 
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex-1 space-y-1">
                      <h4 className="text-xs font-bold text-white leading-snug line-clamp-2">{item.name}</h4>
                      <div className="flex items-center gap-3 mt-1">
                        <div className="flex items-center bg-slate-900 rounded-lg border border-white/5">
                          <button 
                            onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                          >
                            -
                          </button>
                          <span className="text-[10px] font-black text-white w-6 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-500 hover:text-white transition-colors"
                          >
                            +
                          </button>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id)}
                          className="text-[8px] font-black text-rose-500 uppercase tracking-widest hover:underline"
                        >
                          Eliminar
                        </button>
                      </div>
                      <p className="text-sm font-black text-primary">S/ {(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-slate-500 text-sm font-bold">Tu carrito está vacío</p>
                  <button 
                    onClick={() => onNavigate('catalog')}
                    className="text-primary text-xs font-black uppercase tracking-widest mt-2 hover:underline"
                  >
                    Ir al catálogo
                  </button>
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-white/5 space-y-6">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input 
                    type="text" 
                    placeholder="Código de descuento"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-xs font-bold text-white outline-none focus:ring-1 focus:ring-primary/40 transition-all"
                  />
                </div>
                <button className="px-6 py-3 bg-white text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-200 transition-colors">
                  Aplicar
                </button>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">Subtotal</span>
                  <span className="text-white">S/ {subtotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">Envío</span>
                  <span className="text-emerald-500 uppercase tracking-widest">Gratis</span>
                </div>
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-slate-500 uppercase">IGV (18%)</span>
                  <span className="text-white">Incluido</span>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-end">
                  <span className="text-lg font-black text-white uppercase tracking-tighter">Total</span>
                  <span className="text-3xl font-black text-primary tracking-tighter">S/ {total.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Trust Badges */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-8 space-y-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Garantía TechMarket</h4>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed mt-1">Todos tus componentes cuentan con garantía directa de 12 meses.</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <RefreshCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Devolución Simple</h4>
                <p className="text-[10px] font-medium text-slate-500 leading-relaxed mt-1">¿No era lo que buscabas? Devuélvelo gratis en los primeros 7 días.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
