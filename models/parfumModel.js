const fs = require('fs');
const path = require('path');

// Chemin vers le fichier JSON
const parfumsPath = path.join(__dirname, '../data/parfums.json');

// Fonction pour récupérer les parfums
function getParfums() {
    try {
        // Vérifier si le fichier existe
        console.log(`Vérification du fichier: ${parfumsPath}`);
        if (!fs.existsSync(parfumsPath)) {
            throw new Error('Le fichier de parfums est introuvable');
        }

        const parfumsData = fs.readFileSync(parfumsPath, 'utf8');
        console.log('Fichier JSON lu avec succès');

        // Vérifier si le JSON est valide
        try {
            const parfums = JSON.parse(parfumsData);
            console.log('Parfums:', parfums);
            return parfums;
        } catch (err) {
            throw new Error('Erreur lors de l\'analyse du JSON');
        }
    } catch (err) {
        console.error("Erreur lors de la lecture du fichier JSON:", err);
        throw new Error("Erreur lors de la récupération des parfums.");
    }
}

module.exports = { getParfums };
