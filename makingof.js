// Carrega making of diretamente do CMS
const params = new URLSearchParams(window.location.search);
const slug = params.get("slug");

// Fallback se não tiver slug
if (!slug) {
  window.location.href = "index.html#makingof";
  return;
}

async function loadMakingOf() {
  const apiUrl = `https://api.github.com/repos/beatrizgabriel/augusto-pimenta-site/contents/content/projects/makingof?ref=main`;
  
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

    const makingOfs = await Promise.all(
      markdownFiles.map(async (file) => {
        const markdownResponse = await fetch(file.download_url);
        if (!markdownResponse.ok) return null;

        const markdown = await markdownResponse.text();
        return {
          slug: file.name.replace(/\.md$/i, ""),
          data: parseFrontmatter(markdown),
        };
      })
    );

    const currentMakingOf = makingOfs.find((m) => m.slug === slug);
    
    if (!currentMakingOf || !currentMakingOf.data.title) {
      document.getElementById("makingTitle").textContent = "Making of não encontrado";
      document.getElementById("makingDescription").textContent = "";
      return;
    }

    document.getElementById("makingTitle").textContent = currentMakingOf.data.title;
    document.getElementById("makingDescription").textContent = currentMakingOf.data.description || "";

    const gallery = document.getElementById("makingGallery");
    const images = currentMakingOf.data.gallery || [];
    
    gallery.innerHTML = images
      .map((item, i) => `<article class="gallery-item"><img src="${item.image}" alt="Making of ${currentMakingOf.data.title} ${i + 1}"></article>`)
      .join("");

  } catch (error) {
    console.error("Não foi possível carregar o making of:", error);
    document.getElementById("makingTitle").textContent = "Erro ao carregar";
    document.getElementById("makingDescription").textContent = "Tente novamente mais tarde.";
  }
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

loadMakingOf();