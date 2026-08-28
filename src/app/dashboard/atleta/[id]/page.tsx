import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";
import { DashboardNav } from "@/components/DashboardNav";
import { AthleteDashboard } from "@/components/AthleteDashboard";
import { AguardandoAtivacao } from "@/components/AguardandoAtivacao";
import type { PlanoKey } from "@/lib/pix";

export default async function AtletaPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isAdmin = isAdminEmail(session?.user?.email);

  const atleta = userId
    ? await prisma.athlete.findFirst({
        where: { id: params.id, userId },
        include: {
          matches: { orderBy: { date: "desc" }, include: { photos: true } },
          subscriptions: { where: { status: { in: ["ACTIVE", "PENDING"] } }, orderBy: { requestedAt: "desc" } },
        },
      })
    : null;

  if (!atleta) notFound();

  const ativa = atleta.subscriptions.find((s) => s.status === "ACTIVE");
  const pendente = atleta.subscriptions.find((s) => s.status === "PENDING");

  return (
    <main style={{ minHeight: "100vh", background: "#060E20", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <DashboardNav isAdmin={isAdmin} />
        {!ativa && pendente ? (
          <AguardandoAtivacao
            athleteName={atleta.name}
            photoUrl={atleta.photoUrl}
            plan={pendente.plan as PlanoKey}
            txid={`C10-${pendente.id.slice(-8).toUpperCase()}`}
          />
        ) : (
          <AthleteDashboard athlete={JSON.parse(JSON.stringify({ ...atleta, subscriptions: ativa ? [ativa] : [] }))} />
        )}
      </div>
    </main>
  );
}
