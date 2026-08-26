"use client";

import { useEffect, useState } from "react";
import Button from "@/components/Button";
import { PLANOS, type PlanoKey } from "@/lib/pix";

const WA_NUMBER = "5511947928105";

export function PixCheckout({
  plan,
  txid,
  pixPayload,
  parentName,
}: {
  plan: PlanoKey;
  txid: string;
  pixPayload: string;
  parentName: string;
}) {
  const [qrUrl, setQrUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    import("qrcode").then((QRCode) => {
      QRCode.toDataURL(pixPayload, { width: 260, margin: 2, color: { dark: "#060E20", light: "#ffffff" } }).then(
        (url) => {
          if (!cancelled) setQrUrl(url);
        }
      );
    });
    return () => {
      cancelled = true;
    };
  }, [pixPayload]);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // clipboard indisponível — usuário copia manualmente
    }
  }

  const waMsg = encodeURIComponent(
    `Olá! Acabei de assinar o plano ${PLANOS[plan].label} na plataforma Camisa 10 F.C. e realizei o pagamento PIX de R$${PLANOS[plan].preco}.\n\nNome: ${parentName}\nReferência: ${txid}\n\nSegue o comprovante para ativação do acesso. 🧡`
  );

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <div style={{ fontSize: 36, marginBottom: 8 }}>🎉</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Quase lá!</h1>
        <div
          style={{
            display: "inline-block",
            background: plan === "CRAQUE" ? "rgba(249,115,22,0.12)" : "rgba(30,58,138,0.10)",
            border: `1px solid ${plan === "CRAQUE" ? "rgba(249,115,22,0.30)" : "rgba(30,58,138,0.25)"}`,
            borderRadius: 99,
            padding: "3px 14px",
            fontSize: 12,
            color: plan === "CRAQUE" ? "#F97316" : "#1E3A8A",
            fontWeight: 700,
            marginBottom: 8,
          }}
        >
          Plano {PLANOS[plan].label}
        </div>
        <p style={{ color: "#666", fontSize: 13, lineHeight: 1.6 }}>Pague o PIX para ativar o acesso.</p>
      </div>

      <div
        style={{
          background: "rgba(249,115,22,0.08)",
          border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 14,
          padding: 16,
          textAlign: "center",
          marginBottom: 20,
        }}
      >
        <div style={{ fontSize: 11, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 4 }}>
          Valor mensal
        </div>
        <div style={{ fontSize: 40, fontWeight: 900, color: "#F97316" }}>R$ {PLANOS[plan].preco},00</div>
        <div style={{ fontSize: 11, color: "#666", marginTop: 2 }}>
          Referência: <strong style={{ color: "#333" }}>{txid}</strong>
        </div>
      </div>

      {qrUrl && (
        <div style={{ textAlign: "center", marginBottom: 16 }}>
          <div style={{ display: "inline-block", background: "white", padding: 12, borderRadius: 16, border: "1px solid rgba(0,0,0,0.08)" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrUrl} alt="QR Code PIX" width={220} height={220} />
          </div>
          <div style={{ fontSize: 12, color: "#666", marginTop: 8 }}>Abra seu banco e escaneie o QR code</div>
        </div>
      )}

      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>
          Ou copie o código PIX
        </div>
        <div
          style={{
            background: "#F5F5F5",
            border: "1px solid rgba(0,0,0,0.08)",
            borderRadius: 12,
            padding: "12px 14px",
            fontSize: 10,
            color: "#555",
            wordBreak: "break-all",
            lineHeight: 1.5,
            marginBottom: 8,
            fontFamily: "monospace",
          }}
        >
          {pixPayload.substring(0, 60)}...
        </div>
        <Button onClick={handleCopy} variant="secondary" fullWidth>
          {copied ? "✓ Copiado!" : "Copiar código PIX"}
        </Button>
      </div>

      <a
        href={`https://wa.me/${WA_NUMBER}?text=${waMsg}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          background: "#25D366",
          color: "white",
          fontWeight: 700,
          fontSize: 15,
          padding: 14,
          borderRadius: 12,
          textAlign: "center",
          textDecoration: "none",
          marginBottom: 16,
          boxShadow: "0 4px 20px rgba(37,211,102,0.30)",
        }}
      >
        📲 Enviar comprovante no WhatsApp
      </a>

      <p style={{ fontSize: 12, color: "#666", textAlign: "center", lineHeight: 1.6 }}>
        Após confirmar o pagamento, ativamos seu acesso em até 1 dia útil.
      </p>
    </div>
  );
}
