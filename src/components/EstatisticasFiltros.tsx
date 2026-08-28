"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

export function EstatisticasFiltros({
  temporadas,
  posicoes,
}: {
  temporadas: string[];
  posicoes: { value: string; label: string }[];
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function atualizar(chave: string, valor: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (valor === "todas" || valor === "") params.delete(chave);
    else params.set(chave, valor);
    router.push(`${pathname}?${params.toString()}`);
  }

  const temporadaAtual = searchParams.get("temporada") ?? "todas";
  const posicaoAtual = searchParams.get("posicao") ?? "todas";

  return (
    <div className="est-filtros">
      <label className="est-select">
        <span>Temporada</span>
        <select value={temporadaAtual} onChange={(e) => atualizar("temporada", e.target.value)}>
          <option value="todas">Todas</option>
          {temporadas.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </label>

      {posicoes.length > 1 && (
        <label className="est-select">
          <span>Posição jogada</span>
          <select value={posicaoAtual} onChange={(e) => atualizar("posicao", e.target.value)}>
            <option value="todas">Todas</option>
            {posicoes.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </label>
      )}
    </div>
  );
}
