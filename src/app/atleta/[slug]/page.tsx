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

  const totalGols = atleta.matches.reduce((s, m) => s + m.goals, 0);
  const totalAssist = atleta.matches.reduce((s, m) => s + m.assists, 0);
  const totalDefesas = atleta.matches.reduce((s, m) => s + m.defensivePlays, 0);

  // Agrupa fotos por temporada pro álbum sazonal automático.
  const albunsPorTemporada = new Map<string, string[]>();
  if (temFotos) {
    for (const match of atleta.matches) {
      const temporada = calcularTemporada(match.date);
      const urls = match.photos.map((p) => p.url);
      if (urls.length === 0) continue;
      albunsPorTemporada.set(temporada, [...(albunsPorTemporada.get(temporada) ?? []), ...urls]);
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6 flex items-center gap-4">
        {atleta.photoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={atleta.photoUrl}
            alt={atleta.name}
            className="h-20 w-20 rounded-full border-4 border-c10-orange object-cover"
          />
        ) : (
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-c10-blue/10 text-2xl font-bold text-c10-blue">
            {atleta.name.charAt(0)}
          </div>
        )}
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-c10-orange">Camisa 10 FC</p>
          <h1 className="text-2xl font-bold">{atleta.name}</h1>
          <p className="text-sm text-c10-blue-dark/60">
            {calcularCategoria(atleta.birthDate)} · {traduzirPolo(atleta.polo)}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-c10-blue">{totalGols}</p>
          <p className="text-sm text-c10-blue-dark/60">Gols</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-c10-blue">{totalAssist}</p>
          <p className="text-sm text-c10-blue-dark/60">Assistências</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-c10-blue">{totalDefesas}</p>
          <p className="text-sm text-c10-blue-dark/60">Defesas</p>
        </div>
      </div>

      {temFotos && albunsPorTemporada.size > 0 && (
        <div className="mt-8">
          <h2 className="mb-3 text-lg font-bold">Álbuns de memória</h2>
          {[...albunsPorTemporada.entries()].map(([temporada, urls]) => (
            <div key={temporada} className="mb-4">
              <p className="mb-2 text-sm font-semibold text-c10-blue-dark/70">Temporada {temporada}</p>
              <div className="flex flex-wrap gap-2">
                {urls.map((url) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={url} src={url} alt="" className="h-24 w-24 rounded-lg object-cover" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!temFotos && atleta.matches.some((m) => m.photos.length > 0) && (
        <p className="mt-6 rounded-lg bg-c10-orange/10 px-4 py-3 text-sm text-c10-blue-dark/80">
          📷 Esse atleta tem fotos registradas — elas aparecem aqui quando o plano Craque estiver ativo.
        </p>
      )}

      <h2 className="mb-3 mt-8 text-lg font-bold">Últimas partidas</h2>
      <div className="space-y-3">
        {atleta.matches.map((m) => (
          <div key={m.id} className="card">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                vs {m.opponent} — {new Date(m.date).toLocaleDateString("pt-BR")}
              </p>
              <span className="text-sm text-c10-blue-dark/60">{traduzirPosicao(m.position)}</span>
            </div>
            <p className="mt-1 text-sm text-c10-blue-dark/70">
              ⚽ {m.goals} gols · 🎯 {m.assists} assistências · 🛡️ {m.defensivePlays} jogadas defensivas
            </p>
          </div>
        ))}
        {atleta.matches.length === 0 && (
          <p className="text-c10-blue-dark/60">Nenhuma partida registrada ainda.</p>
        )}
      </div>

      <p className="mt-10 text-center text-xs text-c10-blue-dark/40">
        Perfil gerado pela plataforma de atletas do Camisa 10 FC 🧡💙
      </p>
    </main>
  );
}
