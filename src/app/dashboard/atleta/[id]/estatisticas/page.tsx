import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularCategoria, traduzirPolo, traduzirPosicao } from "@/lib/category";
import { POSITION_STATS, POSITION_HIGHLIGHT_STATS, STAT_LABELS, type StatKey } from "@/lib/positionStats";
import { buildLineChart } from "@/lib/chart";
import { ClickableRow } from "@/components/ClickableRow";
import { EstatisticasFiltros } from "@/components/EstatisticasFiltros";
import { estaAguardandoAtivacao } from "@/lib/subscriptionGate";
import { BaixarPdfButton } from "@/components/BaixarPdfButton";

const CORES = ["#F97316", "#1E3A8A", "#22C55E", "#A855F7", "#0EA5E9", "#EAB308", "#EC4899"];

export default async function EstatisticasPage({
  params,
  searchParams,
}: {
  params: { id: string };
  searchParams: { temporada?: string; posicao?: string };
}) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atleta = userId
    ? await prisma.athlete.findFirst({
        where: { id: params.id, userId },
        include: { matches: { orderBy: { date: "asc" } } },
      })
    : null;

  if (!atleta) notFound();
  if (await estaAguardandoAtivacao(atleta.id)) redirect(`/dashboard/atleta/${atleta.id}`);

  const posicaoPrincipal = (atleta.position ?? "ALA") as keyof typeof POSITION_STATS;
  const campos = POSITION_STATS[posicaoPrincipal];

  const temporadas = [...new Set(atleta.matches.map((m) => String(new Date(m.date).getUTCFullYear())))].sort();
  const posicoesJogadas = [...new Set(atleta.matches.map((m) => m.position))];
  const opcoesPosicao = posicoesJogadas.map((p) => ({ value: p, label: traduzirPosicao(p) }));

  let jogos = atleta.matches;
  if (searchParams.temporada) {
    jogos = jogos.filter((m) => String(new Date(m.date).getUTCFullYear()) === searchParams.temporada);
  }
  if (searchParams.posicao) {
    jogos = jogos.filter((m) => m.position === searchParams.posicao);
  }
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

  // Gráfico principal — as 2 estatísticas de maior destaque da posição
  const headline = POSITION_HIGHLIGHT_STATS[posicaoPrincipal].slice(0, 2);
  const CHART_W = 640;
  const CHART_H = 240;
  const chartSeries = headline.map((key, i) => ({
    key,
    color: CORES[i],
    ...buildLineChart(valores(key), CHART_W, CHART_H),
  }));
  const eixoDatas = jogos.map((m) => new Date(m.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" }));

  // Destaques — melhor jogo (maior valor no 1º campo de destaque) e sequência atual
  const statPrincipal = headline[0];
  let melhorJogo: (typeof jogos)[number] | null = null;
  let melhorValor = -1;
  for (const m of jogos) {
    const v = (m as unknown as Record<string, number | null>)[statPrincipal] ?? 0;
    if (v > melhorValor) {
      melhorValor = v;
      melhorJogo = m;
    }
  }

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
        <div className="est-topbar-actions">
          <BaixarPdfButton />
          <Link href={`/dashboard/atleta/${atleta.id}`} className="est-back">
            ← Voltar ao painel
          </Link>
        </div>
      </div>

      <div className="est-print-header">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Perfil Camisa 10" />
        <div>
          <div className="est-print-header-title">Relatório de estatísticas — {atleta.name}</div>
          <div className="est-print-header-sub">
            Gerado em {new Date().toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric" })} · Camisa 10 F.C.
          </div>
        </div>
      </div>

      <div className="est-app">
        {atleta.matches.length === 0 ? (
          <div className="est-empty">Nenhuma partida registrada ainda — as estatísticas aparecem aqui assim que o primeiro jogo for lançado.</div>
        ) : (
          <>
            <EstatisticasFiltros temporadas={temporadas} posicoes={opcoesPosicao} />

            {jogos.length === 0 ? (
              <div className="est-empty">Nenhuma partida encontrada com esse filtro.</div>
            ) : (
              <>
                <div className="est-kpis">
                  <div className="est-kpi" style={{ "--accent": "#5B6478" } as React.CSSProperties}>
                    <span className="lbl">Jogos</span>
                    <div className="row">
                      <span className="val est-num">{jogos.length}</span>
                    </div>
                  </div>
                  <div className="est-kpi" style={{ "--accent": "#5B6478" } as React.CSSProperties}>
                    <span className="lbl">Minutagem média</span>
                    <div className="row">
                      <span className="val est-num">{mediaMinutos}</span>
                    </div>
                  </div>
                  {campos.map((key, i) => {
                    const total = soma(key);
                    const delta = deltaTexto(key);
                    const cor = CORES[i % CORES.length];
                    return (
                      <div className="est-kpi" key={key} style={{ "--accent": cor } as React.CSSProperties}>
                        <span className="lbl">{STAT_LABELS[key]}</span>
                        <div className="row">
                          <span className="val est-num">{total}</span>
                          <span className={`delta ${delta.tom}`}>
                            {delta.tom === "up" ? "▲ " : delta.tom === "down" ? "▼ " : ""}
                            {delta.texto}
                          </span>
                        </div>
                        <svg viewBox="0 0 100 32" preserveAspectRatio="none">
                          <polyline
                            points={buildLineChart(valores(key), 100, 32, 2)
                              .points.map((p) => `${p.x},${p.y}`)
                              .join(" ")}
                            fill="none"
                            stroke={cor}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    );
                  })}
                </div>

                <div className="est-main-grid">
                  <div className="est-chart-panel">
                    <div className="est-panel-head">
                      <h2>Evolução na temporada</h2>
                      <div className="est-legend">
                        {headline.map((key, i) => (
                          <span key={key}>
                            <span className="dot" style={{ background: CORES[i] }} />
                            {STAT_LABELS[key]}
                          </span>
                        ))}
                      </div>
                    </div>
                    {jogos.length > 1 ? (
                      <>
                        <svg viewBox={`0 0 ${CHART_W} ${CHART_H}`} className="est-chart-svg" preserveAspectRatio="none">
                          <defs>
                            {chartSeries.map((s) => (
                              <linearGradient key={s.key} id={`grad-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor={s.color} stopOpacity="0.22" />
                                <stop offset="100%" stopColor={s.color} stopOpacity="0" />
                              </linearGradient>
                            ))}
                          </defs>
                          {[0, 1, 2, 3].map((i) => (
                            <line key={i} x1="0" y1={(CHART_H / 3) * i} x2={CHART_W} y2={(CHART_H / 3) * i} stroke="#E4E8F0" strokeWidth="1" />
                          ))}
                          {chartSeries.map((s) => (
                            <g key={s.key}>
                              <path d={s.areaPath} fill={`url(#grad-${s.key})`} />
                              <path d={s.linePath} fill="none" stroke={s.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                              {s.points.map((p, i) => (
                                <circle key={i} cx={p.x} cy={p.y} r={i === s.points.length - 1 ? 5 : 3} fill={s.color} stroke="#fff" strokeWidth="1.5" />
                              ))}
                            </g>
                          ))}
                        </svg>
                        <div className="est-chart-axis">
                          {eixoDatas.map((d, i) => (
                            <span key={i}>{d}</span>
                          ))}
                        </div>
                      </>
                    ) : (
                      <div className="est-chart-empty">Registre mais jogos pra ver a evolução ao longo do tempo.</div>
                    )}
                  </div>

                  <div className="est-highlights-panel">
                    <h2>Destaques</h2>
                    {melhorJogo && (
                      <div className="est-highlight-card">
                        <span className="est-highlight-tag">Melhor jogo</span>
                        <div className="est-highlight-main">
                          {melhorValor} {STAT_LABELS[statPrincipal].toLowerCase()}
                        </div>
                        <div className="est-highlight-sub">
                          vs {melhorJogo.opponent} ·{" "}
                          {new Date(melhorJogo.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}
                        </div>
                      </div>
                    )}
                    <div className="est-highlight-card">
                      <span className="est-highlight-tag">Minutos em quadra</span>
                      <div className="est-highlight-main">{minutosTotais}</div>
                      <div className="est-highlight-sub">no total, média de {mediaMinutos} por jogo</div>
                    </div>
                    <div className="est-highlight-card">
                      <span className="est-highlight-tag">Período</span>
                      <div className="est-highlight-main" style={{ fontSize: 20 }}>
                        {new Date(jogos[0].date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })} —{" "}
                        {new Date(jogos[jogos.length - 1].date).toLocaleDateString("pt-BR", { day: "2-digit", month: "short", timeZone: "UTC" })}
                      </div>
                      <div className="est-highlight-sub">{jogos.length} partidas no período filtrado</div>
                    </div>
                  </div>
                </div>

                <div className="est-table-panel">
                  <div className="est-table-head">
                    <h2>Histórico completo de partidas</h2>
                    <span className="est-table-count">
                      {jogos.length} jogos · {traduzirPosicao(posicaoPrincipal)}
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
                              const destaque = key === statPrincipal && v > 0;
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
          </>
        )}
      </div>
    </main>
  );
}
