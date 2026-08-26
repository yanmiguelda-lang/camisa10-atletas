import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  // Confere que o atleta pertence a esse responsável antes de gravar a partida.
  const atleta = await prisma.athlete.findFirst({ where: { id: params.id, userId } });
  if (!atleta) {
    return NextResponse.json({ error: "Atleta não encontrado." }, { status: 404 });
  }

  const body = await req.json();
  const {
    date,
    opponent,
    goals,
    assists,
    defensivePlays,
    position,
    notes,
    photoUrls,
  } = body as {
    date?: string;
    opponent?: string;
    goals?: number;
    assists?: number;
    defensivePlays?: number;
    position?: string;
    notes?: string;
    photoUrls?: string[];
  };

  if (!date || !opponent || !position) {
    return NextResponse.json({ error: "Preencha data, adversário e posição." }, { status: 400 });
  }

  const match = await prisma.match.create({
    data: {
      athleteId: atleta.id,
      date: new Date(date),
      opponent,
      goals: goals ?? 0,
      assists: assists ?? 0,
      defensivePlays: defensivePlays ?? 0,
      position: position as "GOLEIRO" | "FIXO" | "ALA" | "PIVO",
      notes,
      photos: photoUrls?.length
        ? { create: photoUrls.map((url) => ({ url })) }
        : undefined,
    },
    include: { photos: true },
  });

  return NextResponse.json(match);
}
