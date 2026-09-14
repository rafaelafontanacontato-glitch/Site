# Site da Rafaela Fontana

Site de uma página só (`index.html`), sem framework e sem build: é abrir e editar.
Tudo que não é código está em `assets/`.

## Publicar

Sobe a pasta inteira (`index.html` + `assets/`) pro servidor. Não precisa de
nada instalado.

Pra testar no computador, é só dar um duplo clique no `index.html`.

## Onde mexer em cada coisa

### Trabalhos da home
No HTML, dentro de `<section id="trabalhos">`. Cada trabalho é um `<a class="card">`
com a foto, o título (`.l1`) e o formato (`.l2`). O zigue-zague se organiza sozinho:
os cards alternam de lado conforme a ordem.

Pra ter a prévia em vídeo (aparece no hover no computador, e sozinha quando o card
entra na tela no celular), a `<div class="thumb">` precisa de:

```html
<div class="thumb" data-preview="assets/hover-nome.mp4" data-preview-webm="assets/hover-nome.webm">
```

Sem esses atributos, o card fica só com a foto.

### Páginas de obra
No fim do arquivo tem o objeto `OBRAS`. **Uma obra = uma entrada.** Campo vazio
simplesmente não aparece na página, então dá pra publicar incompleto e completar
depois. A rota é `#/obra/<a-chave-do-objeto>`, e é o que vai no `href` do card.

| campo | pra que serve |
|---|---|
| `titulo`, `ficha` | título grande e a linha de formato/ano/país |
| `status` | selo arredondado (ex.: "Em finalização") |
| `creditos` | lista curta `['Cargo', 'Nome']` — a que fica visível |
| `fichaCompleta` | a ficha inteira, dentro do "+" que abre |
| `sinopse`, `projeto`, `projetoLink` | blocos de texto |
| `selo` | ícone + frase (ex.: seleção de festival ou lab) |
| `fundo` | still que vira o fundo desfocado da página |
| `trailer`, `trailerTipo` | id do YouTube/Vimeo — abre no pop-up |
| `videoCapa` | capa do quadro de vídeo; sem ela, entra o 1º still |
| `stills` | fotos da galeria (a fileira se ajusta a 1, 2, 3 ou 4) |
| `en` | sobrescreve os campos acima na versão em inglês |

**Obra em pós-produção:** deixe `fundo: ''`. Entra sozinho o gif de estrada
noturna (`assets/em-pos.gif`) em preto e branco e desfocado. Quando o filme ficar
pronto, aponte o `fundo` pra um still e o gif sai de cena.

### Idiomas
O botão EN|PT troca o site inteiro. Os textos fixos estão no objeto `TRAD`
(marcados no HTML com `data-i18n`), e cada obra tem seu bloco `en`. O que não
estiver traduzido continua em português em vez de sumir. A escolha fica salva no
navegador de quem visita.

### Showreel
Quatro arquivos, dois por idioma:

- `showreel-loop-pt.mp4` / `-en` — o trecho de 14s que roda de fundo, mudo
- `showreel-pt.mp4` / `-en` — o showreel completo, que abre no play, com som

Trocar é substituir os arquivos. Pra gerar de novo a partir de um master:

```bash
# fundo: 14s a partir de 0:12, sem áudio, cortando a tarja preta do master
ffmpeg -i master.mp4 -ss 12 -t 14 -an \
  -vf "crop=3840:1446:0:358,scale=2560:-2,format=yuv420p" \
  -c:v libx264 -preset slow -crf 23 -movflags +faststart assets/showreel-loop-pt.mp4

# completo, com áudio
ffmpeg -i master.mp4 -vf "scale=1920:-2,format=yuv420p" \
  -c:v libx264 -preset medium -crf 25 -c:a aac -b:a 128k \
  -movflags +faststart assets/showreel-pt.mp4
```

O `crop` muda de vídeo pra vídeo. Pra descobrir o do seu:
`ffmpeg -ss 20 -t 5 -i master.mp4 -vf cropdetect -f null -`

## Detalhes que parecem bug e não são

- **O parallax do showreel** roda no compositor (`animation-timeline`), com um
  fallback em JavaScript pros navegadores que ainda não suportam. A amplitude é
  pequena de propósito: movimento grande transforma qualquer engasgo do scroll em
  tremida visível.
- **O nome no cabeçalho** é `position: fixed` e animado por JS: começa grande e
  centralizado no hero e encolhe até ancorar no canto. Ele só fica clicável
  depois de ancorado — grande, cobriria o menu inteiro.
- **A quebra de mobile é 780px**, e esse número aparece no CSS *e* no JS
  (`MOBILE_BP`). Se mudar um, mude o outro: foi assim que o subtítulo já saiu do
  lugar em tablet.
- **O pop-up de vídeo** tem sempre um link "Assistir no YouTube" visível, e a capa
  do clipe por trás do player. Se o embed for bloqueado (bloqueador de anúncio,
  rede corporativa), ninguém fica preso numa tela preta.
- **`prefers-reduced-motion`** desliga parallax, transições de página e as prévias
  em vídeo pra quem configurou o sistema pra reduzir animação.

## O que ainda falta

- O e-mail do rodapé (`hello@rafaelafontana.com`) precisa ser conferido.
- `index.html` tem ~830 KB, e 738 KB são a geometria da tesoura 3D embutida no
  arquivo. Mover isso pra um `.js` separado e carregar depois faria a primeira
  tela aparecer bem mais rápido.
