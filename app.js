const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const port = 1112;

// Middleware pour analyser les corps des requêtes en JSON
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Middleware pour servir les fichiers statiques (HTML, CSS, images)
app.use(express.static(path.join(__dirname, 'public')));

// =================== 🌍 ROUTES FRONT-END ===================

// 📌 Page d'accueil
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// 📌 Page boutique
app.get('/boutique', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'boutique.html'));
});

// 📌 Page panier
app.get('/panier', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panier.html'));
});

// =================== 🛍️ ROUTES API ===================

// 📌 API pour récupérer tous les parfums (depuis JSON)
app.get('/api/parfums', (req, res) => {
  const parfumsPath = path.join(__dirname, 'data', 'parfums.json');
  fs.readFile(parfumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur de lecture JSON:', err);
      return res.status(500).json({ error: 'Impossible de lire les données.' });
    }
    try {
      const parfums = JSON.parse(data);
      res.json(parfums);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      res.status(500).json({ error: 'Données corrompues.' });
    }
  });
});

// 📌 API pour récupérer un parfum spécifique par ID
app.get('/api/parfums/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const parfumsPath = path.join(__dirname, 'data', 'parfums.json');

  fs.readFile(parfumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur de lecture JSON:', err);
      return res.status(500).json({ error: 'Impossible de lire les données.' });
    }
    try {
      const parfums = JSON.parse(data);
      const parfum = parfums.find(p => p.id === id);
      parfum ? res.json(parfum) : res.status(404).json({ error: "Parfum non trouvé" });
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      res.status(500).json({ error: 'Données corrompues.' });
    }
  });
});

// =================== ⚠️ GESTION DES ERREURS ===================

// 📌 Gestion des erreurs 404
app.use((req, res, next) => {
  res.status(404).json({ error: 'Page non trouvée' });
});

// 📌 Middleware de gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error("Erreur serveur:", err);
  res.status(err.status || 500).json({ error: err.message || "Erreur interne du serveur" });
});

// =================== 🚀 DÉMARRAGE DU SERVEUR ===================
app.listen(port, () => {
  console.log(`✅ Serveur en ligne sur http://localhost:${port}`);
});

module.exports = app;

