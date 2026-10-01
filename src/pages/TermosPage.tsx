import React from 'react';

export const TermosPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold mb-2">Termos de Uso</h1>
        <p className="text-slate-400 text-sm mb-8">Última atualização: outubro de 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Sobre a Antum</h2>
          <p className="text-slate-400">A Antum (doravante "Antum", "nós" ou "nosso") é uma empresa de tecnologia especializada em automação e agentes de inteligência artificial, com sede em Joinville, SC, Brasil. Nosso produto Marina SDR é um agente de atendimento automatizado via WhatsApp.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Aceite dos Termos</h2>
          <p className="text-slate-400">Ao se cadastrar no período de teste gratuito ou contratar qualquer plano da Antum, você declara ter lido, compreendido e aceito integralmente estes Termos de Uso. Caso não concorde com alguma cláusula, não utilize nossos serviços.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Período de Teste Gratuito</h2>
          <p className="text-slate-400">Oferecemos um período de teste gratuito de 30 (trinta) dias corridos, sem necessidade de cartão de crédito ou qualquer pagamento antecipado. Ao final do período, o serviço é encerrado automaticamente, salvo contratação de plano pago.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Uso do Serviço</h2>
          <p className="text-slate-400 mb-3">O usuário se compromete a:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Fornecer informações verdadeiras no cadastro;</li>
            <li>Utilizar o serviço somente para fins lícitos e legítimos;</li>
            <li>Não utilizar a Marina para envio de spam, mensagens enganosas ou práticas abusivas;</li>
            <li>Respeitar a legislação vigente, inclusive a LGPD e o Marco Civil da Internet.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Limitação de Responsabilidade</h2>
          <p className="text-slate-400">A Antum não se responsabiliza por eventuais falhas de terceiros (WhatsApp, provedores de nuvem, operadoras), nem por resultados comerciais decorrentes do uso da Marina. O serviço é fornecido "como está".</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Alterações nos Termos</h2>
          <p className="text-slate-400">A Antum pode atualizar estes Termos a qualquer momento, notificando os usuários ativos por e-mail com antecedência mínima de 10 dias.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. Contato</h2>
          <p className="text-slate-400">Dúvidas sobre estes Termos: <a href="mailto:contato@antum.com.br" className="text-cyan-400 hover:underline">contato@antum.com.br</a> ou via WhatsApp <a href="https://wa.me/5547988431352" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">+55 47 8843-1352</a>.</p>
        </section>
      </div>
    </div>
  );
};
