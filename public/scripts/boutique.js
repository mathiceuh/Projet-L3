// ============================================
// BOUTIQUE.JS — Page boutique
// ============================================

document.addEventListener('DOMContentLoaded', () => {

  // --- Nav toggle ---
  const toggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  if (toggle) toggle.addEventListener('click', () => navLinks.classList.toggle('open'));

  // --- Cart counter ---
  function updateCartCount() {
    const panier = JSON.parse(localStorage.getItem('panier')) || [];
    document.getElementById('cart-count').textContent = panier.length;
  }
  updateCartCount();

  // --- Toast notification ---
  function showToast(message, type = 'success') {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3000);
  }

  // --- Elements ---
  const filterBtn = document.getElementById('filter-btn');
  const filterPanel = document.getElementById('filter-panel');
  const applyFiltersBtn = document.getElementById('apply-filters');
  const parfumsContainer = document.getElementById('parfums-container');
  const searchInput = document.getElementById('search-input');
  const productCount = document.getElementById('product-count');

  let parfumsData = [];

  // --- Filter toggle ---
  if (filterBtn && filterPanel) {
    filterBtn.addEventListener('click', () => {
      filterPanel.classList.toggle('active');
    });
  }

  // --- Fetch perfumes ---
  function fetchParfums() {
    fetch('/api/parfums')
      .then(response => {
        if (!response.ok) throw new Error('Erreur lors du chargement des parfums.');
        return response.json();
      })
      .then(data => {
        parfumsData = data;
        afficherParfums(parfumsData);
      })
      .catch(err => {
        console.error(err);
        parfumsContainer.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:40px;">Impossible de charger les parfums.</p>';
      });
  }

  // --- Display perfumes ---
  function afficherParfums(parfums) {
    parfumsContainer.innerHTML = '';
    productCount.textContent = `${parfums.length} parfum${parfums.length > 1 ? 's' : ''} trouvé${parfums.length > 1 ? 's' : ''}`;

    if (parfums.length === 0) {
      parfumsContainer.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:40px;grid-column:1/-1;">Aucun parfum ne correspond à votre recherche.</p>';
      return;
    }

    parfums.forEach(parfum => {
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
        <div class="card-footer">
          <button class="add-to-cart" data-id="${parfum.id}" data-nom="${parfum.nom}" data-prix="${parfum.prix}" data-image="${parfum.image}">
            🛒 Ajouter au panier
          </button>
        </div>
      `;
      parfumsContainer.appendChild(card);
    });

    // Add-to-cart event listeners
    document.querySelectorAll('.add-to-cart').forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const data = e.currentTarget.dataset;
        ajouterAuPanier({
          id: data.id,
          nom: data.nom,
          prix: parseFloat(data.prix),
          image: data.image
        });
      });
    });
  }

  // --- Add to cart ---
  function ajouterAuPanier(parfum) {
    let panier = JSON.parse(localStorage.getItem('panier')) || [];

    if (panier.find(item => item.id === parfum.id)) {
      showToast('Ce parfum est déjà dans votre panier !', 'error');
      return;
    }

    panier.push(parfum);
    localStorage.setItem('panier', JSON.stringify(panier));
    updateCartCount();
    showToast(`${parfum.nom} ajouté au panier ✓`);
  }

  // --- Search ---
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.toLowerCase().trim();
      const filtered = parfumsData.filter(p =>
        p.nom.toLowerCase().includes(query) ||
        p.marque.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
      afficherParfums(filtered);
    });
  }

  // --- Apply filters ---
  if (applyFiltersBtn) {
    applyFiltersBtn.addEventListener('click', () => {
      const checked = document.querySelectorAll('.filter-checkbox:checked');
      const selected = Array.from(checked).map(cb => cb.value);

      let result = parfumsData;
      if (selected.length > 0) {
        result = parfumsData.filter(p => selected.includes(p.type));
      }

      // Also apply search filter if there's text
      const query = searchInput ? searchInput.value.toLowerCase().trim() : '';
      if (query) {
        result = result.filter(p =>
          p.nom.toLowerCase().includes(query) ||
          p.marque.toLowerCase().includes(query)
        );
      }

      afficherParfums(result);
    });
  }

  // --- Init ---
  fetchParfums();
});
