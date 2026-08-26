import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PLANOS, generatePixPayload, type PlanoKey } from "@/lib/pix";

function txidFromSubscription(subscriptionId: string): string {
  return `C10-${subscriptionId.slice(-8).toUpperCase()}`;
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json();
  const { athleteId, plan } = body as { athleteId?: string; plan?: string };

  if (!athleteId || !plan || !["TORCIDA", "CRAQUE"].includes(plan)) {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const atleta = await prisma.athlete.findFirst({ where: { id: athleteId, userId } });
  if (!atleta) {
    return NextResponse.json({ error: "Atleta não encontrado." }, { status: 404 });
  }

  // Evita duplicar um pedido pendente pro mesmo atleta.
  let subscription = await prisma.subscription.findFirst({
    where: { athleteId, status: "PENDING" },
  });

  if (!subscription) {
    subscription = await prisma.subscription.create({
      data: { userId, athleteId, plan: plan as "TORCIDA" | "CRAQUE", status: "PENDING" },
    });
  }

  const txid = txidFromSubscription(subscription.id);
  const pixPayload = generatePixPayload(txid, PLANOS[subscription.plan as PlanoKey].preco);

  return NextResponse.json({ ...subscription, txid, pixPayload });
}
