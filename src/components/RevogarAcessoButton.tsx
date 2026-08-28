"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export function RevogarAcessoButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [confirmando, setConfirmando] = useState(false);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function revogar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/admin/suspender", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.error ?? "Não foi possível remover o acesso. Tente de novo.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Falha de conexão — tente de novo.");
    } finally {
      setCarregando(false);
      setConfirmando(false);
    }
  }

  if (!confirmando) {
    return (
      <Button onClick={() => setConfirmando(true)} variant="outline-light" size="sm">
        Remover acesso
      </Button>
    );
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>Remover o acesso desse atleta?</span>
        <Button onClick={() => setConfirmando(false)} variant="outline-light" size="sm" disabled={carregando}>
          Cancelar
        </Button>
        <Button onClick={revogar} variant="secondary" size="sm" disabled={carregando}>
          {carregando ? "Removendo..." : "Sim, remover"}
        </Button>
      </div>
      {erro && <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>{erro}</span>}
    </div>
  );
}
