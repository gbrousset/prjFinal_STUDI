const express = require('express');
const db = require('../config/db'); // Connexion à la base de données
const authenticateToken = require('../middleware/auth');
const router = express.Router();

// Génération de la clé de billet et QR code (Assurez-vous que ces fonctions existent)
const generateUniqueTicketKey = () => {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9); // Juste un exemple
};
const generateQRCode = (ticketKey) => {
    return `QR-${ticketKey}`; // Juste un exemple
};

// Route pour créer un billet
router.post('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; 
    const { offer_id, purchase_amount } = req.body; 

    // Vérifiez que les champs requis sont présents
    if (!offer_id) {
        return res.status(400).json({ message: 'offer_id est requis.' });
    }
    if (!purchase_amount) {
        return res.status(400).json({ message: 'purchase_amount est requis.' });
    }

    try {
        const ticketKey = generateUniqueTicketKey();
        const qrCode = generateQRCode(ticketKey); 

        // Créer le billet dans la base de données
        const result = await db.query(`
            INSERT INTO tickets (user_id, offer_id, purchase_amount, ticket_key, qr_code)
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *
        `, [userId, offer_id, purchase_amount, ticketKey, qrCode]);

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Erreur lors de la création du billet :', error);
        res.status(500).json({ message: 'Erreur lors de la création du billet.', error: error.message });
    }
});

// Route pour récupérer les billets de l'utilisateur
router.get('/', authenticateToken, async (req, res) => {
    const userId = req.user.id; 

    try {
        const result = await db.query(`
            SELECT * FROM tickets WHERE user_id = $1
        `, [userId]);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des billets :', error);
        res.status(500).json({ message: 'Erreur lors de la récupération des billets.', error: error.message });
    }
});

module.exports = router;
