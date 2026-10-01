import React, { useState } from 'react';
import { CheckCircle2, MessageSquare, ArrowRight, Zap, Target, Clock, Calendar, Users } from 'lucide-react';

const SUPABASE_URL = 'https://vlqfwdpgdqusugwebfwx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZscWZ3ZHBnZHF1c3Vnd2ViZnd4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjI2MzA0NjQsImV4cCI6MjAzODIwNjQ2NH0.V7IcHHHHCBKxLHEJxTGcBbcq9kgXmNzknbxj8H2UQBE';
const ANTUM_WHATSAPP = '5547988431352';

const CTA_HREF = '#cadastro';

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

  const CtaButton = ({ label = 'QUERO TESTAR A MARINA GRÁTIS', className = '' }) => (
    <a
      href={CTA_HREF}
      className={`inline-flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider px-8 py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/25 ${className}`}
    >
      {label} <ArrowRight className="w-4 h-4 shrink-0" />
    </a>
  );

  const Guarantee = () => (
    <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-4 text-sm text-slate-400">
      <span>✅ Sem cartão de crédito</span>
      <span>✅ Sem contrato</span>
      <span>✅ Sem compromisso</span>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100">

      {/* HERO */}
      <section className="relative pt-28 pb-20 px-4 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/40 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <span className="inline-block bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Teste grátis por 30 dias · Sem cartão de crédito
          </span>
          <p className="text-slate-400 text-base mb-3">Sua próxima venda pode estar acontecendo agora.</p>
          <h1 className="text-4xl sm:text-5xl font-extrabold leading-tight mb-6">
            Enquanto você trabalha,{' '}
            <span className="text-cyan-400">a Marina conversa com seus clientes.</span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto mb-4 leading-relaxed">
            Imagine receber um lead no WhatsApp às 23h... e, em vez de ele esperar até amanhã, <strong className="text-white">alguém responder na hora.</strong>
          </p>
          <p className="text-base text-slate-400 max-w-2xl mx-auto mb-8">
            Esse alguém é a <strong className="text-cyan-400">Marina</strong> — uma SDR de Inteligência Artificial que trabalha pelo seu WhatsApp, responde seus leads, faz a qualificação, realiza o follow-up e agenda reuniões. <strong className="text-white">24 horas por dia. 7 dias por semana.</strong>
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-slate-300 text-sm mb-10">
            <span>Sem férias.</span>
            <span>Sem atrasos.</span>
            <span>Sem esquecer de responder.</span>
          </div>
          <CtaButton label="🚀 QUERO TESTAR A MARINA GRÁTIS" />
          <Guarantee />
        </div>
      </section>

      {/* WHATSAPP MOCKUP */}
      <section className="py-14 px-4 bg-slate-900/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-center mb-2 text-slate-300">Veja a Marina em ação</h2>
          <p className="text-center text-slate-500 text-sm mb-8">Uma conversa real, às 23h, enquanto você dormia.</p>
          <div className="flex flex-col sm:flex-row gap-6 items-start justify-center">
            {/* Phone frame */}
            <div className="w-full sm:w-72 mx-auto sm:mx-0 bg-[#111b21] rounded-3xl border border-slate-700/50 shadow-2xl shadow-cyan-500/5 overflow-hidden">
              {/* WhatsApp header */}
              <div className="bg-[#1f2c34] px-4 py-3 flex items-center gap-3 border-b border-slate-700/30">
                {/* Avatar Marina */}
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center text-slate-950 font-extrabold text-sm shrink-0">M</div>
                <div>
                  <p className="text-white text-sm font-semibold leading-tight">Marina</p>
                  <p className="text-green-400 text-xs">online</p>
                </div>
                <div className="ml-auto flex gap-3 text-slate-500">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M17 12a5 5 0 1 0-10 0 5 5 0 0 0 10 0zm2 0a7 7 0 1 1-14 0 7 7 0 0 1 14 0zm-7-9v2m0 14v2m9-9h-2M4 12H2m15.36-6.36-1.41 1.41M6.05 17.95l-1.41 1.41M17.95 17.95l-1.41-1.41M6.05 6.05 4.64 7.46"/></svg>
                </div>
              </div>
              {/* Messages */}
              <div className="px-3 py-4 space-y-3 bg-[#0b141a] min-h-[340px]">
                {/* Lead message */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-white leading-snug">Olá! Vi o anúncio de vocês. Quero saber mais sobre o serviço</p>
                    <p className="text-xs text-slate-500 text-right mt-1">23:07 ✓</p>
                  </div>
                </div>
                {/* Marina responde */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm text-white leading-snug">Olá! Sou a Marina 😊 Fico feliz que tenha entrado em contato! Pode me contar um pouco mais sobre o que você precisa?</p>
                    <p className="text-xs text-slate-400 text-right mt-1">23:07 ✓✓</p>
                  </div>
                </div>
                {/* Lead */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-white leading-snug">Tenho uma loja e preciso de alguém pra responder clientes no whats</p>
                    <p className="text-xs text-slate-500 text-right mt-1">23:09 ✓</p>
                  </div>
                </div>
                {/* Marina qualifica */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm text-white leading-snug">Entendi! Atualmente quantos clientes chegam pelo WhatsApp por semana, em média?</p>
                    <p className="text-xs text-slate-400 text-right mt-1">23:09 ✓✓</p>
                  </div>
                </div>
                {/* Lead responde */}
                <div className="flex justify-start">
                  <div className="bg-[#202c33] rounded-2xl rounded-tl-sm px-4 py-2.5 max-w-[80%]">
                    <p className="text-sm text-white leading-snug">umas 30 talvez mais</p>
                    <p className="text-xs text-slate-500 text-right mt-1">23:11 ✓</p>
                  </div>
                </div>
                {/* Marina fecha */}
                <div className="flex justify-end">
                  <div className="bg-[#005c4b] rounded-2xl rounded-tr-sm px-4 py-2.5 max-w-[85%]">
                    <p className="text-sm text-white leading-snug">Perfeito! Tenho uma solução ideal para você. Posso agendar uma conversa rápida com nossa equipe ainda essa semana?</p>
                    <p className="text-xs text-slate-400 text-right mt-1">23:11 ✓✓</p>
                  </div>
                </div>
                {/* horario */}
                <div className="flex justify-center">
                  <span className="text-xs text-slate-500 bg-[#182229] px-3 py-1 rounded-full">23h11 · Essa conversa aconteceu enquanto você dormia</span>
                </div>
              </div>
            </div>
            {/* Explicação ao lado */}
            <div className="flex flex-col gap-4 justify-center sm:pt-8 max-w-xs">
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">1</span>
                <p className="text-sm text-slate-400">Lead entra em contato às <strong className="text-white">23h07</strong></p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">2</span>
                <p className="text-sm text-slate-400">Marina responde em <strong className="text-white">segundos</strong>, inicia a conversa</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">3</span>
                <p className="text-sm text-slate-400">Faz as <strong className="text-white">perguntas certas</strong> para qualificar</p>
              </div>
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">4</span>
                <p className="text-sm text-slate-400"><strong className="text-white">Agenda a reunião</strong> — lead qualificado esperando você</p>
              </div>
              <div className="mt-2 bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                <p className="text-sm text-cyan-300 font-semibold">Você acorda com um lead qualificado esperando.</p>
                <p className="text-xs text-slate-400 mt-1">Enquanto seu concorrente respondeu só de manhã.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DOR */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
            Quantos clientes você pode estar perdendo sem perceber?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-slate-300 text-sm">
            {[
              'Um cliente manda uma mensagem. Você está ocupado.',
              'Sua equipe não viu. É noite. É fim de semana.',
              'Ninguém fez o follow-up a tempo.',
              'Ele continua procurando... e compra de quem respondeu primeiro.',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-slate-800/50 border border-red-500/20 rounded-xl p-4">
                <span className="text-red-400 mt-0.5">⚠️</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
          <div className="text-center bg-slate-800/60 border border-slate-700/50 rounded-2xl p-8">
            <p className="text-slate-400 text-base mb-2">Você investiu em anúncio. Criou seu site. Tem um ótimo produto.</p>
            <p className="text-slate-400 text-base mb-4">Conseguiu gerar o lead.</p>
            <p className="text-xl font-bold text-white">Mas você não consegue atender todos eles na hora certa.</p>
            <p className="text-cyan-400 font-semibold mt-3">É exatamente aí que a Marina entra.</p>
          </div>
        </div>
      </section>

      {/* O QUE A MARINA FAZ */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          {/* Marina persona */}
          <div className="flex flex-col items-center mb-10">
            {/* Avatar ilustrado */}
            <div className="relative mb-5">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 via-cyan-500 to-teal-600 flex items-center justify-center shadow-xl shadow-cyan-500/30">
                <svg viewBox="0 0 100 100" className="w-16 h-16" fill="none">
                  {/* Rosto simples estilizado */}
                  <circle cx="50" cy="38" r="22" fill="#0b0f17" opacity="0.6"/>
                  {/* Cabelo */}
                  <ellipse cx="50" cy="22" rx="22" ry="12" fill="#1e293b"/>
                  <ellipse cx="30" cy="34" rx="6" ry="14" fill="#1e293b"/>
                  <ellipse cx="70" cy="34" rx="6" ry="14" fill="#1e293b"/>
                  {/* Rosto */}
                  <circle cx="50" cy="38" r="18" fill="#f8d5b0"/>
                  {/* Olhos */}
                  <ellipse cx="43" cy="36" rx="3" ry="3.5" fill="#1e293b"/>
                  <ellipse cx="57" cy="36" rx="3" ry="3.5" fill="#1e293b"/>
                  <circle cx="44" cy="34.5" r="1" fill="white"/>
                  <circle cx="58" cy="34.5" r="1" fill="white"/>
                  {/* Sorriso */}
                  <path d="M44 44 Q50 49 56 44" stroke="#c97b5a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
                  {/* Corpo */}
                  <rect x="32" y="60" width="36" height="30" rx="8" fill="#0891b2"/>
                  {/* Crachá */}
                  <rect x="43" y="66" width="14" height="9" rx="2" fill="white" opacity="0.9"/>
                  <text x="50" y="73" textAnchor="middle" fontSize="4" fill="#0891b2" fontWeight="bold">SDR</text>
                </svg>
              </div>
              {/* Online badge */}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-green-400 rounded-full border-2 border-[#0b0f17] flex items-center justify-center">
                <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse"></div>
              </div>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2">Conheça a Marina, sua nova SDR de IA.</h2>
            <div className="flex items-center gap-2 mb-4">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span className="text-green-400 text-sm font-medium">Online agora · Disponível 24h</span>
            </div>
            <p className="text-center text-slate-400 max-w-lg">Ela conversa com seus leads pelo WhatsApp como uma integrante da sua equipe comercial.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              { icon: <Zap className="w-5 h-5" />, title: 'Responde imediatamente', desc: 'O lead não precisa esperar você voltar ao computador. A Marina inicia e conduz a conversa rapidamente, inclusive fora do horário comercial.' },
              { icon: <Target className="w-5 h-5" />, title: 'Qualifica automaticamente', desc: 'Ela faz as perguntas certas para entender o interesse, necessidade e perfil de cada lead. Você não perde tempo com contatos que ainda não estão prontos.' },
              { icon: <MessageSquare className="w-5 h-5" />, title: 'Faz follow-up', desc: 'O lead parou de responder? A Marina continua o acompanhamento conforme as regras do seu negócio. Sem planilhas, sem lembretes, sem depender da memória de alguém.' },
              { icon: <Calendar className="w-5 h-5" />, title: 'Agenda reuniões', desc: 'Quando o prospect está pronto, a Marina conduz o agendamento e encaminha a oportunidade para sua equipe.' },
              { icon: <Clock className="w-5 h-5" />, title: '24h por dia, 7 dias por semana', desc: 'Atende de madrugada, no fim de semana, no feriado. Quando seu cliente manda mensagem, tem alguém para responder.' },
              { icon: <Users className="w-5 h-5" />, title: 'Passa para um humano', desc: 'O cliente quer falar com uma pessoa? Sem problema. Você assume a conversa quando quiser. A Marina trabalha para a sua equipe — não para substituir o relacionamento humano.' },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-4 bg-slate-800/50 border border-slate-700/40 rounded-xl p-5">
                <span className="text-cyan-400 mt-0.5 shrink-0">{item.icon}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARATIVO */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-4">
            E se você tivesse alguém no seu comercial 24 horas por dia?
          </h2>
          <p className="text-center text-slate-400 mb-10">Um SDR humano precisa de horário. Precisa parar. A Marina não precisa dormir.</p>
          <div className="overflow-x-auto rounded-xl border border-slate-700/50">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-800/80">
                  <th className="text-left px-5 py-4 text-slate-400 font-semibold w-1/3"></th>
                  <th className="text-center px-5 py-4 text-slate-400 font-semibold">SDR Humano</th>
                  <th className="text-center px-5 py-4 text-cyan-400 font-bold">Marina SDR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/40">
                {[
                  ['Atendimento', 'Horário de trabalho', '24h / 7 dias'],
                  ['Resposta aos leads', 'Depende da disponibilidade', 'Automática'],
                  ['Follow-up', 'Manual', 'Automatizado'],
                  ['Leads simultâneos', 'Limitados pela equipe', 'Escalável'],
                  ['Férias e ausências', 'Sim', 'Não existe'],
                  ['Custo', 'Milhares por mês', 'A partir de R$ 29,90/mês'],
                ].map(([label, human, marina], i) => (
                  <tr key={i} className="bg-slate-800/30 hover:bg-slate-800/50 transition">
                    <td className="px-5 py-4 text-slate-300 font-medium">{label}</td>
                    <td className="px-5 py-4 text-center text-slate-400">{human}</td>
                    <td className="px-5 py-4 text-center text-cyan-400 font-semibold">{marina}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-center text-slate-400 text-sm mt-6">
            Não é sobre substituir sua equipe. É sobre fazer sua equipe receber <strong className="text-white">mais oportunidades prontas para vender.</strong>
          </p>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section className="py-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">Veja como é simples</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { n: '1', title: 'Você conecta seu WhatsApp', desc: 'A configuração é simples e nossa equipe ajuda você durante todo o processo.' },
              { n: '2', title: 'A Marina aprende sobre o seu negócio', desc: 'Você define seus produtos, serviços, público e regras de atendimento.' },
              { n: '3', title: 'Ela começa a conversar com seus leads', desc: 'A Marina responde, entende, qualifica e acompanha os contatos automaticamente.' },
              { n: '4', title: 'Você entra quando é hora de vender', desc: 'Em vez de perder tempo procurando oportunidades, sua equipe se concentra nos leads que realmente avançaram.' },
            ].map((s, i) => (
              <div key={i} className="flex items-start gap-4 bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <span className="w-9 h-9 rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-extrabold text-lg flex items-center justify-center shrink-0">{s.n}</span>
                <div>
                  <h3 className="font-bold text-white mb-1">{s.title}</h3>
                  <p className="text-sm text-slate-400 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTE SEM RISCO */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Você não precisa acreditar em mim.</h2>
          <p className="text-2xl font-bold text-cyan-400 mb-8">TESTE.</p>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            Coloque a Marina para trabalhar durante <strong className="text-white">30 dias gratuitamente</strong>. Você não precisa comprar primeiro para descobrir se funciona. Pode experimentar, acompanhar as conversas, ver como ela atende seus leads e avaliar se faz sentido para o seu negócio.
          </p>
          <div className="bg-slate-800/60 border border-cyan-500/20 rounded-2xl p-8 mb-8">
            <p className="text-slate-400 font-semibold mb-4">E o risco? <strong className="text-white">Praticamente nenhum.</strong></p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm text-slate-300 text-left">
              {['30 dias grátis', 'Sem cartão de crédito', 'Sem contrato de fidelidade', 'Sem compromisso', 'Sem obrigação de continuar'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
          <p className="text-slate-300 text-lg mb-2">Gostou? Continue.</p>
          <p className="text-slate-300 text-lg mb-8">Não gostou? É só não continuar. <strong className="text-white">Simples assim.</strong></p>
          <CtaButton />
          <Guarantee />
        </div>
      </section>

      {/* PLANOS */}
      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">Quanto custa ter uma SDR de IA?</h2>
          <p className="text-slate-400 mb-10">Mas você não precisa pagar agora. Primeiro você testa.</p>
          <div className="bg-slate-800/60 border border-cyan-500/30 rounded-2xl p-8 mb-6 inline-block w-full max-w-sm mx-auto">
            <p className="text-slate-400 text-sm font-semibold uppercase tracking-widest mb-2">Marina SDR</p>
            <p className="text-5xl font-extrabold text-cyan-400 mb-1">R$ 29,90</p>
            <p className="text-slate-400 text-sm mb-6">/mês após o período gratuito</p>
            <div className="space-y-2 text-sm text-slate-300 text-left mb-6">
              {['Agente SDR de IA no WhatsApp', 'Qualificação de leads', 'Follow-up automático', 'Agendamento de reuniões', 'Transferência para humano', 'Painel para acompanhar leads'].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
            <CtaButton label="TESTAR 30 DIAS GRÁTIS" className="w-full" />
          </div>
          <p className="text-slate-500 text-sm">Sem contrato de fidelidade. Cancele quando quiser.</p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-16 px-4 bg-slate-900/50">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4">Seu lead já está chegando.</h2>
          <p className="text-slate-400 text-lg mb-2">A pergunta é:</p>
          <p className="text-xl font-bold text-white mb-8">Quem vai responder?</p>
          <p className="text-slate-400 mb-2">Você? Amanhã? Quando tiver tempo?</p>
          <p className="text-cyan-400 font-semibold text-lg mb-8">Ou a Marina pode responder <strong>agora</strong>?</p>
          <p className="text-slate-300 mb-8">Não deixe um lead quente virar oportunidade para o seu concorrente.</p>
          <CtaButton label="QUERO MINHA MARINA GRÁTIS" />
          <Guarantee />
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
                href={`https://wa.me/${ANTUM_WHATSAPP}?text=Ol%C3%A1!%20Acabei%20de%20me%20cadastrar%20para%20testar%20a%20Marina%20gratuitamente.`}
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
              <h2 className="text-2xl font-bold text-center mb-2">Comece seu teste gratuito</h2>
              <p className="text-sm text-slate-400 text-center mb-8">30 dias · R$ 0 para começar · Sem cartão · Sem compromisso</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                {[
                  { label: 'Nome', name: 'name', type: 'text', placeholder: 'Digite seu nome', required: true },
                  { label: 'WhatsApp', name: 'whatsapp', type: 'tel', placeholder: '(00) 00000-0000', required: true },
                  { label: 'E-mail', name: 'email', type: 'email', placeholder: 'voce@empresa.com.br', required: true },
                  { label: 'Empresa (opcional)', name: 'company', type: 'text', placeholder: 'Nome da sua empresa', required: false },
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">{field.label}</label>
                    <input
                      type={field.type}
                      name={field.name}
                      required={field.required}
                      value={form[field.name as keyof typeof form]}
                      onChange={handleChange}
                      placeholder={field.placeholder}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition"
                    />
                  </div>
                ))}
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
                  className="w-full bg-cyan-500 hover:bg-cyan-400 disabled:opacity-60 text-slate-950 font-extrabold text-sm uppercase tracking-wider py-4 rounded-xl transition-all shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2"
                >
                  {loading ? 'Enviando...' : (<>QUERO TESTAR A MARINA POR 30 DIAS GRÁTIS <ArrowRight className="w-4 h-4" /></>)}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-14 px-4 pb-32">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Perguntas frequentes</h2>
          <div className="space-y-4">
            {[
              { q: 'Preciso entender de tecnologia?', a: 'Não. A configuração é orientada pela nossa equipe e a proposta é deixar a operação simples para você.' },
              { q: 'A Marina fala como um robô?', a: 'Não é essa a proposta. A Marina utiliza IA para conduzir conversas naturais, seguindo as informações, regras e contexto definidos para o seu negócio.' },
              { q: 'Posso assumir a conversa quando quiser?', a: 'Sim. Quando for necessário, o atendimento pode ser transferido para uma pessoa da sua equipe.' },
              { q: 'Ela funciona 24 horas?', a: 'Sim. A proposta da Marina é atender seus leads continuamente, inclusive fora do horário comercial.' },
              { q: 'Preciso colocar cartão para começar o teste?', a: 'Não. O teste de 30 dias é totalmente gratuito, sem necessidade de cartão de crédito.' },
              { q: 'Depois dos 30 dias sou obrigado a continuar?', a: 'Não. Você experimenta a Marina durante o período gratuito e decide se quer continuar. Se não gostar, simplesmente não continua.' },
            ].map((faq, i) => (
              <div key={i} className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-5">
                <p className="font-semibold text-white mb-2">{faq.q}</p>
                <p className="text-sm text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FIXO MOBILE */}
      <div className="fixed bottom-0 left-0 right-0 z-50 sm:hidden bg-[#0b0f17]/95 backdrop-blur border-t border-slate-800 px-4 py-3">
        <a
          href={CTA_HREF}
          className="flex items-center justify-center gap-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm uppercase tracking-wider w-full py-3.5 rounded-xl transition-all shadow-lg shadow-cyan-500/30"
        >
          🚀 Testar Marina grátis <ArrowRight className="w-4 h-4" />
        </a>
      </div>

    </div>
  );
};
