import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { calcularCategoria, traduzirPolo } from "@/lib/category";
import { SignOutButton } from "@/components/SignOutButton";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const userId = (session?.user as { id?: string } | undefined)?.id;

  const atletas = userId
    ? await prisma.athlete.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        include: {
          subscriptions: { where: { status: "ACTIVE" }, take: 1 },
        },
      })
    : [];

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <p className="text-sm text-c10-blue-dark/60">Camisa 10 FC</p>
          <h1 className="text-2xl font-bold">Meus atletas</h1>
        </div>
        <SignOutButton />
      </div>

      <div className="space-y-4">
        {atletas.map((atleta) => {
          const planoAtivo = atleta.subscriptions[0]?.plan;
          return (
            <Link
              key={atleta.id}
              href={`/dashboard/atleta/${atleta.id}`}
              className="card flex items-center justify-between transition hover:shadow-md"
            >
              <div>
                <p className="font-semibold">{atleta.name}</p>
                <p className="text-sm text-c10-blue-dark/60">
                  {calcularCategoria(atleta.birthDate)} · {traduzirPolo(atleta.polo)}
                </p>
              </div>
              <span
                className={
                  planoAtivo
                    ? "rounded-full bg-c10-blue/10 px-3 py-1 text-xs font-semibold text-c10-blue"
                    : "rounded-full bg-c10-orange/10 px-3 py-1 text-xs font-semibold text-c10-orange"
                }
              >
                {planoAtivo ? `Plano ${planoAtivo === "CRAQUE" ? "Craque" : "Torcida"} ativo` : "Sem plano ativo"}
              </span>
            </Link>
          );
        })}

        {atletas.length === 0 && (
          <p className="text-c10-blue-dark/60">Você ainda não cadastrou nenhum atleta.</p>
        )}
      </div>

      <Link href="/dashboard/atleta/novo" className="btn-primary mt-6 inline-flex">
        + Cadastrar atleta
      </Link>
    </main>
  );
}
