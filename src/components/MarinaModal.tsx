import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from '../router/RouterContext';
import { ChatMessage } from '../types';
import {
  X,
  Send,
  Sparkles,
  Bot,
  User,
  CheckCircle2,
  Calendar,
  MessageCircle,
  Clock,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

export const MarinaModal: React.FC = () => {
  const { isMarinaModalOpen, closeMarinaModal, marinaInitialPrompt } = useRouter();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'marina',
      text: 'Olá! Sou a Marina, SDR de Inteligência Artificial da ANTUM.',
      timestamp: 'Agora',
    },
    {
      id: 'init-2',
      sender: 'marina',
      text: 'Fui desenhada para entender seu cenário operacional e identificar como agentes de IA e automação podem eliminar tarefas repetitivas no seu negócio. Qual o principal desafio da sua empresa hoje?',
      timestamp: 'Agora',
    },
  ]);

  const [inputVal, setInputVal] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [leadSaved, setLeadSaved] = useState(false);
  const [showLeadForm, setShowLeadForm] = useState(false);
  const [leadData, setLeadData] = useState({
    name: '',
    company: '',
    contact: '',
    notes: '',
  });

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Handle initial prompt when opened
  useEffect(() => {
    if (isMarinaModalOpen && marinaInitialPrompt) {
      handleUserSend(marinaInitialPrompt);
    }
  }, [isMarinaModalOpen, marinaInitialPrompt]);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeMarinaModal();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [closeMarinaModal]);

  if (!isMarinaModalOpen) return null;

  const quickOptions = [
    'Quero qualificar leads com IA',
    'Automatizar processos manuais em ERP',
    'Conectar IA aos meus sistemas legados',
    'Agendar demonstração técnica',
  ];

  const handleUserSend = async (userText: string) => {
    if (!userText.trim()) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');
    setIsTyping(true);

    try {
      const response = await fetch('/api/chat-marina', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg],
        }),
      });

      const data = await response.json();
      const reply = data.reply || 'Entendi seu ponto. Me conte mais sobre seu volume atual ou ferramentas que sua equipe utiliza.';

      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `marina-${Date.now()}`,
            sender: 'marina',
            text: reply,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
        ]);
        setIsTyping(false);
      }, 500);
    } catch (err) {
      console.error('Error contacting Marina:', err);
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: `marina-${Date.now()}`,
            sender: 'marina',
            text: 'Excelente. Esse é exatamente um dos gargalos que resolvemos na ANTUM. Deixe seu WhatsApp ou e-mail corporativo abaixo para receber um diagnóstico prático.',
            timestamp: 'Agora',
          },
        ]);
        setIsTyping(false);
      }, 400);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!leadData.contact) return;

    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: leadData.name,
          company: leadData.company,
          contact: leadData.contact,
          challenge: leadData.notes || 'Enviado pelo chat com a Marina',
          solutionOfInterest: 'Marina SDR / Automação',
        }),
      });
      setLeadSaved(true);
      setShowLeadForm(false);
      setMessages((prev) => [
        ...prev,
        {
          id: `lead-ok-${Date.now()}`,
          sender: 'marina',
          text: `Perfeito, ${leadData.name || 'obrigada'}! Seus dados foram encaminhados com prioridade para nossos engenheiros. Entraremos em contato com uma análise personalizada da sua operação.`,
          timestamp: 'Agora',
        },
      ]);
    } catch (error) {
      setLeadSaved(true);
      setShowLeadForm(false);
    }
  };

  return (
    <div
      id="marina-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={closeMarinaModal}
    >
      <div
        id="marina-modal-panel"
        className="relative w-full max-w-2xl h-[90vh] max-h-[720px] bg-[#0c121e] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-950/80 flex flex-col overflow-hidden text-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* MODAL HEADER */}
        <div className="p-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-cyan-500/30">
                <Sparkles className="w-5 h-5 text-cyan-200" />
              </div>
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-400 border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-white tracking-wide">
                  Marina — SDR de Inteligência Artificial
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-700/50 font-mono">
                  ANTUM AI
                </span>
              </div>
              <p className="text-xs text-slate-400 flex items-center gap-2">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                Online agora • Triagem comercial autônoma
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowLeadForm(!showLeadForm)}
              className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors hidden sm:inline-flex items-center gap-1.5"
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-400" />
              <span>Agendar Contato</span>
            </button>
            <button
              onClick={closeMarinaModal}
              aria-label="Fechar conversa"
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* LEAD CAPTURE POPUP / FORM OVERLAY */}
        {showLeadForm && (
          <div className="p-4 bg-slate-900 border-b border-cyan-500/30 animate-in slide-in-from-top duration-200">
            <div className="flex justify-between items-center mb-3">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5" />
                Receber Diagnóstico Técnico de Automação
              </h4>
              <button
                onClick={() => setShowLeadForm(false)}
                className="text-xs text-slate-400 hover:text-slate-200"
              >
                Voltar ao chat
              </button>
            </div>
            <form onSubmit={handleLeadSubmit} className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <input
                type="text"
                placeholder="Seu nome"
                value={leadData.name}
                onChange={(e) => setLeadData({ ...leadData, name: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-white"
                required
              />
              <input
                type="text"
                placeholder="Sua empresa"
                value={leadData.company}
                onChange={(e) => setLeadData({ ...leadData, company: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-white"
              />
              <input
                type="text"
                placeholder="WhatsApp ou E-mail corporativo"
                value={leadData.contact}
                onChange={(e) => setLeadData({ ...leadData, contact: e.target.value })}
                className="px-3 py-2 text-xs rounded-lg bg-slate-950 border border-slate-700 focus:border-cyan-400 focus:outline-none text-white"
                required
              />
              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:opacity-90 transition-opacity flex items-center gap-1.5"
                >
                  <span>Enviar para Engenharia</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* CHAT MESSAGES BODY */}
        <div
          id="marina-chat-history"
          className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 bg-slate-950/70"
        >
          {messages.map((msg) => {
            const isMarina = msg.sender === 'marina';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isMarina ? 'justify-start' : 'justify-end'}`}
              >
                {isMarina && (
                  <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] sm:max-w-[75%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-md ${
                    isMarina
                      ? 'bg-slate-900 border border-slate-800 text-slate-200 rounded-tl-sm'
                      : 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-tr-sm shadow-cyan-600/20'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <div
                    className={`mt-1.5 text-[10px] font-mono flex items-center gap-1 ${
                      isMarina ? 'text-slate-500' : 'text-cyan-200/80 justify-end'
                    }`}
                  >
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
                {!isMarina && (
                  <div className="w-7 h-7 rounded-full bg-blue-900 border border-blue-500/40 flex items-center justify-center shrink-0 text-blue-200">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            );
          })}

          {/* TYPING INDICATOR */}
          {isTyping && (
            <div className="flex items-center gap-3 justify-start animate-in fade-in duration-200">
              <div className="w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center shrink-0 text-cyan-300">
                <Sparkles className="w-3.5 h-3.5 animate-spin" />
              </div>
              <div className="bg-slate-900 border border-slate-800 rounded-2xl px-4 py-2.5 flex items-center gap-1.5 text-xs text-slate-400">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                <span className="ml-1 text-[11px] font-mono text-slate-500">Marina formulando resposta...</span>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* QUICK SUGGESTIONS */}
        <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto flex items-center gap-2 no-scrollbar">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-500 shrink-0">
            Sugestões:
          </span>
          {quickOptions.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => handleUserSend(opt)}
              className="text-[11px] font-medium px-3 py-1 rounded-full bg-slate-800 hover:bg-cyan-950 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/50 text-slate-300 transition-all shrink-0 cursor-pointer"
            >
              {opt}
            </button>
          ))}
        </div>

        {/* INPUT BAR */}
        <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleUserSend(inputVal);
            }}
            className="flex items-center gap-2"
          >
            <input
              id="marina-chat-input"
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              placeholder="Digite sua dúvida ou descreva o processo que quer automatizar..."
              className="flex-1 bg-slate-950 border border-slate-700/80 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-400 transition-colors"
            />
            <button
              id="marina-send-button"
              type="submit"
              disabled={!inputVal.trim()}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-cyan-500/20 hover:opacity-95 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Enviar</span>
            </button>
          </form>

          <div className="mt-2 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3" /> Resposta imediata por IA
            </span>
            <span>ANTUM AI Studio • Marina v2.4</span>
          </div>
        </div>
      </div>
    </div>
  );
};
