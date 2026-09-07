// ============================================
// كتالوج الفساتين - عدّلي هذه القائمة فقط
// ============================================

const dresses = [
  {
    id: 1,
    name: "تصميم 01",
    category: "evening",
    categoryName: "سهرة",
    image: "images/dress-01.svg"
  },
  {
    id: 2,
    name: "تصميم 02",
    category: "bridal",
    categoryName: "زفاف",
    image: "images/dress-02.svg"
  },
  {
    id: 3,
    name: "تصميم 03",
    category: "special",
    categoryName: "خاص",
    image: "images/dress-03.svg"
  },
  {
    id: 4,
    name: "تصميم 04",
    category: "evening",
    categoryName: "سهرة",
    image: "images/dress-04.svg"
  },
  {
    id: 5,
    name: "تصميم 05",
    category: "bridal",
    categoryName: "زفاف",
    image: "images/dress-05.svg"
  },
  {
    id: 6,
    name: "تصميم 06",
    category: "special",
    categoryName: "خاص",
    image: "images/dress-06.svg"
  }
];

const SESSION_SECONDS = 120;

const catalog = document.getElementById("catalog");
const timer = document.getElementById("timer");
const expired = document.getElementById("expired");
const restartBtn = document.getElementById("restartBtn");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
const lightboxTitle = document.getElementById("lightboxTitle");
const closeLightbox = document.getElementById("closeLightbox");

let remaining = SESSION_SECONDS;
let interval;
let currentFilter = "all";

function renderCatalog() {
  const visible = dresses.filter(d =>
    currentFilter === "all" || d.category === currentFilter
  );

  catalog.innerHTML = visible.map(dress => `
    <article class="dress-card" data-id="${dress.id}">
      <div class="dress-image">
        <img src="${dress.image}" alt="${dress.name}" draggable="false">
        <span class="card-watermark">PRIVATE COLLECTION</span>
      </div>
      <div class="dress-info">
        <p class="dress-name">${dress.name}</p>
        <p class="dress-meta">${dress.categoryName}</p>
      </div>
    </article>
  `).join("");

  document.querySelectorAll(".dress-card").forEach(card => {
    card.addEventListener("click", () => {
      const dress = dresses.find(d => d.id === Number(card.dataset.id));
      if (dress) openLightbox(dress);
    });
  });
}

function updateTimer() {
  const minutes = Math.floor(remaining / 60);
  const seconds = remaining % 60;
  timer.textContent =
    `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function expireSession() {
  clearInterval(interval);
  remaining = 0;
  updateTimer();
  catalog.innerHTML = "";
  document.querySelector(".welcome").style.display = "none";
  document.querySelector(".controls").style.display = "none";
  expired.classList.remove("hidden");
  closeLightboxModal();
}

function startSession() {
  clearInterval(interval);
  remaining = SESSION_SECONDS;
  expired.classList.add("hidden");
  document.querySelector(".welcome").style.display = "";
  document.querySelector(".controls").style.display = "";
  updateTimer();
  renderCatalog();

  interval = setInterval(() => {
    remaining--;
    updateTimer();
    if (remaining <= 0) expireSession();
  }, 1000);
}

function openLightbox(dress) {
  if (remaining <= 0) return;
  lightboxImage.src = dress.image;
  lightboxImage.alt = dress.name;
  lightboxTitle.textContent = dress.name;
  lightbox.classList.remove("hidden");
  lightbox.setAttribute("aria-hidden", "false");
}

function closeLightboxModal() {
  lightbox.classList.add("hidden");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}

document.querySelectorAll(".filter").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter").forEach(b => b.classList.remove("active"));
    button.classList.add("active");
    currentFilter = button.dataset.filter;
    renderCatalog();
  });
});

closeLightbox.addEventListener("click", closeLightboxModal);
lightbox.addEventListener("click", e => {
  if (e.target === lightbox) closeLightboxModal();
});

restartBtn.addEventListener("click", startSession);

// حماية واجهة بسيطة من الحفظ والنسخ.
// ملاحظة: لا يمكن لموقع HTML عادي ضمان منع Screenshot على كل الأجهزة.
document.addEventListener("contextmenu", e => e.preventDefault());
document.addEventListener("dragstart", e => e.preventDefault());
document.addEventListener("selectstart", e => e.preventDefault());

document.addEventListener("keydown", e => {
  const key = e.key.toLowerCase();

  if (
    e.key === "PrintScreen" ||
    (e.ctrlKey && ["s", "u", "c", "p"].includes(key)) ||
    (e.metaKey && ["s", "u", "c", "p"].includes(key))
  ) {
    e.preventDefault();
  }

  if (e.key === "Escape") closeLightboxModal();
});

document.addEventListener("visibilitychange", () => {
  // عند مغادرة الصفحة لا نوقف المؤقت؛ الجلسة تستمر حتى انتهاء الدقيقتين.
});

startSession();
