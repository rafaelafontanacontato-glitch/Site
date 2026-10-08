/* Lista das fotos da página /fotografia/, na ordem em que aparecem.

   Para adicionar uma foto:
   1. Salve o JPG na pasta img/ (uns 1600px no lado maior, leve).
   2. Escreva o nome do arquivo aqui embaixo, entre aspas, seguido de vírgula.
   Pronto. Isso já basta:   "nome-da-foto.jpg",

   Se quiser, dá pra detalhar (w e h são a largura e a altura em pixels e evitam que
   a página "pule" enquanto carrega; alt é a descrição para leitores de tela):
   { src: "nome-da-foto.jpg", w: 1600, h: 1066, alt: { pt: "...", en: "..." } },
*/
window.PHOTOS = [
  { src: "rodeio-touro.jpg", w: 1600, h: 1066,
    alt: { pt: "Peão montado em um touro na arena do rodeio, com o palco e os telões ao fundo",
           en: "A rider on a bull in the rodeo arena, with the stage and screens behind" } },
  { src: "show-palco-azul.jpg", w: 1600, h: 1066,
    alt: { pt: "Show em palco com luzes azuis e laranja, banda ao fundo e plateia de celulares erguidos",
           en: "Concert on a stage with blue and orange lights, the band behind and a crowd holding up phones" } },
  { src: "show-fogo-vertical.jpg", w: 1066, h: 1600,
    alt: { pt: "Cantor no centro do palco entre duas colunas de fogo, com a plateia em primeiro plano",
           en: "Singer at center stage between two columns of fire, with the crowd in the foreground" } },
  { src: "show-banda-vertical.jpg", w: 1066, h: 1600,
    alt: { pt: "Cantor e banda no palco sob treliças de luz azul, vistos por cima da plateia",
           en: "Singer and band on stage under blue light trusses, seen over the crowd" } },
  { src: "show-violao-fumaca.jpg", w: 1600, h: 1066,
    alt: { pt: "Cantor tocando violão no palco, cercado por jatos de fumaça e luzes",
           en: "Singer playing guitar on stage, surrounded by smoke jets and lights" } },
  { src: "rodeio-peao-cruz.jpg", w: 1066, h: 1600,
    alt: { pt: "Homem de olhos fechados segurando uma cruz junto ao rosto, sob luz azul e rosa",
           en: "Man with closed eyes holding a cross to his face under blue and pink light" } },
  { src: "show-palco-luz-quente.jpg", w: 1600, h: 1066,
    alt: { pt: "Palco amplo com banda, cantor ao centro e luzes quentes no alto",
           en: "Wide stage with a band, the singer at center and warm lights overhead" } },
  { src: "show-contraluz-bone.jpg", w: 1600, h: 1066,
    alt: { pt: "Homem de boné visto de costas na plateia, em contraluz, com luzes vermelhas desfocadas",
           en: "Man in a cap seen from behind in the crowd, backlit, with blurred red lights" } },
  { src: "show-cantor-vertical.jpg", w: 1066, h: 1600,
    alt: { pt: "Cantor de chapéu cantando e dançando no palco, com dançarinos atrás",
           en: "Hat-wearing singer performing and dancing on stage, with dancers behind" } },
  { src: "rodeio-plateia-celulares.jpg", w: 1600, h: 1066,
    alt: { pt: "Plateia com celulares filmando a arena, com fumaça e luzes ao fundo",
           en: "Crowd filming the arena with their phones, with smoke and lights behind" } },
  { src: "show-fogo-palco.jpg", w: 1600, h: 1066,
    alt: { pt: "Cantor e banda no palco com chamas de fogo e fumaça",
           en: "Singer and band on stage with flames and smoke" } },
  { src: "show-celular-bokeh.jpg", w: 1600, h: 1066,
    alt: { pt: "Mãos segurando um celular que grava o show, com luzes desfocadas ao fundo",
           en: "Hands holding a phone recording the show, with blurred lights behind" } },
  { src: "rodeio-crianca-grade.jpg", w: 1600, h: 1066,
    alt: { pt: "Criança apoiada na grade da arena, olhando para o rodeio ao lado de duas mulheres",
           en: "A child leaning on the arena fence, watching the rodeo next to two women" } },
];
