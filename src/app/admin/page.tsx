import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANOS } from "@/lib/pix";
import { ConfirmarPagamentoButton } from "@/components/ConfirmarPagamentoButton";

export default async function AdminPage() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    redirect("/dashboard");
  }

  const pendentes = await prisma.subscription.findMany({
    where: { status: "PENDING" },
    orderBy: { requestedAt: "asc" },
    include: { user: true, athlete: true },
  });

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="mb-1 text-2xl font-bold">Pagamentos pendentes</h1>
      <p className="mb-6 text-sm text-c10-blue-dark/60">
        Confirme aqui assim que o PIX cair na conta do clube.
      </p>

      <div className="space-y-3">
        {pendentes.map((s) => (
          <div key={s.id} className="card flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">
                {s.athlete.name} — Plano {PLANOS[s.plan].label} (R$ {PLANOS[s.plan].preco})
              </p>
              <p className="text-sm text-c10-blue-dark/60">
                Responsável: {s.user.name} ({s.user.email}
                {s.user.phone ? ` · ${s.user.phone}` : ""})
              </p>
              <p className="text-xs text-c10-blue-dark/40">
                Pedido em {new Date(s.requestedAt).toLocaleString("pt-BR")}
              </p>
            </div>
            <ConfirmarPagamentoButton subscriptionId={s.id} />
          </div>
        ))}

        {pendentes.length === 0 && (
          <p className="text-c10-blue-dark/60">Nenhum pagamento pendente no momento.</p>
        )}
      </div>
    </main>
  );
}
