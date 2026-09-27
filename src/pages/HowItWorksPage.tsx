import React from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import { CheckCircle2, MessageCircle, Rocket, RefreshCw, Sparkles, ArrowRight } from 'lucide-react';

const steps = [
  {
    icon: MessageCircle,
    title: '1. Você conversa com a Marina',
    text: 'Conta o que a sua empresa faz e o que quer no site. A Marina organiza o briefing e já sugere uma ideia para o seu ramo.',
  },
  {
    icon: Rocket,
    title: '2. A gente cria e implanta tudo',
    text: 'Design, textos, fotos, botão de WhatsApp, hospedagem e publicação. A implantação é completa, no começo, sem cobrança pela criação do site.',
  },
  {
    icon: CheckCircle2,
    title: '3. Seu site vai ao ar',
    text: 'Publicado no seu domínio, rápido e seguro, pronto para receber clientes pelo celular e pelo Google.',
  },
  {
    icon: RefreshCw,
    title: '4. Uma atualização por semana',
    text: 'Todo mês o seu site continua vivo: uma atualização por semana (textos, fotos, preços, banners) e, se quiser, a Marina atendendo seus clientes.',
  },
];

const plans = [
  {
    name: 'Site',
    price: 'R$ 70',
    per: '/mês',
    highlight: false,
    items: [
      'Criação e implantação completa, sem custo',
      'Site no ar, hospedado e seguro',
      'Formulário de contato e ícone do WhatsApp',
      '1 atualização por semana',
    ],
    marina: 'Olá Marina! Quero saber mais sobre o plano de site por R$ 70/mês.',
    cta: 'Quero este plano',
  },
  {
    name: 'Site + Marina',
    price: 'R$ 99',
    per: '/mês',
    highlight: true,
    items: [
      'Tudo do plano Site',
      'Marina, a SDR de IA, atendendo seus clientes 24 horas',
      'Responde dúvidas e passa os contatos para você',
    ],
    marina: 'Olá Marina! Quero saber mais sobre o plano Site + Marina por R$ 99/mês.',
    cta: 'Quero site + Marina',
  },
  {
    name: 'Loja virtual ou sistema (SaaS)',
    price: 'R$ 180',
    per: '/mês',
    highlight: false,
    items: [
      'Criação e implantação completas, sem custo',
      'Loja virtual ou sistema (SaaS) para o seu negócio',
      'Marina, a SDR de IA, atendendo seus clientes',
    ],
    marina: 'Olá Marina! Quero saber mais sobre a loja virtual ou sistema com SDR por R$ 180/mês.',
    cta: 'Quero loja ou sistema',
  },
];

const faqs = [
  ['Preciso pagar pela criação do site?', 'Não. A criação e a implantação completa não têm cobrança. Você paga a mensalidade do plano.'],
  ['E o domínio (o endereço .com.br)?', 'O registro do domínio é pago à parte, direto por você. Ele é o seu endereço na internet.'],
  ['Em quanto tempo o site fica pronto?', 'Em até 7 dias depois que você nos passa as informações e as fotos.'],
  ['O que é a atualização semanal?', 'Uma vez por semana a gente atualiza o seu site: trocar textos, fotos, preços ou banners.'],
  ['O que a Marina faz no meu site?', 'A Marina é uma assistente de IA que conversa com quem visita o seu site, tira dúvidas e passa os contatos interessados para você.'],
];

export const HowItWorksPage: React.FC = () => {
  const { openMarinaModal } = useRouter();

  return (
    <div id="como-funciona-page" className="min-h-screen pt-28 pb-20 bg-[#0b0f17]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* HERO */}
        <div className="max-w-3xl mb-16">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">Como funciona</span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-white mt-2 tracking-tight leading-[1.1]">
            Seu site profissional no ar,{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">sem pagar pela criação.</span>
          </h1>
          <p className="text-lg text-slate-300 mt-5 leading-relaxed">
            Você não paga para ter o site feito. A gente cria, implanta e coloca no ar. Depois você paga só uma mensalidade
            pequena, com uma atualização por semana incluída.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => openMarinaModal('Olá Marina! Quero um site para a minha empresa. Como funciona?')}
              className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 text-white font-bold text-sm tracking-wider uppercase shadow-xl shadow-cyan-500/25 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-cyan-200" />
              <span>Falar com a Marina</span>
            </button>
            <Link
              to="/portfolio/sites-ia"
              className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm text-center flex items-center justify-center gap-2"
            >
              <span>Ver sites que já entregamos</span>
              <ArrowRight className="w-4 h-4 text-cyan-400" />
            </Link>
          </div>
        </div>

        {/* PASSOS */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-8">Em 4 passos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {steps.map((s) => (
              <div key={s.title} className="p-6 rounded-2xl bg-[#0e1422] border border-slate-800 flex gap-4">
                <div className="w-11 h-11 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center shrink-0">
                  <s.icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">{s.title}</h3>
                  <p className="text-sm text-slate-400 mt-1.5 leading-relaxed">{s.text}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* PLANOS */}
        <section className="mb-20">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">Três planos, sem complicação</h2>
          <p className="text-sm text-slate-400 mb-8">O registro do domínio é pago à parte, direto por você.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((p) => (
              <div
                key={p.name}
                className={`p-7 rounded-3xl border flex flex-col ${
                  p.highlight ? 'bg-gradient-to-b from-cyan-950/50 to-[#0e1422] border-cyan-500/50' : 'bg-[#0e1422] border-slate-800'
                }`}
              >
                {p.highlight && (
                  <span className="self-start mb-3 text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-cyan-500 text-slate-950">
                    Mais completo
                  </span>
                )}
                <h3 className="text-lg font-bold text-white">{p.name}</h3>
                <p className="mt-2">
                  <span className="text-4xl font-extrabold text-white">{p.price}</span>
                  <span className="text-sm text-slate-400">{p.per}</span>
                </p>
                <ul className="mt-5 space-y-2.5 flex-1">
                  {p.items.map((i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span>{i}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => openMarinaModal(p.marina)}
                  className={`mt-6 py-3 rounded-xl text-sm font-bold uppercase tracking-wider transition-all cursor-pointer ${
                    p.highlight ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {p.cta}
                </button>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-20 max-w-3xl">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">Perguntas frequentes</h2>
          <div className="space-y-3">
            {faqs.map(([q, a]) => (
              <details key={q} className="group rounded-xl bg-[#0e1422] border border-slate-800 p-5 open:border-slate-700">
                <summary className="cursor-pointer list-none flex items-center justify-between gap-4 text-sm font-semibold text-white">
                  <span>{q}</span>
                  <span className="text-cyan-400 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="mt-3 text-sm text-slate-400 leading-relaxed">{a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* CTA FINAL */}
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-slate-800 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Vamos colocar a sua empresa no ar?</h2>
          <p className="text-sm text-slate-400 mt-3 max-w-xl mx-auto">
            Conte para a Marina o ramo da sua empresa e ela já sugere a ideia do seu site.
          </p>
          <button
            onClick={() => openMarinaModal('Olá Marina! Quero um site para a minha empresa.')}
            className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs uppercase tracking-wider transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Falar com a Marina</span>
          </button>
        </div>
      </div>
    </div>
  );
};
