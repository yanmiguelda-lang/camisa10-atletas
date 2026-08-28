import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const atleta = await prisma.athlete.findFirst({ where: { id: params.id, userId } });
  if (!atleta) {
    return NextResponse.json({ error: "Atleta não encontrado." }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }
  const { photoUrl } = body as { photoUrl?: string };
  if (!photoUrl || typeof photoUrl !== "string") {
    return NextResponse.json({ error: "photoUrl é obrigatório." }, { status: 400 });
  }

  try {
    const atualizado = await prisma.athlete.update({ where: { id: atleta.id }, data: { photoUrl } });
    return NextResponse.json(atualizado);
  } catch {
    return NextResponse.json({ error: "Não foi possível atualizar a foto. Tente de novo." }, { status: 500 });
  }
}
