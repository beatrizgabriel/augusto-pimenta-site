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

function setupCarousel(trackId, prevId, nextId){
  const track = document.getElementById(trackId);
  const prev = document.getElementById(prevId);
  const next = document.getElementById(nextId);

  if (!track || !prev || !next) return;

  const items = Array.from(track.children);
  let currentPage = 0;
  let itemsPerPage = 3;

  function calculateItemsPerPage(){
    const width = window.innerWidth;
    if (width <= 760) itemsPerPage = 1;
    else if (width <= 1100) itemsPerPage = 2;
    else itemsPerPage = 3;
  }

  function update(){
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
    if (currentPage > 0){
      currentPage--;
      update();
    }
  });

  next.addEventListener("click", () => {
    const totalPages = Math.max(0, Math.ceil(items.length / itemsPerPage) - 1);
    if (currentPage < totalPages){
      currentPage++;
      update();
    }
  });

  window.addEventListener("resize", update);
  update();
}

setupCarousel("videoTrack", "videoPrev", "videoNext");
setupCarousel("editTrack", "editPrev", "editNext");