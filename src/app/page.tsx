import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center gap-8 px-6 py-16 text-center">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-wide text-c10-orange">
          Camisa 10 FC
        </p>
        <h1 className="text-3xl font-extrabold sm:text-4xl">
          Cada gol, cada assistência, cada conquista do seu atleta — registrada.
        </h1>
        <p className="text-c10-blue-dark/70">
          Acompanhe a evolução do seu filho ou filha no futsal, temporada após
          temporada, e compartilhe com quem torce por ele(a).
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Link href="/cadastro" className="btn-primary">
          Criar conta de responsável
        </Link>
        <Link href="/login" className="btn-secondary">
          Já tenho conta
        </Link>
      </div>

      <div className="grid w-full gap-4 pt-8 sm:grid-cols-2">
        <div className="card-accent text-left">
          <p className="font-semibold text-c10-blue-dark">⚽ Plano Torcida — R$ 37/mês</p>
          <p className="text-sm text-c10-blue-dark/70">
            Estatísticas completas de cada partida + link compartilhável do
            perfil do atleta.
          </p>
        </div>
        <div className="card-accent text-left">
          <p className="font-semibold text-c10-blue-dark">🏆 Plano Craque — R$ 57/mês</p>
          <p className="text-sm text-c10-blue-dark/70">
            Tudo do Torcida, mais fotos das partidas e álbuns de memória por
            temporada.
          </p>
        </div>
      </div>
    </main>
  );
}
