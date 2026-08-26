import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Camisa 10 FC — Plataforma de Atletas",
  description:
    "Acompanhe a evolução do seu atleta no Camisa 10 FC: estatísticas, fotos e memórias de cada partida.",
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
