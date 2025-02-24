document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script chargé !");

    // Sélectionner les éléments HTML
    const filterBtn = document.getElementById("filter-btn");
    const filterContainer = document.querySelector(".filter-container");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const parfumsContainer = document.getElementById("parfums-container");

    let parfumsData = []; // Stocker les parfums récupérés

    // ✅ Ouvrir/Fermer le menu des filtres avec animation
    if (filterBtn && filterContainer) {
        filterBtn.addEventListener("click", () => {
            console.log("📌 Bouton Filtrer cliqué !");
            filterContainer.classList.toggle("active"); // Ajoute/enlève la classe active

            // Décaler les parfums quand le menu est ouvert
            if (filterContainer.classList.contains("active")) {
                parfumsContainer.style.marginLeft = "270px"; // Décale les parfums
            } else {
                parfumsContainer.style.marginLeft = "0"; // Remet en place si fermé
            }
        });
    }

    // ✅ Charger tous les parfums depuis l'API
    function fetchParfums() {
        fetch("/api/parfums")
            .then(response => {
                if (!response.ok) throw new Error("⚠️ Erreur lors du chargement des parfums.");
                return response.json();
            })
            .then(data => {
                parfumsData = data;
                afficherParfums(parfumsData);
            })
            .catch(err => {
                console.error(err);
                parfumsContainer.innerHTML = "<p>⚠️ Impossible de charger les parfums.</p>";
            });
    }

    // ✅ Fonction pour afficher les parfums
    function afficherParfums(parfums) {
        parfumsContainer.innerHTML = ""; // Effacer l'affichage actuel

        if (parfums.length === 0) {
            parfumsContainer.innerHTML = "<p>Aucun parfum trouvé.</p>";
            return;
        }

        parfums.forEach(parfum => {
            const card = document.createElement("div");
            card.classList.add("parfum-card");
            card.innerHTML = `
                <a href="/parfum.html?id=${parfum.id}" class="parfum-link">
                    <img src="${parfum.image}" alt="${parfum.nom}" class="parfum-image">
                    <h3>${parfum.nom}</h3>
                    <p><strong>Marque :</strong> ${parfum.marque}</p>
                    <p><strong>Prix :</strong> ${parfum.prix} €</p>
                </a>
                <button class="add-to-cart" data-id="${parfum.id}" data-nom="${parfum.nom}" data-prix="${parfum.prix}" data-image="${parfum.image}">🛒 Ajouter au panier</button>
            `;
            parfumsContainer.appendChild(card);
        });

        // ✅ Ajouter un event listener à chaque bouton "Ajouter au panier"
        document.querySelectorAll(".add-to-cart").forEach(button => {
            button.addEventListener("click", (event) => {
                const parfumId = event.target.getAttribute("data-id");
                const parfumNom = event.target.getAttribute("data-nom");
                const parfumPrix = event.target.getAttribute("data-prix");
                const parfumImage = event.target.getAttribute("data-image");

                ajouterAuPanier({ id: parfumId, nom: parfumNom, prix: parseFloat(parfumPrix), image: parfumImage });
            });
        });
    }

    // ✅ Fonction pour ajouter un parfum au panier
    function ajouterAuPanier(parfum) {
        let panier = JSON.parse(localStorage.getItem("panier")) || []; // Récupérer le panier actuel

        // Vérifier si le parfum est déjà dans le panier
        let parfumExistant = panier.find(item => item.id === parfum.id);
        if (parfumExistant) {
            alert("✅ Ce parfum est déjà dans votre panier !");
            return;
        }

        // Ajouter le parfum au panier
        panier.push(parfum);
        localStorage.setItem("panier", JSON.stringify(panier));

        alert(`🛒 ${parfum.nom} a été ajouté au panier !`);
    }

    // ✅ Appliquer les filtres sélectionnés
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".filter-checkbox:checked");
            let selectedTypes = Array.from(checkboxes).map(checkbox => checkbox.value);

            console.log("🛠️ Filtres sélectionnés :", selectedTypes);

            let parfumsFiltres = selectedTypes.length > 0
                ? parfumsData.filter(parfum => selectedTypes.includes(parfum.type))
                : parfumsData;

            afficherParfums(parfumsFiltres);
        });
    }

    // ✅ Chargement des parfums au démarrage
    fetchParfums();
});
