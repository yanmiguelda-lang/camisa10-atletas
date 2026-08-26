"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function NovaPartidaForm({ athleteId }: { athleteId: string }) {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [fotos, setFotos] = useState<FileList | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErro(null);
    setCarregando(true);

    const photoUrls: string[] = [];
    if (fotos) {
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
    const res = await fetch(`/api/atletas/${athleteId}/partidas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        date: form.get("date"),
        opponent: form.get("opponent"),
        goals: Number(form.get("goals") ?? 0),
        assists: Number(form.get("assists") ?? 0),
        defensivePlays: Number(form.get("defensivePlays") ?? 0),
        position: form.get("position"),
        notes: form.get("notes"),
        photoUrls,
      }),
    });

    setCarregando(false);
    if (!res.ok) {
      const data = await res.json();
      setErro(data.error ?? "Não foi possível registrar a partida.");
      return;
    }

    (e.target as HTMLFormElement).reset();
    setFotos(null);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="card space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="date">Data</label>
          <input className="input" id="date" name="date" type="date" required />
        </div>
        <div>
          <label className="label" htmlFor="opponent">Adversário</label>
          <input className="input" id="opponent" name="opponent" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="position">Posição</label>
          <select className="input" id="position" name="position" required>
            <option value="GOLEIRO">Goleiro</option>
            <option value="FIXO">Fixo</option>
            <option value="ALA">Ala</option>
            <option value="PIVO">Pivô</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="photos">Fotos da partida</label>
          <input
            className="input"
            id="photos"
            name="photos"
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => setFotos(e.target.files)}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label" htmlFor="goals">Gols</label>
          <input className="input" id="goals" name="goals" type="number" min={0} defaultValue={0} />
        </div>
        <div>
          <label className="label" htmlFor="assists">Assistências</label>
          <input className="input" id="assists" name="assists" type="number" min={0} defaultValue={0} />
        </div>
        <div>
          <label className="label" htmlFor="defensivePlays">Jogadas defensivas</label>
          <input className="input" id="defensivePlays" name="defensivePlays" type="number" min={0} defaultValue={0} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="notes">Observações (opcional)</label>
        <textarea className="input" id="notes" name="notes" rows={2} />
      </div>

      {erro && <p className="text-sm text-red-600">{erro}</p>}

      <button className="btn-primary" type="submit" disabled={carregando}>
        {carregando ? "Salvando..." : "Registrar partida"}
      </button>
    </form>
  );
}
