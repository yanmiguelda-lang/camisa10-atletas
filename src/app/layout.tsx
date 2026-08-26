import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Camisa 10 · Perfil do Atleta",
  description:
    "O perfil profissional do seu atleta. Acompanhe cada gol, cada assistência, cada conquista.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
