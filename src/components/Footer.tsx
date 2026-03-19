import React from 'react';
import { MemoryStick as Memory, Share2, Globe, Send, Handshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-[var(--bg-color)] border-t border-[var(--border-color)] pt-16 pb-8 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                <Memory className="text-white w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-[var(--text-color)] uppercase">TechMarket <span className="text-primary">Smart</span></h2>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Líderes en hardware inteligente y custom PCs en Perú. Calidad garantizada y asesoría con IA.
            </p>
            <div className="flex gap-4">
              <a className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all" href="#"><Share2 className="w-4 h-4" /></a>
              <a className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-primary hover:text-white transition-all" href="#"><Globe className="w-4 h-4" /></a>
            </div>
          </div>

          <button 
            type="button"
            onClick={() => onNavigate('reseller-request')}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-sm group cursor-pointer border-none bg-transparent p-0"
          >
            <Handshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Solicitud de Socio Revendedor
          </button>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-[var(--text-color)] uppercase text-xs tracking-widest">Contacto</h4>
          <ul className="space-y-4 text-sm text-slate-400">
            <li className="flex items-center gap-3">
              <span className="text-primary">📞</span>
              <a className="hover:text-primary transition-colors" href="tel:+51987654321">+51 987 654 321</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">✉️</span>
              <a className="hover:text-primary transition-colors" href="mailto:contacto@techmarketsmart.pe">contacto@techmarketsmart.pe</a>
            </li>
            <li className="flex items-center gap-3">
              <span className="text-primary">📍</span>
              <span>Lima, Perú</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-full mx-auto px-4 lg:px-12 border-t border-[var(--border-color)] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
        <p>© 2024 TechMarket Smart. Todos los derechos reservados.</p>
        <div className="flex gap-6">
          <a className="hover:text-white transition-colors" href="#">Privacidad</a>
          <a className="hover:text-white transition-colors" href="#">Seguridad</a>
          <a className="hover:text-white transition-colors" href="#">Cookies</a>
        </div>
      </div>
    </footer>
  );
}
