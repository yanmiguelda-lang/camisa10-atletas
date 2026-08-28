"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { PLANOS, type PlanoKey } from "@/lib/pix";
import { PixCheckout } from "@/components/PixCheckout";

type Step = "conta" | "atleta" | "plano" | "pix";

const POSICOES: Record<string, string> = { GOLEIRO: "Goleiro", FIXO: "Fixo", ALA: "Ala", PIVO: "Pivô" };
const POLOS: Record<string, string> = { SANTANA: "Santana de Parnaíba", BARUERI: "Barueri", OSASCO: "Osasco" };

export default function CadastroPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("conta");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Conta
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [pass, setPass] = useState("");
  const [aceitouTermos, setAceitouTermos] = useState(false);

  // Atleta
  const [athleteName, setAthleteName] = useState("");
  const [jersey, setJersey] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [polo, setPolo] = useState("SANTANA");
  const [position, setPosition] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState("");

  // Pagamento
  const [plan, setPlan] = useState<PlanoKey>("TORCIDA");
  const [pix, setPix] = useState<{ txid: string; pixPayload: string } | null>(null);

  function handleConta(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || pass.length < 6) {
      setError("Preencha todos os campos. Senha mínimo 6 caracteres.");
      return;
    }
    if (!aceitouTermos) {
      setError("Você precisa aceitar os Termos de Uso e a Política de Privacidade para continuar.");
      return;
    }
    setError("");
    setStep("atleta");
  }

  function handleAtletaForm(e: React.FormEvent) {
    e.preventDefault();
    if (!athleteName.trim() || !birthDate || !position) {
      setError("Preencha nome, data de nascimento e posição do atleta.");
      return;
    }
    setError("");
    setStep("plano");
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhoto(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function handlePlano(selectedPlan: PlanoKey) {
    if (loading) return;
    setPlan(selectedPlan);
    setLoading(true);
    setError("");

    // 1) Cria a conta do responsável
    const registerRes = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password: pass, phone, termsAccepted: aceitouTermos }),
    });
    if (!registerRes.ok) {
      const data = await registerRes.json();
      setError(data.error ?? "Erro ao criar conta.");
      setLoading(false);
      return;
    }

    // 2) Loga
    const login = await signIn("credentials", { email, password: pass, redirect: false });
    if (!login?.ok) {
      setError("Conta criada, mas não foi possível entrar automaticamente. Tente fazer login.");
      setLoading(false);
      return;
    }

    // 3) Sobe a foto, se houver
    let photoUrl: string | undefined;
    if (photo) {
      const fd = new FormData();
      fd.append("file", photo);
      const upload = await fetch("/api/upload", { method: "POST", body: fd });
      if (upload.ok) {
        const data = await upload.json();
        photoUrl = data.url;
      }
    }

    // 4) Cria o atleta
    const athleteRes = await fetch("/api/atletas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: athleteName, birthDate, polo, position, jerseyNumber: jersey ? Number(jersey) : undefined, photoUrl }),
    });
    if (!athleteRes.ok) {
      const data = await athleteRes.json();
      setError("Conta criada, mas houve um erro ao salvar o atleta: " + (data.error ?? ""));
      setLoading(false);
      return;
    }
    const athlete = await athleteRes.json();

    // 5) Cria a assinatura pendente e pega o PIX
    const subRes = await fetch("/api/assinatura", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ athleteId: athlete.id, plan: selectedPlan }),
    });
    if (!subRes.ok) {
      setError("Atleta criado! Mas não foi possível gerar o PIX agora — acesse seu painel para tentar de novo.");
      setLoading(false);
      return;
    }
    const sub = await subRes.json();

    setPix({ txid: sub.txid, pixPayload: sub.pixPayload });
    setLoading(false);
    setStep("pix");
  }

  const steps: Step[] = ["conta", "atleta", "plano", "pix"];
  const stepLabel: Record<Step, string> = { conta: "Conta", atleta: "Atleta", plano: "Plano", pix: "Pagamento" };
  const stepIdx = steps.indexOf(step);

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

      <Link href="/" style={{ textDecoration: "none", marginBottom: 36, display: "block", position: "relative", zIndex: 1 }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Perfil Camisa 10" style={{ height: 48, width: "auto", objectFit: "contain", filter: "drop-shadow(0 4px 20px rgba(249,115,22,0.20))" }} />
      </Link>

      {/* Progresso */}
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 36, position: "relative", zIndex: 1 }}>
        {steps.map((s, i) => (
          <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div
                style={{
                  width: 26,
                  height: 26,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 11,
                  fontWeight: 700,
                  background: i < stepIdx ? "#1E3A8A" : i === stepIdx ? "#F97316" : "rgba(0,0,0,0.08)",
                  color: i <= stepIdx ? "white" : "#999",
                  transition: "all 0.3s",
                }}
              >
                {i < stepIdx ? "✓" : i + 1}
              </div>
              <span style={{ fontSize: 11, color: i === stepIdx ? "#0A0A0A" : "#999", fontWeight: i === stepIdx ? 600 : 400 }}>{stepLabel[s]}</span>
            </div>
            {i < steps.length - 1 && <div style={{ width: 20, height: 1, background: i < stepIdx ? "rgba(30,58,138,0.60)" : "rgba(0,0,0,0.10)" }} />}
          </div>
        ))}
      </div>

      <div
        className="card-light"
        style={{ width: "100%", maxWidth: step === "plano" ? 520 : step === "pix" ? 480 : 440, padding: "36px 32px", position: "relative", zIndex: 1 }}
      >
        {/* PASSO 1 — CONTA */}
        {step === "conta" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Criar sua conta</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Passo 1 de 4</p>
            <form onSubmit={handleConta} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <label className="label-light">Seu nome</label>
                <input className="input-light" type="text" placeholder="Maria Silva" value={name} onChange={(e) => setName(e.target.value)} required />
              </div>
              <div>
                <label className="label-light">Email</label>
                <input className="input-light" type="email" placeholder="maria@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <div>
                <label className="label-light">WhatsApp (opcional)</label>
                <input className="input-light" type="text" placeholder="(11) 90000-0000" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div>
                <label className="label-light">Senha</label>
                <input className="input-light" type="password" placeholder="Mínimo 6 caracteres" value={pass} onChange={(e) => setPass(e.target.value)} required />
              </div>
              <label style={{ display: "flex", alignItems: "flex-start", gap: 8, fontSize: 12.5, color: "#555", cursor: "pointer", lineHeight: 1.5 }}>
                <input
                  type="checkbox"
                  checked={aceitouTermos}
                  onChange={(e) => setAceitouTermos(e.target.checked)}
                  style={{ marginTop: 2, width: 15, height: 15, flexShrink: 0, cursor: "pointer" }}
                />
                <span>
                  Li e aceito os{" "}
                  <Link href="/termos" target="_blank" style={{ color: "#F97316", fontWeight: 600, textDecoration: "underline" }}>
                    Termos de Uso e a Política de Privacidade
                  </Link>{" "}
                  do Camisa 10 F.C.
                </span>
              </label>
              {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
              <button type="submit" className="btn-c10 btn-c10-primary" style={{ width: "100%", padding: "14px 26px", fontSize: 15 }}>
                Continuar →
              </button>
            </form>
            <p style={{ textAlign: "center", marginTop: 24, fontSize: 13, color: "#666" }}>
              Já tem conta?{" "}
              <Link href="/login" style={{ color: "#F97316", textDecoration: "none", fontWeight: 600 }}>
                Entrar
              </Link>
            </p>
          </>
        )}

        {/* PASSO 2 — ATLETA */}
        {step === "atleta" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Perfil do atleta</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Passo 2 de 4 · Dados do seu filho</p>
            <form onSubmit={handleAtletaForm} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div style={{ textAlign: "center" }}>
                <label style={{ cursor: "pointer", display: "inline-block" }}>
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: "50%",
                      margin: "0 auto 8px",
                      background: photoPreview ? "transparent" : "#F5F5F5",
                      border: "2px dashed rgba(249,115,22,0.45)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      fontSize: 28,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    {photoPreview ? <img src={photoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📸"}
                  </div>
                  <span style={{ fontSize: 12, color: "#666" }}>Foto do atleta (opcional)</span>
                  <input type="file" accept="image/*" onChange={handlePhotoChange} style={{ display: "none" }} />
                </label>
              </div>
              <div>
                <label className="label-light">Nome do atleta</label>
                <input className="input-light" type="text" placeholder="Gustavo Silva" value={athleteName} onChange={(e) => setAthleteName(e.target.value)} required />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label className="label-light">Nº da camisa</label>
                  <input className="input-light" type="number" min={1} max={99} placeholder="10" value={jersey} onChange={(e) => setJersey(e.target.value)} />
                </div>
                <div>
                  <label className="label-light">Nascimento</label>
                  <input className="input-light" type="date" value={birthDate} onChange={(e) => setBirthDate(e.target.value)} required />
                </div>
              </div>
              <div>
                <label className="label-light">Polo</label>
                <select className="input-light" value={polo} onChange={(e) => setPolo(e.target.value)} style={{ cursor: "pointer" }}>
                  {Object.entries(POLOS).map(([key, label]) => (
                    <option key={key} value={key}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label-light">Posição</label>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                  {Object.entries(POSICOES).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setPosition(key)}
                      style={{
                        padding: 12,
                        borderRadius: 10,
                        border: `1.5px solid ${position === key ? "#F97316" : "rgba(0,0,0,0.10)"}`,
                        background: position === key ? "rgba(249,115,22,0.10)" : "#F5F5F5",
                        color: position === key ? "#F97316" : "#555",
                        fontWeight: position === key ? 700 : 400,
                        fontSize: 14,
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
              {error && <p style={{ color: "#dc2626", fontSize: 13 }}>{error}</p>}
              <button type="submit" className="btn-c10 btn-c10-primary" style={{ width: "100%", padding: "14px 26px", fontSize: 15 }}>
                Escolher plano →
              </button>
            </form>
            <button
              onClick={() => {
                setStep("conta");
                setError("");
              }}
              style={{ background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", marginTop: 16, display: "block", textAlign: "center", width: "100%" }}
            >
              ← Voltar
            </button>
          </>
        )}

        {/* PASSO 3 — PLANO */}
        {step === "plano" && (
          <>
            <h1 style={{ fontSize: 24, fontWeight: 800, marginBottom: 6, color: "#0A0A0A" }}>Escolha seu plano</h1>
            <p style={{ color: "#666", fontSize: 14, marginBottom: 28 }}>Passo 3 de 4 · Você pode mudar depois</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14, marginBottom: 8 }}>
              {(Object.entries(PLANOS) as [PlanoKey, (typeof PLANOS)[PlanoKey]][]).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => handlePlano(key)}
                  disabled={loading}
                  style={{
                    textAlign: "left",
                    padding: "20px 22px",
                    borderRadius: 14,
                    border: `2px solid ${key === "CRAQUE" ? "rgba(249,115,22,0.40)" : "rgba(30,58,138,0.25)"}`,
                    background: key === "CRAQUE" ? "rgba(249,115,22,0.06)" : "rgba(30,58,138,0.05)",
                    cursor: loading ? "not-allowed" : "pointer",
                    opacity: loading ? 0.6 : 1,
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
                  {loading && plan === key && <div style={{ marginTop: 10, fontSize: 12, color: "#666" }}>Criando conta...</div>}
                </button>
              ))}
            </div>

            {error && <p style={{ color: "#dc2626", fontSize: 13, marginTop: 8 }}>{error}</p>}
            <button
              onClick={() => {
                setStep("atleta");
                setError("");
              }}
              style={{ background: "none", border: "none", color: "#666", fontSize: 13, cursor: "pointer", marginTop: 16, display: "block", textAlign: "center", width: "100%" }}
            >
              ← Voltar
            </button>
          </>
        )}

        {/* PASSO 4 — PIX */}
        {step === "pix" && pix && (
          <>
            <PixCheckout plan={plan} txid={pix.txid} pixPayload={pix.pixPayload} parentName={name} />
            <Link href="/dashboard" style={{ display: "block", textAlign: "center", marginTop: 16, fontSize: 13, color: "#666", textDecoration: "none" }}>
              Ir pro meu painel →
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
