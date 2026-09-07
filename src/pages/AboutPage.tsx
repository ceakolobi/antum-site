import React from 'react';
import { useRouter } from '../router/RouterContext';
import { Link } from '../router/Link';
import {
  Sparkles,
  Lightbulb,
  HeartHandshake,
  Workflow,
  Brain,
  Rocket,
  Compass,
  ArrowRight,
  ShieldCheck,
  Terminal,
} from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { openMarinaModal } = useRouter();

  const narrativeChapters = [
    {
      step: '01',
      title: 'De onde surgiu a ideia',
      icon: Lightbulb,
      content:
        'A ANTUM nasceu da inconformidade de ver profissionais talentosos — engenheiros, analistas financeiros, vendedores seniores — passando metade da semana copiando dados entre planilhas, digitando notas manuais ou respondendo perguntas idênticas no WhatsApp. Percebemos que o mundo estava cheio de softwares que apenas armazenavam informações, mas nenhum que realmente fizesse o trabalho pesado.',
    },
    {
      step: '02',
      title: 'O que a ANTUM acredita',
      icon: HeartHandshake,
      content:
        'Acreditamos que tecnologia não deve apenas informar. Ela deve trabalhar. Um dashboard bonito que apenas mostra que você tem 1.000 tarefas atrasadas é inútil; o sistema deve ser inteligente o suficiente para resolver 800 delas sozinho e sinalizar apenas as 200 que demandam empatia humana.',
    },
    {
      step: '03',
      title: 'Por que automação',
      icon: Workflow,
      content:
        'A automação é a espinha dorsal da consistência operacional. Tarefas mecânicas executadas por humanos estão sujeitas a cansaço, distração e turnover. Automações bem projetadas rodam com precisão milimétrica, zero margem para erro de digitação e velocidade instantânea, 24 horas por dia.',
    },
    {
      step: '04',
      title: 'Por que IA',
      icon: Brain,
      content:
        'Até pouco tempo atrás, computadores só conseguiam lidar com números e regras rígidas (if/else). A inteligência artificial quebrou essa barreira: agora os sistemas conseguem ler um e-mail informal, interpretar áudio de cliente, negociar objeções comerciais e entender contratos complexos sem travar.',
    },
    {
      step: '05',
      title: 'O que estamos construindo',
      icon: Rocket,
      content:
        'Estamos construindo um estúdio de engenharia que desenvolve agentes autônomos (como a Marina SDR), motores de orquestração de processos (Antum Flow), robôs de RPA para sistemas legados e plataformas digitais customizadas com IA nativa no código.',
    },
    {
      step: '06',
      title: 'Para onde estamos indo',
      icon: Compass,
      content:
        'Caminhamos para empresas onde a proporção entre humanos e agentes de software será equilibrada. Pequenos times de especialistas coordenando frotas de agentes autônomos capazes de atender milhões de clientes com hiperpersonalização e precisão cirúrgica.',
    },
  ];

  return (
    <div id="about-page" className="min-h-screen pt-24 pb-20 bg-[#0b0f17]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="max-w-3xl mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950 border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span>SOBRE A ANTUM</span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
            Acreditamos que tecnologia não deve apenas informar.{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 block">
              Ela deve trabalhar.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed pt-2">
            Não somos uma agência tradicional de marketing nem uma fábrica de código genérica. Somos um AI & Automation Studio focado em transformar processos manuais em sistemas autônomos.
          </p>
        </div>

        {/* NARRATIVE TIMELINE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
          {narrativeChapters.map((ch) => {
            const Icon = ch.icon;
            return (
              <div
                key={ch.step}
                className="p-8 rounded-3xl bg-[#0e1424] border border-slate-800 hover:border-cyan-500/40 transition-all space-y-4 shadow-xl"
              >
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-xl bg-cyan-950 text-cyan-400 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-mono text-slate-500">
                    Capítulo {ch.step}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white tracking-wide">
                  {ch.title}
                </h3>

                <p className="text-sm text-slate-300 leading-relaxed">
                  {ch.content}
                </p>
              </div>
            );
          })}
        </div>

        {/* CORE PILLARS BANNER */}
        <div className="p-8 sm:p-12 rounded-3xl bg-slate-900/90 border border-slate-800 mb-20">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-widest">
              Nossa Assinatura
            </span>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
              ANTUM: AI • AUTOMATION • SOFTWARE
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-slate-300 text-xs sm:text-sm">
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="font-mono text-cyan-400 uppercase font-bold block">
                Comunicação Direta
              </span>
              <p className="text-slate-400">
                Sem jargões vazios ou promessas mirabolantes. Falamos a língua prática do resultado do seu negócio.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="font-mono text-cyan-400 uppercase font-bold block">
                Engenharia Segura
              </span>
              <p className="text-slate-400">
                Isolamento estrito de dados, conformidade LGPD e criptografia de ponta a ponta em cada conexão.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
              <span className="font-mono text-cyan-400 uppercase font-bold block">
                Propriedade do Cliente
              </span>
              <p className="text-slate-400">
                Desenvolvemos soluções que se tornam ativos duradouros da sua empresa, integradas ao seu ecossistema.
              </p>
            </div>
          </div>
        </div>

        {/* FINAL ABOUT CTA */}
        <div className="text-center p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 to-blue-950/40 border border-cyan-500/30">
          <h3 className="text-2xl font-bold text-white mb-2">
            Pronto para conversar com quem realmente constrói tecnologia?
          </h3>
          <p className="text-sm text-slate-400 mb-6 max-w-md mx-auto">
            A Marina SDR está online e pode iniciar uma análise técnica preliminar dos seus fluxos agora.
          </p>
          <button
            onClick={() => openMarinaModal('Olá Marina! Gostaria de conversar com a equipe da ANTUM sobre nossa operação.')}
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-cyan-500/25 hover:scale-105 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-cyan-200" />
            <span>Falar com a Marina</span>
          </button>
        </div>

      </div>
    </div>
  );
};
