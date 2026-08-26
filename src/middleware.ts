import { withAuth } from "next-auth/middleware";

// Protege /dashboard (área dos pais) e /admin (confirmação de pagamentos).
// Rotas públicas — /, /login, /cadastro, /atleta/[slug] — ficam de fora.
export default withAuth({
  pages: {
    signIn: "/login",
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
