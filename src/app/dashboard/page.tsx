import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularCategoria, traduzirPolo } from "@/lib/category";
import { isAdminEmail } from "@/lib/admin";
import { DashboardNav } from "@/components/DashboardNav";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isAdmin = isAdminEmail(session?.user?.email);

  const atletas = userId
    ? await prisma.athlete.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          subscriptions: { where: { status: { in: ["ACTIVE", "PENDING"] } } },
        },
      })
    : [];

  return (
    <main style={{ minHeight: "100vh", background: "#060E20", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <DashboardNav isAdmin={isAdmin} />

        <div style={{ maxWidth: 740, margin: "0 auto", padding: "36px 20px 60px" }}>
          <h1 className="text-gradient" style={{ fontSize: 24, fontWeight: 800, marginBottom: 4, letterSpacing: -0.4 }}>
            Meus atletas
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, marginBottom: 28 }}>Acompanhe o perfil de cada um dos seus craques.</p>

          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {atletas.map((atleta) => {
              const ativa = atleta.subscriptions.find((s) => s.status === "ACTIVE");
              const pendente = atleta.subscriptions.find((s) => s.status === "PENDING");
              const planoAtivo = ativa?.plan;
              return (
                <Link
                  key={atleta.id}
                  href={`/dashboard/atleta/${atleta.id}`}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    borderRadius: 18,
                    padding: "18px 22px",
                    background: "linear-gradient(135deg, rgba(12,27,54,0.85), rgba(6,14,32,0.65))",
                    border: "1.5px solid rgba(255,255,255,0.08)",
                    textDecoration: "none",
                    transition: "all 0.2s ease",
                  }}
                  className="card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: "50%",
                        flexShrink: 0,
                        background: atleta.photoUrl ? "transparent" : "linear-gradient(135deg,#1E3A8A,#F97316)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        overflow: "hidden",
                        border: "2px solid rgba(249,115,22,0.30)",
                      }}
                    >
                      {atleta.photoUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={atleta.photoUrl} alt={atleta.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: 20 }}>⚽</span>
                      )}
                    </div>
                    <div>
                      <p style={{ fontWeight: 700, color: "#fff", fontSize: 15 }}>{atleta.name}</p>
                      <p style={{ fontSize: 13, color: "#94a3b8" }}>
                        {calcularCategoria(atleta.birthDate)} · {traduzirPolo(atleta.polo)}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      borderRadius: 99,
                      padding: "5px 12px",
                      fontSize: 11,
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      background: planoAtivo ? "rgba(249,115,22,0.15)" : pendente ? "rgba(234,179,8,0.15)" : "rgba(255,255,255,0.06)",
                      color: planoAtivo ? "#fb923c" : pendente ? "#eab308" : "#64748b",
                      border: planoAtivo
                        ? "1px solid rgba(249,115,22,0.30)"
                        : pendente
                          ? "1px solid rgba(234,179,8,0.30)"
                          : "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    {planoAtivo ? `${planoAtivo === "CRAQUE" ? "Craque" : "Torcida"} ativo` : pendente ? "⏳ Aguardando ativação" : "Sem plano"}
                  </span>
                </Link>
              );
            })}

            {atletas.length === 0 && (
              <div style={{ borderRadius: 20, padding: "48px 24px", textAlign: "center", background: "rgba(12,27,54,0.6)", border: "1.5px solid rgba(255,255,255,0.08)" }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>⚽</div>
                <p style={{ color: "#94a3b8", fontSize: 14 }}>Você ainda não cadastrou nenhum atleta.</p>
              </div>
            )}
          </div>

          <Link href="/dashboard/atleta/novo" className="btn-c10 btn-c10-primary" style={{ padding: "14px 26px", fontSize: 15 }}>
            + Cadastrar atleta
          </Link>
        </div>
      </div>
    </main>
  );
}
