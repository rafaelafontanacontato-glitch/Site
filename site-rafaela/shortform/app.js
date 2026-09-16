import { portfolio } from "./portfolio.js?v=1";

const copy = {
  en: {
    skip: "Skip to work",
    homeLabel: "Rafaela Fontana, top",
    primaryNav: "Primary navigation",
    computerLabel: "Interactive 3D retro computer",
    scrollLabel: "Scroll to work",
    reelLabel: "Selected video work",
    carouselLabel: "Video carousel",
    previousProject: "Previous project",
    nextProject: "Next project",
    projectProgress: "Project progress",
    positioning: "Positioning",
    servicesLabel: "Services",
    modelCredit: "3D model credit",
    modelCreditText:
      '“PS1 Style Retro Computer Station – Low Poly” by <a href="https://sketchfab.com/alexself" target="_blank" rel="noopener">alexself</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.',
    navWork: "Work",
    navAbout: "About",
    navContact: "Contact",
    heroEyebrow: "Independent video editor",
    heroRole: "Video editor",
    scroll: "See selected work",
    workEyebrow: "Selected archive",
    workTitle: "The edits.",
    workNote: "Short-form, YouTube, and social.",
    workEmpty: "The selected archive is being prepared.",
    manifesto:
      "Video editor for YouTube, short-form and everything in between.",
    aboutEyebrow: "About",
    aboutTitle: "Editing with an ear for pace.",
    aboutCopy:
      "I’m Rafaela, a video editor working across YouTube, Reels, TikTok, Shorts and social content. I shape footage into clear, engaging edits that feel natural to watch.",
    service1: "Reels, TikTok & Shorts",
    service2: "YouTube videos",
    service3: "Motion & captions",
    service4: "Pacing & storytelling",
    contactEyebrow: "Available for selected projects",
    contactTitle: "Have a project<br>in mind?",
  },
  pt: {
    skip: "Pular para os trabalhos",
    homeLabel: "Rafaela Fontana, início",
    primaryNav: "Navegação principal",
    computerLabel: "Computador retrô 3D interativo",
    scrollLabel: "Ir para os trabalhos",
    reelLabel: "Trabalhos em vídeo selecionados",
    carouselLabel: "Carrossel de vídeos",
    previousProject: "Projeto anterior",
    nextProject: "Próximo projeto",
    projectProgress: "Progresso dos projetos",
    positioning: "Posicionamento",
    servicesLabel: "Serviços",
    modelCredit: "Crédito do modelo 3D",
    modelCreditText:
      '“PS1 Style Retro Computer Station – Low Poly” por <a href="https://sketchfab.com/alexself" target="_blank" rel="noopener">alexself</a>, licenciado sob <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.',
    navWork: "Trabalhos",
    navAbout: "Sobre",
    navContact: "Contato",
    heroEyebrow: "Editora de vídeo independente",
    heroRole: "Editora de vídeo",
    scroll: "Ver trabalhos selecionados",
    workEyebrow: "Arquivo selecionado",
    workTitle: "Os cortes.",
    workNote: "Conteúdo curto, YouTube e social.",
    workEmpty: "O arquivo selecionado está sendo preparado.",
    manifesto:
      "Editora de vídeo para YouTube, conteúdo curto e tudo entre uma coisa e outra.",
    aboutEyebrow: "Sobre",
    aboutTitle: "Edição com ouvido para o ritmo.",
    aboutCopy:
      "Sou Rafaela, editora de vídeo para YouTube, Reels, TikTok, Shorts e redes sociais. Transformo material bruto em edições claras, envolventes e gostosas de assistir.",
    service1: "Reels, TikTok & Shorts",
    service2: "Vídeos para YouTube",
    service3: "Motion & legendas",
    service4: "Ritmo & narrativa",
    contactEyebrow: "Disponível para projetos selecionados",
    contactTitle: "Tem um projeto<br>em mente?",
  },
};

let language;
try {
  language = localStorage.getItem("rafaela-shortform-language");
} catch {
  language = null;
}
language = language === "pt" ? "pt" : "en";
let activeIndex = 0,
  reelReady = false,
  skipSwipe = false;
const reel = document.querySelector("[data-reel]");
const viewport = document.querySelector("[data-reel-viewport]");
const track = document.querySelector("[data-reel-track]");
const empty = document.querySelector("[data-reel-empty]");
const count = document.querySelector("[data-reel-count]");
const category = document.querySelector("[data-reel-category]");
const caption = document.querySelector("[data-reel-caption]");
const progress = document.querySelector("[data-reel-progress]");
const progressBar = progress.closest('[role="progressbar"]');
const previous = document.querySelector("[data-reel-prev]");
const next = document.querySelector("[data-reel-next]");
const localized = (value) => value?.[language] || value?.en || "";
const pad = (value) => String(value).padStart(2, "0");
const escapeHtml = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        char
      ],
  );

function stopAndUnload(video) {
  video.pause();
  if (video.getAttribute("src")) {
    video.removeAttribute("src");
    video.load();
  }
}
function renderSlides() {
  track.querySelectorAll("video").forEach(stopAndUnload);
  track.replaceChildren();
  empty.hidden = portfolio.length > 0;
  previous.disabled = next.disabled = portfolio.length < 2;
  portfolio.forEach((item, index) => {
    const slide = document.createElement("article");
    slide.className = "reel-slide";
    slide.dataset.index = index;
    slide.classList.toggle("is-landscape", item.width > item.height);
    const video = document.createElement("video");
    video.className = "project-video";
    video.controls = true;
    video.playsInline = true;
    video.preload = "none";
    video.dataset.poster = item.poster || "";
    video.dataset.video = item.video;
    video.setAttribute("aria-label", localized(item.title));
    const info = document.createElement("div");
    info.className = "slide-info";
    info.innerHTML = `<p>${pad(index + 1)} <span>—</span> ${escapeHtml(localized(item.title))}</p><small>${escapeHtml(item.client || "")}${item.client && item.year ? " / " : ""}${escapeHtml(item.year || "")}</small>`;
    slide.append(video, info);
    track.append(slide);
  });
  updateReel();
}
function updateReel(shouldFocus = false) {
  if (!portfolio.length) {
    count.textContent = "00 / 00";
    category.textContent = "—";
    caption.textContent = "";
    return;
  }
  activeIndex = (activeIndex + portfolio.length) % portfolio.length;
  const slides = [...track.children];
  slides.forEach((slide, index) => {
    const active = index === activeIndex;
    const midpoint = Math.floor(portfolio.length / 2);
    const offset =
      ((index - activeIndex + portfolio.length + midpoint) % portfolio.length) -
      midpoint;
    slide.style.setProperty("--offset", offset);
    slide.style.setProperty("--slide-opacity", active ? 1 : 0.37);
    slide.style.setProperty("--slide-scale", active ? 1 : 0.92);
    slide.classList.toggle("is-active", active);
    slide.setAttribute("aria-hidden", String(!active));
    slide.inert = !active;
    const video = slide.querySelector("video");
    video.tabIndex = active ? 0 : -1;
    video.controls = active;
    if (Math.abs(offset) <= 1 && video.dataset.poster)
      video.poster = video.dataset.poster;
    else video.removeAttribute("poster");
    if (active && reelReady && !video.getAttribute("src"))
      video.src = video.dataset.video;
    if (!active) stopAndUnload(video);
  });
  const item = portfolio[activeIndex];
  count.textContent = `${pad(activeIndex + 1)} / ${pad(portfolio.length)}`;
  category.textContent = localized(item.category);
  caption.textContent = localized(item.description);
  progress.style.setProperty(
    "--progress",
    `${((activeIndex + 1) / portfolio.length) * 100}%`,
  );
  progressBar.setAttribute("aria-valuemax", String(portfolio.length));
  progressBar.setAttribute("aria-valuenow", String(activeIndex + 1));
  if (shouldFocus)
    slides[activeIndex].querySelector("video").focus({ preventScroll: true });
}
const move = (direction) => {
  if (portfolio.length > 1) {
    activeIndex += direction;
    updateReel();
  }
};
previous.addEventListener("click", () => move(-1));
next.addEventListener("click", () => move(1));
viewport.addEventListener("keydown", (event) => {
  if (event.target !== viewport || !portfolio.length) return;
  if (event.key === "ArrowLeft") {
    event.preventDefault();
    move(-1);
  }
  if (event.key === "ArrowRight") {
    event.preventDefault();
    move(1);
  }
});
let swipeStart = null,
  swipeY = 0,
  suppressVideoClick = false;
viewport.addEventListener("pointerdown", (event) => {
  const video = event.target.closest("video");
  skipSwipe = Boolean(
    video && event.clientY > video.getBoundingClientRect().bottom - 60,
  );
  swipeStart = event.clientX;
  swipeY = event.clientY;
});
viewport.addEventListener("pointercancel", () => {
  swipeStart = null;
});
viewport.addEventListener("pointerup", (event) => {
  if (skipSwipe || swipeStart === null) return;
  const delta = event.clientX - swipeStart,
    vertical = Math.abs(event.clientY - swipeY);
  swipeStart = null;
  if (Math.abs(delta) > 42 && Math.abs(delta) > vertical * 1.3) {
    suppressVideoClick = true;
    move(delta > 0 ? -1 : 1);
    setTimeout(() => {
      suppressVideoClick = false;
    }, 0);
  }
});
viewport.addEventListener(
  "click",
  (event) => {
    if (suppressVideoClick) {
      event.preventDefault();
      event.stopPropagation();
    }
  },
  true,
);
new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      reelReady = true;
      updateReel();
    } else track.querySelectorAll("video").forEach((video) => video.pause());
  },
  { rootMargin: "240px 0px", threshold: 0.01 },
).observe(reel);
new IntersectionObserver(
  ([entry]) => {
    if (!entry.isIntersecting)
      track.querySelectorAll("video").forEach((video) => video.pause());
  },
  { threshold: 0 },
).observe(viewport);
document.addEventListener("visibilitychange", () => {
  if (document.hidden)
    track.querySelectorAll("video").forEach((video) => video.pause());
});

function setLanguage(nextLanguage) {
  language = nextLanguage === "pt" ? "pt" : "en";
  try {
    localStorage.setItem("rafaela-shortform-language", language);
  } catch {
    /* storage may be unavailable */
  }
  document.documentElement.lang = language === "pt" ? "pt-BR" : "en";
  document.title =
    language === "pt"
      ? "Rafaela Fontana — Editora de vídeo"
      : "Rafaela Fontana — Video Editor";
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.innerHTML = copy[language][node.dataset.i18n] || "";
  });
  document
    .querySelectorAll("[data-i18n-aria]")
    .forEach((node) =>
      node.setAttribute(
        "aria-label",
        copy[language][node.dataset.i18nAria] || "",
      ),
    );
  const toggle = document.querySelector("[data-language-toggle]");
  toggle.classList.toggle("is-pt", language === "pt");
  toggle.setAttribute(
    "aria-label",
    language === "pt" ? "Switch to English" : "Mudar para português",
  );
  renderSlides();
}
document
  .querySelector("[data-language-toggle]")
  .addEventListener("click", () =>
    setLanguage(language === "en" ? "pt" : "en"),
  );
document.querySelector("[data-year]").textContent = new Date().getFullYear();
setLanguage(language);
const header = document.querySelector("[data-header]");
const darkSections = [...document.querySelectorAll(".work-section,.contact")];
const updateHeader = () => {
  const y = window.scrollY + 70;
  header.classList.toggle("is-scrolled", window.scrollY > 20);
  header.classList.toggle(
    "is-dark",
    darkSections.some(
      (section) =>
        y >= section.offsetTop && y < section.offsetTop + section.offsetHeight,
    ),
  );
};
window.addEventListener("scroll", updateHeader, { passive: true });
window.addEventListener("resize", updateHeader, { passive: true });
updateHeader();
const launchHero = () =>
  import("./hero.js?v=1").then(({ startHero }) => startHero()).catch(() => {});
if ("requestIdleCallback" in window)
  window.requestIdleCallback(launchHero, { timeout: 1200 });
else window.setTimeout(launchHero, 250);
