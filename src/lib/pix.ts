export const PLANOS = {
  TORCIDA: { label: "Torcida", preco: 37, cor: "#60a5fa", descricao: "Estatísticas, histórico de jogos e link exclusivo do seu atleta." },
  CRAQUE: { label: "Craque", preco: 57, cor: "#F97316", descricao: "Tudo do Torcida + foto em cada jogo — um álbum automático da temporada." },
} as const;

export type PlanoKey = keyof typeof PLANOS;

export function chavePix(): string {
  return process.env.PIX_KEY ?? "";
}

export function nomeBeneficiarioPix(): string {
  return process.env.PIX_NOME_BENEFICIARIO ?? "Camisa 10 FC";
}

function field(id: string, value: string): string {
  return `${id}${value.length.toString().padStart(2, "0")}${value}`;
}

function crc16(str: string): string {
  let crc = 0xffff;
  for (let i = 0; i < str.length; i++) {
    crc ^= str.charCodeAt(i) << 8;
    for (let j = 0; j < 8; j++) {
      crc = crc & 0x8000 ? (crc << 1) ^ 0x1021 : crc << 1;
    }
    crc &= 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
}

/**
 * Gera o payload BR Code (EMV) de um PIX estático, pronto pra virar QR Code
 * ou "copia e cola". Não depende de nenhum gateway de pagamento — usa
 * diretamente a chave PIX do clube (`PIX_KEY`).
 */
export function generatePixPayload(txid: string, amountReais: number): string {
  const chave = chavePix().replace(/[^\d]/g, "").length === 14 ? chavePix().replace(/[^\d]/g, "") : chavePix();
  const merchantName = nomeBeneficiarioPix().substring(0, 25).toUpperCase();
  const city = "SAO PAULO";
  const amount = amountReais.toFixed(2);

  const merchantAccount = field("00", "BR.GOV.BCB.PIX") + field("01", chave);
  const additionalData = field("05", txid.substring(0, 25));

  const payload =
    field("00", "01") +
    field("26", merchantAccount) +
    field("52", "0000") +
    field("53", "986") +
    field("54", amount) +
    field("58", "BR") +
    field("59", merchantName) +
    field("60", city) +
    field("62", additionalData) +
    "6304";

  return payload + crc16(payload);
}
