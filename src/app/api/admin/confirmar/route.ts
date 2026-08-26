import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;

  if (!email || email.toLowerCase() !== process.env.ADMIN_EMAIL?.toLowerCase()) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  const { subscriptionId } = (await req.json()) as { subscriptionId?: string };
  if (!subscriptionId) {
    return NextResponse.json({ error: "subscriptionId é obrigatório." }, { status: 400 });
  }

  const subscription = await prisma.subscription.update({
    where: { id: subscriptionId },
    data: { status: "ACTIVE", confirmedAt: new Date(), confirmedBy: email },
  });

  return NextResponse.json(subscription);
}
