"use client";

import { useState } from "react";
import Button from "@/components/Button";
import { POSITION_STATS, STAT_LABELS, type StatKey } from "@/lib/positionStats";

const POSICOES: Record<string, string> = { GOLEIRO: "Goleiro", FIXO: "Fixo", ALA: "Ala", PIVO: "Pivô" };

export function NovaPartidaForm({
  athleteId,
  defaultPosition,
  craquePlan,
  onSaved,
}: {
  athleteId: string;
  defaultPosition?: string;
  craquePlan: boolean;
  onSaved: () => void;
}) {
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [fotos, setFotos] = useState<FileList | null>(null);
  const [fotosPreview, setFotosPreview] = useState<string[]>([]);
  const [position, setPosition] = useState((defaultPosition as keyof typeof POSITION_STATS) ?? "ALA");

  const statFields = POSITION_STATS[position];

  function handleFotosChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = e.target.files;
    setFotos(files);
    setFotosPreview(files ? Array.from(files).map((f) => URL.createObjectURL(f)) : []);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const photoUrls: string[] = [];
    if (craquePlan && fotos) {
      for (const file of Array.from(fotos)) {
        const fd = new FormData();
        fd.append("file", file);
        const upload = await fetch("/api/upload", { method: "POST", body: fd });
        if (upload.ok) {
          const data = await upload.json();
          photoUrls.push(data.url);
        }
      }
    }

    const form = new FormData(e.currentTarget);
    const stats: Record<string, number> = {};
    for (const key of statFields) {
      const raw = form.get(key);
      if (raw !== null && raw !== "") stats[key] = Number(raw);
    }

    const res = await fetch(`/api/atletas/${athleteId}/partidas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.get("date"),
        opponent: form.get("opponent"),
        position,
        minutes: form.get("minutes") ? Number(form.get("minutes")) : undefined,
        notes: form.get("notes"),
        photoUrls,
        ...stats,
      }),
    });

    setCarregando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Não foi possível registrar a partida.");
      return;
    }

    onSaved();
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        <div>
          <label className="label" htmlFor="date">Data</label>
          <input className="input" id="date" name="date" type="date" required />
        </div>
        <div>
          <label className="label" htmlFor="opponent">Adversário</label>
          <input className="input" id="opponent" name="opponent" placeholder="Ex: Lions F.C." required />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="position">Posição na partida</label>
        <select
          className="input"
          id="position"
          name="position"
          value={position}
          onChange={(e) => setPosition(e.target.value as keyof typeof POSITION_STATS)}
          required
        >
          {Object.entries(POSICOES).map(([key, label]) => (
            <option key={key} value={key}>{label}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="label" htmlFor="minutes">Minutagem (opcional)</label>
        <input className="input" id="minutes" name="minutes" type="number" min={0} max={60} placeholder="Ex: 32" />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {statFields.map((key) => (
          <div key={key}>
            <label className="label" htmlFor={key}>{STAT_LABELS[key as StatKey]}</label>
            <input className="input" id={key} name={key} type="number" min={0} defaultValue={0} />
          </div>
        ))}
      </div>

      <div>
        <label className="label" htmlFor="notes">Observações (opcional)</label>
        <input className="input" id="notes" name="notes" placeholder="Ex: Grande atuação!" />
      </div>

      {craquePlan ? (
        <div>
          <label className="label" htmlFor="photos">Fotos do jogo (opcional)</label>
          <label style={{ cursor: "pointer", display: "block" }}>
            <div
              style={{
                borderRadius: 16,
                border: "2px dashed rgba(249,115,22,0.35)",
                background: "linear-gradient(135deg, rgba(249,115,22,0.08), rgba(249,115,22,0.02))",
                overflow: "hidden",
                padding: fotosPreview.length ? 10 : 0,
              }}
            >
              {fotosPreview.length ? (
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {fotosPreview.map((src) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={src} src={src} alt="" style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10 }} />
                  ))}
                </div>
              ) : (
                <div style={{ height: 110, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 10 }}>
                  <span style={{ fontSize: 30 }}>📸</span>
                  <span style={{ fontSize: 13, color: "#cbd5e1", fontWeight: 600 }}>Clique para adicionar fotos</span>
                </div>
              )}
            </div>
            <input id="photos" type="file" accept="image/*" multiple onChange={handleFotosChange} style={{ display: "none" }} />
          </label>
        </div>
      ) : (
        <div style={{ borderRadius: 16, border: "1.5px dashed rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.04)", padding: 18, textAlign: "center" }}>
          <div style={{ fontSize: 13, color: "#cbd5e1", marginBottom: 6, fontWeight: 600 }}>
            📸 Fotos por jogo disponíveis no <strong style={{ color: "#F97316" }}>Plano Craque</strong>
          </div>
          <div style={{ fontSize: 12, color: "#64748b" }}>Fale no WhatsApp da sua escolinha pra fazer upgrade</div>
        </div>
      )}

      {erro && <p style={{ color: "#f87171", fontSize: 13, fontWeight: 600 }}>{erro}</p>}

      <Button type="submit" variant="primary" fullWidth disabled={carregando}>
        {carregando ? "Salvando..." : "Salvar jogo"}
      </Button>
    </form>
  );
}
