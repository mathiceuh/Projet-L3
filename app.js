const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, 'public')));

// =================== ROUTES FRONT-END ===================

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/boutique', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'boutique.html'));
});

app.get('/panier', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'panier.html'));
});

app.get('/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'contact.html'));
});

// =================== ROUTES API ===================

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
      console.error("Erreur lors de l'analyse du JSON :", parseError);
      res.status(500).json({ error: 'Données corrompues.' });
    }
  });
});

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
      console.error("Erreur lors de l'analyse du JSON :", parseError);
      res.status(500).json({ error: 'Données corrompues.' });
    }
  });
});

// =================== GESTION DES ERREURS ===================

app.use((req, res, next) => {
  res.status(404).json({ error: 'Page non trouvée' });
});

app.use((err, req, res, next) => {
  console.error("Erreur interne du serveur :", err);
  res.status(err.status || 500).json({ error: err.message || "Erreur interne du serveur" });
});

module.exports = app;
