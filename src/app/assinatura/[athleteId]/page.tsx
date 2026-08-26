import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANOS, generatePixPayload, type PlanoKey } from "@/lib/pix";
import { AssinaturaForm } from "@/components/AssinaturaForm";
import { PixCheckout } from "@/components/PixCheckout";

export default async function AssinaturaPage({ params }: { params: { athleteId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atleta = userId
    ? await prisma.athlete.findFirst({ where: { id: params.athleteId, userId }, include: { user: true } })
    : null;

  if (!atleta) notFound();

  const pendente = await prisma.subscription.findFirst({
    where: { athleteId: atleta.id, status: "PENDING" },
  });

  return (
    <main
      style={{ minHeight: "100vh", background: "#F0F0F0", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 20px", position: "relative", overflow: "hidden" }}
    >
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <div className="card-light" style={{ width: "100%", maxWidth: 440, padding: "36px 32px", position: "relative", zIndex: 1 }}>
        {!pendente && (
          <>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Assinar plano</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 24 }}>Para {atleta.name}</p>
          </>
        )}

        {pendente ? (
          <PixCheckout
            plan={pendente.plan as PlanoKey}
            txid={`C10-${pendente.id.slice(-8).toUpperCase()}`}
            pixPayload={generatePixPayload(`C10-${pendente.id.slice(-8).toUpperCase()}`, PLANOS[pendente.plan as PlanoKey].preco)}
            parentName={atleta.user.name}
          />
        ) : (
          <AssinaturaForm athleteId={atleta.id} parentName={atleta.user.name} />
        )}
      </div>
    </main>
  );
}
