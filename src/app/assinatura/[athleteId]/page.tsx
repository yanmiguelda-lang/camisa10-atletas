import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANOS, chavePix, nomeBeneficiarioPix } from "@/lib/pix";
import { AssinaturaForm } from "@/components/AssinaturaForm";

export default async function AssinaturaPage({ params }: { params: { athleteId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atleta = userId
    ? await prisma.athlete.findFirst({ where: { id: params.athleteId, userId } })
    : null;

  if (!atleta) notFound();

  const pendente = await prisma.subscription.findFirst({
    where: { athleteId: atleta.id, status: "PENDING" },
  });

  return (
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-1 text-2xl font-bold">Assinar plano — {atleta.name}</h1>
      <p className="mb-6 text-sm text-c10-blue-dark/60">
        Pagamento via PIX. Depois de pagar, clique em &quot;Já fiz o PIX&quot; — o
        Camisa 10 FC confirma o recebimento e libera o plano em até 1 dia útil.
      </p>

      {pendente ? (
        <div className="card-accent">
          <p className="font-semibold">
            Pedido do plano {PLANOS[pendente.plan].label} registrado — aguardando confirmação do pagamento.
          </p>
          <p className="mt-1 text-sm text-c10-blue-dark/70">
            Qualquer dúvida, fale com o Camisa 10 FC pelo WhatsApp da sua escolinha.
          </p>
        </div>
      ) : (
        <AssinaturaForm athleteId={atleta.id} pixKey={chavePix()} pixNome={nomeBeneficiarioPix()} />
      )}
    </main>
  );
}
