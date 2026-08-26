import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { gerarSlug } from "@/lib/slug";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  const body = await req.json();
  const { name, birthDate, polo, position, jerseyNumber, photoUrl } = body as {
    name?: string;
    birthDate?: string;
    polo?: string;
    position?: string;
    jerseyNumber?: number;
    photoUrl?: string;
  };

  if (!name || !birthDate || !polo) {
    return NextResponse.json({ error: "Preencha nome, data de nascimento e polo." }, { status: 400 });
  }

  const atleta = await prisma.athlete.create({
    data: {
      userId,
      name,
      birthDate: new Date(birthDate),
      polo: polo as "SANTANA" | "BARUERI" | "OSASCO",
      position: position ? (position as "GOLEIRO" | "FIXO" | "ALA" | "PIVO") : undefined,
      jerseyNumber: jerseyNumber ?? undefined,
      photoUrl,
      publicSlug: gerarSlug(name),
    },
  });

  return NextResponse.json(atleta);
}
