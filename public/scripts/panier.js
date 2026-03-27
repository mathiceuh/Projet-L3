// ============================================
// PANIER.JS — Page panier
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

  // --- Display cart ---
  function afficherPanier() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    const container = document.getElementById('panier-container');
    const summaryCount = document.getElementById('summary-count');
    const summarySubtotal = document.getElementById('summary-subtotal');
    const summaryTotal = document.getElementById('summary-total');

    updateCartCount();

    if (panier.length === 0) {
      container.innerHTML = `
        <div class="panier-empty">
          <span class="empty-icon">🛒</span>
          <p>Votre panier est vide</p>
          <a href="/boutique" class="btn btn-outline btn-sm">Découvrir nos parfums</a>
        </div>
      `;
      if (summaryCount) summaryCount.textContent = '0';
      if (summarySubtotal) summarySubtotal.textContent = '0 €';
      if (summaryTotal) summaryTotal.textContent = '0 €';
      return;
    }

    container.innerHTML = '';
    let total = 0;

    panier.forEach(parfum => {
      total += parfum.prix;
      const item = document.createElement('div');
      item.classList.add('panier-item');
      item.innerHTML = `
        <img src="${parfum.image}" alt="${parfum.nom}">
        <div class="panier-item-info">
          <h4>${parfum.nom}</h4>
          <span class="item-price">${parfum.prix} €</span>
        </div>
        <button class="remove-btn" data-id="${parfum.id}" title="Supprimer">✕</button>
      `;
      container.appendChild(item);
    });

    // Update summary
    if (summaryCount) summaryCount.textContent = panier.length;
    if (summarySubtotal) summarySubtotal.textContent = `${total} €`;
    if (summaryTotal) summaryTotal.textContent = `${total} €`;

    // Remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const id = e.currentTarget.dataset.id;
        supprimerDuPanier(id);
      });
    });
  }

  // --- Remove from cart ---
  function supprimerDuPanier(parfumId) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];
    const removed = panier.find(item => item.id === parfumId);
    panier = panier.filter(item => item.id !== parfumId);
    localStorage.setItem('panier', JSON.stringify(panier));
    if (removed) showToast(`${removed.nom} retiré du panier`);
    afficherPanier();
  }

  // --- Clear cart ---
  const viderBtn = document.getElementById('vider-panier');
  if (viderBtn) {
    viderBtn.addEventListener('click', () => {
      const panier = JSON.parse(localStorage.getItem('panier')) || [];
      if (panier.length === 0) {
        showToast('Le panier est déjà vide', 'error');
        return;
      }
      localStorage.removeItem('panier');
      showToast('Panier vidé');
      afficherPanier();
    });
  }

  // --- Validate order ---
  const validerBtn = document.getElementById('valider-commande');
  const notif = document.getElementById('notification');
  if (validerBtn) {
    validerBtn.addEventListener('click', () => {
      if (notif) {
        notif.style.display = 'block';
        setTimeout(() => { notif.style.display = 'none'; }, 3000);
      }
    });
  }

  // --- Init ---
  afficherPanier();
});
