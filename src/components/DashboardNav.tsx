"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import Button from "@/components/Button";

export function DashboardNav({ isAdmin }: { isAdmin?: boolean }) {
  return (
    <nav
      style={{
        padding: "18px 24px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        backdropFilter: "blur(16px)",
        background: "linear-gradient(180deg, rgba(6,14,32,0.95), rgba(6,14,32,0.80))",
        position: "sticky",
        top: 0,
        zIndex: 10,
      }}
    >
      <Link href="/dashboard" style={{ textDecoration: "none" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.png" alt="Perfil Camisa 10" style={{ height: 36, width: "auto", objectFit: "contain" }} />
      </Link>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        {isAdmin && (
          <Link
            href="/admin"
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#F97316",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: 10,
              border: "1.5px solid rgba(249,115,22,0.30)",
              background: "rgba(249,115,22,0.08)",
              letterSpacing: 0.5,
            }}
          >
            ⚙ Admin
          </Link>
        )}
        <Button variant="ghost" size="sm" onClick={() => signOut({ callbackUrl: "/" })}>
          Sair
        </Button>
      </div>
    </nav>
  );
}
