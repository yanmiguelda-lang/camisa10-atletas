"use client";

import { useEffect, useState } from "react";

/**
 * Efeitos da página inicial "Transmissão ao vivo":
 * vinheta com o escudo (uma vez por sessão), relógio do selo AO VIVO,
 * blocos que entram ao rolar e números do placar contando até o valor.
 */
export function TvVinheta() {
  const [mostrar, setMostrar] = useState(false);
  useEffect(() => {
    let ja = false;
    try { ja = sessionStorage.getItem("c10-vinheta") === "1"; sessionStorage.setItem("c10-vinheta", "1"); } catch {}
    if (ja) return;
    setMostrar(true);
    const t = setTimeout(() => setMostrar(false), 1700);
    return () => clearTimeout(t);
  }, []);
  if (!mostrar) return null;
  return (
    <div className="tv-vinheta" aria-hidden="true">
      <div className="lamina l1" />
      <div className="lamina l2" />
      <div className="lamina l3" />
      <div className="lamina l4" />
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.png" alt="" />
      <div className="flash" />
    </div>
  );
}

export function TvRelogio() {
  const [hora, setHora] = useState("");
  useEffect(() => {
    const atualizar = () => setHora(new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" }));
    atualizar();
    const t = setInterval(atualizar, 15000);
    return () => clearInterval(t);
  }, []);
  return <span className="tv-relogio">{hora}</span>;
}

export function TvEfeitos() {
  useEffect(() => {
    const contar = (el: HTMLElement) => {
      const alvo = Number(el.dataset.contar);
      const prefixo = el.dataset.prefixo ?? "";
      const sufixo = el.dataset.sufixo ?? "";
      const ini = performance.now();
      const passo = (t: number) => {
        const p = Math.min((t - ini) / 1400, 1);
        el.textContent = `${prefixo}${Math.round(alvo * (1 - Math.pow(1 - p, 3)))}${sufixo}`;
        if (p < 1) requestAnimationFrame(passo);
      };
      requestAnimationFrame(passo);
    };
    const obs = new IntersectionObserver(
      (entradas) => entradas.forEach((e) => {
        if (!e.isIntersecting) return;
        const el = e.target as HTMLElement;
        el.classList.add("ok");
        el.querySelectorAll<HTMLElement>("[data-contar]").forEach(contar);
        obs.unobserve(el);
      }),
      { threshold: 0.18 },
    );
    document.querySelectorAll(".tv-revela").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
  return null;
}
