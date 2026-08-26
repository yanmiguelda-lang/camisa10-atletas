import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { calcularCategoria, calcularTemporada, traduzirPolo, traduzirPosicao } from "@/lib/category";

export default async function PerfilPublicoPage({ params }: { params: { slug: string } }) {
  const atleta = await prisma.athlete.findUnique({
    where: { publicSlug: params.slug },
    include: {
      matches: { orderBy: { date: "desc" }, include: { photos: true } },
      subscriptions: { where: { status: "ACTIVE" }, take: 1 },
    },
  });

  if (!atleta) notFound();

  const planoAtivo = atleta.subscriptions[0]?.plan;
  const temFotos = planoAtivo === "CRAQUE";
  const isGK = atleta.position === "GOLEIRO";

  const totalGols = atleta.matches.reduce((s, m) => s + m.goals, 0);
  const totalAssist = atleta.matches.reduce((s, m) => s + m.assists, 0);
  const totalDefesas = atleta.matches.reduce((s, m) => s + m.defensivePlays, 0);

  const albunsPorTemporada = new Map<string, string[]>();
  if (temFotos) {
    for (const match of atleta.matches) {
      const temporada = calcularTemporada(match.date);
      const urls = match.photos.map((p) => p.url);
      if (urls.length === 0) continue;
      albunsPorTemporada.set(temporada, [...(albunsPorTemporada.get(temporada) ?? []), ...urls]);
    }
  }

  const statCards = isGK
    ? [{ label: "Jogos", value: atleta.matches.length, color: "#60a5fa" }, { label: "Defesas", value: totalDefesas, color: "#F97316" }]
    : [
        { label: "Jogos", value: atleta.matches.length, color: "#60a5fa" },
        { label: "Gols", value: totalGols, color: "#F97316" },
        { label: "Assistências", value: totalAssist, color: "#22c55e" },
      ];

  return (
    <main style={{ minHeight: "100vh", background: "#060E20", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0 }}>
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div style={{ position: "relative", zIndex: 1, maxWidth: 640, margin: "0 auto", padding: "48px 20px 60px" }}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Perfil Camisa 10" style={{ height: 40, margin: "0 auto" }} />
        </div>

        {/* Hero card estilo "card de jogo" */}
        <div
          style={{
            borderRadius: 24,
            overflow: "hidden",
            marginBottom: 28,
            background: "linear-gradient(135deg, #0C1B36 0%, #0f2347 50%, #0C1B36 100%)",
            border: "1.5px solid rgba(249,115,22,0.22)",
            boxShadow: "0 12px 56px rgba(0,0,0,0.50), 0 0 96px rgba(249,115,22,0.08)",
          }}
        >
          <div style={{ height: 4, background: "linear-gradient(90deg, transparent, #F97316 20%, #1E3A8A 50%, transparent 80%)" }} />
          <div style={{ padding: "32px 28px 28px", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <div
              style={{
                width: 96,
                height: 96,
                borderRadius: "50%",
                flexShrink: 0,
                background: atleta.photoUrl ? "transparent" : "linear-gradient(135deg,#1E3A8A,#F97316)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                border: "4px solid rgba(249,115,22,0.40)",
                boxShadow: "0 0 32px rgba(249,115,22,0.30)",
              }}
            >
              {atleta.photoUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={atleta.photoUrl} alt={atleta.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <span style={{ fontSize: 40 }}>⚽</span>
              )}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 11, fontWeight: 800, color: "#F97316", letterSpacing: 2, textTransform: "uppercase", marginBottom: 4 }}>Camisa 10 F.C.</p>
              <div className="text-gradient" style={{ fontWeight: 900, fontSize: 26, letterSpacing: -0.5 }}>
                {atleta.name}
              </div>
              <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={{ background: "rgba(30,58,138,0.30)", border: "1px solid rgba(30,58,138,0.60)", borderRadius: 99, padding: "5px 12px", fontSize: 11, color: "#93c5fd", fontWeight: 700 }}>
                  {calcularCategoria(atleta.birthDate)}
                </span>
                {atleta.position && (
                  <span style={{ background: "rgba(249,115,22,0.14)", border: "1px solid rgba(249,115,22,0.35)", borderRadius: 99, padding: "5px 12px", fontSize: 11, color: "#fb923c", fontWeight: 700 }}>
                    {traduzirPosicao(atleta.position)}
                  </span>
                )}
                {atleta.jerseyNumber && (
                  <span style={{ background: "rgba(255,255,255,0.08)", border: "1px solid rgba(255,255,255,0.12)", borderRadius: 99, padding: "5px 12px", fontSize: 11, color: "#cbd5e1", fontWeight: 700 }}>
                    Nº {atleta.jerseyNumber}
                  </span>
                )}
                <span style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.10)", borderRadius: 99, padding: "5px 12px", fontSize: 11, color: "#cbd5e1", fontWeight: 700 }}>
                  {traduzirPolo(atleta.polo)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: `repeat(${statCards.length}, 1fr)`, gap: 14, marginBottom: 32 }}>
          {statCards.map((s) => (
            <div key={s.label} style={{ borderRadius: 18, padding: "22px 14px", textAlign: "center", background: "rgba(12,27,54,0.75)", border: `1.5px solid ${s.color}33` }}>
              <div style={{ fontSize: 38, fontWeight: 900, lineHeight: 1, color: s.color, textShadow: `0 0 20px ${s.color}66`, letterSpacing: -1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#cbd5e1", marginTop: 8, textTransform: "uppercase", letterSpacing: 1, fontWeight: 700 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {temFotos && albunsPorTemporada.size > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 className="text-gradient" style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Álbuns de memória</h2>
            {[...albunsPorTemporada.entries()].map(([temporada, urls]) => (
              <div key={temporada} style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 12, fontWeight: 700, color: "#94a3b8", marginBottom: 8 }}>Temporada {temporada}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {urls.map((url) => (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img key={url} src={url} alt="" style={{ height: 96, width: 96, borderRadius: 14, objectFit: "cover", border: "1.5px solid rgba(249,115,22,0.20)" }} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {!temFotos && atleta.matches.some((m) => m.photos.length > 0) && (
          <div style={{ borderRadius: 16, border: "1.5px dashed rgba(249,115,22,0.25)", background: "rgba(249,115,22,0.05)", padding: 18, textAlign: "center", marginBottom: 32, color: "#cbd5e1", fontSize: 13 }}>
            📷 Esse atleta tem fotos registradas — elas aparecem aqui quando o plano <strong style={{ color: "#F97316" }}>Craque</strong> estiver ativo.
          </div>
        )}

        <h2 className="text-gradient" style={{ fontSize: 16, fontWeight: 800, marginBottom: 14 }}>Últimas partidas</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {atleta.matches.map((m) => (
            <div key={m.id} style={{ borderRadius: 16, padding: "16px 20px", background: "rgba(12,27,54,0.65)", border: "1px solid rgba(255,255,255,0.06)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 6 }}>
                <p style={{ fontWeight: 700, color: "#fff", fontSize: 14 }}>vs {m.opponent} — {new Date(m.date).toLocaleDateString("pt-BR")}</p>
                <span style={{ fontSize: 12, color: "#94a3b8" }}>{traduzirPosicao(m.position)}</span>
              </div>
              <p style={{ marginTop: 4, fontSize: 13, color: "#94a3b8" }}>
                ⚽ {m.goals} gols · 🎯 {m.assists} assistências · 🛡️ {m.defensivePlays} jogadas defensivas
              </p>
            </div>
          ))}
          {atleta.matches.length === 0 && <p style={{ color: "#64748b", fontSize: 14 }}>Nenhuma partida registrada ainda.</p>}
        </div>

        <p style={{ marginTop: 40, textAlign: "center", fontSize: 11, color: "#475569" }}>
          Perfil gerado pela plataforma de atletas do Camisa 10 FC 🧡💙
        </p>
      </div>
    </main>
  );
}
