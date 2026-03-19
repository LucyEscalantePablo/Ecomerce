import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Send, X, MessageSquare, User } from 'lucide-react';
import { getLisiResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
  timestamp: string;
}

export default function LisiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: '¡Hola! Soy Lisi, tu asistente experta en tecnología. ¿En qué puedo ayudarte hoy?', 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage, timestamp }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getLisiResponse(userMessage, history);
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: response, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } catch (error) {
      setMessages(prev => [...prev, { 
        role: 'model', 
        text: 'Hubo un error al conectar con mis circuitos. Inténtalo de nuevo.', 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[1000]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed bottom-28 right-6 w-[350px] sm:w-[400px] h-[600px] max-h-[calc(100vh-140px)] bg-[#1A1F2B] border border-blue-500/20 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden z-[1001]"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-6 flex items-center justify-between shrink-0 relative z-10">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20 overflow-hidden">
                    <img 
                      src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
                      alt="Lisi" 
                      className="w-10 h-10 object-contain"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-blue-600 rounded-full" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg uppercase tracking-tight leading-none">Lisi Assistant</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold text-blue-100 uppercase tracking-widest">En línea</span>
                  </div>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="text-white/70 hover:text-white transition-colors p-2 rounded-xl hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef} 
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar bg-[#1A1F2B] bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"
            >
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-3 max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-1 overflow-hidden ${
                      msg.role === 'user' ? 'bg-blue-600' : 'bg-slate-800 border border-white/10'
                    }`}>
                      {msg.role === 'user' ? (
                        <User className="w-4 h-4 text-white" />
                      ) : (
                        <img 
                          src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
                          alt="Lisi" 
                          className="w-6 h-6 object-contain"
                          referrerPolicy="no-referrer"
                        />
                      )}
                    </div>
                    <div className="space-y-1">
                      <div className={`p-4 rounded-2xl text-sm font-medium leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-blue-600 text-white rounded-tr-none shadow-lg shadow-blue-600/20' 
                          : 'bg-[#252B3B] text-slate-100 rounded-tl-none border border-white/5'
                      }`}>
                        {msg.text}
                      </div>
                      <p className={`text-[9px] font-bold text-slate-500 uppercase tracking-widest ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-[#252B3B] border border-white/5 p-4 rounded-2xl rounded-tl-none flex gap-2">
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                    <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-6 bg-[#1A1F2B] border-t border-white/5 shrink-0">
              <div className="relative flex items-center gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-[#252B3B] border border-white/10 rounded-2xl px-6 py-4 text-sm font-bold text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-700"
                />
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || isLoading}
                  className="w-14 h-14 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-blue-600/20 disabled:opacity-50"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center shadow-2xl transition-all duration-500 overflow-hidden ${
          isOpen ? 'bg-slate-800 text-white rotate-90' : 'bg-blue-600 text-white'
        }`}
      >
        {isOpen ? (
          <X className="w-8 h-8" />
        ) : (
          <img 
            src="https://cdn-icons-png.flaticon.com/512/4712/4712035.png" 
            alt="Lisi" 
            className="w-12 h-12 object-contain"
            referrerPolicy="no-referrer"
          />
        )}
      </motion.button>
    </div>
  );
}
