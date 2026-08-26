# Camisa 10 FC — Plataforma de Atletas

Plataforma onde pais registram gols, assistências e jogadas de cada partida
do atleta, sobem fotos e têm um perfil compartilhável (sem login) com álbuns
de temporada. Assinatura em dois planos (Torcida R$37 / Craque R$57) via
PIX manual, confirmado por um admin do clube.

## Stack

Next.js 14 (App Router) + TypeScript · Prisma + Postgres · NextAuth
(Credentials) · Vercel Blob (fotos) · Tailwind CSS.

## Rodando localmente

```bash
npm install
cp .env.example .env      # preencha DATABASE_URL, NEXTAUTH_SECRET, etc.
npx prisma migrate dev    # cria as tabelas
npm run dev
```

## Deploy — passo a passo

1. **GitHub**: crie um repositório vazio em github.com/new (ex:
   `mazzeoia/camisa10-atletas`), depois:
   ```bash
   git init
   git add .
   git commit -m "primeira versão da plataforma de atletas"
   git branch -M main
   git remote add origin https://github.com/mazzeoia/camisa10-atletas.git
   git push -u origin main
   ```

2. **Vercel**: em vercel.com → *Add New* → *Project* → importe esse
   repositório do GitHub. O deploy roda automático a cada push na `main`.

3. **Banco de dados**: no dashboard do projeto na Vercel → aba *Storage* →
   *Create Database* → Postgres. Isso já preenche a `DATABASE_URL`
   automaticamente nas variáveis de ambiente do projeto.

4. **Fotos (Vercel Blob)**: mesma aba *Storage* → *Create Database* → Blob.
   Preenche `BLOB_READ_WRITE_TOKEN` automaticamente.

5. **Variáveis de ambiente** (Project Settings → Environment Variables),
   além das automáticas acima:
   - `NEXTAUTH_SECRET` — gere com `openssl rand -base64 32`
   - `NEXTAUTH_URL` — a URL de produção (ex: `https://camisa10-atletas.vercel.app`)
   - `ADMIN_EMAIL` — email de quem confirma pagamentos em `/admin`
   - `PIX_KEY` — chave PIX do clube (copia-e-cola)
   - `PIX_NOME_BENEFICIARIO` — nome que aparece pro pai confirmar o beneficiário

6. **Migrations em produção**: depois do primeiro deploy, rode uma vez
   (com a `DATABASE_URL` de produção no `.env` local, temporariamente):
   ```bash
   npx prisma migrate deploy
   ```

## Pendência conhecida

`npm audit` acusa vulnerabilidades no Next.js que só são corrigidas
migrando pro Next 16 — o que exige trocar NextAuth v4 por Auth.js v5
(mudança grande de API). Ficou de fora do escopo inicial; considerar essa
migração numa próxima iteração, sem pressa (não é um app público de alto
tráfego).

## Fluxo de uso

- `/cadastro` — pai cria a conta
- `/dashboard/atleta/novo` — cadastra o atleta
- `/dashboard/atleta/[id]` — registra partidas (gols, assistências, fotos)
- `/assinatura/[athleteId]` — escolhe plano e faz o PIX
- `/admin` — (só o `ADMIN_EMAIL`) confirma pagamentos pendentes
- `/atleta/[slug]` — perfil público, sem login, pra compartilhar com a família
