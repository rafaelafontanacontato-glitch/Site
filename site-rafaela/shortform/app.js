import { portfolio, categories } from "./portfolio.js?v=6";

const copy = {
  en: {
    skip: "Skip to work",
    homeLabel: "Rafaela Fontana, top",
    primaryNav: "Primary navigation",
    computerLabel: "Interactive 3D retro computer",
    scrollLabel: "Scroll to work",
    positioning: "Positioning",
    servicesLabel: "Services",
    modelCredit: "3D model credit",
    closeProject: "Close project",
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
    workNote: "By format, from short-form to YouTube.",
    workEmpty: "No projects in this format yet.",
    projectCount: "{count} project",
    projectCountPlural: "{count} projects",
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
    positioning: "Posicionamento",
    servicesLabel: "Serviços",
    modelCredit: "Crédito do modelo 3D",
    closeProject: "Fechar projeto",
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
    workNote: "Por formato, do conteúdo curto ao YouTube.",
    workEmpty: "Ainda não há projetos neste formato.",
    projectCount: "{count} projeto",
    projectCountPlural: "{count} projetos",
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

const archive = document.querySelector("[data-format-archive]");
const dialog = document.querySelector("[data-project-dialog]");
const player = document.querySelector("[data-project-player]");
const dialogCategory = document.querySelector("[data-project-category]");
const dialogTitle = document.querySelector("[data-project-title]");
const dialogDescription = document.querySelector("[data-project-description]");
const closeDialogButton = document.querySelector("[data-dialog-close]");
let language;
let openCategoryId = null;
let lastTrigger = null;

try {
  language = localStorage.getItem("rafaela-shortform-language");
} catch {
  language = null;
}
language = language === "pt" ? "pt" : "en";

const localized = (value) => value?.[language] || value?.en || "";
const escapeHtml = (value) =>
  String(value || "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
const projectsFor = (id) =>
  portfolio.filter((project) => project.categoryId === id);
const countLabel = (count) =>
  (count === 1
    ? copy[language].projectCount
    : copy[language].projectCountPlural
  ).replace("{count}", count);

function clearPlayer() {
  const media = player.querySelector("video");
  if (media) {
    media.pause();
    media.removeAttribute("src");
    media.load();
  }
  player.replaceChildren();
}

function closeProject() {
  if (dialog.open) dialog.close();
}

function renderArchive() {
  archive.replaceChildren();
  categories.forEach((category, categoryIndex) => {
    const projects = projectsFor(category.id);
    const item = document.createElement("section");
    item.className = "format-item";
    item.dataset.categoryId = category.id;
    const galleryId = `format-gallery-${category.id}`;
    const isOpen = openCategoryId === category.id;
    item.innerHTML = `
      <h3>
        <button class="format-toggle" type="button" aria-expanded="${isOpen}" aria-controls="${galleryId}">
          <span class="format-index">${String(categoryIndex + 1).padStart(2, "0")}</span>
          <span class="format-title">${escapeHtml(localized(category.title))}</span>
          <span class="format-meta"><span>${countLabel(projects.length)}</span><span class="format-symbol" aria-hidden="true">${isOpen ? "×" : "+"}</span></span>
        </button>
      </h3>
      <div class="format-panel" id="${galleryId}" ${isOpen ? "" : "hidden"}>
        ${projects.length ? '<ul class="format-gallery"></ul>' : `<p class="format-empty">${escapeHtml(copy[language].workEmpty)}</p>`}
      </div>`;
    const toggle = item.querySelector(".format-toggle");
    toggle.addEventListener("click", () => {
      const next = openCategoryId === category.id ? null : category.id;
      if (next !== openCategoryId) closeProject();
      openCategoryId = next;
      renderArchive();
      archive
        .querySelector(
          `[data-category-id="${CSS.escape(category.id)}"] .format-toggle`,
        )
        ?.focus({ preventScroll: true });
      updateHeader();
    });
    const gallery = item.querySelector(".format-gallery");
    if (gallery) {
      gallery.classList.toggle(
        "is-portrait",
        projects.every((p) => p.height > p.width),
      );
      projects.forEach((project, projectIndex) =>
        gallery.append(createTile(project, projectIndex)),
      );
    }
    archive.append(item);
  });
}

function createTile(project, index) {
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "project-tile";
  const listItem = document.createElement("li");
  const poster =
    project.poster ||
    (project.youtubeId
      ? `https://i.ytimg.com/vi/${encodeURIComponent(project.youtubeId)}/hqdefault.jpg`
      : "");
  tile.innerHTML = `
    <span class="tile-image"><img src="${escapeHtml(poster)}" alt="" loading="lazy" decoding="async"></span>
    <span class="tile-caption"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(localized(project.title))}</strong><i aria-hidden="true">↗</i></span>`;
  tile.addEventListener("click", () => openProject(project, tile));
  listItem.append(tile);
  return listItem;
}

function openProject(project, trigger) {
  clearPlayer();
  lastTrigger = trigger;
  const isYouTube = Boolean(project.youtubeId);
  if (isYouTube) {
    const frame = document.createElement("iframe");
    const start = Number.isFinite(project.startSeconds)
      ? Math.max(0, Math.floor(project.startSeconds))
      : 0;
    frame.src = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(project.youtubeId)}?autoplay=1&rel=0&start=${start}`;
    frame.title = localized(project.title);
    if (project.poster) frame.style.backgroundImage = `url(${JSON.stringify(project.poster)})`;
    frame.allow =
      "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    frame.allowFullscreen = true;
    frame.referrerPolicy = "strict-origin-when-cross-origin";
    const watchLink = document.createElement("a");
    watchLink.className = "youtube-link";
    watchLink.href = `https://www.youtube.com/watch?v=${encodeURIComponent(project.youtubeId)}&t=${start}s`;
    watchLink.target = "_blank";
    watchLink.rel = "noopener";
    watchLink.textContent =
      language === "pt" ? "Assistir no YouTube ↗" : "Watch on YouTube ↗";
    player.append(frame, watchLink);
  } else if (project.video) {
    const video = document.createElement("video");
    video.src = project.video;
    video.poster = project.poster || "";
    video.controls = true;
    video.playsInline = true;
    video.loop = Boolean(project.loop);
    video.preload = "metadata";
    video.setAttribute("aria-label", localized(project.title));
    player.append(video);
  }
  dialogCategory.textContent =
    localized(project.category) ||
    localized(
      categories.find((category) => category.id === project.categoryId)?.title,
    );
  dialogTitle.textContent = localized(project.title);
  dialogDescription.textContent = localized(project.description);
  dialogDescription.hidden = !dialogDescription.textContent;
  dialog.classList.toggle("is-portrait", project.height > project.width);
  dialog.showModal();
  document.body.classList.add("project-open");
  const media = player.querySelector("video");
  if (media) media.play().catch(() => {});
  closeDialogButton.focus();
}

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
  renderArchive();
}

closeDialogButton.addEventListener("click", closeProject);
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeProject();
});
dialog.addEventListener("close", () => {
  clearPlayer();
  document.body.classList.remove("project-open");
  lastTrigger?.focus({ preventScroll: true });
  lastTrigger = null;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) player.querySelector("video")?.pause();
});
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
