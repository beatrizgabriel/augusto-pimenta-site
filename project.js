const projects = {
  "forro-bobo": {
    title: "Forró Bobó",
    description: "Documentário e registros com pegada cinematográfica.",
    images: [
      { src: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80", size: "l" },
      { src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1200&q=80", size: "m" },
      { src: "https://images.unsplash.com/photo-1524863479829-916d8e77f114?auto=format&fit=crop&w=1200&q=80", size: "s" }
    ]
  },
  "terra-que-acaba": {
    title: "Terra que acaba",
    description: "Projeto autoral com leitura visual forte e expressiva.",
    images: [
      { src: "https://images.unsplash.com/photo-1524156868115-79b14d7f0b91?auto=format&fit=crop&w=1200&q=80", size: "l" },
      { src: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80", size: "m" },
      { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", size: "s" }
    ]
  },
  "marca-em-movimento": {
    title: "Marca em movimento",
    description: "Visual limpo, forte e preparado para conversão.",
    images: [
      { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80", size: "l" },
      { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", size: "m" },
      { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", size: "s" }
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "forro-bobo";
const data = projects[slug] || projects["forro-bobo"];

document.getElementById("projectTitle").textContent = data.title;
document.getElementById("projectDescription").textContent = data.description;

const gallery = document.getElementById("projectGallery");
gallery.innerHTML = data.images.map((item, i) => `<article class="gallery-item ${item.size || "s"}"><img src="${item.src}" alt="${data.title} ${i + 1}"></article>`).join("");