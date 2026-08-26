"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NovoAtletaPage() {
  const router = useRouter();
  const [erro, setErro] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(false);
  const [foto, setFoto] = useState<File | null>(null);

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
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="mb-6 text-2xl font-bold">Cadastrar atleta</h1>

      <form onSubmit={handleSubmit} className="card space-y-4">
        <div>
          <label className="label" htmlFor="name">Nome do atleta</label>
          <input className="input" id="name" name="name" required />
        </div>
        <div>
          <label className="label" htmlFor="birthDate">Data de nascimento</label>
          <input className="input" id="birthDate" name="birthDate" type="date" required />
        </div>
        <div>
          <label className="label" htmlFor="polo">Polo</label>
          <select className="input" id="polo" name="polo" required>
            <option value="SANTANA">Santana de Parnaíba</option>
            <option value="BARUERI">Barueri</option>
            <option value="OSASCO">Osasco</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="photo">Foto (opcional)</label>
          <input
            className="input"
            id="photo"
            name="photo"
            type="file"
            accept="image/*"
            onChange={(e) => setFoto(e.target.files?.[0] ?? null)}
          />
        </div>

        {erro && <p className="text-sm text-red-600">{erro}</p>}

        <button className="btn-primary w-full" type="submit" disabled={carregando}>
          {carregando ? "Salvando..." : "Cadastrar"}
        </button>
      </form>
    </main>
  );
}
