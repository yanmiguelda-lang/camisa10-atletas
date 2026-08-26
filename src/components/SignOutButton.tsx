"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm font-medium text-c10-blue-dark/60 hover:text-c10-blue"
    >
      Sair
    </button>
  );
}
