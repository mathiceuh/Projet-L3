// ============================================
// INDEX.JS — Page d'accueil
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav toggle (mobile) ---
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle) {
    toggle.addEventListener('click', () => navLinks.classList.toggle('open'));
  }

  // --- Navbar scroll effect ---
  const nav = document.getElementById('site-nav');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // --- Cart counter ---
  function updateCartCount() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = panier.length;
  }
  updateCartCount();

  // --- Hero Slider ---
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.getElementById('slider-prev');
  const nextBtn = document.getElementById('slider-next');
  let currentSlide = 0;
  let slideInterval;

  function goToSlide(index) {
    slides.forEach(s => s.classList.remove('active'));
    dots.forEach(d => d.classList.remove('active'));
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function startAutoSlide() {
    slideInterval = setInterval(nextSlide, 5000);
  }

  function resetAutoSlide() {
    clearInterval(slideInterval);
    startAutoSlide();
  }

  if (slides.length > 0) {
    startAutoSlide();

    if (prevBtn) prevBtn.addEventListener('click', () => { goToSlide(currentSlide - 1); resetAutoSlide(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { goToSlide(currentSlide + 1); resetAutoSlide(); });

    dots.forEach(dot => {
      dot.addEventListener('click', () => {
        goToSlide(parseInt(dot.dataset.index));
        resetAutoSlide();
      });
    });
  }

  // --- Load classic perfumes ---
  fetch('/api/parfums')
    .then(response => response.json())
    .then(data => {
      const container = document.getElementById('classiques-container');
      const classiques = data.filter(p => p.classique);

      classiques.forEach(parfum => {
        const card = document.createElement('div');
        card.classList.add('parfum-card');
        card.innerHTML = `
          <a href="/parfum.html?id=${parfum.id}" class="parfum-link">
            <div class="card-img-wrapper">
              <img src="${parfum.image}" alt="${parfum.nom}">
            </div>
            <div class="card-body">
              <h3>${parfum.nom}</h3>
              <p class="card-brand">${parfum.marque}</p>
              <p class="card-price">${parfum.prix} €</p>
            </div>
          </a>
        `;
        container.appendChild(card);
      });
    })
    .catch(err => console.error('Erreur lors du chargement des parfums :', err));
});
