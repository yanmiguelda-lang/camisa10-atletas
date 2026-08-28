"use client";

import { useEffect, useMemo, useState } from "react";

export type FotoGaleria = { id: string; url: string; adversario: string; data: string };
export type AlbumTemporada = { temporada: string; fotos: FotoGaleria[] };

export function PhotoGallery({ albuns }: { albuns: AlbumTemporada[] }) {
  const todasFotos = useMemo(() => albuns.flatMap((a) => a.fotos), [albuns]);
  const [indiceAberto, setIndiceAberto] = useState<number | null>(null);

  const aberta = indiceAberto !== null ? todasFotos[indiceAberto] : null;

  useEffect(() => {
    if (indiceAberto === null) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setIndiceAberto(null);
      if (e.key === "ArrowRight") setIndiceAberto((i) => (i === null ? i : Math.min(i + 1, todasFotos.length - 1)));
      if (e.key === "ArrowLeft") setIndiceAberto((i) => (i === null ? i : Math.max(i - 1, 0)));
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [indiceAberto, todasFotos.length]);

  if (todasFotos.length === 0) return null;

  return (
    <div>
      {aberta && indiceAberto !== null && (
        <div
          onClick={() => setIndiceAberto(null)}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(0,0,0,0.92)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            cursor: "zoom-out",
            backdropFilter: "blur(8px)",
            padding: "24px 0",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, maxWidth: "94vw" }}
          >
            {indiceAberto > 0 && (
              <button
                onClick={() => setIndiceAberto(indiceAberto - 1)}
                aria-label="Foto anterior"
                style={setaEstilo}
              >
                ‹
              </button>
            )}

            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={aberta.url}
              alt={`Foto de vs ${aberta.adversario}`}
              style={{ maxWidth: "min(78vw, 720px)", maxHeight: "72vh", borderRadius: 16, objectFit: "contain", boxShadow: "0 24px 80px rgba(0,0,0,0.60)" }}
            />

            {indiceAberto < todasFotos.length - 1 && (
              <button
                onClick={() => setIndiceAberto(indiceAberto + 1)}
                aria-label="Próxima foto"
                style={setaEstilo}
              >
                ›
              </button>
            )}
          </div>

          <div
            onClick={(e) => e.stopPropagation()}
            style={{ marginTop: 18, textAlign: "center", color: "#fff" }}
          >
            <div style={{ fontWeight: 700, fontSize: 15 }}>vs {aberta.adversario}</div>
            <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 2 }}>
              {aberta.data} · {indiceAberto + 1} / {todasFotos.length}
            </div>
          </div>

          <button
            onClick={() => setIndiceAberto(null)}
            aria-label="Fechar"
            style={{
              position: "absolute",
              top: 24,
              right: 28,
              background: "rgba(255,255,255,0.10)",
              border: "none",
              color: "white",
              fontSize: 22,
              width: 44,
              height: 44,
              borderRadius: "50%",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {albuns.map((album) => (
        <div key={album.temporada} style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginBottom: 14 }}>
            <span style={{ fontSize: 13, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1 }}>
              Temporada {album.temporada}
            </span>
            <span style={{ fontSize: 12, color: "#64748b" }}>
              · {album.fotos.length} {album.fotos.length === 1 ? "foto" : "fotos"}
            </span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 10 }}>
            {album.fotos.map((foto) => {
              const indiceGlobal = todasFotos.findIndex((f) => f.id === foto.id);
              return (
                <button
                  key={foto.id}
                  onClick={() => setIndiceAberto(indiceGlobal)}
                  style={{
                    position: "relative",
                    aspectRatio: "1",
                    borderRadius: 14,
                    overflow: "hidden",
                    cursor: "zoom-in",
                    border: "1.5px solid rgba(249,115,22,0.20)",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.20)",
                    padding: 0,
                    background: "none",
                    transition: "transform 0.15s ease",
                  }}
                  className="photo-thumb"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={foto.url} alt={`vs ${foto.adversario}`} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div
                    style={{
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      right: 0,
                      background: "linear-gradient(transparent, rgba(0,0,0,0.80))",
                      padding: "16px 8px 6px",
                      fontSize: 10.5,
                      color: "rgba(255,255,255,0.90)",
                      fontWeight: 700,
                      textAlign: "left",
                    }}
                  >
                    vs {foto.adversario}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

const setaEstilo: React.CSSProperties = {
  background: "rgba(255,255,255,0.10)",
  border: "none",
  color: "white",
  fontSize: 32,
  width: 48,
  height: 48,
  borderRadius: "50%",
  cursor: "pointer",
  flexShrink: 0,
  lineHeight: 1,
};
