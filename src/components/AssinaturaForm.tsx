"use client";

import { useState } from "react";
import { PLANOS, type PlanoKey } from "@/lib/pix";
import { PixCheckout } from "@/components/PixCheckout";
import Link from "next/link";

export function AssinaturaForm({ athleteId, parentName }: { athleteId: string; parentName: string }) {
  const [carregando, setCarregando] = useState(false);
  const [plano, setPlano] = useState<PlanoKey | null>(null);
  const [pix, setPix] = useState<{ txid: string; pixPayload: string; plan: PlanoKey } | null>(null);

  async function escolherPlano(key: PlanoKey) {
    if (carregando) return;
    setPlano(key);
    setCarregando(true);
    const res = await fetch("/api/assinatura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athleteId, plan: key }),
    });
    setCarregando(false);
    if (res.ok) {
      const data = await res.json();
      setPix({ txid: data.txid, pixPayload: data.pixPayload, plan: data.plan });
    }
  }

  if (pix) {
    return <PixCheckout plan={pix.plan} txid={pix.txid} pixPayload={pix.pixPayload} parentName={parentName} />;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
      {(Object.entries(PLANOS) as [PlanoKey, (typeof PLANOS)[PlanoKey]][]).map(([key, p]) => (
        <button
          key={key}
          type="button"
          onClick={() => escolherPlano(key)}
          disabled={carregando}
          style={{
            textAlign: "left",
            padding: "20px 22px",
            borderRadius: 14,
            border: `2px solid ${key === "CRAQUE" ? "rgba(249,115,22,0.40)" : "rgba(30,58,138,0.25)"}`,
            background: key === "CRAQUE" ? "rgba(249,115,22,0.06)" : "rgba(30,58,138,0.05)",
            cursor: carregando ? "not-allowed" : "pointer",
            opacity: carregando && plano !== key ? 0.5 : 1,
            position: "relative",
          }}
        >
          {key === "CRAQUE" && (
            <div
              style={{
                position: "absolute",
                top: -10,
                right: 16,
                background: "linear-gradient(135deg,#F97316,#ea6c10)",
                color: "white",
                fontSize: 10,
                fontWeight: 800,
                padding: "3px 10px",
                borderRadius: 99,
                letterSpacing: 1,
              }}
            >
              POPULAR
            </div>
          )}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div style={{ fontWeight: 800, fontSize: 17, color: key === "TORCIDA" ? "#1E3A8A" : p.cor }}>
              {key === "TORCIDA" ? "🔵" : "🟠"} Plano {p.label}
            </div>
            <div style={{ fontSize: 22, fontWeight: 900, color: key === "TORCIDA" ? "#1E3A8A" : p.cor }}>
              R${p.preco}
              <span style={{ fontSize: 12, fontWeight: 400, color: "#999" }}>/mês</span>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#666", lineHeight: 1.5 }}>{p.descricao}</div>
          {carregando && plano === key && <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>Gerando PIX...</div>}
        </button>
      ))}
      <Link href="/dashboard" style={{ textAlign: "center", fontSize: 13, color: "#666", textDecoration: "none", marginTop: 4 }}>
        ← Voltar
      </Link>
    </div>
  );
}
