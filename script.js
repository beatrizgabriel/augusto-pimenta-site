async function loadCmsMakingOf() {
  const grid = document.getElementById("makingofGrid");
  if (!grid) return;

  const apiUrl = "https://api.github.com/repos/beatrizgabriel/augusto-pimenta-site/contents/content/projects/makingof?ref=main";

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

    makingOfs
      .filter((making) => making?.data?.title && making.data.cover)
      .forEach((making) => {
        const card = document.createElement("a");
        card.className = "project-card";
        card.href = `making-of.html?slug=${encodeURIComponent(making.slug)}`;

        const image = document.createElement("img");
        image.src = resolveAssetUrl(making.data.cover);
        image.alt = making.data.title;

        const info = document.createElement("div");
        info.className = "project-info";

        const tag = document.createElement("p");
        tag.className = "tag";
        tag.textContent = "Making of";

        const title = document.createElement("h3");
        title.textContent = making.data.title;

        const description = document.createElement("p");
        description.textContent = making.data.description || "";

        info.appendChild(tag);
        info.appendChild(title);
        info.appendChild(description);
        card.appendChild(image);
        card.appendChild(info);
        grid.appendChild(card);
      });

  } catch (error) {
    console.error("Não foi possível carregar os making of do CMS:", error);
  }
}

Promise.all([loadCmsProjects(), loadCmsVideos(), loadCmsMakingOf()]).finally(() => {
  setupCarousel("videoTrack", "videoPrev", "videoNext");
  setupCarousel("editTrack", "editPrev", "editNext");
});