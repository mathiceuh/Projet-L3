const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 1112;

// Middleware pour analyser les requêtes contenant des données JSON ou des formulaires
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware pour servir les fichiers statiques (HTML, CSS, images, JS)
app.use(express.static(path.join(__dirname, 'public')));

// =================== ROUTES FRONT-END ===================

// Route pour la page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Route pour la page de la boutique
app.get('/boutique', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'boutique.html'));
});

// Route pour la page du panier
app.get('/panier', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panier.html'));
});

// =================== ROUTES API ===================

// Route pour obtenir la liste de tous les parfums (lecture depuis un fichier JSON)
app.get('/api/parfums', (req, res) => {
  const parfumsPath = path.join(__dirname, 'data', 'parfums.json');
  fs.readFile(parfumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      return res.status(500).json({ error: 'Impossible de lire les données.' });
    }
    try {
      const parfums = JSON.parse(data);
      res.json(parfums);
    } catch (parseError) {
      console.error('Erreur lors de l’analyse du JSON :', parseError);
      res.status(500).json({ error: 'Données corrompues.' });
    }
  });
});

// Route pour obtenir un parfum spécifique via son identifiant
app.get('/api/parfums/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parfumsPath = path.join(__dirname, 'data', 'parfums.json');

  fs.readFile(parfumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON :', err);
      return res.status(500).json({ error: 'Impossible de lire les données.' });
    }
    try {
      const parfums = JSON.parse(data);
      const parfum = parfums.find(p => p.id === id);
      if (parfum) {
        res.json(parfum);
      } else {
        res.status(404).json({ error: "Parfum non trouvé" });
      }
    } catch (parseError) {
      console.error('Erreur lors de l’analyse du JSON :', parseError);
      res.status(500).json({ error: 'Données corrompues.' });
    }
  });
});

// =================== GESTION DES ERREURS ===================

// Middleware pour gérer les routes inexistantes (erreur 404)
app.use((req, res, next) => {
  res.status(404).json({ error: 'Page non trouvée' });
});

// Middleware pour gérer les erreurs serveur de manière centralisée
app.use((err, req, res, next) => {
  console.error("Erreur interne du serveur :", err);
  res.status(err.status || 500).json({ error: err.message || "Erreur interne du serveur" });
});

// =================== DÉMARRAGE DU SERVEUR ===================
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});

module.exports = app;
