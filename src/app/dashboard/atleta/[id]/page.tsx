import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { DashboardNav } from "@/components/DashboardNav";
import { AthleteDashboard } from "@/components/AthleteDashboard";

export default async function AtletaPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  const isAdmin = session?.user?.email?.toLowerCase() === process.env.ADMIN_EMAIL?.toLowerCase();

  const atleta = userId
    ? await prisma.athlete.findFirst({
        where: { id: params.id, userId },
        include: {
          matches: { orderBy: { date: "desc" }, include: { photos: true } },
          subscriptions: { where: { status: "ACTIVE" }, take: 1 },
        },
      })
    : null;

  if (!atleta) notFound();

  return (
    <main style={{ minHeight: "100vh", background: "#060E20", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <DashboardNav isAdmin={isAdmin} />
        <AthleteDashboard athlete={JSON.parse(JSON.stringify(atleta))} />
      </div>
    </main>
  );
}
