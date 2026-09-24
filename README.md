# Nosso livrinho 💌

Site estático (HTML, CSS e JavaScript puro). Não precisa instalar nada nem rodar build.

## Arquivos

- `index.html`: a estrutura da página
- `style.css`: todo o visual
- `frases.js`: as 365 frases (uma por dia)
- `app.js`: o livro, as animações e o salvamento
- `config.js`: onde você cola as chaves do Supabase
- `supabase.sql`: script que cria o banco e a pasta de fotos

## 1. Criar o banco (Supabase, grátis)

1. Crie uma conta em supabase.com e um projeto novo.
2. No projeto, abra **SQL Editor > New query**, cole todo o conteúdo de `supabase.sql` e clique em **Run**.
3. Abra **Project Settings > API** e copie a **Project URL** e a chave **anon** (ou **publishable**).
4. Cole as duas em `config.js`.

## 2. Testar no VS Code

Instale a extensão **Live Server**, clique com o botão direito em `index.html` e escolha **Open with Live Server**.

## 3. Publicar na Vercel

**Pelo site:** suba a pasta para um repositório no GitHub, entre em vercel.com, clique em **Add New > Project**, importe o repositório e clique em **Deploy** (não precisa mudar nenhuma configuração).

**Pelo terminal:** dentro da pasta, rode `npx vercel` e depois `npx vercel --prod`.

## 4. Configurar a surpresa (antes de mandar pra ela)

Abra o seu site uma vez com `?autor` no final do endereço, por exemplo `https://seu-site.vercel.app/?autor`.
O aparelho fica lembrado como seu. Depois, abra o livro e **segure por 1 segundo a etiqueta "este livrinho pertence a"**:
a Área do autor abre. Nos aparelhos dela isso não faz nada. Lá você coloca:

- o seu nome e a data em que começaram a namorar;
- o **Dia 1 do livrinho** (o dia em que você vai entregar; a surpresa abre 364 dias depois);
- a carta da surpresa e, se quiser, uma foto. O botão **Ver a surpresa** mostra a animação.

Para tirar o modo autor de um aparelho, abra o site com `?sair` no final.

Mande pra ela o endereço **sem** o `?autor`.

## 5. Notificações no seu celular (ntfy)

Você recebe um aviso quando ela abre o livrinho (no máximo 1 vez a cada 30 minutos), cola uma foto (a foto vem junto),
escreve ou realiza um desejo, anota um lugar, marca que vocês foram e quando ela abre a surpresa.

1. Instale o app **ntfy** (Android ou iPhone).
2. Toque em **+** (Subscribe to topic) e digite o tópico que está em `config.js`: **livrinho-kemelly-q3q7z41etn**
3. Para testar, abra o site numa aba anônima **sem** o `?autor` e escreva um desejo.

O que você faz no seu aparelho de autor não gera notificação. Para trocar o tópico ou desligar, edite `ntfyTopico` em `config.js`.

## Bom saber

- Qualquer pessoa com o link consegue ver e editar o livrinho, então compartilhe só com ela.
- A carta fica guardada no banco e o site só a mostra no dia 365, mas não é um cofre: alguém com conhecimento técnico conseguiria lê-la antes.
- O dia é contado pelo relógio do aparelho.
- Para trocar ou acrescentar frases, edite `frases.js` (mantenha 365).
