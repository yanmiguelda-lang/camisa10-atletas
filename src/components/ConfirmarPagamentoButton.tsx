"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export function ConfirmarPagamentoButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function confirmar() {
    setCarregando(true);
    setErro(null);
    try {
      const res = await fetch("/api/admin/confirmar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.error ?? "Não foi possível confirmar. Tente de novo.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Falha de conexão — tente de novo.");
    } finally {
      setCarregando(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
      <Button onClick={confirmar} variant="primary" size="sm" disabled={carregando}>
        {carregando ? "Confirmando..." : "Confirmar pagamento"}
      </Button>
      {erro && <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>{erro}</span>}
    </div>
  );
}
