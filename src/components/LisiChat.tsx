import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Send, X, Minimize2, Maximize2 } from 'lucide-react';
import { getLisiResponse } from '../services/geminiService';

interface Message {
  role: 'user' | 'model';
  text: string;
}

export default function LisiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { role: 'model', text: '¡Hola! Soy Lisi ¿En qué componente te ayudo hoy?' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await getLisiResponse(userMessage, history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'model', text: 'Hubo un error al conectar con mis circuitos. Inténtalo de nuevo.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[500px] bg-slate-900 border border-primary/30 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-bold text-sm">Lisi - Asistente IA</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="text-white/70 text-[10px] uppercase font-bold tracking-wider">En línea</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white/70 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar bg-slate-900/50">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-primary text-white rounded-tr-none' 
                      : 'bg-slate-800 text-slate-100 rounded-tl-none border border-slate-700'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-100 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                    <div className="flex gap-1">
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-1.5 h-1.5 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-4 bg-slate-800/50 border-t border-slate-700">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu consulta..."
                  className="flex-1 bg-slate-900 border-none rounded-xl px-4 py-2 text-sm text-white focus:ring-2 focus:ring-primary outline-none"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="bg-primary hover:bg-primary/90 text-white p-2 rounded-xl transition-all disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-primary text-white rounded-full shadow-2xl shadow-primary/40 flex items-center justify-center relative group"
      >
        <Bot className="w-8 h-8 group-hover:rotate-12 transition-transform" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 border-2 border-slate-900 rounded-full animate-pulse" />
        {!isOpen && (
          <span className="absolute right-full mr-4 bg-slate-900 text-white px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-primary/30 shadow-2xl">
            ¡Hola! Soy Lisi ¿En qué componente te ayudo?
          </span>
        )}
      </motion.button>
    </div>
  );
}
