import React, { useState } from 'react';
import { motion } from 'motion/react';
import { MemoryStick as Memory, User, Mail, Lock, ShieldCheck, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface RegisterViewProps {
  onNavigate: (view: 'home' | 'catalog' | 'login' | 'register' | 'pc-builder', step?: number, category?: string) => void;
  onRegister?: () => void;
}

export default function RegisterView({ onNavigate, onRegister }: RegisterViewProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-primary/10 rounded-full blur-[120px]"></div>
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-[120px]"></div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[480px] z-10"
      >
        <div className="bg-slate-900/80 backdrop-blur-sm border border-white/5 rounded-3xl p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-white mb-2">Crear una cuenta</h2>
            <p className="text-slate-400">Únete a la nueva era del hardware inteligente</p>
          </div>

          <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Nombre completo</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                  placeholder="Ej. Juan Pérez" 
                  type="text" 
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Correo electrónico</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                <input 
                  className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                  placeholder="tu@correo.com" 
                  type="email" 
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Contraseña</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    placeholder="••••••••" 
                    type={showPassword ? "text" : "password"} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                  >
                    {showPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Confirmar</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
                  <input 
                    className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-3.5 pl-12 pr-12 text-white placeholder-slate-500 focus:ring-2 focus:ring-primary focus:border-transparent transition-all outline-none" 
                    placeholder="••••••••" 
                    type={showConfirmPassword ? "text" : "password"} 
                  />
                  <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-primary transition-colors"
                  >
                    {showConfirmPassword ? <Eye className="w-5 h-5" /> : <EyeOff className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between text-[11px] uppercase tracking-wider font-bold text-slate-500">
                <span>Fortaleza de contraseña</span>
                <span className="text-primary flex items-center gap-1">
                  Segura <ShieldCheck className="w-3.5 h-3.5" />
                </span>
              </div>
              <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                <div className="h-full w-3/4 bg-primary"></div>
              </div>
            </div>

            <div className="flex items-start gap-3 py-2">
              <input className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900 mt-0.5" id="terms" type="checkbox" />
              <label className="text-sm text-slate-400" htmlFor="terms">
                Acepto los <a className="text-primary hover:underline" href="#">términos y condiciones</a> de TechMarket Smart
              </label>
            </div>

            <button 
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/25 transition-all transform hover:-translate-y-0.5 active:scale-[0.98]" 
              type="submit"
              onClick={() => {
                onRegister?.();
                onNavigate('home');
              }}
            >
              Crear mi cuenta
            </button>
          </form>

          <div className="mt-8 text-center text-sm text-slate-400">
            ¿Ya tienes una cuenta? <button onClick={() => onNavigate('login')} className="text-primary font-bold hover:underline">Inicia sesión aquí</button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
