import { prisma } from "@/lib/prisma";

/**
 * Retorna true se o atleta tem um pagamento PENDENTE (e nenhum ativo) — nesse
 * caso as telas internas do atleta ficam bloqueadas até o admin confirmar.
 * Atletas sem nenhuma assinatura (ainda não tentaram pagar) continuam liberados
 * no modo básico, sem essa trava.
 */
export async function estaAguardandoAtivacao(athleteId: string): Promise<boolean> {
  const [ativa, pendente] = await Promise.all([
    prisma.subscription.findFirst({ where: { athleteId, status: "ACTIVE" } }),
    prisma.subscription.findFirst({ where: { athleteId, status: "PENDING" } }),
  ]);
  return !ativa && !!pendente;
}
