import { notFound } from "next/navigation";
import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { traduzirPosicao } from "@/lib/category";
import { POSITION_STATS, STAT_LABELS, type StatKey } from "@/lib/positionStats";

export default async function PartidaDetalhePage({ params }: { params: { id: string; matchId: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atleta = userId ? await prisma.athlete.findFirst({ where: { id: params.id, userId } }) : null;
  if (!atleta) notFound();

  const jogo = await prisma.match.findFirst({
    where: { id: params.matchId, athleteId: atleta.id },
    include: { photos: true },
  });
  if (!jogo) notFound();

  const campos = POSITION_STATS[jogo.position];
  const data = new Date(jogo.date).toLocaleDateString("pt-BR", { day: "2-digit", month: "long", year: "numeric", timeZone: "UTC" });

  return (
    <main style={{ minHeight: "100vh", background: "#F5F7FB", color: "#10162B" }}>
      <div className="pd-topbar">
        <Link href={`/dashboard/atleta/${atleta.id}/estatisticas`} className="pd-back">
          ← Voltar pra planilha
        </Link>
      </div>

      <div className="pd-app">
        <div className="pd-hero">
          <div className="pd-vs">vs {jogo.opponent}</div>
          <div className="pd-meta">
            <span>{data}</span>
            <span className="pd-pill">{traduzirPosicao(jogo.position)}</span>
            {jogo.minutes ? <span>{jogo.minutes} minutos em quadra</span> : null}
          </div>
          {jogo.notes && <div className="pd-notes">&quot;{jogo.notes}&quot;</div>}
        </div>

        <div className="pd-section-title">Estatísticas da partida</div>
        <div className="pd-grid">
          {campos.map((key) => (
            <div className="pd-stat" key={key}>
              <div className="val pd-num">{(jogo as unknown as Record<string, number | null>)[key as StatKey] ?? 0}</div>
              <div className="lbl">{STAT_LABELS[key]}</div>
            </div>
          ))}
        </div>

        {jogo.photos.length > 0 && (
          <>
            <div className="pd-section-title">Fotos do jogo</div>
            <div className="pd-photos">
              {jogo.photos.map((p) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={p.id} src={p.url} alt={`Foto de vs ${jogo.opponent}`} />
              ))}
            </div>
          </>
        )}
      </div>
    </main>
  );
}
