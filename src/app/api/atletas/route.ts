import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarSlug } from "@/lib/slug";

const POLOS_VALIDOS = ["SANTANA", "BARUERI", "OSASCO"] as const;
const POSICOES_VALIDAS = ["GOLEIRO", "FIXO", "ALA", "PIVO"] as const;

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Dados inválidos." }, { status: 400 });
  }

  const { name, birthDate, polo, position, jerseyNumber, photoUrl } = body as {
    name?: string;
    birthDate?: string;
    polo?: string;
    position?: string;
    jerseyNumber?: number;
    photoUrl?: string;
  };

  if (!name?.trim() || !birthDate || !polo) {
    return NextResponse.json({ error: "Preencha nome, data de nascimento e polo." }, { status: 400 });
  }
  if (!POLOS_VALIDOS.includes(polo as (typeof POLOS_VALIDOS)[number])) {
    return NextResponse.json({ error: "Polo inválido." }, { status: 400 });
  }
  if (position && !POSICOES_VALIDAS.includes(position as (typeof POSICOES_VALIDAS)[number])) {
    return NextResponse.json({ error: "Posição inválida." }, { status: 400 });
  }
  const nascimento = new Date(birthDate);
  if (Number.isNaN(nascimento.getTime())) {
    return NextResponse.json({ error: "Data de nascimento inválida." }, { status: 400 });
  }
  if (nascimento.getTime() > Date.now()) {
    return NextResponse.json({ error: "Data de nascimento não pode ser no futuro." }, { status: 400 });
  }

  let jersey: number | undefined;
  if (jerseyNumber !== undefined && jerseyNumber !== null) {
    const n = Math.trunc(Number(jerseyNumber));
    if (!Number.isFinite(n) || n < 0 || n > 99) {
      return NextResponse.json({ error: "Número da camisa deve ser entre 0 e 99." }, { status: 400 });
    }
    jersey = n;
  }

  try {
    const atleta = await prisma.athlete.create({
      data: {
        userId,
        name: name.trim(),
        birthDate: nascimento,
        polo: polo as (typeof POLOS_VALIDOS)[number],
        position: position ? (position as (typeof POSICOES_VALIDAS)[number]) : undefined,
        jerseyNumber: jersey,
        photoUrl,
        publicSlug: gerarSlug(name),
      },
    });
    return NextResponse.json(atleta);
  } catch {
    return NextResponse.json({ error: "Não foi possível cadastrar o atleta. Tente de novo." }, { status: 500 });
  }
}
