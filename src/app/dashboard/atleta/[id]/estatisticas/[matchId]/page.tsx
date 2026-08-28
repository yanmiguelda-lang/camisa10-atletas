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
      <style>{`
        .pd-num { font-variant-numeric: tabular-nums; }
        .pd-topbar { padding: 24px 32px; border-bottom: 1px solid #E4E8F0; background: #fff; }
        .pd-back { font-size: 13px; color: #5B6478; text-decoration: none; }
        .pd-app { max-width: 900px; margin: 0 auto; padding: 32px 32px 64px; }
        .pd-hero { background: #fff; border: 1px solid #E4E8F0; border-radius: 16px; padding: 28px 28px; margin-bottom: 24px; }
        .pd-vs { font-family: 'Outfit', sans-serif; font-weight: 800; font-size: 26px; letter-spacing: -0.02em; margin-bottom: 6px; }
        .pd-meta { font-size: 14px; color: #5B6478; display: flex; gap: 10px; flex-wrap: wrap; align-items: center; }
        .pd-pill { font-size: 11.5px; font-weight: 700; padding: 4px 10px; border-radius: 6px; background: #EAEFFB; color: #1E3A8A; }
        .pd-notes { margin-top: 16px; padding: 14px 16px; background: #FFF1E6; border-left: 3px solid #F97316; border-radius: 4px; font-size: 14px; font-style: italic; color: #10162B; }
        .pd-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 14px; margin-bottom: 24px; }
        .pd-stat { background: #fff; border: 1px solid #E4E8F0; border-radius: 14px; padding: 22px 18px; text-align: center; }
        .pd-stat .val { font-family: 'Outfit', sans-serif; font-weight: 900; font-size: 40px; color: #F97316; letter-spacing: -0.02em; line-height: 1; }
        .pd-stat .lbl { font-size: 11.5px; font-weight: 700; color: #8A93A6; text-transform: uppercase; letter-spacing: 0.06em; margin-top: 10px; }
        .pd-photos { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 10px; }
        .pd-photos img { width: 100%; aspect-ratio: 1; object-fit: cover; border-radius: 12px; border: 1px solid #E4E8F0; }
        .pd-section-title { font-family: 'Outfit', sans-serif; font-weight: 700; font-size: 16px; margin-bottom: 14px; }
      `}</style>

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
