const making = {
  "forro-bobo": {
    title: "Forró Bobó",
    description: "Bastidores do projeto em captação e set.",
    images: [
      { src: "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?auto=format&fit=crop&w=1200&q=80", size: "l" },
      { src: "https://images.unsplash.com/photo-1516280030429-27679b3dc9cf?auto=format&fit=crop&w=1200&q=80", size: "m" },
      { src: "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80", size: "s" }
    ]
  },
  "terra-que-acaba": {
    title: "Terra que acaba",
    description: "Making of do processo visual e encenação.",
    images: [
      { src: "https://images.unsplash.com/photo-1452587925148-ce544e77e70d?auto=format&fit=crop&w=1200&q=80", size: "l" },
      { src: "https://images.unsplash.com/photo-1524156868115-79b14d7f0b91?auto=format&fit=crop&w=1200&q=80", size: "m" },
      { src: "https://images.unsplash.com/photo-1520262494112-9fe481d36ec3?auto=format&fit=crop&w=1200&q=80", size: "s" }
    ]
  },
  "marca-em-movimento": {
    title: "Marca em movimento",
    description: "Bastidores de direção, luz e produto.",
    images: [
      { src: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80", size: "l" },
      { src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80", size: "m" },
      { src: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80", size: "s" }
    ]
  }
};

const params = new URLSearchParams(window.location.search);
const slug = params.get("slug") || "forro-bobo";
const data = making[slug] || making["forro-bobo"];

document.getElementById("makingTitle").textContent = data.title;
document.getElementById("makingDescription").textContent = data.description;

const gallery = document.getElementById("makingGallery");
gallery.innerHTML = data.images.map((item, i) => `<article class="gallery-item ${item.size || "s"}"><img src="${item.src}" alt="Making of ${data.title} ${i + 1}"></article>`).join("");