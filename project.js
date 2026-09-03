const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "forro-bobo";

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

  return `${githubPagesBase}/${assetPath.replace(/^\/+/, "")}`;
}

function makeProjectData(data) {
  const gallery = Array.isArray(data.gallery) ? data.gallery : [];
  const images = [];

  if (data.cover) {
    images.push({ src: resolveAssetUrl(data.cover), size: "l" });
  }

  gallery.forEach((item, index) => {
    const imagePath = typeof item === "string" ? item : item?.image;
    if (!imagePath) return;

    images.push({
      src: resolveAssetUrl(imagePath),
      size: index % 2 === 0 ? "m" : "s"
    });
  });

  return {
    title: data.title,
    description: data.description || "",
    images
  };
}

function renderProject(data) {
  document.getElementById("projectTitle").textContent = data.title;
  document.getElementById("projectDescription").textContent = data.description;

  const gallery = document.getElementById("projectGallery");
  gallery.innerHTML = data.images
    .filter((item) => item.src)
    .map(
      (item, index) =>
        `<article class="gallery-item ${item.size || "s"}"><img src="${item.src}" alt="${data.title} ${index + 1}"></article>`
    )
    .join("");
}

async function loadProject() {
  const rawUrl = `https://raw.githubusercontent.com/beatrizgabriel/augusto-pimenta-site/main/content/projects/projects/${encodeURIComponent(slug)}.md`;

  try {
    const response = await fetch(rawUrl);
    if (!response.ok) throw new Error(`Projeto não encontrado (${response.status})`);

    const markdown = await response.text();
    const data = parseFrontmatter(markdown);

    if (data.title) {
      renderProject(makeProjectData(data));
      return;
    }
  } catch (error) {
    console.warn("Usando projeto estático de reserva:", error);
  }

  document.getElementById("projectTitle").textContent = "Projeto não encontrado";
  document.getElementById("projectDescription").textContent = "";
}

loadProject();
