const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

function cleanValue(value) {
  const cleaned = String(value).trim();
  if (
    (cleaned.startsWith('"') && cleaned.endsWith('"')) ||
    (cleaned.startsWith("'") && cleaned.endsWith("'"))
  ) {
    return cleaned.slice(1, -1);
  }
  return cleaned;
}

function parseFrontmatter(markdown) {
  const match = markdown.match(/^---\s*([\s\S]*?)\s*---/);
  if (!match) return {};

  const data = {};
  let activeListKey = null;

  match[1].split(/\r?\n/).forEach((line) => {
    const listItem = line.match(/^\s*-\s+(.+)$/);
    if (listItem && activeListKey) {
      if (!data[activeListKey]) data[activeListKey] = [];
      data[activeListKey].push(cleanValue(listItem[1]));
      return;
    }

    const separator = line.indexOf(":");
    if (separator === -1) return;

    const key = line.slice(0, separator).trim();
    const rawValue = line.slice(separator + 1).trim();
    activeListKey = null;

    if (!rawValue) {
      data[key] = [];
      activeListKey = key;
    } else if (rawValue.startsWith("[") && rawValue.endsWith("]")) {
      data[key] = rawValue
        .slice(1, -1)
        .split(",")
        .map(cleanValue)
        .filter(Boolean);
    } else {
      data[key] = cleanValue(rawValue);
    }
  });

  return data;
}

function resolveAssetUrl(assetPath) {
  if (!assetPath) return "";
  if (/^https?:\/\//i.test(assetPath)) return assetPath;

  const githubPagesBase = window.location.hostname.endsWith("github.io")
    ? "/augusto-pimenta-site"
    : "";

  return `${githubPagesBase}/${String(assetPath).replace(/^\/+/, "")}`;
}

function renderMakingOf(data) {
  document.getElementById("makingTitle").textContent = data.title || "Making of";
  document.getElementById("makingDescription").textContent = data.description || "";

  const gallery = document.getElementById("makingGallery");
  const items = Array.isArray(data.gallery) ? data.gallery : [];

  gallery.innerHTML = items
    .map((item, index) => {
      const imagePath = typeof item === "string" ? item : item?.image;
      if (!imagePath) return "";

      return `<article class="gallery-item"><img src="${resolveAssetUrl(imagePath)}" alt="${data.title} ${index + 1}"></article>`;
    })
    .join("");
}

async function loadMakingOf() {
  if (!slug) {
    window.location.href = "index.html#makingof";
    return;
  }

  const rawUrl = `https://raw.githubusercontent.com/beatrizgabriel/augusto-pimenta-site/main/content/projects/makingof/${encodeURIComponent(slug)}.md`;

  try {
    const response = await fetch(rawUrl);
    if (!response.ok) throw new Error(`Making of não encontrado (${response.status})`);

    const data = parseFrontmatter(await response.text());
    if (!data.title) throw new Error("Arquivo sem título");
    renderMakingOf(data);
  } catch (error) {
    console.error("Não foi possível carregar o making of:", error);
    document.getElementById("makingTitle").textContent = "Making of não encontrado";
    document.getElementById("makingDescription").textContent = "";
  }
}

loadMakingOf();
