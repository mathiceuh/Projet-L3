// Sélectionner la navbar
const navbar = document.querySelector('nav');

// Ajouter un événement pour écouter le défilement de la page
window.addEventListener('scroll', () => {
    if (window.scrollY > 0) {
        navbar.classList.add('scrolled'); // Ajouter la classe 'scrolled' à la navbar
    } else {
        navbar.classList.remove('scrolled'); // Retirer la classe si on est en haut de la page
    }
});

// Charger les parfums depuis l'API et afficher uniquement les classiques
fetch('/api/parfums')
    .then(response => response.json())
    .then(data => {
        const container = document.getElementById('classiques-container');

        // Filtrer les parfums avec l'attribut "classique: true"
        const classiques = data.filter(parfum => parfum.classique);

        classiques.forEach(parfum => {
            const card = document.createElement('div');
            card.classList.add('parfum-card');

            card.innerHTML = `
        <a href="/parfum.html?id=${parfum.id}" class="parfum-link">
            <img src="${parfum.image}" alt="${parfum.nom}" class="parfum-image">
            <h3>${parfum.nom}</h3>
            <p><strong>Marque :</strong> ${parfum.marque}</p>
            <p><strong>Prix :</strong> ${parfum.prix} €</p>
        </a>
    `;

            container.appendChild(card);
    });
    })
    .catch(err => console.error("Erreur lors du chargement des parfums : ", err));
