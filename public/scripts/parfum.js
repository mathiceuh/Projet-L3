// ============================================
// PARFUM.JS — Page détail produit
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav toggle ---
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // --- Cart counter ---
  function updateCartCount() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.textContent = panier.length;
  }
  updateCartCount();

  // --- Toast ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Load perfume details ---
  const urlParams = new URLSearchParams(window.location.search);
  const parfumId = urlParams.get('id');
  const detailsContainer = document.getElementById('parfum-details');

  if (!parfumId) {
    detailsContainer.innerHTML = `
      <div class="detail-error">
        <p>Aucun parfum sélectionné.</p>
        <a href="/boutique" class="btn btn-outline">Retour à la boutique</a>
      </div>
    `;
    return;
  }

  fetch(`/api/parfums/${parfumId}`)
    .then(response => {
      if (!response.ok) throw new Error('Parfum non trouvé');
      return response.json();
    })
    .then(parfum => {
      document.title = `${parfum.nom} — Éclat Olfactif`;

      detailsContainer.innerHTML = `
        <div class="detail-image-wrapper">
          <img src="${parfum.image}" alt="${parfum.nom}">
        </div>
        <div class="detail-info">
          <p class="detail-brand">${parfum.marque}</p>
          <h1 class="detail-name">${parfum.nom}</h1>
          <span class="detail-type">${parfum.type}</span>
          <p class="detail-price">${parfum.prix} € <span>TTC</span></p>
          <p class="detail-description">${parfum.description}</p>
          <div class="detail-actions">
            <button class="btn btn-gold" id="add-to-cart-detail">
              🛒 Ajouter au panier
            </button>
            <a href="/boutique" class="btn btn-outline">Continuer mes achats</a>
          </div>
        </div>
      `;

      // Add to cart from detail page
      const addBtn = document.getElementById('add-to-cart-detail');
      if (addBtn) {
        addBtn.addEventListener('click', () => {
          let panier = JSON.parse(localStorage.getItem('panier')) || [];

          if (panier.find(item => item.id === String(parfum.id))) {
            showToast('Ce parfum est déjà dans votre panier !', 'error');
            return;
          }

          panier.push({
            id: String(parfum.id),
            nom: parfum.nom,
            prix: parfum.prix,
            image: parfum.image
          });
          localStorage.setItem('panier', JSON.stringify(panier));
          updateCartCount();
          showToast(`${parfum.nom} ajouté au panier ✓`);
        });
      }
    })
    .catch(err => {
      detailsContainer.innerHTML = `
        <div class="detail-error">
          <p>${err.message}</p>
          <a href="/boutique" class="btn btn-outline">Retour à la boutique</a>
        </div>
      `;
    });
});