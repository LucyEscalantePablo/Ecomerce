import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  TrendingUp, 
  CheckCircle2, 
  Send, 
  ChevronRight,
  Monitor,
  Cpu,
  Server,
  Smartphone,
  ArrowLeft,
  ArrowRight,
  ShieldCheck,
  Zap,
  Crown,
  AlertTriangle
} from 'lucide-react';

interface ResellerRequestViewProps {
  onNavigate: (view: any) => void;
  onSubmitRequest: (request: any) => void;
}

const PLANS = [
  { id: 'starter', name: 'Starter', limit: 50, price: 'S/ 99', icon: <Zap className="w-6 h-6" />, desc: 'Ideal para pequeños negocios locales.' },
  { id: 'professional', name: 'Professional', limit: 200, price: 'S/ 249', icon: <ShieldCheck className="w-6 h-6" />, desc: 'Para empresas en crecimiento con catálogo variado.' },
  { id: 'enterprise', name: 'Enterprise', limit: Infinity, price: 'S/ 599', icon: <Crown className="w-6 h-6" />, desc: 'Acceso ilimitado para grandes distribuidores.' },
];

const CATEGORIES = [
  { id: 'electronics', label: 'Electrónica de Consumo', icon: <Monitor className="w-4 h-4" />, count: 45 },
  { id: 'components', label: 'Componentes PC', icon: <Cpu className="w-4 h-4" />, count: 120 },
  { id: 'networking', label: 'Networking y Servidores', icon: <Server className="w-4 h-4" />, count: 35 },
  { id: 'mobile', label: 'Dispositivos Móviles', icon: <Smartphone className="w-4 h-4" />, count: 60 },
  { id: 'laptops', label: 'Laptops y Notebooks', icon: <Monitor className="w-4 h-4" />, count: 85 },
  { id: 'peripherals', label: 'Periféricos Gaming', icon: <Cpu className="w-4 h-4" />, count: 150 },
];

export default function ResellerRequestView({ onNavigate, onSubmitRequest }: ResellerRequestViewProps) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    ruc: '',
    company: '',
    address: '',
    email: '',
    phone: '',
    subdomain: '',
    experience: '1 a 3 años',
    plan: 'professional',
    categoryQuantities: {} as Record<string, number>
  });

  const [subdomainStatus, setSubdomainStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle');

  const selectedPlan = PLANS.find(p => p.id === formData.plan) || PLANS[1];
  const currentProductCount = Object.values(formData.categoryQuantities).reduce((acc: number, qty: number) => acc + qty, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Auto-generate subdomain from company name if subdomain is empty or was auto-generated
      if (name === 'company' && (!prev.subdomain || prev.subdomain === prev.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, ''))) {
        newData.subdomain = value.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '');
      }
      
      return newData;
    });

    if (name === 'subdomain') {
      validateSubdomain(value);
    }
  };

  const validateSubdomain = (val: string) => {
    if (val.length < 4) {
      setSubdomainStatus('invalid');
      return;
    }
    if (!/^[a-z0-9-]+$/.test(val)) {
      setSubdomainStatus('invalid');
      return;
    }
    
    setSubdomainStatus('checking');
    // Simulate API check
    setTimeout(() => {
      if (['admin', 'techmarket', 'shop', 'store'].includes(val)) {
        setSubdomainStatus('taken');
      } else {
        setSubdomainStatus('available');
      }
    }, 600);
  };

  const updateCategoryQuantity = (label: string, delta: number) => {
    setFormData(prev => {
      const currentQty = (prev.categoryQuantities[label] as number) || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      // Check total limit
      const newTotal = (currentProductCount as number) - currentQty + newQty;
      if (newTotal > selectedPlan.limit) {
        return prev;
      }

      return {
        ...prev,
        categoryQuantities: {
          ...prev.categoryQuantities,
          [label]: newQty
        }
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const request = {
      ...formData,
      categories: Object.entries(formData.categoryQuantities)
        .filter(([_, qty]) => (qty as number) > 0)
        .map(([label, qty]) => ({ label, quantity: qty as number }))
    };
    onSubmitRequest(request);
    onNavigate('home');
    console.log('Solicitud enviada con éxito. Nos pondremos en contacto pronto.');
  };

  const renderStep1 = () => (
    <div className="space-y-12">
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Nombre de Empresa</label>
            <input 
              name="company"
              type="text" 
              required
              value={formData.company}
              onChange={handleInputChange}
              placeholder="PC Solutions SAC"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">RUC</label>
            <input 
              name="ruc"
              type="text" 
              required
              value={formData.ruc}
              onChange={handleInputChange}
              placeholder="20123456789"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Email de Contacto</label>
            <input 
              name="email"
              type="email" 
              required
              value={formData.email}
              onChange={handleInputChange}
              placeholder="contacto@pcsolutions.com"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Teléfono</label>
            <input 
              name="phone"
              type="tel" 
              required
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="987654321"
              className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700"
            />
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-white/5 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <Smartphone className="w-4 h-4" />
          </div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">🌐 Elige tu Dominio</h3>
        </div>

        <div className="space-y-6">
          <p className="text-slate-400 text-sm font-medium">Tu tienda online será:</p>
          
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex items-center bg-black/40 border border-white/10 rounded-xl px-6 py-4 flex-1 group focus-within:ring-2 focus-within:ring-primary/50 transition-all">
              <span className="text-slate-500 font-bold text-sm">https://</span>
              <input 
                name="subdomain"
                type="text"
                value={formData.subdomain}
                onChange={handleInputChange}
                placeholder="pcsolutions"
                className="bg-transparent border-none outline-none text-sm font-black text-primary px-1 w-full placeholder:text-slate-800"
              />
              <span className="text-slate-500 font-bold text-sm">.techmarket.com</span>
            </div>
          </div>

          <div className="space-y-3">
            {subdomainStatus === 'checking' && (
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest animate-pulse">Verificando disponibilidad...</p>
            )}
            {subdomainStatus === 'available' && (
              <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                <CheckCircle2 className="w-3 h-3" /> {formData.subdomain}.techmarket.com está disponible
              </p>
            )}
            {subdomainStatus === 'taken' && (
              <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> Este subdominio ya está en uso
              </p>
            )}
            {subdomainStatus === 'invalid' && (
              <p className="text-[10px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                <AlertTriangle className="w-3 h-3" /> Mínimo 4 caracteres (letras, números y guiones)
              </p>
            )}
          </div>

          <div className="bg-white/2 rounded-2xl p-6 space-y-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Sugerencias basadas en tu empresa:</p>
            <div className="flex flex-wrap gap-2">
              {['sac', '-peru', '-store'].map(suffix => (
                <button 
                  key={suffix}
                  type="button"
                  onClick={() => {
                    const val = formData.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '') + suffix;
                    setFormData(prev => ({ ...prev, subdomain: val }));
                    validateSubdomain(val);
                  }}
                  className="px-4 py-2 bg-white/5 hover:bg-primary/10 border border-white/5 hover:border-primary/30 rounded-lg text-xs font-bold text-slate-400 hover:text-primary transition-all"
                >
                  {formData.company.toLowerCase().replace(/\s+/g, '').replace(/[^a-z0-9]/g, '')}{suffix}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <button 
        type="button"
        onClick={() => setStep(2)}
        disabled={!formData.company || !formData.ruc || !formData.email || subdomainStatus !== 'available'}
        className="w-full py-6 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Continuar al Paso 2
        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {PLANS.map((plan) => (
          <button
            key={plan.id}
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, plan: plan.id, categoryQuantities: {} }))}
            className={`p-8 rounded-[2rem] border-2 transition-all text-left flex flex-col gap-6 relative overflow-hidden group ${
              formData.plan === plan.id 
                ? 'bg-primary/10 border-primary shadow-xl shadow-primary/10' 
                : 'bg-black/20 border-white/5 hover:border-white/20'
            }`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
              formData.plan === plan.id ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'
            }`}>
              {plan.icon}
            </div>
            <div>
              <h3 className="text-xl font-black text-white uppercase tracking-tight">{plan.name}</h3>
              <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">
                Límite: {plan.limit === Infinity ? 'Ilimitado' : `${plan.limit} productos`}
              </p>
            </div>
            <p className="text-slate-400 text-xs font-medium leading-relaxed">
              {plan.desc}
            </p>
            <div className="mt-auto pt-4 border-t border-white/5">
              <span className="text-2xl font-black text-white">{plan.price}</span>
              <span className="text-slate-500 text-[10px] font-bold uppercase ml-2">/ mes</span>
            </div>
            {formData.plan === plan.id && (
              <div className="absolute top-4 right-4">
                <CheckCircle2 className="w-6 h-6 text-primary" />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="flex gap-4">
        <button 
          type="button"
          onClick={() => setStep(1)}
          className="flex-1 py-6 bg-white/5 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>
        <button 
          type="button"
          onClick={() => setStep(3)}
          className="flex-[2] py-6 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group"
        >
          Continuar al Paso 3
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-8">
      <div className="bg-white/2 border border-white/5 rounded-3xl p-8 space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-black text-white uppercase tracking-tight">Experiencia en el Sector</h3>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Cuéntanos sobre tu trayectoria comercial.</p>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Años de Trayectoria</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {['Menos de 1 año', '1 a 3 años', '3 a 5 años', 'Más de 5 años'].map(exp => (
              <button
                key={exp}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, experience: exp }))}
                className={`p-6 rounded-2xl border-2 transition-all text-left flex items-center justify-between group ${
                  formData.experience === exp 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-black/20 border-white/5 hover:border-white/20'
                }`}
              >
                <span className={`text-sm font-bold ${formData.experience === exp ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                  {exp}
                </span>
                {formData.experience === exp && <CheckCircle2 className="w-5 h-5 text-primary" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Dirección Fiscal Completa</label>
          <textarea 
            name="address"
            required
            value={formData.address}
            onChange={handleInputChange as any}
            placeholder="Calle, Número, Oficina, Ciudad, Departamento"
            rows={3}
            className="w-full bg-black/20 border border-white/10 rounded-xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-slate-700 resize-none"
          />
        </div>
      </div>

      <div className="flex gap-4">
        <button 
          type="button"
          onClick={() => setStep(2)}
          className="flex-1 py-6 bg-white/5 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Volver
        </button>
        <button 
          type="button"
          onClick={() => setStep(4)}
          disabled={!formData.address}
          className="flex-[2] py-6 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Continuar al Paso 4
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => {
    const isOverLimit = (count: number) => (currentProductCount as number) + count > selectedPlan.limit;

    return (
      <div className="space-y-8">
        <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <Box className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plan {selectedPlan.name}</p>
              <p className="text-sm font-black text-white uppercase tracking-tight">
                Seleccionados: <span className={(currentProductCount as number) > selectedPlan.limit ? 'text-rose-500' : 'text-primary'}>
                  {currentProductCount}
                </span> / {selectedPlan.limit === Infinity ? '∞' : selectedPlan.limit}
              </p>
            </div>
          </div>
          {(currentProductCount as number) >= selectedPlan.limit * 0.9 && selectedPlan.limit !== Infinity && (
            <div className="flex items-center gap-2 text-amber-500">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">Límite casi alcanzado</span>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CATEGORIES.map((cat) => {
            const qty = formData.categoryQuantities[cat.label] || 0;
            const canAdd = !isOverLimit(1);

            return (
              <div 
                key={cat.id} 
                className={`flex flex-col p-6 rounded-2xl border-2 transition-all group ${
                  qty > 0 
                    ? 'bg-primary/10 border-primary' 
                    : 'bg-black/20 border-white/5 hover:border-white/20'
                }`}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      qty > 0 ? 'bg-primary text-white' : 'bg-white/5 text-slate-500 group-hover:text-white'
                    }`}>
                      {cat.icon}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold transition-colors ${qty > 0 ? 'text-white' : 'text-slate-400 group-hover:text-white'}`}>
                        {cat.label}
                      </h4>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Máx. {cat.count} disponibles
                      </p>
                    </div>
                  </div>
                  {qty > 0 && <CheckCircle2 className="w-5 h-5 text-primary" />}
                </div>

                <div className="flex items-center justify-between bg-black/40 rounded-xl p-2 border border-white/5">
                  <button 
                    type="button"
                    onClick={() => updateCategoryQuantity(cat.label, -1)}
                    disabled={qty === 0}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-rose-500/20 hover:text-rose-500 transition-all disabled:opacity-20"
                  >
                    -
                  </button>
                  <div className="text-center">
                    <p className="text-lg font-black text-white leading-none">{qty}</p>
                    <p className="text-[8px] font-bold text-slate-500 uppercase tracking-widest mt-1">unidades</p>
                  </div>
                  <button 
                    type="button"
                    onClick={() => updateCategoryQuantity(cat.label, 1)}
                    disabled={!canAdd || qty >= cat.count}
                    className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-white hover:bg-primary/20 hover:text-primary transition-all disabled:opacity-20"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {(currentProductCount as number) >= selectedPlan.limit && selectedPlan.limit !== Infinity && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 text-amber-500">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-xs font-bold">Has alcanzado el límite de tu plan ({selectedPlan.limit} productos). Para agregar más, mejora tu plan.</p>
          </div>
        )}

        <div className="flex gap-4">
          <button 
            type="button"
            onClick={() => setStep(3)}
            className="flex-1 py-6 bg-white/5 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-white/10 transition-all flex items-center justify-center gap-3 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Volver
          </button>
          <button 
            type="submit"
            disabled={(currentProductCount as number) === 0}
            className="flex-[2] py-6 bg-primary text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-primary/80 transition-all shadow-2xl shadow-primary/20 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Enviar Solicitud
            <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Form */}
        <div className="lg:col-span-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em] mb-4">Portal B2B</p>
              <h1 className="text-5xl md:text-6xl font-black text-white uppercase tracking-tighter leading-none">
                Solicitud de Socio
              </h1>
              <p className="text-slate-400 text-lg mt-6 max-w-2xl font-medium">
                Paso {step} de 4: {
                  step === 1 ? 'Información de tu Empresa' : 
                  step === 2 ? 'Elige tu Plan' : 
                  step === 3 ? 'Trayectoria y Ubicación' :
                  'Selección de Productos'
                }
              </p>
            </div>
            
            {/* Step Indicator */}
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4].map((s) => (
                <div 
                  key={s}
                  className={`h-1.5 rounded-full transition-all duration-500 ${
                    s === step ? 'w-12 bg-primary' : s < step ? 'w-6 bg-primary/40' : 'w-6 bg-white/10'
                  }`}
                />
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit} className="bg-[#151921] border border-white/5 rounded-[2rem] p-8 md:p-12">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                {step === 3 && renderStep3()}
                {step === 4 && renderStep4()}
              </motion.div>
            </AnimatePresence>
          </form>
        </div>

        {/* Right Column: Info Card */}
        <div className="lg:col-span-4 space-y-8">
          <div className="bg-gradient-to-br from-[#151921] to-black border border-white/5 rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full -mr-32 -mt-32"></div>
            
            <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center text-white shadow-2xl shadow-primary/30">
              <TrendingUp className="w-8 h-8" />
            </div>

            <div className="space-y-4">
              <h3 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
                Expande tu negocio con TechMarket Smart
              </h3>
              <p className="text-slate-400 font-medium leading-relaxed">
                Únete a la red líder de distribución tecnológica y lleva tu empresa al siguiente nivel con nuestras herramientas B2B.
              </p>
            </div>

            <div className="space-y-6">
              {[
                'Precios mayoristas competitivos',
                'Soporte técnico prioritario 24/7',
                'Gestión de inventario en tiempo real',
                'Línea de crédito para socios Elite'
              ].map((benefit, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-bold text-slate-300 group-hover:text-white transition-colors">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <div className="aspect-video rounded-2xl overflow-hidden bg-white/5 relative group">
                <img 
                  src="https://picsum.photos/seed/office/800/450" 
                  alt="TechMarket Office" 
                  className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
            </div>
          </div>

          <div className="bg-white/2 border border-white/5 rounded-3xl p-8 flex items-center justify-between group cursor-pointer hover:bg-white/5 transition-all">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400">
                <Monitor className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">¿Ya eres socio?</p>
                <p className="text-sm font-black text-white uppercase tracking-tight">Acceder al Portal B2B</p>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Box({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className={className}
    >
      <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
      <path d="m3.3 7 8.7 5 8.7-5"/>
      <path d="M12 22V12"/>
    </svg>
  );
}
