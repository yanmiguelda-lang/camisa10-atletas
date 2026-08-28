import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  let email: string | undefined;
  try {
    ({ email } = (await req.json()) as { email?: string });
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!email) {
    return NextResponse.json({ error: "Informe o email." }, { status: 400 });
  }

  const emailNormalizado = email.toLowerCase().trim();
  const user = await prisma.user.findUnique({ where: { email: emailNormalizado } });

  // Resposta é sempre a mesma, exista ou não a conta — evita expor quais emails têm cadastro.
  if (user) {
    const pendente = await prisma.passwordResetRequest.findFirst({
      where: { userId: user.id, status: "PENDING" },
    });
    if (!pendente) {
      await prisma.passwordResetRequest.create({ data: { userId: user.id } });
    }
  }

  return NextResponse.json({ ok: true });
}
