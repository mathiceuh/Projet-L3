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

// Route pour l'accueil (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route pour afficher la boutique (boutique.html)
app.get('/boutique', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'boutique.html'));
});

// Route API pour récupérer tous les parfums
app.get('/api/parfums', (req, res) => {
  const parfumsPath = path.join(__dirname, 'data', 'parfums.json');
  fs.readFile(parfumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON:', err);
      return res.status(500).json({ error: 'Impossible de lire les données des parfums.' });
    }
    try {
      const parfums = JSON.parse(data);
      res.json(parfums);
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      res.status(500).json({ error: 'Les données des parfums sont corrompues.' });
    }
  });
});

// Route pour récupérer un parfum par son ID
app.get('/api/parfums/:id', (req, res) => {
  const id = parseInt(req.params.id, 10); // Récupérer l'ID depuis l'URL
  const parfumsPath = path.join(__dirname, 'data', 'parfums.json');

  fs.readFile(parfumsPath, 'utf8', (err, data) => {
    if (err) {
      console.error('Erreur lors de la lecture du fichier JSON:', err);
      return res.status(500).json({ error: 'Impossible de lire les données des parfums.' });
    }
    try {
      const parfums = JSON.parse(data);
      const parfum = parfums.find(p => p.id === id); // Trouver le parfum correspondant

      if (parfum) {
        res.json(parfum); // Retourner le parfum trouvé
      } else {
        res.status(404).json({ error: "Parfum non trouvé" }); // Erreur si non trouvé
      }
    } catch (parseError) {
      console.error('Erreur de parsing JSON:', parseError);
      res.status(500).json({ error: 'Les données des parfums sont corrompues.' });
    }
  });
});

// Gestion des erreurs - 404
app.use((req, res, next) => {
  const error = new Error('Page non trouvée');
  error.status = 404;
  next(error);
});

// Middleware de gestion des erreurs
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({ message: err.message, error: err });
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});

module.exports = app;

// server.js
app.get('/boutique', async (req, res) => {
  const type = req.query.type; // Get the type from query parameters
  try {
    await client.connect();
    const database = client.db('eclat_olfactif');
    const perfumes = database.collection('perfumes');
    const query = type ? { type } : {}; // Filter by type if provided
    const allPerfumes = await perfumes.find(query).toArray();
    res.render('boutique', { perfumes: allPerfumes });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching perfumes');
  } finally {
    await client.close();
  }
});