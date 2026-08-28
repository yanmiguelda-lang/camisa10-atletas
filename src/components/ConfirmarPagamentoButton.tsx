"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export function ConfirmarPagamentoButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState<"confirmar" | "suspender" | null>(null);
  const [erro, setErro] = useState<string | null>(null);
  const [confirmandoSuspensao, setConfirmandoSuspensao] = useState(false);

  async function chamar(rota: "confirmar" | "suspender") {
    setCarregando(rota);
    setErro(null);
    try {
      const res = await fetch(`/api/admin/${rota}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subscriptionId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setErro(data?.error ?? "Não foi possível concluir. Tente de novo.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Falha de conexão — tente de novo.");
    } finally {
      setCarregando(null);
      setConfirmandoSuspensao(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
      {!confirmandoSuspensao ? (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            onClick={() => setConfirmandoSuspensao(true)}
            variant="outline-light"
            size="sm"
            disabled={carregando !== null}
          >
            Suspender
          </Button>
          <Button onClick={() => chamar("confirmar")} variant="primary" size="sm" disabled={carregando !== null}>
            {carregando === "confirmar" ? "Confirmando..." : "Confirmar pagamento"}
          </Button>
        </div>
      ) : (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 12, color: "#94a3b8" }}>Suspender este pedido?</span>
          <Button onClick={() => setConfirmandoSuspensao(false)} variant="outline-light" size="sm" disabled={carregando !== null}>
            Cancelar
          </Button>
          <Button onClick={() => chamar("suspender")} variant="secondary" size="sm" disabled={carregando !== null}>
            {carregando === "suspender" ? "Suspendendo..." : "Sim, suspender"}
          </Button>
        </div>
      )}
      {erro && <span style={{ fontSize: 12, color: "#f87171", fontWeight: 600 }}>{erro}</span>}
    </div>
  );
}
