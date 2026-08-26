import { randomBytes } from "crypto";

/** Gera um slug publico unico, ex: "joao-silva-a1b2c3" — usado no link compartilhavel do atleta. */
export function gerarSlug(nome: string): string {
  const base = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "") // remove marcas diacriticas combinantes (acentos)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const sufixo = randomBytes(3).toString("hex");
  return `${base}-${sufixo}`;
}
