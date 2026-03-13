import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Bell, Mail, Smartphone, Save, ArrowLeft, Shield } from 'lucide-react';

interface SettingsViewProps {
  onNavigate: (view: any) => void;
}

export default function SettingsView({ onNavigate }: SettingsViewProps) {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [webNotifications, setWebNotifications] = useState(true);
  const [priceAlerts, setPriceAlerts] = useState(true);
  const [stockAlerts, setStockAlerts] = useState(false);

  return (
    <div className="py-12 max-w-4xl mx-auto">
      <div className="mb-12">
        <button 
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-slate-500 hover:text-primary transition-colors text-xs font-bold uppercase tracking-widest mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Volver al Inicio
        </button>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Configuración de Alertas</h1>
        <p className="text-slate-500 text-sm mt-2">Personaliza cómo y cuándo quieres recibir noticias sobre tus productos favoritos.</p>
      </div>

      <div className="bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-500/20 rounded-3xl p-8 mb-12 flex items-center gap-6">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-primary/30 shrink-0">
          <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=200&h=200" alt="Lisi" className="w-full h-full object-cover" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white">¡Hola, soy Lisi!</h3>
          <p className="text-slate-400 italic">"Configura tus preferencias para que solo te avise de lo que realmente te importa."</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Preferencias de Comunicación</h3>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between group">
              <div>
                <p className="text-sm font-bold text-white">Alertas por Email</p>
                <p className="text-[10px] text-slate-500">Recibe resúmenes diarios en tu bandeja de entrada</p>
              </div>
              <button 
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={`w-12 h-6 rounded-full transition-all relative ${emailAlerts ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${emailAlerts ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-sm font-bold text-white">Notificaciones Web</p>
                <p className="text-[10px] text-slate-500">Alertas en tiempo real mientras navegas</p>
              </div>
              <button 
                onClick={() => setWebNotifications(!webNotifications)}
                className={`w-12 h-6 rounded-full transition-all relative ${webNotifications ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${webNotifications ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-sm font-bold text-white">Alertas de bajada de precio (&gt;10%)</p>
                <p className="text-[10px] text-slate-500">Solo avisos con descuentos significativos</p>
              </div>
              <button 
                onClick={() => setPriceAlerts(!priceAlerts)}
                className={`w-12 h-6 rounded-full transition-all relative ${priceAlerts ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${priceAlerts ? 'left-7' : 'left-1'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between group">
              <div>
                <p className="text-sm font-bold text-white">Aviso de stock inmediato</p>
                <p className="text-[10px] text-slate-500">Prioridad máxima cuando un item vuelve a estar disponible</p>
              </div>
              <button 
                onClick={() => setStockAlerts(!stockAlerts)}
                className={`w-12 h-6 rounded-full transition-all relative ${stockAlerts ? 'bg-primary' : 'bg-slate-800'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${stockAlerts ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#151921] border border-white/5 rounded-3xl p-8 space-y-8">
          <div className="flex items-center gap-3 mb-2">
            <Smartphone className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Canales de Alerta</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Correo electrónico para alertas</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="email" 
                  defaultValue="juan.perez@email.com"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Número de celular (SMS)</label>
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <input 
                  type="tel" 
                  defaultValue="+51 987 654 321"
                  className="w-full bg-slate-900/50 border border-white/10 rounded-xl pl-12 pr-4 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
              <p className="text-[10px] text-slate-600 ml-1">Solo se usará para alertas críticas de stock limitado.</p>
            </div>

            <button className="w-full py-4 bg-primary text-white rounded-xl font-black uppercase tracking-widest hover:bg-primary/80 transition-all shadow-lg shadow-primary/20 flex items-center justify-center gap-2">
              <Save className="w-4 h-4" /> Guardar Cambios
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
