"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";

export function ConfirmarPagamentoButton({ subscriptionId }: { subscriptionId: string }) {
  const router = useRouter();
  const [carregando, setCarregando] = useState(false);

  async function confirmar() {
    setCarregando(true);
    await fetch("/api/admin/confirmar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscriptionId }),
    });
    setCarregando(false);
    router.refresh();
  }

  return (
    <Button onClick={confirmar} variant="primary" size="sm" disabled={carregando}>
      {carregando ? "Confirmando..." : "Confirmar pagamento"}
    </Button>
  );
}
