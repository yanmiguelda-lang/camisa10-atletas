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

const POSICOES_VALIDAS = ["GOLEIRO", "FIXO", "ALA", "PIVO"] as const;

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

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { date, opponent, position, minutes, notes, photoUrls } = body as {
    date?: string;
    opponent?: string;
    position?: string;
    minutes?: number;
    notes?: string;
    photoUrls?: string[];
  };

  if (!date || !opponent?.trim() || !position) {
    return NextResponse.json({ error: "Preencha data, adversário e posição." }, { status: 400 });
  }
  if (!POSICOES_VALIDAS.includes(position as (typeof POSICOES_VALIDAS)[number])) {
    return NextResponse.json({ error: "Posição inválida." }, { status: 400 });
  }
  const dataJogo = new Date(date);
  if (Number.isNaN(dataJogo.getTime())) {
    return NextResponse.json({ error: "Data inválida." }, { status: 400 });
  }

  // Só aceita números inteiros ≥ 0 — descarta o resto silenciosamente em vez de quebrar o cadastro.
  function numeroValido(v: unknown): number | undefined {
    if (typeof v !== "number" || !Number.isFinite(v)) return undefined;
    const inteiro = Math.trunc(v);
    return inteiro >= 0 ? inteiro : 0;
  }

  const stats: Record<string, number> = {};
  for (const key of STAT_KEYS) {
    const valido = numeroValido(body[key]);
    if (valido !== undefined) stats[key] = valido;
  }
  const minutosValidos = numeroValido(minutes);

  try {
    const match = await prisma.match.create({
      data: {
        athleteId: atleta.id,
        date: dataJogo,
        opponent: opponent.trim(),
        position: position as (typeof POSICOES_VALIDAS)[number],
        minutes: minutosValidos,
        notes: notes?.trim() || undefined,
        goals: stats.goals ?? 0,
        assists: stats.assists ?? 0,
        ...stats,
        photos: photoUrls?.length ? { create: photoUrls.map((url) => ({ url })) } : undefined,
      },
      include: { photos: true },
    });
    return NextResponse.json(match);
  } catch {
    return NextResponse.json({ error: "Não foi possível salvar a partida. Tente de novo." }, { status: 500 });
  }
}
