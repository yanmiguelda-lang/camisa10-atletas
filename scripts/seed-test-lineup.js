/* Cria 5 contas de teste (uma por posição da linha titular) com 5 partidas cada,
 * pra testar estatísticas por posição e o painel. Rodar com DATABASE_URL setado. */
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const SENHA = "Teste123!";
const OPONENTES = ["Lions FC", "Águias FC", "Tigres FS", "Falcões FC", "Panteras FS"];
const DATAS = ["2026-05-10", "2026-06-01", "2026-06-22", "2026-07-13", "2026-08-03"];

function slug(nome) {
  const base = nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return `${base}-${Math.random().toString(16).slice(2, 8)}`;
}

const ELENCO = [
  {
    pai: { name: "Fernanda Nogueira", email: "teste.goleiro@camisa10.com", phone: "(11) 91111-0001" },
    atleta: { name: "Rafael Nogueira", birthDate: "2016-03-12", jerseyNumber: 1, polo: "SANTANA", position: "GOLEIRO" },
    jogos: [
      { minutes: 40, saves: 8, goalsConceded: 2, savesOneOnOne: 3, hardSaves: 2, passesCompleted: 15, ballsLost: 1, notes: "Pegou pênalti decisivo" },
      { minutes: 40, saves: 5, goalsConceded: 1, savesOneOnOne: 1, hardSaves: 1, passesCompleted: 18, ballsLost: 0 },
      { minutes: 38, saves: 10, goalsConceded: 3, savesOneOnOne: 4, hardSaves: 3, passesCompleted: 12, ballsLost: 2, notes: "Muito exigido, boa atuação" },
      { minutes: 40, saves: 6, goalsConceded: 0, savesOneOnOne: 2, hardSaves: 1, passesCompleted: 20, ballsLost: 0, notes: "Jogo sem sofrer gols" },
      { minutes: 40, saves: 9, goalsConceded: 2, savesOneOnOne: 3, hardSaves: 2, passesCompleted: 16, ballsLost: 1 },
    ],
  },
  {
    pai: { name: "Carlos Alves", email: "teste.fixo@camisa10.com", phone: "(11) 91111-0002" },
    atleta: { name: "Bernardo Alves", birthDate: "2015-07-22", jerseyNumber: 4, polo: "BARUERI", position: "FIXO" },
    jogos: [
      { minutes: 35, tackles: 4, interceptions: 3, recoveries: 6, duelsWon: 5, progressivePasses: 8, ballsLost: 2, effectivePressures: 4 },
      { minutes: 40, tackles: 6, interceptions: 2, recoveries: 5, duelsWon: 7, progressivePasses: 6, ballsLost: 1, effectivePressures: 5, notes: "Liderou a defesa" },
      { minutes: 32, tackles: 3, interceptions: 4, recoveries: 8, duelsWon: 4, progressivePasses: 10, ballsLost: 3, effectivePressures: 3 },
      { minutes: 40, tackles: 5, interceptions: 5, recoveries: 7, duelsWon: 6, progressivePasses: 9, ballsLost: 1, effectivePressures: 6, notes: "Excelente na saída de bola" },
      { minutes: 40, tackles: 7, interceptions: 3, recoveries: 9, duelsWon: 8, progressivePasses: 7, ballsLost: 0, effectivePressures: 5 },
    ],
  },
  {
    pai: { name: "Juliana Martins", email: "teste.ala1@camisa10.com", phone: "(11) 91111-0003" },
    atleta: { name: "Enzo Martins", birthDate: "2017-01-30", jerseyNumber: 7, polo: "SANTANA", position: "ALA" },
    jogos: [
      { minutes: 30, goals: 1, assists: 2, shots: 3, dribblesCompleted: 4, chancesCreated: 2, recoveries: 3, duelsWon: 2 },
      { minutes: 40, goals: 2, assists: 1, shots: 5, dribblesCompleted: 6, chancesCreated: 3, recoveries: 2, duelsWon: 4, notes: "Grande atuação!" },
      { minutes: 35, goals: 0, assists: 3, shots: 2, dribblesCompleted: 3, chancesCreated: 4, recoveries: 4, duelsWon: 3 },
      { minutes: 40, goals: 3, assists: 1, shots: 6, dribblesCompleted: 5, chancesCreated: 2, recoveries: 1, duelsWon: 5, notes: "Hat-trick" },
      { minutes: 38, goals: 1, assists: 2, shots: 4, dribblesCompleted: 7, chancesCreated: 3, recoveries: 2, duelsWon: 3 },
    ],
  },
  {
    pai: { name: "Roberto Ribeiro", email: "teste.ala2@camisa10.com", phone: "(11) 91111-0004" },
    atleta: { name: "Théo Ribeiro", birthDate: "2014-11-05", jerseyNumber: 11, polo: "OSASCO", position: "ALA" },
    jogos: [
      { minutes: 40, goals: 2, assists: 0, shots: 4, dribblesCompleted: 2, chancesCreated: 1, recoveries: 5, duelsWon: 4 },
      { minutes: 30, goals: 1, assists: 1, shots: 3, dribblesCompleted: 3, chancesCreated: 2, recoveries: 3, duelsWon: 2 },
      { minutes: 35, goals: 0, assists: 2, shots: 2, dribblesCompleted: 4, chancesCreated: 3, recoveries: 4, duelsWon: 5, notes: "Melhor em quadra" },
      { minutes: 40, goals: 2, assists: 2, shots: 5, dribblesCompleted: 5, chancesCreated: 2, recoveries: 2, duelsWon: 3 },
      { minutes: 40, goals: 1, assists: 0, shots: 3, dribblesCompleted: 3, chancesCreated: 1, recoveries: 6, duelsWon: 4 },
    ],
  },
  {
    pai: { name: "Patrícia Cardoso", email: "teste.pivo@camisa10.com", phone: "(11) 91111-0005" },
    atleta: { name: "Miguel Cardoso", birthDate: "2017-09-18", jerseyNumber: 9, polo: "BARUERI", position: "PIVO" },
    jogos: [
      { minutes: 40, goals: 3, shots: 6, assists: 1, chancesCreated: 2, duelsWon: 5, foulsSuffered: 3, ballsLost: 2, notes: "3 gols no jogo" },
      { minutes: 35, goals: 2, shots: 4, assists: 0, chancesCreated: 1, duelsWon: 4, foulsSuffered: 2, ballsLost: 1 },
      { minutes: 40, goals: 1, shots: 3, assists: 2, chancesCreated: 3, duelsWon: 6, foulsSuffered: 4, ballsLost: 3 },
      { minutes: 40, goals: 4, shots: 7, assists: 1, chancesCreated: 2, duelsWon: 3, foulsSuffered: 1, ballsLost: 0, notes: "Artilheiro da rodada" },
      { minutes: 38, goals: 2, shots: 5, assists: 0, chancesCreated: 2, duelsWon: 5, foulsSuffered: 2, ballsLost: 1 },
    ],
  },
];

async function main() {
  for (const entry of ELENCO) {
    const passwordHash = await bcrypt.hash(SENHA, 10);

    const user = await prisma.user.upsert({
      where: { email: entry.pai.email },
      update: {},
      create: { name: entry.pai.name, email: entry.pai.email, passwordHash, phone: entry.pai.phone },
    });

    const athlete = await prisma.athlete.create({
      data: {
        userId: user.id,
        name: entry.atleta.name,
        birthDate: new Date(entry.atleta.birthDate),
        jerseyNumber: entry.atleta.jerseyNumber,
        polo: entry.atleta.polo,
        position: entry.atleta.position,
        publicSlug: slug(entry.atleta.name),
      },
    });

    await prisma.subscription.create({
      data: {
        userId: user.id,
        athleteId: athlete.id,
        plan: "CRAQUE",
        status: "ACTIVE",
        confirmedAt: new Date(),
        confirmedBy: "seed-script",
      },
    });

    for (let i = 0; i < entry.jogos.length; i++) {
      const jogo = entry.jogos[i];
      await prisma.match.create({
        data: {
          athleteId: athlete.id,
          date: new Date(DATAS[i]),
          opponent: OPONENTES[i],
          position: entry.atleta.position,
          minutes: jogo.minutes,
          notes: jogo.notes,
          goals: jogo.goals ?? 0,
          assists: jogo.assists ?? 0,
          saves: jogo.saves,
          goalsConceded: jogo.goalsConceded,
          savesOneOnOne: jogo.savesOneOnOne,
          hardSaves: jogo.hardSaves,
          passesCompleted: jogo.passesCompleted,
          tackles: jogo.tackles,
          interceptions: jogo.interceptions,
          progressivePasses: jogo.progressivePasses,
          effectivePressures: jogo.effectivePressures,
          shots: jogo.shots,
          dribblesCompleted: jogo.dribblesCompleted,
          chancesCreated: jogo.chancesCreated,
          foulsSuffered: jogo.foulsSuffered,
          recoveries: jogo.recoveries,
          duelsWon: jogo.duelsWon,
          ballsLost: jogo.ballsLost,
        },
      });
    }

    console.log(`✓ ${entry.atleta.name} (${entry.atleta.position}) — login: ${entry.pai.email}`);
  }

  console.log("\nSenha de todas as contas: " + SENHA);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
