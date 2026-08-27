const filterButtons = document.querySelectorAll(".filter");
const cards = document.querySelectorAll(".project-card[data-category]");
const menuBtn = document.querySelector(".menu-btn");
const menu = document.querySelector(".menu");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    filterButtons.forEach((btn) => btn.classList.remove("is-active"));
    button.classList.add("is-active");

    const filter = button.dataset.filter;
    cards.forEach((card) => {
      const match = filter === "all" || card.dataset.category === filter;
      card.classList.toggle("hidden", !match);
    });
  });
});

if (menuBtn && menu) {
  menuBtn.addEventListener("click", () => {
    const open = menu.classList.toggle("is-open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
  });

  menu.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      menu.classList.remove("is-open");
      menuBtn.setAttribute("aria-expanded", "false");
    });
  });
}

const form = document.getElementById("feedbackForm");
const status = document.getElementById("feedbackStatus");

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !message) {
      status.textContent = "Preencha nome e mensagem.";
      return;
    }

    const body = `Feedback de ${name}: ${message}`;
    window.location.href = `mailto:oaugustopimenta@gmail.com?subject=${encodeURIComponent("Novo feedback")}&body=${encodeURIComponent(body)}`;
    status.textContent = "Abrindo seu e-mail para enviar o feedback.";
    form.reset();
  });
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return {};

  const data = {};
  match[1].split(/\r?\n/).forEach((line) => {
    const separator = line.indexOf(":");
    if (separator === -1) return;

    const key = line.slice(0, separator).trim();
    let value = line.slice(separator + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    data[key] = value;
  });

  return data;
}

function resolveAssetUrl(assetPath) {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  // O site Netlify é servido na raiz do domínio.
  // A alternativa mantém compatibilidade com o endereço antigo do GitHub Pages.
  const githubPagesBase = window.location.hostname.endsWith("github.io")
    ? "/augusto-pimenta-site"
    : "";

  return `${githubPagesBase}/${assetPath.replace(/^\/+/, "")}`;
}

function getYouTubeThumbnail(videoUrl) {
  try {
    const parsed = new URL(videoUrl);
    let videoId = "";

    if (parsed.hostname === "youtu.be") {
      videoId = parsed.pathname.replace(/^\//, "");
    } else if (parsed.hostname.includes("youtube.com")) {
      videoId = parsed.searchParams.get("v") || "";
    }

    if (videoId) {
      return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    }
  } catch (error) {
    console.warn("Link de vídeo inválido:", videoUrl, error);
  }

  return "";
}

function createCmsVideoCard(video) {
  const card = document.createElement("a");
  card.className = "project-card video-card cms-video-card";
  card.href = video.url;
  card.target = "_blank";
  card.rel = "noreferrer";

  const image = document.createElement("img");
  image.src = resolveAssetUrl(video.cover) || getYouTubeThumbnail(video.url);
  image.alt = video.title;

  const overlay = document.createElement("div");
  overlay.className = "video-overlay";

  const title = document.createElement("h3");
  title.textContent = video.title;

  overlay.appendChild(title);
  card.appendChild(image);
  card.appendChild(overlay);

  return card;
}

async function loadCmsVideos() {
  const track = document.getElementById("videoTrack");
  if (!track) return;

  const apiUrl = "https://api.github.com/repos/beatrizgabriel/augusto-pimenta-site/contents/content/projects/videos?ref=main";

  try {
    const response = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json" },
    });

    if (!response.ok) {
      throw new Error(`GitHub API respondeu ${response.status}`);
    }

    const files = await response.json();
    const markdownFiles = files.filter(
      (file) => file.type === "file" && file.name.toLowerCase().endsWith(".md")
    );

    const videos = await Promise.all(
      markdownFiles.map(async (file) => {
        const markdownResponse = await fetch(file.download_url);
        if (!markdownResponse.ok) return null;

        const markdown = await markdownResponse.text();
        return parseFrontmatter(markdown);
      })
    );

    videos
      .filter((video) => video && video.title && video.url)
      .forEach((video) => {
        track.appendChild(createCmsVideoCard(video));
      });
  } catch (error) {
    console.error("Não foi possível carregar os vídeos do CMS:", error);
  }
}

function setupCarousel(trackId, prevId, nextId) {
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);

  if (!track || !prev || !next) return;

  const items = Array.from(track.children);
  let currentPage = 0;
  let itemsPerPage = 3;

  function calculateItemsPerPage() {
    const width = window.innerWidth;
    if (width <= 760) itemsPerPage = 1;
    else if (width <= 1100) itemsPerPage = 2;
    else itemsPerPage = 3;
  }

  function update() {
    calculateItemsPerPage();
    const totalPages = Math.max(0, Math.ceil(items.length / itemsPerPage) - 1);
    currentPage = Math.min(currentPage, totalPages);

    const first = items[0];
    const cardWidth = first ? first.getBoundingClientRect().width : 0;
    const gap = 18;
    const step = currentPage * (itemsPerPage * cardWidth + itemsPerPage * gap);

    track.style.transform = `translateX(-${step}px)`;

    prev.classList.toggle("is-hidden", currentPage <= 0);
    next.classList.toggle("is-hidden", currentPage >= totalPages);
  }

  prev.addEventListener("click", () => {
    if (currentPage > 0) {
      currentPage--;
      update();
    }
  });

  next.addEventListener("click", () => {
    const totalPages = Math.max(0, Math.ceil(items.length / itemsPerPage) - 1);
    if (currentPage < totalPages) {
      currentPage++;
      update();
    }
  });

  window.addEventListener("resize", update);
  update();
}

loadCmsVideos().finally(() => {
  setupCarousel("videoTrack", "videoPrev", "videoNext");
  setupCarousel("editTrack", "editPrev", "editNext");
});
