import Link from "next/link";
import "./transmissao.css";
import { TvEfeitos, TvRelogio, TvVinheta } from "@/components/TvEfeitos";

// Página inicial no conceito "Transmissão ao vivo": o atleta apresentado como
// atração de TV esportiva. Estilos em transmissao.css; efeitos em TvEfeitos.

const LETREIRO = ["210+ atletas", "3 polos", "Sub 7 ao Sub 11", "R$37 por mês", "sem contrato", "Santana de Parnaíba", "Barueri", "Osasco", "venha ser Camisa 10"];

const RECURSOS = [
  { icon: "⚽", cor: "#F97316", titulo: "Gols e assistências", texto: "Você registra após cada jogo. Simples, rápido, em menos de 1 minuto." },
  { icon: "📅", cor: "#2F6BFF", titulo: "Histórico completo", texto: "Todos os jogos, datas e adversários guardados para sempre na plataforma." },
  { icon: "🔗", cor: "#1E3A8A", titulo: "Link exclusivo", texto: "Um link único do seu filho. Manda no WhatsApp e todo mundo vê na hora." },
  { icon: "🏅", cor: "#F97316", titulo: "Posição e categoria", texto: "Goleiro, fixo, ala ou pivô. Sub 7 ao Sub 11. Estatísticas por posição." },
  { icon: "📸", cor: "#2F6BFF", titulo: "Fotos dos jogos", texto: "Coloque as fotos de cada partida. O perfil ganha vida com cada momento." },
  { icon: "📱", cor: "#1E3A8A", titulo: "Em qualquer tela", texto: "Qualquer pessoa com o link vê o perfil. Sem precisar fazer login." },
];

const GOLS_POR_MES = [
  { mes: "Fev", gols: 2 }, { mes: "Mar", gols: 4 }, { mes: "Abr", gols: 3 },
  { mes: "Mai", gols: 5 }, { mes: "Jun", gols: 6 }, { mes: "Jul", gols: 3 },
];

function Botao({ href, children, vidro, pequeno, className = "" }: { href: string; children: React.ReactNode; vidro?: boolean; pequeno?: boolean; className?: string }) {
  return (
    <Link href={href} className={`tv-btn${vidro ? " vidro" : ""}${pequeno ? " pequeno" : ""} ${className}`.trim()}>
      <span>{children}</span>
    </Link>
  );
}

export default function LandingPage() {
  const temporada = new Date().getFullYear();
  return (
    <main className="tv">
      <TvVinheta />
      <TvEfeitos />

      {/* ── TOPO COM SELO AO VIVO ── */}
      <header className="tv-topo">
        <div className="tv-topo-esq">
          <Link href="/" aria-label="Perfil Camisa 10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Perfil Camisa 10" />
          </Link>
          <span className="tv-aovivo"><i /><span>Ao vivo</span></span>
          <TvRelogio />
        </div>
        <nav className="tv-topo-dir">
          <Link href="/login" className="tv-link">Entrar</Link>
          <Botao href="/cadastro" pequeno>Me inscrever →</Botao>
        </nav>
      </header>

      {/* ── ABERTURA: GINÁSIO À NOITE ── */}
      <section className="tv-abertura">
        <div className="tv-holofote h1" aria-hidden="true" />
        <div className="tv-holofote h2" aria-hidden="true" />
        <div className="tv-piso" aria-hidden="true"><div className="tv-piso-plano" /></div>
        <div className="tv-dez" aria-hidden="true">10</div>

        <div className="tv-abertura-texto">
          <div className="tv-etiqueta">Transmissão oficial · Temporada {temporada}</div>
          <h1 className="tv-manchete">
            <span className="placa p1"><span>Seu filho</span></span>
            <span className="placa p2"><span>é o craque</span></span>
            <span className="placa p3"><span>do jogo.</span></span>
          </h1>
          <p className="tv-sub">
            Registre cada gol, cada assistência, cada conquista do seu atleta. Crie o perfil dele agora e
            compartilhe com toda a família. Já são mais de 210 atletas: venha ser Camisa 10!
          </p>
          <div className="tv-acoes">
            <Botao href="/cadastro">Criar perfil agora →</Botao>
            <Botao href="/login" vidro>Já tenho conta</Botao>
          </div>
        </div>

        <div className="tv-palco">
          <div className="tv-monitor">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/hero-atleta.png" alt="Atleta Camisa 10 comemorando conquista" />
            <span className="tv-cam"><i />Câmera 1</span>
          </div>
          <div className="tv-grafico tv-terco">
            <div className="num"><span>10</span></div>
            <div className="nome"><b>Seu filho</b><small>Ala · Camisa 10 F.C.</small></div>
          </div>
          <div className="tv-grafico tv-placarzinho">
            <small>Último jogo</small>
            <b>3 gols</b>
            <span>2 assistências</span>
          </div>
          <div className="tv-grafico tv-categoria"><span>Sub 10</span></div>
        </div>
      </section>

      {/* ── LETREIRO DE LED DE BEIRA DE QUADRA ── */}
      <div className="tv-led" aria-label="210 atletas, 3 polos, Sub 7 ao Sub 11, a partir de R$37 por mês">
        <div className="tv-led-trilho" aria-hidden="true">
          {[...LETREIRO, ...LETREIRO, ...LETREIRO, ...LETREIRO].map((t, i) => <span key={i}>{t} ⚽</span>)}
        </div>
      </div>

      {/* ── PLACAR DO GINÁSIO ── */}
      <section className="tv-secao">
        <div className="tv-placar tv-revela">
          <div className="tv-placar-topo"><span>Camisa 10 F.C.</span><b>Esses são alguns números nossos</b><span>{temporada}</span></div>
          <div className="tv-placar-grade">
            <div className="tv-cel"><b data-contar="210" data-sufixo="+">0</b><span>atletas na escola</span></div>
            <div className="tv-cel"><b data-contar="3">0</b><span>polos ativos</span></div>
            <div className="tv-cel"><b>Sub 7–11</b><span>categorias disputadas</span></div>
            <div className="tv-cel"><b data-contar="37" data-prefixo="R$">R$0</b><span>por mês, sem contrato</span></div>
          </div>
        </div>
        <p className="tv-texto tv-revela" style={{ marginTop: 34, textAlign: "center", marginLeft: "auto", marginRight: "auto" }}>
          O sonho do seu filho <strong style={{ color: "#FF8A1F" }}>merece ser registrado</strong>.
        </p>
      </section>

      {/* ── REPLAY: O PERFIL NA TELA ── */}
      <section className="tv-secao">
        <div className="tv-dupla">
          <div className="tv-revela">
            <div className="tv-etiqueta">Replay da temporada</div>
            <h2 className="tv-titulo">Aprimoramento <em>contínuo</em></h2>
            <p className="tv-texto">Acompanhe a evolução do seu atleta temporada após temporada. Cada registro vira história, cada conquista vira memória.</p>
            <Botao href="/cadastro">Fazer inscrição →</Botao>
          </div>
          <div className="tv-tela tv-revela" style={{ ["--d" as string]: ".15s" }}>
            <div className="tv-tela-dentro">
              <span className="tv-replay"><span>Replay</span></span>
              <div className="tv-perfil-cab"><small>Perfil do atleta · Temporada {temporada}</small><b>Lucas Mendes · Sub 10</b></div>
              <div className="tv-numeros">
                <div style={{ ["--c" as string]: "#FF8A1F" }}><b>23</b><span>Gols</span></div>
                <div style={{ ["--c" as string]: "#2F6BFF" }}><b>14</b><span>Assist.</span></div>
                <div style={{ ["--c" as string]: "#22C55E" }}><b>31</b><span>Jogos</span></div>
              </div>
              <small style={{ fontFamily: "var(--fd)", fontWeight: 800, letterSpacing: ".14em", color: "#8D9AB8", textTransform: "uppercase", fontSize: 13 }}>Gols por mês</small>
              <div className="tv-barras">
                {GOLS_POR_MES.map((m, i) => (
                  <div key={m.mes}>
                    <i style={{ ["--h" as string]: `${(m.gols / 6) * 100}%`, ["--d" as string]: `${0.3 + i * 0.08}s` }} />
                    <small>{m.mes}</small>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ESCALAÇÃO: OS RECURSOS ── */}
      <section className="tv-secao">
        <div className="tv-revela">
          <div className="tv-etiqueta">A escalação</div>
          <h2 className="tv-titulo">Nossa tática é <em>baseada nos pilares</em></h2>
          <p className="tv-texto">Uma plataforma completa para registrar, acompanhar e celebrar cada passo da carreira do seu atleta dentro e fora de quadra.</p>
        </div>
        <div className="tv-cards">
          {RECURSOS.map((r, i) => (
            <div key={r.titulo} className="tv-card tv-revela" style={{ ["--c" as string]: r.cor, ["--d" as string]: `${(i % 3) * 0.1}s` }}>
              <span className="n">{String(i + 1).padStart(2, "0")}</span>
              <div className="ic"><span>{r.icon}</span></div>
              <h3>{r.titulo}</h3>
              <p>{r.texto}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CARREIRA EM NÚMEROS ── */}
      <section className="tv-carreira">
        <div className="tv-carreira-foto">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/stats-atleta.png" alt="Card de estatísticas de um atleta Camisa 10" />
        </div>
        <div className="tv-carreira-texto tv-revela">
          <div className="tv-selo"><span>⚽ Registro em tempo real</span></div>
          <h2 className="tv-titulo">A carreira do seu filho <em>em números</em></h2>
          <p className="tv-texto">Cada jogo registrado. Cada gol guardado. Acompanhe a evolução do seu atleta temporada após temporada com o perfil completo.</p>
          <Botao href="/cadastro">Criar perfil agora →</Botao>
        </div>
      </section>

      {/* ── PLANOS ── */}
      <section className="tv-secao">
        <div className="tv-revela" style={{ textAlign: "center" }}>
          <div className="tv-etiqueta">Escolha o plano</div>
          <h2 className="tv-titulo">Do seu <em>atleta</em></h2>
          <p className="tv-texto" style={{ margin: "0 auto" }}>O perfil do seu filho custa 1 bala por dia, e vale mais do que você pode imaginar.</p>
        </div>
        <div className="tv-planos" style={{ marginLeft: "auto", marginRight: "auto" }}>
          <div className="tv-plano tv-revela">
            <span className="tag"><span>🔵 Plano Torcida</span></span>
            <h3>Torcida</h3>
            <div className="tv-preco"><b>R$37</b><span>/mês</span></div>
            <p className="frase">Manda o link no grupo da família.</p>
            <ul>
              {["Perfil com link exclusivo do atleta", "Foto de perfil do seu filho", "Gols, assistências e defesas por jogo", "Histórico completo de partidas", "Qualquer pessoa vê com o link"].map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Botao href="/cadastro" vidro className="btn-largo">Começar com Torcida →</Botao>
            <small className="rodape">PIX · Sem contrato · Cancele quando quiser</small>
          </div>
          <div className="tv-plano craque tv-revela" style={{ ["--d" as string]: ".12s" }}>
            <span className="tag"><span>🟠 Mais popular</span></span>
            <h3>Craque</h3>
            <div className="tv-preco"><b>R$57</b><span>/mês</span></div>
            <p className="frase">Cada jogo registrado. Cada momento guardado.</p>
            <ul>
              {["Tudo do Plano Torcida", "Foto em cada jogo", "Álbum automático da temporada", "Galeria visível no perfil público", "Memória completa da carreira"].map((item) => <li key={item}>{item}</li>)}
            </ul>
            <Botao href="/cadastro" className="btn-largo">Garantir Craque →</Botao>
            <small className="rodape">PIX · Sem contrato · Cancele quando quiser</small>
          </div>
        </div>
      </section>

      {/* ── CHAMADA FINAL ── */}
      <section className="tv-final">
        <h2 className="tv-titulo tv-revela">Registre a história do seu atleta e compartilhe cada conquista</h2>
        <Botao href="/cadastro">Criar perfil agora →</Botao>
      </section>

      {/* ── RODAPÉ ── */}
      <footer className="tv-rodape">
        <div className="tv-rodape-grade">
          <div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="Perfil Camisa 10" />
            <p style={{ margin: 0, maxWidth: "42ch", lineHeight: 1.7 }}>O perfil profissional do seu atleta. Escola de futsal com polos em Santana de Parnaíba, Barueri e Osasco.</p>
          </div>
          <div>
            <h4>Polos</h4>
            <span style={{ display: "block", padding: "3px 0" }}>Santana de Parnaíba</span>
            <span style={{ display: "block", padding: "3px 0" }}>Barueri · ACERB</span>
            <span style={{ display: "block", padding: "3px 0" }}>Osasco · Metalclube</span>
          </div>
          <div>
            <h4>Camisa 10 F.C.</h4>
            <a href="https://wa.me/5511947928105" target="_blank" rel="noopener noreferrer">📲 (11) 94792-8105</a>
            <Link href="/login">Entrar na conta</Link>
            <Link href="/cadastro">Criar perfil</Link>
            <Link href="/termos">Termos de uso</Link>
          </div>
        </div>
        <div className="tv-rodape-fim">Camisa 10 F.C. · Escola de Futsal · Todos os direitos reservados · {temporada}</div>
      </footer>
    </main>
  );
}
