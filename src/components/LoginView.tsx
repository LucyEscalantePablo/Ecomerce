import React from 'react';
import { motion } from 'motion/react';
import { MemoryStick as Memory, Mail, Lock, Eye, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onNavigate: (view: any, step?: number, category?: string) => void;
  onLogin?: (isAdmin?: boolean) => void;
}

export default function LoginView({ onNavigate, onLogin }: LoginViewProps) {
  const [email, setEmail] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const isAdmin = email.toLowerCase() === 'admin@techmarket.com';
    onLogin?.(isAdmin);
    onNavigate('home');
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%230f5af0' stroke-width='1'%3E%3Cpath d='M40 40h20V20M40 40H20v20M40 0v20M0 40h20M40 80V60M80 40H60'/%3E%3Ccircle cx='40' cy='40' r='2'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-slate-900/60 backdrop-blur-sm border border-white/10 rounded-2xl p-8 md:p-10 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="bg-primary p-3 rounded-xl mb-4 shadow-lg shadow-primary/30">
              <Memory className="text-white w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase mb-1">
              TechMarket <span className="text-primary">Smart</span>
            </h1>
            <p className="text-slate-400 font-medium">¡Hola de nuevo!</p>
            <p className="text-[10px] text-slate-500 mt-2 uppercase tracking-widest font-bold">Tip: Usa admin@techmarket.com para modo admin</p>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Correo electrónico</label>
              <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-primary focus-within:bg-primary/5 transition-all group">
                <Mail className="text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input 
                  className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-600 ml-3 text-sm outline-none" 
                  placeholder="ejemplo@correo.com" 
                  required 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-300 ml-1">Contraseña</label>
              <div className="bg-white/5 border border-white/10 rounded-xl flex items-center px-4 py-3 focus-within:border-primary focus-within:bg-primary/5 transition-all group">
                <Lock className="text-slate-500 group-focus-within:text-primary transition-colors w-5 h-5" />
                <input 
                  className="bg-transparent border-none focus:ring-0 text-white w-full placeholder:text-slate-600 ml-3 text-sm outline-none" 
                  placeholder="••••••••" 
                  required 
                  type={showPassword ? "text" : "password"} 
                />
                <button 
                  className="text-slate-500 hover:text-slate-300 transition-colors" 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <Eye className="w-5 h-5 text-primary" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <label className="flex items-center gap-2 text-slate-400 cursor-pointer">
                <input className="rounded border-slate-700 bg-slate-800 text-primary focus:ring-primary focus:ring-offset-slate-900" type="checkbox" />
                Recordarme
              </label>
              <a className="text-primary hover:text-primary/80 font-semibold transition-colors" href="#">¿Olvidaste tu contraseña?</a>
            </div>

            <button 
              className="w-full py-4 bg-primary hover:bg-primary/90 text-white rounded-xl font-bold text-base transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 mt-2" 
              type="submit"
            >
              Iniciar Sesión
            </button>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-800"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-slate-900 px-2 text-slate-500 font-medium">O continuar con</span>
              </div>
            </div>

            <button className="w-full py-3 bg-white hover:bg-slate-100 text-slate-900 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3" type="button">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="Google" />
              Google
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-slate-400">¿No tienes cuenta?</span>
            <button 
              onClick={() => onNavigate('register')}
              className="text-primary hover:text-primary/80 font-bold ml-1 transition-colors"
            >
              Regístrate aquí
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
