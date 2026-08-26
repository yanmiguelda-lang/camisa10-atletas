import Link from "next/link";
import Button from "@/components/Button";

const FD = "'Outfit', 'Inter', system-ui, sans-serif";

export default function LandingPage() {
  return (
    <main style={{ minHeight: "100vh", background: "#F0F0F0", fontFamily: "'Inter', system-ui, sans-serif" }}>
      <style>{`
        /* ──────────────────────────── BASE (mobile-first) ──────────────────────────── */

        .lp-nav { padding: 0 20px; height: 60px; display: flex; align-items: center; justify-content: space-between; background: #F0F0F0; border-bottom: 1px solid rgba(0,0,0,0.07); position: sticky; top: 0; z-index: 100; }
        .lp-nav-link { display: none; }
        .lp-nav-entrar { color: #555; text-decoration: none; font-size: 13px; font-weight: 600; padding: 8px 12px; }

        .lp-hero { display: flex; flex-direction: column; background: #F0F0F0; }
        .lp-hero-img { order: -1; width: 100%; height: 72vw; max-height: 420px; min-height: 260px; overflow: hidden; position: relative; }
        .lp-hero-img img { width: 100%; height: 100%; object-fit: contain; object-position: bottom center; filter: drop-shadow(0 8px 32px rgba(0,0,0,0.12)); }
        .lp-hero-img .c10-bg { position: absolute; font-family: ${FD}; font-size: 38vw; font-weight: 900; color: transparent; -webkit-text-stroke: 2px rgba(0,0,0,0.04); line-height: 1; letter-spacing: -6px; user-select: none; bottom: -2vw; right: -4vw; z-index: 0; pointer-events: none; }
        .lp-hero-img-inner { position: relative; z-index: 1; width: 100%; height: 100%; }
        .lp-hero-text { padding: 28px 20px 40px; order: 1; }
        .lp-hero-proof { display: flex; align-items: center; gap: 12px; margin-bottom: 20px; }
        .lp-hero-h1 { font-family: ${FD}; font-size: clamp(48px, 13vw, 104px); font-weight: 900; line-height: 0.92; letter-spacing: -3px; color: #0A0A0A; text-transform: uppercase; margin-bottom: 16px; }
        .lp-hero-p { font-size: 15px; color: #555; line-height: 1.7; margin-bottom: 28px; }
        .lp-hero-btns { display: flex; flex-direction: column; gap: 10px; }
        .lp-float-card { display: none; }

        .lp-stats { background: #E8E8E8; padding: 48px 20px; border-top: 1px solid rgba(0,0,0,0.06); }
        .lp-stats-nums { display: grid; grid-template-columns: 1fr 1fr; gap: 32px 20px; margin-bottom: 40px; }
        .lp-stat-val { font-family: ${FD}; font-size: clamp(40px, 12vw, 72px); font-weight: 900; color: #0A0A0A; line-height: 1; letter-spacing: -2px; }
        .lp-stat-lbl { font-size: 13px; color: #888; margin-top: 6px; line-height: 1.4; }
        .lp-stats-text { margin-bottom: 28px; }
        .lp-stats-text-main { font-family: ${FD}; font-size: 20px; font-weight: 800; color: #0A0A0A; line-height: 1.3; }
        .lp-stats-text-sub  { font-size: 17px; color: #555; margin-top: 6px; }
        .lp-stats-btns { display: flex; flex-direction: column; gap: 10px; }

        .lp-dark-app { background: #000; padding: 60px 20px; }
        .lp-dark-app-inner { max-width: 1280px; margin: 0 auto; }
        .lp-dark-app-text h2 { font-family: ${FD}; font-size: clamp(36px, 10vw, 72px); font-weight: 900; text-transform: uppercase; color: #fff; line-height: 0.95; letter-spacing: -2px; margin-bottom: 16px; }
        .lp-dark-app-text p  { font-size: 15px; color: #888; line-height: 1.8; margin-bottom: 28px; }
        .lp-dark-app-visual  { display: none; }

        .lp-features { background: #F0F0F0; padding: 60px 20px; }
        .lp-features-inner { max-width: 1280px; margin: 0 auto; }
        .lp-features-head { margin-bottom: 40px; }
        .lp-features-head h2 { font-family: ${FD}; font-size: clamp(36px, 10vw, 72px); font-weight: 900; text-transform: uppercase; color: #0A0A0A; line-height: 0.95; letter-spacing: -2px; margin-bottom: 16px; }
        .lp-features-head p  { font-size: 15px; color: #555; line-height: 1.75; }
        .lp-features-grid { display: grid; grid-template-columns: 1fr; gap: 32px; }

        .lp-athlete { background: #000; display: flex; flex-direction: column; }
        .lp-athlete-photo { order: -1; position: relative; height: 72vw; max-height: 400px; min-height: 260px; overflow: hidden; }
        .lp-athlete-photo img { width: 100%; height: 100%; object-fit: cover; object-position: top center; }
        .lp-athlete-photo-overlay { position: absolute; inset: 0; background: linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.70)); }
        .lp-athlete-text { order: 1; padding: 36px 20px 48px; }
        .lp-athlete-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(249,115,22,0.12); border: 1px solid rgba(249,115,22,0.28); border-radius: 99px; padding: 8px 16px; font-size: 13px; color: #F97316; font-weight: 700; margin-bottom: 20px; }
        .lp-athlete-h2 { font-family: ${FD}; font-size: clamp(32px, 9vw, 62px); font-weight: 900; text-transform: uppercase; color: #fff; line-height: 0.95; letter-spacing: -1.5px; margin-bottom: 16px; }
        .lp-athlete-p { font-size: 15px; color: #888; line-height: 1.8; margin-bottom: 28px; }

        .lp-pricing { background: #F0F0F0; padding: 60px 20px; }
        .lp-pricing-inner { max-width: 1280px; margin: 0 auto; }
        .lp-pricing h2 { font-family: ${FD}; font-size: clamp(36px, 10vw, 72px); font-weight: 900; text-transform: uppercase; color: #0A0A0A; line-height: 0.95; letter-spacing: -2px; margin-bottom: 10px; }
        .lp-pricing > div > p { color: #666; margin-bottom: 36px; font-size: 14px; }
        .lp-pricing-grid { display: grid; grid-template-columns: 1fr; gap: 16px; }

        .lp-cta { background: #1E3A8A; padding: 40px 20px; display: flex; flex-direction: column; gap: 20px; }
        .lp-cta p { font-family: ${FD}; font-size: 18px; font-weight: 800; color: #fff; line-height: 1.4; margin: 0; }

        .lp-footer { background: #060E20; padding: 48px 20px 32px; }
        .lp-footer-inner { max-width: 1280px; margin: 0 auto; }
        .lp-footer-grid { display: grid; grid-template-columns: 1fr; gap: 36px; margin-bottom: 40px; }
        .lp-footer-bottom { border-top: 1px solid rgba(255,255,255,0.05); padding-top: 20px; display: flex; flex-direction: column; gap: 6px; }

        /* ──────────────────────────── TABLET (≥ 768px) ──────────────────────────── */
        @media (min-width: 768px) {
          .lp-nav { padding: 0 32px; height: 68px; }
          .lp-nav-link { display: block; color: #555; text-decoration: none; font-size: 14px; font-weight: 500; }
          .lp-nav-links { display: flex; gap: 28px; align-items: center; }
          .lp-nav-entrar { font-size: 14px; padding: 0; }

          .lp-hero { display: grid; grid-template-columns: 1fr 1fr; align-items: center; min-height: calc(100vh - 68px); padding: 0 32px; max-width: 1280px; margin: 0 auto; gap: 32px; }
          .lp-hero-img { order: 0; height: 80vh; max-height: none; min-height: 400px; width: auto; }
          .lp-hero-text { padding: 48px 0; order: 0; }
          .lp-hero-btns { flex-direction: row; flex-wrap: wrap; }
          .lp-float-card { display: block; }

          .lp-stats { padding: 72px 48px; }
          .lp-stats-inner { max-width: 1280px; margin: 0 auto; }
          .lp-stats-nums { grid-template-columns: repeat(4, 1fr); gap: 0; margin-bottom: 48px; }
          .lp-stats-btns { flex-direction: row; gap: 12px; }

          .lp-dark-app { padding: 100px 48px; }
          .lp-dark-app-inner { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
          .lp-dark-app-visual { display: block; position: relative; }

          .lp-features { padding: 100px 48px; }
          .lp-features-head { display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: flex-start; margin-bottom: 64px; }
          .lp-features-head p { align-self: center; font-size: 16px; }
          .lp-features-grid { grid-template-columns: repeat(3, 1fr); gap: 48px; }

          .lp-athlete { display: grid; grid-template-columns: 1fr 1fr; min-height: 560px; }
          .lp-athlete-photo { order: 0; height: auto; max-height: none; min-height: 500px; }
          .lp-athlete-photo-overlay { background: linear-gradient(to right, rgba(0,0,0,0.25) 0%, transparent 60%), linear-gradient(to top, rgba(0,0,0,0.50) 0%, transparent 40%); }
          .lp-athlete-text { order: 0; padding: 72px 56px; display: flex; flex-direction: column; justify-content: center; }

          .lp-pricing { padding: 100px 48px; }
          .lp-pricing-grid { grid-template-columns: repeat(2, 1fr); max-width: 860px; gap: 20px; }

          .lp-cta { padding: 44px 48px; flex-direction: row; align-items: center; justify-content: space-between; }

          .lp-footer { padding: 64px 48px 40px; }
          .lp-footer-grid { grid-template-columns: 1.4fr 1fr 1fr; gap: 60px; }
          .lp-footer-bottom { flex-direction: row; justify-content: space-between; }
        }
      `}</style>

      {/* ── NAV ── */}
      <nav className="lp-nav">
        <Link href="/" style={{ textDecoration: "none" }}>
          <img src="/logo.png" alt="Perfil Camisa 10" style={{ height: 34, width: "auto", objectFit: "contain" }} />
        </Link>
        <div className="lp-nav-links" style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <Link href="/login" className="lp-nav-entrar">Entrar</Link>
          <Button href="/cadastro" variant="primary" size="sm">Me inscrever →</Button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="lp-hero" style={{ background: "#F0F0F0" }}>
        <div className="lp-hero-text">
          <div className="lp-hero-proof">
            <div style={{ display: "flex" }}>
              {["👦", "👧", "👦", "👦", "👧"].map((e, i) => (
                <div
                  key={i}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: i % 2 === 0 ? "#1E3A8A" : "#F97316",
                    border: "2px solid #F0F0F0",
                    marginLeft: i > 0 ? -10 : 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    position: "relative",
                    zIndex: 5 - i,
                  }}
                >
                  {e}
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#0A0A0A" }}>Já são mais de 210 atletas</div>
              <div style={{ fontSize: 11, color: "#888", marginTop: 1 }}>Venha fazer parte, venha ser Camisa 10!</div>
            </div>
          </div>

          <h1 className="lp-hero-h1">
            SEU
            <br />
            FILHO
            <br />É UM
            <br />
            <span style={{ color: "#F97316" }}>CRAQUE</span>
          </h1>

          <p className="lp-hero-p">
            Registre cada gol, cada assistência, cada conquista do seu atleta. Crie o perfil dele agora e
            compartilhe com toda a família.
          </p>

          <div className="lp-hero-btns">
            <Button href="/cadastro" variant="primary">Criar perfil agora →</Button>
            <Button href="/login" variant="outline-dark">Já tenho conta</Button>
          </div>
        </div>

        <div className="lp-hero-img">
          <div className="c10-bg">C10</div>
          <div className="lp-hero-img-inner">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-atleta.png" alt="Atleta Camisa 10 comemorando conquista" />
            <div
              className="lp-float-card"
              style={{
                position: "absolute",
                bottom: 56,
                right: 0,
                background: "#0A0A0A",
                borderRadius: 12,
                padding: "14px 18px",
                minWidth: 140,
                boxShadow: "0 16px 48px rgba(0,0,0,0.25)",
                zIndex: 2,
              }}
            >
              <div style={{ fontSize: 10, color: "#666", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1, marginBottom: 3 }}>
                Último jogo
              </div>
              <div style={{ fontFamily: FD, fontSize: 26, fontWeight: 900, color: "#F97316", lineHeight: 1 }}>3 Gols</div>
              <div style={{ fontSize: 11, color: "#555", marginTop: 3 }}>2 Assistências</div>
            </div>
            <div
              className="lp-float-card"
              style={{ position: "absolute", top: 40, left: 0, background: "#1E3A8A", borderRadius: 10, padding: "10px 14px", zIndex: 2 }}
            >
              <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>
                Categoria
              </div>
              <div style={{ fontFamily: FD, fontSize: 18, fontWeight: 900, color: "#fff", lineHeight: 1, marginTop: 2 }}>Sub 10</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="lp-stats">
        <div className="lp-stats-inner" style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="lp-stats-nums">
            {[
              { val: "210+", label: "atletas na escola" },
              { val: "3", label: "polos ativos" },
              { val: "Sub 7–11", label: "categorias disputadas" },
              { val: "R$37", label: "por mês, sem contrato" },
            ].map((s, i) => (
              <div key={i}>
                <div className="lp-stat-val">{s.val}</div>
                <div className="lp-stat-lbl">{s.label}</div>
              </div>
            ))}
          </div>

          <div className="lp-stats-text">
            <div className="lp-stats-text-main">Esses são alguns números nossos...</div>
            <div className="lp-stats-text-sub">
              O sonho do seu filho <em style={{ color: "#F97316", fontStyle: "italic", fontWeight: 700 }}>merece ser registrado</em>
            </div>
          </div>

          <div className="lp-stats-btns">
            <Button href="/login" variant="outline-dark">Já tenho conta →</Button>
            <Button href="/cadastro" variant="primary">Criar perfil →</Button>
          </div>
        </div>
      </section>

      {/* ── DARK: APP + CHART ── */}
      <section className="lp-dark-app">
        <div className="lp-dark-app-inner">
          <div className="lp-dark-app-text">
            <h2>
              APRIMORAMENTO
              <br />
              CONTÍNUO
            </h2>
            <p>
              Acompanhe a evolução do seu atleta temporada após temporada. Cada registro vira história, cada
              conquista vira memória.
            </p>
            <Button href="/cadastro" variant="primary">Fazer inscrição →</Button>
          </div>
          <div className="lp-dark-app-visual">
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 60% 50%, rgba(30,58,138,0.35) 0%, transparent 65%)", pointerEvents: "none" }} />
            <div style={{ position: "relative", zIndex: 1, background: "#111", borderRadius: 20, padding: 24, border: "1px solid rgba(255,255,255,0.07)", boxShadow: "0 32px 80px rgba(0,0,0,0.60)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <div style={{ fontSize: 11, color: "#555", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1 }}>Perfil do Atleta</div>
                  <div style={{ fontFamily: FD, fontSize: 16, fontWeight: 800, color: "#fff", marginTop: 2 }}>Lucas Mendes · Sub 10</div>
                </div>
                <div style={{ background: "rgba(249,115,22,0.15)", border: "1px solid rgba(249,115,22,0.30)", borderRadius: 99, padding: "5px 12px", fontSize: 11, color: "#F97316", fontWeight: 700 }}>
                  ● Temporada {new Date().getFullYear()}
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 20 }}>
                {[
                  { val: "23", label: "Gols", color: "#F97316" },
                  { val: "14", label: "Assist.", color: "#1E3A8A" },
                  { val: "31", label: "Jogos", color: "#22c55e" },
                ].map((s) => (
                  <div key={s.label} style={{ background: "#1a1a1a", borderRadius: 12, padding: "14px 12px", textAlign: "center", border: "1px solid rgba(255,255,255,0.05)" }}>
                    <div style={{ fontFamily: FD, fontSize: 28, fontWeight: 900, color: s.color, lineHeight: 1 }}>{s.val}</div>
                    <div style={{ fontSize: 11, color: "#555", marginTop: 4, fontWeight: 600 }}>{s.label}</div>
                  </div>
                ))}
              </div>
              <div style={{ background: "#1a1a1a", borderRadius: 14, padding: "18px 16px", marginBottom: 14, border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.8 }}>Gols por mês</span>
                  <span style={{ fontSize: 10, color: "#333", fontWeight: 600 }}>{new Date().getFullYear()}</span>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", gap: 6, height: 72 }}>
                  {[
                    { mes: "Mar", gols: 2 },
                    { mes: "Abr", gols: 4 },
                    { mes: "Mai", gols: 3 },
                    { mes: "Jun", gols: 5 },
                    { mes: "Jul", gols: 6 },
                    { mes: "Ago", gols: 3 },
                  ].map((d, i) => (
                    <div key={d.mes} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, height: "100%", justifyContent: "flex-end" }}>
                      <div style={{ fontSize: 9, fontWeight: 700, color: "#F97316" }}>{d.gols}</div>
                      <div style={{ width: "100%", height: `${(d.gols / 6) * 100}%`, background: i === 4 ? "#F97316" : "linear-gradient(to top,#1E3A8A,rgba(30,58,138,0.5))", borderRadius: "4px 4px 2px 2px", minHeight: 8 }} />
                      <div style={{ fontSize: 9, color: "#444", fontWeight: 500 }}>{d.mes}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ background: "#1a1a1a", borderRadius: 14, padding: "16px", border: "1px solid rgba(255,255,255,0.04)" }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: "#555", textTransform: "uppercase", letterSpacing: 0.8, marginBottom: 12 }}>Evolução da temporada</div>
                <svg viewBox="0 0 280 72" style={{ width: "100%", overflow: "visible" }}>
                  <defs>
                    <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#F97316" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[0, 24, 48, 72].map((y) => (
                    <line key={y} x1="0" y1={y} x2="280" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                  ))}
                  <path d="M0,60 L46,48 L93,36 L140,28 L186,20 L233,12 L280,6 L280,72 L0,72 Z" fill="url(#lg)" />
                  <path d="M0,60 L46,48 L93,36 L140,28 L186,20 L233,12 L280,6" fill="none" stroke="#F97316" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  {[[0, 60], [46, 48], [93, 36], [140, 28], [186, 20], [233, 12], [280, 6]].map(([x, y], i) => (
                    <circle key={i} cx={x} cy={y} r={i === 6 ? 5 : 3} fill={i === 6 ? "#F97316" : "#1E3A8A"} stroke="#111" strokeWidth="1.5" />
                  ))}
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="lp-features">
        <div className="lp-features-inner">
          <div className="lp-features-head">
            <h2>
              NOSSA TÁTICA
              <br />
              É BASEADA
              <br />
              NOS PILARES:
            </h2>
            <p>
              Uma plataforma completa para registrar, acompanhar e celebrar cada passo da carreira do seu atleta
              dentro e fora de quadra.
            </p>
          </div>
          <div className="lp-features-grid">
            {[
              { icon: "⚽", color: "#1E3A8A", title: "Gols e assistências", desc: "Você registra após cada jogo. Simples, rápido, em menos de 1 minuto." },
              { icon: "📅", color: "#F97316", title: "Histórico completo", desc: "Todos os jogos, datas e adversários guardados para sempre na plataforma." },
              { icon: "🔗", color: "#0A0A0A", title: "Link exclusivo", desc: "Um link único do seu filho. Manda no WhatsApp e todo mundo vê na hora." },
              { icon: "🏅", color: "#1E3A8A", title: "Posição e categoria", desc: "Goleiro, fixo, ala ou pivô. Sub 7 ao Sub 11. Estatísticas por posição." },
              { icon: "📸", color: "#F97316", title: "Fotos dos jogos", desc: "Coloque as fotos de cada partida. O perfil ganha vida com cada momento." },
              { icon: "📱", color: "#0A0A0A", title: "Funciona em qualquer tela", desc: "Qualquer pessoa com o link vê o perfil. Sem precisar fazer login." },
            ].map((f) => (
              <div key={f.title}>
                <div style={{ width: 48, height: 48, borderRadius: 10, background: f.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, marginBottom: 14 }}>
                  {f.icon}
                </div>
                <div style={{ fontWeight: 700, fontSize: 15, color: "#0A0A0A", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 14, color: "#666", lineHeight: 1.75 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── DARK ATHLETE ── */}
      <section className="lp-athlete">
        <div className="lp-athlete-photo">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stats-atleta.png" alt="Card de estatísticas de um atleta Camisa 10" />
          <div className="lp-athlete-photo-overlay" />
        </div>
        <div className="lp-athlete-text">
          <div className="lp-athlete-badge">⚽ Registro em tempo real</div>
          <h2 className="lp-athlete-h2">
            A CARREIRA
            <br />
            DO SEU FILHO
            <br />
            EM NÚMEROS
          </h2>
          <p className="lp-athlete-p">
            Cada jogo registrado. Cada gol guardado. Acompanhe a evolução do seu atleta temporada após temporada
            com o perfil completo.
          </p>
          <Button href="/cadastro" variant="primary">Criar perfil agora →</Button>
        </div>
      </section>

      {/* ── PRICING ── */}
      <section className="lp-pricing">
        <div className="lp-pricing-inner">
          <h2>
            ESCOLHA O PLANO
            <br />
            DO SEU ATLETA
          </h2>
          <div>
            <p>Menos de R$1,25 por dia. O perfil do seu filho vale mais do que um lanche.</p>
          </div>
          <div className="lp-pricing-grid">
            {/* TORCIDA */}
            <div style={{ background: "#fff", border: "1.5px solid rgba(0,0,0,0.08)", borderRadius: 16, padding: "32px 24px" }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#1E3A8A", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>
                🔵 PLANO TORCIDA
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: FD, fontSize: 56, fontWeight: 900, color: "#0A0A0A", letterSpacing: -3, lineHeight: 1 }}>R$37</span>
                <span style={{ fontSize: 14, color: "#999", marginLeft: 4 }}>/mês</span>
              </div>
              <p style={{ fontSize: 13, color: "#777", marginBottom: 24 }}>Manda o link no grupo da família.</p>
              <div style={{ marginBottom: 28 }}>
                {["Perfil com link exclusivo do atleta", "Foto de perfil do seu filho", "Gols, assistências e defesas por jogo", "Histórico completo de partidas", "Qualquer pessoa vê com o link"].map((item) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13, color: "#444" }}>
                    <div style={{ width: 20, height: 20, background: "#1E3A8A", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                      ✓
                    </div>
                    {item}
                  </div>
                ))}
              </div>
              <Button href="/cadastro" variant="secondary" style={{ width: "100%" }}>Começar com Torcida →</Button>
              <p style={{ fontSize: 11, color: "#aaa", marginTop: 12, textAlign: "center" }}>PIX · Sem contrato · Cancele quando quiser</p>
            </div>

            {/* CRAQUE */}
            <div style={{ background: "#0A0A0A", borderRadius: 16, padding: "32px 24px", position: "relative" }}>
              <div style={{ position: "absolute", top: -13, left: 24, background: "#F97316", color: "#000", fontSize: 10, fontWeight: 800, padding: "5px 16px", borderRadius: 99, letterSpacing: 1.5, textTransform: "uppercase" }}>
                MAIS POPULAR
              </div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#F97316", letterSpacing: 2.5, textTransform: "uppercase", marginBottom: 16 }}>
                🟠 PLANO CRAQUE
              </div>
              <div style={{ marginBottom: 4 }}>
                <span style={{ fontFamily: FD, fontSize: 56, fontWeight: 900, color: "#fff", letterSpacing: -3, lineHeight: 1 }}>R$57</span>
                <span style={{ fontSize: 14, color: "#555", marginLeft: 4 }}>/mês</span>
              </div>
              <p style={{ fontSize: 13, color: "#666", marginBottom: 24 }}>Cada jogo registrado. Cada momento guardado.</p>
              <div style={{ marginBottom: 28 }}>
                {["Tudo do Plano Torcida", "Foto em cada jogo", "Álbum automático da temporada", "Galeria visível no perfil público", "Memória completa da carreira"].map((item, i) => (
                  <div key={item} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12, fontSize: 13, color: i === 0 ? "#555" : "#bbb" }}>
                    <div style={{ width: 20, height: 20, background: "#F97316", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", color: "#000", fontSize: 10, fontWeight: 800, flexShrink: 0 }}>
                      ✓
                    </div>
                    <span style={{ fontStyle: i === 0 ? "italic" : "normal" }}>{item}</span>
                  </div>
                ))}
              </div>
              <Button href="/cadastro" variant="primary" style={{ width: "100%" }}>Garantir Craque — R$57/mês →</Button>
              <p style={{ fontSize: 11, color: "#444", marginTop: 12, textAlign: "center" }}>PIX · Sem contrato · Cancele quando quiser</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="lp-cta">
        <p>Registre a história do seu atleta e compartilhe cada conquista com quem você ama.</p>
        <Button href="/cadastro" variant="primary">Criar perfil agora →</Button>
      </section>

      {/* ── FOOTER ── */}
      <footer className="lp-footer">
        <div className="lp-footer-inner">
          <div className="lp-footer-grid">
            <div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/logo.png" alt="Perfil Camisa 10" style={{ height: 36, marginBottom: 14 }} />
              <p style={{ fontSize: 13, color: "#475569", lineHeight: 1.8, maxWidth: 280 }}>
                O perfil profissional do seu atleta. Escola de futsal com polos em Santana de Parnaíba, Barueri e
                Osasco.
              </p>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#F97316", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>
                Camisa 10 F.C.
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                <a href="https://wa.me/5511947928105" target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>
                  📲 (11) 94792-8105
                </a>
                <Link href="/login" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Entrar na conta</Link>
                <Link href="/cadastro" style={{ color: "#94a3b8", textDecoration: "none", fontSize: 14 }}>Criar perfil</Link>
              </div>
            </div>
            <div>
              <div style={{ fontSize: 11, fontWeight: 800, color: "#F97316", letterSpacing: 2, textTransform: "uppercase", marginBottom: 14 }}>Polos</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {["Santana de Parnaíba", "Barueri — ACERB", "Osasco — Metalclube"].map((p) => (
                  <span key={p} style={{ color: "#94a3b8", fontSize: 14 }}>{p}</span>
                ))}
              </div>
            </div>
          </div>
          <div className="lp-footer-bottom">
            <span style={{ color: "#334155", fontSize: 12 }}>Camisa 10 F.C. · Escola de Futsal</span>
            <span style={{ color: "#334155", fontSize: 12 }}>Todos os direitos reservados · {new Date().getFullYear()}</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
