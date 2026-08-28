/**
 * Suporta múltiplos e-mails de admin via `ADMIN_EMAIL` separados por vírgula
 * (ex: "dono@camisa10.com,mensalidades@camisa10.com"). Mantém compatibilidade
 * com um único e-mail configurado.
 */
export function isAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const lista = (process.env.ADMIN_EMAIL ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return lista.includes(email.toLowerCase());
}
