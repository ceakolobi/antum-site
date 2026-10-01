import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, Zap, Shield, Clock, Users, ArrowRight, Star } from 'lucide-react';

const SUPABASE_URL = 'https://vlqfwdpgdqusugwebfwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscWZ3ZHBnZHF1c3Vnd2ViZnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2MzA0NjQsImV4cCI6MjAzODIwNjQ2NH0.V7IcHHHHCBKxLHEJxTGcBbcq9kgXmNzknbxj8H2UQBE';
const ANTUM_WHATSAPP = '5547988431352';

export const MarinaTeste: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', whatsapp: '', company: '' });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/marina_trials`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=minimal',
        },
        body: JSON.stringify({
          name: form.name.trim(),
          email: form.email.trim().toLowerCase(),
          whatsapp: form.whatsapp.replace(/\D/g, ''),
          company: form.company.trim() || null,
          source: 'landing-marina-teste',
        }),
      });

      if (!res.ok) throw new Error('Erro ao salvar. Tente novamente.');
      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { icon: <MessageSquare className="w-6 h-6" />, title: 'Você se cadastra', desc: 'Preenche o formulário abaixo com nome, e-mail e WhatsApp da sua empresa.' },
    { icon: <Zap className="w-6 h-6" />, title: 'A Marina entra em ação', desc: 'Configuramos a Marina com o perfil da sua empresa em até 24h.' },
    { icon: <CheckCircle2 className="w-6 h-6" />, title: 'Seu WhatsApp responde sozinho', desc: 'A Marina atende, qualifica e vende pelos próximos 30 dias — sem custo.' },
  ];

  const benefits = [
    { icon: <Clock className="w-5 h-5" />, text: 'Atende 24h por dia, 7 dias por semana' },
    { icon: <Users className="w-5 h-5" />, text: 'Qualifica leads e agenda reuniões automaticamente' },
    { icon: <Zap className="w-5 h-5" />, text: 'Responde em segundos, nunca deixa cliente esperando' },
    { icon: <Shield className="w-5 h-5" />, text: 'Sem contratar atendente, sem custo de mão de obra' },
    { icon: <Star className="w-5 h-5" />, text: 'Memória persistente: lembra o histórico de cada cliente' },
    { icon: <MessageSquare className="w-5 h-5" />, text: 'Linguagem natural, parece uma atendente de verdade' },
  ];

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100">

      {/* HERO */}
      <section className="relative pt-28 pb-16 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            30 dias grátis · sem cartão de crédito
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Sua empresa respondendo no{' '}
            <span className="text-cyan-400">WhatsApp 24 horas por dia</span>,{' '}
            sem contratar ninguém
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-8">
            A Marina é uma atendente de IA que responde clientes, qualifica leads e agenda reuniões pelo WhatsApp — automaticamente. Teste por 30 dias, sem pagar nada.
          </p>
          <a
            href="#cadastro"
            className="inline-flex items-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            Quero testar grátis <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </section>

      {/* DOR */}
      <section className="py-14 px-4 bg-slate-900/40">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Você já perdeu cliente por demora no WhatsApp?</h2>
          <p className="text-slate-400 text-base max-w-2xl mx-auto">
            Cada mensagem não respondida a tempo é uma venda que vai para o concorrente. Contratar atendente é caro e não resolve o problema fora do horário comercial. A Marina resolve isso de vez.
          </p>
        </div>
      </section>

      {/* O QUE FAZ */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">O que a Marina faz pela sua empresa</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {benefits.map((b, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
                <span className="text-cyan-400 mt-0.5 shrink-0">{b.icon}</span>
                <span className="text-sm text-slate-300">{b.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-14 px-4 bg-slate-900/40">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Como funciona em 3 passos</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-4 text-cyan-400">
                  {s.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-1">Passo {i + 1}</p>
                <h3 className="font-bold text-white mb-2">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARA QUEM É */}
      <section className="py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-6">Para quem é a Marina?</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm text-slate-300">
            {['Lojas e e-commerces', 'Prestadores de serviço', 'Escritórios e clínicas', 'Imobiliárias', 'Restaurantes e delivery', 'Qualquer negócio que atende pelo WhatsApp'].map((item, i) => (
              <div key={i} className="bg-slate-800/50 border border-slate-700/40 rounded-lg px-4 py-3">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMULÁRIO */}
      <section id="cadastro" className="py-16 px-4 bg-gradient-to-b from-cyan-950/20 to-transparent">
        <div className="max-w-lg mx-auto">
          {submitted ? (
            <div className="text-center bg-slate-800/60 border border-cyan-500/30 rounded-2xl p-10">
              <CheckCircle2 className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Cadastro confirmado! 🎉</h3>
              <p className="text-slate-400 mb-6">
                Recebemos seu cadastro. Em até 24h entramos em contato pelo WhatsApp para configurar sua Marina.
              </p>
              <a
                href={`https://wa.me/${ANTUM_WHATSAPP}?text=Olá!%20Acabei%20de%20me%20cadastrar%20para%20testar%20a%20Marina%20gratuitamente.`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-400 text-white font-bold text-sm px-6 py-3 rounded-xl transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                Falar no WhatsApp agora
              </a>
            </div>
          ) : (
            <div className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
              <h2 className="text-2xl font-bold text-center mb-2">Comece seu teste grátis</h2>
              <p className="text-sm text-slate-400 text-center mb-8">30 dias gratuitos · Sem cartão · Cancele quando quiser</p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nome completo *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Seu nome"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">E-mail *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={form.email}
                    onChange={handleChange}
                    placeholder="seu@email.com"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">WhatsApp da empresa *</label>
                  <input
                    type="tel"
                    name="whatsapp"
                    required
                    value={form.whatsapp}
                    onChange={handleChange}
                    placeholder="(47) 99999-9999"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Nome da empresa</label>
                  <input
                    type="text"
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Sua empresa (opcional)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                  />
                </div>

                <p className="text-xs text-slate-500">
                  Ao se cadastrar você concorda com nossos{' '}
                  <a href="/termos" className="text-cyan-400 hover:underline">Termos de Uso</a>{' '}
                  e{' '}
                  <a href="/privacidade" className="text-cyan-400 hover:underline">Política de Privacidade</a>,
                  e autoriza contato por WhatsApp e e-mail.
                </p>

                {error && <p className="text-red-400 text-sm">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-bold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? 'Enviando...' : (<>Quero testar grátis por 30 dias <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 pb-24">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas frequentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Precisa de contrato ou cartão de crédito?', a: 'Não. O teste de 30 dias é totalmente gratuito, sem necessidade de cartão.' },
              { q: 'Funciona com qualquer WhatsApp?', a: 'Sim, funciona com número comum de WhatsApp. Não é necessário número empresarial da Meta.' },
              { q: 'E depois dos 30 dias?', a: 'Se gostar, oferecemos planos a partir de R$197/mês. Se não quiser continuar, encerramos sem custo e sem burocracia.' },
              { q: 'Quanto tempo para a Marina estar ativa?', a: 'Em até 24 horas úteis após o cadastro, sua Marina já está respondendo clientes.' },
              { q: 'A Marina fala igual a um robô?', a: 'Não! A Marina usa IA de última geração e escreve de forma natural, com pausas e blocos curtos, como uma atendente humana.' },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <p className="font-semibold text-white mb-2">{faq.q}</p>
                <p className="text-sm text-slate-400">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
