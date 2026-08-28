"use client";

import { useState } from "react";
import Link from "next/link";

export default function EsqueciSenhaPage() {
  const [email, setEmail] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/esqueci-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        setErro("Não foi possível enviar sua solicitação agora. Tente de novo em instantes.");
        return;
      }
      setEnviado(true);
    } catch {
      setErro("Falha de conexão — tente de novo.");
    } finally {
      setCarregando(false);
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

      <Link href="/" style={{ textDecoration: "none", marginBottom: 40, display: "block", position: "relative", zIndex: 1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Camisa 10 F.C." style={{ height: 52, width: "auto", filter: "drop-shadow(0 4px 24px rgba(249,115,22,0.25))" }} />
      </Link>

      <div className="card-light" style={{ width: "100%", maxWidth: 400, padding: "40px 36px", position: "relative", zIndex: 1 }}>
        {!enviado ? (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Esqueci minha senha</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28, lineHeight: 1.5 }}>
              Informe o email da sua conta. A equipe do Camisa 10 vai entrar em contato com você (por
              WhatsApp ou telefone) para redefinir sua senha com segurança.
            </p>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="label-light" htmlFor="email">Email</label>
                <input
                  className="input-light"
                  id="email"
                  type="email"
                  placeholder="seu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              {erro && (
                <div style={{ background: "rgba(248,113,113,0.10)", border: "1px solid rgba(248,113,113,0.30)", borderRadius: 10, padding: "10px 14px", color: "#dc2626", fontSize: 13 }}>
                  {erro}
                </div>
              )}
              <button type="submit" className="btn-c10 btn-c10-primary" disabled={carregando} style={{ width: "100%", padding: "14px 26px", fontSize: 15 }}>
                {carregando ? "Enviando..." : "Solicitar redefinição →"}
              </button>
            </form>
          </>
        ) : (
          <>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 10, color: "#0A0A0A" }}>Solicitação recebida</h1>
            <p style={{ color: "#555", fontSize: 14, lineHeight: 1.6 }}>
              Se esse email tiver uma conta cadastrada, a equipe do Camisa 10 vai entrar em contato em
              breve pra te ajudar a redefinir a senha. 🧡💙
            </p>
          </>
        )}

        <div style={{ textAlign: "center", marginTop: 28, paddingTop: 24, borderTop: "1px solid rgba(0,0,0,0.08)" }}>
          <Link href="/login" style={{ color: "#F97316", textDecoration: "none", fontWeight: 700, fontSize: 13 }}>
            ← Voltar para o login
          </Link>
        </div>
      </div>
    </main>
  );
}
