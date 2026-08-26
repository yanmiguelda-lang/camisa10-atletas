"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function CadastroPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const payload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      phone: form.get("phone") as string,
    };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Não foi possível criar a conta.");
      setCarregando(false);
      return;
    }

    const login = await signIn("credentials", {
      email: payload.email,
      password: payload.password,
      redirect: false,
    });

    setCarregando(false);
    if (login?.ok) {
      router.push("/dashboard");
    } else {
      router.push("/login");
    }
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-16">
      <h1 className="mb-1 text-2xl font-bold">Criar conta de responsável</h1>
      <p className="mb-6 text-sm text-c10-blue-dark/60">
        Pra cadastrar seu atleta e registrar as partidas dele no Camisa 10 FC.
      </p>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label" htmlFor="name">Seu nome</label>
          <input className="input" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input className="input" id="email" name="email" type="email" required />
        </div>
        <div>
          <label className="label" htmlFor="phone">WhatsApp (opcional)</label>
          <input className="input" id="phone" name="phone" placeholder="(11) 90000-0000" />
        </div>
        <div>
          <label className="label" htmlFor="password">Senha</label>
          <input className="input" id="password" name="password" type="password" minLength={6} required />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button className="btn-primary w-full" type="submit" disabled={carregando}>
          {carregando ? "Criando conta..." : "Criar conta"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-c10-blue-dark/60">
        Já tem conta?{" "}
        <Link className="font-semibold text-c10-blue" href="/login">
          Entrar
        </Link>
      </p>
    </main>
  );
}
