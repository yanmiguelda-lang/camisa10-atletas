"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";

export function EditarFotoAtleta({ athleteId, photoUrl, name }: { athleteId: string; photoUrl: string | null; name: string }) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setErro(null);
    setPreview(URL.createObjectURL(file));
    setEnviando(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const upload = await fetch("/api/upload", { method: "POST", body: fd });
      if (!upload.ok) {
        const data = await upload.json().catch(() => null);
        setErro(data?.error ?? "Não foi possível subir a imagem.");
        return;
      }
      const { url } = await upload.json();
      const patch = await fetch(`/api/atletas/${athleteId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ photoUrl: url }),
      });
      if (!patch.ok) {
        const data = await patch.json().catch(() => null);
        setErro(data?.error ?? "Não foi possível salvar a nova foto.");
        return;
      }
      router.refresh();
    } catch {
      setErro("Falha de conexão — tente de novo.");
    } finally {
      setEnviando(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  const foto = preview ?? photoUrl;

  return (
    <div style={{ position: "relative", flexShrink: 0 }}>
      <div
        style={{
          width: 88,
          height: 88,
          borderRadius: "50%",
          flexShrink: 0,
          background: foto ? "transparent" : "linear-gradient(135deg,#1E3A8A,#F97316)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          border: "4px solid rgba(249,115,22,0.40)",
          boxShadow: "0 0 32px rgba(249,115,22,0.30), inset 0 0 16px rgba(255,255,255,0.10)",
          opacity: enviando ? 0.5 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {foto ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={foto} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : (
          <span style={{ fontSize: 36, fontWeight: 900 }}>⚽</span>
        )}
      </div>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={enviando}
        title="Trocar foto"
        style={{
          position: "absolute",
          bottom: -2,
          right: -2,
          width: 30,
          height: 30,
          borderRadius: "50%",
          background: "#F97316",
          border: "3px solid #0C1B36",
          color: "#fff",
          fontSize: 13,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: enviando ? "wait" : "pointer",
        }}
      >
        📷
      </button>
      <input ref={inputRef} type="file" accept="image/*" onChange={handleChange} style={{ display: "none" }} />

      {erro && (
        <div style={{ position: "absolute", top: "100%", left: 0, marginTop: 6, width: 160, fontSize: 11, color: "#f87171", fontWeight: 600 }}>
          {erro}
        </div>
      )}
    </div>
  );
}
