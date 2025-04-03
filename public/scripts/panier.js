document.addEventListener("DOMContentLoaded", () => {
    afficherPanier(); // Charger les articles du panier

    // ✅ Bouton pour vider le panier
    document.getElementById("vider-panier").addEventListener("click", () => {
        localStorage.removeItem("panier");
        afficherPanier();
    });
});

// ✅ Fonction pour afficher le panier
function afficherPanier() {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    let panierContainer = document.getElementById("panier-container");

    if (panier.length === 0) {
        panierContainer.innerHTML = "<p>Votre panier est vide.</p>";
        return;
    }

    panierContainer.innerHTML = ""; // Effacer l'affichage précédent

    panier.forEach(parfum => {
        let item = document.createElement("div");
        item.classList.add("panier-item");
        item.innerHTML = `
            <img src="${parfum.image}" alt="${parfum.nom}" width="50">
            <p><strong>${parfum.nom}</strong> - ${parfum.prix} €</p>
            <button class="remove-item" data-id="${parfum.id}">❌</button>
        `;
        panierContainer.appendChild(item);
    });

    // ✅ Ajouter un event listener à chaque bouton "Supprimer"
    document.querySelectorAll(".remove-item").forEach(button => {
        button.addEventListener("click", (event) => {
            let parfumId = event.target.getAttribute("data-id");
            supprimerDuPanier(parfumId);
        });
    });
}

// ✅ Fonction pour supprimer un article du panier
function supprimerDuPanier(parfumId) {
    let panier = JSON.parse(localStorage.getItem("panier")) || [];
    panier = panier.filter(item => item.id !== parfumId);
    localStorage.setItem("panier", JSON.stringify(panier));

    afficherPanier();
}


    const validerBtn = document.getElementById("valider-commande");
    const notif = document.getElementById("notification");

    if (validerBtn) {
    validerBtn.addEventListener("click", () => {
        notif.style.display = "block";
        setTimeout(() => notif.style.display = "none", 3000);
    });
}

