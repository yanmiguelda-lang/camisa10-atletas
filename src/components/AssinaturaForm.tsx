"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { PLANOS, type PlanoKey } from "@/lib/pix";

export function AssinaturaForm({
  athleteId,
  pixKey,
  pixNome,
}: {
  athleteId: string;
  pixKey: string;
  pixNome: string;
}) {
  const router = useRouter();
  const [plano, setPlano] = useState<PlanoKey>("TORCIDA");
  const [carregando, setCarregando] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function confirmarPix() {
    setCarregando(true);
    await fetch("/api/assinatura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athleteId, plan: plano }),
    });
    setCarregando(false);
    router.refresh();
  }

  async function copiarChave() {
    try {
      await navigator.clipboard.writeText(pixKey);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard indisponível — usuário copia manualmente
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-3">
        {(Object.keys(PLANOS) as PlanoKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setPlano(key)}
            className={`card text-left transition ${
              plano === key ? "ring-2 ring-c10-blue" : "opacity-80 hover:opacity-100"
            }`}
          >
            <p className="font-semibold">
              {PLANOS[key].label} — R$ {PLANOS[key].preco}/mês
            </p>
            <p className="text-sm text-c10-blue-dark/70">{PLANOS[key].descricao}</p>
          </button>
        ))}
      </div>

      <div className="card-accent">
        <p className="text-sm font-medium text-c10-blue-dark/80">Chave PIX ({pixNome})</p>
        <div className="mt-1 flex items-center justify-between gap-2">
          <code className="break-all text-sm">{pixKey || "Chave PIX não configurada"}</code>
          <button type="button" onClick={copiarChave} className="shrink-0 text-sm font-semibold text-c10-blue">
            {copiado ? "Copiado!" : "Copiar"}
          </button>
        </div>
      </div>

      <button className="btn-primary w-full" onClick={confirmarPix} disabled={carregando}>
        {carregando ? "Enviando..." : "Já fiz o PIX"}
      </button>
    </div>
  );
}
