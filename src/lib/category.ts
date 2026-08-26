/** Categoria de base (Sub 7 a Sub 12) calculada pela idade no ano corrente da temporada. */
export function calcularCategoria(birthDate: Date, referenceYear = new Date().getFullYear()): string {
  const idade = referenceYear - birthDate.getFullYear();
  const clamped = Math.min(Math.max(idade, 7), 12);
  return `Sub ${clamped}`;
}

/** Temporada (ano) a partir de uma data — usado pra agrupar álbuns automaticamente. */
export function calcularTemporada(date: Date): string {
  return String(date.getFullYear());
}

export function traduzirPolo(polo: string): string {
  const mapa: Record<string, string> = {
    SANTANA: "Santana de Parnaíba",
    BARUERI: "Barueri",
    OSASCO: "Osasco",
  };
  return mapa[polo] ?? polo;
}

export function traduzirPosicao(position: string): string {
  const mapa: Record<string, string> = {
    GOLEIRO: "Goleiro",
    FIXO: "Fixo",
    ALA: "Ala",
    PIVO: "Pivô",
  };
  return mapa[position] ?? position;
}
