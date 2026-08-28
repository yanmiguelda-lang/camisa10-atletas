import Link from "next/link";
import { PLANOS, type PlanoKey } from "@/lib/pix";

const WA_NUMBER = "5511947928105";

export function AguardandoAtivacao({
  athleteName,
  photoUrl,
  plan,
  txid,
}: {
  athleteName: string;
  photoUrl: string | null;
  plan: PlanoKey;
  txid: string;
}) {
  const waMsg = encodeURIComponent(
    `Olá! Meu pagamento do plano ${PLANOS[plan].label} pro perfil do(a) ${athleteName} já foi feito (referência ${txid}). Poderia confirmar a ativação, por favor? 🧡`
  );

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "72px 24px 60px", textAlign: "center" }}>
      <div
        style={{
          width: 96,
          height: 96,
          borderRadius: "50%",
          margin: "0 auto 28px",
          background: photoUrl ? "transparent" : "linear-gradient(135deg,#1E3A8A,#F97316)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "4px solid rgba(249,115,22,0.35)",
          boxShadow: "0 0 40px rgba(249,115,22,0.25)",
        }}
      >
        {photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photoUrl} alt={athleteName} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 40 }}>⚽</span>
        )}
      </div>

      <div style={{ fontSize: 34, marginBottom: 16 }}>🧡</div>

      <h1 className="text-gradient" style={{ fontSize: 24, fontWeight: 800, marginBottom: 12, letterSpacing: -0.3 }}>
        Recebemos o seu pagamento!
      </h1>

      <p style={{ fontSize: 15, color: "#94a3b8", lineHeight: 1.7, marginBottom: 28 }}>
        O perfil de <strong style={{ color: "#fff" }}>{athleteName}</strong> está quase pronto. Nossa equipe confere
        o pagamento manualmente e ativa o acesso em até <strong style={{ color: "#fff" }}>1 dia útil</strong> — assim
        que ativarmos, tudo aparece aqui automaticamente, sem precisar fazer nada.
      </p>

      <div
        style={{
          background: "rgba(249,115,22,0.08)",
          border: "1px solid rgba(249,115,22,0.25)",
          borderRadius: 14,
          padding: "16px 20px",
          marginBottom: 28,
          display: "inline-flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        <span style={{ fontSize: 11, fontWeight: 700, color: "#fb923c", textTransform: "uppercase", letterSpacing: 1 }}>
          Plano {PLANOS[plan].label}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>Referência: {txid}</span>
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
        📲 Falar com o Camisa 10 no WhatsApp
      </a>

      <Link href="/dashboard" style={{ fontSize: 13, color: "#64748b", textDecoration: "none" }}>
        ← Meus atletas
      </Link>
    </div>
  );
}
