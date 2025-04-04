document.addEventListener("DOMContentLoaded", () => {
    console.log("✅ Script chargé !");

    // Sélection des éléments HTML nécessaires
    const filterBtn = document.getElementById("filter-btn");
    const filterContainer = document.querySelector(".filter-container");
    const applyFiltersBtn = document.getElementById("apply-filters");
    const parfumsContainer = document.getElementById("parfums-container");

    let parfumsData = []; // Variable pour stocker les données des parfums récupérés depuis l'API

    // Gestion de l'ouverture et fermeture du menu de filtres avec effet visuel
    if (filterBtn && filterContainer) {
        filterBtn.addEventListener("click", () => {
            console.log("📌 Bouton Filtrer cliqué !");
            filterContainer.classList.toggle("active"); // Active ou désactive l'affichage du menu de filtres

            // Déplacement du conteneur des parfums lorsque le menu est actif
            if (filterContainer.classList.contains("active")) {
                parfumsContainer.style.marginLeft = "270px";
            } else {
                parfumsContainer.style.marginLeft = "0";
            }
        });
    }

    // Fonction pour récupérer tous les parfums depuis l'API
    function fetchParfums() {
        fetch("/api/parfums")
            .then(response => {
                if (!response.ok) throw new Error("Erreur lors du chargement des parfums.");
                return response.json();
            })
            .then(data => {
                parfumsData = data; // Stockage des données dans la variable globale
                afficherParfums(parfumsData); // Affichage initial
            })
            .catch(err => {
                console.error(err);
                parfumsContainer.innerHTML = "<p>Impossible de charger les parfums.</p>"; // Affiche un message d'erreur
            });
    }

    // Fonction pour afficher dynamiquement les parfums dans le conteneur
    function afficherParfums(parfums) {
        parfumsContainer.innerHTML = ""; // Nettoyer le contenu actuel

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

        // Ajouter un écouteur d'événement à chaque bouton "Ajouter au panier"
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

    // Fonction pour ajouter un parfum au panier local (stocké en localStorage)
    function ajouterAuPanier(parfum) {
        let panier = JSON.parse(localStorage.getItem("panier")) || []; // Récupération du panier existant ou création d'un nouveau

        // Vérifie si le parfum est déjà présent dans le panier
        let parfumExistant = panier.find(item => item.id === parfum.id);
        if (parfumExistant) {
            alert("Ce parfum est déjà dans votre panier !");
            return;
        }

        // Ajoute le nouveau parfum au panier
        panier.push(parfum);
        localStorage.setItem("panier", JSON.stringify(panier)); // Mise à jour du panier dans le localStorage

        alert(`${parfum.nom} a été ajouté au panier !`);
    }

    // Appliquer les filtres sélectionnés par l'utilisateur
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener("click", () => {
            const checkboxes = document.querySelectorAll(".filter-checkbox:checked");
            let selectedTypes = Array.from(checkboxes).map(checkbox => checkbox.value); // Liste des types sélectionnés

            console.log("Filtres sélectionnés :", selectedTypes);

            // Filtrage des parfums selon les types sélectionnés
            let parfumsFiltres = selectedTypes.length > 0
                ? parfumsData.filter(parfum => selectedTypes.includes(parfum.type))
                : parfumsData;

            afficherParfums(parfumsFiltres); // Affiche les parfums filtrés
        });
    }

    // Chargement initial des parfums au démarrage de la page
    fetchParfums();
});
