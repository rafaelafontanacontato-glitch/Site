import { portfolio, categories } from "./portfolio.js?v=7";

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
    prevProject: "Previous project",
    nextProject: "Next project",
    playProject: "Play {title}",
    watchOnYouTube: "Watch on YouTube ↗",
    modelCreditText:
      '“PS1 Style Retro Computer Station – Low Poly” by <a href="https://sketchfab.com/alexself" target="_blank" rel="noopener">alexself</a>, licensed under <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.',
    navWork: "Work",
    navAbout: "About",
    navContact: "Contact",
    heroEyebrow: "Independent video editor",
    heroRole: "Short-form & YouTube",
    heroStatus: "Open for projects",
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
    prevProject: "Projeto anterior",
    nextProject: "Próximo projeto",
    playProject: "Assistir: {title}",
    watchOnYouTube: "Assistir no YouTube ↗",
    modelCreditText:
      '“PS1 Style Retro Computer Station – Low Poly” por <a href="https://sketchfab.com/alexself" target="_blank" rel="noopener">alexself</a>, licenciado sob <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noopener">CC BY 4.0</a>.',
    navWork: "Trabalhos",
    navAbout: "Sobre",
    navContact: "Contato",
    heroEyebrow: "Editora de vídeo independente",
    heroRole: "Conteúdo curto & YouTube",
    heroStatus: "Agenda aberta",
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

const PLAY_ICON =
  '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M3 1.6v8.8L10.2 6z"/></svg>';

const archive = document.querySelector("[data-format-archive]");
const dialog = document.querySelector("[data-project-dialog]");
const player = document.querySelector("[data-project-player]");
const dialogCategory = document.querySelector("[data-project-category]");
const dialogTitle = document.querySelector("[data-project-title]");
const dialogDescription = document.querySelector("[data-project-description]");
const closeDialogButton = document.querySelector("[data-dialog-close]");
const projectNav = document.querySelector("[data-project-nav]");
const projectPosition = document.querySelector("[data-project-position]");
const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
const saveData = Boolean(navigator.connection?.saveData);
let language;
// The first format starts open so the work is visible without a click.
let openCategoryId = categories[0]?.id ?? null;
let lastTrigger = null;
let currentProjects = [];
let currentIndex = -1;
let activePreview = null;

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
const formatDuration = (seconds) => {
  if (!Number.isFinite(seconds) || seconds <= 0) return "";
  const total = Math.floor(seconds);
  return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
};

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
  stopPreview();
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
          <span class="format-meta"><span>${countLabel(projects.length)}</span><span class="format-symbol" aria-hidden="true">+</span></span>
        </button>
      </h3>
      <div class="format-panel" id="${galleryId}" ${isOpen ? "" : "hidden"}>
        ${projects.length ? '<ul class="format-gallery"></ul>' : `<p class="format-empty">${escapeHtml(copy[language].workEmpty)}</p>`}
      </div>`;
    const toggle = item.querySelector(".format-toggle");
    toggle.addEventListener("click", () => toggleCategory(category.id, toggle));
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

function toggleCategory(id, toggle) {
  stopPreview();
  closeProject();
  const previous = openCategoryId;
  const next = previous === id ? null : id;
  const items = [...archive.querySelectorAll(".format-item")];
  const itemFor = (categoryId) =>
    items.find((item) => item.dataset.categoryId === categoryId);
  const clicked = itemFor(id);
  const before = toggle.getBoundingClientRect().top;
  openCategoryId = next;
  if (previous && previous !== id) {
    const previousItem = itemFor(previous);
    // A drawer above the clicked row closes at once (and the page is shifted
    // back below), so the row never slides away from the pointer.
    const isAbove = items.indexOf(previousItem) < items.indexOf(clicked);
    setExpanded(previousItem, false, !isAbove);
  }
  setExpanded(clicked, Boolean(next), true);
  const shift = toggle.getBoundingClientRect().top - before;
  if (shift) window.scrollBy({ top: shift, behavior: "instant" });
  // A drawer opened near the bottom of the screen slides up into view.
  if (next && before > window.innerHeight * 0.55) {
    clicked.scrollIntoView({
      block: "start",
      behavior: reducedMotion.matches ? "auto" : "smooth",
    });
  }
  updateHeader();
}

function setExpanded(item, open, animate) {
  item.querySelector(".format-toggle").setAttribute("aria-expanded", String(open));
  const panel = item.querySelector(".format-panel");
  panel.getAnimations?.().forEach((animation) => animation.cancel());
  panel.style.overflow = "";
  if (!animate || reducedMotion.matches || !panel.animate) {
    panel.hidden = !open;
    return;
  }
  const easing = "cubic-bezier(0.22, 0.7, 0.2, 1)";
  panel.hidden = false;
  const style = getComputedStyle(panel);
  const full = {
    height: `${panel.offsetHeight}px`,
    paddingTop: style.paddingTop,
    paddingBottom: style.paddingBottom,
    opacity: 1,
  };
  const empty = { height: "0px", paddingTop: "0px", paddingBottom: "0px", opacity: 0 };
  panel.style.overflow = "hidden";
  const animation = panel.animate(open ? [empty, full] : [full, empty], {
    duration: open ? 520 : 340,
    easing,
  });
  animation.onfinish = () => {
    panel.style.overflow = "";
    if (!open) panel.hidden = true;
  };
  if (open) {
    panel.querySelectorAll(".format-gallery > li").forEach((tile, index) =>
      tile.animate(
        [
          { opacity: 0, transform: "translateY(18px)" },
          { opacity: 1, transform: "none" },
        ],
        { duration: 460, delay: 90 + index * 55, easing, fill: "backwards" },
      ),
    );
  }
}

function createTile(project, index) {
  const listItem = document.createElement("li");
  const tile = document.createElement("button");
  tile.type = "button";
  tile.className = "project-tile";
  tile.dataset.projectId = project.id;
  const title = localized(project.title);
  const duration = formatDuration(project.duration);
  const badge = duration || (project.youtubeId ? "YouTube" : "");
  const poster =
    project.poster ||
    (project.youtubeId
      ? `https://i.ytimg.com/vi/${encodeURIComponent(project.youtubeId)}/hqdefault.jpg`
      : "");
  tile.setAttribute(
    "aria-label",
    copy[language].playProject.replace("{title}", title) +
      (duration ? ` (${duration})` : ""),
  );
  tile.innerHTML = `
    <span class="tile-image${project.youtubeId ? " is-youtube" : ""}">
      <img src="${escapeHtml(poster)}" alt="" loading="lazy" decoding="async">
      <span class="tile-badge">${PLAY_ICON}${badge ? `<span>${escapeHtml(badge)}</span>` : ""}</span>
    </span>
    <span class="tile-caption"><span>${String(index + 1).padStart(2, "0")}</span><strong>${escapeHtml(title)}</strong></span>`;
  tile.addEventListener("click", () => openProject(project, tile));
  attachPreview(tile, project);
  listItem.append(tile);
  return listItem;
}

// Desktop only: a muted preview plays while the pointer rests on a thumbnail.
function attachPreview(tile, project) {
  if (!project.video) return;
  let video = null;
  tile.addEventListener("pointerenter", (event) => {
    if (
      event.pointerType !== "mouse" ||
      !finePointer.matches ||
      reducedMotion.matches ||
      saveData
    )
      return;
    stopPreview();
    const state = { tile, video: null, timer: 0 };
    state.timer = window.setTimeout(() => {
      if (!video) {
        video = document.createElement("video");
        video.className = "tile-preview";
        video.defaultMuted = true;
        video.muted = true;
        video.loop = true;
        video.playsInline = true;
        video.preload = "auto";
        video.tabIndex = -1;
        video.setAttribute("aria-hidden", "true");
        video.src = project.video;
        video.addEventListener("playing", () => {
          if (activePreview?.video === video)
            tile.classList.add("is-previewing");
        });
        tile.querySelector(".tile-image").append(video);
      }
      state.video = video;
      video.play().catch(() => {});
    }, 140);
    activePreview = state;
  });
  tile.addEventListener("pointerleave", () => {
    if (activePreview?.tile === tile) stopPreview();
  });
}

function stopPreview() {
  if (!activePreview) return;
  const { tile, video, timer } = activePreview;
  window.clearTimeout(timer);
  tile.classList.remove("is-previewing");
  video?.pause();
  activePreview = null;
}

function renderProject(project) {
  clearPlayer();
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
    watchLink.textContent = copy[language].watchOnYouTube;
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
  // Same label as the drawer the project came from.
  dialogCategory.textContent =
    localized(
      categories.find((category) => category.id === project.categoryId)?.title,
    ) || localized(project.category);
  dialogTitle.textContent = localized(project.title);
  dialogDescription.textContent = localized(project.description);
  dialogDescription.hidden = !dialogDescription.textContent;
  dialog.classList.toggle("is-portrait", project.height > project.width);
  projectNav.hidden = currentProjects.length < 2;
  projectPosition.textContent = `${currentIndex + 1} / ${currentProjects.length}`;
}

const playCurrent = () =>
  player
    .querySelector("video")
    ?.play()
    .catch(() => {});

function openProject(project, trigger) {
  stopPreview();
  lastTrigger = trigger;
  currentProjects = projectsFor(project.categoryId);
  currentIndex = Math.max(0, currentProjects.indexOf(project));
  renderProject(project);
  dialog.showModal();
  document.body.classList.add("project-open");
  playCurrent();
  closeDialogButton.focus();
}

// Previous / next stay inside the open format and wrap around.
function stepProject(direction) {
  const total = currentProjects.length;
  if (!dialog.open || total < 2) return;
  currentIndex = (currentIndex + direction + total) % total;
  const project = currentProjects[currentIndex];
  lastTrigger =
    archive.querySelector(`[data-project-id="${CSS.escape(project.id)}"]`) ||
    lastTrigger;
  renderProject(project);
  playCurrent();
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
projectNav.addEventListener("click", (event) => {
  const button = event.target.closest("[data-project-step]");
  if (button) stepProject(Number(button.dataset.projectStep));
});
dialog.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  // Arrow keys on a focused player still seek the video.
  if (event.target instanceof HTMLMediaElement) return;
  if (event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  event.preventDefault();
  stepProject(event.key === "ArrowRight" ? 1 : -1);
});
dialog.addEventListener("click", (event) => {
  if (event.target === dialog) closeProject();
});
dialog.addEventListener("close", () => {
  clearPlayer();
  document.body.classList.remove("project-open");
  if (lastTrigger) {
    lastTrigger.focus({ preventScroll: true });
    const rect = lastTrigger.getBoundingClientRect();
    if (rect.bottom < 0 || rect.top > window.innerHeight)
      lastTrigger.scrollIntoView({ block: "center" });
  }
  lastTrigger = null;
  currentProjects = [];
  currentIndex = -1;
});
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    player.querySelector("video")?.pause();
    stopPreview();
  }
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
  import("./hero.js?v=2").then(({ startHero }) => startHero()).catch(() => {});
if ("requestIdleCallback" in window)
  window.requestIdleCallback(launchHero, { timeout: 1200 });
else window.setTimeout(launchHero, 250);
