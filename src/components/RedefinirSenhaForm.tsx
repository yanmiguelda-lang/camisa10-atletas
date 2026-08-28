"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export function RedefinirSenhaForm({ requestId }: { requestId: string }) {
  const router = useRouter();
  const [aberto, setAberto] = useState(false);
  const [novaSenha, setNovaSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function confirmar() {
    if (novaSenha.length < 6) {
      setErro("A senha precisa ter pelo menos 6 caracteres.");
      return;
    }
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/admin/redefinir-senha", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestId, newPassword: novaSenha }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.error ?? "Não foi possível redefinir. Tente de novo.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Falha de conexão — tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  if (!aberto) {
    return (
      <Button onClick={() => setAberto(true)} variant="primary" size="sm">
        Definir nova senha
      </Button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      <div style={{ display: "flex", gap: 8 }}>
        <input
          type="text"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: 8,
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.06)",
            color: "#fff",
            fontSize: 13,
            width: 160,
          }}
        />
        <Button onClick={confirmar} variant="primary" size="sm" disabled={carregando}>
          {carregando ? "Salvando..." : "Salvar"}
        </Button>
      </div>
      <span style={{ fontSize: 11, color: "#94a3b8" }}>Avise o responsável dessa senha por WhatsApp ou telefone.</span>
      {erro && <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>{erro}</span>}
    </div>
  );
}
