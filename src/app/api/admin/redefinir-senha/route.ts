import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isAdminEmail } from "@/lib/admin";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const adminEmail = session?.user?.email;

  if (!isAdminEmail(adminEmail)) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 403 });
  }

  let requestId: string | undefined;
  let newPassword: string | undefined;
  try {
    ({ requestId, newPassword } = (await req.json()) as { requestId?: string; newPassword?: string });
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  if (!requestId || !newPassword) {
    return NextResponse.json({ error: "requestId e newPassword são obrigatórios." }, { status: 400 });
  }
  if (newPassword.length < 6) {
    return NextResponse.json({ error: "A nova senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const pedido = await prisma.passwordResetRequest.findUnique({ where: { id: requestId } });
  if (!pedido) {
    return NextResponse.json({ error: "Solicitação não encontrada — pode já ter sido resolvida." }, { status: 404 });
  }

  const passwordHash = await bcrypt.hash(newPassword, 10);

  await prisma.$transaction([
    prisma.user.update({ where: { id: pedido.userId }, data: { passwordHash } }),
    prisma.passwordResetRequest.update({ where: { id: requestId }, data: { status: "RESOLVED", resolvedAt: new Date() } }),
  ]);

  return NextResponse.json({ ok: true });
}
