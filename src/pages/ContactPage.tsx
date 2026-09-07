import React, { useState } from 'react';
import { useRouter } from '../router/RouterContext';
import {
  Sparkles,
  Mail,
  MessageSquare,
  MapPin,
  Clock,
  ArrowRight,
  CheckCircle2,
  Phone,
  Send,
  HelpCircle,
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { openMarinaModal } = useRouter();

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    whatsapp: '',
    processType: 'SDR com IA / Vendas',
    volume: '100 a 1.000 transações/mês',
    details: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          company: formData.company,
          contact: `${formData.email} | ${formData.whatsapp}`,
          challenge: `[${formData.processType}] Volume: ${formData.volume}. Detalhes: ${formData.details}`,
          solutionOfInterest: formData.processType,
        }),
      });
      setFormSubmitted(true);
    } catch (err) {
      setFormSubmitted(true);
    }
  };

  const faqs = [
    {
      q: 'Quanto tempo leva para colocar um agente de IA no ar?',
      a: 'Um agente comercial como a Marina costuma entrar em homologação em 5 a 10 dias úteis, incluindo treinamento com seu manual de vendas e integração com CRM e WhatsApp.',
    },
    {
      q: 'Nossos dados de clientes são protegidos pela LGPD?',
      a: 'Sim. Empregamos isolamento estrito de instâncias corporativas. Nenhum dado do seu negócio é utilizado para retreinar modelos públicos de IA.',
    },
    {
      q: 'Preciso trocar meu ERP ou CRM atual?',
      a: 'Não. Nossa premissa de engenharia é conectar a inteligência artificial aos sistemas que você já usa (Salesforce, HubSpot, Totvs, SAP, Omie, etc.) sem interromper sua rotina.',
    },
    {
      q: 'Como funciona a manutenção após o deploy?',
      a: 'Monitoramos a telemetria das conexões 24/7 e fornecemos ajustes contínuos nas respostas do agente conforme seu catálogo de produtos ou serviços evolui.',
    },
  ];

  return (
    <div id="contact-page" className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span>CANAL COMERCIAL & ENGENHARIA</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
            Vamos colocar a tecnologia para trabalhar no seu negócio.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Seja para automatizar o atendimento com a Marina ou desenvolver uma infraestrutura completa de RPA e integrações, nossa equipe técnica está à disposição.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          
          {/* LEFT: DIRECT FAST CHANNELS & MARINA */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* FAST TRACK WITH MARINA */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#0c1628] to-[#091120] border border-cyan-500/40 shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white font-bold">
                  <Sparkles className="w-5 h-5 text-cyan-200" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Resposta em 15 segundos
                  </h3>
                  <span className="text-xs font-mono text-cyan-400">
                    Marina — SDR de Inteligência Artificial
                  </span>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                A forma mais rápida de entender se seu processo pode ser automatizado é conversando com a Marina agora mesmo.
              </p>

              <button
                onClick={() => openMarinaModal('Olá Marina! Gostaria de conversar sobre um projeto para minha empresa.')}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Conversar com a Marina</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* DIRECT CONTACT INFO */}
            <div className="p-6 rounded-3xl bg-[#0e1424] border border-slate-800 space-y-4">
              <h3 className="text-sm font-mono uppercase tracking-wider font-bold text-slate-200">
                Canais Diretos de Atendimento
              </h3>

              <div className="space-y-3 text-xs sm:text-sm text-slate-300">
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <Mail className="w-4 h-4 text-cyan-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">E-mail Corporativo</span>
                    <a href="mailto:contato@antum.com.br" className="hover:text-cyan-300 font-medium">
                      contato@antum.com.br
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <MessageSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">WhatsApp Comercial</span>
                    <a
                      href="https://wa.me/5511999999999?text=Ol%C3%A1%20ANTUM,%20vim%20pelo%20site%20e%20gostaria%20de%20um%20diagn%C3%B3stico."
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-cyan-300 font-medium"
                    >
                      +55 (11) 99999-9999
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                  <MapPin className="w-4 h-4 text-indigo-400 shrink-0" />
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 block">Sede & Engenharia</span>
                    <span className="font-medium">São Paulo, SP — Brasil</span>
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* RIGHT: BRIEFING FORM */}
          <div className="lg:col-span-7">
            <div className="p-8 sm:p-10 rounded-3xl bg-[#0e1424] border border-slate-800 shadow-xl">
              <h2 className="text-2xl font-bold text-white mb-2">
                Envie um Briefing Técnico
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mb-6">
                Preencha os detalhes do seu projeto para receber uma análise preliminar de viabilidade e escopo.
              </p>

              {formSubmitted ? (
                <div className="p-8 rounded-2xl bg-emerald-950/40 border border-emerald-500/50 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="text-lg font-bold text-white">
                    Briefing recebido com sucesso!
                  </h4>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    Nossa equipe de engenharia e a Marina já estão analisando suas informações. Entraremos em contato com uma proposta de arquitetura.
                  </p>
                  <button
                    onClick={() => setFormSubmitted(false)}
                    className="text-xs font-mono text-cyan-400 underline hover:text-cyan-300"
                  >
                    Enviar outro projeto
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Seu Nome *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Ex: Carlos Mendes"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Empresa *</label>
                      <input
                        type="text"
                        required
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        placeholder="Nome da sua empresa"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">E-mail Corporativo *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="nome@empresa.com.br"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">WhatsApp Comercial *</label>
                      <input
                        type="tel"
                        required
                        value={formData.whatsapp}
                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                        placeholder="(11) 90000-0000"
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Solução de Interesse</label>
                      <select
                        value={formData.processType}
                        onChange={(e) => setFormData({ ...formData, processType: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="SDR com IA / Vendas">Marina — SDR com IA</option>
                        <option value="Automação de Workflows">Antum Flow (Automações)</option>
                        <option value="RPA Sistemas Legados">Nexus RPA (Sistemas Legados)</option>
                        <option value="Integrações CRM/ERP">SyncBridge (Conectores de Dados)</option>
                        <option value="Documentos e Backoffice">PulseOps (Inteligência Documental)</option>
                        <option value="Plataforma SaaS Sob Medida">Desenvolvimento SaaS Sob Medida</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-mono text-slate-300">Volume Estimado</label>
                      <select
                        value={formData.volume}
                        onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                      >
                        <option value="Menos de 100 transações/mês">Menos de 100 transações/mês</option>
                        <option value="100 a 1.000 transações/mês">100 a 1.000 transações/mês</option>
                        <option value="1.000 a 10.000 transações/mês">1.000 a 10.000 transações/mês</option>
                        <option value="Mais de 10.000 transações/mês">Mais de 10.000 transações/mês</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-mono text-slate-300">
                      Descreva o processo atual ou gargalo
                    </label>
                    <textarea
                      rows={4}
                      value={formData.details}
                      onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                      placeholder="Ex: Nossos leads chegam pelo site e demoram 3 horas para receber contato. Gostaríamos de qualificar automaticamente e enviar para a agenda do vendedor..."
                      className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs sm:text-sm focus:border-cyan-400 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Enviar Briefing para Engenharia</span>
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

        {/* FAQS SECTION */}
        <div className="p-8 sm:p-12 rounded-3xl bg-[#0e1424] border border-slate-800">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Dúvidas Frequentes
            </span>
            <h3 className="text-2xl font-bold text-white mt-1">
              Perguntas sobre contratação e implantação
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800/80 space-y-2">
                <h4 className="text-sm font-bold text-white flex items-start gap-2">
                  <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{faq.q}</span>
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed pl-6">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
