import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANOS } from "@/lib/pix";
import { isAdminEmail } from "@/lib/admin";
import { DashboardNav } from "@/components/DashboardNav";
import { ConfirmarPagamentoButton } from "@/components/ConfirmarPagamentoButton";
import { RedefinirSenhaForm } from "@/components/RedefinirSenhaForm";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    redirect("/dashboard");
  }

  const pendentes = await prisma.subscription.findMany({
    where: { status: "PENDING" },
    orderBy: { requestedAt: "asc" },
    include: { user: true, athlete: true },
  });

  const pedidosSenha = await prisma.passwordResetRequest.findMany({
    where: { status: "PENDING" },
    orderBy: { requestedAt: "asc" },
    include: { user: true },
  });

  return (
    <main style={{ minHeight: "100vh", background: "#060E20", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <DashboardNav isAdmin />
        <div style={{ maxWidth: 740, margin: "0 auto", padding: "36px 20px 60px" }}>
          <h1 className="text-gradient" style={{ fontSize: 22, fontWeight: 800, marginBottom: 4 }}>
            Pagamentos pendentes
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>Confirme aqui assim que o PIX cair na conta do clube.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pendentes.map((s) => (
              <div
                key={s.id}
                className="card"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", flexWrap: "wrap" }}
              >
                <div>
                  <p style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>
                    {s.athlete.name} — Plano {PLANOS[s.plan].label} (R$ {PLANOS[s.plan].preco})
                  </p>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                    Responsável: {s.user.name} ({s.user.email}
                    {s.user.phone ? ` · ${s.user.phone}` : ""})
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Pedido em {new Date(s.requestedAt).toLocaleString("pt-BR")}</p>
                </div>
                <ConfirmarPagamentoButton subscriptionId={s.id} />
              </div>
            ))}

            {pendentes.length === 0 && (
              <div style={{ borderRadius: 20, padding: "48px 24px", textAlign: "center", background: "rgba(12,27,54,0.6)", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>Nenhum pagamento pendente no momento.</p>
              </div>
            )}
          </div>

          <h1 className="text-gradient" style={{ fontSize: 22, fontWeight: 800, marginTop: 44, marginBottom: 4 }}>
            🔑 Solicitações de senha
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>
            Defina uma senha temporária e avise o responsável por WhatsApp ou telefone.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {pedidosSenha.map((p) => (
              <div
                key={p.id}
                className="card"
                style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: "18px 22px", flexWrap: "wrap" }}
              >
                <div>
                  <p style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{p.user.name}</p>
                  <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
                    {p.user.email}
                    {p.user.phone ? ` · ${p.user.phone}` : ""}
                  </p>
                  <p style={{ fontSize: 11, color: "#64748b", marginTop: 2 }}>Pedido em {new Date(p.requestedAt).toLocaleString("pt-BR")}</p>
                </div>
                <RedefinirSenhaForm requestId={p.id} />
              </div>
            ))}

            {pedidosSenha.length === 0 && (
              <div style={{ borderRadius: 20, padding: "48px 24px", textAlign: "center", background: "rgba(12,27,54,0.6)", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>Nenhuma solicitação de senha no momento.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
