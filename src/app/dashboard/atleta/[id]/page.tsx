import Link from "next/link";
import { notFound } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularCategoria, traduzirPolo, traduzirPosicao } from "@/lib/category";
import { NovaPartidaForm } from "@/components/NovaPartidaForm";

export default async function AtletaPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atleta = userId
    ? await prisma.athlete.findFirst({
        where: { id: params.id, userId },
        include: {
          matches: { orderBy: { date: "desc" }, include: { photos: true } },
          subscriptions: { where: { status: "ACTIVE" }, take: 1 },
        },
      })
    : null;

  if (!atleta) notFound();

  const planoAtivo = atleta.subscriptions[0]?.plan;
  const totalGols = atleta.matches.reduce((s, m) => s + m.goals, 0);
  const totalAssist = atleta.matches.reduce((s, m) => s + m.assists, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <Link href="/dashboard" className="text-sm text-c10-blue-dark/60 hover:text-c10-blue">
        ← Meus atletas
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">{atleta.name}</h1>
          <p className="text-c10-blue-dark/60">
            {calcularCategoria(atleta.birthDate)} · {traduzirPolo(atleta.polo)}
          </p>
        </div>
        <div className="flex gap-2">
          <Link href={`/atleta/${atleta.publicSlug}`} className="btn-secondary" target="_blank">
            Ver perfil público
          </Link>
          {!planoAtivo && (
            <Link href={`/assinatura/${atleta.id}`} className="btn-primary">
              Assinar plano
            </Link>
          )}
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="card text-center">
          <p className="text-2xl font-bold text-c10-blue">{totalGols}</p>
          <p className="text-sm text-c10-blue-dark/60">Gols</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-c10-blue">{totalAssist}</p>
          <p className="text-sm text-c10-blue-dark/60">Assistências</p>
        </div>
        <div className="card text-center">
          <p className="text-2xl font-bold text-c10-blue">{atleta.matches.length}</p>
          <p className="text-sm text-c10-blue-dark/60">Partidas</p>
        </div>
      </div>

      {!planoAtivo && (
        <p className="mt-4 rounded-lg bg-c10-orange/10 px-4 py-3 text-sm text-c10-blue-dark/80">
          Sem plano ativo: as fotos das partidas não aparecem no perfil público até assinar o plano Craque.
        </p>
      )}

      <h2 className="mb-3 mt-8 text-lg font-bold">Registrar partida</h2>
      <NovaPartidaForm athleteId={atleta.id} />

      <h2 className="mb-3 mt-10 text-lg font-bold">Histórico de partidas</h2>
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
            {m.notes && <p className="mt-1 text-sm italic text-c10-blue-dark/60">{m.notes}</p>}
            {m.photos.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {m.photos.map((p) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img key={p.id} src={p.url} alt="" className="h-20 w-20 rounded-lg object-cover" />
                ))}
              </div>
            )}
          </div>
        ))}
        {atleta.matches.length === 0 && (
          <p className="text-c10-blue-dark/60">Nenhuma partida registrada ainda.</p>
        )}
      </div>
    </main>
  );
}
