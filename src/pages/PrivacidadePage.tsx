import React from 'react';

export const PrivacidadePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#0b0f17] text-slate-100 pt-28 pb-20 px-4">
      <div className="max-w-2xl mx-auto prose prose-invert prose-sm">
        <h1 className="text-3xl font-bold mb-2">Política de Privacidade</h1>
        <p className="text-slate-400 text-sm mb-8">Última atualização: outubro de 2026</p>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">1. Dados que coletamos</h2>
          <p className="text-slate-400 mb-3">Ao se cadastrar, coletamos:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Nome completo;</li>
            <li>Endereço de e-mail;</li>
            <li>Número de WhatsApp;</li>
            <li>Nome da empresa (opcional).</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">2. Como usamos seus dados</h2>
          <p className="text-slate-400 mb-3">Utilizamos seus dados para:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Configurar e ativar seu período de teste gratuito da Marina;</li>
            <li>Entrar em contato por WhatsApp e e-mail sobre o andamento do serviço;</li>
            <li>Enviar informações sobre planos, atualizações e novidades da Antum;</li>
            <li>Melhorar nossos produtos e atendimento.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">3. Compartilhamento de dados</h2>
          <p className="text-slate-400">Não vendemos, alugamos ou compartilhamos seus dados com terceiros para fins de marketing. Podemos compartilhar dados com fornecedores de infraestrutura (Supabase, servidores em nuvem) exclusivamente para prestação do serviço, mediante acordos de confidencialidade.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">4. Armazenamento e segurança</h2>
          <p className="text-slate-400">Seus dados são armazenados em servidores seguros com criptografia em trânsito (HTTPS/TLS) e em repouso. Adotamos boas práticas de segurança da informação alinhadas à LGPD (Lei 13.709/2018).</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">5. Seus direitos (LGPD)</h2>
          <p className="text-slate-400 mb-3">Você tem direito a:</p>
          <ul className="list-disc list-inside text-slate-400 space-y-1">
            <li>Confirmar a existência de tratamento dos seus dados;</li>
            <li>Acessar, corrigir ou excluir seus dados;</li>
            <li>Revogar o consentimento a qualquer momento;</li>
            <li>Solicitar a portabilidade dos dados.</li>
          </ul>
          <p className="text-slate-400 mt-3">Para exercer esses direitos, entre em contato pelo e-mail abaixo.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">6. Retenção de dados</h2>
          <p className="text-slate-400">Mantemos seus dados pelo período necessário à prestação do serviço. Após encerramento da conta ou solicitação de exclusão, os dados são removidos em até 30 dias, salvo obrigação legal de retenção.</p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-3">7. Contato do Encarregado (DPO)</h2>
          <p className="text-slate-400">Dúvidas sobre privacidade e proteção de dados: <a href="mailto:contato@antum.com.br" className="text-cyan-400 hover:underline">contato@antum.com.br</a> ou via WhatsApp <a href="https://wa.me/5547988431352" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">+55 47 8843-1352</a>.</p>
        </section>
      </div>
    </div>
  );
};
