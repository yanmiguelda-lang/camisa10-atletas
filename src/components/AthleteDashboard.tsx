"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Button from "@/components/Button";
import { calcularCategoria, calcularTemporada, traduzirPolo, traduzirPosicao } from "@/lib/category";
import { NovaPartidaForm } from "@/components/NovaPartidaForm";
import { POSITION_HIGHLIGHT_STATS, POSITION_STATS, STAT_LABELS, type StatKey } from "@/lib/positionStats";
import { PhotoGallery, type AlbumTemporada } from "@/components/PhotoGallery";
import { EditarFotoAtleta } from "@/components/EditarFotoAtleta";

type MatchPhoto = { id: string; url: string };
type Match = {
  id: string;
  date: string;
  opponent: string;
  goals: number;
  assists: number;
  defensivePlays: number;
  position: "GOLEIRO" | "FIXO" | "ALA" | "PIVO";
  minutes: number | null;
  notes: string | null;
  photos: MatchPhoto[];
} & Partial<Record<StatKey, number | null>>;
type Athlete = {
  id: string;
  name: string;
  birthDate: string;
  polo: string;
  position: string | null;
  jerseyNumber: number | null;
  photoUrl: string | null;
  publicSlug: string;
  matches: Match[];
  subscriptions: { plan: "TORCIDA" | "CRAQUE" }[];
};

export function AthleteDashboard({ athlete }: { athlete: Athlete }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);

  const planoAtivo = athlete.subscriptions[0]?.plan;
  const posicaoPrincipal = (athlete.position ?? "ALA") as keyof typeof POSITION_HIGHLIGHT_STATS;
  const destaques = POSITION_HIGHLIGHT_STATS[posicaoPrincipal];

  function somaEstat(key: StatKey) {
    return athlete.matches.reduce((s, m) => s + (m[key] ?? 0), 0);
  }

  const profileUrl = `/atleta/${athlete.publicSlug}`;

  const albuns: AlbumTemporada[] = (() => {
    const mapa = new Map<string, AlbumTemporada["fotos"]>();
    for (const m of athlete.matches) {
      if (m.photos.length === 0) continue;
      const temporada = calcularTemporada(new Date(m.date));
      const dataFmt = new Date(m.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" });
      const fotos = m.photos.map((p) => ({ id: p.id, url: p.url, adversario: m.opponent, data: dataFmt }));
      mapa.set(temporada, [...(mapa.get(temporada) ?? []), ...fotos]);
    }
    return [...mapa.entries()].sort((a, b) => b[0].localeCompare(a[0])).map(([temporada, fotos]) => ({ temporada, fotos }));
  })();

  const statCards = [
    { label: "Jogos", value: athlete.matches.length, accent: false },
    ...destaques.map((key, i) => ({ label: STAT_LABELS[key], value: somaEstat(key), accent: i === 0 })),
  ];

  return (
    <div style={{ maxWidth: 740, margin: "0 auto", padding: "36px 20px 60px" }}>
      <Link href="/dashboard" style={{ fontSize: 13, color: "#94a3b8", textDecoration: "none" }}>
        ← Meus atletas
      </Link>

      {/* Hero card */}
      <div
        style={{
          borderRadius: 24,
          margin: "16px 0 28px",
          overflow: "hidden",
          background: "linear-gradient(135deg, #0C1B36 0%, #0f2347 50%, #0C1B36 100%)",
          border: "1.5px solid rgba(249,115,22,0.22)",
          boxShadow: "0 12px 56px rgba(0,0,0,0.50), 0 0 96px rgba(249,115,22,0.08)",
        }}
      >
        <div style={{ height: 4, background: "linear-gradient(90deg, transparent, #F97316 20%, #1E3A8A 50%, transparent 80%)" }} />
        <div style={{ padding: "32px 28px 28px", display: "flex", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <EditarFotoAtleta athleteId={athlete.id} photoUrl={athlete.photoUrl} name={athlete.name} />
          <div style={{ flex: "1 1 220px", minWidth: 220 }}>
            <div className="text-gradient" style={{ fontWeight: 900, fontSize: 26, letterSpacing: -0.5, textWrap: "balance" }}>
              {athlete.name}
            </div>
            <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
              <span style={{ background: "linear-gradient(135deg, rgba(30,58,138,0.40), rgba(30,58,138,0.20))", border: "1px solid rgba(30,58,138,0.60)", borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#93c5fd", fontWeight: 700 }}>
                {calcularCategoria(new Date(athlete.birthDate))}
              </span>
              {athlete.position && (
                <span style={{ background: "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(249,115,22,0.06))", border: "1px solid rgba(249,115,22,0.35)", borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#fb923c", fontWeight: 700 }}>
                  {traduzirPosicao(athlete.position)}
                </span>
              )}
              {athlete.jerseyNumber && (
                <span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#cbd5e1", fontWeight: 700 }}>
                  Nº {athlete.jerseyNumber}
                </span>
              )}
              <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 99, padding: "6px 14px", fontSize: 12, color: "#cbd5e1", fontWeight: 700 }}>
                {traduzirPolo(athlete.polo)}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
            <Button href={profileUrl} target="_blank" variant="primary" size="sm">
              Ver perfil →
            </Button>
            <Button href={`/dashboard/atleta/${athlete.id}/estatisticas`} variant="secondary" size="sm">
              📊 Estatísticas
            </Button>
            <Button
              onClick={() => navigator.clipboard.writeText(window.location.origin + profileUrl)}
              variant="secondary"
              size="sm"
            >
              Copiar link
            </Button>
          </div>
        </div>
      </div>

      {!planoAtivo && (
        <Link
          href={`/assinatura/${athlete.id}`}
          style={{
            display: "block",
            textAlign: "center",
            marginBottom: 28,
            padding: "14px 20px",
            borderRadius: 14,
            background: "linear-gradient(135deg, rgba(249,115,22,0.16), rgba(249,115,22,0.06))",
            border: "1px solid rgba(249,115,22,0.30)",
            color: "#fb923c",
            fontWeight: 700,
            fontSize: 14,
            textDecoration: "none",
          }}
        >
          ⏳ Sem plano ativo — assinar agora →
        </Link>
      )}

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${statCards.length}, 1fr)`, gap: 16, marginBottom: 32 }}>
        {statCards.map((s) => (
          <div
            key={s.label}
            style={{
              borderRadius: 20,
              padding: "28px 18px",
              textAlign: "center",
              background: s.accent ? "linear-gradient(135deg, rgba(249,115,22,0.20) 0%, rgba(249,115,22,0.08) 100%)" : "linear-gradient(135deg, rgba(30,58,138,0.30) 0%, rgba(12,27,54,0.85) 100%)",
              border: s.accent ? "1.5px solid rgba(249,115,22,0.28)" : "1.5px solid rgba(30,58,138,0.40)",
              boxShadow: s.accent ? "0 8px 32px rgba(249,115,22,0.15)" : "0 8px 32px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ fontSize: 48, fontWeight: 900, lineHeight: 1, color: s.accent ? "#F97316" : "#60a5fa", textShadow: s.accent ? "0 0 24px rgba(249,115,22,0.60)" : "0 0 24px rgba(96,165,250,0.45)", letterSpacing: -1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 12, color: s.accent ? "#fbbf24" : "#cbd5e1", marginTop: 8, textTransform: "uppercase", letterSpacing: 1.2, fontWeight: 700 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Álbum de fotos */}
      {albuns.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 className="text-gradient" style={{ fontSize: 18, fontWeight: 800, marginBottom: 16, letterSpacing: -0.3 }}>
            📸 Álbum de fotos
          </h2>
          <PhotoGallery albuns={albuns} />
        </div>
      )}

      {/* Header histórico */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h2 className="text-gradient" style={{ fontSize: 20, fontWeight: 800, letterSpacing: -0.4 }}>
          Histórico de partidas
        </h2>
        <Button onClick={() => setShowForm(!showForm)} variant="primary" size="sm">
          {showForm ? "Cancelar" : "+ Adicionar jogo"}
        </Button>
      </div>

      {showForm && (
        <div style={{ borderRadius: 22, padding: 32, marginBottom: 24, background: "linear-gradient(135deg, #0f2347 0%, #0C1B36 100%)", border: "1.5px solid rgba(249,115,22,0.22)", boxShadow: "0 12px 48px rgba(0,0,0,0.40)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 800, marginBottom: 24, color: "#F97316", letterSpacing: -0.3 }}>Registrar jogo</h3>
          <NovaPartidaForm
            athleteId={athlete.id}
            defaultPosition={athlete.position ?? undefined}
            craquePlan={planoAtivo === "CRAQUE"}
            onSaved={() => {
              setShowForm(false);
              router.refresh();
            }}
          />
        </div>
      )}

      {/* Lista de jogos */}
      {athlete.matches.length === 0 ? (
        <div style={{ borderRadius: 22, padding: "56px 28px", textAlign: "center", background: "linear-gradient(135deg, rgba(12,27,54,0.80), rgba(6,14,32,0.60))", border: "1.5px solid rgba(255,255,255,0.08)" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>⚽</div>
          <div className="text-gradient" style={{ fontWeight: 800, fontSize: 18, marginBottom: 8 }}>
            Nenhum jogo registrado ainda
          </div>
          <div style={{ fontSize: 14, color: "#94a3b8" }}>Adicione a primeira partida de {athlete.name}</div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {athlete.matches.map((m, i) => (
            <div
              key={m.id}
              style={{
                borderRadius: 18,
                overflow: "hidden",
                background: i === 0 ? "linear-gradient(135deg, rgba(249,115,22,0.12) 0%, rgba(12,27,54,0.85) 100%)" : "linear-gradient(135deg, rgba(12,27,54,0.75), rgba(6,14,32,0.65))",
                border: i === 0 ? "1.5px solid rgba(249,115,22,0.25)" : "1.5px solid rgba(255,255,255,0.08)",
                boxShadow: i === 0 ? "0 8px 32px rgba(249,115,22,0.15)" : "0 4px 16px rgba(0,0,0,0.20)",
              }}
            >
              {m.photos[0] && (
                <div style={{ height: 180, overflow: "hidden", position: "relative" }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={m.photos[0].url} alt="Foto do jogo" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(transparent 30%, rgba(6,14,32,0.85))" }} />
                </div>
              )}
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: -0.2, color: "#fff" }}>
                    vs {m.opponent}
                    {i === 0 && (
                      <span style={{ marginLeft: 10, fontSize: 11, background: "linear-gradient(135deg, rgba(249,115,22,0.25), rgba(249,115,22,0.15))", color: "#fbbf24", padding: "3px 10px", borderRadius: 99, fontWeight: 800, border: "1px solid rgba(249,115,22,0.30)" }}>
                        ★ ÚLTIMO
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 13, color: "#cbd5e1", marginTop: 4, fontWeight: 600 }}>
                    {new Date(m.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", year: "numeric" })} · {traduzirPosicao(m.position)}
                    {m.minutes ? ` · ${m.minutes}min` : ""}
                  </div>
                  {m.notes && <div style={{ fontSize: 13, color: "#94a3b8", marginTop: 6, fontStyle: "italic" }}>{m.notes}</div>}
                </div>
                <div style={{ display: "flex", gap: 10, flexShrink: 0, flexWrap: "wrap", maxWidth: 420 }}>
                  {POSITION_STATS[m.position].map((key, idx) => (
                    <StatPill
                      key={key}
                      value={m[key] ?? 0}
                      label={STAT_LABELS[key]}
                      color={["#F97316", "#60a5fa", "#22c55e", "#a78bfa", "#fb923c", "#38bdf8", "#4ade80"][idx % 7]}
                    />
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatPill({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{ textAlign: "center", padding: "12px 14px", borderRadius: 12, background: `${color}14`, border: `1px solid ${color}26` }}>
      <div style={{ fontSize: 22, fontWeight: 900, color, letterSpacing: -0.5 }}>{value}</div>
      <div style={{ fontSize: 10, color: "#cbd5e1", marginTop: 2, fontWeight: 700, textTransform: "uppercase" }}>{label}</div>
    </div>
  );
}
