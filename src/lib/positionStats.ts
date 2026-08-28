/**
 * Estatísticas detalhadas por posição — cada função em quadra tem métricas
 * diferentes. Usado pelo formulário de partida (campos dinâmicos) e pelas
 * telas que exibem o histórico/estatísticas do atleta.
 */

export type StatKey =
  | "goals"
  | "assists"
  | "saves"
  | "goalsConceded"
  | "savesOneOnOne"
  | "hardSaves"
  | "passesCompleted"
  | "tackles"
  | "interceptions"
  | "progressivePasses"
  | "effectivePressures"
  | "shots"
  | "dribblesCompleted"
  | "chancesCreated"
  | "foulsSuffered"
  | "recoveries"
  | "duelsWon"
  | "ballsLost";

export const STAT_LABELS: Record<StatKey, string> = {
  goals: "Gols",
  assists: "Assistências",
  saves: "Defesas",
  goalsConceded: "Gols sofridos",
  savesOneOnOne: "Defesas em 1x1",
  hardSaves: "Defesas difíceis",
  passesCompleted: "Passes certos",
  tackles: "Desarmes",
  interceptions: "Interceptações",
  progressivePasses: "Passes progressivos",
  effectivePressures: "Pressões eficientes",
  shots: "Finalizações",
  dribblesCompleted: "Dribles certos",
  chancesCreated: "Chances criadas",
  foulsSuffered: "Faltas sofridas",
  recoveries: "Recuperações",
  duelsWon: "Duelos ganhos",
  ballsLost: "Perda de bola",
};

/** Ordem de exibição dos campos de estatística por posição (sem minutagem, tratada à parte). */
export const POSITION_STATS: Record<"GOLEIRO" | "FIXO" | "ALA" | "PIVO", StatKey[]> = {
  GOLEIRO: ["saves", "goalsConceded", "savesOneOnOne", "hardSaves", "passesCompleted", "ballsLost", "goals", "assists"],
  FIXO: ["tackles", "interceptions", "recoveries", "duelsWon", "progressivePasses", "ballsLost", "effectivePressures", "goals", "assists"],
  ALA: ["goals", "assists", "shots", "dribblesCompleted", "chancesCreated", "recoveries", "duelsWon"],
  PIVO: ["goals", "shots", "assists", "chancesCreated", "duelsWon", "foulsSuffered", "ballsLost"],
};

/** As 2-3 estatísticas mais representativas de cada posição — usadas em espaços compactos (cards, pills). */
export const POSITION_HIGHLIGHT_STATS: Record<"GOLEIRO" | "FIXO" | "ALA" | "PIVO", StatKey[]> = {
  GOLEIRO: ["saves", "goalsConceded"],
  FIXO: ["tackles", "interceptions", "recoveries"],
  ALA: ["goals", "assists"],
  PIVO: ["goals", "assists"],
};
