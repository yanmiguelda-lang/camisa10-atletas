import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!isAdminEmail(email)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  let subscriptionId: string | undefined;
  try {
    ({ subscriptionId } = (await req.json()) as { subscriptionId?: string });
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId é obrigatório." }, { status: 400 });
  }

  const existente = await prisma.subscription.findUnique({ where: { id: subscriptionId } });
  if (!existente) {
    return NextResponse.json({ error: "Pagamento não encontrado — pode já ter sido confirmado." }, { status: 404 });
  }
  if (existente.status === "ACTIVE") {
    return NextResponse.json(existente); // já confirmado — idempotente, não é erro
  }

  try {
    const subscription = await prisma.subscription.update({
      where: { id: subscriptionId },
      data: { status: "ACTIVE", confirmedAt: new Date(), confirmedBy: email },
    });
    return NextResponse.json(subscription);
  } catch {
    return NextResponse.json({ error: "Não foi possível confirmar o pagamento. Tente de novo." }, { status: 500 });
  }
}
