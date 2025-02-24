
// Vérifie si on est sur la page "parfum.html"
if (window.location.pathname.includes('parfum.html')) {
    // Récupérer l'ID du parfum depuis l'URL
    const urlParams = new URLSearchParams(window.location.search);
    const parfumId = urlParams.get('id');

    if (parfumId) {
        // Charger les détails du parfum via l'API
        fetch(`/api/parfums/${parfumId}`)
            .then(response => {
                if (!response.ok) throw new Error("Parfum non trouvé");
                return response.json();
            })
            .then(parfum => {
                // Mettre à jour le contenu de la page avec les détails du parfum
                document.getElementById('parfum-name').textContent = parfum.nom;

                const parfumInfo = document.getElementById('parfum-info');
                parfumInfo.innerHTML = `
                    <img src="${parfum.image}" alt="${parfum.nom}" class="parfum-details-image">
                    <p><strong>Marque :</strong> ${parfum.marque}</p>
                    <p><strong>Type :</strong> ${parfum.type}</p>
                    <p><strong>Prix :</strong> ${parfum.prix} €</p>
                    <p><strong>Description :</strong> ${parfum.description}</p>
                `;
            })
            .catch(err => {
                document.getElementById('parfum-details').innerHTML = `
                    <p>Erreur : ${err.message}</p>
                `;
            });
    } else {
        document.getElementById('parfum-details').innerHTML = `
            <p>Erreur : ID de parfum manquant dans l'URL.</p>
        `;
    }
}