import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const TAMANHO_MAXIMO = 10 * 1024 * 1024; // 10MB

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Não autenticado." }, { status: 401 });
  }

  let file: FormDataEntryValue | null;
  try {
    const form = await req.formData();
    file = form.get("file");
  } catch {
    return NextResponse.json({ error: "Não consegui ler o arquivo enviado." }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Nenhum arquivo enviado." }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "Envie apenas imagens (JPG, PNG, etc)." }, { status: 400 });
  }
  if (file.size > TAMANHO_MAXIMO) {
    return NextResponse.json({ error: "Imagem muito grande — envie um arquivo de até 10MB." }, { status: 400 });
  }

  try {
    const blob = await put(`camisa10/${Date.now()}-${file.name}`, file, {
      access: "public",
    });
    return NextResponse.json({ url: blob.url });
  } catch {
    return NextResponse.json({ error: "Não foi possível subir a imagem agora. Tente de novo em instantes." }, { status: 502 });
  }
}
