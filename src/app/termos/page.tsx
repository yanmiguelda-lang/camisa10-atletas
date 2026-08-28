import Link from "next/link";

export const metadata = {
  title: "Termos de Uso e Privacidade — Camisa 10 F.C.",
};

export default function TermosPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F0F0", padding: "48px 20px 80px" }}>
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        <Link href="/" style={{ textDecoration: "none", marginBottom: 32, display: "block" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Camisa 10 F.C." style={{ height: 44, width: "auto" }} />
        </Link>

        <div className="card-light" style={{ padding: "40px 36px" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Termos de Uso e Política de Privacidade</h1>
          <p style={{ color: "#666", fontSize: 13, marginBottom: 32 }}>Última atualização: 28 de agosto de 2026</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 24, fontSize: 14, lineHeight: 1.7, color: "#333" }}>
            <section>
              <h2 style={sectionTitle}>1. Sobre esta plataforma</h2>
              <p>
                Esta plataforma é operada pelo <strong>Camisa 10 F.C.</strong> e existe para que pais e
                responsáveis acompanhem o desempenho e a trajetória dos atletas matriculados nas
                escolinhas do clube — registrando partidas, estatísticas e fotos — e para gerenciar a
                assinatura mensal do serviço.
              </p>
            </section>

            <section>
              <h2 style={sectionTitle}>2. Cadastro e responsabilidade pela conta</h2>
              <p>
                Ao criar uma conta, você declara ser pai, mãe ou responsável legal pelo atleta cadastrado
                e se compromete a fornecer informações verdadeiras. Você é responsável por manter sua
                senha em sigilo e por tudo o que for feito através da sua conta.
              </p>
            </section>

            <section>
              <h2 style={sectionTitle}>3. Dados que coletamos</h2>
              <p>Para o funcionamento do serviço, coletamos e armazenamos:</p>
              <ul style={{ margin: "8px 0 0", paddingLeft: 20, display: "flex", flexDirection: "column", gap: 4 }}>
                <li>Dados do responsável: nome, email, telefone e senha (armazenada de forma criptografada).</li>
                <li>Dados do atleta (menor de idade): nome, data de nascimento, polo, posição, número da camisa e foto de perfil.</li>
                <li>Estatísticas de partidas e fotos de jogos enviadas pelo responsável.</li>
                <li>Dados da assinatura: plano escolhido e status de pagamento (o pagamento em si é feito via PIX, fora da plataforma).</li>
              </ul>
            </section>

            <section>
              <h2 style={sectionTitle}>4. Como usamos esses dados</h2>
              <p>
                Os dados são usados exclusivamente para operar a plataforma: exibir o painel e as
                estatísticas do atleta ao responsável, gerar o perfil público compartilhável (quando o
                plano contratado permite) e liberar o acesso conforme o pagamento é confirmado pela
                equipe do clube. Não vendemos nem compartilhamos esses dados com terceiros para fins de
                publicidade.
              </p>
            </section>

            <section>
              <h2 style={sectionTitle}>5. Perfil público e fotos</h2>
              <p>
                O plano Craque libera um link público com estatísticas e álbuns de fotos do atleta,
                pensado para ser compartilhado com familiares. Esse link não exige login. Você pode
                solicitar a remoção de fotos específicas ou a desativação do link público a qualquer
                momento, entrando em contato com o clube.
              </p>
            </section>

            <section>
              <h2 style={sectionTitle}>6. Pagamento</h2>
              <p>
                A cobrança é feita por PIX manual: o responsável realiza o pagamento e a equipe do clube
                confirma o recebimento para liberar (ou renovar) o acesso ao plano contratado. Não há
                cobrança automática recorrente nem armazenamento de dados de cartão nesta plataforma.
              </p>
            </section>

            <section>
              <h2 style={sectionTitle}>7. Seus direitos (LGPD)</h2>
              <p>
                Você pode, a qualquer momento, solicitar acesso, correção ou exclusão dos dados do
                responsável e do atleta, revogar o consentimento de uso de imagem, ou encerrar a conta.
                Para isso, entre em contato pelo email ou WhatsApp informados pelo clube.
              </p>
            </section>

            <section>
              <h2 style={sectionTitle}>8. Alterações destes termos</h2>
              <p>
                Podemos atualizar estes termos conforme a plataforma evolui. Mudanças relevantes serão
                comunicadas aos responsáveis cadastrados.
              </p>
            </section>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: 24, fontSize: 12, color: "#999" }}>
          <Link href="/cadastro" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>
            ← Voltar ao cadastro
          </Link>
        </p>
      </div>
    </main>
  );
}

const sectionTitle: React.CSSProperties = { fontSize: 15, fontWeight: 800, color: "#0A0A0A", marginBottom: 6 };
