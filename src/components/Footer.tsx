import React from 'react';
import { MemoryStick as Memory, Share2, Globe, Send, Handshake } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: any) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  return (
    <footer className="bg-slate-900 border-t border-slate-800 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
        <div className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="bg-primary p-1.5 rounded-lg">
                <Memory className="text-white w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold tracking-tight text-white uppercase">TechMarket <span className="text-primary">Smart</span></h2>
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
            onClick={(e) => {
              e.preventDefault();
              onNavigate('reseller-request');
            }}
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-sm group cursor-pointer"
          >
            <Handshake className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Solicitud de Socio Revendedor
          </button>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Explorar</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="#">Nuevos Ingresos</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">PC Armadas</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Componentes Top</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Outlet</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Soporte</h4>
          <ul className="space-y-3 text-sm text-slate-400">
            <li><a className="hover:text-primary transition-colors" href="#">Centro de Ayuda</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Garantía</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Envíos</a></li>
            <li><a className="hover:text-primary transition-colors" href="#">Términos y Condiciones</a></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 text-white uppercase text-xs tracking-widest">Contacto</h4>
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

      <div className="max-w-7xl mx-auto px-4 border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-slate-500 uppercase tracking-widest">
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
