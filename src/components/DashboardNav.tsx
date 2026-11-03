"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import Button from "@/components/Button";

// Barra do topo das telas internas, no estilo de transmissão (selo AO VIVO com relógio).
export function DashboardNav({ isAdmin }: { isAdmin?: boolean }) {
  const [hora, setHora] = useState("");
  useEffect(() => {
    const atualizar = () => setHora(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    atualizar();
    const t = setInterval(atualizar, 15000);
    return () => clearInterval(t);
  }, []);

  return (
    <nav className="tvi-nav">
      <div className="tvi-nav-esq">
        <Link href="/dashboard" style={{ textDecoration: "none" }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Perfil Camisa 10" />
        </Link>
        <span className="tvi-aovivo"><i />Ao vivo<b>{hora}</b></span>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isAdmin && <Link href="/admin" className="tvi-admin">⚙ Admin</Link>}
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
          Sair
        </Button>
      </div>
    </nav>
  );
}
