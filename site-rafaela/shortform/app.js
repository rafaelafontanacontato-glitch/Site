import { portfolio, categories } from "./portfolio.js?v=11";

const copy = {
  en: {
    skip: "Skip to work",
    homeLabel: "Rafaela Fontana, top",
    primaryNav: "Primary navigation",
    heroPhones: "Featured vertical edits",
    filterLabel: "Filter by format",
    servicesLabel: "Services",
    closeProject: "Close",
    prev: "Previous video",
    next: "Next video",
    navVertical: "Vertical",
    navWide: "Wide",
    navAbout: "About",
    navContact: "Contact",
    heroEyebrow: "Video editor · Short-form &amp; YouTube",
    heroLede:
      "Edits built for the scroll. Reels, TikTok and Shorts with pace, captions and motion that hold attention past the first second.",
    heroCta: "Watch the verticals",
    marquee: ["Reels", "TikTok", "Shorts", "YouTube", "Captions", "Motion", "B-roll", "Pacing"],
    verticalEyebrow: "9:16 · Vertical",
    verticalTitle: "Made for <em>the feed.</em>",
    verticalNote: "Click any clip to watch it with sound.",
    all: "All",
    wideEyebrow: "16:9 · Wide",
    wideTitle: "Brand films, <em>YouTube &amp; VJ.</em>",
    wideNote: "The horizontal side of the work.",
    aboutEyebrow: "About",
    aboutTitle: "Editing with an <em>ear for pace.</em>",
    aboutCopy:
      "I’m Rafaela, a video editor working across Reels, TikTok, Shorts and YouTube. I come from film editing, so every cut starts with rhythm: what to show, how long to hold it and when to let it go.",
    service1: "Reels, TikTok &amp; Shorts",
    service2: "YouTube videos",
    service3: "Motion &amp; captions",
    service4: "Pacing &amp; storytelling",
    cinemaLink: "See my film work ↗",
    contactEyebrow: "Available for new projects",
    contactTitle: "Got footage? <em>Let’s cut it.</em>",
    watchYoutube: "Watch on YouTube ↗",
    playLabel: "Play {title}",
  },
  pt: {
    skip: "Pular para os trabalhos",
    homeLabel: "Rafaela Fontana, início",
    primaryNav: "Navegação principal",
    heroPhones: "Vídeos verticais em destaque",
    filterLabel: "Filtrar por formato",
    servicesLabel: "Serviços",
    closeProject: "Fechar",
    prev: "Vídeo anterior",
    next: "Próximo vídeo",
    navVertical: "Vertical",
    navWide: "Horizontal",
    navAbout: "Sobre",
    navContact: "Contato",
    heroEyebrow: "Editora de vídeo · Conteúdo curto &amp; YouTube",
    heroLede:
      "Cortes feitos pro scroll. Reels, TikTok e Shorts com ritmo, legenda e motion que seguram a atenção depois do primeiro segundo.",
    heroCta: "Ver os verticais",
    marquee: ["Reels", "TikTok", "Shorts", "YouTube", "Legendas", "Motion", "B-roll", "Ritmo"],
    verticalEyebrow: "9:16 · Vertical",
    verticalTitle: "Feito pro <em>feed.</em>",
    verticalNote: "Clica em qualquer vídeo pra assistir com som.",
    all: "Todos",
    wideEyebrow: "16:9 · Horizontal",
    wideTitle: "Marca, <em>YouTube &amp; VJ.</em>",
    wideNote: "O lado horizontal do trabalho.",
    aboutEyebrow: "Sobre",
    aboutTitle: "Edição com <em>ouvido pro ritmo.</em>",
    aboutCopy:
      "Sou a Rafaela, editora de vídeo pra Reels, TikTok, Shorts e YouTube. Venho da montagem de cinema, então todo corte começa pelo ritmo: o que mostrar, quanto tempo segurar e a hora de soltar.",
    service1: "Reels, TikTok &amp; Shorts",
    service2: "Vídeos pro YouTube",
    service3: "Motion &amp; legendas",
    service4: "Ritmo &amp; narrativa",
    cinemaLink: "Ver meu trabalho em cinema ↗",
    contactEyebrow: "Disponível para novos projetos",
    contactTitle: "Tem material? <em>Bora cortar.</em>",
    watchYoutube: "Assistir no YouTube ↗",
    playLabel: "Assistir {title}",
  },
};

// Featured on the hero phones, in order (left, center, right).
const HERO_IDS = [
  "b-roll-driven-motion",
  "real-estate-luxury-lake-home-broll",
  "talking-head-customer-testimonial",
];

const $ = (selector) => document.querySelector(selector);
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const saveData = Boolean(navigator.connection?.saveData);
const canAutoplay = () => !reduceMotion.matches && !saveData;

let language;
try {
  language = localStorage.getItem("rafaela-shortform-language");
} catch {
  language = null;
}
language = language === "pt" ? "pt" : "en";

const t = (key) => copy[language][key] ?? copy.en[key] ?? "";
const localized = (value) => value?.[language] || value?.en || "";
const esc = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
const pad = (n) => String(n).padStart(2, "0");
const time = (s) => (Number.isFinite(s) ? `${Math.floor(s / 60)}:${pad(Math.round(s % 60))}` : "");
const isVertical = (p) => p.height > p.width;
const posterOf = (p) => p.poster || (p.youtubeId ? `https://i.ytimg.com/vi/${encodeURIComponent(p.youtubeId)}/hqdefault.jpg` : "");
const categoryTitle = (p) =>
  localized(categories.find((c) => c.id === p.categoryId)?.title) || localized(p.category);

const verticals = portfolio.filter(isVertical);
const wides = portfolio.filter((p) => !isVertical(p));
const verticalCategories = categories.filter((c) => verticals.some((p) => p.categoryId === c.id));
let activeFilter = "all";

/* ---------- previews that play when visible ---------- */
const previewObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      const card = entry.target;
      if (entry.isIntersecting && canAutoplay()) playPreview(card);
      else pausePreview(card);
    });
  },
  { threshold: 0.55 },
);

function attachPreview(card, project) {
  if (!project.preview) return;
  card.dataset.preview = project.preview;
  previewObserver.observe(card);
  card.addEventListener("pointerenter", () => playPreview(card));
  card.addEventListener("pointerleave", () => {
    if (!canAutoplay()) pausePreview(card);
  });
}

function playPreview(card) {
  if (!card.dataset.preview || document.hidden) return;
  let video = card.querySelector("video");
  if (!video) {
    video = document.createElement("video");
    video.muted = true;
    video.loop = true;
    video.playsInline = true;
    video.setAttribute("aria-hidden", "true");
    video.preload = "auto";
    video.src = card.dataset.preview;
    video.addEventListener("playing", () => card.classList.add("is-playing"));
    (card.querySelector(".w-frame, .v-media") || card).append(video);
  }
  video.play().catch(() => {});
}

function pausePreview(card) {
  const video = card.querySelector("video");
  if (!video) return;
  video.pause();
  card.classList.remove("is-playing");
}

/* ---------- hero phones ---------- */
function renderHero() {
  const wrap = $("[data-hero-phones]");
  wrap.replaceChildren();
  HERO_IDS.map((id) => portfolio.find((p) => p.id === id))
    .filter(Boolean)
    .forEach((project) => {
      const phone = document.createElement("button");
      phone.type = "button";
      phone.className = "phone";
      phone.setAttribute("aria-label", t("playLabel").replace("{title}", localized(project.title)));
      phone.innerHTML = `<span class="phone-screen"><img src="${esc(project.poster)}" alt="" decoding="async"></span>
        <span class="phone-tag">${esc(categoryTitle(project))}</span>`;
      const video = document.createElement("video");
      Object.assign(video, { muted: true, loop: true, playsInline: true, autoplay: canAutoplay(), preload: "auto" });
      video.setAttribute("aria-hidden", "true");
      video.src = project.preview;
      phone.querySelector(".phone-screen").append(video);
      if (canAutoplay()) video.play().catch(() => {});
      phone.addEventListener("click", () => openPlayer(verticals, verticals.indexOf(project), phone));
      wrap.append(phone);
    });
}

/* ---------- marquee ---------- */
function renderMarquee() {
  const words = t("marquee");
  const half = words.map((w) => `<span>${esc(w)}</span>`).join("");
  $("[data-marquee]").innerHTML = half + half;
}

/* ---------- vertical grid ---------- */
function filteredVerticals() {
  return activeFilter === "all" ? verticals : verticals.filter((p) => p.categoryId === activeFilter);
}

function renderChips() {
  const wrap = $("[data-chips]");
  wrap.replaceChildren();
  const options = [{ id: "all", label: t("all"), count: verticals.length }].concat(
    verticalCategories.map((c) => ({
      id: c.id,
      label: localized(c.title),
      count: verticals.filter((p) => p.categoryId === c.id).length,
    })),
  );
  options.forEach((option) => {
    const chip = document.createElement("button");
    chip.type = "button";
    chip.className = "chip";
    chip.setAttribute("aria-pressed", String(option.id === activeFilter));
    chip.innerHTML = `${esc(option.label)} <sup>${pad(option.count)}</sup>`;
    chip.addEventListener("click", () => {
      if (activeFilter === option.id) return;
      activeFilter = option.id;
      renderChips();
      renderVerticals();
      wrap.querySelector('[aria-pressed="true"]')?.focus();
    });
    wrap.append(chip);
  });
}

function renderVerticals() {
  const grid = $("[data-vertical-grid]");
  grid.querySelectorAll(".v-card").forEach((c) => previewObserver.unobserve(c));
  grid.replaceChildren();
  const list = filteredVerticals();
  list.forEach((project, index) => {
    const li = document.createElement("li");
    li.style.setProperty("--i", index);
    const card = document.createElement("button");
    card.type = "button";
    card.className = "v-card";
    card.setAttribute("aria-label", t("playLabel").replace("{title}", localized(project.title)));
    card.innerHTML = `
      <span class="v-media"><img src="${esc(project.poster)}" alt="" loading="lazy" decoding="async">
        <span class="v-top" aria-hidden="true"><span>${pad(index + 1)}</span><span class="v-dur"><i class="dot"></i>${time(project.duration)}</span></span>
        <span class="v-play" aria-hidden="true">▶</span></span>
      <span class="v-bottom" aria-hidden="true"><strong>${esc(localized(project.title))}</strong><span>${esc(categoryTitle(project))}</span></span>`;
    card.addEventListener("click", () => openPlayer(list, index, card));
    attachPreview(card, project);
    li.append(card);
    grid.append(li);
  });
}

/* ---------- wide grid ---------- */
function renderWide() {
  const grid = $("[data-wide-grid]");
  grid.querySelectorAll(".w-card").forEach((c) => previewObserver.unobserve(c));
  grid.replaceChildren();
  wides.forEach((project, index) => {
    const li = document.createElement("li");
    const card = document.createElement("button");
    card.type = "button";
    card.className = "w-card";
    card.setAttribute("aria-label", t("playLabel").replace("{title}", localized(project.title)));
    card.innerHTML = `
      <span class="w-frame"><img src="${esc(posterOf(project))}" alt="" loading="lazy" decoding="async"><span class="v-play" aria-hidden="true">▶</span></span>
      <span class="w-caption" aria-hidden="true"><span class="w-index">${pad(index + 1)}</span><strong>${esc(localized(project.title))}</strong><span>${esc(categoryTitle(project))}${project.duration ? ` · ${time(project.duration)}` : ""}</span></span>`;
    card.addEventListener("click", () => openPlayer(wides, index, card));
    attachPreview(card, project);
    li.append(card);
    grid.append(li);
  });
}

/* ---------- player ---------- */
const dialog = $("[data-player]");
const media = $("[data-player-media]");
const prevButton = $("[data-player-prev]");
const nextButton = $("[data-player-next]");
let playlist = [];
let current = 0;
let lastTrigger = null;

function clearMedia() {
  const video = media.querySelector("video");
  if (video) {
    video.pause();
    video.removeAttribute("src");
    video.load();
  }
  media.replaceChildren();
  media.classList.remove("yt");
}

function showCurrent() {
  clearMedia();
  const project = playlist[current];
  if (project.youtubeId) {
    const start = Math.max(0, Math.floor(project.startSeconds || 0));
    const frame = document.createElement("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(project.youtubeId)}?autoplay=1&rel=0&start=${start}`;
    frame.title = localized(project.title);
    frame.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    const link = document.createElement("a");
    link.className = "yt-link";
    link.href = `https://www.youtube.com/watch?v=${encodeURIComponent(project.youtubeId)}&t=${start}s`;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = t("watchYoutube");
    media.classList.add("yt");
    media.append(frame, link);
  } else {
    const video = document.createElement("video");
    Object.assign(video, {
      src: project.video,
      poster: project.poster || "",
      controls: true,
      playsInline: true,
      loop: Boolean(project.loop),
      preload: "auto",
    });
    video.setAttribute("aria-label", localized(project.title));
    media.append(video);
    video.play().catch(() => {});
  }
  dialog.classList.toggle("is-portrait", isVertical(project));
  dialog.classList.toggle("is-landscape", !isVertical(project));
  $("[data-player-counter]").innerHTML = `<span class="label-index">${pad(current + 1)}</span> / ${pad(playlist.length)}`;
  $("[data-player-category]").textContent = categoryTitle(project);
  $("[data-player-title]").textContent = localized(project.title);
  prevButton.hidden = playlist.length < 2;
  nextButton.hidden = playlist.length < 2;
}

function openPlayer(list, index, trigger) {
  playlist = list;
  current = index;
  lastTrigger = trigger;
  document.querySelectorAll(".is-playing video").forEach((v) => v.pause());
  showCurrent();
  if (!dialog.open) dialog.showModal();
  document.body.classList.add("player-open");
  $("[data-player-close]").focus();
}

function step(delta) {
  if (playlist.length < 2) return;
  current = (current + delta + playlist.length) % playlist.length;
  showCurrent();
}

prevButton.addEventListener("click", () => step(-1));
nextButton.addEventListener("click", () => step(1));
$("[data-player-close]").addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  if (event.target === dialog || event.target === dialog.firstElementChild) dialog.close();
});
dialog.addEventListener("keydown", (event) => {
  if (event.target.closest?.("video") && (event.key === "ArrowLeft" || event.key === "ArrowRight")) return;
  if (event.key === "ArrowRight") step(1);
  if (event.key === "ArrowLeft") step(-1);
});
let touchX = null;
media.addEventListener("touchstart", (e) => (touchX = e.touches[0].clientX), { passive: true });
media.addEventListener("touchend", (e) => {
  if (touchX === null) return;
  const dx = e.changedTouches[0].clientX - touchX;
  if (Math.abs(dx) > 60) step(dx < 0 ? 1 : -1);
  touchX = null;
});
dialog.addEventListener("close", () => {
  clearMedia();
  document.body.classList.remove("player-open");
  lastTrigger?.focus({ preventScroll: true });
  lastTrigger = null;
  document.querySelectorAll(".v-card, .w-card").forEach((card) => {
    const r = card.getBoundingClientRect();
    if (canAutoplay() && r.top < innerHeight && r.bottom > 0) playPreview(card);
  });
});

document.addEventListener("visibilitychange", () => {
  if (document.hidden) document.querySelectorAll("video").forEach((v) => v.pause());
  else if (canAutoplay()) document.querySelectorAll(".phone video").forEach((v) => v.play().catch(() => {}));
});

/* ---------- language ---------- */
function setLanguage(next) {
  language = next === "pt" ? "pt" : "en";
  try {
    localStorage.setItem("rafaela-shortform-language", language);
  } catch {
    /* storage unavailable */
  }
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.title = language === "pt" ? "Rafaela Fontana · Editora de vídeo" : "Rafaela Fontana · Video Editor";
  document.querySelectorAll("[data-i18n]").forEach((node) => (node.innerHTML = t(node.dataset.i18n)));
  document.querySelectorAll("[data-i18n-aria]").forEach((node) => node.setAttribute("aria-label", t(node.dataset.i18nAria)));
  const toggle = $("[data-language-toggle]");
  toggle.classList.toggle("is-pt", language === "pt");
  toggle.setAttribute("aria-label", language === "pt" ? "Switch to English" : "Mudar para português");
  renderMarquee();
  renderChips();
  renderVerticals();
  renderWide();
  renderHero();
}

$("[data-language-toggle]").addEventListener("click", () => setLanguage(language === "en" ? "pt" : "en"));
$("[data-year]").textContent = new Date().getFullYear();
setLanguage(language);

const header = $("[data-header]");
const updateHeader = () => header.classList.toggle("is-scrolled", window.scrollY > 20);
window.addEventListener("scroll", updateHeader, { passive: true });
updateHeader();
