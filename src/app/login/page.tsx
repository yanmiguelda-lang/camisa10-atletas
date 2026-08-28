"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const form = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      email: form.get("email") as string,
      password: form.get("password") as string,
      redirect: false,
    });

    setCarregando(false);
    if (res?.ok) {
      router.push("/dashboard");
    } else {
      setErro("Email ou senha incorretos.");
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#F0F0F0",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "40px 20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      <Link href="/" style={{ textDecoration: "none", marginBottom: 40, display: "block", animation: "fadeInUp 0.5s ease both", position: "relative", zIndex: 1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Perfil Camisa 10" style={{ height: 52, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 24px rgba(249,115,22,0.25))" }} />
      </Link>

      <div className="card-light" style={{ width: "100%", maxWidth: 400, padding: "40px 36px", animation: "fadeInUp 0.6s ease 0.1s both", position: "relative", zIndex: 1 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Entrar</h1>
        <p style={{ color: "#666", fontSize: 14, marginBottom: 32 }}>Acesse o perfil do seu atleta</p>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="label-light" htmlFor="email">Email</label>
            <input className="input-light" id="email" name="email" type="email" placeholder="seu@email.com" required />
          </div>
          <div>
            <label className="label-light" htmlFor="password">Senha</label>
            <input className="input-light" id="password" name="password" type="password" placeholder="••••••••" required />
            <Link href="/esqueci-senha" style={{ display: "inline-block", marginTop: 8, fontSize: 12.5, color: "#666", textDecoration: "none" }}>
              Esqueci minha senha
            </Link>
          </div>

          {erro && (
            <div style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.30)", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
              {erro}
            </div>
          )}

          <button type="submit" className="btn-c10 btn-c10-primary" disabled={carregando} style={{ width: "100%", padding: "14px 26px", fontSize: 15, marginTop: 4 }}>
            {carregando ? (
              <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span style={{ width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                Entrando...
              </span>
            ) : (
              "Entrar →"
            )}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <p style={{ fontSize: 13, color: "#666" }}>
            Não tem conta?{" "}
            <Link href="/cadastro" style={{ color: "#F97316", textDecoration: "none", fontWeight: 700 }}>
              Criar perfil →
            </Link>
          </p>
        </div>
      </div>

      <p style={{ marginTop: 28, fontSize: 12, color: "#999", position: "relative", zIndex: 1 }}>Camisa 10 F.C. · Escola de Futsal</p>
    </main>
  );
}
