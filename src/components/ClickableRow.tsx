"use client";

import { useRouter } from "next/navigation";

/** Linha de tabela clicável (navega pra `href`) — mantém a `<tr>` válida no HTML. */
export function ClickableRow({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  const router = useRouter();
  return (
    <tr
      className={className}
      role="link"
      tabIndex={0}
      onClick={() => router.push(href)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") router.push(href);
      }}
      style={{ cursor: "pointer" }}
    >
      {children}
    </tr>
  );
}
