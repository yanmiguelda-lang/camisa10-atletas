import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { StatKey } from "@/lib/positionStats";

const STAT_KEYS: StatKey[] = [
  "goals",
  "assists",
  "saves",
  "goalsConceded",
  "savesOneOnOne",
  "hardSaves",
  "passesCompleted",
  "tackles",
  "interceptions",
  "progressivePasses",
  "effectivePressures",
  "shots",
  "dribblesCompleted",
  "chancesCreated",
  "foulsSuffered",
  "recoveries",
  "duelsWon",
  "ballsLost",
];

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
  const { date, opponent, position, minutes, notes, photoUrls } = body as {
    date?: string;
    opponent?: string;
    position?: string;
    minutes?: number;
    notes?: string;
    photoUrls?: string[];
  };

  if (!date || !opponent || !position) {
    return NextResponse.json({ error: "Preencha data, adversário e posição." }, { status: 400 });
  }

  // Monta só as estatísticas que vieram no corpo — o restante fica null (não se aplica àquela posição).
  const stats: Record<string, number> = {};
  for (const key of STAT_KEYS) {
    const value = (body as Record<string, unknown>)[key];
    if (typeof value === "number" && Number.isFinite(value)) stats[key] = value;
  }

  const match = await prisma.match.create({
    data: {
      athleteId: atleta.id,
      date: new Date(date),
      opponent,
      position: position as "GOLEIRO" | "FIXO" | "ALA" | "PIVO",
      minutes,
      notes,
      goals: stats.goals ?? 0,
      assists: stats.assists ?? 0,
      ...stats,
      photos: photoUrls?.length
        ? { create: photoUrls.map((url) => ({ url })) }
        : undefined,
    },
    include: { photos: true },
  });

  return NextResponse.json(match);
}
