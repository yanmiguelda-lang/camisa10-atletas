export const PLANOS = {
  TORCIDA: { label: "Torcida", preco: 37, descricao: "Estatísticas completas + link compartilhável" },
  CRAQUE: { label: "Craque", preco: 57, descricao: "Tudo do Torcida + fotos das partidas e álbuns de memória" },
} as const;

export type PlanoKey = keyof typeof PLANOS;

export function chavePix(): string {
  return process.env.PIX_KEY ?? "";
}

export function nomeBeneficiarioPix(): string {
  return process.env.PIX_NOME_BENEFICIARIO ?? "Camisa 10 FC";
}
