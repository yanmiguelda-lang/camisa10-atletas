import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const body = await req.json();
  const { name, email, password, phone } = body as {
    name?: string;
    email?: string;
    password?: string;
    phone?: string;
  };

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Preencha nome, email e senha." }, { status: 400 });
  }
  if (password.length < 6) {
    return NextResponse.json({ error: "A senha precisa ter pelo menos 6 caracteres." }, { status: 400 });
  }

  const emailNormalizado = email.toLowerCase().trim();
  const existente = await prisma.user.findUnique({ where: { email: emailNormalizado } });
  if (existente) {
    return NextResponse.json({ error: "Já existe uma conta com esse email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email: emailNormalizado, passwordHash, phone },
  });

  return NextResponse.json({ id: user.id, email: user.email });
}
