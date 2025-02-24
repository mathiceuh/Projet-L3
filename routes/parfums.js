const express = require('express');
const router = express.Router();
const parfumModel = require('../models/parfumModel');

// Route GET pour récupérer tous les parfums
router.get('/', (req, res) => {
    try {
        const parfums = parfumModel.getParfums();
        res.json(parfums);
    } catch (err) {
        console.error("Erreur lors de la récupération des parfums:", err);
        res.status(500).json({ message: "Erreur interne du serveur", error: err.message });
    }
});

module.exports = router;
