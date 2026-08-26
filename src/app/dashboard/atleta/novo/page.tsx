"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/Button";
import { DashboardNav } from "@/components/DashboardNav";

const POSICOES: Record<string, string> = { GOLEIRO: "Goleiro", FIXO: "Fixo", ALA: "Ala", PIVO: "Pivô" };

export default function NovoAtletaPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);
  const [fotoPreview, setFotoPreview] = useState("");
  const [position, setPosition] = useState("");

  function handleFotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFoto(file);
    setFotoPreview(URL.createObjectURL(file));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    let photoUrl: string | undefined;
    if (foto) {
      const fd = new FormData();
      fd.append("file", foto);
      const upload = await fetch("/api/upload", { method: "POST", body: fd });
      if (upload.ok) {
        const data = await upload.json();
        photoUrl = data.url;
      }
    }

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/atletas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        birthDate: form.get("birthDate"),
        polo: form.get("polo"),
        position: position || undefined,
        jerseyNumber: form.get("jerseyNumber") ? Number(form.get("jerseyNumber")) : undefined,
        photoUrl,
      }),
    });

    setCarregando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Não foi possível cadastrar o atleta.");
      return;
    }

    const atleta = await res.json();
    router.push(`/dashboard/atleta/${atleta.id}`);
  }

  return (
    <main style={{ minHeight: "100vh", background: "#060E20", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <DashboardNav />
        <div style={{ maxWidth: 440, margin: "0 auto", padding: "36px 20px 60px" }}>
          <h1 className="text-gradient" style={{ fontSize: 22, fontWeight: 800, marginBottom: 20 }}>
            Cadastrar atleta
          </h1>

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ textAlign: "center" }}>
              <label style={{ cursor: "pointer", display: "inline-block" }}>
                <div style={{ width: 90, height: 90, borderRadius: "50%", margin: "0 auto 8px", background: fotoPreview ? "transparent" : "#0C1B36", border: "2px dashed rgba(249,115,22,0.45)", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", fontSize: 28 }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {fotoPreview ? <img src={fotoPreview} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : "📸"}
                </div>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>Foto (opcional)</span>
                <input type="file" accept="image/*" onChange={handleFotoChange} style={{ display: "none" }} />
              </label>
            </div>

            <div>
              <label className="label" htmlFor="name">Nome do atleta</label>
              <input className="input" id="name" name="name" required />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <div>
                <label className="label" htmlFor="jerseyNumber">Nº da camisa</label>
                <input className="input" id="jerseyNumber" name="jerseyNumber" type="number" min={1} max={99} />
              </div>
              <div>
                <label className="label" htmlFor="birthDate">Nascimento</label>
                <input className="input" id="birthDate" name="birthDate" type="date" required />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="polo">Polo</label>
              <select className="input" id="polo" name="polo" required defaultValue="SANTANA">
                <option value="SANTANA">Santana de Parnaíba</option>
                <option value="BARUERI">Barueri</option>
                <option value="OSASCO">Osasco</option>
              </select>
            </div>
            <div>
              <label className="label">Posição</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {Object.entries(POSICOES).map(([key, label]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setPosition(key)}
                    style={{
                      padding: 12,
                      borderRadius: 10,
                      border: `1.5px solid ${position === key ? "#F97316" : "rgba(255,255,255,0.10)"}`,
                      background: position === key ? "rgba(249,115,22,0.10)" : "#0C1B36",
                      color: position === key ? "#F97316" : "#cbd5e1",
                      fontWeight: position === key ? 700 : 400,
                      fontSize: 14,
                      cursor: "pointer",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {erro && <p style={{ color: "#f87171", fontSize: 13 }}>{erro}</p>}

            <Button type="submit" variant="primary" fullWidth disabled={carregando}>
              {carregando ? "Salvando..." : "Cadastrar"}
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}
