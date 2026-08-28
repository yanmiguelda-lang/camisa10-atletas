import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularCategoria, traduzirPolo, traduzirPosicao } from "@/lib/category";
import { POSITION_STATS, STAT_LABELS, type StatKey } from "@/lib/positionStats";
import { sparklinePoints } from "@/lib/sparkline";
import { ClickableRow } from "@/components/ClickableRow";

export default async function EstatisticasPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atleta = userId
    ? await prisma.athlete.findFirst({
        where: { id: params.id, userId },
        include: { matches: { orderBy: { date: "asc" } } },
      })
    : null;

  if (!atleta) notFound();

  const posicao = (atleta.position ?? "ALA") as keyof typeof POSITION_STATS;
  const campos = POSITION_STATS[posicao];
  const jogos = atleta.matches; // ordem cronológica (mais antigo → mais recente)
  const jogosRecentesPrimeiro = [...jogos].reverse();

  function valores(key: StatKey): number[] {
    return jogos.map((m) => (m as unknown as Record<string, number | null>)[key] ?? 0);
  }
  function soma(key: StatKey): number {
    return valores(key).reduce((s, v) => s + v, 0);
  }
  function mediaUltimos(key: StatKey, n: number): number {
    const vs = valores(key).slice(-n);
    return vs.length ? vs.reduce((s, v) => s + v, 0) / vs.length : 0;
  }
  function deltaTexto(key: StatKey): { texto: string; tom: "up" | "down" | "flat" } {
    if (jogos.length < 2) return { texto: "—", tom: "flat" };
    const metadeSize = Math.max(1, Math.floor(jogos.length / 2));
    const recente = mediaUltimos(key, metadeSize);
    const anterior = valores(key).slice(0, jogos.length - metadeSize);
    const mediaAnterior = anterior.length ? anterior.reduce((s, v) => s + v, 0) / anterior.length : recente;
    const diff = recente - mediaAnterior;
    if (Math.abs(diff) < 0.05) return { texto: "estável", tom: "flat" };
    return { texto: `${diff > 0 ? "+" : ""}${diff.toFixed(1)}/jogo`, tom: diff > 0 ? "up" : "down" };
  }

  const minutosTotais = jogos.reduce((s, m) => s + (m.minutes ?? 0), 0);
  const mediaMinutos = jogos.length ? Math.round(minutosTotais / jogos.length) : 0;

  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FB", color: "#10162B" }}>
      <div className="est-topbar">
        <div className="est-topbar-left">
          <div className="est-avatar">
            {atleta.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={atleta.photoUrl} alt={atleta.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              atleta.name.slice(0, 2).toUpperCase()
            )}
          </div>
          <div>
            <div className="est-h1">{atleta.name} · Estatísticas</div>
            <div className="est-sub">
              {calcularCategoria(atleta.birthDate)} · {traduzirPosicao(atleta.position ?? "ALA")}
              {atleta.jerseyNumber ? ` · Nº ${atleta.jerseyNumber}` : ""} · {traduzirPolo(atleta.polo)}
            </div>
          </div>
        </div>
        <Link href={`/dashboard/atleta/${atleta.id}`} className="est-back">
          ← Voltar ao painel
        </Link>
      </div>

      <div className="est-app">
        {jogos.length === 0 ? (
          <div className="est-empty">Nenhuma partida registrada ainda — as estatísticas aparecem aqui assim que o primeiro jogo for lançado.</div>
        ) : (
          <>
            <div className="est-kpis">
              <div className="est-kpi">
                <span className="lbl">Jogos</span>
                <div className="row">
                  <span className="val est-num">{jogos.length}</span>
                </div>
              </div>
              <div className="est-kpi">
                <span className="lbl">Minutagem média</span>
                <div className="row">
                  <span className="val est-num">{mediaMinutos}</span>
                </div>
              </div>
              {campos.map((key) => {
                const total = soma(key);
                const delta = deltaTexto(key);
                return (
                  <div className="est-kpi" key={key}>
                    <span className="lbl">{STAT_LABELS[key]}</span>
                    <div className="row">
                      <span className="val est-num">{total}</span>
                      <span className={`delta ${delta.tom}`}>{delta.texto}</span>
                    </div>
                    <svg viewBox="0 0 100 32" preserveAspectRatio="none">
                      <polyline
                        points={sparklinePoints(valores(key))}
                        fill="none"
                        stroke="#F97316"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                );
              })}
            </div>

            <div className="est-table-panel">
              <div className="est-table-head">
                <h2>Histórico completo de partidas</h2>
                <span className="est-table-count">
                  {jogos.length} jogos · {traduzirPosicao(posicao)}
                </span>
              </div>
              <div className="est-table-scroll">
                <table>
                  <thead>
                    <tr>
                      <th className="left">Data</th>
                      <th className="left">Adversário</th>
                      <th>Min.</th>
                      {campos.map((key) => (
                        <th key={key}>{STAT_LABELS[key]}</th>
                      ))}
                      <th className="left">Observações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jogosRecentesPrimeiro.map((m) => (
                      <ClickableRow key={m.id} href={`/dashboard/atleta/${atleta.id}/estatisticas/${m.id}`} className="est-row">
                        <td className="left est-num">{new Date(m.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", timeZone: "UTC" })}</td>
                        <td className="left opp-cell">{m.opponent}</td>
                        <td className="est-num">{m.minutes ?? "—"}</td>
                        {campos.map((key) => {
                          const v = (m as unknown as Record<string, number | null>)[key] ?? 0;
                          const destaque = (key === "goals" || key === "saves") && v > 0;
                          return (
                            <td key={key} className={`est-num ${destaque ? "stat-strong" : ""}`}>
                              {v}
                            </td>
                          );
                        })}
                        <td className="left notes-cell">{m.notes ?? "—"}</td>
                      </ClickableRow>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
